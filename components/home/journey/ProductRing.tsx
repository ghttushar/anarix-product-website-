"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { StoryScroll, useStoryProgress } from "@/components/layout/StoryScroll";
import { UiFrame } from "@/components/layout/UiFrame";
import { RankedList } from "@/components/product-ui/RankedList";
import { ProfitWaterfall } from "@/components/product-ui/ProfitWaterfall";
import { RuleCard } from "@/components/product-ui/RuleCard";
import { McpTerminal } from "@/components/product-ui/McpTerminal";
import { journey, products, type ProductCopy } from "@/content/home";
import { COSTS, QUESTIONS, RULES } from "@/content/products/samples";
import { DiamondBurst } from "./DiamondBurst";
import j from "./journey.module.css";

/*
  2–3 · The products on a ring, then the burst (structure from the
  Superconscious reference). The five product cards stand on a 3D arc that
  turns with the scroll and dwells on each card; giant words slide behind it.
  It settles on Ask Aan, whose hollow diamond (Aan's shape) opens and the page
  goes through it into the dark, where the Anarix mark rises.
  Five chapters for the ring, two for the burst. Only transforms, opacity
  and the diamond's clip move; reduced motion turns without easing.
*/
const ORDER = journey.ringOrder.map((id) => products.find((p) => p.id === id)!).filter(Boolean);
const RING = ORDER.length; // 5
const CHAPTERS = RING + 2;
const STEP = 38; // degrees between cards on the arc

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number) => Math.max(0, Math.min(1, v));

function Slice({ id }: { id: ProductCopy["id"] }) {
  if (id === "signals") return <RankedList handled bare />;
  if (id === "profitability") return <ProfitWaterfall on={COSTS.map(() => true)} compact />;
  if (id === "rules") return <RuleCard rule={RULES[0]} handled />;
  if (id === "mcp") return <McpTerminal handled bare />;
  return null;
}

function Card({ p, i, children }: { p: ProductCopy; i: number; children?: ReactNode }) {
  return (
    <article className={j.card} data-id={p.id} style={{ "--i": i } as CSSProperties} aria-label={p.kicker}>
      <p className={j.cardKicker}>
        <span>{String(i + 1).padStart(2, "0")}</span>
        {p.kicker}
      </p>
      <h3 className={j.cardTitle}>
        {p.title[0]}
        <br />
        {p.title[1]}
      </h3>
      <div className={j.cardUi}>
        {children ?? (
          <UiFrame maxHeight="var(--ui-h)" className={j.cardFit}>
            <Slice id={p.id} />
          </UiFrame>
        )}
      </div>
      <p className={j.cardNote}>{p.id === "mcp" ? "Illustrative" : "Sample data"}</p>
    </article>
  );
}

/* the Ask Aan card: Aan's hollow diamond, which the page will burst through */
function AanFace() {
  return (
    <div className={j.aanFace}>
      <p className={j.ask}>{QUESTIONS[1].q}</p>
      <span className={j.hollow} aria-hidden="true" />
    </div>
  );
}

function Ring() {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const outline = useRef<SVGPolygonElement>(null);
  const [active, setActive] = useState(0);
  const [burst, setBurst] = useState(false);
  const geo = useRef({ w: 0, h: 0, R: 600 });

  // the arc's radius follows the card width
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const card = el.querySelector<HTMLElement>(`.${j.card}`);
      const cw = card?.offsetWidth ?? 320;
      geo.current = { w: r.width, h: r.height, R: cw * 2.3 };
      el.style.setProperty("--R", `${(cw * 2.3).toFixed(0)}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onProgress = useCallback((p: number) => {
    const el = stage.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { w, h, R } = geo.current;

    // the ring: one chapter per card, dwelling on each before it turns on
    const rp = clamp(p * (CHAPTERS / RING));
    const x = Math.min(RING - 1, rp * RING);
    const c = Math.floor(x);
    const t = x - c;
    const pos = c >= RING - 1 ? RING - 1 : c + (reduced ? (t > 0.5 ? 1 : 0) : smooth(clamp((t - 0.55) / 0.45)));
    cards.current.forEach((card, i) => {
      if (!card) return;
      const d = i - pos;
      card.style.transform = `translate(-50%, -50%) rotateY(${(d * STEP).toFixed(2)}deg) translateZ(${R.toFixed(0)}px)`;
      // cards stay solid; only the ones turning away behind the arc fade
      card.style.opacity = String(clamp(2.6 - Math.abs(d) * 1.1));
      card.style.zIndex = String(10 - Math.round(Math.abs(d) * 2));
    });
    el.style.setProperty("--mq", rp.toFixed(4));
    setActive(Math.round(pos));

    // the burst, through Aan's diamond
    const b = clamp((p - RING / CHAPTERS) / (2 / CHAPTERS));
    el.style.setProperty("--b", b.toFixed(4));
    setBurst(b > 0.02);
    if (b <= 0) return;
    // it opens exactly where the hollow diamond sits on the Ask Aan card
    const s = el.getBoundingClientRect();
    const hollow = el.querySelector<HTMLElement>(`.${j.hollow}`)?.getBoundingClientRect();
    const cx = hollow ? hollow.left + hollow.width / 2 - s.left : w / 2;
    const cy = hollow ? hollow.top + hollow.height / 2 - s.top : h / 2;
    const r0 = hollow ? hollow.width / 2 : Math.min(w, h) * 0.07;
    const g = reduced ? (b > 0.1 ? 1 : 0) : smooth(clamp((b - 0.08) / 0.62));
    const r = r0 + g * (w + h);
    el.style.setProperty("--cx", `${cx.toFixed(1)}px`);
    el.style.setProperty("--cy", `${cy.toFixed(1)}px`);
    el.style.setProperty("--r", `${r.toFixed(1)}px`);
    const o = outline.current;
    if (o) {
      o.setAttribute("points", `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`);
      o.style.opacity = String(clamp(1.4 - g * 1.6));
    }
  }, []);
  useStoryProgress(onProgress);

  const cur = ORDER[active];

  return (
    <div ref={stage} className={j.stage} data-burst={burst ? "true" : "false"}>
      <div className={j.marquee} aria-hidden="true">
        <div className={j.marqueeTrack}>
          {[...journey.marquee, ...journey.marquee].map((m, i) => (
            <span key={i}>
              {m}
              <i />
            </span>
          ))}
        </div>
      </div>

      <div className={j.ring}>
        {ORDER.map((p, i) => (
          <div key={p.id} ref={(el) => void (cards.current[i] = el)} className={j.slot}>
            <Card p={p} i={i}>
              {p.id === "aan" ? <AanFace /> : undefined}
            </Card>
          </div>
        ))}
      </div>

      <div className={j.explore}>
        <Link className="c-cta" href={cur.link.href}>
          {cur.link.label}
        </Link>
      </div>

      <DiamondBurst ref={outline} live={burst} />
      <p className="sr-only" aria-live="polite">
        {cur.kicker}: {cur.title.join(" ")}
      </p>
    </div>
  );
}

export function RingScene() {
  return (
    <StoryScroll id="products" label="The products" chapters={CHAPTERS} per={58} className={j.scene} bodyClassName={j.body}>
      <Ring />
    </StoryScroll>
  );
}
