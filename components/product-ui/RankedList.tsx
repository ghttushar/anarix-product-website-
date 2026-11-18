"use client";

import type { CSSProperties } from "react";
import u from "./ui.module.css";
import s from "./ranked-list.module.css";

/*
  Today's signals, sample data. Its one moment: the list arrives in the order
  things happened, then sorts itself by money at risk.
*/
const ROWS = [
  { p: "Medium", t: "Undercut by $3", m: "Shopify", v: 412 },
  { p: "High", t: "Ad eligibility lost", m: "Amazon", v: 1651 },
  { p: "Medium", t: "6 days of stock left", m: "Amazon", v: 380 },
  { p: "High", t: "Buy Box lost to a reseller", m: "Walmart", v: 940 },
];
const RANK = [...ROWS].sort((a, b) => b.v - a.v);

export function RankedList({ handled }: { handled: boolean }) {
  return (
    <article className={u.card} data-ui data-state={handled ? "handled" : "open"} aria-hidden="true">
      <header className={u.head}>
        <span className={u.pill}>Today&apos;s signals</span>
        <span className={u.meta}>
          <span className={u.swap}>
            <span>By time</span>
            <span>By money at risk</span>
          </span>
        </span>
      </header>
      <ol className={s.list} style={{ "--rows": ROWS.length } as CSSProperties}>
        {ROWS.map((r, i) => (
          <li key={r.t} className={s.row} style={{ "--slot": handled ? RANK.indexOf(r) : i } as CSSProperties}>
            <span className={`${u.pill} ${r.p === "High" ? s.high : u.pillMuted}`}>{r.p}</span>
            <span className={s.title}>
              {r.t}
              <small>{r.m}</small>
            </span>
            <span className={s.value}>${r.v.toLocaleString("en-US")}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}
