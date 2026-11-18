"use client";

import type { CSSProperties } from "react";
import u from "./ui.module.css";
import s from "./rule-builder.module.css";

/*
  One rule, from a sentence, sample data (the copy deck's example). Its one
  moment: Aan turns the sentence into a schedule, conditions, an action and
  a scope, one line at a time, and the rule goes active.
*/
const SENTENCE = "Pause any keyword that spends $50 in 7 days with no sales.";
const PARTS = [
  { k: "When", v: "Every hour" },
  { k: "If", v: "Spend is $50 or more in the last 7 days" },
  { k: "And", v: "Sales are 0 in the same 7 days" },
  { k: "Then", v: "Pause the keyword" },
  { k: "Scope", v: "Every keyword in your campaigns" },
];

export function RuleBuilder({ handled }: { handled: boolean }) {
  return (
    <article className={u.card} data-ui data-state={handled ? "handled" : "open"} aria-hidden="true">
      <div className={s.ask}>
        <span className={s.askK}>Create rules with AI</span>
        <span className={s.askV}>{SENTENCE}</span>
      </div>
      <dl className={s.parts}>
        {PARTS.map((p, i) => (
          <div key={p.k} className={u.later} style={{ transitionDelay: `${200 + i * 200}ms` } as CSSProperties}>
            <dt>{p.k}</dt>
            <dd>{p.v}</dd>
          </div>
        ))}
      </dl>
      <footer className={`${s.foot} ${u.rule}`}>
        <span className={s.status}>
          <span className={u.swap}>
            <span>Building…</span>
            <span className={s.on}>Active</span>
          </span>
        </span>
        <span className={s.note}>Changes above your limit wait for your approval.</span>
      </footer>
    </article>
  );
}
