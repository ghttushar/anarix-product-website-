"use client";

import { useEffect, useRef } from "react";
import f from "./energy-field.module.css";

/*
  The energy halo (Relay's flowing light, in Anarix colors): a ribbon of
  about 180 fine glowing fibres, periwinkle with coral threads and drifting
  specks, fixed behind the page. It follows you down the page: the ribbon's
  path turns with the scroll, bends with how fast you scroll, and leans
  toward the pointer. Every fibre point is computed on the GPU (WebGL2), so a
  frame only updates a handful of uniforms. It pauses when the tab is
  hidden. Reduced motion draws one still frame; without WebGL2 a still
  gradient stands in.
*/
const FIBRES = 180;
const SEGS = 120;
const SPECKS = 160;

const VERT = `#version 300 es
precision highp float;
in float a_u;
in float a_side;
in float a_fib;
uniform vec2 u_res;
uniform float u_time;
uniform float u_scroll;
uniform float u_vel;
uniform vec2 u_ptr;
uniform float u_width;
out float v_side;
out float v_u;
out float v_fib;

float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }

// the ribbon's spine, in 0..1 screen space; it turns as you scroll
vec2 spine(float u) {
  float s = u_scroll * 6.2831;
  float x = 1.18 - 1.36 * u + 0.08 * sin(u * 4.0 + s * 0.7);
  float y = -0.12 + 1.24 * u + (0.2 + 0.06 * sin(s * 0.5)) * sin(u * 4.6 + s + u_time * 0.05);
  // lean toward the pointer, most in the middle of the ribbon
  float bell = exp(-pow((u - 0.5) * 2.6, 2.0));
  return vec2(x, y) + (u_ptr - 0.5) * 0.07 * bell;
}

void main() {
  float u = a_u;
  float k = a_fib / ${FIBRES}.0;
  float spread = hash(a_fib) * 2.0 - 1.0;
  vec2 p = spine(u);
  vec2 q = spine(min(1.0, u + 0.004));
  vec2 asp = vec2(u_res.x / u_res.y, 1.0);
  vec2 d = normalize((q - p) * asp + 1e-5);
  vec2 n = vec2(-d.y, d.x) / asp;
  // the fibres twist through each other, wider where the ribbon is fast
  float w = (0.07 + 0.06 * sin(u * 3.1416)) * (1.0 + min(abs(u_vel), 1.5) * 0.6);
  float twist = cos(u * 7.0 + u_time * 0.22 + spread * 2.2 + hash(a_fib + 3.0) * 6.0);
  vec2 c = p + n * spread * w * (0.35 + 0.65 * twist);
  // and each one is a line drawn as a thin quad
  vec2 off = n * a_side * u_width / u_res.y * 2.0;
  vec2 clip = vec2(c.x * 2.0 - 1.0, 1.0 - c.y * 2.0) + off * vec2(1.0, -1.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  v_side = a_side;
  v_u = u;
  v_fib = a_fib;
}`;

const FRAG = `#version 300 es
precision highp float;
in float v_side;
in float v_u;
in float v_fib;
uniform float u_alpha;
out vec4 o;
float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
void main() {
  float edge = pow(1.0 - abs(v_side), 2.0);
  float ends = smoothstep(0.0, 0.18, v_u) * (1.0 - smoothstep(0.8, 1.0, v_u));
  float bright = 0.35 + 0.65 * hash(v_fib + 7.0);
  vec3 peri = vec3(0.545, 0.612, 0.941);
  vec3 coral = vec3(0.957, 0.427, 0.463);
  vec3 col = hash(v_fib + 11.0) < 0.24 ? coral : peri;
  col = mix(col, vec3(1.0), pow(bright, 6.0) * 0.6);
  float a = edge * ends * bright * u_alpha;
  o = vec4(col * a, a);
}`;

const PVERT = `#version 300 es
precision highp float;
in float a_i;
uniform vec2 u_res;
uniform float u_time;
uniform float u_scroll;
uniform vec2 u_ptr;
out float v_a;
float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
vec2 spine(float u) {
  float s = u_scroll * 6.2831;
  float x = 1.18 - 1.36 * u + 0.08 * sin(u * 4.0 + s * 0.7);
  float y = -0.12 + 1.24 * u + (0.2 + 0.06 * sin(s * 0.5)) * sin(u * 4.6 + s + u_time * 0.05);
  float bell = exp(-pow((u - 0.5) * 2.6, 2.0));
  return vec2(x, y) + (u_ptr - 0.5) * 0.07 * bell;
}
void main() {
  float u = fract(hash(a_i) + u_time * 0.004 * (0.5 + hash(a_i + 1.0)));
  vec2 p = spine(u) + (vec2(hash(a_i + 2.0), hash(a_i + 3.0)) - 0.5) * 0.22;
  gl_Position = vec4(p.x * 2.0 - 1.0, 1.0 - p.y * 2.0, 0.0, 1.0);
  gl_PointSize = (1.5 + hash(a_i + 4.0) * 3.0) * u_res.y / 900.0;
  v_a = 0.25 + 0.6 * hash(a_i + 5.0);
}`;

const PFRAG = `#version 300 es
precision highp float;
in float v_a;
out vec4 o;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.0, r) * v_a;
  vec3 col = vec3(0.78, 0.82, 1.0);
  o = vec4(col * a, a);
}`;

