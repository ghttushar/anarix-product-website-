"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AanChat, AlertRow, AppliedRules, KpiStrip, McpCard, ProfitNugget, PulseTable, RuleCriteria, SuggestedActions, Ui } from "@/components/app-ui";
import { layers } from "@/content/home";
import g from "./gallery.module.css";

gsap.registerPlugin(ScrollTrigger);

/*
  The platform as a gallery (AI Studio's horizontal panels). After a short
  lead, each product is a wide panel: its meta line, a headline, what it
  does in plain words, three things it does, a link, its big name, and on
  the right a piece of the real product, floating in the panel's own light.
  The row slides sideways while the page is pinned, each panel's UI
  drifting a little slower than its frame; a glow along the bottom fills
  with the row. The ground follows the theme; the panels are brand stages.
  Reduced motion lets the row scroll sideways by hand.
*/
const SCENE: Record<string, ReactNode> = {
  signals: (
    <div className={g.stack}>
      <AlertRow selected />
      <div className={g.uiCard}>
        <SuggestedActions compact />
      </div>
    </div>
  ),
  profitability: <ProfitNugget chart />,
  advertising: (
    <div className={g.stack}>
      <KpiStrip count={3} />
      <PulseTable rows={4} compact />
    </div>
  ),
  rules: (
    <div className={g.stack}>
      <RuleCriteria />
      <AppliedRules />
    </div>
  ),
  aan: (
    <div className={g.uiCard} style={{ padding: "1.1em" }}>
      <AanChat input={false} />
    </div>
  ),
  mcp: <McpCard />,
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
        gsap.fromTo(ui, { xPercent: 10 }, { xPercent: -10, ease: "none", scrollTrigger: { trigger: ui.parentElement!, containerAnimation: slide, start: "left right", end: "right left", scrub: true } });
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      el.dataset.static = "true";
      return () => delete el.dataset.static;
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="products" data-screen="products" data-pin data-tone="ground" className={g.gallery} aria-label="The platform">
      <div className={g.track} data-el="track">
        <div className={g.lead}>
          <p className={g.leadKicker}>The platform</p>
          <h2 className={g.leadTitle}>
            Six products.
            <br />
            <span>One AI.</span>
          </h2>
          <p className={g.leadBody}>Every part of running a marketplace business, from the alert at 3am to the answer in your AI, in one place with Aan inside all of it.</p>
          <p className={g.leadHint} aria-hidden="true">
            Scroll <span>→</span>
          </p>
        </div>
        {layers.gallery.map((p, i) => {
          const internal = p.href.startsWith("/");
          return (
            <article key={p.id} className={g.panel} data-id={p.id} aria-labelledby={`g-${p.id}`}>
              <span className={g.light} aria-hidden="true" data-bleed />
              <p className={g.meta}>
                {p.meta.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </p>
              <div className={g.copy}>
                <h3 className={g.headline} id={`g-${p.id}`}>
                  {p.headline}
                </h3>
                <p className={g.body}>{p.body}</p>
                <ul className={g.points}>
                  {p.points.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {internal ? (
                  <Link className={g.cta} href={p.href}>
                    {p.cta} <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <a className={g.cta} href={p.href}>
                    {p.cta} <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
              <div className={g.ui} data-el="ui" aria-hidden="true">
                <Ui className={g.uiFit}>{SCENE[p.id]}</Ui>
              </div>
              <p className={g.name} aria-hidden="true">
                <span className={g.idx}>{String(i + 1).padStart(2, "0")}</span>
                {p.name}
              </p>
            </article>
          );
        })}
      </div>
      <span className={g.bar} data-el="bar" aria-hidden="true" />
    </section>
  );
}
