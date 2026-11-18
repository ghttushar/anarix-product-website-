"use client";

import type { CSSProperties } from "react";
import { CountUp } from "@/components/motion/CountUp";
import u from "./ui.module.css";
import s from "./profit-card.module.css";

/*
  The product's Profitability date card, sample data. Its one moment is the
  mechanism itself: the figure starts as revenue and, as each cost is taken
  out, settles on true net profit. The rows add up: 5,235 − 1,151 − 288 − 412
  − 1,816 = 1,568.
*/
const COSTS = [
  { k: "Marketplace fees", v: 1151 },
  { k: "Ad spend", v: 288 },
  { k: "Refunds", v: 412 },
  { k: "COGS", v: 1816 },
];
const REVENUE = 5235;
const PROFIT = REVENUE - COSTS.reduce((a, c) => a + c.v, 0);
const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export function ProfitCard({ handled }: { handled: boolean }) {
  return (
    <article className={u.card} data-ui data-state={handled ? "handled" : "open"} aria-hidden="true">
      <header className={u.head}>
        <span className={u.pill}>
          <svg className={u.icon} viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          Yesterday
        </span>
        <span className={`${u.pill} ${u.pillMuted}`}>Walmart · US</span>
        <span className={u.meta}>Daily</span>
      </header>

      <div className={s.hero}>
        <p className={u.k}>
          <span className={u.swap}>
            <span>Revenue</span>
            <span>Net profit</span>
          </span>
        </p>
        <p className={s.value}>
          <CountUp from={REVENUE} to={PROFIT} play={handled} format={money} width={7} className={`${u.figure} ${s.figure}`} duration={1400} />
          <span className={`${s.margin} ${u.later}`}>Margin 30.0%</span>
        </p>
      </div>

      <dl className={`${s.costs} ${u.rule}`}>
        {COSTS.map((c, i) => (
          <div key={c.k} className={u.later} style={{ transitionDelay: `${180 + i * 220}ms` } as CSSProperties}>
            <dt>{c.k}</dt>
            <dd className={u.cost}>−{money(c.v)}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
