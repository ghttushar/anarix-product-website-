"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FilmDialog } from "@/components/home/FilmDialog";
import { AanClay } from "@/components/aan/clay/AanClay";
import { AlertRow, AskBubble, DoneChip, KpiCell, NotificationRow, PeriodRow, RuleChip, Ui } from "@/components/app-ui";
import { close, layers } from "@/content/home";
import f from "./finale.module.css";

gsap.registerPlugin(ScrollTrigger);

/*
  The close (AI Studio's converge and final hero): real pieces of the
  platform (a notification, an alert, a profit row, a rule, a question to
  Aan, a verified fix) drift up through the dark past a small card where
  Aan waits; then that card opens out to fill the screen, framed by the page
  ground, and becomes the close. Aan is the flat mascot from the Ask Aan
  island, standing where the reference has its chrome star. Reduced motion
  shows the close as it ends.
*/
type Frag = { k: string; x: number; y: number; depth: number; w?: number; node: ReactNode };
const FRAGS: Frag[] = [
  { k: "note", x: -34, y: -22, depth: 0.9, w: 290, node: <NotificationRow i={0} /> },
  { k: "alert", x: 30, y: -26, depth: 0.6, w: 250, node: <AlertRow /> },
  { k: "kpi", x: -28, y: 16, depth: 0.5, w: 200, node: <KpiCell k="Ad sales" v="$38,235" d="17.8%" tone="gain" /> },
  { k: "rule", x: 33, y: 13, depth: 0.8, node: <RuleChip /> },
  { k: "ask", x: -6, y: -36, depth: 0.45, w: 280, node: <AskBubble q="Which keywords should I pause?" a="Aan · 4 keywords, $312 spent, 0 sales" /> },
  { k: "done", x: 12, y: 34, depth: 0.7, node: <DoneChip /> },
  { k: "note2", x: -38, y: 36, depth: 0.55, w: 280, node: <NotificationRow i={1} /> },
  { k: "period", x: 38, y: -4, depth: 0.4, w: 330, node: <PeriodRow /> },
];

export function Finale() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const card = el.querySelector<HTMLElement>("[data-el=card]")!;
      const copy = el.querySelector<HTMLElement>("[data-el=copy]")!;
      const ground = el.querySelector<HTMLElement>("[data-el=ground]")!;
      const bits = el.querySelectorAll<HTMLElement>("[data-el=bit]");
      gsap.set(card, { scale: 0.34 });
      gsap.set(copy, { autoAlpha: 0, y: 30 });
      gsap.set(ground, { autoAlpha: 0 });
      gsap.set(el, { attr: { "data-tone": "dark" } });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "+=360%", pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      // the pieces drift up through the frame, each at its own depth
      bits.forEach((b, i) => {
        const d = FRAGS[i].depth;
        tl.fromTo(b, { y: () => window.innerHeight * (0.55 + d * 0.5) }, { y: () => -window.innerHeight * (0.6 + d * 0.6), duration: 2.2 }, 0);
      });
      tl.to(card, { scale: 0.52, duration: 2.2 }, 0)
        // then the card opens out, framed by the page ground
        .to(card, { scale: 1, duration: 1.4, ease: "power2.inOut" }, 2.2)
        .to(ground, { autoAlpha: 1, duration: 0.8 }, 2.6)
        .set(el, { attr: { "data-tone": "ground" } }, 2.9)
        .to(copy, { autoAlpha: 1, y: 0, duration: 0.7 }, 3.1)
        .to({}, { duration: 0.6 });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      el.dataset.static = "true";
      return () => delete el.dataset.static;
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="meet-aan" data-screen="meet-aan" data-pin data-tone="dark" className={f.finale} aria-label="Put Aan on watch">
      <span className={f.ground} data-el="ground" aria-hidden="true" />
      <ul className={f.bits} aria-hidden="true" data-bleed>
        {FRAGS.map((b) => (
          <li key={b.k} className={f.bit} data-el="bit" style={{ left: `calc(50% + ${b.x}vw)`, top: `calc(50% + ${b.y}vh)`, width: b.w, zIndex: Math.round(b.depth * 10) }}>
            <Ui className={f.bitUi}>{b.node}</Ui>
          </li>
        ))}
      </ul>

      <div className={f.card} data-el="card" data-tone="dark">
        <div className={f.aan} aria-hidden="true">
          <span className={f.aura} />
          <div className={f.aanBody}>
            <AanClay size={260} act="idle" track />
          </div>
        </div>
        <div className={f.copy} data-el="copy">
          <h2 className={f.title}>
            Put Aan on watch
            <br />
            <span>tonight.</span>
          </h2>
          <p className={f.body}>{close.body}</p>
          <ol className={f.steps}>
            {layers.start.map((s) => (
              <li key={s.n}>
                <span>{s.n}</span>
                {s.t}
              </li>
            ))}
          </ol>
          <div className={f.ctas}>
            <a className={f.light} href={close.primary.href}>
              {close.primary.label}
            </a>
            <button type="button" className={f.glass} onClick={() => window.dispatchEvent(new Event("aan:open-chat"))}>
              {close.secondary}
            </button>
            <FilmDialog className={f.film} />
          </div>
          <p className={f.services}>
            {close.services.lead} <Link href={close.services.href}>{close.services.label}</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
