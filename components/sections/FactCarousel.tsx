"use client";

import { useEffect, useRef, useState } from "react";

// Single-fact cards, Sarla-style: one number, one sentence, nothing else.
const FACTS = [
  { k: "24/7", t: "Aan watches every account around the clock, including the hours you sleep." },
  { k: "3", t: "marketplaces in one view: Amazon, Walmart and Shopify." },
  { k: "$1.2B", t: "in GMV driven for the brands Anarix works with." },
  { k: "500+", t: "brands managed across Amazon and Walmart." },
  { k: "12.8%", t: "average TACoS across the brands we manage." },
  { k: "Any AI", t: "MCP connects your data to Claude, ChatGPT and Gemini." },
];

export function FactCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const card = el.querySelector<HTMLElement>(".fact");
      if (!card) return;
      const step = card.offsetWidth + 20;
      setIndex(Math.min(FACTS.length - 1, Math.round(el.scrollLeft / step)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i: number) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>(".fact");
    if (!el || !card) return;
    const next = Math.max(0, Math.min(FACTS.length - 1, i));
    el.scrollTo({ left: next * (card.offsetWidth + 20), behavior: "smooth" });
  };

  return (
    <section className="facts" aria-label="Anarix in numbers">
      <div className="container">
        <div className="facts__track" ref={track}>
          {FACTS.map((f) => (
            <article key={f.k} className="fact">
              <p className="fact__k display">{f.k}</p>
              <p className="fact__t">{f.t}</p>
            </article>
          ))}
        </div>
        <div className="facts__nav">
          <button className="facts__arrow" aria-label="Previous fact" onClick={() => go(index - 1)} disabled={index === 0}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="facts__dots" role="tablist" aria-label="Facts">
            {FACTS.map((f, i) => (
              <button key={f.k} role="tab" aria-selected={i === index} aria-label={`Fact ${i + 1}`} className={`facts__dot ${i === index ? "is-on" : ""}`} onClick={() => go(i)} />
            ))}
          </div>
          <button className="facts__arrow" aria-label="Next fact" onClick={() => go(index + 1)} disabled={index === FACTS.length - 1}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
