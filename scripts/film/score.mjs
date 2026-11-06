// Original soundtrack for "Ninety seconds with Aan", synthesized from scratch
// (oscillators, noise, Karplus-Strong plucks; no samples, nothing licensed).
// Every cue is read from the same timeline the visuals use.
//
//   node scripts/film/score.mjs public/film/score.wav
import fs from "node:fs";
import { BEATS, DURATION, STAMPS } from "../../components/film/timeline.ts";

const SR = 48000;
const N = Math.ceil(DURATION * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);
const TAU = Math.PI * 2;

let seed = 1337;
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const saw = (ph) => 2 * (ph - Math.floor(ph)) - 1;
const tri = (ph) => 1 - 4 * Math.abs((ph - Math.floor(ph)) - 0.5);

/** place a mono buffer at time t0 with an equal-power pan */
function mix(t0, buf, gain = 1, pan = 0) {
  const s0 = Math.round(t0 * SR);
  const a = ((pan + 1) * Math.PI) / 4;
  const gl = gain * Math.cos(a) * 1.414;
  const gr = gain * Math.sin(a) * 1.414;
  for (let i = 0; i < buf.length; i++) {
    const j = s0 + i;
    if (j < 0 || j >= N) continue;
    L[j] += buf[i] * gl;
    R[j] += buf[i] * gr;
  }
}

function render(dur, fn) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = fn(i / SR, i);
  return out;
}

/** time-varying one-pole lowpass */
function lowpass(buf, fc) {
  let y = 0;
  for (let i = 0; i < buf.length; i++) {
    const f = typeof fc === "function" ? fc(i / SR) : fc;
    const a = 1 - Math.exp((-TAU * f) / SR);
    y += a * (buf[i] - y);
    buf[i] = y;
  }
  return buf;
}

const highpass = (buf, fc) => {
  const lp = lowpass(Float32Array.from(buf), fc);
  for (let i = 0; i < buf.length; i++) buf[i] -= lp[i];
  return buf;
};

