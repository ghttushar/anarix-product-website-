"use client";

import { useEffect, useRef } from "react";

/**
 * Hero backdrop ported from the Anarix website
 * (anarix-website-final-state · components/home/HeroDataViz.tsx):
 * a grid of brand-coloured particles that link up when close, breathe,
 * and drift away from the cursor, with a soft pulsing glow behind.
 */
const PARTICLE_COUNT = 120;
const CONNECTION_DIST = 150;
const GRID_CELL = CONNECTION_DIST;
const BRAND_HUE = 231;
const BRAND_SAT = 66;
const BRAND_LIGHT = 55;
const ACCENT_HUE = 233;
const ACCENT_SAT = 74;
const ACCENT_LIGHT = 80;
const CORAL_HUE = 355;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  hue: number;
  sat: number;
  light: number;
  radius: number;
  alpha: number;
  pulseOffset: number;
}

export function HeroDataViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let size = { w: 0, h: 0 };
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let running = false;
    let visible = true;
    let reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const init = (w: number, h: number) => {
      const p: Particle[] = [];
      const cols = 14;
      const rows = 8;
      const gapX = w / (cols + 1);
      const gapY = h / (rows + 1);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const baseX = gapX * (c + 1) + (Math.random() - 0.5) * 18;
          const baseY = gapY * (r + 1) + (Math.random() - 0.5) * 18;
          const roll = Math.random();
          const isCoral = roll < 0.06;
          const isAccent = !isCoral && roll < 0.34;
          p.push({
            x: baseX,
            y: baseY,
            vx: 0,
            vy: 0,
            baseX,
            baseY,
            hue: isCoral ? CORAL_HUE : isAccent ? ACCENT_HUE : BRAND_HUE,
            sat: isCoral ? 84 : isAccent ? ACCENT_SAT : BRAND_SAT,
            light: isCoral ? 70 : isAccent ? ACCENT_LIGHT + Math.random() * 8 : BRAND_LIGHT + Math.random() * 15,
            radius: isAccent || isCoral ? 2 + Math.random() * 1.5 : 1 + Math.random() * 1.5,
            alpha: 0.5 + Math.random() * 0.5,
            pulseOffset: Math.random() * Math.PI * 2,
          });
        }
      }
      particles = p.slice(0, PARTICLE_COUNT);
    };

    const draw = () => {
      const { w, h } = size;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      if (reduced) return;
      const now = performance.now();

      const cx = w * 0.62;
      const cy = h * 0.45;
      const pulse = Math.sin(now * 0.00072) * 0.3 + 0.7;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 260);
      grad.addColorStop(0, `hsla(${BRAND_HUE}, 60%, 70%, ${0.08 * pulse})`);
      grad.addColorStop(0.5, `hsla(${BRAND_HUE}, 60%, 70%, ${0.03 * pulse})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 260, 0, Math.PI * 2);
      ctx.fill();

      for (const p of particles) {
        p.vx += (p.baseX - p.x) * 0.006;
        p.vy += (p.baseY - p.y) * 0.006;
        p.vx *= 0.93;
        p.vy *= 0.93;
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 200 && md > 0) {
          const force = ((200 - md) / 200) * 0.8;
          p.vx += (mdx / md) * force;
          p.vy += (mdy / md) * force;
        }
        p.x += p.vx;
        p.y += p.vy;
      }

      // spatial hash so only nearby pairs are tested
      const cols = Math.ceil(w / GRID_CELL) + 1;
      const rows = Math.ceil(h / GRID_CELL) + 1;
      const grid: number[][][] = Array.from({ length: cols }, () => Array.from({ length: rows }, () => [] as number[]));
      particles.forEach((p, i) => {
        const gx = Math.floor(p.x / GRID_CELL);
        const gy = Math.floor(p.y / GRID_CELL);
        if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) grid[gx][gy].push(i);
      });
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const gx = Math.floor(a.x / GRID_CELL);
        const gy = Math.floor(a.y / GRID_CELL);
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = gx + dx;
            const ny = gy + dy;
            if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
            for (const j of grid[nx][ny]) {
              if (j <= i) continue;
              const b = particles[j];
              const d = Math.hypot(a.x - b.x, a.y - b.y);
              if (d >= CONNECTION_DIST) continue;
              const alpha = (1 - d / CONNECTION_DIST) * 0.25;
              if (alpha < 0.02) continue;
              ctx.strokeStyle = `hsla(${BRAND_HUE}, 60%, 65%, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      for (const p of particles) {
        const pa = p.alpha * (0.7 + Math.sin(now * 0.00096 + p.pulseOffset) * 0.3);
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${pa})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        if (pa > 0.4) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
          glow.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${pa * 0.3})`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const section = canvas.closest("section");
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = section ? section.clientWidth : window.innerWidth;
      const h = section ? section.offsetHeight : window.innerHeight;
      if (w === size.w && h === size.h) return;
      size = { w, h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init(w, h);
      draw();
    };
    resize();
    window.addEventListener("resize", resize);
    const ro = section ? new ResizeObserver(resize) : null;
    if (section) ro?.observe(section);

    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const io = section
      ? new IntersectionObserver(
          ([e]) => {
            visible = e?.isIntersecting ?? true;
            if (visible && !reduced) start();
            else stop();
          },
          { rootMargin: "200px" },
        )
      : null;
    if (section) io?.observe(section);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPref = (e: MediaQueryListEvent) => {
      reduced = e.matches;
      if (reduced) {
        stop();
        draw();
      } else if (visible) start();
    };
    mq.addEventListener("change", onPref);
    if (!reduced) start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      ro?.disconnect();
      io?.disconnect();
      mq.removeEventListener("change", onPref);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="hero__viz"
      style={{ maskImage: "radial-gradient(ellipse 90% 85% at 55% 45%, black 20%, transparent 85%)" }}
    />
  );
}
