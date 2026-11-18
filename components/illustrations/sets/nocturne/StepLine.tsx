"use client";

import { useEffect, useRef, useState } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import type { Step } from "@/content/products/types";
import { Drawing, d, g } from "./kit";
import { GLYPHS } from "./glyphs";
import s from "./stepline.module.css";

/*
  How it works: one continuous ground line with the three steps standing on
  it. Aan walks from step to step; each step's periwinkle strokes settle as
  Aan reaches it. viewBox 1200 × 150, ground at y = 136.
*/
const H = 150;
const BASE = 136;
// wide: one long line under three columns; compact (phones): the same three
// steps closer together, drawn a little smaller
const LAYOUT = {
  wide: { w: 1200, xs: [200, 600, 1000], dx: 92, k: 1 },
  compact: { w: 600, xs: [92, 300, 508], dx: 70, k: 0.8 },
};

export function StepLine({ steps, step, stop, compact = false }: { steps: Step[]; step: number; stop: string; compact?: boolean }) {
  const L = compact ? LAYOUT.compact : LAYOUT.wide;
  const W = L.w;
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(40);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(Math.round(Math.max(28, Math.min(48, e.contentRect.height * 0.3)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const x = L.xs[step] + L.dx;
  const cls = { on: s.on, off: s.off };

  return (
    <div ref={box}>
      <Drawing
        w={W}
        h={H}
        label={`Three steps on one line: ${steps.map((st) => st.title).join(", then ")}. Aan walks from one to the next.`}
        dock={<AanDock stop={stop} at={String(step)} size={size} bubble={steps[step].bubble} side="right" style={{ left: `${(x / W) * 100}%`, bottom: `${((H - BASE) / H) * 100}%` }} />}
      >
        <g {...g(0)}>
          <line {...d()} x1={0} y1={BASE} x2={W} y2={BASE} />
        </g>
        {steps.map((st, i) => (
          <g key={st.title} {...g(1 + i)} className={s.glyph} data-reached={i <= step ? "true" : "false"} transform={`translate(${L.xs[i]} ${BASE}) scale(${L.k})`}>
            {GLYPHS[st.glyph](cls)}
          </g>
        ))}
      </Drawing>
    </div>
  );
}
