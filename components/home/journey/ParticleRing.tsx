"use client";

import { useEffect, useRef } from "react";

/*
  The world inside Aan's diamond: a slow ring of light specks (coral, the
  periwinkle of the long exposure, and white) turning in space, the way the
  reference's particle sphere waits behind its star. Canvas 2D, about 2,400
  specks, drawn only while `live` and on screen; reduced motion draws it
  once and leaves it still.
*/
const N = 2400;
const COLORS = ["#f46d76", "#8b9cf0", "#c9d1ff", "#ffffff"];

type Speck = { th: number; ph: number; s: number; c: string; drift: number };

export function ParticleRing({ live, className }: { live: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const specks = useRef<Speck[]>([]);

  useEffect(() => {
    if (!specks.current.length) {
      // a fixed spread, so the ring looks the same on every visit
      let seed = 7;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      specks.current = Array.from({ length: N }, () => ({
        th: rnd() * Math.PI * 2,
        ph: rnd() * Math.PI * 2,
        s: 0.8 + rnd() * 1.8,
        c: COLORS[Math.floor(rnd() * (rnd() < 0.55 ? 2 : 4))],
        drift: 0.6 + rnd() * 0.8,
      }));
    }
  }, []);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let on = false;
    let w = 0;
    let h = 0;

    const size = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const r = cv.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const m = Math.min(w, h);
      const R = m * 0.3;
      const r = m * 0.12;
      const rot = t * 0.00009;
      const tilt = 1.12;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      const cx = w / 2;
      const cy = h / 2;
      for (const p of specks.current) {
        const th = p.th + rot * p.drift;
        const ph = p.ph + t * 0.0002 * p.drift;
        const ring = R + r * Math.cos(ph);
        const x = ring * Math.cos(th);
        const y = ring * Math.sin(th);
        const z = r * Math.sin(ph);
        const yy = y * ct - z * st;
        const zz = y * st + z * ct;
        const k = 700 / (700 + zz);
        ctx.globalAlpha = Math.max(0.25, Math.min(1, 0.8 - zz / (R * 1.4)));
        ctx.fillStyle = p.c;
        const s = p.s * k;
        ctx.fillRect(cx + x * k - s / 2, cy + yy * k - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
      if (on) raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (on || reduced) return;
      on = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      on = false;
      cancelAnimationFrame(raf);
    };

    size();
    draw(0);
    const ro = new ResizeObserver(() => {
      size();
      draw(performance.now());
    });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting && live ? start() : stop()));
    io.observe(cv);
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, [live]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
