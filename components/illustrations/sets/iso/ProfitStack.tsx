"use client";

import type { CSSProperties } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import { Block, IsoStage, dockAt, isoCss, makeIso, useDockSize } from "./kit";
import s from "./profit-stack.module.css";

/*
  Profitability: the day's sales as one column, to scale. Each cost that is
  switched on slides out of the column onto its own plinth (coral); what is
  left standing is the profit (periwinkle). The row runs straight across the
  screen, so it can sit under a name or beside copy. Aan stands on top.
*/
const A = 64; // step between plinths, world units
const FOOT = 48;
const PL = 66; // plinth side
const BASE = 6;
const TALL = 230; // the full day's sales, world units

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export function ProfitStack({ sales, costs, on, stop = "profitability", bubble, dock = true }: { sales: number; costs: readonly { k: string; v: number }[]; on: boolean[]; stop?: string; bubble?: string; dock?: boolean }) {
  const n = costs.length;
  const W = 640;
  const H = 470;
  const iso = makeIso(84, 372);
  const { box, size } = useDockSize(22, 40, 0.085);
  const S = TALL / sales;
  const profit = sales - costs.reduce((a, c) => a + c.v, 0);
  const pos = (k: number) => [k * A, -k * A] as const;
  const step = 2 * A * 0.866; // screen x per plinth

  // the column, bottom up: profit, then each cost still in it
  let level = BASE + profit * S;
  const segs = costs.map((c, i) => {
    const h = c.v * S;
    if (on[i]) return { ...c, h, out: true, dx: step * (i + 1), dy: 0 };
    const seg = { ...c, h, out: false, dx: 0, dy: -(level - BASE) };
    level += h;
    return seg;
  });
  const colTop = level;
  const left = sales - costs.reduce((a, c, i) => a + (on[i] ? c.v : 0), 0);
  const all = on.every(Boolean);
  const none = !on.some(Boolean);
  const aanAt = iso(0, 0, colTop);
  const c0 = -FOOT / 2;

  return (
    <div ref={box}>
      <IsoStage
        w={W}
        h={H}
        className={s.stack}
        label={`The day's ${money(sales)} in sales as one column. ${on.filter(Boolean).length} of ${n} costs have been lifted out onto their own plinths; ${money(left)} is left standing${all ? ", the true profit" : ""}.`}
        dock={dock ? <AanDock stop={stop} size={size} bubble={bubble} side="right" style={dockAt(aanAt, W, H)} /> : undefined}
      >
        {/* plinths */}
        {Array.from({ length: n + 1 }, (_, k) => {
          const [x, y] = pos(k);
          return <Block key={k} iso={iso} x={x - PL / 2} y={y - PL / 2} w={PL} d={PL} h={BASE} tone="plate" i={k} />;
        })}

        {/* what is left: the profit, always at the bottom of the column */}
        <Block iso={iso} x={c0} y={c0} w={FOOT} d={FOOT} h={profit * S} z={BASE} tone="hot" i={6} />

        {/* each cost: in the column (part of sales) or out on its plinth */}
        {segs.map((g, i) => (
          <g key={g.k} className={s.seg} style={{ transform: `translate(${g.dx.toFixed(1)}px, ${(g.out ? 0 : g.dy).toFixed(1)}px)` } as CSSProperties}>
            <Block iso={iso} x={c0} y={c0} w={FOOT} d={FOOT} h={g.h} z={BASE} tone={g.out ? "risk" : "base"} i={7 + i} />
          </g>
        ))}

        {/* names under each plinth */}
        {[{ k: all ? "Profit" : none ? "Sales" : "Left", v: left, out: true, lead: true }, ...segs].map((g, k) => {
          const [x, y] = pos(k);
          const [px, py] = iso(x + PL / 2, y + PL / 2, 0);
          return (
            <g key={g.k} className={s.name} data-out={g.out ? "true" : "false"} data-lead={"lead" in g ? "true" : undefined}>
              <text x={px} y={py + 30} textAnchor="middle" className={isoCss.label} style={{ "--fs": "14px" } as CSSProperties}>
                {g.k}
              </text>
              <text x={px} y={py + 50} textAnchor="middle" className={`${isoCss.sub} ${isoCss.mono}`} style={{ "--fs": "13px" } as CSSProperties}>
                {"lead" in g ? money(g.v) : `−${money(g.v)}`}
              </text>
            </g>
          );
        })}
      </IsoStage>
    </div>
  );
}
