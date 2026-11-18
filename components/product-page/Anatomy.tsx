"use client";

import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { Screen, useScreen } from "@/components/layout/Screen";
import type { ProductPage } from "@/content/products/types";
import { PRODUCT_UI, useHandled } from "./shared";
import p from "./page.module.css";

/*
  3 · Anatomy: the product UI at a readable size, with numbered callouts in a
  gutter beside it and a leader line from each number into the part it names.
  A leader only ever crosses empty space: parts that start at the card's edge
  are reached straight across; parts further in are reached along the gap
  above them, then down. The list on the left numbers only the parts that are
  on screen at this size. Pointing at either side lights both.
*/
type Mark = { n: number; label: number; y: number; d: string; tx: number; ty: number };

function useMarks(stage: RefObject<HTMLDivElement | null>, count: number, deps: unknown[]) {
  const [marks, setMarks] = useState<Mark[] | null>(null);
  const [gx, setGx] = useState(0);

  const measure = useCallback(() => {
    const st = stage.current;
    const card = st?.querySelector<HTMLElement>("[data-ui]");
    if (!st || !card) return;
    const s = st.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    const padL = parseFloat(getComputedStyle(card).paddingLeft) || 0;
    const narrow = window.matchMedia("(max-width: 900px)").matches;
    const cardX = c.left - s.left;
    const markerX = cardX - (narrow ? 16 : 30);

    type Raw = { n: number; inner: boolean; tx: number; ty: number; ry: number };
    const raw: Raw[] = [];
    for (let n = 1; n <= count; n++) {
      const el = st.querySelector<HTMLElement>(`[data-part="${n}"]`);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue; // not shown at this size
      const inner = r.left - (c.left + padL) > 24;
      const top = r.top - s.top;
      if (inner) {
        // along the gap above, then down onto the part; two routes never share a line
        let ry = top - 9;
        while (raw.some((q) => q.inner && Math.abs(q.ry - ry) < 5)) ry += 6;
        raw.push({ n, inner, tx: r.left - s.left + 6, ty: top - 1, ry });
      } else {
        const ty = top + Math.min(r.height / 2, 12);
        raw.push({ n, inner, tx: r.left - s.left - 5, ty, ry: ty });
      }
    }

    // labels follow the list order; numbers stack in the order the leaders
    // enter the card (so none cross), at least 26px apart
    const label = new Map(raw.map((m, i) => [m.n, i + 1]));
    raw.sort((a, b) => a.ry - b.ry);
    const out: Mark[] = [];
    let last = -Infinity;
    raw.forEach((m) => {
      const y = Math.max(m.ry, last + 26);
      last = y;
      const d = m.inner ? `M${markerX + 11} ${y} H${cardX - 12} L${cardX - 2} ${m.ry} H${m.tx} V${m.ty}` : `M${markerX + 11} ${y} H${cardX - 12} L${cardX - 2} ${m.ry} H${m.tx}`;
      out.push({ n: m.n, label: label.get(m.n) ?? 0, y, d, tx: m.tx, ty: m.ty });
    });
    setGx(markerX);
    setMarks(out);
  }, [stage, count]);

  useLayoutEffect(() => {
    measure();
    const st = stage.current;
    if (!st) return;
    const ro = new ResizeObserver(measure);
    ro.observe(st);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, ...deps]);
  return { marks, gx };
}

function Parts({ page }: { page: ProductPage }) {
  const { inView } = useScreen();
  const handled = useHandled();
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const Ui = PRODUCT_UI[page.id];
  const { marks, gx } = useMarks(stage, page.anatomy.parts.length, [handled]);

  // before the first measure every part is listed; after it, only those shown
  const listed = page.anatomy.parts.map((part, i) => ({ part, n: i + 1, mark: marks?.find((m) => m.n === i + 1) })).filter((x) => !marks || x.mark);

  return (
    <>
      <div className={p.copy}>
        <h2 className="t-h2">{page.anatomy.title}</h2>
        <p className={`t-statement ${p.anatomyLead}`}>{page.anatomy.text}</p>
        <ol className={p.parts}>
          {listed.map(({ part, n, mark }, i) => (
            <li key={part.title} data-active={active === n ? "true" : undefined} onPointerEnter={() => setActive(n)} onPointerLeave={() => setActive(null)}>
              <span className={p.num} aria-hidden="true">
                {mark?.label ?? i + 1}
              </span>
              <b>{part.title}</b>
              <span className={p.partText}>{part.text}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className={p.anatomyVisual}>
        <div ref={stage} className={p.stage} data-drawn={inView ? "true" : "false"}>
          <Ui handled={handled} />
          <svg className={p.leaders} aria-hidden="true">
            {marks?.map((m, i) => (
              <g key={m.n} data-active={active === m.n ? "true" : undefined} style={{ "--i": i } as CSSProperties}>
                <path pathLength={1} d={m.d} />
                <circle cx={m.tx} cy={m.ty} r={2.5} />
              </g>
            ))}
          </svg>
          {marks?.map((m, i) => (
            <span
              key={m.n}
              className={p.marker}
              data-active={active === m.n ? "true" : undefined}
              style={{ left: gx - 11, top: m.y - 11, "--i": i } as CSSProperties}
              onPointerEnter={() => setActive(m.n)}
              onPointerLeave={() => setActive(null)}
              aria-hidden="true"
            >
              {m.label}
            </span>
          ))}
        </div>
        <p className={p.sample}>{page.anatomy.note}</p>
      </div>
    </>
  );
}

export function Anatomy({ page }: { page: ProductPage }) {
  return (
    <Screen id="anatomy" bodyClassName={`l-container l-grid ${p.split} ${p.anatomy}`} label={page.anatomy.title}>
      <Parts page={page} />
    </Screen>
  );
}
