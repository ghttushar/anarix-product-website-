// Soundtrack for the site cut of "Aan's debut": an original synthesized bed
// that hits on the trend's cuts, with Aan's voice (scripts/film/voice.mjs)
// on top. The Instagram cut ships silent and takes the trend sound in-app.
//
//   node scripts/film/debut-score.mjs <voiceDir> <out.wav>
import fs from "node:fs";
import path from "node:path";
import { BAND_ENTRIES, BAND_FLASHES, DEBUT_DURATION, DEBUT_SHOTS, DEBUT_STAMPS } from "../../components/film/debut-timeline.ts";
import { boom, chime, clap, createBus, drone, hat, kick, mix, pad, hz, readWav, riser, tick, whoosh, writeWav, bass } from "./synth.mjs";

const [, , voiceDir = "voice", dest = "debut-score.wav"] = process.argv;
createBus(DEBUT_DURATION);

const cuts = DEBUT_SHOTS.map((s) => s.start).filter((t) => t > 0 && t < 19);
const beat = 0.45; // the trend cuts every 0.9 s: 133 bpm, two beats a cut

/** dark half-time groove locked to a phase */
function groove(from, to, phase) {
  let k = 0;
  const first = phase + Math.ceil((from - phase) / (beat / 2)) * (beat / 2);
  for (let t = first; t < to - 0.02; t += beat / 2, k++) {
    const b = Math.round((t - phase) / (beat / 2));
    if (b % 4 === 0) mix(t, kick(1.1), 0.62);
    if (b % 4 === 2) mix(t, clap(0.8), 0.16);
    mix(t, hat(b % 2 ? 1 : 0.6), b % 2 ? 0.06 : 0.035, 0.3);
    if (b % 8 === 0) mix(t, bass(hz(31), beat * 1.8), 0.22);
  }
}

// ACT 1: the message, the name, the threat
mix(0, drone(11.4), 0.3);
groove(0, 11.3, 0.47);
for (const c of cuts.filter((t) => t < 11)) mix(c, boom(0.8), 0.32);
for (const s of DEBUT_STAMPS) mix(s.t, tick(1), 0.1);
mix(10.9, boom(1.1), 0.45);
// the drop before the montage
mix(11.25, whoosh(0.6), 0.25);

// ACT 2: silhouettes and the three-band montage
mix(11.87, drone(7.2), 0.28);
groove(11.87, 18.95, 11.87);
for (const c of cuts.filter((t) => t > 11.5)) mix(c, boom(0.8), 0.36);
for (const e of BAND_ENTRIES) mix(e, whoosh(0.3), 0.3, (e - 14) * 3);
for (const f of BAND_FLASHES) mix(f, boom(0.45), 0.5);
mix(17.9, riser(1.15), 0.3);

// into white: a shimmer, then the room goes quiet for the twist
[hz(84), hz(88), hz(91), hz(96)].forEach((f, i) => mix(19.0 + i * 0.05, chime(f, 0.8, 0.9), 0.08));
mix(19.4, pad([hz(60), hz(64), hz(67)], 5.0, 0.8, 1.2), 0.05);

// ACT 3: the debut
mix(24.47, boom(1.5), 0.6);
mix(24.47, kick(1.2), 0.6);
mix(24.75, boom(1.2), 0.5);
mix(24.6, pad([hz(45), hz(52), hz(57)], 2.0, 0.2, 1.0), 0.18);

// the voices, on top
const voices = JSON.parse(fs.readFileSync(path.join(voiceDir, "voice.json"), "utf8"));
for (const v of voices) mix(v.t, readWav(v.file), v.voice === "aan" ? 2.6 : 4.4, 0);

const peak = writeWav(dest, { drive: 1.4, ceiling: 0.9 });
console.log(`debut score: ${DEBUT_DURATION}s · ${voices.length} voice clips · peak ${peak.toFixed(2)} → ${dest}`);
