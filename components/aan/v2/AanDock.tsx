"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { useAanRegistry, type AanEntry } from "./AanProvider";
import s from "./aan-v2.module.css";

/**
 * A reserved place for Aan inside a drawing. It draws nothing itself: the one
 * travelling Aan lands here when its screen reaches the middle of the viewport.
 * Position it with `style` (percentages of the drawing).
 */
export function AanDock({
  stop,
  size,
  sizeSm,
  bubble,
  side = "left",
  entry,
  at,
  travel = "walk",
  style,
}: {
  stop: string;
  size: number;
  sizeSm?: number;
  /** what Aan says once docked; 28 characters or fewer */
  bubble?: string;
  /** which side of Aan the bubble opens to */
  side?: "left" | "right";
  /** first arrival walks in from dx px away (the hero street) */
  entry?: AanEntry;
  /** the dock's current spot in its screen; change it to move Aan */
  at?: string;
  /** how Aan gets to a moved dock */
  travel?: "fly" | "walk";
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const registry = useAanRegistry();
  const dx = entry?.dx;
  const delay = entry?.delay;
  const duration = entry?.duration;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !registry) return;
    return registry.register({
      stop,
      el,
      section: el.closest<HTMLElement>("[data-screen]"),
      size,
      sizeSm,
      bubble,
      side,
      entry: dx !== undefined ? { dx, delay: delay ?? 0, duration: duration ?? 1200 } : undefined,
      at,
      travel,
    });
  }, [registry, stop, size, sizeSm, bubble, side, dx, delay, duration, at, travel]);

  return <span ref={ref} className={s.dock} data-aan-dock={stop} style={{ ...style, width: size, height: size }} aria-hidden="true" />;
}
