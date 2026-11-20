"use client";

import type { CSSProperties } from "react";
import { Ticker } from "@/components/motion/Ticker";
import { COSTS, SALES } from "@/content/products/samples";
import w from "./profit-waterfall.module.css";

/*
  Profitability's waterfall: one day's sales, each cost stepping down from it,
  and what is left standing as profit. Every cost is a switch: take one out
  and the profit you would have believed rises to meet it (Stripe's live
  figures; only transforms move). The figures are the sample day.
*/
const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export function ProfitWaterfall({ on, onToggle, compact = false }: { on: boolean[]; onToggle?: (i: number) => void; compact?: boolean }) {
  let level = SALES;
  const steps = COSTS.map((c, i) => {
    const top = level;
    if (on[i]) level -= c.v;
    return { ...c, top, on: on[i] };
  });
  const profit = level;
  const all = on.every(Boolean);
  const pct = (n: number) => (n / SALES) * 100;

  return (
    <div className={w.wrap} data-compact={compact ? "true" : undefined} data-ui>
      <div className={w.top}>
        <p className={w.big}>
          <b>
            <Ticker value={profit} format={money} duration={700} />
          </b>
          <span>{all ? "true profit" : on.some(Boolean) ? "so far" : "revenue"}</span>
        </p>
        <p className={w.margin}>
          Margin <span>{pct(profit).toFixed(1)}%</span>
        </p>
      </div>

      {onToggle && (
        <div className={w.switches} role="group" aria-label="Costs to count">
          {COSTS.map((c, i) => (
            <button key={c.k} type="button" className={w.switch} aria-pressed={on[i]} onClick={() => onToggle(i)}>
              <i aria-hidden="true" />
              {c.long}
            </button>
          ))}
        </div>
      )}

      <div className={w.chart} aria-hidden="true">
        <Col label="Sales" value={money(SALES)} top={0} h={100} kind="sales" />
        {steps.map((s) => (
          <Col key={s.k} label={s.k} value={`−${money(s.v)}`} top={100 - pct(s.top)} h={s.on ? pct(s.v) : 0} kind="cost" off={!s.on} step={100 - pct(s.top)} />
        ))}
        <Col label="Profit" value={money(profit)} top={100 - pct(profit)} h={pct(profit)} kind="profit" step={100 - pct(profit)} />
      </div>
      <p className={w.sr} aria-live="polite">
        {money(profit)} {all ? "true profit" : "before the costs switched off"}, {pct(profit).toFixed(1)}% margin.
      </p>
    </div>
  );
}

function Col({ label, value, top, h, kind, off, step }: { label: string; value: string; top: number; h: number; kind: "sales" | "cost" | "profit"; off?: boolean; step?: number }) {
  return (
    <div className={w.col} data-kind={kind} data-off={off ? "true" : undefined}>
      <div className={w.track}>
        {step !== undefined && <span className={w.step} style={{ "--y": `${step}%` } as CSSProperties} />}
        <span className={w.bar} style={{ "--top": `${top}%`, "--h": h / 100 } as CSSProperties} />
      </div>
      <span className={w.label}>{label}</span>
      <span className={w.value}>{value}</span>
    </div>
  );
}
