// Original soundtrack for "Ninety seconds with Aan", synthesized from scratch
// (oscillators, noise, Karplus-Strong plucks; no samples, nothing licensed).
// Every cue is read from the same timeline the visuals use.
//
//   node scripts/film/score.mjs public/film/score.wav
import { BEATS, DURATION, STAMPS } from "../../components/film/timeline.ts";
import { blip, bass, boom, chime, clap, clunk, createBus, drone, hat, hz, kick, mix, pad, pluck, riser, rnd, scratch, tick, typeClick, whoosh, writeWav, zap } from "./synth.mjs";

createBus(DURATION);

/* --------------------------------------------------------------- score */
const stampHits = STAMPS.map((s) => s.t);
const isQuick = (t) => (t > 13 && t < 17.6) || (t > 66 && t < 71.5);

// ACT 1 · the message: low drone, a clock that won't stop, braams on every word
mix(0, drone(24.2), 0.35);
for (let t = 0.0; t < 23.9; t += 0.5) mix(t, tick(0.7), 0.25, Math.round(t * 2) % 2 ? 0.35 : -0.35);
mix(0.3, kick(0.8), 0.5);
for (const s of STAMPS.filter((s) => s.t < 24)) mix(s.t, boom(isQuick(s.t) ? 0.55 : 1), isQuick(s.t) ? 0.55 : 0.75);
mix(4.5, whoosh(0.3), 0.3);
mix(7.8, whoosh(0.5), 0.35, -0.3);
mix(17.6, riser(0.4), 0.2);
for (let k = 0; k < 14; k++) mix(17.65 + k * 0.13, chime([2093, 2349, 2637, 3136][k % 4], 0.6, 0.25), 0.12, rnd() * 1.4 - 0.7);
mix(20.6, riser(3.4), 0.42);

// ACT 2 · the proof: 126 bpm, A minor, everything on the grid
const BPM = 126;
const beat = 60 / BPM;
const prog = [hz(33), hz(29), hz(36), hz(31)]; // A1 F1 C2 G1
function groove(from, to, { full = true, bassOn = true } = {}) {
  let k = 0;
  for (let t = from; t < to - 0.01; t += beat / 2, k++) {
    const onBeat = k % 2 === 0;
    const bar = Math.floor(k / 8) % 4;
    if (onBeat) mix(t, kick(1), 0.75);
    if (full) mix(t + (onBeat ? 0 : 0), hat(onBeat ? 0.5 : 1), onBeat ? 0.08 : 0.14, 0.25);
    if (full && k % 4 === 2) mix(t, clap(1), 0.32, -0.05);
    if (bassOn) mix(t, bass(prog[bar], beat / 2 - 0.01), onBeat ? 0.32 : 0.24);
  }
}
groove(24, 58);
for (const s of STAMPS.filter((s) => s.t >= 24 && s.t < 60)) mix(s.t, boom(0.7), 0.55);
for (const t of [31, 38, 45, 52]) mix(t - 0.02, hat(1, true), 0.25);

// scene SFX
mix(BEATS.signalsAlert, blip(880, 640, 0.14), 0.3, 0.3);
mix(BEATS.signalsAlert + 0.18, blip(880, 640, 0.14), 0.3, 0.3);
mix(BEATS.signalsFixed, blip(660, 1320, 0.18), 0.32, 0.3);
mix(BEATS.signalsFixed + 0.05, chime(hz(88), 0.5, 0.5), 0.18, 0.3);
for (let t = BEATS.profitCountStart; t < BEATS.profitCountEnd; t += 0.11)
  mix(t, chime([2093, 2349, 2637, 3136, 3520][Math.floor(rnd() * 5)], 0.6, 0.18), 0.09, rnd() * 1.2 - 0.6);
