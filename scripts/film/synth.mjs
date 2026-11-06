// Shared offline synth for the Aan films: a stereo mix bus, filters and
// instruments built from oscillators, noise and Karplus-Strong. No samples.
import fs from "node:fs";

export const SR = 48000;
let N = 0;
let L = new Float32Array(0);
let R = new Float32Array(0);

/** start a fresh stereo bus of the given length (seconds) */
export function createBus(duration) {
  N = Math.ceil(duration * SR);
  L = new Float32Array(N);
  R = new Float32Array(N);
}

export const TAU = Math.PI * 2;

let seed = 1337;
export const reseed = (s) => { seed = s; };
export const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export const noise = () => rnd() * 2 - 1;
export const saw = (ph) => 2 * (ph - Math.floor(ph)) - 1;
export const tri = (ph) => 1 - 4 * Math.abs((ph - Math.floor(ph)) - 0.5);

/** place a mono buffer at time t0 with an equal-power pan */
export function mix(t0, buf, gain = 1, pan = 0) {
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

export function render(dur, fn) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = fn(i / SR, i);
  return out;
}

/** time-varying one-pole lowpass */
export function lowpass(buf, fc) {
  let y = 0;
  for (let i = 0; i < buf.length; i++) {
    const f = typeof fc === "function" ? fc(i / SR) : fc;
    const a = 1 - Math.exp((-TAU * f) / SR);
    y += a * (buf[i] - y);
    buf[i] = y;
  }
  return buf;
}

export const highpass = (buf, fc) => {
  const lp = lowpass(Float32Array.from(buf), fc);
  for (let i = 0; i < buf.length; i++) buf[i] -= lp[i];
  return buf;
};

