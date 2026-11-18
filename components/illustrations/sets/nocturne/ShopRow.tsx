"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import { useScreen } from "@/components/layout/Screen";
import art from "../../lineart.module.css";
import s from "./shoprow.module.css";

/*
  Signals: many listings, one change. Six shop windows across the three
  marketplaces; Aan lands at the one window that moved, the window turns coral
  and a leader line runs from it down to the alert beneath the drawing.
  viewBox 640 × 170, baseline y = 146.
*/
const W = 640;
const H = 170;
const BASE = 146;
const WIN = { w: 86, h: 66, y: 70 };
const xs = [22, 124, 226, 328, 430, 532];
const CHANGED = 1;
const AAN_X = 112;
/** a stroke that draws itself: pathLength 1 + the draw class */
const d = (cls?: string) => ({ pathLength: 1, className: cls ? `${art.d} ${cls}` : art.d });

export function ShopRow({ stop = "signals", bubble }: { stop?: string; bubble?: string }) {
  const { inView: play, arrived } = useScreen();
  const box = useRef<HTMLDivElement>(null);
  const [aanSize, setAanSize] = useState(40);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setAanSize(Math.round(Math.max(26, Math.min(48, e.contentRect.height * 0.24)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const groups: [string, number][] = [
    ["Amazon", (xs[0] + xs[1] + WIN.w) / 2],
    ["Walmart", (xs[2] + xs[3] + WIN.w) / 2],
    ["Shopify", (xs[4] + xs[5] + WIN.w) / 2],
  ];

  return (
    <div ref={box} className={s.row} data-play={play ? "true" : "false"} data-arrived={arrived ? "true" : "false"}>
      <svg className={art.art} viewBox={`0 0 ${W} ${H}`} data-play={play ? "true" : "false"} role="img" aria-label="Six shop windows across Amazon, Walmart and Shopify. Aan stops at the one Amazon window that changed, and a line leads from it to the alert.">
        <g style={{ "--i": 0 } as CSSProperties}>
          <line {...d()} x1={-40} y1={BASE} x2={W + 40} y2={BASE} />
          <line {...d()} x1={8} y1={52} x2={W - 8} y2={52} />
        </g>
        {xs.map((x, k) => (
          <g key={x} style={{ "--i": k + 1 } as CSSProperties}>
            <rect {...d(k === CHANGED ? s.changed : undefined)} x={x} y={WIN.y} width={WIN.w} height={WIN.h} />
            <rect {...d()} x={x + 22} y={WIN.y + 16} width={30} height={34} rx={4} />
            <rect {...d()} x={x + 48} y={WIN.y + 38} width={28} height={14} rx={3} />
            {k === CHANGED && <line {...d(s.slash)} x1={x + 46} y1={WIN.y + 56} x2={x + 78} y2={WIN.y + 34} />}
            <line {...d()} x1={x + WIN.w / 2} y1={52} x2={x + WIN.w / 2} y2={WIN.y} />
          </g>
        ))}
        {groups.map(([name, cx]) => (
          <text key={name} x={cx} y={H - 2} textAnchor="middle" fontSize="12" className={art.label}>
            {name}
          </text>
        ))}
        {/* from the window that moved, down to the alert */}
        <line {...d(s.leader)} x1={xs[CHANGED] + WIN.w} y1={WIN.y + WIN.h} x2={xs[CHANGED] + WIN.w} y2={H + 16} />
        <circle cx={xs[CHANGED] + WIN.w} cy={H + 18} r={3} className={s.leaderEnd} />
      </svg>
      <AanDock stop={stop} size={aanSize} bubble={bubble} side="left" style={{ left: `${(AAN_X / W) * 100}%`, bottom: `${((H - BASE) / H) * 100}%` }} />
    </div>
  );
}
