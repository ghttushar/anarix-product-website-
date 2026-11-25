"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnarixMark } from "@/components/chrome/Logo";
import { AanMascot } from "@/components/aan/AanMascot";
import { AanAnalysis, AlertRow, AppliedRules, AskBubble, DoneChip, KpiCell, KpiStrip, McpCard, NotificationRow, ProfitNugget, PulseTable, RuleChip, RuleCriteria, Ui } from "@/components/app-ui";
import { layers } from "@/content/home";
import { ParticleSphere, type SphereHandle } from "./ParticleSphere";
import x from "./intro.module.css";

gsap.registerPlugin(ScrollTrigger);

/*
  The homepage opening, in the AI Studio design (getlayers), across the
  whole Anarix platform. One pinned, scrubbed timeline:
  1. the gradient hero card, with real pieces of the product floating in it,
     tilts away while those pieces fly into its centre card and the frame
     closes onto it;
  2. that card is already the first of six on a 3D ring (Signals,
     Profitability, Advertising, Rules, MCP, Ask Aan): nothing is swapped,
     the frame just fades off it at rest, the other cards rise in from depth
     and the ring starts to turn before the collapse has quite finished;
  3. the ring settles on Ask Aan, whose white Aan shape becomes a window that
     grows past the edges (the outside scales up while the inside scales
     down, so only transforms move);
  4. inside: a black world, a sphere of light, the Anarix mark, and what
     Anarix stands for: AI for good.
  The page ground follows the theme; the hero, the cards and the world are
  brand stages and stay as they are. Under reduced motion nothing pins: the
  hero, the six cards and the world sit one after another.
*/
type RingId = (typeof layers.ring)[number]["id"];
const STEP = 360 / layers.ring.length;

function Slice({ id }: { id: RingId }) {
  if (id === "signals")
    return (
      <div className={x.stack}>
        <AlertRow selected />
        <div className={x.uiCard}>
          <AanAnalysis />
        </div>
      </div>
    );
  if (id === "profitability") return <ProfitNugget />;
  if (id === "advertising")
    return (
      <div className={x.stack}>
        <KpiStrip count={2} />
        <PulseTable rows={3} compact />
      </div>
    );
  if (id === "rules")
    return (
      <div className={x.stack}>
        <RuleCriteria />
        <AppliedRules rows={2} />
      </div>
    );
  if (id === "mcp") return <McpCard />;
  return null;
}

function RingCard({ id, kicker, hook, i, children }: { id: RingId; kicker: string; hook: readonly string[]; i: number; children?: ReactNode }) {
  return (
    <article className={x.card} data-id={id} aria-label={kicker}>
      <header className={x.cardTop}>
        <span className={x.cardPill}>{kicker}</span>
        <span className={x.cardIdx}>
          {String(i + 1).padStart(2, "0")} / {String(layers.ring.length).padStart(2, "0")}
        </span>
      </header>
      <div className={x.cardUi} aria-hidden="true">
        {children ?? (
          <Ui className={x.cardFit}>
            <Slice id={id} />
          </Ui>
        )}
      </div>
      <p className={x.cardHook}>
        {hook[0]}
        <br />
        <span>{hook[1]}</span>
      </p>
    </article>
  );
}

/* real pieces of the product, floating in the hero at different depths */
const CLUSTER: { k: string; depth: number; node: ReactNode }[] = [
  { k: "note", depth: 0.9, node: <NotificationRow i={0} /> },
  { k: "kpi", depth: 0.6, node: <KpiCell k="Net profit · this month" v="$14,580" d="6.2%" tone="gain" /> },
  { k: "rule", depth: 0.75, node: <RuleChip /> },
  { k: "ask", depth: 0.5, node: <AskBubble /> },
  { k: "done", depth: 0.4, node: <DoneChip /> },
];

