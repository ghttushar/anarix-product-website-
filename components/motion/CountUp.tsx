"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * A one-shot figure change. Renders `from` (legible without script), then
 * tweens to `to` once `play` turns true. Figures keep fixed digit positions
 * (tabular numerals plus a reserved width), so nothing around them reflows.
 */
export function CountUp({
  from,
  to,
  play,
  format,
  duration = 900,
  className,
  width,
}: {
  from: number;
  to: number;
  play: boolean;
  format: (n: number) => string;
  duration?: number;
  className?: string;
  /** reserved width in ch so the layout never shifts */
  width?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !play) return;
    if (reduced) {
      el.textContent = format(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 4);
      el.textContent = format(from + (to - from) * eased);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [play, reduced, from, to, duration, format]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums", display: "inline-block", minWidth: width ? `${width}ch` : undefined }}>
      {format(from)}
    </span>
  );
}
