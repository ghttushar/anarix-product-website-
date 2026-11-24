"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SignalCard } from "@/components/product-ui/SignalCard";
import { ProfitWaterfall } from "@/components/product-ui/ProfitWaterfall";
import { RuleCard } from "@/components/product-ui/RuleCard";
import { McpTerminal } from "@/components/product-ui/McpTerminal";
import { AnswerChart } from "@/components/product-ui/AnswerChart";
import { layers } from "@/content/home";
import { COSTS, QUESTIONS, RULES } from "@/content/products/samples";
import g from "./gallery.module.css";

gsap.registerPlugin(ScrollTrigger);

/*
  The products as a gallery (AI Studio's horizontal panels): each product
  is a wide panel with its meta line, its big name, and its own scene,
  the product UI floating in a field of light. The row slides sideways
  while the page is pinned, each panel's UI drifting a little slower than
  its frame; a glow along the bottom fills with the row. Every panel opens
  its page. Reduced motion lets the row scroll sideways by hand.
*/
const SCENE: Record<string, ReactNode> = {
  signals: <SignalCard handled bare />,
  profitability: <ProfitWaterfall on={COSTS.map(() => true)} compact />,
  rules: <RuleCard rule={RULES[0]} handled />,
  aan: (
    <div className={g.answer}>
      <p className={g.q}>{QUESTIONS[1].q}</p>
      <p className={g.a}>{QUESTIONS[1].a}</p>
      <AnswerChart chart={QUESTIONS[1].chart} />
    </div>
  ),
  mcp: <McpTerminal handled bare />,
};

export function Gallery() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const track = el.querySelector<HTMLElement>("[data-el=track]")!;
      const bar = el.querySelector<HTMLElement>("[data-el=bar]")!;
      const distance = () => track.scrollWidth - window.innerWidth;
      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, scrub: 1, invalidateOnRefresh: true } });
      // each panel's UI drifts a little slower than its frame
      el.querySelectorAll<HTMLElement>("[data-el=ui]").forEach((ui) => {
        gsap.fromTo(ui, { xPercent: 14 }, { xPercent: -14, ease: "none", scrollTrigger: { trigger: ui.parentElement!, containerAnimation: slide, start: "left right", end: "right left", scrub: true } });
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      el.dataset.static = "true";
      return () => delete el.dataset.static;
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="products" data-screen="products" data-pin className={g.gallery} aria-label="The products">
      <div className={g.track} data-el="track">
        {layers.gallery.map((p, i) => (
          <Link key={p.id} href={p.href} className={g.panel} data-id={p.id}>
            <span className={g.light} aria-hidden="true" data-bleed />
            <p className={g.meta}>
              {p.meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </p>
            <div className={g.ui} data-el="ui" aria-hidden="true">
              {SCENE[p.id]}
            </div>
            <p className={g.sample}>{p.id === "mcp" ? "Illustrative" : "Sample data"}</p>
            <h3 className={g.name}>
              <span className={g.idx}>{String(i + 1).padStart(2, "0")}</span>
              {p.name}
            </h3>
          </Link>
        ))}
      </div>
      <span className={g.bar} data-el="bar" aria-hidden="true" />
    </section>
  );
}
