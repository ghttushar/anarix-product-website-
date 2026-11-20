"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type RefObject } from "react";
import t from "./light-trails.module.css";

/*
  Long exposure: the site's one ambient motif. Slow trails of light stream in
  from the edges and converge on whatever matters on a screen (Aan, the alert,
  the profit figure). They draw on once when the screen arrives, then breathe.
  One trail can run coral, for the risk on that screen.

  The drawing stretches to its box (preserveAspectRatio none) with strokes
  that keep their width, so `to` is simply a percentage of the box.
  Reduced motion shows the trails already drawn and still.
*/
type From = "left" | "right" | "both";

/** a fixed spread, so the trails look the same on every visit */
const SPREAD = [0.08, 0.92, 0.3, 0.7, 0.16, 0.84, 0.46, 0.58, 0.24, 0.76, 0.38, 0.64];

function trail(i: number, n: number, from: From, tx: number, ty: number, bend: number, spread: [number, number]) {
  const left = from === "left" || (from === "both" && i % 2 === 0);
  const k = SPREAD[i % SPREAD.length];
  // start off the edge, spread top to bottom, a little beyond the box
  const x0 = left ? -60 : 1060;
  const y0 = (spread[0] + k * (spread[1] - spread[0])) * 600;
  const dx = tx - x0;
  // a long, flat approach that bends into the point late (car light trails)
  const c1x = x0 + dx * (0.42 + (i / n) * 0.12);
  const c1y = y0 + (ty - y0) * 0.08 * bend;
  const c2x = tx - dx * (0.22 - (i / n) * 0.06);
  const c2y = ty + (y0 - ty) * 0.18 * bend;
  return { d: `M${x0} ${y0} C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${tx} ${ty}`, x0, y0 };
}

export function LightTrails({
  to = [50, 50],
  aim,
  from = "both",
  count = 9,
  risk,
  bend = 1,
  spread = [-0.13, 1.13],
  glow = true,
  className,
  style,
}: {
  /** the point the light converges on, as [x%, y%] of the box */
  to?: [number, number];
  /** converge on this element instead (its centre), following layout changes */
  aim?: RefObject<HTMLElement | null>;
  from?: From;
  count?: number;
  /** index of the one coral trail (the risk on this screen) */
  risk?: number;
  /** 0 = straight lines in, 1 = the default sweep, more = deeper curves */
  bend?: number;
  /** where along the edge the trails start, top to bottom, as fractions of the height */
  spread?: [number, number];
  /** a soft pool of light where the trails meet */
  glow?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/:/g, "");
  const [on, setOn] = useState(false);
  const [live, setLive] = useState(true);
  const [aimed, setAimed] = useState<[number, number] | null>(null);

  // follow the element the light converges on (after commit: its ref may be
  // attached after this component in the same render)
  useEffect(() => {
    const svg = ref.current;
    const target = aim?.current;
    if (!svg || !target) return;
    const measure = () => {
      const b = svg.getBoundingClientRect();
      const r = target.getBoundingClientRect();
      if (!b.width || !b.height) return;
      const x = ((r.left + r.width / 2 - b.left) / b.width) * 100;
      const y = ((r.top + r.height / 2 - b.top) / b.height) * 100;
      setAimed((a) => (a && Math.abs(a[0] - x) < 0.2 && Math.abs(a[1] - y) < 0.2 ? a : [x, y]));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(svg);
    ro.observe(target);
    return () => ro.disconnect();
  }, [aim]);

  // draw on the first time the box is on screen; breathe only while it is
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setLive(e.isIntersecting);
        if (e.isIntersecting) setOn(true);
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pt = aimed ?? to;
  const tx = +(pt[0] * 10).toFixed(1);
  const ty = +(pt[1] * 6).toFixed(1);
  const paths = Array.from({ length: count }, (_, i) => trail(i, count, from, tx, ty, bend, spread));

  return (
    <svg
      ref={ref}
      className={`${t.trails} ${className ?? ""}`}
      style={style}
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      data-on={on ? "true" : "false"}
      data-live={live ? "true" : "false"}
      aria-hidden="true"
      focusable="false"
      data-bleed
    >
      <defs>
        {paths.map((p, i) => (
          <linearGradient key={i} id={`${uid}-g${i}`} gradientUnits="userSpaceOnUse" x1={p.x0} y1={p.y0} x2={tx} y2={ty}>
            <stop offset="0" stopColor={i === risk ? "var(--risk)" : "var(--accent)"} stopOpacity="0" />
            <stop offset="0.4" stopColor={i === risk ? "var(--risk)" : "var(--accent)"} stopOpacity="0.5" />
            <stop offset="1" stopColor={i === risk ? "var(--risk)" : "var(--accent)"} stopOpacity="1" />
          </linearGradient>
        ))}
        <radialGradient id={`${uid}-pool`}>
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.32" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {glow && <ellipse className={t.pool} cx={tx} cy={ty} rx="150" ry="110" fill={`url(#${uid}-pool)`} />}

      {/* the bloom: the same light, wide and faint */}
      <g className={t.bloom}>
        {paths.map((p, i) => (
          <path key={i} d={p.d} pathLength={1} stroke={`url(#${uid}-g${i})`} style={{ "--i": i } as CSSProperties} />
        ))}
      </g>
      {/* the trails themselves */}
      <g className={t.core}>
        {paths.map((p, i) => (
          <path key={i} d={p.d} pathLength={1} stroke={`url(#${uid}-g${i})`} data-risk={i === risk ? "true" : undefined} style={{ "--i": i } as CSSProperties} />
        ))}
      </g>
      {/* a short bright pulse running down each trail, now and then */}
      <g className={t.pulse}>
        {paths.map((p, i) => (
          <path key={i} d={p.d} pathLength={1} stroke={i === risk ? "var(--risk)" : "var(--accent)"} style={{ "--i": i } as CSSProperties} />
        ))}
      </g>
    </svg>
  );
}
