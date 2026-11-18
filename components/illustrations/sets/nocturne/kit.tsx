"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { useScreen } from "@/components/layout/Screen";
import art from "../../lineart.module.css";
import k from "./kit.module.css";

/* Shared pieces of the City Nocturne drawings (docs/redesign/02-principles.md). */

/** a stroke that draws itself: pathLength 1 + the draw class (+ extra classes) */
export const d = (cls?: string) => ({ pathLength: 1, className: cls ? `${art.d} ${cls}` : art.d });

/** draw-order group: strokes inside draw after `i` × stagger */
export const g = (i: number) => ({ style: { "--i": i } as CSSProperties });

export { art };
export const fx = k;

/** the family's one line weight, in screen pixels */
export const HAIRLINE = 1.4;

/**
 * Keeps a drawing's strokes at HAIRLINE px whatever size it renders at, by
 * writing --stroke (viewBox units) onto the box. Strokes cannot use
 * non-scaling-stroke: it breaks the pathLength draw-on.
 */
export function useHairline(ref: RefObject<HTMLElement | null>, viewW: number) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      if (e.contentRect.width > 0) el.style.setProperty("--stroke", ((HAIRLINE * viewW) / e.contentRect.width).toFixed(3));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, viewW]);
}

export function scallops(x0: number, x1: number, y: number, n: number) {
  const step = (x1 - x0) / n;
  const r = step / 2;
  let p = `M${x0} ${y}`;
  for (let i = 0; i < n; i++) p += ` a${r} ${r} 0 0 0 ${step} 0`;
  return p;
}

export function Windows({ x, y, cols, rows, w = 14, h = 18, gx = 12, gy = 10, seed = 0, every = 6 }: { x: number; y: number; cols: number; rows: number; w?: number; h?: number; gx?: number; gy?: number; seed?: number; every?: number }) {
  const out = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const lit = (r * 7 + c * 3 + seed) % every === 0;
      out.push(<rect {...d(`${art.win} ${lit ? art.lit : ""}`)} key={`${r}-${c}`} x={x + c * (w + gx)} y={y + r * (h + gy)} width={w} height={h} />);
    }
  return <>{out}</>;
}

export function Tree({ x, base, s = 1 }: { x: number; base: number; s?: number }) {
  return (
    <>
      <line {...d()} x1={x} y1={base} x2={x} y2={base - 30 * s} />
      <ellipse {...d(art.body)} cx={x} cy={base - 48 * s} rx={15 * s} ry={22 * s} />
      <line {...d()} x1={x} y1={base - 30 * s} x2={x} y2={base - 52 * s} />
    </>
  );
}

/** a word on the drawing: type, never paths */
export function Label({ x, y, children, size = 13, anchor = "middle", className }: { x: number; y: number; children: ReactNode; size?: number; anchor?: "start" | "middle" | "end"; className?: string }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} className={`${art.label} ${className ?? ""}`} style={{ "--fs": `${size}px` } as CSSProperties}>
      {children}
    </text>
  );
}

/**
 * The frame every drawing sits in: keeps its proportions, wires the draw-on to
 * its screen (inView) and the moment to Aan's arrival (arrived), and holds the
 * Aan dock above the SVG.
 */
export function Drawing({ w, h, label, stroke = 1.5, children, dock, className, style }: { w: number; h: number; label: string; stroke?: number; children: ReactNode; dock?: ReactNode; className?: string; style?: CSSProperties }) {
  const { inView, arrived } = useScreen();
  const box = useRef<HTMLDivElement>(null);
  useHairline(box, w);
  return (
    <div
      ref={box}
      className={`${k.box} ${className ?? ""}`}
      data-play={inView ? "true" : "false"}
      data-arrived={arrived ? "true" : "false"}
      style={{ aspectRatio: `${w} / ${h}`, "--stroke": stroke, ...style } as CSSProperties}
    >
      <svg className={art.art} viewBox={`0 0 ${w} ${h}`} data-play={inView ? "true" : "false"} role="img" aria-label={label}>
        {children}
      </svg>
      {dock}
    </div>
  );
}
