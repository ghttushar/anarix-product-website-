import type { ReactNode } from "react";
import { Block, isoCss, makeIso, type Iso } from "./kit";

/*
  Small isometric marks, drawn once and always "powered": the store tiles
  on the Signals buttons.
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
