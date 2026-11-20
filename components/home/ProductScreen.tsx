"use client";

import Link from "next/link";
import { useState } from "react";
import { Screen } from "@/components/layout/Screen";
import { AanMascot } from "@/components/aan/AanMascot";
import { AnswerChart } from "@/components/product-ui/AnswerChart";
import { RankedList } from "@/components/product-ui/RankedList";
import { ProfitWaterfall } from "@/components/product-ui/ProfitWaterfall";
import { RuleCard } from "@/components/product-ui/RuleCard";
import { McpTerminal } from "@/components/product-ui/McpTerminal";
import { ProductFrame } from "@/components/visual/ProductFrame";
import { Reveal } from "@/components/motion/Reveal";
import { useHandled } from "@/components/product-page/shared";
import { works, type ProductCopy } from "@/content/home";
import { COSTS, QUESTIONS, RULES } from "@/content/products/samples";
import { Ink } from "./Ink";
import ps from "./product-screens.module.css";

/*
  5–9 · One product per screen, product-led (Linear, Stripe): Swiss words on
  one side, the product itself on the other, on a card with a light that
  follows the cursor. The sides alternate so the five read as a sequence. Each card does
  its one thing when it arrives: Signals sorts by money at risk, the
  waterfall's costs are switches, a sentence becomes a rule, Aan answers
  with its receipts, and your AI asks Anarix.
*/
const Arrow = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const INDEX: Record<ProductCopy["id"], string> = { signals: "01", profitability: "02", rules: "03", aan: "04", mcp: "05" };

function Copy({ p }: { p: ProductCopy }) {
  return (
    <div className={ps.copy}>
      <p className={ps.kicker}>
        <span>{INDEX[p.id]}</span>
        {p.kicker}
      </p>
      <h2 className="t-h2">
        {p.title[0]}
        <br />
        {p.title[1]}
      </h2>
      <p className="t-statement">
        <Ink text={p.statement} />
      </p>
      <ul className={ps.points}>
        {p.points.map((pt, i) => (
          <Reveal as="li" key={pt.t} order={i + 1}>
            <b>{pt.t}</b>
            <span>{pt.d}</span>
          </Reveal>
        ))}
      </ul>
      <div className="c-actions">
        <Link className="c-link" href={p.link.href}>
          {p.link.label} <Arrow />
        </Link>
      </div>
    </div>
  );
}

function Signals() {
  const handled = useHandled(1200);
  return (
    <ProductFrame title="Signals / Today" note="Sample data">
      <RankedList handled={handled} bare />
    </ProductFrame>
  );
}

function Profitability() {
  const [on, setOn] = useState<boolean[]>(COSTS.map(() => true));
  return (
    <ProductFrame title="Profitability / Yesterday" note="Sample data" lean="right">
      <ProfitWaterfall on={on} onToggle={(i) => setOn((o) => o.map((v, k) => (k === i ? !v : v)))} />
    </ProductFrame>
  );
}

function Rules() {
  const handled = useHandled(500);
  return (
    <ProductFrame title="Rules / New rule" note="Sample rule">
      <RuleCard rule={RULES[0]} handled={handled} />
    </ProductFrame>
  );
}

function Aan() {
  const qa = QUESTIONS[1];
  return (
    <ProductFrame title="Ask Aan" note="Sample conversation" lean="right">
      <div className={ps.talk}>
        <p className={ps.you}>{qa.q}</p>
        <div className={ps.reply}>
          <span className={ps.speaker}>
            <AanMascot state="diamond" size={26} glow={false} shadow={false} />
          </span>
          <div className={ps.answerCard}>
            <p className={ps.answer}>{qa.a}</p>
            <AnswerChart chart={qa.chart} />
            <p className={ps.sources}>
              {qa.sources.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </ProductFrame>
  );
}

function Mcp() {
  const handled = useHandled();
  return (
    <ProductFrame title="Claude / Anarix MCP" note="Illustrative">
      <McpTerminal handled={handled} bare />
    </ProductFrame>
  );
}

const VIEW: Record<ProductCopy["id"], () => React.ReactNode> = { signals: Signals, profitability: Profitability, rules: Rules, aan: Aan, mcp: Mcp };
/** which side the words sit on, alternating down the page */
const SIDE = { signals: "left", profitability: "right", rules: "left", aan: "right", mcp: "left" } as const;

export function ProductScreen({ p }: { p: ProductCopy }) {
  const View = VIEW[p.id];
  return (
    <Screen id={p.id} fit="grow" bodyClassName={`l-container ${ps.screen}`} label={p.title.join(" ")}>
      <div className={ps.pair} data-side={SIDE[p.id]} data-id={p.id}>
        <Copy p={p} />
        <div className={ps.visual}>
          <View />
        </div>
      </div>
      {/* MCP closes the product run with everything Anarix plugs into */}
      {p.id === "mcp" && (
        <dl className={ps.works}>
          {works.groups.map((g) => (
            <div key={g.label}>
              <dt>{g.label}</dt>
              <dd>{g.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      )}
    </Screen>
  );
}
