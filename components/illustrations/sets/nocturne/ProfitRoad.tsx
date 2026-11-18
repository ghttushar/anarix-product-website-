"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import { Drawing, Label, d, fx, g } from "./kit";

/*
  Profitability: revenue lies, profit doesn't. One line starts at sales and
  steps down at every cost, each drop drawn to scale from the card's own
  figures ($5,235 sales − fees, ads, refunds and COGS = $1,568 profit). Aan
  stands on the last ledge, the profit that is really left.
  Names sit under the ground line, like a chart's axis.
  viewBox 640 × 214, ground at y = 190.
*/
const W = 640;
const H = 214;
const BASE = 190;
const SCALE = 150 / 5235;
const STEPS = [
  { k: "Fees", v: 1151, x: 150 },
  { k: "Ads", v: 288, x: 270 },
  { k: "Refunds", v: 412, x: 390 },
  { k: "COGS", v: 1816, x: 510 },
];
const AAN_X = 572;

export function ProfitRoad({ stop = "profitability", bubble }: { stop?: string; bubble?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(36);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(Math.round(Math.max(26, Math.min(44, e.contentRect.height * 0.2)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  let y = BASE - 150;
  const ledges: { x0: number; x1: number; y: number }[] = [];
  const drops: { x: number; y0: number; y1: number; k: string }[] = [];
  let x0 = 24;
  for (const s of STEPS) {
    ledges.push({ x0, x1: s.x, y });
    const y1 = y + s.v * SCALE;
    drops.push({ x: s.x, y0: y, y1, k: s.k });
    y = y1;
    x0 = s.x;
  }
  const profitY = y;

  return (
    <div ref={box}>
      <Drawing
        w={W}
        h={H}
        label="A line that starts at sales and steps down at fees, ads, refunds and cost of goods, ending at the profit that is left. Aan stands on the profit ledge."
        dock={<AanDock stop={stop} size={size} bubble={bubble} side="left" style={{ left: `${(AAN_X / W) * 100}%`, bottom: `${((H - profitY) / H) * 100}%` }} />}
      >
        <g {...g(0)}>
          <line {...d()} x1={-40} y1={BASE} x2={W + 40} y2={BASE} />
        </g>
        <g {...g(1)}>
          {ledges.map((l, i) => (
            <line key={i} {...d()} x1={l.x0} y1={l.y} x2={l.x1} y2={l.y} />
          ))}
          <line {...d(fx.hot)} x1={STEPS[STEPS.length - 1].x} y1={profitY} x2={W - 24} y2={profitY} style={{ "--hot-delay": "500ms" } as CSSProperties} />
        </g>
        {drops.map((dr, i) => (
          <g key={dr.k} {...g(2 + i)}>
            <line {...d(fx.warn)} x1={dr.x} y1={dr.y0} x2={dr.x} y2={dr.y1} style={{ "--hot-delay": `${i * 120}ms` } as CSSProperties} />
            <line x1={dr.x} y1={dr.y1} x2={dr.x} y2={BASE} className={fx.dots} />
            <Label x={dr.x} y={BASE + 18} size={12}>
              {dr.k}
            </Label>
          </g>
        ))}
        <Label x={(24 + STEPS[0].x) / 2} y={BASE + 18} size={12}>
          Sales
        </Label>
        <Label x={(STEPS[STEPS.length - 1].x + W - 24) / 2} y={BASE + 18} size={12} className={fx.accentText}>
          Profit
        </Label>
      </Drawing>
    </div>
  );
}
