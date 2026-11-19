"use client";

import { useEffect, useState } from "react";
import { Screen, useScreen } from "@/components/layout/Screen";
import { ProfitLedger } from "@/components/illustrations/sets/nocturne/places";
import { MarketTable } from "@/components/product-ui/MarketTable";
import type { ProductPage } from "@/content/products/types";
import { COSTS, SALES } from "@/content/products/samples";
import { NameHero } from "../NameHero";
import { Close } from "../Close";
import { Figure, money, useHandled } from "../shared";
import l from "./profitability.module.css";

/*
  Profitability: the ledger. A cross-section of one day's money, figures set
  as type. Switch each cost on and watch what is really left.
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
    const timers = COSTS.map((_, i) => window.setTimeout(() => setOn((o) => o.map((v, k) => (k === i ? true : v))), 700 + i * 650));
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
        <p className={l.big}>
          <span className={l.bigFig}>
            <Figure text={money(profit)} />
          </span>
          <span className={l.bigK}>{profit === SALES ? "revenue" : on.every(Boolean) ? "true profit" : "so far"}</span>
        </p>
        <p className={l.margin}>
          Margin <span className={l.fig}>{((profit / SALES) * 100).toFixed(1)}%</span>
        </p>
        <div className={l.split} aria-hidden="true">
          {COSTS.map((c, i) => (
            <span key={c.k} className={l.part} data-on={on[i] ? "true" : "false"} style={{ flexGrow: c.v }}>
              <i>{c.k}</i>
            </span>
          ))}
          <span className={l.left} style={{ flexGrow: SALES - COSTS.reduce((a, c) => a + c.v, 0) }}>
            <i>Profit</i>
          </span>
        </div>
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
      <NameHero page={page} layout="ledger" art={<ProfitLedger sales={SALES} costs={COSTS} on={ALL_ON} bubble={page.bubble} />} />
      <Screen id="take-out-the-costs" bodyClassName={`l-container ${l.moment}`} label={page.moment.title}>
        <TakeOutTheCosts page={page} />
      </Screen>
      <Screen id="marketplaces" bodyClassName={`l-container ${l.proof}`} label={page.proof.title}>
        <Markets page={page} />
      </Screen>
      <Close page={page} />
    </>
  );
}
