"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A number that lives: it sits at `bad` while the section is dormant, climbs to
 * `good` when Aan docks, then keeps drifting around `good` (±jitter) so the UI
 * never looks frozen. Writes straight to the DOM, no re-renders.
 */
export function Live({
  powered,
  bad,
  good,
  jitter = 0.02,
  every = 1600,
  decimals = 0,
  prefix = "",
  suffix = "",
  signed = false,
  tone = "none",
}: {
  powered: boolean;
  bad: number;
  good: number;
  jitter?: number;
  every?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  signed?: boolean;
  /** "sign": colour by sign · "state": colour by powered · "none" */
  tone?: "sign" | "state" | "none";
}) {
  const el = useRef<HTMLSpanElement>(null);
  const v = useRef({ n: bad });

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const paint = () => {
      const n = v.current.n;
      const abs = Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      const sign = n < 0 ? "−" : signed && n > 0 ? "+" : "";
      node.textContent = `${sign}${prefix}${abs}${suffix}`;
      if (tone === "sign") node.dataset.tone = n < 0 ? "bad" : "good";
      if (tone === "state") node.dataset.tone = powered ? "good" : "bad";
    };
    const rm = reduced();
    const tweens: gsap.core.Tween[] = [];
    let timer = 0;
    tweens.push(
      gsap.to(v.current, {
        n: powered ? good : bad,
        duration: rm ? 0 : powered ? 1.6 : 0.5,
        ease: powered ? "expo.out" : "power2.inOut",
        delay: powered && !rm ? 0.35 : 0,
        onUpdate: paint,
        onComplete: () => {
          if (!powered || rm) return;
          timer = window.setInterval(() => {
            const span = Math.abs(good) * jitter || jitter;
            tweens.push(gsap.to(v.current, { n: good + (Math.random() - 0.4) * 2 * span, duration: 0.9, ease: "sine.inOut", onUpdate: paint }));
          }, every + Math.random() * 400);
        },
      }),
    );
    paint();
    return () => {
      window.clearInterval(timer);
      tweens.forEach((t) => t.kill());
    };
  }, [powered, bad, good, jitter, every, decimals, prefix, suffix, signed, tone]);

  return <span ref={el} className="live tabular" />;
}

/** a counter that ticks up while powered (packets processed, rule runs…) */
export function Ticker({ powered, from, rate = 3, every = 900 }: { powered: boolean; from: number; rate?: number; every?: number }) {
  const [n, setN] = useState(from);
  useEffect(() => {
    if (!powered || reduced()) return;
    const id = window.setInterval(() => setN((x) => x + 1 + Math.floor(Math.random() * rate)), every);
    return () => window.clearInterval(id);
  }, [powered, rate, every]);
  return <span className="tabular">{n.toLocaleString("en-US")}</span>;
}

/**
 * A sparkline series: flat and sagging while dormant; when powered it climbs and
 * then keeps streaming new points so the line scrolls.
 */
export function useSeries(powered: boolean, length = 24) {
  const flat = () => Array.from({ length }, (_, i) => 0.28 - i * 0.004 + Math.sin(i * 1.7) * 0.015);
  const [pts, setPts] = useState<number[]>(flat);
  useEffect(() => {
    if (!powered) {
      setPts(flat());
      return;
    }
    if (reduced()) {
      setPts(Array.from({ length }, (_, i) => 0.3 + (i / length) * 0.55));
      return;
    }
    let step = 0;
    const id = window.setInterval(() => {
      step++;
      setPts((p) => {
        const last = p[p.length - 1];
        const climb = step < length ? 0.035 : 0;
        const target = step < length ? last + climb : 0.78;
        const next = Math.max(0.12, Math.min(0.94, target + (Math.random() - 0.45) * 0.08 + (0.78 - last) * (step < length ? 0 : 0.18)));
        return [...p.slice(1), next];
      });
    }, 260);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [powered, length]);
  return pts;
}

export function Spark({ pts, className = "" }: { pts: number[]; className?: string }) {
  const w = 240;
  const h = 56;
  const step = w / (pts.length - 1);
  const xy = pts.map((p, i) => [i * step, h - p * h] as const);
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg className={`spark ${className}`} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={`${line} L${w},${h} L0,${h} Z`} className="spark__area" />
      <path d={line} className="spark__line" />
      <circle cx={xy[xy.length - 1][0]} cy={xy[xy.length - 1][1]} r="3" className="spark__dot" />
    </svg>
  );
}
