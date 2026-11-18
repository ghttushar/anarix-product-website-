"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/components/motion/useMediaQuery";
import { Screen, useScreen } from "@/components/layout/Screen";
import { StepLine } from "@/components/illustrations/sets/nocturne/StepLine";
import type { ProductPage } from "@/content/products/types";
import p from "./page.module.css";

const DWELL = 1700; // ms Aan stays at a step before walking on

function Steps({ page }: { page: ProductPage }) {
  const { arrived, reduced } = useScreen();
  const compact = useMediaQuery("(max-width: 640px)");
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  // once Aan is on the line: one walk through the steps, then all of them stand
  useEffect(() => {
    if (!arrived) return;
    if (reduced) {
      setStep(2);
      setDone(true);
      return;
    }
    const t1 = window.setTimeout(() => setStep(1), DWELL);
    const t2 = window.setTimeout(() => setStep(2), DWELL * 2);
    const t3 = window.setTimeout(() => setDone(true), DWELL * 3);
    return () => [t1, t2, t3].forEach(window.clearTimeout);
  }, [arrived, reduced]);

  const steps = page.how.steps;
  return (
    <>
      <div className={p.stepArt}>
        <StepLine steps={steps} step={step} stop="how" compact={compact} />
      </div>
      <ol className={p.steps}>
        {steps.map((st, i) => (
          <li key={st.title} data-state={done || i < step ? "past" : i === step && arrived ? "now" : "next"}>
            <b>
              <span className={p.stepN}>{i + 1}</span>
              {st.title}
            </b>
            <span>{st.text}</span>
          </li>
        ))}
      </ol>
    </>
  );
}

/* 2 · How it works: three steps on one line, and Aan walks it. */
export function HowItWorks({ page }: { page: ProductPage }) {
  return (
    <Screen id="how" hasDock bodyClassName={`l-container ${p.how}`} label={page.how.title}>
      <h2 className="t-h2">{page.how.title}</h2>
      <Steps page={page} />
    </Screen>
  );
}
