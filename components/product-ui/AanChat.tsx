"use client";

import { AanMascot } from "@/components/aan/AanMascot";
import { Typewriter } from "@/components/motion/Typewriter";
import u from "./ui.module.css";
import s from "./aan-chat.module.css";

/*
  The product's Ask Aan chat, sample data. Its one moment: Aan answers in
  plain words, shows what the answer is based on, and offers the next step.
*/
const Q = "Why did ROAS drop on Walmart yesterday?";
const A = "CPC rose 22% on “bamboo cutting board” while conversions held flat. Move $400/day to Sponsored Brands to recover about 0.6 ROAS.";

export function AanChat({ handled }: { handled: boolean }) {
  return (
    <article className={`${u.card} ${s.chat}`} data-ui data-state={handled ? "handled" : "open"} aria-hidden="true">
      <p className={s.you} data-part="1">{Q}</p>
      <div className={s.aan}>
        <span className={s.aanHead} data-part="2">
          <AanMascot state="diamond" size={16} glow={false} shadow={false} />
          Aan
        </span>
        <Typewriter text={A} play={handled} delay={200} className={s.answer} />
        <p className={`${s.sources} ${u.later}`} data-optional>
          <span className={u.pill}>Ads · Walmart</span>
          <span className={u.pill}>Yesterday vs 7-day average</span>
        </p>
        <p className={`${s.actions} ${u.later}`} data-part="3">
          <span className={`${u.btn} ${u.btnPrimary}`}>Draft the rule</span>
          <span className={u.btn}>Build a report</span>
        </p>
      </div>
      <div className={s.composer}>
        <span>Ask Aan anything…</span>
        <svg className={u.icon} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </div>
    </article>
  );
}
