"use client";

import { useEffect, useState } from "react";
import { Screen, useScreen } from "@/components/layout/Screen";
import { MarketTable } from "@/components/product-ui/MarketTable";
import { ProfitWaterfall } from "@/components/product-ui/ProfitWaterfall";
import { ProductFrame } from "@/components/visual/ProductFrame";
import type { ProductPage } from "@/content/products/types";
import { COSTS, SALES } from "@/content/products/samples";
import { NameHero } from "../NameHero";
import { Close } from "../Close";
import { Capabilities, HowItWorks } from "../Sections";
import { money, Tour, useHandled } from "../shared";
import l from "./profitability.module.css";

/*
  Profitability: the ledger. One day's sales, each cost stepping down from it
  in the waterfall, and what is left standing is the profit. Figures set as
  type. Switch each cost on in the receipt and watch what is really left.
*/
const ALL_ON = COSTS.map(() => true);

function TakeOutTheCosts({ page }: { page: ProductPage }) {
  const { arrived, reduced } = useScreen();
  const [on, setOn] = useState<boolean[]>(COSTS.map(() => false));
  const [touched, setTouched] = useState(false);

  // a visitor who never taps still sees the point: the costs come off one by one
  useEffect(() => {
    if (!arrived || touched) return;
    if (reduced) {
      setOn(ALL_ON);
      return;
    }
    // the visitor gets a few seconds to take the first cost out themselves
    const timers = COSTS.map((_, i) => window.setTimeout(() => setOn((o) => o.map((v, k) => (k === i ? true : v))), 4000 + i * 650));
    return () => timers.forEach(window.clearTimeout);
  }, [arrived, reduced, touched]);

  const toggle = (i: number) => {
    setTouched(true);
    setOn((o) => o.map((v, k) => (k === i ? !v : v)));
  };
  const profit = SALES - COSTS.reduce((a, c, i) => a + (on[i] ? c.v : 0), 0);

  return (
    <>
      <div className={l.ledgerCol}>
        <h2 className={l.title}>{page.moment.title}</h2>
        <p className={l.hint}>{page.moment.hint}</p>
        <div className={l.receipt}>
          <p className={l.row}>
            <span>Sales</span>
            <span className={l.fig}>{money(SALES)}</span>
          </p>
          {COSTS.map((c, i) => (
            <button key={c.k} type="button" className={l.row} aria-pressed={on[i]} onClick={() => toggle(i)}>
              <span className={l.box} aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M3.5 8.5l3 3 6-7" />
                </svg>
              </span>
              <span>{c.long}</span>
              <span className={`${l.fig} ${l.cost}`}>−{money(c.v)}</span>
            </button>
          ))}
          <p className={`${l.row} ${l.total}`} aria-live={touched ? "polite" : "off"}>
            <span>What's left</span>
            <span className={l.fig}>{money(profit)}</span>
          </p>
        </div>
      </div>
      <div className={l.chartCol}>
        <ProductFrame title="Profitability / Yesterday" note="Sample data" lean="right">
          <ProfitWaterfall on={on} />
        </ProductFrame>
        <p className={l.note}>{page.moment.note}</p>
      </div>
    </>
  );
}

function Markets({ page }: { page: ProductPage }) {
  const handled = useHandled(400);
  return (
    <>
      <header className={l.proofHead}>
        <h2 className={l.title}>{page.proof.title}</h2>
        <p className={l.hint}>{page.proof.line}</p>
      </header>
      <div className={l.proofTable}>
        <MarketTable handled={handled} />
        <p className={l.note}>{page.proof.note}</p>
      </div>
    </>
  );
}

export function ProfitabilityPage({ page }: { page: ProductPage }) {
  return (
    <>
      <NameHero
        page={page}
        layout="ledger"
        frame="Profitability / Yesterday"
        art={
          <Tour page={page} title="Profitability product tour">
            <ProfitWaterfall on={ALL_ON} compact />
          </Tour>
        }
      />
      <HowItWorks page={page} variant="rail" />
      <Screen id="take-out-the-costs" bodyClassName={`l-container ${l.moment}`} label={page.moment.title}>
        <TakeOutTheCosts page={page} />
      </Screen>
      <Capabilities page={page} variant="list" />
      <Screen id="marketplaces" bodyClassName={`l-container ${l.proof}`} label={page.proof.title}>
        <Markets page={page} />
      </Screen>
      <Close page={page} />
    </>
  );
}