mix(BEATS.profitCountEnd, chime(hz(93), 0.8, 0.8), 0.2);
for (const t of BEATS.rulesStop) {
  mix(t, clunk(1), 0.55, 0.2);
  mix(t + 0.06, zap(1), 0.16, 0.4);
}
{
  const n = 29;
  for (let c = 0; c < n; c++) mix(BEATS.brainTypeStart + ((BEATS.brainTypeEnd - BEATS.brainTypeStart) * c) / n + rnd() * 0.02, typeClick(1), 0.35, 0.35);
  mix(BEATS.brainAnswer - 0.25, whoosh(0.4), 0.25, 0.3);
  mix(BEATS.brainAnswer, chime(hz(81), 0.7, 0.4), 0.16, 0.3);
  mix(BEATS.brainAnswer + 0.09, chime(hz(88), 0.7, 0.6), 0.14, 0.3);
}
for (const t of BEATS.mcpPlugs) {
  mix(t, zap(1), 0.22, -0.2);
  mix(t + 0.04, clunk(0.6), 0.3);
}

// the Night Watch: the beat steps back, a pad and the clock again
const night = [
  [hz(45), hz(48), hz(52)],
  [hz(41), hz(45), hz(48)],
  [hz(48), hz(52), hz(55)],
  [hz(43), hz(47), hz(50)],
];
night.forEach((ch, i) => mix(58 + i * 2, pad(ch, 2.4, 0.4, 0.6), 0.32));
for (let t = 58; t < 66; t += beat * 2) mix(t, kick(0.7), 0.45);
for (let t = 58; t < 66; t += 0.5) mix(t, tick(0.6), 0.14, Math.round(t * 2) % 2 ? 0.4 : -0.4);
mix(63.4, riser(2.6), 0.48);

// ACT 3 · the climax
groove(66, 75.2);
for (const s of STAMPS.filter((s) => s.t >= 66)) mix(s.t, boom(s.sub ? 1 : 0.6), s.sub ? 0.85 : 0.6);
for (let k = 0; k < 16; k++) {
  const t = 70.0 + 1.5 * (1 - Math.pow(1 - k / 16, 1.6));
  mix(t, clap(0.6 + k / 30), 0.22);
}
mix(69.7, whoosh(0.5), 0.4);

// ACT 4 · the twist: record scratch, silence, a deadpan little ditty
mix(BEATS.scratch, scratch(1), 0.6);
{
  const tempo = 60 / 112;
  const t0 = 75.8;
  // C major, plucky and unbothered
  const melody = [72, 76, 79, 76, 77, 81, 79, null, 76, 74, 72, 74, 76, null, 72, null, 72, 76, 79, 84, 83, 79, 77, 74, 72, null, 67, null, 72];
  const basses = [48, 53, 55, 48];
  melody.forEach((m, i) => {
    const t = t0 + i * tempo * 0.5;
    if (t > 84.2 || m === null) return;
    mix(t, pluck(hz(m), 0.45, 1, 0.5), 0.55, 0.15);
  });
  for (let b = 0; b < 8; b++) {
    const t = t0 + b * tempo * 2;
    if (t > 84.2) break;
    mix(t, pluck(hz(basses[b % 4]), 0.9, 1, 0.3), 0.6, -0.15);
  }
}
mix(82.0, riser(2.5), 0.4);

// ACT 5 · the debut
mix(BEATS.debut, boom(1.6), 1.0);
mix(BEATS.debut, kick(1.2), 0.8);
mix(BEATS.debut, pad([hz(45), hz(52), hz(57), hz(60)], 90 - BEATS.debut, 0.8, 2.6), 0.32);
[hz(81), hz(84), hz(88), hz(93)].forEach((f, i) => mix(BEATS.url + i * 0.12, chime(f, 0.8, 0.9), 0.14, -0.3 + i * 0.2));

const dest = process.argv[2] ?? "score.wav";
const peak = writeWav(dest);
console.log(`score: ${DURATION}s · peak ${peak.toFixed(2)} → ${dest} (${stampHits.length} stamps)`);
