// Renders /platform/film frame by frame into an MP4 with the synthesized score.
// The page exposes window.__seek(t), which sets the film clock and pins every
// CSS animation and SMIL timeline to it, so each frame is deterministic.
//
//   FILM_TOOLS=<dir with puppeteer-core + ffmpeg-static> \
//   node scripts/film/render.mjs <16x9|9x16> <out.mp4> <score.wav> [baseUrl]
//
// The tools are kept out of package.json on purpose (ffmpeg is ~80 MB).
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const tools = process.env.FILM_TOOLS;
if (!tools) throw new Error("set FILM_TOOLS to a folder with puppeteer-core and ffmpeg-static installed");
const require = createRequire(path.join(tools, "noop.js"));
const puppeteer = require("puppeteer-core");
const ffmpeg = require("ffmpeg-static");

const [, , ar = "16x9", out = "film.mp4", wav = "score.wav", base = "http://localhost:3100"] = process.argv;
const FPS = 30;
const browserPath = process.env.FILM_BROWSER ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const view = ar === "9x16" ? { width: 540, height: 960, deviceScaleFactor: 2 } : { width: 1920, height: 1080, deviceScaleFactor: 1 };

const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args: ["--hide-scrollbars", "--force-color-profile=srgb"] });
const page = await browser.newPage();
await page.setViewport(view);
page.on("pageerror", (e) => console.error("page error:", e.message));
await page.goto(`${base}/platform/film?ar=${ar}`, { waitUntil: "networkidle0", timeout: 120000 });
await page.waitForFunction(() => typeof window.__seek === "function");
await page.evaluate(() => document.fonts.ready);
const duration = await page.evaluate(() => window.__duration);
const frames = Math.round(duration * FPS);

const enc = spawn(
  ffmpeg,
  [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-i", wav,
    "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-maxrate", "2400k", "-bufsize", "4800k",
    "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart",
    "-c:a", "aac", "-b:a", "160k",
    "-shortest", out,
  ],
  { stdio: ["pipe", "inherit", "inherit"] },
);

const started = Date.now();
for (let f = 0; f < frames; f++) {
  await page.evaluate((s) => window.__seek(s), f / FPS);
  const jpg = await page.screenshot({ type: "jpeg", quality: 92, optimizeForSpeed: true });
  if (!enc.stdin.write(jpg)) await new Promise((r) => enc.stdin.once("drain", r));
  if (f % 150 === 0) {
    const el = (Date.now() - started) / 1000;
    console.log(`${ar} frame ${f}/${frames} · ${el.toFixed(0)}s elapsed · ~${((el / (f + 1)) * (frames - f)).toFixed(0)}s left`);
  }
}
enc.stdin.end();
await new Promise((r, j) => enc.on("close", (c) => (c === 0 ? r() : j(new Error(`ffmpeg exited ${c}`)))));
await browser.close();
console.log(`done: ${out} in ${((Date.now() - started) / 1000).toFixed(0)}s`);
