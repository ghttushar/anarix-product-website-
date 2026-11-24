"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/*
  The world inside Aan's diamond: a dense sphere of light (about 16,000
  points of periwinkle, coral and white) breathing on a noisy shell and
  turning slowly, like the reference's particle sphere. three.js loads only
  when this mounts. The scroll scene drives it through the handle:
  live(true/false) starts and stops drawing, disperse(0..1) blows the
  specks outward and fades them.
*/
export type SphereHandle = { live: (on: boolean) => void; disperse: (v: number) => void };

const N = 22000;

const VERT = /* glsl */ `
uniform float uTime;
uniform float uDisperse;
uniform float uPx;
attribute float aSeed;
attribute vec3 aColor;
varying vec3 vColor;
varying float vAlpha;
float hash(float n) { return fract(sin(n) * 43758.5453); }
void main() {
  vec3 p = position;
  // a living shell: lumps that move over the surface
  float n = sin(p.x * 4.1 + uTime * 0.6) + sin(p.y * 3.7 - uTime * 0.45) + sin(p.z * 4.3 + uTime * 0.5);
  p *= 1.0 + 0.035 * n;
  // blown outward as the page moves on
  p *= 1.0 + uDisperse * (0.8 + 2.4 * hash(aSeed));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uPx * (0.6 + hash(aSeed * 1.7) * 1.6) * (3.2 / -mv.z);
  vColor = aColor;
  // the rim reads brighter, as on a lit shell
  vec3 c = (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  float rim = 1.0 - abs(normalize(mv.xyz - c).z);
  vAlpha = (0.3 + 0.7 * hash(aSeed * 3.1)) * (0.55 + 0.9 * rim) * (1.0 - uDisperse * 0.85);
}`;

const FRAG = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vColor, vAlpha * smoothstep(0.5, 0.1, d));
}`;

export const ParticleSphere = forwardRef<SphereHandle, { className?: string }>(function ParticleSphere({ className }, ref) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ live: boolean; disperse: number; start?: () => void; stop?: () => void }>({ live: false, disperse: 0 });

  useImperativeHandle(ref, () => ({
    live: (on) => {
      api.current.live = on;
      if (on) api.current.start?.();
      else api.current.stop?.();
    },
    disperse: (v) => {
      api.current.disperse = v;
    },
  }));

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const THREE = await import("three");
      const el = host.current;
      if (disposed || !el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.z = 4.2;

      const pos = new Float32Array(N * 3);
      const col = new Float32Array(N * 3);
      const seed = new Float32Array(N);
      const peri = new THREE.Color("#8b9cf0");
      const coral = new THREE.Color("#f46d76");
      const white = new THREE.Color("#ffffff");
      let s = 9;
      const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
      for (let i = 0; i < N; i++) {
        // even points on a sphere, a little thickness
        const u = rnd() * 2 - 1;
        const t = rnd() * Math.PI * 2;
        const r = 1 + (rnd() - 0.5) * 0.08;
        const q = Math.sqrt(1 - u * u);
        pos[i * 3] = q * Math.cos(t) * r;
        pos[i * 3 + 1] = u * r;
        pos[i * 3 + 2] = q * Math.sin(t) * r;
        const c = rnd() < 0.45 ? peri : rnd() < 0.5 ? coral : white;
        col[i * 3] = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;
        seed[i] = rnd() * 100;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uDisperse: { value: 0 }, uPx: { value: 2 } },
      });
      const points = new THREE.Points(geo, mat);
      points.rotation.x = 0.35;
      scene.add(points);

      const size = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / Math.max(1, h);
        camera.updateProjectionMatrix();
        mat.uniforms.uPx.value = Math.max(1.6, (h / 900) * 2.2) * renderer.getPixelRatio();
      };
      size();
      const ro = new ResizeObserver(size);
      ro.observe(el);

      let raf = 0;
      let running = false;
      const frame = (t: number) => {
        mat.uniforms.uTime.value = t / 1000;
        mat.uniforms.uDisperse.value += (api.current.disperse - mat.uniforms.uDisperse.value) * 0.12;
        points.rotation.y = t * 0.00012;
        renderer.render(scene, camera);
        if (running) raf = requestAnimationFrame(frame);
      };
      api.current.start = () => {
        if (running) return;
        if (reduced) {
          frame(0);
          return;
        }
        running = true;
        raf = requestAnimationFrame(frame);
      };
      api.current.stop = () => {
        running = false;
        cancelAnimationFrame(raf);
      };
      if (api.current.live) api.current.start();
      else frame(0);

      cleanup = () => {
        api.current.stop?.();
        ro.disconnect();
        geo.dispose();
        mat.dispose();
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
});
