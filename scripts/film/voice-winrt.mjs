// Voices "Aan's debut" with the modern Windows speech engine (WinRT
// SpeechSynthesizer, through Windows PowerShell 5.1). Each line is spoken as
// one natural sentence, softened with SSML prosody (a little slower, a little
// lower; no pitch-shifting afterwards), and the engine's word-boundary cues say
// exactly when each word lands, on the audio's own clock.
//
//   node scripts/film/voice-winrt.mjs sample <outDir>
//     → <outDir>/sample-mark.wav and sample-ravi.wav: the same ~10 s of the
//       script in Microsoft Mark and Microsoft Ravi, to choose by ear.
//   FILM_TOOLS=<dir with ffmpeg-static> node scripts/film/voice-winrt.mjs film <outDir> [Mark|Ravi]
//     → <outDir>/<line>.wav + voice.json, and each line's length and word
//       times in components/film/debut-voice.json. The film's cuts are laid
//       out from those lengths (debut-timeline.ts), so the voice keeps its
//       own pace: no speed-up, no pitch change, just trimmed silence and a
//       light clean-up.
//
// The name is written plainly as "Aan": the engine says it as one syllable
// (like "on"). Spelling it "Ahn" made it read the letters A-H-N.
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [, , mode = "sample", outArg = "voice", who = "Mark"] = process.argv;
const out = path.resolve(outArg);
fs.mkdirSync(out, { recursive: true });

// softer than stock: about 5% slower and a touch lower
const PROSODY = { rate: "-6%", pitch: "-4%" };

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** SSML for one line, plus where each spoken token starts in it */
function ssml(voice, tokens) {
  const head = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="Microsoft ${voice}"><prosody rate="${PROSODY.rate}" pitch="${PROSODY.pitch}">`;
  let body = "";
  const at = [];
  for (const tok of tokens) {
    if (body) body += " ";
    at.push(head.length + body.length);
    body += esc(tok);
  }
  return { text: `${head}${body}</prosody></voice></speak>`, at };
}

/** speak each job through WinRT; returns [{ id, file, cues: [{ pos, ms }] }] */
function speak(jobs) {
  const ps = [
    `$ErrorActionPreference = 'Stop'`,
    `Add-Type -AssemblyName System.Runtime.WindowsRuntime`,
    `$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation\`1' })[0]`,
    `function Await($op, [Type]$t) { $task = $asTask.MakeGenericMethod($t).Invoke($null, @($op)); $task.Wait(-1) | Out-Null; $task.Result }`,
    `[Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime] | Out-Null`,
    `[Windows.Storage.Streams.DataReader, Windows.Storage.Streams, ContentType = WindowsRuntime] | Out-Null`,
    `$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer`,
    `$synth.Options.IncludeWordBoundaryMetadata = $true`,
    `function Say([string]$id, [string]$voice, [string]$text, [string]$file) {`,
    `  $synth.Voice = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | Where-Object { $_.DisplayName -eq $voice } | Select-Object -First 1`,
    `  $stream = Await ($synth.SynthesizeSsmlToStreamAsync($text)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])`,
    `  $cues = @()`,
    `  foreach ($track in $stream.TimedMetadataTracks) { foreach ($cue in $track.Cues) { $cues += ('' + $cue.StartPositionInInput + ':' + $cue.StartTime.TotalMilliseconds) } }`,
    `  $size = [uint32]$stream.Size`,
    `  $reader = New-Object Windows.Storage.Streams.DataReader($stream.GetInputStreamAt(0))`,
    `  Await ($reader.LoadAsync($size)) ([uint32]) | Out-Null`,
    `  $bytes = New-Object byte[] $size; $reader.ReadBytes($bytes); [IO.File]::WriteAllBytes($file, $bytes)`,
    `  Write-Output ($id + '|' + ($cues -join ';'))`,
    `}`,
    ...jobs.map((j) => `Say '${j.id}' 'Microsoft ${j.voice}' '${j.text.replace(/'/g, "''")}' '${j.file.replace(/'/g, "''")}'`),
  ].join("\n");
  const psFile = path.join(out, "speak.ps1");
  fs.writeFileSync(psFile, "﻿" + ps, "utf8");
  const res = execFileSync("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", psFile], { encoding: "utf8" });
  fs.rmSync(psFile);
  const rows = Object.fromEntries(
    res
      .trim()
      .split(/\r?\n/)
      .filter((r) => r.includes("|"))
      .map((r) => {
        const [id, list] = r.split("|");
        return [id, list.split(";").filter(Boolean).map((p) => p.split(":").map(Number)).map(([pos, ms]) => ({ pos, ms }))];
      }),
  );
  return jobs.map((j) => ({ ...j, cues: rows[j.id] ?? [] }));
}

