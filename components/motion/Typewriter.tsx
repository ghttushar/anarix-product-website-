"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Types `text` in once `play` turns true. Without script the full text is
 * there; with script it waits (empty) for its moment; under reduced motion it
 * appears whole. The full text always holds its space, so nothing reflows.
 */
export function Typewriter({ text, play, cps = 46, delay = 0, className }: { text: string; play: boolean; cps?: number; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(text.length);
  const [armed, setArmed] = useState(false);

  // once script runs, hide the text until its moment
  useEffect(() => {
    if (!reduced && !play) setN(0);
    setArmed(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!armed || !play) return;
    if (reduced) {
      setN(text.length);
      return;
    }
    let raf = 0;
    let t0 = 0;
    const step = (now: number) => {
      if (!t0) t0 = now + delay;
      const k = Math.max(0, now - t0);
      const next = Math.min(text.length, Math.floor((k / 1000) * cps));
      setN(next);
      if (next < text.length) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [armed, play, reduced, text, cps, delay]);

  return (
    <span className={className} style={{ display: "grid" }}>
      <span className="sr-only">{text}</span>
      <span style={{ gridArea: "1 / 1", visibility: "hidden" }} aria-hidden="true">
        {text}
      </span>
      <span style={{ gridArea: "1 / 1" }} aria-hidden="true">
        {text.slice(0, n)}
      </span>
    </span>
  );
}