/** RBJ bandpass, coefficients refreshed every 32 samples */
function bandpass(buf, fc, q = 2) {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0, b0 = 0, b2 = 0, a1 = 0, a2 = 0, a0 = 1;
  for (let i = 0; i < buf.length; i++) {
    if (i % 32 === 0) {
      const f = Math.min(SR * 0.45, typeof fc === "function" ? fc(i / SR) : fc);
      const w = (TAU * f) / SR;
      const al = Math.sin(w) / (2 * q);
      b0 = al; b2 = -al; a0 = 1 + al; a1 = -2 * Math.cos(w); a2 = 1 - al;
    }
    const x = buf[i];
    const y = (b0 * x + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    buf[i] = y;
  }
  return buf;
}

/* ---------------------------------------------------------- instruments */
function kick(g = 1) {
  let ph = 0;
  return render(0.5, (t) => {
    ph += (45 + 120 * Math.exp(-t / 0.035)) / SR;
    return (Math.sin(TAU * ph) * Math.exp(-t / 0.2) + noise() * Math.exp(-t / 0.003) * 0.25) * g;
  });
}

/** the stamp: sub drop + detuned brass braam + air */
function boom(len = 1) {
  let sub = 0;
  const ph = [0, 0, 0, 0, 0, 0];
  const fr = [55, 55.3, 82.4, 110, 110.6, 164.8];
  const brass = render(1.9 * len, (t) => {
    let s = 0;
    for (let k = 0; k < fr.length; k++) {
      ph[k] += fr[k] / SR;
      s += saw(ph[k]);
    }
    return (s / fr.length) * (t < 0.012 ? t / 0.012 : Math.exp(-(t - 0.012) / (0.55 * len)));
  });
  lowpass(brass, (t) => 260 + 2600 * Math.exp(-t / 0.18));
  const air = lowpass(render(1.2 * len, (t) => noise() * Math.exp(-t / (0.22 * len))), 900);
  const out = render(2.2 * len, (t, i) => {
    sub += (30 + 48 * Math.exp(-t / 0.12)) / SR;
    return (
      Math.sin(TAU * sub) * Math.exp(-t / (0.85 * len)) * 0.9 +
      (brass[i] ?? 0) * 1.1 +
      (air[i] ?? 0) * 0.5 +
      noise() * Math.exp(-t / 0.004) * 0.35
    );
  });
  return out;
}

function tick(g = 1) {
  return highpass(render(0.04, (t) => (noise() * Math.exp(-t / 0.004) + Math.sin(TAU * 3200 * t) * Math.exp(-t / 0.008) * 0.5) * g), 2000);
}

function hat(g = 1, open = false) {
  return highpass(render(open ? 0.25 : 0.07, (t) => noise() * Math.exp(-t / (open ? 0.08 : 0.016)) * g), 7000);
}

function clap(g = 1) {
  const n = bandpass(
    render(0.3, (t) => {
      const bursts = [0, 0.011, 0.022].reduce((a, o) => a + (t >= o ? Math.exp(-(t - o) / 0.006) : 0), 0);
      return noise() * (bursts * 0.6 + Math.exp(-t / 0.09));
    }),
    1400,
    1.2,
  );
  return render(0.3, (t, i) => (n[i] * 1.6 + Math.sin(TAU * 190 * t) * Math.exp(-t / 0.04) * 0.4) * g);
}

function bass(freq, dur, g = 1) {
  let p1 = 0, p2 = 0;
  const b = render(dur, (t) => {
    p1 += freq / SR;
    p2 += (freq * 1.005) / SR;
    const e = t < 0.006 ? t / 0.006 : Math.exp(-(t - 0.006) / (dur * 0.7));
    return (saw(p1) + saw(p2)) * 0.5 * e + Math.sin(TAU * p1) * e * 0.8;
  });
  return lowpass(b, (t) => 180 + 900 * Math.exp(-t / 0.05)).map((v) => v * g);
}

function pad(freqs, dur, attack = 0.6, release = 1.2, g = 1) {
  const ph = freqs.flatMap((f) => [f * 0.997, f, f * 1.004]).map((f) => ({ f, p: rnd() }));
  const b = render(dur, (t) => {
    let s = 0;
    for (const o of ph) {
      o.p += o.f / SR;
      s += saw(o.p) * 0.4 + Math.sin(TAU * o.p) * 0.6;
    }
    const e = Math.min(1, t / attack) * Math.min(1, (dur - t) / release);
    return (s / ph.length) * e * g;
  });
  return lowpass(b, 1400);
}

function blip(f1, f2, dur = 0.12, g = 1) {
  let ph = 0;
  return render(dur, (t) => {
    ph += (f1 + (f2 - f1) * (t / dur)) / SR;
    return Math.sin(TAU * ph) * Math.min(1, t / 0.004) * Math.exp(-t / (dur * 0.6)) * g;
  });
}

function chime(f, g = 1, d = 0.5) {
  return render(d * 2.2, (t) =>
    (Math.sin(TAU * f * t) + Math.sin(TAU * f * 2.01 * t) * 0.4 + Math.sin(TAU * f * 3.02 * t) * 0.15) *
    Math.min(1, t / 0.002) * Math.exp(-t / d) * g,
  );
}

function clunk(g = 1) {
  const n = lowpass(render(0.2, (t) => noise() * Math.exp(-t / 0.03)), 700);
  return render(0.3, (t, i) =>
    (Math.sin(TAU * 68 * t) * Math.exp(-t / 0.09) + (n[i] ?? 0) * 0.9 + Math.sin(TAU * 430 * t) * Math.exp(-t / 0.05) * 0.25) * g,
  );
}

function zap(g = 1) {
  let ph = 0;
  return render(0.18, (t) => {
    ph += (2600 * Math.exp(-t / 0.035) + 140) / SR;
    return (tri(ph) * 0.8 + noise() * 0.15) * Math.exp(-t / 0.06) * g;
  });
}

function typeClick(g = 1) {
  return bandpass(render(0.03, (t) => noise() * Math.exp(-t / 0.005) * g), 3200 + rnd() * 1500, 1.5);
}

function riser(dur, g = 1) {
  const n = bandpass(render(dur, (t) => noise() * Math.pow(t / dur, 2.2)), (t) => 300 + 7000 * Math.pow(t / dur, 2), 3);
  let ph = 0;
  return render(dur, (t, i) => {
    ph += (90 + 700 * Math.pow(t / dur, 2)) / SR;
    return (n[i] * 2.2 + saw(ph) * 0.18 * Math.pow(t / dur, 3)) * g;
  });
}

function whoosh(dur = 0.6, g = 1) {
  return bandpass(render(dur, (t) => noise() * Math.sin((Math.PI * t) / dur) ** 2 * g), (t) => 400 + 3000 * (t / dur), 1.4);
}

function drone(dur, g = 1) {
  const wind = lowpass(render(dur, () => noise()), 220);
  return render(dur, (t, i) => {
    const lfo = 0.75 + 0.25 * Math.sin(TAU * 0.18 * t);
    const e = Math.min(1, t / 1.5) * Math.min(1, (dur - t) / 0.8);
    return (Math.sin(TAU * 55 * t) * 0.6 + Math.sin(TAU * 82.4 * t) * 0.3 + Math.sin(TAU * 110.3 * t) * 0.12 + wind[i] * 1.4) * lfo * e * g;
  });
}

/** record scratch: a vinyl stab dragged back and forth */
function scratch(g = 1) {
  let ph = 0;
  const b = render(0.55, (t) => {
    const speed = Math.sin(TAU * 7 * t) * (1 - t / 0.55);
    ph += (520 * speed) / SR;
    return (saw(ph) * 0.6 + noise() * 0.5 * Math.abs(speed)) * Math.min(1, t / 0.01) * g;
  });
  return bandpass(b, (t) => 900 + 2200 * Math.abs(Math.sin(TAU * 7 * t)), 0.9);
}

/** Karplus-Strong pluck for the deadpan twist ditty */
function pluck(freq, dur = 0.5, g = 1, bright = 0.5) {
  const p = Math.max(2, Math.round(SR / freq));
  const line = new Float32Array(p).map(() => noise());
  let idx = 0;
  return render(dur, (t) => {
    const a = line[idx];
    const b = line[(idx + 1) % p];
    const v = (a * (1 - bright) + b * bright) * 0.996;
    line[idx] = v;
    idx = (idx + 1) % p;
    return a * g * Math.min(1, (dur - t) / 0.03);
  });
}

const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

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

/* --------------------------------------------------------------- master */
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const drive = 1.6;
const norm = 1 / peak;
const out = Buffer.alloc(44 + N * 4);
out.write("RIFF", 0);
out.writeUInt32LE(36 + N * 4, 4);
out.write("WAVEfmt ", 8);
out.writeUInt32LE(16, 16);
out.writeUInt16LE(1, 20);
out.writeUInt16LE(2, 22);
out.writeUInt32LE(SR, 24);
out.writeUInt32LE(SR * 4, 28);
out.writeUInt16LE(4, 32);
out.writeUInt16LE(16, 34);
out.write("data", 36);
out.writeUInt32LE(N * 4, 40);
const fadeIn = 0.02 * SR;
for (let i = 0; i < N; i++) {
  const f = Math.min(1, i / fadeIn);
  const l = (Math.tanh(L[i] * norm * drive) / Math.tanh(drive)) * 0.92 * f;
  const r = (Math.tanh(R[i] * norm * drive) / Math.tanh(drive)) * 0.92 * f;
  out.writeInt16LE(Math.round(l * 32767), 44 + i * 4);
  out.writeInt16LE(Math.round(r * 32767), 46 + i * 4);
}
const dest = process.argv[2] ?? "score.wav";
fs.writeFileSync(dest, out);
console.log(`score: ${DURATION}s · ${SR} Hz stereo · peak ${peak.toFixed(2)} → ${dest} (${stampHits.length} stamps)`);
