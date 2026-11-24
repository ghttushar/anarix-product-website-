"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
  The Signals halo (Relay's energy field, in periwinkle and coral): a few
  hundred fibres of light pinched to a white-hot core, with bloom. On load
  the core flares and the fibres shoot out of it, out of focus, and settle
  sharp. Down the page the same fibres travel through a set of shapes, one
  per section ([data-halo="n"]): the arc in the hero, an S-ribbon, a soft
  out-of-focus field mid-page, a sharp sweep behind the catalog, a fade at
  the end. Every fibre is computed on the GPU from a handful of numbers, so
  a scroll frame only sets uniforms: nothing is measured while scrolling.
*/

type V2 = [number, number];
type Key = {
  /** the spine: five points in viewport fractions (0..1 from top left) */
  p: [V2, V2, V2, V2, V2];
  /** where along the spine the fibres pinch (0..1) */
  pinch: number;
  pinchW: number;
  endW: number;
  defocus: number;
  glow: number;
  core: number;
};

const KEYS: Key[] = [
  // 0 · hero: the arc, pinched to a white-hot core left of centre
  { p: [[0.9, -0.12], [0.64, 0.22], [0.49, 0.62], [0.57, 0.9], [0.74, 1.16]], pinch: 0.5, pinchW: 0.004, endW: 0.3, defocus: 0, glow: 1, core: 1 },
  // 1 · the strip and the glue line: an S-ribbon down the right
  { p: [[0.98, -0.12], [0.64, 0.22], [0.74, 0.55], [0.5, 0.86], [0.62, 1.16]], pinch: 0.45, pinchW: 0.05, endW: 0.2, defocus: 0.12, glow: 0.95, core: 0 },
  // 2 · the rows: broad and out of focus
  { p: [[1.08, 0.02], [0.6, 0.3], [0.26, 0.56], [0.46, 0.82], [0.18, 1.12]], pinch: 0.5, pinchW: 0.22, endW: 0.32, defocus: 1, glow: 0.5, core: 0 },
  // 3 · the panel, coverage and the brief: a soft field across the top
  { p: [[-0.08, 0.18], [0.32, 0.36], [0.68, 0.28], [1.02, 0.56], [1.12, 0.92]], pinch: 0.5, pinchW: 0.2, endW: 0.3, defocus: 0.85, glow: 0.45, core: 0 },
  // 4 · the numbers: back into focus, a diagonal
  { p: [[-0.04, -0.1], [0.24, 0.3], [0.54, 0.46], [0.8, 0.72], [1.06, 1.06]], pinch: 0.45, pinchW: 0.06, endW: 0.18, defocus: 0.28, glow: 0.85, core: 0 },
  // 5 · the catalog: a sharp horizontal sweep
  { p: [[-0.12, 0.56], [0.24, 0.42], [0.5, 0.52], [0.76, 0.64], [1.12, 0.46]], pinch: 0.32, pinchW: 0.02, endW: 0.15, defocus: 0, glow: 1, core: 0.35 },
  // 6 · the close: drifting off the top, soft
  { p: [[-0.12, 0.3], [0.28, 0.2], [0.58, 0.3], [0.88, 0.18], [1.14, 0.12]], pinch: 0.5, pinchW: 0.08, endW: 0.18, defocus: 0.5, glow: 0.5, core: 0 },
];

/* on a portrait screen the hero arc hugs the right edge, clear of the copy */
const PORTRAIT_HERO: Key = { p: [[1.16, -0.1], [0.96, 0.22], [0.94, 0.57], [0.8, 0.84], [0.94, 1.14]], pinch: 0.5, pinchW: 0.006, endW: 0.2, defocus: 0, glow: 0.85, core: 0.8 };

const COMMON = /* glsl */ `
  uniform vec2 uRes;
  uniform vec2 uP0, uP1, uP2, uP3, uP4;
  uniform float uPinch, uPinchW, uEndW, uSpread, uTime;
  vec2 cr(vec2 a, vec2 b, vec2 c, vec2 d, float t) {
    float t2 = t * t, t3 = t2 * t;
    return 0.5 * ((2.0 * b) + (-a + c) * t + (2.0 * a - 5.0 * b + 4.0 * c - d) * t2 + (-a + 3.0 * b - 3.0 * c + d) * t3);
  }
  vec2 spine(float t) {
    float s = clamp(t, 0.0, 1.0) * 4.0;
    if (s < 1.0) return cr(2.0 * uP0 - uP1, uP0, uP1, uP2, s);
    if (s < 2.0) return cr(uP0, uP1, uP2, uP3, s - 1.0);
    if (s < 3.0) return cr(uP1, uP2, uP3, uP4, s - 2.0);
    return cr(uP2, uP3, uP4, 2.0 * uP4 - uP3, min(s - 3.0, 1.0));
  }
  float widthAt(float t) {
    float d = clamp(abs(t - uPinch) * 2.0, 0.0, 1.0);
    return mix(uPinchW, uEndW, pow(d, 0.85)) * uSpread;
  }
  vec2 fibre(float t, vec4 seed) {
    vec2 a = spine(t) * uRes;
    vec2 b = spine(t + 0.004) * uRes;
    vec2 tg = normalize(b - a + vec2(1e-4, 0.0));
    vec2 n = vec2(-tg.y, tg.x);
    float w = widthAt(t) * min(uRes.x, uRes.y);
    // strands twist around each other, like a rope of light
    float off = seed.x * (0.62 + 0.38 * cos(t * 5.0 + seed.y * 6.2831 + uTime * 0.22 * (0.5 + seed.z)));
    float wob = sin(t * 9.0 + seed.y * 20.0 + uTime * 0.55) * 0.035;
    return a + n * w * (off + wob);
  }
  vec2 toClip(vec2 p) { return vec2(p.x / uRes.x * 2.0 - 1.0, 1.0 - p.y / uRes.y * 2.0); }
`;

const FIBRE_VS = /* glsl */ `
  ${COMMON}
  uniform float uDefocus, uGlow, uGrow;
  attribute float aT;
  attribute float aSide;
  attribute vec4 aSeed;
  attribute vec2 aRange;
  attribute vec3 aColor;
  varying float vAcross;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec2 p0 = fibre(aT, aSeed);
    vec2 p1 = fibre(aT + 0.003, aSeed);
    vec2 tg = normalize(p1 - p0 + vec2(1e-4, 0.0));
    vec2 n = vec2(-tg.y, tg.x);
    // a sharp fibre is a hairline; out of focus it spreads wide and dim
    float hw = 0.8 + uDefocus * (3.5 + 7.0 * aSeed.w);
    vAcross = aSide * 1.7;
    vec2 p = p0 + n * aSide * hw * 1.7;
    float fade = smoothstep(aRange.x, aRange.x + 0.08, aT) * (1.0 - smoothstep(aRange.y - 0.08, aRange.y, aT));
    // the blast: fibres grow out of the core
    float reach = uGrow * 0.78;
    float grow = 1.0 - smoothstep(reach - 0.07, reach, abs(aT - uPinch));
    // light that runs along the strands
    float run = pow(max(0.0, sin((aT * 2.6 - uTime * 0.11 + aSeed.y) * 6.2831)), 28.0);
    // dim on its own: the light builds where strands gather, at the core
    vAlpha = (0.04 + 0.42 * run) * fade * grow * uGlow / (1.0 + uDefocus * 7.0);
    vColor = aColor;
    gl_Position = vec4(toClip(p), 0.0, 1.0);
  }
`;

const FIBRE_FS = /* glsl */ `
  varying float vAcross;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float k = exp(-vAcross * vAcross * 2.2);
    gl_FragColor = vec4(vColor, vAlpha * k);
  }
`;

const SPECK_VS = /* glsl */ `
  ${COMMON}
  uniform float uDefocus, uGlow, uGrow, uDpr;
  attribute float aT;
  attribute vec4 aSeed;
  varying float vAlpha;
  varying float vRing;
  void main() {
    float t = fract(aT + uTime * 0.0035 * (0.4 + aSeed.z));
    vec2 a = spine(t) * uRes;
    vec2 b = spine(t + 0.004) * uRes;
    vec2 tg = normalize(b - a + vec2(1e-4, 0.0));
    vec2 n = vec2(-tg.y, tg.x);
    float w = widthAt(t) * min(uRes.x, uRes.y);
    vec2 p = a + n * (aSeed.x * w * 1.9 + aSeed.x * 40.0) + vec2(0.0, sin(uTime * 0.3 + aSeed.y * 9.0) * 6.0);
    float size = (1.4 + aSeed.w * 4.8) * (1.0 + uDefocus * 2.2);
    gl_PointSize = size * uDpr;
    float twinkle = 0.55 + 0.45 * sin(uTime * (0.8 + aSeed.z) + aSeed.y * 30.0);
    float reach = uGrow * 0.78;
    vAlpha = (0.08 + 0.3 * aSeed.z) * twinkle * uGlow * (1.0 - smoothstep(reach - 0.1, reach, abs(t - uPinch))) / (1.0 + uDefocus * 1.5);
    vRing = uDefocus;
    gl_Position = vec4(toClip(p), 0.0, 1.0);
  }
`;

const SPECK_FS = /* glsl */ `
  varying float vAlpha;
  varying float vRing;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float disc = 1.0 - smoothstep(0.7, 1.0, r);
    // out of focus, a speck becomes a bokeh disc with a brighter rim
    float rim = mix(1.0, 0.55 + 0.6 * smoothstep(0.5, 0.92, r), vRing);
    gl_FragColor = vec4(vec3(0.78, 0.83, 1.0), vAlpha * disc * rim);
  }
`;

const CORE_VS = /* glsl */ `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const CORE_FS = /* glsl */ `
  uniform vec2 uRes;
  uniform vec2 uCore;
  uniform float uCoreI, uDpr;
  void main() {
    vec2 px = vec2(gl_FragCoord.x / uDpr, uRes.y - gl_FragCoord.y / uDpr);
    vec2 d = px - uCore;
    float r = length(d);
    float hot = exp(-r * r / (2.0 * 16.0 * 16.0));
    float halo = exp(-r / 110.0) * 0.2;
    float streak = exp(-abs(d.y) / 2.2) * exp(-abs(d.x) / 170.0) * 0.26;
    vec3 c = vec3(1.0) * hot + vec3(0.62, 0.68, 1.0) * halo + vec3(0.85, 0.88, 1.0) * streak;
    gl_FragColor = vec4(c * uCoreI, 1.0);
  }
`;

/* the same spine on the CPU, to place the core sprite */
function cr(a: number, b: number, c: number, d: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
}
function spineAt(p: V2[], t: number): V2 {
  const s = Math.min(Math.max(t, 0), 1) * 4;
  const i = Math.min(3, Math.floor(s));
  const f = s - i;
  const P = (j: number): V2 => {
    if (j < 0) return [2 * p[0][0] - p[1][0], 2 * p[0][1] - p[1][1]];
    if (j > 4) return [2 * p[4][0] - p[3][0], 2 * p[4][1] - p[3][1]];
    return p[j];
  };
  const [a, b, c, d] = [P(i - 1), P(i), P(i + 1), P(i + 2)];
  return [cr(a[0], b[0], c[0], d[0], f), cr(a[1], b[1], c[1], d[1], f)];
}

const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
const smooth = (f: number) => f * f * (3 - 2 * f);
const easeOut = (f: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, f)), 3);

export function Halo({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const THREE = await import("three");
      const { EffectComposer } = await import("three/examples/jsm/postprocessing/EffectComposer.js");
      const { RenderPass } = await import("three/examples/jsm/postprocessing/RenderPass.js");
      const { UnrealBloomPass } = await import("three/examples/jsm/postprocessing/UnrealBloomPass.js");
      const { OutputPass } = await import("three/examples/jsm/postprocessing/OutputPass.js");
      const el = host.current;
      if (disposed || !el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const small = window.innerWidth < 760;

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
      const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.25);
      renderer.setPixelRatio(dpr);
      // true black: inside the bloom chain a coloured clear gets encoded twice
      // and lifts the whole field to grey
      renderer.setClearColor(0x000000, 1);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const shared = {
        uRes: { value: new THREE.Vector2(1, 1) },
        uP0: { value: new THREE.Vector2() },
        uP1: { value: new THREE.Vector2() },
        uP2: { value: new THREE.Vector2() },
        uP3: { value: new THREE.Vector2() },
        uP4: { value: new THREE.Vector2() },
        uPinch: { value: 0.5 },
        uPinchW: { value: 0.01 },
        uEndW: { value: 0.3 },
        uSpread: { value: 1 },
        uTime: { value: 0 },
        uDefocus: { value: 0 },
        uGlow: { value: 1 },
        uGrow: { value: reduced ? 1 : 0 },
        uDpr: { value: dpr },
      };

      // ---- the fibres: one ribbon of quads per fibre, shaped on the GPU
      const FIBRES = small ? 200 : 320;
      const SEGS = small ? 90 : 130;
      const vCount = FIBRES * (SEGS + 1) * 2;
      const aT = new Float32Array(vCount);
      const aSide = new Float32Array(vCount);
      const aSeed = new Float32Array(vCount * 4);
      const aRange = new Float32Array(vCount * 2);
      const aColor = new Float32Array(vCount * 3);
      const index: number[] = [];
      const peri = new THREE.Color("#8b9cf0");
      const pale = new THREE.Color("#c9d1ff");
      const coral = new THREE.Color("#f46d76");
      const deep = new THREE.Color("#5b6fe6");
      const gauss = () => (Math.random() + Math.random() + Math.random()) / 1.5 - 1;
      let v = 0;
      for (let f = 0; f < FIBRES; f++) {
        const seed = [gauss(), Math.random(), Math.random(), Math.random()];
        const start = Math.random() < 0.6 ? 0 : Math.random() * 0.3;
        const end = Math.random() < 0.6 ? 1 : 1 - Math.random() * 0.3;
        const r = Math.random();
        const col = r < 0.18 ? coral : r < 0.32 ? pale : r < 0.58 ? deep : peri;
        for (let s = 0; s <= SEGS; s++) {
          for (let side = -1; side <= 1; side += 2) {
            aT[v] = s / SEGS;
            aSide[v] = side;
            aSeed.set(seed, v * 4);
            aRange[v * 2] = start;
            aRange[v * 2 + 1] = end;
            aColor[v * 3] = col.r;
            aColor[v * 3 + 1] = col.g;
            aColor[v * 3 + 2] = col.b;
            v++;
          }
          if (s < SEGS) {
            const b = (f * (SEGS + 1) + s) * 2;
            index.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
          }
        }
      }
      const fg = new THREE.BufferGeometry();
      fg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vCount * 3), 3));
      fg.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
      fg.setAttribute("aSide", new THREE.BufferAttribute(aSide, 1));
      fg.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 4));
      fg.setAttribute("aRange", new THREE.BufferAttribute(aRange, 2));
      fg.setAttribute("aColor", new THREE.BufferAttribute(aColor, 3));
      fg.setIndex(index);
      const fm = new THREE.ShaderMaterial({
        uniforms: shared,
        vertexShader: FIBRE_VS,
        fragmentShader: FIBRE_FS,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const fibres = new THREE.Mesh(fg, fm);
      fibres.frustumCulled = false;
      scene.add(fibres);

      // ---- the specks around the strands
      const SPECKS = small ? 140 : 260;
      const sT = new Float32Array(SPECKS);
      const sSeed = new Float32Array(SPECKS * 4);
      for (let i = 0; i < SPECKS; i++) {
        sT[i] = Math.random();
        sSeed.set([gauss() * 1.4, Math.random(), Math.random(), Math.random() ** 2], i * 4);
      }
      const sg = new THREE.BufferGeometry();
      sg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(SPECKS * 3), 3));
      sg.setAttribute("aT", new THREE.BufferAttribute(sT, 1));
      sg.setAttribute("aSeed", new THREE.BufferAttribute(sSeed, 4));
      const sm = new THREE.ShaderMaterial({
        uniforms: shared,
        vertexShader: SPECK_VS,
        fragmentShader: SPECK_FS,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const specks = new THREE.Points(sg, sm);
      specks.frustumCulled = false;
      scene.add(specks);

      // ---- the white-hot core
      const coreU = { uRes: shared.uRes, uDpr: shared.uDpr, uCore: { value: new THREE.Vector2() }, uCoreI: { value: 0 } };
      const cm = new THREE.ShaderMaterial({
        uniforms: coreU,
        vertexShader: CORE_VS,
        fragmentShader: CORE_FS,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        blending: THREE.CustomBlending,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneFactor,
      });
      const cg = new THREE.PlaneGeometry(2, 2);
      const core = new THREE.Mesh(cg, cm);
      core.frustumCulled = false;
      scene.add(core);

      // ---- bloom
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.8, 0.5, 0.06);
      composer.addPass(bloom);
      composer.addPass(new OutputPass());

      const size = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        renderer.setSize(w, h, false);
        composer.setSize(w, h);
        shared.uRes.value.set(w, h);
      };
      size();
      const ro = new ResizeObserver(size);
      ro.observe(el);

      // ---- where each shape sits on the page (measured on refresh only)
      let marks: { at: number; k: number }[] = [];
      const measure = () => {
        const vh = window.innerHeight;
        marks = Array.from(document.querySelectorAll<HTMLElement>("[data-halo]"))
          .map((n) => {
            const box = n.parentElement?.classList.contains("pin-spacer") ? n.parentElement : n;
            const r = box.getBoundingClientRect();
            const top = r.top + window.scrollY;
            // a pinned section holds its shape for its whole pin
            const at = r.height > vh * 1.5 ? top : top + r.height / 2 - vh / 2;
            return { at: Math.max(0, at), k: Number(n.dataset.halo) };
          })
          .sort((a, b) => a.at - b.at);
      };
      measure();
      ScrollTrigger.addEventListener("refresh", measure);
      window.addEventListener("load", measure);

      const keyAt = (y: number) => {
        if (!marks.length) return 0;
        if (y <= marks[0].at) return marks[0].k;
        for (let i = 0; i < marks.length - 1; i++) {
          const a = marks[i];
          const b = marks[i + 1];
          if (y < b.at) return lerp(a.k, b.k, smooth((y - a.at) / Math.max(1, b.at - a.at)));
        }
        return marks[marks.length - 1].k;
      };

      const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointer = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        ptr.tx = e.clientX / window.innerWidth - 0.5;
        ptr.ty = e.clientY / window.innerHeight - 0.5;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      const pts: V2[] = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
      const uP = [shared.uP0, shared.uP1, shared.uP2, shared.uP3, shared.uP4];
      // portrait: its own hero arc, and a little less light over the text
      const keys = () => (window.innerWidth < window.innerHeight ? [PORTRAIT_HERO, ...KEYS.slice(1)] : KEYS);
      const dim = () => (window.innerWidth < window.innerHeight ? 0.75 : 1);
      const t0 = performance.now();
      let k = keyAt(window.scrollY);

      const frame = (now: number) => {
        const el2 = now - t0;
        // ease toward the scroll's shape, so a flick of the wheel glides
        const target = keyAt(window.scrollY);
        k += (target - k) * (reduced ? 1 : 0.09);
        const K = keys();
        const i = Math.min(K.length - 2, Math.floor(k));
        const f = smooth(Math.min(1, Math.max(0, k - i)));
        const A = K[i];
        const B = K[i + 1];
        ptr.x += (ptr.tx - ptr.x) * 0.04;
        ptr.y += (ptr.ty - ptr.y) * 0.04;
        for (let j = 0; j < 5; j++) {
          pts[j][0] = lerp(A.p[j][0], B.p[j][0], f) + ptr.x * 0.03;
          pts[j][1] = lerp(A.p[j][1], B.p[j][1], f) + ptr.y * 0.02;
          uP[j].value.set(pts[j][0], pts[j][1]);
        }
        const pinch = lerp(A.pinch, B.pinch, f);
        shared.uPinch.value = pinch;
        shared.uPinchW.value = lerp(A.pinchW, B.pinchW, f);
        shared.uEndW.value = lerp(A.endW, B.endW, f);
        let defocus = lerp(A.defocus, B.defocus, f);
        let glow = lerp(A.glow, B.glow, f) * dim();
        let coreI = lerp(A.core, B.core, f);

        if (!reduced) {
          // the start blast: the core flares, the fibres shoot out of it
          // blurred, then settle into focus
          const g = easeOut(el2 / 1500);
          shared.uGrow.value = g * 1.02;
          shared.uSpread.value = 0.18 + 0.82 * easeOut(el2 / 1700);
          defocus += (1 - easeOut(el2 / 1300)) * 0.9;
          const flare = 2.6 * Math.exp(-Math.pow((el2 - 220) / 260, 2));
          coreI = coreI * (0.15 + 0.85 * g) + flare;
          glow *= 0.4 + 0.6 * g;
          shared.uTime.value = el2 / 1000;
          bloom.strength = 0.8 + Math.exp(-Math.pow((el2 - 260) / 380, 2)) * 1.1;
        }
        shared.uDefocus.value = defocus;
        shared.uGlow.value = glow;
        const c = spineAt(pts, pinch);
        coreU.uCore.value.set(c[0] * shared.uRes.value.x, c[1] * shared.uRes.value.y);
        coreU.uCoreI.value = coreI;
        composer.render();
      };

      let raf = 0;
      let running = false;
      const loop = (now: number) => {
        frame(now);
        if (running) raf = requestAnimationFrame(loop);
      };
      const start = () => {
        if (running || document.hidden) return;
        running = true;
        raf = requestAnimationFrame(loop);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(raf);
      };
      // reduced motion: one still frame per scroll position, no flow
      let pending = 0;
      const onScrollStill = () => {
        cancelAnimationFrame(pending);
        pending = requestAnimationFrame((n) => frame(n));
      };
      const onVis = () => (document.hidden ? stop() : start());
      if (reduced) {
        frame(performance.now());
        window.addEventListener("scroll", onScrollStill, { passive: true });
      } else {
        start();
        document.addEventListener("visibilitychange", onVis);
      }

      cleanup = () => {
        stop();
        cancelAnimationFrame(pending);
        ro.disconnect();
        ScrollTrigger.removeEventListener("refresh", measure);
        window.removeEventListener("load", measure);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("scroll", onScrollStill);
        document.removeEventListener("visibilitychange", onVis);
        fg.dispose();
        fm.dispose();
        sg.dispose();
        sm.dispose();
        cg.dispose();
        cm.dispose();
        bloom.dispose();
        composer.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={host} className={className} aria-hidden="true" />;
}
