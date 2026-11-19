"use client";

import { useEffect, useState } from "react";
import { Screen, useScreen } from "@/components/layout/Screen";
import { SignalsBoard } from "@/components/illustrations/sets/iso/SignalsBoard";
import { NightBoard } from "@/components/illustrations/sets/iso/NightBoard";
import { StoreTile } from "@/components/illustrations/sets/iso/glyphs";
import { ProductVideo } from "@/components/media/ProductVideo";
import { SignalCard } from "@/components/product-ui/SignalCard";
import { RankedList } from "@/components/product-ui/RankedList";
import type { ProductPage } from "@/content/products/types";
import { SIGNALS } from "@/content/products/samples";
import { NameHero } from "../NameHero";
import { Close } from "../Close";
import { Capabilities, HowItWorks } from "../Sections";
import { useHandled } from "../shared";
import s from "./signals.module.css";

/*
  Signals: every store as a row of what can change overnight; one tile turns
  coral and runs into the Anarix core. A feed: centred, timestamped, coral
  where something went wrong. Tap a store, its overnight change comes up.
*/
function HeroBoard({ page }: { page: ProductPage }) {
  const handled = useHandled(1400);
  return <SignalsBoard bubble={page.bubble} handled={handled} />;
}
function TapAStore({ page }: { page: ProductPage }) {
  const { arrived, reduced } = useScreen();
  const [pick, setPick] = useState(0);
  const [handled, setHandled] = useState(false);

  // every pick replays the story: at risk, then fixed from the alert
  useEffect(() => {
    if (!arrived) return;
    setHandled(false);
    const t = window.setTimeout(() => setHandled(true), reduced ? 0 : 900);
    return () => window.clearTimeout(t);
  }, [pick, arrived, reduced]);

  return (
    <>
      <header className={s.head}>
        <h2 className={s.title}>{page.moment.title}</h2>
        <p className={s.hint}>{page.moment.hint}</p>
      </header>
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
        <SignalCard key={pick} signal={SIGNALS[pick]} handled={handled} />
        <p className={s.note}>{page.moment.note}</p>
      </div>
    </>
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
        <p className={s.note}>{page.proof.note}</p>
      </div>
    </>
  );
}

export function SignalsPage({ page }: { page: ProductPage }) {
  return (
    <>
      <NameHero page={page} layout="split" art={<ProductVideo video={page.video} title="Signals product tour" fitRatio={760 / 500} fallback={<HeroBoard page={page} />} />} />
      <HowItWorks
        page={page}
        variant="aside"
        hasDock
        aside={<NightBoard at="home" bubble="3 fixes by 7am." states={{ home: "handled", store: "handled", ads: "handled", warehouse: "handled" }} />}
      />
      <Screen id="tap-a-store" bodyClassName={`l-container ${s.feed}`} label={page.moment.title}>
        <TapAStore page={page} />
      </Screen>
      <Capabilities page={page} variant="grid" />
      <Screen id="ranked" bodyClassName={`l-container ${s.feed}`} label={page.proof.title}>
        <Ranked page={page} />
      </Screen>
      <Close page={page} />
    </>
  );
}