/** seconds of audio in a PCM wav (reads the header, skips to the data chunk) */
function wavSeconds(file) {
  const b = fs.readFileSync(file);
  const rate = b.readUInt32LE(24);
  const block = b.readUInt16LE(32);
  let p = 12;
  while (p < b.length - 8) {
    const id = b.toString("ascii", p, p + 4);
    const size = b.readUInt32LE(p + 4);
    if (id === "data") return size / block / rate;
    p += 8 + size;
  }
  return 0;
}

if (mode === "sample") {
  const words = "This is a message to all e-commerce sellers. My name is Aan. I'm your twenty-four seven account manager, and I'm here to help you grow.".split(" ");
  const jobs = ["Mark", "Ravi"].map((voice) => {
    const { text } = ssml(voice, words);
    return { id: voice.toLowerCase(), voice, text, file: path.join(out, `sample-${voice.toLowerCase()}.wav`) };
  });
  for (const j of speak(jobs)) {
    const nameCue = j.cues.find((c) => /Aan/.test(j.text.slice(c.pos, c.pos + 4)));
    console.log(`${j.voice}: ${wavSeconds(j.file).toFixed(1)}s, ${j.cues.length} word cues${nameCue ? `, "Aan" at ${(nameCue.ms / 1000).toFixed(2)}s` : ""} → ${j.file}`);
  }
} else {
  const tools = process.env.FILM_TOOLS;
  if (!tools) throw new Error("set FILM_TOOLS to a folder with ffmpeg-static installed");
  const ffmpeg = createRequire(path.join(tools, "noop.js"))("ffmpeg-static");
  const { DEBUT_VO } = await import("../../components/film/debut-timeline.ts");
  const voice = who === "Ravi" ? "Ravi" : "Mark";
  const jobs = DEBUT_VO.map((l) => {
    const spoken = l.tokens.map((t) => t.say ?? t.show);
    const { text, at } = ssml(voice, spoken);
    return { id: l.id, voice, text, at, file: path.join(out, `raw-${l.id}.wav`) };
  });
  const timings = { voice };
  const manifest = [];
  for (const j of speak(jobs)) {
    // start just before the first word; trim the tail; a light warm-up and
    // gentle compression, nothing that changes pace or pitch
    const lead = Math.max(0, (j.cues[0]?.ms ?? 0) / 1000 - 0.04);
    const fin = path.join(out, `${j.id}.wav`);
    execFileSync(ffmpeg, [
      "-nostdin", "-y", "-loglevel", "error", "-ss", lead.toFixed(3), "-i", j.file,
      "-af", "areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,highpass=f=70,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3000:t=q:w=1.2:g=1,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=160",
      "-ac", "1", "-ar", "48000", "-c:a", "pcm_s16le", fin,
    ]);
    fs.rmSync(j.file);
    const words = j.at.map((pos, i) => {
      const next = j.at[i + 1] ?? Infinity;
      const cue = j.cues.find((c) => c.pos >= pos && c.pos < next);
      return cue ? +Math.max(0, cue.ms / 1000 - lead).toFixed(3) : null;
    });
    const length = +wavSeconds(fin).toFixed(3);
    timings[j.id] = { length, words };
    manifest.push({ id: j.id, file: fin, length });
  }
  const timingsFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../components/film/debut-voice.json");
  fs.writeFileSync(path.join(out, "voice.json"), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(timingsFile, JSON.stringify(timings, null, 2) + "\n");
  for (const m of manifest) console.log(`${m.id.padEnd(6)} ${m.length.toFixed(2)}s  ${timings[m.id].words.filter((w) => w === null).length} words untimed`);
}
