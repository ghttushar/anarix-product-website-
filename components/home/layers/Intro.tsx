"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnarixMark } from "@/components/chrome/Logo";
import { SignalCard } from "@/components/product-ui/SignalCard";
import { ProfitWaterfall } from "@/components/product-ui/ProfitWaterfall";
import { RuleCard } from "@/components/product-ui/RuleCard";
import { McpTerminal } from "@/components/product-ui/McpTerminal";
import { layers, products, proof, type ProductCopy } from "@/content/home";
import { COSTS, RULES } from "@/content/products/samples";
import { ParticleSphere, type SphereHandle } from "./ParticleSphere";
import x from "./intro.module.css";

gsap.registerPlugin(ScrollTrigger);

/*
  The homepage opening, in the AI Studio design (getlayers), with every
  Anarix product. One pinned, scrubbed timeline:
  1. the gradient hero card tilts away and collapses onto the Signals card
     at its centre;
  2. that card is the first of five on a 3D ring (Signals, Profitability,
     Rules, MCP, Ask Aan) that turns with the scroll while giant words slide
     behind it;
  3. the ring settles on Ask Aan, whose white Aan shape becomes a window
     that grows past the edges of the screen (the outside scales up while
     the inside scales down, so only transforms move);
  4. inside: a black world, a sphere of light, the Anarix mark, and what
     Anarix is.
  Under reduced motion nothing pins: the hero, the five cards and the
  manifesto sit one after another.
*/
const ORDER = ["signals", "profitability", "rules", "mcp", "aan"] as const;
const STEP = 360 / ORDER.length;

function Slice({ id }: { id: ProductCopy["id"] }) {
  // the same alert the hero card shows, so the handover is invisible
  if (id === "signals") return <SignalCard handled bare />;
  if (id === "profitability") return <ProfitWaterfall on={COSTS.map(() => true)} compact />;
  if (id === "rules") return <RuleCard rule={RULES[0]} handled />;
  if (id === "mcp") return <McpTerminal handled bare />;
  return null;
}

function Card({ p, i, children }: { p: ProductCopy; i: number; children?: ReactNode }) {
  return (
    <article className={x.card} data-id={p.id} aria-label={p.kicker}>
      <header className={x.cardTop}>
        <span className={x.cardPill}>{p.kicker}</span>
        <span className={x.cardIdx}>
          {String(i + 1).padStart(2, "0")} / {String(ORDER.length).padStart(2, "0")}
        </span>
      </header>
      <div className={x.cardUi}>{children ?? <div className={x.cardFit}><Slice id={p.id} /></div>}</div>
      <p className={x.cardHook}>
        {p.title[0]}
        <br />
        <span>{p.title[1]}</span>
      </p>
    </article>
  );
}

