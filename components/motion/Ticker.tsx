"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A figure that rolls to its new value (Stripe-style), easing out. Under
 * reduced motion it changes at once. Tabular figures keep it from jittering.
 */
export function Ticker({
  value,
  from: start0,
  play = true,
  format = (n) => n.toLocaleString("en-US"),
  duration = 650,
  className,
}: {
  value: number;
  /** count up from here once `play` turns true (the page renders the final figure) */
  from?: number;
  play?: boolean;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(value);
  const from = useRef(start0 ?? value);
  useEffect(() => {
    if (!play) return;
    const start = from.current;
    if (start === value) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = value;
      setShown(value);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      const v = Math.round(start + (value - start) * e);
      from.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, play]);
  return (
    <span className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {format(shown)}
    </span>
  );
}
