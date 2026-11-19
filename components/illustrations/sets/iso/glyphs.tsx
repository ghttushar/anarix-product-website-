import type { ReactNode } from "react";
import { Block, Cyl, isoCss, makeIso, type Iso } from "./kit";

/*
  Small isometric marks, drawn once and always "powered": each product
  page's closing mark, and the store tiles on the Signals buttons.
*/
function Glyph({ w, h, children, className }: { w: number; h: number; children: (iso: Iso) => ReactNode; className?: string }) {
  const iso = makeIso(w / 2, h - 12);
  return (
    <span className={`${isoCss.stage} ${isoCss.glyph} ${className ?? ""}`} data-arrived="true" data-play="true" style={{ width: "auto" }}>
      <svg viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={{ display: "block", height: "100%", width: "auto", overflow: "visible" }}>
        {children(iso)}
      </svg>
    </span>
  );
}

/** Signals: a store tile with the one coral tag */
export function SignalsMark() {
  return (
    <Glyph w={84} h={64}>
      {(iso) => (
        <>
          <Block iso={iso} x={-30} y={-22} w={60} d={44} h={5} tone="plate" />
          <Block iso={iso} x={-24} y={-10} w={14} d={22} h={12} z={5} />
          <Block iso={iso} x={-6} y={-10} w={14} d={22} h={20} z={5} tone="risk" />
          <Block iso={iso} x={12} y={-10} w={14} d={22} h={12} z={5} />
        </>
      )}
    </Glyph>
  );
}

/** Profitability: the column, with what is left in periwinkle */
export function ProfitMark() {
  return (
    <Glyph w={64} h={74}>
      {(iso) => (
        <>
          <Block iso={iso} x={-18} y={-18} w={36} d={36} h={16} tone="hot" />
          <Block iso={iso} x={-18} y={-18} w={36} d={36} h={10} z={20} tone="risk" />
          <Block iso={iso} x={-18} y={-18} w={36} d={36} h={8} z={34} tone="risk" />
        </>
      )}
    </Glyph>
  );
}

/** Rules: the gate, one change through it */
export function RulesMark() {
  return (
    <Glyph w={84} h={70}>
      {(iso) => (
        <>
          <Block iso={iso} x={-4} y={-26} w={8} d={8} h={36} />
          <Block iso={iso} x={-34} y={-8} w={68} d={16} h={4} tone="plate" />
          <Block iso={iso} x={14} y={-6} w={12} d={12} h={12} z={4} tone="hot" />
          <Block iso={iso} x={-4} y={18} w={8} d={8} h={36} />
          <Block iso={iso} x={-4} y={-26} w={8} d={52} h={6} z={36} tone="hot" />
        </>
      )}
    </Glyph>
  );
}

/** MCP: a socket with two pins */
export function McpMark() {
  return (
    <Glyph w={70} h={64}>
      {(iso) => (
        <>
          <Block iso={iso} x={-20} y={-20} w={40} d={40} h={16} tone="hot" />
          <Cyl iso={iso} x={-6} y={-6} r={3.5} h={12} z={16} />
          <Cyl iso={iso} x={8} y={8} r={3.5} h={12} z={16} />
        </>
      )}
    </Glyph>
  );
}

/** a store, small, for the Signals buttons: the coral tile when it is the one */
export function StoreTile({ lit = false }: { lit?: boolean }) {
  return (
    <Glyph w={64} h={44} className={isoCss.tile}>
      {(iso) => (
        <>
          <Block iso={iso} x={-24} y={-16} w={48} d={32} h={4} tone="plate" />
          <Block iso={iso} x={-19} y={-8} w={10} d={16} h={8} z={4} />
          <Block iso={iso} x={-5} y={-8} w={10} d={16} h={lit ? 14 : 8} z={4} tone={lit ? "risk" : "base"} />
          <Block iso={iso} x={9} y={-8} w={10} d={16} h={8} z={4} />
        </>
      )}
    </Glyph>
  );
}