export function Intro() {
  const root = useRef<HTMLElement>(null);
  const sphere = useRef<SphereHandle>(null);
  const cards = ORDER.map((id) => products.find((p) => p.id === id)!);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const $ = (k: string) => el.querySelector<HTMLElement>(`[data-el="${k}"]`)!;
      const hero = $("hero");
      const frame = $("frame");
      const copy = el.querySelectorAll<HTMLElement>("[data-copy]");
      const heroCard = $("heroCard");
      const ring = $("ring");
      const marquee = $("marquee");
      const explore = $("explore");
      const win = $("window");
      const world = $("world");
      const shape = $("shape");
      const mark = $("mark");
      const words = $("words");
      const glow = $("glow");

      // the frame collapses exactly onto the centre card
      const insets = () => {
        const f = frame.getBoundingClientRect();
        const c = heroCard.getBoundingClientRect();
        return `inset(${c.top - f.top}px ${f.right - c.right}px ${f.bottom - c.bottom}px ${c.left - f.left}px round 22px)`;
      };
      const s0 = () => shape.offsetWidth / win.offsetWidth;
      const fit = () => gsap.set(world, { scale: 1 / (gsap.getProperty(win, "scale") as number) });

      // GSAP owns these transforms, centring included
      gsap.set(hero, { transformPerspective: 1400 });
      gsap.set(win, { xPercent: -50, yPercent: -50, rotation: 45, scale: s0, autoAlpha: 0 });
      gsap.set(world, { xPercent: -50, yPercent: -50, rotation: -45 });
      gsap.set(mark, { xPercent: -50, yPercent: -50 });
      fit();
      gsap.set([ring, marquee, explore], { autoAlpha: 0 });
      gsap.set([mark, words], { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "+=720%", pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
      });

      // 1 · the hero tilts away and collapses onto its centre card
      tl.to(copy, { autoAlpha: 0, y: -16, duration: 0.5, ease: "power1.in" }, 0)
        .fromTo(frame, { clipPath: "inset(0px 0px 0px 0px round 28px)" }, { clipPath: insets, duration: 1.4, ease: "power2.inOut" }, 0)
        .to(hero, { keyframes: { rotationZ: [0, -14, 0], rotationX: [0, 20, 0], scale: [1, 0.94, 1] }, duration: 1.4, ease: "power1.inOut" }, 0)
        // 2 · the card hands over to the ring; words slide in behind
        .set([frame, heroCard], { autoAlpha: 0 }, 1.4)
        .set(ring, { autoAlpha: 1 }, 1.4)
        .to([marquee, explore], { autoAlpha: 1, duration: 0.4 }, 1.4)
        .fromTo(marquee, { xPercent: 0 }, { xPercent: -50, duration: 5.4 }, 1.4);
      // the ring turns one card at a time and dwells on each
      for (let k = 1; k < ORDER.length; k++) {
        tl.to(ring, { rotationY: -STEP * k, duration: 0.8, ease: "power2.inOut" }, 1.7 + (k - 1) * 1.1);
      }
      // 3 · Ask Aan faces you: its Aan shape opens into a window
      tl.to(explore, { autoAlpha: 0, duration: 0.3 }, 6.2)
        .set(win, { autoAlpha: 1 }, 6.5)
        .call(() => sphere.current?.live(true), undefined, 6.5)
        .to(win, { scale: 1, duration: 1.6, ease: "power2.in", onUpdate: fit }, 6.5)
        // 4 · the world inside: the mark, then what Anarix is
        .fromTo(mark, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.7 }, 7.5)
        .to(mark, { y: () => -window.innerHeight * 0.32, scale: 0.55, duration: 0.8, ease: "power2.inOut" }, 8.5)
        .fromTo(words, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 8.7)
        .fromTo(glow, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 8.7)
        .to({ v: 0 }, { v: 1, duration: 1.6, onUpdate() { sphere.current?.disperse(this.targets()[0].v); } }, 8.4)
        .to({}, { duration: 0.5 });

      // stop drawing the sphere when the scene is far away
      const watch = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=900%",
        onLeave: () => sphere.current?.live(false),
        onEnterBack: () => sphere.current?.live(true),
        onLeaveBack: () => sphere.current?.live(false),
      });
      return () => watch.kill();
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      el.dataset.static = "true";
      sphere.current?.live(true);
      return () => delete el.dataset.static;
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="top" data-screen="top" data-fit="grow" data-pin className={x.intro} aria-label="Anarix platform">
      <div className={x.stage}>
        <div className={x.marquee} data-el="marquee" aria-hidden="true" data-bleed>
          <div className={x.marqueeTrack}>
            {[...layers.marquee, ...layers.marquee, ...layers.marquee].map((m, i) => (
              <span key={i}>
                {m}
                <i />
              </span>
            ))}
          </div>
        </div>

        <div className={x.ringWrap}>
          <div className={x.ring} data-el="ring">
            {cards.map((p, i) => (
              <div key={p.id} className={x.slot} style={{ transform: `rotateY(${i * STEP}deg) translateZ(var(--R))` }}>
                <Card p={p} i={i}>
                  {p.id === "aan" ? (
                    <div className={x.aanFace}>
                      <span className={x.shape} data-el="shape" aria-hidden="true">
                        <i />
                        <i />
                      </span>
                    </div>
                  ) : undefined}
                </Card>
              </div>
            ))}
          </div>
        </div>

        <Link className={x.explore} href={layers.explore.href} data-el="explore">
          {layers.explore.label}
        </Link>

        {/* the hero: a gradient card around the Signals card */}
        <div className={x.hero} data-el="hero">
          <div className={x.frame} data-el="frame">
            <h1 className={x.title} data-copy>
              <span>{layers.hero.title[0]}</span>
              <span>{layers.hero.title[1]}</span>
            </h1>
            <div className={x.foot} data-copy>
              <p className={x.lede}>{layers.hero.lede}</p>
              <div className={x.ctas}>
                <a className={x.light} href={layers.hero.primary.href}>
                  {layers.hero.primary.label}
                </a>
                <Link className={x.glass} href={layers.hero.secondary.href}>
                  {layers.hero.secondary.label}
                </Link>
              </div>
              <ul className={x.proof}>
                {proof.items.map((pr) => (
                  <li key={pr.figure}>
                    <b>{pr.figure}</b> {pr.short}
                  </li>
                ))}
              </ul>
            </div>
            <p className={x.corner} data-copy>
              {layers.hero.corner[0]}
              <br />
              {layers.hero.corner[1]}
            </p>
          </div>
          <div className={x.heroCard} data-el="heroCard">
            <article className={x.card} data-id="signals" aria-hidden="true">
              <header className={x.cardTop}>
                <span className={x.cardPill}>Signals</span>
                <span className={x.cardIdx}>01 / 05</span>
              </header>
              <div className={x.cardUi}>
                <div className={x.cardFit}>
                  <SignalCard handled bare />
                </div>
              </div>
              <p className={x.cardHook}>
                3am change.
                <br />
                <span>9am answer.</span>
              </p>
            </article>
          </div>
        </div>

        {/* the window that opens out of Aan's shape, onto the world inside */}
        <div className={x.window} data-el="window" aria-hidden="true" data-bleed>
          <div className={x.world} data-el="world">
            <ParticleSphere ref={sphere} className={x.sphere} />
            <span className={x.glowCorner} data-el="glow" />
          </div>
        </div>
        <span className={x.mark} data-el="mark" aria-hidden="true">
          <AnarixMark height={64} />
        </span>
        <div className={x.words} data-el="words">
          {layers.manifesto.map((m) => (
            <p key={m.slice(0, 12)}>{m}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
