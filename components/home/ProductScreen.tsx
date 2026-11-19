"use client";

import Link from "next/link";
import { Screen } from "@/components/layout/Screen";
import { AanDock } from "@/components/aan/v2/AanDock";
import { SignalsBoard } from "@/components/illustrations/sets/iso/SignalsBoard";
import { ProfitStack } from "@/components/illustrations/sets/iso/ProfitStack";
import { RuleGate } from "@/components/illustrations/sets/iso/RuleGate";
import { McpPole } from "@/components/illustrations/sets/nocturne/McpPole";
import { McpTerminal } from "@/components/product-ui/McpTerminal";
import { Typewriter } from "@/components/motion/Typewriter";
import { Reveal } from "@/components/motion/Reveal";
import { useHandled } from "@/components/product-page/shared";
import type { ProductCopy } from "@/content/home";
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
      <SignalsBoard stop={p.id} bubble={p.bubble} handled={handled} />
      <p className={ps.sample}>Sample data</p>
    </div>
  );
}

function Profitability({ p }: { p: ProductCopy }) {
  return (
    <div>
      <ProfitStack sales={SALES} costs={COSTS} on={COSTS.map(() => true)} stop={p.id} bubble={p.bubble} />
      <p className={ps.sample}>Sample data · one day</p>
    </div>
  );
}

function Rules({ p }: { p: ProductCopy }) {
  return (
    <div>
      <RuleGate stop={p.id} stops={RULES[0].stops} label={RULES[0].stopped} rule={RULES[0].sentence} bubble={p.bubble} />
      <p className={ps.sample}>Sample rule</p>
    </div>
  );
}

function Aan({ p }: { p: ProductCopy }) {
  const handled = useHandled(600);
  const qa = QUESTIONS[0];
  return (
    <div className={ps.talk}>
      <p className={ps.you}>{qa.q}</p>
      <div className={ps.reply}>
        {/* the travelling Aan answers here itself */}
        <span className={ps.speaker}>
          <AanDock stop={p.id} size={24} side="right" style={{ left: "50%", bottom: 0 }} />
        </span>
        <div>
          <Typewriter text={qa.a} play={handled} delay={200} className={ps.answer} />
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
        <McpPole stop={p.id} bubble={p.bubble} />
      </div>
      <div>
        <McpTerminal handled={handled} />
        <p className={ps.sample}>Illustrative</p>
      </div>
    </div>
  );
}

const VIEW = { signals: Signals, profitability: Profitability, rules: Rules, aan: Aan, mcp: Mcp };
/** which side the words sit on, alternating down the page */
const SIDE = { signals: "left", profitability: "right", rules: "left", aan: "right", mcp: "left" } as const;

export function ProductScreen({ p }: { p: ProductCopy }) {
  const View = VIEW[p.id];
  return (
    <Screen id={p.id} hasDock fit="grow" bodyClassName={`l-container ${ps.screen}`} label={p.title.join(" ")}>
      <div className={ps.pair} data-side={SIDE[p.id]} data-id={p.id}>
        <Copy p={p} />
        <div className={ps.visual}>
          <View p={p} />
        </div>
      </div>
    </Screen>
  );
}
