"use client";

import { useEffect, useState, type ComponentType } from "react";
import { Screen, useScreen } from "@/components/layout/Screen";
import { ShopRow } from "@/components/illustrations/sets/nocturne/ShopRow";
import { ProfitRoad } from "@/components/illustrations/sets/nocturne/ProfitRoad";
import { RulesGate } from "@/components/illustrations/sets/nocturne/RulesGate";
import { AskCorner } from "@/components/illustrations/sets/nocturne/AskCorner";
import { McpPole } from "@/components/illustrations/sets/nocturne/McpPole";
import { SignalCard } from "@/components/product-ui/SignalCard";
import { ProfitCard } from "@/components/product-ui/ProfitCard";
import { RulesTable } from "@/components/product-ui/RulesTable";
import { AanChat } from "@/components/product-ui/AanChat";
import { McpTerminal } from "@/components/product-ui/McpTerminal";
import type { ProductCopy } from "@/content/home";
import { Ink } from "./Ink";
import h from "./home.module.css";

type Pair = {
  Art: ComponentType<{ stop?: string; bubble?: string }>;
  Ui: ComponentType<{ handled: boolean }>;
  /** the product UI is sample data, except the MCP transcript (illustrative) */
  note: string;
};

/* each product: the drawing shows the mechanism, the card shows the product */
const PAIRS: Record<ProductCopy["id"], Pair> = {
  signals: { Art: ShopRow, Ui: SignalCard, note: "Sample data" },
  profitability: { Art: ProfitRoad, Ui: ProfitCard, note: "Sample data" },
  rules: { Art: RulesGate, Ui: RulesTable, note: "Sample data" },
  aan: { Art: AskCorner, Ui: AanChat, note: "Sample conversation" },
  mcp: { Art: McpPole, Ui: McpTerminal, note: "Sample session" },
};

const Arrow = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

/* the card settles a beat after Aan lands in the drawing */
function Visual({ p }: { p: ProductCopy }) {
  const { arrived } = useScreen();
  const [handled, setHandled] = useState(false);
  useEffect(() => {
    if (!arrived) return;
    const t = window.setTimeout(() => setHandled(true), 350);
    return () => window.clearTimeout(t);
  }, [arrived]);
  const { Art, Ui, note } = PAIRS[p.id];
  return (
    <div className={h.visual}>
      <div data-optional>
        <Art stop={p.id} bubble={p.bubble} />
      </div>
      <div>
        <Ui handled={handled} />
        <p className={h.sample}>{note}</p>
      </div>
    </div>
  );
}

/* 5–9 · One product per screen: claim, statement, three ruled points, and the
   product proving it beside a drawing of how it works. */
export function ProductScreen({ p }: { p: ProductCopy }) {
  // dedicated pages arrive in Phase 3; until then the link only shows when it
  // leads somewhere other than this screen
  const explore = p.link.href.startsWith("/");
  return (
    <Screen id={p.id} hasDock bodyClassName={`l-container l-grid ${h.split}`} label={p.title.join(" ")}>
      <div className={h.copy}>
        <h2 className="t-h2">
          {p.title[0]}
          <br />
          {p.title[1]}
        </h2>
        <p className="t-statement">
          <Ink text={p.statement} />
        </p>
        <ul className="c-points">
          {p.points.map((pt, i) => (
            <li key={pt.title} data-optional={i === 2 ? true : undefined}>
              <b>{pt.title}</b>
              <span>{pt.text}</span>
            </li>
          ))}
        </ul>
        {explore && (
          <div className="c-actions">
            <a className="c-link" href={p.link.href}>
              {p.link.label} <Arrow />
            </a>
          </div>
        )}
      </div>
      <Visual p={p} />
    </Screen>
  );
}
