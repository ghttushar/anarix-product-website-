"use client";

import u from "./ui.module.css";
import s from "./same-numbers.module.css";

/*
  The same figure in two places, illustrative: the Anarix dashboard and an AI
  answering through Anarix MCP. Its one moment: both figures settle into the
  same periwinkle, and the equals sign between them draws in.
*/
export function SameNumbers({ handled }: { handled: boolean }) {
  return (
    <div className={s.pair} data-ui data-state={handled ? "handled" : "open"} aria-hidden="true">
      <article className={u.card} data-state={handled ? "handled" : "open"}>
        <header className={u.head}>
          <span className={u.pill}>Anarix dashboard</span>
        </header>
        <p className={`${u.k} ${s.k}`}>Walmart ad spend, yesterday</p>
        <p className={`${u.figure} ${s.figure}`}>$3,412</p>
        <p className={s.sub}>18 campaigns</p>
      </article>
      <span className={s.equals}>
        <i />
        <i />
      </span>
      <article className={u.card} data-state={handled ? "handled" : "open"}>
        <header className={u.head}>
          <span className={u.pill}>Claude · using anarix</span>
        </header>
        <p className={s.you}>What did I spend on Walmart ads yesterday?</p>
        <p className={s.answer}>
          <b className={s.figureInline}>$3,412</b> across 18 campaigns.
        </p>
      </article>
    </div>
  );
}
