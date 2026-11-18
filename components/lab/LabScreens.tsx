"use client";

import { useEffect, useState } from "react";
import { Screen, useScreen } from "@/components/layout/Screen";
import { Street } from "@/components/illustrations/sets/nocturne/Street";
import { ShopRow } from "@/components/illustrations/sets/nocturne/ShopRow";
import { SignalCard } from "@/components/product-ui/SignalCard";
import l from "./lab.module.css";

const Arrow = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

/* Screen 1: the street that never closes */
export function LabHero() {
  return (
    <Screen id="hero" hasDock bodyClassName={l.heroBody} label="Anarix platform">
      <div className={`l-container ${l.heroCopy}`}>
        <h1 className={`t-display ${l.h1}`}>
          <span>One AI.</span>
          <span>Every marketplace.</span>
          <span className="t-accent">Always on.</span>
        </h1>
        <p className="t-statement">
          Aan is your <b>24/7 e-commerce account manager</b>. It watches your Amazon, Walmart and Shopify accounts around the clock and acts before problems cost you.
        </p>
        <div className="c-actions">
          <a className="c-cta" href="https://www.anarix.ai/contact-us">
            Book a demo
          </a>
          <a className="c-link" href="/platform/aan">
            Meet Aan
          </a>
        </div>
      </div>
      <div className={l.heroStreet} data-bleed>
        <Street stop="hero" bubble="I'm Aan. The Guardian of your Business!" />
      </div>
    </Screen>
  );
}

/* the alert settles once Aan has found the listing that moved */
function SignalsVisual() {
  const { arrived } = useScreen();
  const [handled, setHandled] = useState(false);
  useEffect(() => {
    if (!arrived) return;
    const t = window.setTimeout(() => setHandled(true), 350);
    return () => window.clearTimeout(t);
  }, [arrived]);
  return (
    <div className={l.productVisual}>
      <div data-optional>
        <ShopRow stop="signals" bubble="Found it. Here's why." />
      </div>
      <div>
        <SignalCard handled={handled} />
        <p className={l.sample}>Sample data</p>
      </div>
    </div>
  );
}

/* Screen 5: Signals, one lean screen */
export function LabSignals() {
  return (
    <Screen id="signals" hasDock bodyClassName={`l-container l-grid ${l.productBody}`} label="Signals">
      <div className={l.productCopy}>
        <h2 className="t-h2">
          3am change.
          <br />
          9am answer.
        </h2>
        <p className="t-statement">
          Signals watches <b>every price, Buy Box, budget and stock level</b> across Amazon, Walmart and Shopify, and tells you <b>what changed, why it matters and what to do</b>.
        </p>
        <ul className="c-points">
          <li>
            <b>Root cause, not just an alert</b>
            <span>Every signal explains what moved and why.</span>
          </li>
          <li>
            <b>Ranked by money at risk</b>
            <span>The biggest dollar impact rises to the top.</span>
          </li>
          <li data-optional>
            <b>Fix it from the alert</b>
            <span>Execute, modify or assign without opening another tool.</span>
          </li>
        </ul>
        <div className="c-actions">
          <a className="c-link" href="/platform/signals">
            Explore Signals <Arrow />
          </a>
        </div>
      </div>
      <SignalsVisual />
    </Screen>
  );
}
