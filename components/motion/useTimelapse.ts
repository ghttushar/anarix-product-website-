"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A time-lapse clock for screens like the Night Watch: plays a span of minutes
 * over `duration` ms, holds briefly at named moments, and can be paused or
 * scrubbed. The frame loop runs only while playing; React re-renders only when
 * the current hold index changes, everything else is written through onFrame.
 */
export function useTimelapse({
  from,
  to,
  duration,
  holds = [],
  holdMs = 900,
  step: stateStep = 1,
  onFrame,
}: {
  from: number;
  to: number;
  duration: number;
  holds?: number[];
  holdMs?: number;
  /** React state granularity in minutes (frames still go to onFrame) */
  step?: number;
  onFrame?: (minute: number) => void;
}) {
  const [minute, setMinuteState] = useState(from);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  const clock = useRef({ m: from, last: 0, holdUntil: 0, nextHold: 0 });
  const frame = useRef(onFrame);
  frame.current = onFrame;

  const set = useCallback(
    (m: number, force = false) => {
      clock.current.m = m;
      frame.current?.(m);
      setMinuteState((prev) => (force || Math.floor(prev / stateStep) !== Math.floor(m / stateStep) ? m : prev));
    },
    [stateStep],
  );

  const step = useCallback(
    (now: number) => {
      const c = clock.current;
      const dt = c.last ? now - c.last : 0;
      c.last = now;
      if (now < c.holdUntil) {
        raf.current = requestAnimationFrame(step);
        return;
      }
      let m = c.m + ((to - from) / duration) * dt;
      const hold = holds.find((h) => h > c.m && h <= m);
      if (hold !== undefined) {
        c.holdUntil = now + holdMs;
        set(hold, true);
        raf.current = requestAnimationFrame(step);
        return;
      }
      if (m >= to) {
        set(to, true);
        setPlaying(false);
        return;
      }
      set(m);
      raf.current = requestAnimationFrame(step);
    },
    [from, to, duration, holds, holdMs, set],
  );

  const play = useCallback(() => {
    if (clock.current.m >= to) set(from, true);
    clock.current.last = 0;
    clock.current.holdUntil = 0;
    setPlaying(true);
  }, [from, to, set]);

  const pause = useCallback(() => setPlaying(false), []);

  const seek = useCallback(
    (m: number) => {
      setPlaying(false);
      set(Math.max(from, Math.min(to, m)), true);
    },
    [from, to, set],
  );

  useEffect(() => {
    if (!playing) return;
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, step]);

  // pause when the tab is hidden
  useEffect(() => {
    const vis = () => document.hidden && setPlaying(false);
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, []);

  return { minute, playing, play, pause, seek, done: minute >= to };
}