export function Intro() {
  const root = useRef<HTMLElement>(null);
  const sphere = useRef<SphereHandle>(null);

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
      const front = $("front");
      const faces = el.querySelectorAll<HTMLElement>("[data-el=face]");
      const bits = el.querySelectorAll<HTMLElement>("[data-el=bit]");
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
      // each floating piece flies to the centre card
      const toCentre = (b: HTMLElement, axis: "x" | "y") => () => {
        const r = b.getBoundingClientRect();
        const c = heroCard.getBoundingClientRect();
        return axis === "x" ? c.left + c.width / 2 - (r.left + r.width / 2) : c.top + c.height / 2 - (r.top + r.height / 2);
      };
      const s0 = () => shape.offsetWidth / win.offsetWidth;
      const fit = () => gsap.set(world, { scale: 1 / (gsap.getProperty(win, "scale") as number) });

      // GSAP owns these transforms, centring included
      gsap.set(hero, { transformPerspective: 1400 });
      gsap.set(win, { xPercent: -50, yPercent: -50, rotation: 45, scale: s0, autoAlpha: 0 });
      gsap.set(world, { xPercent: -50, yPercent: -50, rotation: -45 });
      gsap.set(mark, { xPercent: -50, yPercent: -50 });
      fit();
      gsap.set([marquee, explore, front], { autoAlpha: 0 });
      gsap.set(faces, { autoAlpha: 0, scale: 0.84 });
      gsap.set([mark, words], { autoAlpha: 0 });
      gsap.set(el, { attr: { "data-tone": "dark" } });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "+=760%", pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
      });

      // 1 · the copy lifts away, the floating pieces fly into the centre
      //     card, and the frame tilts and closes onto it
      tl.to(copy, { autoAlpha: 0, y: -16, duration: 0.5, ease: "power1.in" }, 0);
      bits.forEach((b, i) => {
        tl.to(b, { x: toCentre(b, "x"), y: toCentre(b, "y"), scale: 0.3, autoAlpha: 0, duration: 0.9, ease: "power2.in" }, 0.12 + i * 0.05);
      });
      tl.fromTo(frame, { clipPath: "inset(0px 0px 0px 0px round 28px)" }, { clipPath: insets, duration: 1.25, ease: "power2.inOut" }, 0)
        .to(hero, { keyframes: { rotationZ: [0, -12, 0], rotationX: [0, 18, 0], scale: [1, 0.95, 1] }, duration: 1.25, ease: "power1.inOut" }, 0)
        // 2 · the giant words slide in behind while the frame is still closing
        .to(marquee, { autoAlpha: 1, duration: 0.5 }, 0.9)
        .fromTo(marquee, { xPercent: 0 }, { xPercent: -50, duration: 6 }, 0.9)
        .set(el, { attr: { "data-tone": "ground" } }, 0.95)
        // the ring's own front card is under the hero already; the hero
        // fades off it once both sit at rest, so nothing is swapped
        .to(front, { autoAlpha: 1, duration: 0.1 }, 1.15)
        .to([frame, heroCard], { autoAlpha: 0, duration: 0.3, ease: "power1.out" }, 1.25)
        // the other cards rise in from depth as the frame clears them
        .to(faces, { autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.04, ease: "power2.out" }, 1.0)
        .to(explore, { autoAlpha: 1, duration: 0.4 }, 1.4);
      // the ring turns one card at a time, starting before the collapse settles
      for (let k = 1; k < layers.ring.length; k++) {
        tl.to(ring, { rotationY: -STEP * k, duration: 0.75, ease: "power2.inOut" }, 1.5 + (k - 1) * 0.95);
      }
      const atAan = 1.5 + (layers.ring.length - 2) * 0.95 + 0.75;
      // 3 · Ask Aan faces you: its Aan shape opens into a window
      tl.to(explore, { autoAlpha: 0, duration: 0.3 }, atAan)
        .set(win, { autoAlpha: 1 }, atAan + 0.3)
        .call(() => sphere.current?.live(true), undefined, atAan + 0.3)
        .to(win, { scale: 1, duration: 1.6, ease: "power2.in", onUpdate: fit }, atAan + 0.3)
        .set(el, { attr: { "data-tone": "dark" } }, atAan + 1.3)
        // 4 · the world inside: the mark, then what Anarix stands for
        .fromTo(mark, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.7 }, atAan + 1.3)
        .to(mark, { y: () => -window.innerHeight * 0.34, scale: 0.5, duration: 0.8, ease: "power2.inOut" }, atAan + 2.3)
        .fromTo(words, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8 }, atAan + 2.5)
        .fromTo(glow, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, atAan + 2.5)
        .to({ v: 0 }, { v: 1, duration: 1.6, onUpdate() { sphere.current?.disperse(this.targets()[0].v); } }, atAan + 2.2)
        .to({}, { duration: 0.7 });

      // a little depth in the hero: the pieces lean with the pointer
      const lean = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || tl.progress() > 0.02) return;
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        bits.forEach((b) => {
          const d = Number(b.dataset.depth) || 0.5;
          gsap.to(b.firstElementChild, { x: -dx * 26 * d, y: -dy * 18 * d, duration: 0.8, ease: "power2.out", overwrite: "auto" });
        });
      };
      window.addEventListener("pointermove", lean, { passive: true });

      // stop drawing the sphere when the scene is far away
      const watch = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=940%",
        onLeave: () => sphere.current?.live(false),
        onEnterBack: () => sphere.current?.live(true),
        onLeaveBack: () => sphere.current?.live(false),
      });
      return () => {
        watch.kill();
        window.removeEventListener("pointermove", lean);
      };
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      el.dataset.static = "true";
      sphere.current?.live(true);
      return () => delete el.dataset.static;
    });
    return () => mm.revert();
  }, []);

  const h = layers.hero;
  return (
    <section ref={root} id="top" data-screen="top" data-fit="grow" data-pin data-tone="dark" className={x.intro} aria-label="Anarix platform">
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
            {layers.ring.map((p, i) => (
              <div key={p.id} className={x.slot} style={{ transform: `rotateY(${i * STEP}deg) translateZ(var(--R))` }}>
                <div className={x.face} data-el={i === 0 ? "front" : "face"}>
                  <RingCard id={p.id} kicker={p.kicker} hook={p.hook} i={i}>
                    {p.id === "aan" ? (
                      <div className={x.aanFace}>
                        <span className={x.shape} data-el="shape">
                          <i />
                          <i />
                        </span>
                      </div>
                    ) : undefined}
                  </RingCard>
                </div>
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
            <div className={x.head} data-copy>
              <div className={x.kicker}>
                <AanMascot state="diamond" size={22} glow={false} shadow={false} />
                {h.kicker}
              </div>
              <h1 className={x.title}>
                <span>{h.title[0]}</span>
                <span>{h.title[1]}</span>
              </h1>
            </div>
            <div className={x.foot} data-copy>
              <p className={x.lede}>{h.lede}</p>
              <div className={x.ctas}>
                <a className={x.light} href={h.primary.href}>
                  {h.primary.label}
                </a>
                <Link className={x.glass} href={h.secondary.href}>
                  {h.secondary.label}
                </Link>
              </div>
              <dl className={x.proof}>
                {h.proof.map((pr) => (
                  <div key={pr.k}>
                    <dt>{pr.k}</dt>
                    <dd>{pr.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <nav className={x.index} aria-label="The platform" data-copy>
              <span>The platform</span>
              {h.index.map((l) => (
                <Link key={l.label} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className={x.cluster} aria-hidden="true">
              {CLUSTER.map((c) => (
                <div key={c.k} className={x.bit} data-el="bit" data-k={c.k} data-depth={c.depth}>
                  <Ui className={x.bitUi}>{c.node}</Ui>
                </div>
              ))}
            </div>
          </div>
          <div className={x.heroCard} data-el="heroCard">
            <RingCard id="signals" kicker="Signals" hook={layers.ring[0].hook} i={0} />
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
          <h2 className={x.worldTitle}>
            <span>{layers.world.title[0]}</span>
            <span>{layers.world.title[1]}</span>
          </h2>
          <p className={x.worldLede}>{layers.world.lede}</p>
          <ul className={x.principles}>
            {layers.world.principles.map((p) => (
              <li key={p.t}>
                <b>{p.t}</b>
                <span>{p.d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
