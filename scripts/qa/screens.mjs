// One-screen QA: loads each route at each viewport in headless Edge, scrolls
// every screen to the top of the viewport, lets motion settle, checks it with
// fit-check.js and saves a screenshot.
//
//   FILM_TOOLS=<dir with puppeteer-core> node scripts/qa/screens.mjs \
//     [--base http://localhost:3000] [--routes /platform,/platform/signals] \
//     [--viewports 1280x720,1366x768,1440x900,1920x1080,390x844] \
//     [--reduced] [--out qa-out/<name>] [--audit]
//
// Exits 1 when any check fails (unless --audit, which only reports).
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : true]);
    return acc;
  }, []),
);
const tools = process.env.FILM_TOOLS;
if (!tools) throw new Error("set FILM_TOOLS to a folder with puppeteer-core installed");
const puppeteer = createRequire(path.join(tools, "noop.js"))("puppeteer-core");

const base = args.base ?? "http://localhost:3000";
const routes = String(args.routes ?? "/platform").split(",");
const viewports = String(args.viewports ?? "1280x720,1366x768,1440x900,1920x1080,390x844")
  .split(",")
  .map((v) => v.split("x").map(Number));
const out = path.resolve(String(args.out ?? "qa-out/latest"));
const reduced = Boolean(args.reduced);
const fitScript = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "fit-check.js"), "utf8");
const browserPath = process.env.FILM_BROWSER ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args: ["--hide-scrollbars"] });
const report = [];
let failures = 0;

for (const route of routes) {
  for (const [w, h] of viewports) {
    const page = await browser.newPage();
    const consoleIssues = [];
    page.on("console", (m) => ["error", "warning"].includes(m.type()) && consoleIssues.push(`${m.type()}: ${m.text().slice(0, 160)}`));
    page.on("pageerror", (e) => consoleIssues.push(`pageerror: ${e.message.slice(0, 160)}`));
    // a media element cancelling its own range request is normal streaming, not a failure
    page.on("requestfailed", (r) => {
      if (r.resourceType() === "media" && /ERR_ABORTED/.test(r.failure()?.errorText ?? "")) return;
      consoleIssues.push(`request failed: ${r.url()}`);
    });
    page.on("response", (r) => r.status() >= 400 && consoleIssues.push(`HTTP ${r.status()}: ${r.url()}`));
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 768, hasTouch: w < 768 });
    if (reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.goto(base + route, { waitUntil: "networkidle0", timeout: 120000 });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(fitScript);

    const dir = path.join(out, route.replace(/^\//, "").replace(/\//g, "_") || "root", `${w}x${h}${reduced ? "-reduced" : ""}`);
    fs.mkdirSync(dir, { recursive: true });
    const screens = await page.evaluate(() => window.__fit.list());
    const rows = [];
    for (const s of screens) {
      // a pinned story is checked at each chapter; every other screen once
      const issues = [];
      for (const [k, top] of s.stops.entries()) {
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
        await new Promise((r) => setTimeout(r, k ? 900 : 1600)); // let entrances, docking and draw-ons settle
        await page.evaluate(() => document.getAnimations().forEach((a) => { try { if (a.effect?.getComputedTiming().iterations !== Infinity) a.finish(); } catch {} }));
        const found = await page.evaluate((i) => window.__fit.check(i), s.i);
        issues.push(...found.map((f) => (s.stops.length > 1 ? `ch${k + 1}: ${f}` : f)));
        const name = `${String(s.i).padStart(2, "0")}-${s.id}${s.stops.length > 1 ? `-ch${k + 1}` : ""}.jpg`;
        await page.screenshot({ path: path.join(dir, name.replace(/[^\w.-]/g, "_")), type: "jpeg", quality: 80 });
      }
      rows.push({ ...s, screens: +(s.h / h).toFixed(2), issues });
      failures += issues.length;
    }
    const pageIssues = [...(await page.evaluate(() => window.__fit.page())), ...consoleIssues];
    failures += pageIssues.length;
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    report.push({ route, viewport: `${w}x${h}`, reduced, totalScreens: +(total / h).toFixed(1), screens: rows, pageIssues });
    await page.close();
  }
}
await browser.close();

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2));
for (const r of report) {
  console.log(`\n${r.route} @ ${r.viewport}${r.reduced ? " (reduced motion)" : ""}: ${r.totalScreens} screens tall`);
  for (const s of r.screens) console.log(`  ${s.issues.length ? "FAIL" : "ok  "} ${String(s.id).padEnd(16)} ${String(s.screens).padStart(5)} screens  ${s.issues.join("; ")}`);
  for (const p of r.pageIssues) console.log(`  FAIL page: ${p}`);
}
console.log(`\n${failures} issue(s). Screenshots and report.json in ${out}`);
if (failures && !args.audit) process.exit(1);
