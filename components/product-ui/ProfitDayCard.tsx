"use client";

import type { CSSProperties } from "react";
import u from "./ui.module.css";
import s from "./profit-day.module.css";

/*
  The profit card as the copy deck lists it (net profit and its change,
  margin, GMV, orders, ad cost, estimated payout), sample data. Figures agree
  with the homepage card: $5,235 GMV − $1,151 fees − $288 ads − $412 refunds
  − $1,816 COGS = $1,568; payout = GMV − fees − refunds = $3,672.
*/
const ROWS = [
  { k: "Margin", v: "30.0%", part: "2" },
  { k: "GMV", v: "$5,235", part: "3" },
  { k: "Orders", v: "142" },
  { k: "Ad cost", v: "$288", part: "4", cost: true },
  { k: "Estimated payout", v: "$3,672", part: "5" },
];

export function ProfitDayCard({ handled }: { handled: boolean }) {
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

      <div className={s.hero} data-part="1">
        <p className={u.k}>Net profit</p>
        <p className={s.value}>
          <span className={`${u.figure} ${s.figure}`}>$1,568</span>
          <span className={`${s.change} ${u.later}`}>+$124 on the day before</span>
        </p>
      </div>

      <dl className={`${s.rows} ${u.rule}`}>
        {ROWS.map((r, i) => (
          <div key={r.k} className={u.later} data-part={r.part} style={{ transitionDelay: `${150 + i * 140}ms` } as CSSProperties}>
            <dt>{r.k}</dt>
            <dd className={r.cost ? u.cost : undefined}>{r.v}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
