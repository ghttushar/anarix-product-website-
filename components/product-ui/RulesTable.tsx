"use client";

import type { CSSProperties } from "react";
import u from "./ui.module.css";
import s from "./rules-table.module.css";

/*
  The product's Applied Rules table with "Create rules with AI", sample data.
  Its one moment: the rules go from paused to active and the first decision
  of the night is logged, with its reason.
*/
const RULES = [
  { name: "Budget Cap Protection", type: "Budget", scope: "15 campaigns", runs: "1,204" },
  { name: "High ACOS Bid Reducer", type: "Keyword", scope: "142 keywords", runs: "846" },
  { name: "Inventory Sync Rule", type: "Inventory", scope: "189 products", runs: "97" },
];

export function RulesTable({ handled }: { handled: boolean }) {
  return (
    <article className={u.card} data-ui data-state={handled ? "handled" : "open"} aria-hidden="true">
      <div className={s.ai}>
        <span className={s.aiK}>Create rules with AI</span>
        <span className={s.aiInput}>Pause keywords with high ACOS and low conversions</span>
      </div>

      <div className={s.table} role="table">
        <div className={`${s.row} ${s.headRow}`} role="row">
          <span role="columnheader">Rule</span>
          <span role="columnheader" data-optional>
            Applies to
          </span>
          <span role="columnheader">Runs</span>
          <span role="columnheader">Status</span>
        </div>
        {RULES.map((r, i) => (
          <div key={r.name} className={s.row} role="row" style={{ "--i": i } as CSSProperties} data-optional={i === 2 ? true : undefined}>
            <span role="cell" className={s.name}>
              {r.name}
              <small>{r.type}</small>
            </span>
            <span role="cell" className={s.scope} data-optional>
              {r.scope}
            </span>
            <span role="cell" className={s.runs}>
              {r.runs}
            </span>
            <span role="cell">
              <span className={`${s.status} ${u.swap}`}>
                <span>Paused</span>
                <span className={s.on}>Active</span>
              </span>
            </span>
          </div>
        ))}
      </div>

      <p className={`${s.log} ${u.rule}`}>
        <svg className={`${u.icon} ${u.gain}`} viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 8.5l3 3 6-7" />
        </svg>
        <span className={u.swap}>
          <span>No rules running yet.</span>
          <span>02:14 · Stopped “chef knife 8 inch”: $86 spent, 0 sales.</span>
        </span>
      </p>
    </article>
  );
}
