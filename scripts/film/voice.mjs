// Voices the site cut of "Aan's debut" with the Windows speech voices:
// Aan (David, pitched down) word by word on the stamps, his wife (Zira) on the
// twist. Each clip is trimmed and, if needed, sped up to fit its slot.
//
//   FILM_TOOLS=<dir with ffmpeg-static> node scripts/film/voice.mjs <outDir>
// Writes <outDir>/NN.wav (48 kHz mono) and <outDir>/voice.json [{ t, file }].
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { DEBUT_VOICE } from "../../components/film/debut-timeline.ts";

const tools = process.env.FILM_TOOLS;
if (!tools) throw new Error("set FILM_TOOLS to a folder with ffmpeg-static installed");
const ffmpeg = createRequire(path.join(tools, "noop.js"))("ffmpeg-static");
const out = path.resolve(process.argv[2] ?? "voice");
fs.mkdirSync(out, { recursive: true });

// 1. raw speech, one file per line, in a single PowerShell session
const jobs = DEBUT_VOICE.map((v, i) => ({ ...v, raw: path.join(out, `raw-${String(i).padStart(2, "0")}.wav`) }));
const ps = [
  "Add-Type -AssemblyName System.Speech",
  "$s = New-Object System.Speech.Synthesis.SpeechSynthesizer",
  ...jobs.map((j) =>
    [
      `$s.SelectVoice('${j.voice === "aan" ? "Microsoft David Desktop" : "Microsoft Zira Desktop"}')`,
      `$s.Rate = ${j.voice === "aan" ? 1 : 1}`,
      `$s.SetOutputToWaveFile('${j.raw.replace(/'/g, "''")}')`,
      `$s.Speak('${j.text.replace(/'/g, "''")}')`,
    ].join("; "),
  ),
  "$s.SetOutputToNull(); $s.Dispose()",
].join("\n");
const psFile = path.join(out, "speak.ps1");
fs.writeFileSync(psFile, ps);
execFileSync("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", psFile], { stdio: "inherit" });

// 2. trim silence, colour the voice, fit the slot
const probe = (file) => {
  const r = execFileSync(ffmpeg, ["-nostdin", "-i", file, "-f", "null", "-"], { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" }).toString();
  return r;
};
const durationOf = (file) => {
  try {
    probe(file);
  } catch (e) {
    const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(String(e.stderr ?? e));
    if (m) return +m[1] * 3600 + +m[2] * 60 + +m[3];
  }
  const st = fs.statSync(file).size;
  return (st - 44) / (48000 * 2);
};

const trim = "silenceremove=start_periods=1:start_threshold=-42dB,areverse,silenceremove=start_periods=1:start_threshold=-42dB,areverse";
const colour = {
  aan: "asetrate=22050*0.86,aresample=48000,equalizer=f=180:t=q:w=1:g=4,aecho=0.8:0.6:38:0.18",
  wife: "aresample=48000,aecho=0.8:0.5:22:0.12",
};
const manifest = [];
jobs.forEach((j, i) => {
  const mid = path.join(out, `mid-${String(i).padStart(2, "0")}.wav`);
  const fin = path.join(out, `${String(i).padStart(2, "0")}.wav`);
  execFileSync(ffmpeg, ["-nostdin", "-y", "-loglevel", "error", "-i", j.raw, "-af", `${trim},${colour[j.voice]}`, "-ac", "1", "-ar", "48000", mid]);
  const d = durationOf(mid);
  const slot = Math.max(0.12, j.until - j.t) * 0.96;
  const tempo = Math.min(2, Math.max(1, d / slot));
  execFileSync(ffmpeg, ["-nostdin", "-y", "-loglevel", "error", "-i", mid, "-af", `atempo=${tempo.toFixed(3)}`, "-ac", "1", "-ar", "48000", "-c:a", "pcm_s16le", fin]);
  manifest.push({ t: j.t, file: fin, voice: j.voice, text: j.text });
  fs.rmSync(mid);
  fs.rmSync(j.raw);
});
fs.rmSync(psFile);
fs.writeFileSync(path.join(out, "voice.json"), JSON.stringify(manifest, null, 2));
console.log(`voice: ${manifest.length} clips → ${out}`);
