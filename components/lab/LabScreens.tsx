"use client";

import { useEffect, useState } from "react";
import { Street } from "@/components/illustrations/sets/nocturne/Street";
import { ShopRow } from "@/components/illustrations/sets/nocturne/ShopRow";
import { SignalCard } from "@/components/product-ui/SignalCard";
import { useInView } from "@/components/motion/useInView";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import l from "./lab.module.css";

const Arrow = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

/* Screen 1: the street that never closes */
export function LabHero() {
  return (
    <section className={`${l.screen} ${l.hero}`} data-screen="hero">
      <div className={l.heroBody}>
        <div className={`${l.container} ${l.heroCopy}`}>
          <h1 className={l.h1}>
            <span>One AI.</span>
            <span>Every marketplace.</span>
            <span className={l.on}>Always on.</span>
          </h1>
          <p className={l.lede}>
            Aan is your <b>24/7 e-commerce account manager</b>. It watches your Amazon, Walmart and Shopify accounts around the clock and acts before problems cost you.
          </p>
          <div className={l.actions}>
            <a className={l.primary} href="https://www.anarix.ai/contact-us">
              Book a demo
            </a>
            <a className={l.link} href="/platform/aan">
              Meet Aan
            </a>
          </div>
        </div>
        <div className={l.heroStreet} data-bleed>
          <Street bubble="I'm Aan. The Guardian of your Business!" />
        </div>
      </div>
    </section>
  );
}

/* Screen 5: Signals, one lean screen */
export function LabSignals() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.45 });
  const reduced = useReducedMotion();
  const [handled, setHandled] = useState(false);

  // the card settles once Aan has found the window that moved
  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => setHandled(true), reduced ? 0 : 2300);
    return () => window.clearTimeout(t);
  }, [inView, reduced]);

  return (
    <section ref={ref} className={l.screen} id="signals" data-screen="signals">
      <div className={`${l.container} ${l.productBody}`}>
        <div className={l.productCopy}>
          <h2 className={l.h2}>
            3am change.
            <br />
            9am answer.
          </h2>
          <p className={l.statement}>
            Signals watches <b>every price, Buy Box, budget and stock level</b> across Amazon, Walmart and Shopify, and tells you <b>what changed, why it matters and what to do</b>.
          </p>
          <ul className={l.points}>
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
          <div className={l.actions}>
            <a className={l.link} href="/platform/signals">
              Explore Signals <Arrow />
            </a>
          </div>
        </div>
        <div className={l.productVisual}>
          <div data-optional>
            <ShopRow play={inView} />
          </div>
          <div>
            <SignalCard handled={handled} />
            <p className={l.sample}>Sample data</p>
          </div>
        </div>
      </div>
    </section>
  );
}

