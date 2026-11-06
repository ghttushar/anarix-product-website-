// Soundtrack for "Aan's debut": the same synthesized bed as before (a dark
// half-time groove with a braam on every cut), re-timed to the cuts, lifting
// into a warm major chord on the DEBUT card, with Aan's voice-over on top
// (scripts/film/voice.mjs). The Instagram cut ships silent.
//
//   node scripts/film/debut-score.mjs <voiceDir> <out.wav>
import fs from "node:fs";
import path from "node:path";
import { BAND_ENTRIES, BAND_FLASHES, DEBUT_DURATION, DEBUT_SHOTS, DEBUT_STAMPS, DEBUT_WORD, WHITE_IN } from "../../components/film/debut-timeline.ts";
import { bass, boom, chime, clap, createBus, drone, hat, hz, kick, mix, pad, readWav, riser, tick, whoosh, writeWav } from "./synth.mjs";

const [, , voiceDir = "voice", dest = "debut-score.wav"] = process.argv;
createBus(DEBUT_DURATION);

const endCard = DEBUT_SHOTS.find((s) => s.scene === "end").start;
const cuts = DEBUT_SHOTS.map((s) => s.start).filter((t) => t > 0 && t < endCard);
const beat = 0.45; // the trend's 0.9 s cut grid: 133 bpm, two beats a cut

function groove(from, to, phase, g = 1) {
  const first = phase + Math.ceil((from - phase) / (beat / 2)) * (beat / 2);
  for (let t = first; t < to - 0.02; t += beat / 2) {
    const b = Math.round((t - phase) / (beat / 2));
    if (b % 4 === 0) mix(t, kick(1.1), 0.55 * g);
    if (b % 4 === 2) mix(t, clap(0.8), 0.13 * g);
    mix(t, hat(b % 2 ? 1 : 0.6), (b % 2 ? 0.05 : 0.03) * g, 0.3);
    if (b % 8 === 0) mix(t, bass(hz(31), beat * 1.8), 0.2 * g);
  }
}

// the bed under the whole reel
mix(0, drone(endCard + 0.3), 0.26);
groove(0, WHITE_IN, 0.47);
for (const c of cuts) mix(c, boom(0.8), 0.3);
for (const s of DEBUT_STAMPS) mix(s.t, tick(1), 0.07);
for (const e of BAND_ENTRIES) mix(e, whoosh(0.3), 0.26, (e - BAND_ENTRIES[1]) * 3);
for (const f of BAND_FLASHES) mix(f, boom(0.45), 0.42);
mix(WHITE_IN - 1.1, riser(1.1), 0.26);

// into white: a shimmer, then the DEBUT card lands warm
[hz(84), hz(88), hz(91), hz(96)].forEach((f, i) => mix(WHITE_IN + i * 0.05, chime(f, 0.8, 0.9), 0.07));
mix(endCard, boom(1.4), 0.5);
mix(endCard, kick(1.2), 0.5);
mix(DEBUT_WORD, boom(1.1), 0.42);
mix(endCard + 0.1, pad([hz(48), hz(55), hz(60), hz(64), hz(67)], DEBUT_DURATION - endCard - 0.1, 0.5, 1.6), 0.2);
groove(DEBUT_WORD + 0.45, DEBUT_DURATION - 1.2, DEBUT_WORD, 0.55);

// Aan, on top
const voices = JSON.parse(fs.readFileSync(path.join(voiceDir, "voice.json"), "utf8"));
for (const v of voices) mix(v.t, readWav(v.file), 2.4, 0);

const peak = writeWav(dest, { drive: 1.35, ceiling: 0.9, fadeOut: 0.6 });
console.log(`debut score: ${DEBUT_DURATION}s · ${voices.length} lines · peak ${peak.toFixed(2)} → ${dest}`);
