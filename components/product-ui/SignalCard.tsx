"use client";

import { useCallback } from "react";
import { AanMascot } from "@/components/aan/AanMascot";
import { CountUp } from "@/components/motion/CountUp";
import s from "./signal-card.module.css";

/*
  The product's Signal card (anarix-insight-engine), sample data. It shows one
  calm state change: money at risk becomes money protected once Aan acts.
*/
export function SignalCard({ handled }: { handled: boolean }) {
  const money = useCallback((n: number) => `${n < 0 ? "−" : "+"}$${Math.round(Math.abs(n)).toLocaleString("en-US")}`, []);

  return (
    <article className={s.card} data-ui data-state={handled ? "handled" : "risk"} aria-hidden="true">
      <header className={s.head} data-part="1">
        <span className={`${s.pill} ${s.pillRisk}`}>High</span>
        <span className={s.pill}>Advertising</span>
        <span className={`${s.pill} ${s.pillMuted}`}>Amazon · US</span>
        <span className={s.time}>03:12</span>
      </header>

      <p className={s.value} data-part="2">
        <CountUp from={-136} to={1651} play={handled} format={money} width={6} className={s.figure} />
        <span className={s.valueK}>
          <span className={s.k1}>ad sales at risk</span>
          <span className={s.k2}>protected</span>
        </span>
      </p>

      <h3 className={s.title} data-part="3">Advertising eligibility lost</h3>
      <p className={s.sub}>ASIN B0CSHBTCC6 · Sampler, Decaf 40 Count</p>

      <dl className={s.why} data-optional>
        <div>
          <dt>What happened</dt>
          <dd>Ad eligibility lost on Jul 18, the 2nd time in 30 days.</dd>
        </div>
        <div>
          <dt>Root cause</dt>
          <dd>Cost to Amazon is too high for an $18.69 retail price.</dd>
        </div>
      </dl>

      <div className={s.aan} data-part="4">
        <span className={s.aanK}>
          <AanMascot state="diamond" size={14} glow={false} shadow={false} />
          Aan&apos;s analysis
        </span>
        <span className={s.aanV}>
          Lower the cost to Amazon by $1.20 to restore eligibility · <b>95%</b> confidence
        </span>
      </div>

      <footer className={s.actions} data-part="5">
        <span className={`${s.btn} ${s.btnPrimary}`}>
          <svg className={s.check} viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
          <span className={s.k1}>Execute: Lower cost $1.20</span>
          <span className={s.k2}>Executed: Cost lowered</span>
        </span>
        <span className={s.btn}>Modify</span>
        <span className={s.btn} data-optional>
          Assign
        </span>
      </footer>
    </article>
  );
}
