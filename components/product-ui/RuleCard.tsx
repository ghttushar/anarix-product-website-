"use client";

import type { CSSProperties } from "react";
import type { SampleRule } from "@/content/products/samples";
import r from "./rule-card.module.css";

/*
  A rule in Anarix, start to finish: the sentence you typed, the rule Aan
  built from it (when, if, then), the conflict check, and the first decision
  it made, landing in the log. `handled` plays the build once; changing the
  rule plays it again.
*/
export function RuleCard({ rule, handled, when = "02:14" }: { rule: SampleRule; handled: boolean; when?: string }) {
  const n = rule.parts.length;
  return (
    <div className={r.card} data-handled={handled ? "true" : "false"} data-ui>
      <p className={r.k}>You say</p>
      <p className={r.said}>&ldquo;{rule.sentence}&rdquo;</p>

      <p className={r.k}>Aan builds</p>
      <dl className={r.parts}>
        {rule.parts.map((p, i) => (
          <div key={p.k} style={{ "--i": i } as CSSProperties}>
            <dt>{p.k}</dt>
            <dd>{p.v}</dd>
          </div>
        ))}
      </dl>
      <p className={r.check} style={{ "--i": n } as CSSProperties}>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 8.5l3 3 6-7" />
        </svg>
        Checked for conflicts with your other rules
      </p>

      <div className={r.log} style={{ "--i": n + 1 } as CSSProperties}>
        <p className={r.k}>Decision log</p>
        <p className={r.entry}>
          <time>{when}</time>
          <span className={r.stopped}>Stopped</span>
          <span className={r.what}>{rule.stopped}</span>
        </p>
      </div>
    </div>
  );
}
