"use client";

import { useEffect, useState } from "react";
import { Screen, useScreen } from "@/components/layout/Screen";
import { AanMascot, type AanState } from "@/components/aan/AanMascot";
import { AanDock } from "@/components/aan/v2/AanDock";
import { AnswerChart } from "@/components/product-ui/AnswerChart";
import { SlackApproval } from "@/components/product-ui/SlackApproval";
import { ProductVideo } from "@/components/media/ProductVideo";
import { Typewriter } from "@/components/motion/Typewriter";
import type { ProductPage } from "@/content/products/types";
import { QUESTIONS } from "@/content/products/samples";
import { NameHero } from "../NameHero";
import { Close } from "../Close";
import { Capabilities } from "../Sections";
import { MomentSteps } from "../MomentSteps";
import a from "./aan.module.css";

/*
  Aan: the character, in portrait. A conversation, centred. Ask it something
  and watch its shape: circle while it listens, cube while it thinks, bar
  while it works, the diamond again when it answers.
*/
type Phase = { state: AanState; label: string; ms: number };
const PHASES: Phase[] = [
  { state: "circle", label: "Listening", ms: 700 },
  { state: "cube", label: "Thinking", ms: 900 },
  { state: "bar", label: "Working", ms: 800 },
];

function AskAan({ page }: { page: ProductPage }) {
  const { arrived, reduced } = useScreen();
  const [pick, setPick] = useState(0);
  const [phase, setPhase] = useState(-1); // -1 waiting, 0..2 working it out, 3 answered

  useEffect(() => {
    if (!arrived) return;
    if (reduced) {
      setPhase(3);
      return;
    }
    setPhase(0);
    let at = 0;
    const timers = PHASES.map((ph, i) => {
      at += ph.ms;
      return window.setTimeout(() => setPhase(i + 1), at);
    });
    return () => timers.forEach(window.clearTimeout);
  }, [pick, arrived, reduced]);

  const qa = QUESTIONS[pick];
  const now = phase >= 0 && phase < 3 ? PHASES[phase] : null;

  return (
    <>
      <header className={a.head}>
        <h2 className={a.title}>{page.moment.title}</h2>
        <p className={a.hint}>{page.moment.hint}</p>
      </header>
      <MomentSteps page={page} at={phase < 0 ? 0 : phase < 3 ? 1 : 2} />
      <div className={a.chat}>
        <p className={a.you} key={`q${pick}`}>
          {qa.q}
        </p>
        <div className={a.reply} aria-live="polite">
          <span className={a.who}>
            <AanMascot state={now?.state ?? "diamond"} size={30} glow={false} shadow={false} />
            <span>{now ? `${now.label}…` : "Aan"}</span>
          </span>
          {phase === 3 && (
            <div key={`a${pick}`}>
              <Typewriter text={qa.a} play delay={0} className={a.answer} />
              <AnswerChart chart={qa.chart} />
              <p className={a.sources}>
                {qa.sources.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </p>
              <p className={a.actions}>
                <span className={a.primary}>{qa.actions[0]}</span>
                <span>{qa.actions[1]}</span>
              </p>
            </div>
          )}
        </div>
        <div className={a.chips} role="group" aria-label="Questions to ask Aan">
          {QUESTIONS.map((x, i) => (
            <button key={x.q} type="button" className={a.chip} aria-pressed={pick === i} onClick={() => setPick(i)}>
              {x.q}
            </button>
          ))}
        </div>
        <p className={a.note}>{page.moment.note}</p>
      </div>
    </>
  );
}

/* the morning brief as Aan writes it: a short letter, not a dashboard */
function Brief({ page }: { page: ProductPage }) {
  const [approved, setApproved] = useState(false);
  return (
    <article className={a.letter}>
      <h2 className={a.letterTitle}>{page.proof.title}</h2>
      <p className={a.hello}>Good morning.</p>
      <p className={a.body}>
        Overnight I paused “chef knife 8 inch” after $86 of spend with no sales, flagged a $3 undercut on Shopify, and drafted a reorder for the bamboo board.
      </p>
      <p className={a.body}>
        One thing needs you: moving $400 a day to Sponsored Brands.{" "}
        <button type="button" className={a.approve} aria-pressed={approved} onClick={() => setApproved(true)} disabled={approved}>
          {approved ? "Approved" : "Approve"}
        </button>
      </p>
      <p className={a.body}>
        All in, <span className={a.fig}>$878</span> protected overnight.
      </p>
      <div className={a.sign}>
        <span>Aan</span>
        <AanMascot state="diamond" size={22} glow={false} shadow={false} />
      </div>
      <p className={a.note}>{page.proof.note}</p>
    </article>
  );
}

export function AanPage({ page }: { page: ProductPage }) {
  return (
    <>
      <NameHero
        page={page}
        layout="portrait"
        art={
          <ProductVideo
            video={page.video}
            title="Aan product tour"
            ratio={4 / 3}
            fitRatio={1.4}
            fallback={<SlackApproval avatar={<AanDock stop="aan" size={16} style={{ left: "50%", bottom: "4px" }} />} />}
          />
        }
      />
      <Screen id="ask-aan" fit="grow" bodyClassName={`l-container ${a.centre}`} label={page.moment.title}>
        <AskAan page={page} />
      </Screen>
      <Capabilities page={page} variant="list" />
      <Screen id="morning-brief" bodyClassName={`l-container ${a.centre}`} label={page.proof.title}>
        <Brief page={page} />
      </Screen>
      <Close page={page} ladder />
    </>
  );
}