/** RBJ bandpass, coefficients refreshed every 32 samples */
export function bandpass(buf, fc, q = 2) {
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
export function kick(g = 1) {
  let ph = 0;
  return render(0.5, (t) => {
    ph += (45 + 120 * Math.exp(-t / 0.035)) / SR;
    return (Math.sin(TAU * ph) * Math.exp(-t / 0.2) + noise() * Math.exp(-t / 0.003) * 0.25) * g;
  });
}

/** the stamp: sub drop + detuned brass braam + air */
export function boom(len = 1) {
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

export function tick(g = 1) {
  return highpass(render(0.04, (t) => (noise() * Math.exp(-t / 0.004) + Math.sin(TAU * 3200 * t) * Math.exp(-t / 0.008) * 0.5) * g), 2000);
}

export function hat(g = 1, open = false) {
  return highpass(render(open ? 0.25 : 0.07, (t) => noise() * Math.exp(-t / (open ? 0.08 : 0.016)) * g), 7000);
}

export function clap(g = 1) {
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

export function bass(freq, dur, g = 1) {
  let p1 = 0, p2 = 0;
  const b = render(dur, (t) => {
    p1 += freq / SR;
    p2 += (freq * 1.005) / SR;
    const e = t < 0.006 ? t / 0.006 : Math.exp(-(t - 0.006) / (dur * 0.7));
    return (saw(p1) + saw(p2)) * 0.5 * e + Math.sin(TAU * p1) * e * 0.8;
  });
  return lowpass(b, (t) => 180 + 900 * Math.exp(-t / 0.05)).map((v) => v * g);
}

export function pad(freqs, dur, attack = 0.6, release = 1.2, g = 1) {
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

export function blip(f1, f2, dur = 0.12, g = 1) {
  let ph = 0;
  return render(dur, (t) => {
    ph += (f1 + (f2 - f1) * (t / dur)) / SR;
    return Math.sin(TAU * ph) * Math.min(1, t / 0.004) * Math.exp(-t / (dur * 0.6)) * g;
  });
}

export function chime(f, g = 1, d = 0.5) {
  return render(d * 2.2, (t) =>
    (Math.sin(TAU * f * t) + Math.sin(TAU * f * 2.01 * t) * 0.4 + Math.sin(TAU * f * 3.02 * t) * 0.15) *
    Math.min(1, t / 0.002) * Math.exp(-t / d) * g,
  );
}

export function clunk(g = 1) {
  const n = lowpass(render(0.2, (t) => noise() * Math.exp(-t / 0.03)), 700);
  return render(0.3, (t, i) =>
    (Math.sin(TAU * 68 * t) * Math.exp(-t / 0.09) + (n[i] ?? 0) * 0.9 + Math.sin(TAU * 430 * t) * Math.exp(-t / 0.05) * 0.25) * g,
  );
}

export function zap(g = 1) {
  let ph = 0;
  return render(0.18, (t) => {
    ph += (2600 * Math.exp(-t / 0.035) + 140) / SR;
    return (tri(ph) * 0.8 + noise() * 0.15) * Math.exp(-t / 0.06) * g;
  });
}

export function typeClick(g = 1) {
  return bandpass(render(0.03, (t) => noise() * Math.exp(-t / 0.005) * g), 3200 + rnd() * 1500, 1.5);
}

export function riser(dur, g = 1) {
  const n = bandpass(render(dur, (t) => noise() * Math.pow(t / dur, 2.2)), (t) => 300 + 7000 * Math.pow(t / dur, 2), 3);
  let ph = 0;
  return render(dur, (t, i) => {
    ph += (90 + 700 * Math.pow(t / dur, 2)) / SR;
    return (n[i] * 2.2 + saw(ph) * 0.18 * Math.pow(t / dur, 3)) * g;
  });
}

export function whoosh(dur = 0.6, g = 1) {
  return bandpass(render(dur, (t) => noise() * Math.sin((Math.PI * t) / dur) ** 2 * g), (t) => 400 + 3000 * (t / dur), 1.4);
}

export function drone(dur, g = 1) {
  const wind = lowpass(render(dur, () => noise()), 220);
  return render(dur, (t, i) => {
    const lfo = 0.75 + 0.25 * Math.sin(TAU * 0.18 * t);
    const e = Math.min(1, t / 1.5) * Math.min(1, (dur - t) / 0.8);
    return (Math.sin(TAU * 55 * t) * 0.6 + Math.sin(TAU * 82.4 * t) * 0.3 + Math.sin(TAU * 110.3 * t) * 0.12 + wind[i] * 1.4) * lfo * e * g;
  });
}

/** record scratch: a vinyl stab dragged back and forth */
export function scratch(g = 1) {
  let ph = 0;
  const b = render(0.55, (t) => {
    const speed = Math.sin(TAU * 7 * t) * (1 - t / 0.55);
    ph += (520 * speed) / SR;
    return (saw(ph) * 0.6 + noise() * 0.5 * Math.abs(speed)) * Math.min(1, t / 0.01) * g;
  });
  return bandpass(b, (t) => 900 + 2200 * Math.abs(Math.sin(TAU * 7 * t)), 0.9);
}

/** Karplus-Strong pluck for the deadpan twist ditty */
export function pluck(freq, dur = 0.5, g = 1, bright = 0.5) {
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

export const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

/** read a 16-bit PCM WAV (mono or stereo, any rate) as mono floats at SR */
export function readWav(file) {
  const b = fs.readFileSync(file);
  let o = 12, fmt = null, data = null;
  while (o < b.length - 8) {
    const id = b.toString("ascii", o, o + 4);
    const size = b.readUInt32LE(o + 4);
    if (id === "fmt ") fmt = { ch: b.readUInt16LE(o + 10), rate: b.readUInt32LE(o + 12), bits: b.readUInt16LE(o + 22) };
    if (id === "data") data = b.subarray(o + 8, o + 8 + size);
    o += 8 + size + (size % 2);
  }
  if (!fmt || !data || fmt.bits !== 16) throw new Error("unsupported wav: " + file);
  const frames = data.length / (2 * fmt.ch);
  const src = new Float32Array(frames);
  for (let i = 0; i < frames; i++) {
    let s = 0;
    for (let c = 0; c < fmt.ch; c++) s += data.readInt16LE((i * fmt.ch + c) * 2) / 32768;
    src[i] = s / fmt.ch;
  }
  if (fmt.rate === SR) return src;
  const out = new Float32Array(Math.floor((frames * SR) / fmt.rate));
  for (let i = 0; i < out.length; i++) {
    const x = (i * fmt.rate) / SR;
    const k = Math.floor(x);
    out[i] = (src[k] ?? 0) + ((src[k + 1] ?? 0) - (src[k] ?? 0)) * (x - k);
  }
  return out;
}

/** soft-clip, normalise and write the bus as 16-bit stereo WAV; returns the raw peak */
export function writeWav(dest, { drive = 1.6, ceiling = 0.92, fadeOut = 0 } = {}) {
  let peak = 0;
  for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
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
  const fo = fadeOut * SR;
  for (let i = 0; i < N; i++) {
    const f = Math.min(1, i / fadeIn) * (fo ? Math.min(1, (N - i) / fo) : 1);
    const l = (Math.tanh(L[i] * norm * drive) / Math.tanh(drive)) * ceiling * f;
    const r = (Math.tanh(R[i] * norm * drive) / Math.tanh(drive)) * ceiling * f;
    out.writeInt16LE(Math.round(l * 32767), 44 + i * 4);
    out.writeInt16LE(Math.round(r * 32767), 46 + i * 4);
  }
  fs.writeFileSync(dest, out);
  return peak;
}
