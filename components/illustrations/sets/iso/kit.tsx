"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { useScreen } from "@/components/layout/Screen";
import { isoBox, isoCircle, isoCylinder, makeIso, type Pt } from "@/lib/iso";
import k from "./iso.module.css";

/*
  Soft Isometric Systems (DESIGN.md): every drawing is a labelled system
  (named inputs, the Anarix core where Aan docks, a named outcome), built
  from tonal blocks on the night sky. A stage sits quiet until its screen
  arrives, then "powers on": marked faces lift toward periwinkle (or coral)
  and one slow packet runs each cable. Words are type, never paths.
*/

export { makeIso, k as isoCss };
export type Iso = ReturnType<typeof makeIso>;
export type P3 = readonly [number, number, number];
export type Tone = "base" | "plate" | "quiet" | "data" | "hot" | "risk" | "glass";

/** world points → an svg path through them */
export const line3 = (iso: Iso, ps: readonly P3[]) => "M" + ps.map((p) => iso(p[0], p[1], p[2]).map((n) => n.toFixed(1)).join(",")).join(" L");

/** a percentage position for an AanDock standing on the screen point p */
export const dockAt = (p: Pt, w: number, h: number): CSSProperties => ({ left: `${(p[0] / w) * 100}%`, bottom: `${((h - p[1]) / h) * 100}%` });

/**
 * Writes --u (viewBox units per screen pixel) onto the stage so hairlines stay
 * one pixel and labels never render under 11px, whatever size it draws at.
 */
function useUnit(ref: RefObject<HTMLElement | null>, viewW: number) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      if (e.contentRect.width > 0) el.style.setProperty("--u", (viewW / e.contentRect.width).toFixed(3));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, viewW]);
}

