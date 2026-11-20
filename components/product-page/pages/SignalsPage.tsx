"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Screen, useScreen } from "@/components/layout/Screen";
import { SignalsBoard } from "@/components/illustrations/sets/iso/SignalsBoard";
import { StoreTile } from "@/components/illustrations/sets/iso/glyphs";
import { ProductVideo } from "@/components/media/ProductVideo";
import { SignalCard } from "@/components/product-ui/SignalCard";
import { RankedList } from "@/components/product-ui/RankedList";
import type { ProductPage } from "@/content/products/types";
import { SIGNALS } from "@/content/products/samples";
import { NameHero } from "../NameHero";
import { Close } from "../Close";
import { Capabilities } from "../Sections";
import { MomentSteps } from "../MomentSteps";
import { useHandled } from "../shared";
import s from "./signals.module.css";

/*
  Signals: every store as a row of what can change overnight; one tile turns
  coral and runs into the Anarix core. A feed: centred, timestamped, coral
  where something went wrong. Tap a store, its overnight change comes up.
*/
function HeroBoard({ page }: { page: ProductPage }) {
  const handled = useHandled(1400);
  return <SignalsBoard bubble={page.bubble || undefined} handled={handled} />;
}
function TapAStore({ page }: { page: ProductPage }) {
  const { arrived, reduced } = useScreen();
  const [pick, setPick] = useState(0);
  const [handled, setHandled] = useState(false);

  // every pick replays the story: at risk until the visitor presses Execute
  // (a visitor who never does still sees the fix land, after a few seconds)
  useEffect(() => {
    if (!arrived) return;
    setHandled(false);
    const t = window.setTimeout(() => setHandled(true), 6000);
    return () => window.clearTimeout(t);
  }, [pick, arrived]);
  void reduced;

  return (
    <>
      <header className={s.head}>
        <h2 className={s.title}>{page.moment.title}</h2>
        <p className={s.hint}>{page.moment.hint}</p>
      </header>
      <MomentSteps page={page} at={handled ? 3 : 1} />
      <div className={s.stores} role="group" aria-label="Stores">
        {SIGNALS.map((sg, i) => (
          <button key={sg.store} type="button" className={s.store} aria-pressed={pick === i} onClick={() => setPick(i)}>
            <StoreTile lit={pick === i} />
            <span className={s.storeName}>{sg.store}</span>
            <span className={s.storeTime}>{sg.time}</span>
            <span className={s.storeRisk}>${sg.risk.toLocaleString("en-US")} at risk</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {SIGNALS[pick].store}: {SIGNALS[pick].title}, ${SIGNALS[pick].risk.toLocaleString("en-US")} at risk. {SIGNALS[pick].fix}.
      </p>
      <div className={s.card}>
        <SignalCard key={pick} signal={SIGNALS[pick]} handled={handled} onExecute={() => setHandled(true)} />
        <p className={s.note}>{page.moment.note}</p>
      </div>
    </>
  );
}

/* proof it worked: a week of ad sales on the fixed product, the dip at
   03:12, the fix, and the recovery Aan checks over the next 7 days */
const WEEK = [1180, 1210, 1195, 640, 860, 1120, 1190, 1230];
function Verified() {
  const W = 100;
  const H = 100;
  const max = 1300;
  const x = (i: number) => (i / (WEEK.length - 1)) * W;
  const y = (v: number) => H - 6 - (v / max) * (H - 12);
  const d = WEEK.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(" ");
  return (
    <figure className={s.verified}>
      <figcaption>
        <b>Checked over 7 days</b>
        <span>Ad sales on the decaf sampler, before and after the fix</span>
      </figcaption>
      <div className={s.vPlot} style={{ "--dip": `${(x(3) / W) * 100}%` } as CSSProperties}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Daily ad sales: about $1,200 a day, a drop to $640 on the day eligibility was lost, then back to $1,230 a day within four days of the fix.">
          <path d={d} className={s.vLine} />
          <line x1={x(3)} y1={0} x2={x(3)} y2={H} className={s.vMark} />
        </svg>
        <span className={s.vDip} aria-hidden="true" />
      </div>
      <p className={s.vKey}>
        <span>
          <i aria-hidden="true" /> 03:12 · eligibility lost, fix applied
        </span>
        <span>Back to $1,230 a day</span>
      </p>
    </figure>
  );
}

function Ranked({ page }: { page: ProductPage }) {
  const handled = useHandled(500);
  return (
    <>
      <header className={s.head}>
        <h2 className={s.title}>{page.proof.title}</h2>
        <p className={s.hint}>{page.proof.line}</p>
      </header>
      <div className={s.feedList}>
        <RankedList handled={handled} bare />
        <Verified />
        <p className={s.note}>{page.proof.note}</p>
      </div>
    </>
  );
}

export function SignalsPage({ page }: { page: ProductPage }) {
  return (
    <>
      <NameHero page={page} layout="split" art={<ProductVideo video={page.video} title="Signals product tour" fitRatio={760 / 500} fallback={<HeroBoard page={page} />} />} />
      <Screen id="tap-a-store" fit="grow" bodyClassName={`l-container ${s.feed}`} label={page.moment.title}>
        <TapAStore page={page} />
      </Screen>
      <Capabilities page={page} variant="grid" />
      <Screen id="ranked" fit="grow" bodyClassName={`l-container ${s.feed}`} label={page.proof.title}>
        <Ranked page={page} />
      </Screen>
      <Close page={page} ladder />
    </>
  );
}
