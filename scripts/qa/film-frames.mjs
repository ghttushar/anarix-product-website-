// Golden frames for the film routes, so site changes can be proven not to
// touch the films. Captures every `--step` seconds via window.__seek, or
// compares a fresh capture against a saved set.
//
//   FILM_TOOLS=<dir with puppeteer-core> node scripts/qa/film-frames.mjs capture <dir> [--base http://localhost:3000]
//   FILM_TOOLS=... node scripts/qa/film-frames.mjs compare <goldenDir> <newDir>
//
// compare prints the mean absolute pixel error per frame (0–255 scale) and
// exits 1 when any frame's error exceeds --max (default 1.0).
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const [, , mode, a, b, ...rest] = process.argv;
const opt = Object.fromEntries(rest.reduce((acc, x, i, all) => (x.startsWith("--") ? [...acc, [x.slice(2), all[i + 1]]] : acc), []));
const tools = process.env.FILM_TOOLS;
if (!tools) throw new Error("set FILM_TOOLS to a folder with puppeteer-core installed");
const puppeteer = createRequire(path.join(tools, "noop.js"))("puppeteer-core");
const browserPath = process.env.FILM_BROWSER ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const base = opt.base ?? "http://localhost:3000";
const step = Number(opt.step ?? 2);

const cuts = [
  { name: "film-16x9", url: "/platform/film?ar=16x9", view: { width: 1920, height: 1080, deviceScaleFactor: 0.5 } },
  { name: "film-9x16", url: "/platform/film?ar=9x16", view: { width: 540, height: 960, deviceScaleFactor: 1 } },
  { name: "debut", url: "/platform/film/debut", view: { width: 540, height: 960, deviceScaleFactor: 1 } },
];

const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args: ["--hide-scrollbars"] });

if (mode === "capture") {
  for (const cut of cuts) {
    const page = await browser.newPage();
    await page.setViewport(cut.view);
    await page.goto(base + cut.url, { waitUntil: "networkidle0", timeout: 120000 });
    await page.waitForFunction(() => typeof window.__seek === "function");
    await page.evaluate(() => document.fonts.ready);
    const dur = await page.evaluate(() => window.__duration);
    const dir = path.join(a, cut.name);
    fs.mkdirSync(dir, { recursive: true });
    for (let t = 0; t < dur; t += step) {
      await page.evaluate((s) => window.__seek(s), t);
      await page.screenshot({ path: path.join(dir, `${String(t.toFixed(1)).padStart(5, "0")}.png`), type: "png" });
    }
    console.log(`${cut.name}: ${Math.ceil(dur / step)} frames`);
    await page.close();
  }
} else if (mode === "compare") {
  const page = await browser.newPage();
  const max = Number(opt.max ?? 1.0);
  let worst = 0;
  let fails = 0;
  for (const cut of cuts) {
    const files = fs.readdirSync(path.join(a, cut.name)).filter((f) => f.endsWith(".png"));
    for (const f of files) {
      const A = fs.readFileSync(path.join(a, cut.name, f)).toString("base64");
      const Bp = path.join(b, cut.name, f);
      if (!fs.existsSync(Bp)) {
        console.log(`MISSING ${cut.name}/${f}`);
        fails++;
        continue;
      }
      const B = fs.readFileSync(Bp).toString("base64");
      const err = await page.evaluate(async (x, y) => {
        const load = (src) => new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.src = `data:image/png;base64,${src}`; });
        const [ia, ib] = await Promise.all([load(x), load(y)]);
        if (ia.width !== ib.width || ia.height !== ib.height) return 255;
        const c = document.createElement("canvas");
        c.width = ia.width;
        c.height = ia.height;
        const g = c.getContext("2d");
        g.drawImage(ia, 0, 0);
        const da = g.getImageData(0, 0, c.width, c.height).data;
        g.clearRect(0, 0, c.width, c.height);
        g.drawImage(ib, 0, 0);
        const db = g.getImageData(0, 0, c.width, c.height).data;
        let sum = 0;
        for (let i = 0; i < da.length; i += 4) sum += Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]);
        return sum / ((da.length / 4) * 3);
      }, A, B);
      worst = Math.max(worst, err);
      if (err > max) {
        fails++;
        console.log(`DIFF ${cut.name}/${f}: mean error ${err.toFixed(2)}`);
      }
    }
  }
  console.log(`worst mean error ${worst.toFixed(3)} (limit ${max}); ${fails} frame(s) over`);
  await browser.close();
  process.exit(fails ? 1 : 0);
}
await browser.close();
