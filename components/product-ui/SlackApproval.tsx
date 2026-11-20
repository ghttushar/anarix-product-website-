"use client";

import { useState, type ReactNode } from "react";
import { AanMascot } from "@/components/aan/AanMascot";
import s from "./slack-approval.module.css";

/*
  Aan where your team already works: one message in a team-chat channel,
  holding a change above your limit until someone says yes. Sample message;
  the app is named as text, never drawn as its logo. The avatar slot can
  hold the travelling Aan's dock, so Aan "posts" the message itself.
*/
export function SlackApproval({ avatar }: { avatar?: ReactNode }) {
  const [state, setState] = useState<"ask" | "yes" | "no">("ask");
  return (
    <div className={s.card}>
      <header className={s.head} data-ui>
        <span className={s.channel}># store-ops</span>
        <span className={s.app}>in Slack</span>
      </header>
      <div className={s.msg}>
        <span className={s.avatar}>{avatar ?? <AanMascot state="diamond" size={24} glow={false} shadow={false} />}</span>
        <div className={s.body} data-ui>
          <p className={s.who}>
            <b>Aan</b>
            <span className={s.tag}>App</span>
            <time>00:00</time>
          </p>
          <p className={s.text}>
            Spring Sale wants <b>$600 a day</b>. That is above your <b>$400 limit</b>, so I have held it for you.
          </p>
          <div className={s.actions} aria-live="polite">
            {state === "ask" ? (
              <>
                <button type="button" className={s.primary} onClick={() => setState("yes")}>
                  Approve $600
                </button>
                <button type="button" className={s.secondary} onClick={() => setState("no")}>
                  Keep $400
                </button>
              </>
            ) : (
              <p className={s.done}>{state === "yes" ? "Approved by you. Spring Sale is now $600 a day." : "Kept at $400 a day. Logged with your reason."}</p>
            )}
          </div>
        </div>
      </div>
      <p className={s.sample}>Sample message</p>
    </div>
  );
}
