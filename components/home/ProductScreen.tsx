"use client";

import Link from "next/link";
import { Screen } from "@/components/layout/Screen";
import { AanMascot } from "@/components/aan/AanMascot";
import { AnswerChart } from "@/components/product-ui/AnswerChart";
import { SignalsBoard } from "@/components/illustrations/sets/iso/SignalsBoard";
import { ProfitStack } from "@/components/illustrations/sets/iso/ProfitStack";
import { RuleGate } from "@/components/illustrations/sets/iso/RuleGate";
import { McpPole } from "@/components/illustrations/sets/nocturne/McpPole";
import { McpTerminal } from "@/components/product-ui/McpTerminal";
import { Reveal } from "@/components/motion/Reveal";
import { useHandled } from "@/components/product-page/shared";
import { works, type ProductCopy } from "@/content/home";
import { COSTS, QUESTIONS, RULES, SALES } from "@/content/products/samples";
import { Ink } from "./Ink";
import ps from "./product-screens.module.css";

/*
  5–9 · One product per screen: its name, a hook, what it is, three things it
  does and the way to its page, beside a preview of that page. The copy side
  alternates so the five read as a sequence, not a stack of twins:
  Signals (board and alert), Profitability (the stack), Rules (the gate),
  Ask Aan (a conversation), MCP (the pole and the terminal).
*/
const Arrow = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

function Copy({ p }: { p: ProductCopy }) {
  return (
    <div className={ps.copy}>
      <p className={ps.kicker}>{p.kicker}</p>
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

function Signals({ p }: { p: ProductCopy }) {
  const handled = useHandled(1400);
  return (
    <div>
      <SignalsBoard stop={p.id} handled={handled} dock={false} />
      <p className={ps.sample}>Sample data</p>
    </div>
  );
}

function Profitability({ p }: { p: ProductCopy }) {
  return (
    <div>
      <ProfitStack sales={SALES} costs={COSTS} on={COSTS.map(() => true)} stop={p.id} dock={false} />
      <p className={ps.sample}>Sample data · one day</p>
    </div>
  );
}

function Rules({ p }: { p: ProductCopy }) {
  return (
    <div>
      <RuleGate stop={p.id} stops={RULES[0].stops} label={RULES[0].stopped} rule={RULES[0].sentence} dock={false} />
      <p className={ps.sample}>Sample rule</p>
    </div>
  );
}

function Aan() {
  const qa = QUESTIONS[1];
  return (
    <div className={ps.talk}>
      <p className={ps.you}>{qa.q}</p>
      <div className={ps.reply}>
        <span className={ps.speaker}>
          <AanMascot state="diamond" size={28} glow={false} shadow={false} />
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
      <p className={ps.sample}>Sample conversation</p>
    </div>
  );
}

function Mcp({ p }: { p: ProductCopy }) {
  const handled = useHandled();
  return (
    <div className={ps.mcpVisual}>
      <div data-optional>
        <McpPole stop={p.id} dock={false} />
      </div>
      <div>
        <McpTerminal handled={handled} />
        <p className={ps.sample}>Illustrative</p>
      </div>
    </div>
  );
}

const VIEW: Record<ProductCopy["id"], (props: { p: ProductCopy }) => React.ReactNode> = { signals: Signals, profitability: Profitability, rules: Rules, aan: Aan, mcp: Mcp };
/** which side the words sit on, alternating down the page */
const SIDE = { signals: "left", profitability: "right", rules: "left", aan: "right", mcp: "left" } as const;

export function ProductScreen({ p }: { p: ProductCopy }) {
  const View = VIEW[p.id];
  return (
    <Screen id={p.id} fit="grow" bodyClassName={`l-container ${ps.screen}`} label={p.title.join(" ")}>
      <div className={ps.pair} data-side={SIDE[p.id]} data-id={p.id}>
        <Copy p={p} />
        <div className={ps.visual}>
          <View p={p} />
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
