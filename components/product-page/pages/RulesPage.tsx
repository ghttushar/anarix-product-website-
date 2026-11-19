"use client";

import { useState } from "react";
import { Screen } from "@/components/layout/Screen";
import { RuleGate } from "@/components/illustrations/sets/iso/RuleGate";
import { Guardrails } from "@/components/illustrations/sets/iso/Guardrails";
import { ProductVideo } from "@/components/media/ProductVideo";
import type { ProductPage } from "@/content/products/types";
import { DECISIONS, RULES } from "@/content/products/samples";
import { NameHero } from "../NameHero";
import { Close } from "../Close";
import { Capabilities, HowItWorks } from "../Sections";
import r from "./rules.module.css";

/*
  Rules: the gatehouse on the belt, side on, running edge to edge. Then the
  machine, read left to right: a sentence goes in, a rule comes out, and the
  gate sorts by it.
*/
const Arrow = () => (
  <svg className={r.arrow} viewBox="0 0 40 16" aria-hidden="true">
    <path d="M2 8h34M30 2l6 6-6 6" />
  </svg>
);

function SayItInASentence({ page }: { page: ProductPage }) {
  const [pick, setPick] = useState(0);
  const rule = RULES[pick];
  return (
    <>
      <header className={r.head}>
        <h2 className={r.title}>{page.moment.title}</h2>
        <p className={r.hint}>{page.moment.hint}</p>
      </header>
      <div className={r.flow}>
        <div className={r.sentences} role="group" aria-label="Rules in plain words">
          <p className={r.k}>You say</p>
          {RULES.map((rl, i) => (
            <button key={rl.sentence} type="button" className={r.sentence} aria-pressed={pick === i} onClick={() => setPick(i)}>
              “{rl.sentence}”
            </button>
          ))}
        </div>
        <Arrow />
        <div className={r.rule} aria-live="polite">
          <p className={r.k}>Aan builds</p>
          <dl className={r.compiled} key={pick}>
            {rule.parts.map((p, i) => (
              <div key={p.k} style={{ animationDelay: `${i * 140}ms` }}>
                <dt>{p.k}</dt>
                <dd>{p.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Arrow />
        <div className={r.result} key={`r${pick}`}>
          <p className={r.k}>The gate sorts</p>
          <p className={r.out}>
            <span className={r.stopped}>Stopped</span>
            <span>{rule.stopped}</span>
          </p>
          <p className={r.out}>
            <span className={r.allowed}>Allowed</span>
            <span>Everything else, as usual</span>
          </p>
        </div>
      </div>
      <p className={r.note}>{page.moment.note}</p>
    </>
  );
}

function Log({ page }: { page: ProductPage }) {
  return (
    <>
      <header className={r.head}>
        <h2 className={r.title}>{page.proof.title}</h2>
        <p className={r.hint}>{page.proof.line}</p>
      </header>
      <ol className={r.log}>
        {DECISIONS.map((x) => (
          <li key={x.t + x.what}>
            <time>{x.t}</time>
            <span className={x.ok ? r.allowed : r.stopped}>{x.ok ? "Allowed" : x.why.includes("approval") ? "Held" : "Stopped"}</span>
            <b>{x.what}</b>
            <span className={r.why}>{x.why}</span>
          </li>
        ))}
      </ol>
      <p className={r.note}>{page.proof.note}</p>
    </>
  );
}

export function RulesPage({ page }: { page: ProductPage }) {
  return (
    <>
      <NameHero
        page={page}
        layout="bleed"
        art={<ProductVideo video={page.video} title="Rules product tour" fitRatio={900 / 560} fallback={<RuleGate stops={RULES[0].stops} label={RULES[0].stopped} rule={RULES[0].sentence} bubble={page.bubble} />} />}
      />
      <HowItWorks page={page} variant="aside" hasDock aside={<Guardrails stop="guard" bubble="Over your limit? It waits." />} />
      <Screen id="say-it" bodyClassName={`l-container ${r.moment}`} label={page.moment.title}>
        <SayItInASentence page={page} />
      </Screen>
      <Capabilities page={page} variant="grid" />
      <Screen id="decisions" bodyClassName={`l-container ${r.moment}`} label={page.proof.title}>
        <Log page={page} />
      </Screen>
      <Close page={page} />
    </>
  );
}
