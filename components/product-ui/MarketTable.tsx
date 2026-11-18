"use client";

import type { CSSProperties } from "react";
import u from "./ui.module.css";
import s from "./market-table.module.css";

/*
  Yesterday's profit by marketplace, sample data (Walmart matches the profit
  card: $5,235 sales, $1,568 net profit). Its one moment: each margin bar
  draws to its length, so where the money is really made shows at a glance.
*/
const ROWS = [
  { m: "Amazon", sales: 9870, profit: 2270 },
  { m: "Walmart", sales: 5235, profit: 1568 },
  { m: "Shopify", sales: 2140, profit: 706 },
];
const money = (n: number) => `$${n.toLocaleString("en-US")}`;
const pct = (p: number, s: number) => `${((p / s) * 100).toFixed(1)}%`;
const total = ROWS.reduce((a, r) => ({ sales: a.sales + r.sales, profit: a.profit + r.profit }), { sales: 0, profit: 0 });

export function MarketTable({ handled }: { handled: boolean }) {
  return (
    <article className={u.card} data-ui data-state={handled ? "handled" : "open"} aria-hidden="true">
      <header className={u.head}>
        <span className={u.pill}>Yesterday</span>
        <span className={`${u.pill} ${u.pillMuted}`}>All marketplaces</span>
        <span className={u.meta}>Daily</span>
      </header>
      <div className={s.table}>
        <div className={`${s.row} ${s.headRow}`}>
          <span>Marketplace</span>
          <span>Sales</span>
          <span>Net profit</span>
          <span>Margin</span>
        </div>
        {ROWS.map((r) => (
          <div key={r.m} className={s.row}>
            <span className={s.name}>{r.m}</span>
            <span className={s.num}>{money(r.sales)}</span>
            <span className={`${s.num} ${s.profit}`}>{money(r.profit)}</span>
            <span className={s.margin}>
              <span className={s.num}>{pct(r.profit, r.sales)}</span>
              <i style={{ "--w": handled ? (r.profit / r.sales / 0.4).toFixed(3) : 0 } as CSSProperties} />
            </span>
          </div>
        ))}
        <div className={`${s.row} ${s.totalRow}`}>
          <span className={s.name}>All three</span>
          <span className={s.num}>{money(total.sales)}</span>
          <span className={`${s.num} ${s.profit}`}>{money(total.profit)}</span>
          <span className={s.num}>{pct(total.profit, total.sales)}</span>
        </div>
      </div>
    </article>
  );
}
