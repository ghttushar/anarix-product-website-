"use client";

import Link from "next/link";
import { Screen } from "@/components/layout/Screen";
import { AanDock } from "@/components/aan/v2/AanDock";
import { ShopRow } from "@/components/illustrations/sets/nocturne/ShopRow";
import { McpPole } from "@/components/illustrations/sets/nocturne/McpPole";
import { GatehouseBelt, ProfitLedger } from "@/components/illustrations/sets/nocturne/places";
import { SignalCard } from "@/components/product-ui/SignalCard";
import { McpTerminal } from "@/components/product-ui/McpTerminal";
import { Typewriter } from "@/components/motion/Typewriter";
import { Figure, useHandled } from "@/components/product-page/shared";
import type { ProductCopy } from "@/content/home";
import { COSTS, QUESTIONS, RULES, SALES } from "@/content/products/samples";
import { Ink } from "./Ink";
import ps from "./product-screens.module.css";

/*
  5–9 · One product per screen, each in its own layout, previewing its page:
  Signals is the shop row and its alert; Profitability is the ledger; Rules is
  the belt running edge to edge; Ask Aan is a conversation; MCP is the pole
  and the terminal. A headline, one line, and the way to the page.
*/
const Arrow = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

function Copy({ p, className }: { p: ProductCopy; className?: string }) {
  return (
    <div className={className}>
      <h2 className="t-h2">
        {p.title[0]}
        <br />
        {p.title[1]}
      </h2>
      <p className="t-statement">
        <Ink text={p.statement} />
      </p>
      <div className="c-actions">
        <Link className="c-link" href={p.link.href}>
          {p.link.label} <Arrow />
        </Link>
      </div>
    </div>
  );
}

function Signals({ p }: { p: ProductCopy }) {
  const handled = useHandled();
  return (
    <>
      <div className={ps.sigArt} data-optional>
        <ShopRow stop={p.id} bubble={p.bubble} lead={false} />
      </div>
      <Copy p={p} className={ps.sigCopy} />
      <div className={ps.sigCard}>
        <SignalCard handled={handled} />
        <p className={ps.sample}>Sample data</p>
      </div>
    </>
  );
}

function Profitability({ p }: { p: ProductCopy }) {
  const profit = SALES - COSTS.reduce((a, c) => a + c.v, 0);
  return (
    <>
      <Copy p={p} className={ps.profitCopy} />
      <p className={ps.profitFig}>
        <b>
          <Figure text={`$${profit.toLocaleString("en-US")}`} />
        </b>
        <span>true profit, from ${SALES.toLocaleString("en-US")} in sales</span>
        <span className={ps.sample}>Sample data</span>
      </p>
      <div className={ps.profitArt}>
        <ProfitLedger sales={SALES} costs={COSTS} on={COSTS.map(() => true)} stop={p.id} bubble={p.bubble} />
      </div>
    </>
  );
}

function Rules({ p }: { p: ProductCopy }) {
  return (
    <>
      <Copy p={p} className={`l-container ${ps.rulesCopy}`} />
      <div className={ps.rulesBand}>
        <GatehouseBelt stop={p.id} stops={RULES[0].stops} label={RULES[0].stopped} bubble={p.bubble} />
      </div>
    </>
  );
}

function Aan({ p }: { p: ProductCopy }) {
  const handled = useHandled(600);
  const qa = QUESTIONS[0];
  return (
    <>
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
      <Copy p={p} className={ps.talkCopy} />
    </>
  );
}

function Mcp({ p }: { p: ProductCopy }) {
  const handled = useHandled();
  return (
    <>
      <div className={ps.mcpVisual}>
        <div data-optional>
          <McpPole stop={p.id} bubble={p.bubble} />
        </div>
        <div>
          <McpTerminal handled={handled} />
          <p className={ps.sample}>Illustrative</p>
        </div>
      </div>
      <Copy p={p} className={ps.mcpCopy} />
    </>
  );
}

const LAYOUT = {
  signals: { body: `l-container ${ps.signals}`, View: Signals },
  profitability: { body: `l-container ${ps.profit}`, View: Profitability },
  rules: { body: ps.rules, View: Rules },
  aan: { body: `l-container ${ps.aan}`, View: Aan },
  mcp: { body: `l-container ${ps.mcp}`, View: Mcp },
};

export function ProductScreen({ p }: { p: ProductCopy }) {
  const { body, View } = LAYOUT[p.id];
  return (
    <Screen id={p.id} hasDock bodyClassName={body} label={p.title.join(" ")}>
      <View p={p} />
    </Screen>
  );
}
