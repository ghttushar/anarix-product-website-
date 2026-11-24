"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FilmDialog } from "@/components/home/FilmDialog";
import { close, layers } from "@/content/home";
import { GlossyAan } from "./GlossyAan";
import f from "./finale.module.css";

gsap.registerPlugin(ScrollTrigger);

/*
  The close (AI Studio's converge and final hero): fragments of the whole
  platform (a protected sum, a lost Buy Box, true profit, a rule, a
  question, the same number in any AI) drift up past a small card in the
  middle where Aan turns in the light; then that card opens out to fill
  the screen, framed in white, and becomes the close. Aan stands where the
  reference has its chrome star. Reduced motion shows the close as it ends.
*/
const SPOTS: [number, number, number, number][] = [
  // x vw, y vh, depth, width px
  [-36, -20, 0.9, 200],
  [30, -28, 0.6, 236],
  [-26, 18, 0.5, 220],
  [36, 14, 0.8, 176],
  [-6, -36, 0.45, 168],
  [10, 34, 0.7, 250],
  [-40, 36, 0.55, 186],
  [40, -6, 0.4, 150],
];
/* each fragment wears one product's light, in AI Studio's mix of tall,
   wide and square tiles */
const TONES = ["signals", "signals", "profit", "rules", "aan", "mcp", "rules", "aan"];
const SHAPES = ["tall", "wide", "square", "tall", "square", "wide", "tall", "square"];

export function Finale() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const card = el.querySelector<HTMLElement>("[data-el=card]")!;
      const copy = el.querySelector<HTMLElement>("[data-el=copy]")!;
      const white = el.querySelector<HTMLElement>("[data-el=white]")!;
      const bits = el.querySelectorAll<HTMLElement>("[data-el=bit]");
      gsap.set(card, { scale: 0.34 });
      gsap.set(copy, { autoAlpha: 0, y: 30 });
      gsap.set(white, { autoAlpha: 0 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "+=360%", pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      // the fragments drift up through the frame, each at its own depth
      bits.forEach((b, i) => {
        const d = SPOTS[i][2];
        tl.fromTo(b, { y: () => window.innerHeight * (0.55 + d * 0.5) }, { y: () => -window.innerHeight * (0.6 + d * 0.6), duration: 2.2 }, 0);
      });
      tl.to(card, { scale: 0.52, duration: 2.2 }, 0)
        // then the card opens out to the frame, and the page turns white
        .to(card, { scale: 1, duration: 1.4, ease: "power2.inOut" }, 2.2)
        .to(white, { autoAlpha: 1, duration: 0.8 }, 2.6)
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
    <section ref={root} id="meet-aan" data-screen="meet-aan" data-pin className={f.finale} aria-label="Meet Aan">
      <span className={f.white} data-el="white" aria-hidden="true" />
      <ul className={f.bits} aria-hidden="true" data-bleed>
        {layers.fragments.map((b, i) => (
          <li
            key={b.k}
            className={f.bit}
            data-el="bit"
            data-tone={TONES[i]}
            data-shape={SHAPES[i]}
            style={{ left: `calc(50% + ${SPOTS[i][0]}vw)`, top: `calc(50% + ${SPOTS[i][1]}vh)`, width: SPOTS[i][3], zIndex: Math.round(SPOTS[i][2] * 10) }}
          >
            <small>{b.k}</small>
            <b>{b.v}</b>
          </li>
        ))}
      </ul>

      <div className={f.card} data-el="card">
        <div className={f.aan} data-bleed>
          <GlossyAan className={f.gl} />
        </div>
        <div className={f.copy} data-el="copy">
          <h2 className={f.title}>
            Put Aan on watch
            <br />
            <span>tonight.</span>
          </h2>
          <p className={f.body}>{close.body}</p>
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
