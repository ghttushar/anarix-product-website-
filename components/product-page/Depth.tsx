"use client";

import { Screen } from "@/components/layout/Screen";
import { Reveal } from "@/components/motion/Reveal";
import { AanMascot } from "@/components/aan/AanMascot";
import { RankedList } from "@/components/product-ui/RankedList";
import { MarketTable } from "@/components/product-ui/MarketTable";
import { RuleBuilder } from "@/components/product-ui/RuleBuilder";
import { SameNumbers } from "@/components/product-ui/SameNumbers";
import { MorningBrief } from "@/components/product-ui/MorningBrief";
import type { Depth } from "@/content/products/types";
import { useHandled } from "./shared";
import p from "./page.module.css";

/* a depth chapter with copy on the left and one product card proving it */
function CardDepth({ d }: { d: Extract<Depth, { kind: "ranked" | "markets" | "rule" | "same" | "brief" }> }) {
  const handled = useHandled();
  const card =
    d.kind === "ranked" ? (
      <RankedList handled={handled} />
    ) : d.kind === "markets" ? (
      <MarketTable handled={handled} />
    ) : d.kind === "rule" ? (
      <RuleBuilder handled={handled} />
    ) : d.kind === "brief" ? (
      <MorningBrief handled={handled} />
    ) : (
      <SameNumbers handled={handled} />
    );
  const extra = d.kind === "markets" ? d.flag : d.kind === "rule" ? d.control : d.kind === "same" ? d.what : null;
  return (
    <>
      <div className={p.copy}>
        <h2 className="t-h2">{d.title}</h2>
        <p className="t-statement">{d.text}</p>
        {extra && <p className={p.extra}>{extra}</p>}
      </div>
      <div className={p.visual}>
        {card}
        <p className={p.sample}>{d.kind === "same" ? "Illustrative" : "Sample data"}</p>
      </div>
    </>
  );
}

/* Aan's four shapes, each with what it means */
function Shapes({ d }: { d: Extract<Depth, { kind: "shapes" }> }) {
  return (
    <div className={p.wide}>
      <h2 className="t-h2">{d.title}</h2>
      <p className="t-statement">{d.text}</p>
      <ul className={p.shapes}>
        {d.shapes.map((sh, i) => (
          <Reveal as="li" key={sh.state} order={i + 1}>
            <span className={p.shapeAan}>
              <AanMascot state={sh.state} size={72} glow={false} shadow={false} />
            </span>
            <b>{sh.name}</b>
            <span>{sh.text}</span>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

/* 4 · Depth: one idea from the copy deck per screen */
export function DepthScreen({ d, index }: { d: Depth; index: number }) {
  const wide = d.kind === "shapes";
  return (
    <Screen id={`depth-${index + 1}`} bodyClassName={`l-container ${wide ? p.wideBody : `l-grid ${p.split}`}`} label={d.title}>
      {d.kind === "shapes" ? <Shapes d={d} /> : <CardDepth d={d} />}
    </Screen>
  );
}
