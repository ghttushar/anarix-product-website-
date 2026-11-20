"use client";

import { AanMascot } from "@/components/aan/AanMascot";
import { SIGNALS, type SampleSignal } from "@/content/products/samples";
import s from "./signal-card.module.css";

/*
  The product's Signal card (anarix-insight-engine), sample data. It shows one
  calm state change: money at risk becomes money protected once Aan acts.
  The figure stays put; only its label and colour change (coral to
  periwinkle), so it never counts through zero. With onExecute, Execute is
  a real button and the visitor makes the change happen.
*/
export function SignalCard({
  handled,
  signal = SIGNALS[0],
  live = false,
  onExecute,
  bare = false,
}: {
  handled: boolean;
  signal?: SampleSignal;
  /** read by assistive tech (the Signals page's picker) */
  live?: boolean;
  onExecute?: () => void;
  /** inside a product frame: no card of its own */
  bare?: boolean;
}) {
  const sg = signal;
  const execute = (
    <>
      <svg className={s.check} viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3.5 8.5l3 3 6-7" />
      </svg>
      <span className={s.k1}>Execute: {sg.action}</span>
      <span className={s.k2}>Executed: {sg.done}</span>
    </>
  );

  return (
    <article className={`${s.card} ${bare ? s.bare : ""}`} data-ui data-state={handled ? "handled" : "risk"} aria-hidden={live ? undefined : true} aria-label={live ? `${sg.store}: ${sg.title}` : undefined}>
      <header className={s.head} data-part="1">
        <span className={`${s.pill} ${sg.priority === "High" ? s.pillRisk : s.pillMuted}`}>{sg.priority}</span>
        <span className={s.pill}>{sg.area}</span>
        <span className={`${s.pill} ${s.pillMuted}`}>{sg.store} · US</span>
        <span className={s.time}>{sg.time}</span>
      </header>

      <p className={s.value} data-part="2">
        <span className={s.figure}>${sg.risk.toLocaleString("en-US")}</span>
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
        {onExecute ? (
          <button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={onExecute} disabled={handled} aria-label={handled ? `Executed: ${sg.done}` : `Execute: ${sg.action}`}>
            {execute}
          </button>
        ) : (
          <span className={`${s.btn} ${s.btnPrimary}`}>{execute}</span>
        )}
        <span className={s.btn}>Modify</span>
        <span className={s.btn} data-optional>
          Assign
        </span>
      </footer>
    </article>
  );
}
