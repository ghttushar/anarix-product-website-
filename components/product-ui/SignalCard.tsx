"use client";

import { useCallback } from "react";
import { AanMascot } from "@/components/aan/AanMascot";
import { CountUp } from "@/components/motion/CountUp";
import { SIGNALS, type SampleSignal } from "@/content/products/samples";
import s from "./signal-card.module.css";

/*
  The product's Signal card (anarix-insight-engine), sample data. It shows one
  calm state change: money at risk becomes money protected once Aan acts.
  Any of the sample signals can be shown (the Signals page swaps them).
*/
export function SignalCard({ handled, signal = SIGNALS[0], live = false }: { handled: boolean; signal?: SampleSignal; /** read by assistive tech (the Signals page's picker) */ live?: boolean }) {
  const money = useCallback((n: number) => `${n < 0 ? "−" : "+"}$${Math.round(Math.abs(n)).toLocaleString("en-US")}`, []);
  const sg = signal;

  return (
    <article className={s.card} data-ui data-state={handled ? "handled" : "risk"} aria-hidden={live ? undefined : true} aria-label={live ? `${sg.store}: ${sg.title}` : undefined}>
      <header className={s.head} data-part="1">
        <span className={`${s.pill} ${sg.priority === "High" ? s.pillRisk : s.pillMuted}`}>{sg.priority}</span>
        <span className={s.pill}>{sg.area}</span>
        <span className={`${s.pill} ${s.pillMuted}`}>{sg.store} · US</span>
        <span className={s.time}>{sg.time}</span>
      </header>

      <p className={s.value} data-part="2">
        <CountUp from={-sg.risk} to={sg.risk} play={handled} format={money} width={6} className={s.figure} />
        <span className={s.valueK}>
          <span className={s.k1}>at risk</span>
          <span className={s.k2}>protected</span>
        </span>
      </p>

      <h3 className={s.title} data-part="3">
        {sg.title}
      </h3>
      <p className={s.sub}>{sg.item}</p>

      <dl className={s.why} data-optional>
        <div>
          <dt>What happened</dt>
          <dd>{sg.what}</dd>
        </div>
        <div>
          <dt>Root cause</dt>
          <dd>{sg.why}</dd>
        </div>
      </dl>

      <div className={s.aan} data-part="4">
        <span className={s.aanK}>
          <AanMascot state="diamond" size={14} glow={false} shadow={false} />
          Aan&apos;s analysis
        </span>
        <span className={s.aanV}>
          {sg.fix} · <b>{sg.confidence}%</b> confidence
        </span>
      </div>

      <footer className={s.actions} data-part="5">
        <span className={`${s.btn} ${s.btnPrimary}`}>
          <svg className={s.check} viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
          <span className={s.k1}>Execute: {sg.action}</span>
          <span className={s.k2}>Executed: {sg.done}</span>
        </span>
        <span className={s.btn}>Modify</span>
        <span className={s.btn} data-optional>
          Assign
        </span>
      </footer>
    </article>
  );
}
