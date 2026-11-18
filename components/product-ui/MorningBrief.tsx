"use client";

import type { CSSProperties } from "react";
import { AanMascot } from "@/components/aan/AanMascot";
import u from "./ui.module.css";
import s from "./morning-brief.module.css";

/*
  Aan's morning brief, sample data: the same night as the homepage's Night
  Watch (three fixes, $1,240 saved). Its one moment: the night's work ticks
  in, then what needs you, then what it was worth.
*/
const HANDLED = [
  "Paused “chef knife 8 inch”: $86 spent, 0 sales.",
  "Flagged a $3 undercut on Shopify.",
  "Drafted a reorder: 6 days of stock left.",
];

export function MorningBrief({ handled }: { handled: boolean }) {
  return (
    <article className={u.card} data-ui data-state={handled ? "handled" : "open"} aria-hidden="true">
      <header className={u.head}>
        <span className={u.pill}>
          <AanMascot state="diamond" size={14} glow={false} shadow={false} />
          Morning brief
        </span>
        <span className={u.meta}>7:00 AM</span>
      </header>

      <p className={`${u.k} ${s.k}`}>Handled overnight</p>
      <ul className={s.list}>
        {HANDLED.map((t, i) => (
          <li key={t} className={u.later} style={{ transitionDelay: `${150 + i * 220}ms` } as CSSProperties}>
            <svg className={`${u.icon} ${u.gain}`} viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.5 8.5l3 3 6-7" />
            </svg>
            {t}
          </li>
        ))}
      </ul>

      <p className={`${u.k} ${s.k}`}>Needs you</p>
      <div className={`${s.needs} ${u.later}`} style={{ transitionDelay: "850ms" }}>
        <span>Move $400/day to Sponsored Brands?</span>
        <span className={`${u.btn} ${u.btnPrimary}`}>Approve</span>
      </div>

      <footer className={`${s.worth} ${u.rule}`}>
        <span className={u.k}>Worth</span>
        <span className={`${s.figure} ${u.later}`} style={{ transitionDelay: "1100ms" }}>
          $1,240 saved
        </span>
      </footer>
    </article>
  );
}