function program(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const make = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? "shader");
    return sh;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, make(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, make(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
  return p;
}

export function EnergyField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const fallback = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl2", { premultipliedAlpha: true, antialias: true, alpha: true });
    if (!gl) {
      fallback.current?.setAttribute("data-on", "true");
      cv.style.display = "none";
      return;
    }
    let fibres: WebGLProgram;
    let specks: WebGLProgram;
    try {
      fibres = program(gl, VERT, FRAG);
      specks = program(gl, PVERT, PFRAG);
    } catch {
      fallback.current?.setAttribute("data-on", "true");
      cv.style.display = "none";
      return;
    }

    // the fibres: one triangle strip each, built once
    const verts: number[] = [];
    const index: number[] = [];
    let base = 0;
    for (let i = 0; i < FIBRES; i++) {
      for (let s = 0; s <= SEGS; s++) {
        const u = s / SEGS;
        verts.push(u, -1, i, u, 1, i);
      }
      for (let s = 0; s < SEGS; s++) {
        const a = base + s * 2;
        index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
      base += (SEGS + 1) * 2;
    }
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const vb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    const ib = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(index), gl.STATIC_DRAW);
    const attr = (p: WebGLProgram, name: string, size: number, offset: number) => {
      const loc = gl.getAttribLocation(p, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 12, offset);
    };
    attr(fibres, "a_u", 1, 0);
    attr(fibres, "a_side", 1, 4);
    attr(fibres, "a_fib", 1, 8);

    const pvao = gl.createVertexArray();
    gl.bindVertexArray(pvao);
    const pb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Array.from({ length: SPECKS }, (_, i) => i)), gl.STATIC_DRAW);
    const ploc = gl.getAttribLocation(specks, "a_i");
    gl.enableVertexAttribArray(ploc);
    gl.vertexAttribPointer(ploc, 1, gl.FLOAT, false, 4, 0);
    gl.bindVertexArray(null);

    const U = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const fu = { res: U(fibres, "u_res"), time: U(fibres, "u_time"), scroll: U(fibres, "u_scroll"), vel: U(fibres, "u_vel"), ptr: U(fibres, "u_ptr"), width: U(fibres, "u_width"), alpha: U(fibres, "u_alpha") };
    const pu = { res: U(specks, "u_res"), time: U(specks, "u_time"), scroll: U(specks, "u_scroll"), ptr: U(specks, "u_ptr") };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE); // additive: light adds up where fibres cross

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = { scroll: 0, target: 0, vel: 0, ptr: [0.5, 0.5], ptrT: [0.5, 0.5], last: window.scrollY };
    let raf = 0;
    let running = false;
    let w = 0;
    let h = 0;

    const size = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = Math.round(window.innerWidth * dpr);
      h = Math.round(window.innerHeight * dpr);
      cv.width = w;
      cv.height = h;
      gl.viewport(0, 0, w, h);
    };

    const readScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      state.target = window.scrollY / max;
    };

    const draw = (t: number) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const dpr = w / window.innerWidth;
      gl.useProgram(fibres);
      gl.bindVertexArray(vao);
      gl.uniform2f(fu.res, w, h);
      gl.uniform1f(fu.time, t / 1000);
      gl.uniform1f(fu.scroll, state.scroll);
      gl.uniform1f(fu.vel, state.vel);
      gl.uniform2f(fu.ptr, state.ptr[0], state.ptr[1]);
      // a wide faint pass for the glow, then the fine bright cores
      gl.uniform1f(fu.width, 9 * dpr);
      gl.uniform1f(fu.alpha, 0.05);
      gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_INT, 0);
      gl.uniform1f(fu.width, 1.2 * dpr);
      gl.uniform1f(fu.alpha, 0.55);
      gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_INT, 0);
      gl.useProgram(specks);
      gl.bindVertexArray(pvao);
      gl.uniform2f(pu.res, w, h);
      gl.uniform1f(pu.time, t / 1000);
      gl.uniform1f(pu.scroll, state.scroll);
      gl.uniform2f(pu.ptr, state.ptr[0], state.ptr[1]);
      gl.drawArrays(gl.POINTS, 0, SPECKS);
    };

    const loop = (t: number) => {
      // ease toward where the page is, and remember how fast it got there
      const before = state.scroll;
      state.scroll += (state.target - state.scroll) * 0.06;
      state.vel += ((state.scroll - before) * 60 - state.vel) * 0.1;
      state.ptr[0] += (state.ptrT[0] - state.ptr[0]) * 0.05;
      state.ptr[1] += (state.ptrT[1] - state.ptr[1]) * 0.05;
      draw(t);
      if (running) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onScroll = () => readScroll();
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      state.ptrT = [e.clientX / window.innerWidth, e.clientY / window.innerHeight];
    };
    const onVis = () => (document.hidden ? stop() : start());
    const onResize = () => {
      size();
      if (!running) draw(performance.now());
    };

    size();
    readScroll();
    state.scroll = state.target;
    draw(performance.now());
    start();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      // free what this mount made; never lose the context (a remount in
      // development reuses the same canvas and its context)
      gl.deleteBuffer(vb);
      gl.deleteBuffer(ib);
      gl.deleteBuffer(pb);
      gl.deleteVertexArray(vao);
      gl.deleteVertexArray(pvao);
      gl.deleteProgram(fibres);
      gl.deleteProgram(specks);
    };
  }, []);

  return (
    <div className={f.field} aria-hidden="true" data-bleed>
      <canvas ref={ref} className={f.canvas} />
      <div ref={fallback} className={f.fallback} />
    </div>
  );
}