/** the size Aan docks at, following its stage's rendered height (Aan draws at twice this) */
export function useDockSize(min: number, max: number, per: number) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(min);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(Math.round(Math.max(min, Math.min(max, e.contentRect.height * per)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [min, max, per]);
  return { box, size };
}

/**
 * The frame every isometric drawing sits in. It keeps the proportions, wires
 * play (inView) and power (arrived) to its screen, and holds the Aan dock.
 * `powered` forces the arrived look (a static preview, a button glyph).
 */
export function IsoStage({
  w,
  h,
  label,
  children,
  dock,
  className,
  style,
  powered,
  html,
}: {
  w: number;
  h: number;
  label: string;
  children: ReactNode;
  dock?: ReactNode;
  className?: string;
  style?: CSSProperties;
  powered?: boolean;
  /** flat HTML laid over the drawing (cards, figures), positioned in % */
  html?: ReactNode;
}) {
  const { inView, arrived } = useScreen();
  const box = useRef<HTMLDivElement>(null);
  useUnit(box, w);
  const on = powered ?? arrived;
  return (
    <div
      ref={box}
      className={`${k.stage} ${k.sized} ${className ?? ""}`}
      data-play={inView || powered ? "true" : "false"}
      data-arrived={on ? "true" : "false"}
      style={{ aspectRatio: `${w} / ${h}`, ...style } as CSSProperties}
    >
      <svg className={k.svg} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
        {children}
      </svg>
      {html}
      {dock}
    </div>
  );
}

type BlockProps = {
  iso: Iso;
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  z?: number;
  /** its colour at rest */
  tone?: Tone;
  /** the colour it lifts to once the stage is powered */
  power?: "hot" | "risk";
  /** entry order: blocks settle in one after another */
  i?: number;
  /** delay before it lifts, ms */
  lift?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/** a box: right, left and top faces, edged in one hairline */
export function Block({ iso, x, y, w, d, h, z = 0, tone = "base", power, i = 0, lift = 0, className, style, children }: BlockProps) {
  const b = isoBox(iso, x, y, w, d, h, z);
  return (
    <g className={`${k.b} ${className ?? ""}`} data-tone={tone} data-power={power} style={{ "--i": i, "--lift": `${lift}ms`, ...style } as CSSProperties}>
      <polygon points={b.right} className={k.r} />
      <polygon points={b.left} className={k.l} />
      <polygon points={b.top} className={k.t} />
      {children}
    </g>
  );
}

/** a short upright cylinder (Aan's plinth, a socket) */
export function Cyl({ iso, x, y, r, h, z = 0, tone = "base", power, i = 0, lift = 0 }: { iso: Iso; x: number; y: number; r: number; h: number; z?: number; tone?: Tone; power?: "hot" | "risk"; i?: number; lift?: number }) {
  const c = isoCylinder(iso, x, y, r, h, z);
  return (
    <g className={k.b} data-tone={tone} data-power={power} style={{ "--i": i, "--lift": `${lift}ms` } as CSSProperties}>
      <path d={c.side} className={k.l} />
      <path d={c.top} className={k.t} />
    </g>
  );
}

/** a ring lying on a surface */
export function Ring({ iso, x, y, r, z = 0, className }: { iso: Iso; x: number; y: number; r: number; z?: number; className?: string }) {
  return <path d={isoCircle(iso, x, y, r, z)} className={`${k.ring} ${className ?? ""}`} />;
}

/** faint engraved lines across a top face (a plate's grid) */
export function Grid({ iso, x, y, w, d, z, step }: { iso: Iso; x: number; y: number; w: number; d: number; z: number; step: number }) {
  const out: string[] = [];
  for (let gx = x + step; gx < x + w - 1; gx += step) out.push(line3(iso, [[gx, y, z], [gx, y + d, z]]));
  for (let gy = y + step; gy < y + d - 1; gy += step) out.push(line3(iso, [[x, gy, z], [x + w, gy, z]]));
  return <path d={out.join(" ")} className={k.grid} />;
}

/**
 * A cable between parts, routed along the world axes. Once powered it tints
 * and one slow packet runs it (dur ms, starting after delay ms), forever.
 */
export function Cable({ iso, path, tone = "hot", delay = 0, dur = 5200, flow = true }: { iso: Iso; path: readonly P3[]; tone?: "hot" | "risk"; delay?: number; dur?: number; flow?: boolean }) {
  const dd = line3(iso, path);
  return (
    <g className={k.cable} data-tone={tone} style={{ "--flow-delay": `${delay}ms`, "--flow-dur": `${dur}ms` } as CSSProperties}>
      <path d={dd} className={k.wire} />
      {flow && <path d={dd} pathLength={1} className={k.packet} />}
    </g>
  );
}

const FACE = { left: "0.866 0.5 0 1", right: "0.866 -0.5 0 1", top: "0.866 0.5 -0.866 0.5" } as const;

/**
 * Type printed on a face: "left" is the +y face, "right" the +x face, "top"
 * lies flat on a top face (reading along +x), like lettering on a floor.
 */
export function FaceText({ iso, x, y, z, face, children, size = 14, tone, anchor = "start" }: { iso: Iso; x: number; y: number; z: number; face: keyof typeof FACE; children: ReactNode; size?: number; tone?: "hot" | "risk" | "mono"; anchor?: "start" | "middle" | "end" }) {
  const [px, py] = iso(x, y, z);
  const m = `matrix(${FACE[face]} ${px.toFixed(1)} ${py.toFixed(1)})`;
  return (
    <text transform={m} className={k.face} data-tone={tone} textAnchor={anchor} style={{ "--fs": `${size}px` } as CSSProperties}>
      {children}
    </text>
  );
}

/**
 * A label in the margin with a hairline leader to the point it names.
 * `to` is the named point; the text sits at `at`.
 */
export function Tag({ at, to, children, anchor = "start", tone, size = 13, sub, i = 0 }: { at: Pt; to?: Pt; children: ReactNode; anchor?: "start" | "middle" | "end"; tone?: "hot" | "risk"; size?: number; sub?: ReactNode; i?: number }) {
  const gap = anchor === "end" ? 8 : anchor === "start" ? -8 : 0;
  return (
    <g className={k.tag} data-tone={tone} style={{ "--i": i } as CSSProperties}>
      {to && (
        <>
          <path d={`M${to[0].toFixed(1)},${to[1].toFixed(1)} L${(at[0] + gap).toFixed(1)},${(at[1] - size * 0.35).toFixed(1)}`} className={k.leader} />
          <circle cx={to[0]} cy={to[1]} r={2.6} className={k.pin} />
        </>
      )}
      {/* one text, so the sub line keeps its distance whatever size the type lands at */}
      <text x={at[0]} y={at[1]} textAnchor={anchor}>
        <tspan className={k.label} style={{ "--fs": `${size}px` } as CSSProperties}>
          {children}
        </tspan>
        {sub && (
          <tspan x={at[0]} dy="1.45em" className={k.sub} style={{ "--fs": `${Math.round(size * 0.86)}px` } as CSSProperties}>
            {sub}
          </tspan>
        )}
      </text>
    </g>
  );
}

/**
 * A floating card pinned to a point by a short stem: what changed, and what
 * it is worth. It is HTML laid over the stage (pass it as IsoStage's html),
 * so the card always fits its words at any size. `to` is in viewBox units.
 */
export function Callout({ to, w, h, title, sub, tone = "risk", lift = 30, mono = true, below = false }: { to: Pt; w: number; h: number; title: ReactNode; sub?: ReactNode; tone?: "risk" | "hot"; lift?: number; mono?: boolean; below?: boolean }) {
  return (
    <div className={k.callout} data-tone={tone} data-below={below ? "true" : undefined} style={{ left: `${(to[0] / w) * 100}%`, top: `${(to[1] / h) * 100}%`, "--lift": `${lift}px` } as CSSProperties}>
      <div className={k.card}>
        <b>{title}</b>
        {sub && <span className={mono ? k.mono : undefined}>{sub}</span>}
      </div>
    </div>
  );
}

/** the soft shadow a stage stands on */
export function Shadow({ iso, x, y, r, z = 0 }: { iso: Iso; x: number; y: number; r: number; z?: number }) {
  return <path d={isoCircle(iso, x, y, r, z)} className={k.shadow} />;
}
