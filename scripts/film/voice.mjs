// Voices "Aan's debut" with the Windows speech engine: each line is spoken as
// one natural sentence (Microsoft David, warmed and slightly lowered), and the
// engine's word events tell us when every word lands. Those times go to
// components/film/debut-voice.json so the stamped words follow the voice.
//
//   FILM_TOOLS=<dir with ffmpeg-static> node scripts/film/voice.mjs <outDir>
// Writes <outDir>/<id>.wav (48 kHz mono), <outDir>/voice.json and the timings.
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEBUT_VO } from "../../components/film/debut-timeline.ts";

const tools = process.env.FILM_TOOLS;
if (!tools) throw new Error("set FILM_TOOLS to a folder with ffmpeg-static installed");
const ffmpeg = createRequire(path.join(tools, "noop.js"))("ffmpeg-static");
const out = path.resolve(process.argv[2] ?? "voice");
const timingsFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../components/film/debut-voice.json");
fs.mkdirSync(out, { recursive: true });

const PITCH = 0.95; // a touch lower and warmer than stock David
const RATE = 0; // the engine reports word times at its default rate, so pace is set below
const BRISK = 1.22; // baseline speed-up (ffmpeg atempo keeps the pitch)

const lines = DEBUT_VO.map((l) => {
  let text = "";
  const offsets = l.tokens.map((tok) => {
    const at = text.length;
    text += (text ? " " : "") + (tok.say ?? tok.show);
    return at + (at ? 1 : 0);
  });
  return { ...l, text, offsets, raw: path.join(out, `raw-${l.id}.wav`) };
});

// 1. speak each line; a tiny C# helper collects the word events on any thread
const cs = `
using System; using System.Text; using System.Speech.Synthesis; using System.Speech.AudioFormat;
public static class Vo {
  public static string Speak(string voice, int rate, string text, string file) {
    var s = new SpeechSynthesizer(); s.SelectVoice(voice); s.Rate = rate;
    var sb = new StringBuilder();
    s.SpeakProgress += (o, e) => { lock (sb) { sb.Append(e.CharacterPosition).Append(':').Append(e.AudioPosition.TotalMilliseconds).Append(';'); } };
    s.SetOutputToWaveFile(file, new SpeechAudioFormatInfo(22050, AudioBitsPerSample.Sixteen, AudioChannel.Mono));
    s.Speak(text); s.SetOutputToNull(); s.Dispose();
    return sb.ToString();
  }
}`;
const ps = [
  `Add-Type -ReferencedAssemblies System.Speech -TypeDefinition @'\n${cs}\n'@`,
  ...lines.map((l) => `Write-Output ('${l.id}|' + [Vo]::Speak('Microsoft David Desktop', ${RATE}, '${l.text.replace(/'/g, "''")}', '${l.raw.replace(/'/g, "''")}'))`),
].join("\n");
const psFile = path.join(out, "speak.ps1");
fs.writeFileSync(psFile, ps);
const events = Object.fromEntries(
  execFileSync("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", psFile], { encoding: "utf8" })
    .trim()
    .split(/\r?\n/)
    .map((row) => {
      const [id, list] = row.split("|");
      return [id, list.split(";").filter(Boolean).map((p) => p.split(":").map(Number))];
    }),
);

// 2. colour the voice, fit each line to its slot, map word events to tokens
const lengthOf = (file) => (fs.statSync(file).size - 44) / (48000 * 2);
const timings = {};
const manifest = [];
for (const l of lines) {
  const mid = path.join(out, `mid-${l.id}.wav`);
  const fin = path.join(out, `${l.id}.wav`);
  execFileSync(ffmpeg, [
    "-nostdin", "-y", "-loglevel", "error", "-i", l.raw,
    "-af", `areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,asetrate=22050*${PITCH},aresample=48000,highpass=f=70,equalizer=f=160:t=q:w=1:g=3,equalizer=f=3200:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,aecho=0.85:0.5:42:0.14`,
    "-ac", "1", "-ar", "48000", "-c:a", "pcm_s16le", mid,
  ]);
  const len = lengthOf(mid);
  const tempo = Math.min(1.5, Math.max(BRISK, len / (l.until - l.t)));
  execFileSync(ffmpeg, ["-nostdin", "-y", "-loglevel", "error", "-i", mid, "-af", `atempo=${tempo.toFixed(3)}`, "-ac", "1", "-ar", "48000", "-c:a", "pcm_s16le", fin]);
  fs.rmSync(mid);
  fs.rmSync(l.raw);
  const scale = 1 / PITCH / tempo;
  timings[l.id] = l.offsets.map((off, i) => {
    const next = l.offsets[i + 1] ?? Infinity;
    const ev = events[l.id].find(([pos]) => pos >= off && pos < next);
    // SAPI reports AudioPosition against a 16 kHz clock while writing 22.05 kHz audio
    return ev ? +(l.t + (ev[1] / 1000) * (16000 / 22050) * scale).toFixed(3) : null;
  });
  manifest.push({ id: l.id, t: l.t, file: fin, length: +(len / tempo).toFixed(2), tempo: +tempo.toFixed(3) });
}
fs.rmSync(psFile);
fs.writeFileSync(path.join(out, "voice.json"), JSON.stringify(manifest, null, 2));
fs.writeFileSync(timingsFile, JSON.stringify(timings, null, 2) + "\n");
for (const m of manifest) console.log(`${m.id.padEnd(6)} ${m.t.toFixed(2)}s  ${m.length}s  x${m.tempo}`);
