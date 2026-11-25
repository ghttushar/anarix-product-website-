"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AanMascot } from "@/components/aan/AanMascot";
import { Halo } from "@/components/visual/Halo";
import {
  AffectedItems,
  AanAnalysis,
  AlertDetail,
  AlertRow,
  AwayRail,
  BatchStrip,
  DayBand,
  ImpactReport,
  ItemPicker,
  MeetingCard,
  MeetingPrep,
  Messages,
  OpportunityValue,
  StatusTag,
  TaskCard,
  Ui,
  ValueAtRisk,
} from "@/components/app-ui";
import type { ProductPage } from "@/content/products/types";
import { ALERTS } from "@/content/app-samples";
import { DEMO, relay } from "@/content/products/signals-page";
import s from "./signals.module.css";

gsap.registerPlugin(ScrollTrigger);

/*
  Signals, in the Relay design (getlayers), told by the product itself.
  The halo behind the page is the energy of the product: it blasts out of
  a white-hot core when the page opens, then goes soft and dim behind the
  rest so the words and the product read. The mockups are single elements
  of the real app (an alert, Aan's analysis, the item picker, the impact
  report, the brief), never whole pages, in the app's own light or dark
  UI with the theme; the stage stays black in both. Sections, in Relay's
  order: hero, product tour, what it watches, the line, how it works,
  the panel, sources and hand-off, the morning brief, meetings and tasks,
  the numbers, three ways to act, and the close.
*/

const Em = ({ children }: { children: ReactNode }) => <em className={s.em}>{children}</em>;

function Pill({ children }: { children: ReactNode }) {
  return (
    <p className={s.pill} data-rise>
      <i aria-hidden="true" />
      {children}
    </p>
  );
}

function SectionHead({ pill, title, body, id }: { pill: string; title: ReactNode; body: string; id?: string }) {
  return (
    <header className={s.head} id={id}>
      <div>
        <Pill>{pill}</Pill>
        <h2 className={s.h2} data-rise>
          {title}
        </h2>
      </div>
      <p className={s.headBody} data-rise>
        {body}
      </p>
    </header>
  );
}

/* ------------------------------------------------------------------ hero */
function Hero() {
  const h = relay.hero;
  return (
    <section className={s.hero} data-halo="0" id="top" data-screen="top" data-fit="grow" data-tone="dark" aria-label="Signals">
      <div className={`${s.wrap} ${s.heroGrid}`}>
        <div className={s.heroCopy}>
          <p className={s.pill} data-enter>
            <i aria-hidden="true" />
            {h.pill}
          </p>
          <h1 className={s.h1}>
            <span data-enter>{h.title[0]}</span>
            <span data-enter className={s.h1Em}>
              {h.title[1]}
            </span>
          </h1>
          <p className={s.lede} data-enter>
            {h.lede}
          </p>
          <div className={s.ctas} data-enter>
            <a className={s.act} href={DEMO.href}>
              {DEMO.label}
            </a>
            <a className={s.ghost} href={h.secondary.href}>
              <svg viewBox="0 0 10 10" aria-hidden="true">
                <path d="M2.5 1.5l6 3.5-6 3.5z" />
              </svg>
              {h.secondary.label}
            </a>
          </div>
          <p className={s.note} data-enter>
            {h.note}
          </p>
        </div>
        <div className={s.heroMock} data-enter aria-hidden="true">
          <Ui className={s.heroUi}>
            <div className={s.peek}>
              <AlertRow a={ALERTS[1]} />
            </div>
            <div className={s.detail}>
              <AlertDetail />
            </div>
          </Ui>
          <p className={s.sampleNote}>Sample data</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- the tour */
function Tour() {
  const t = relay.tour;
  return (
    <section className={s.block} data-halo="1" id="tour" data-tone="dark" aria-label="Product tour">
      <div className={s.wrap}>
        <SectionHead
          pill={t.pill}
          title={
            <>
              {t.title.a} <Em>{t.title.em}</Em> {t.title.b}
            </>
          }
          body={t.body}
        />
        <figure className={s.video} data-rise>
          {t.video ? (
            <video className={s.videoEl} src={t.video.src} poster={t.video.poster} controls playsInline preload="none" />
          ) : (
            <div className={s.poster} aria-label={`${t.label}: a walk through one alert`} role="img">
              <Ui className={s.posterUi}>
                <div className={s.posterList}>
                  <DayBand />
                  <AlertRow a={ALERTS[0]} selected />
                  <AlertRow a={ALERTS[1]} />
                  <AlertRow a={ALERTS[2]} />
                </div>
                <div className={s.posterDetail}>
                  <AlertDetail compact />
                </div>
              </Ui>
              <span className={s.play} aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M5.5 3.5l7 4.5-7 4.5z" />
                </svg>
              </span>
              <span className={s.videoLabel}>{t.label}</span>
            </div>
          )}
          <figcaption className={s.caption}>{t.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* --------------------------------------------- what it watches, the line */
function Watches() {
  const w = relay.watches;
  return (
    <section className={s.watches} data-halo="1" id="watches" data-tone="dark" aria-label="What Signals watches">
      <div className={s.wrap}>
        <p className={s.mono} data-rise>
          {w.label}
        </p>
        <ul className={s.tiles} data-in-view="false">
          <span className={s.track} aria-hidden="true">
            <span className={s.runner} />
          </span>
          {w.tiles.map((t, i) => (
            <li key={t.k} style={{ "--i": i } as CSSProperties}>
              <span className={s.tile}>{t.k}</span>
              <small>{t.t}</small>
            </li>
          ))}
          <li style={{ "--i": w.tiles.length } as CSSProperties}>
            <span className={`${s.tile} ${s.tileMore}`}>+</span>
            <small>{w.more}</small>
          </li>
        </ul>
        <p className={s.examples} data-rise>
          For example: {w.examples.join(", ")}.
        </p>
      </div>
    </section>
  );
}

function Glue() {
  const g = relay.glue;
  return (
    <section className={s.glue} data-halo="1" id="finding-out" data-tone="dark" aria-label="Finding out">
      <div className={s.wrap}>
        <SectionHead
          pill={g.pill}
          title={
            <>
              {g.title.a} <Em>{g.title.em}</Em>
              {g.title.b}
            </>
          }
          body={g.body}
        />
      </div>
    </section>
  );
}

/* --------------------------------------------------------- how it works */
const FLOW_MOCK: ReactNode[] = [
  <div className={s.listMock} key="list">
    <DayBand />
    <AlertRow a={ALERTS[0]} selected />
    <AlertRow a={ALERTS[1]} />
    <AlertRow a={ALERTS[2]} />
  </div>,
  <div className={s.stackMock} key="why">
    <div className={s.cardMock}>
      <AanAnalysis />
    </div>
    <AffectedItems rows={4} />
  </div>,
  <div className={s.stackMock} key="fix">
    <ItemPicker />
    <BatchStrip />
  </div>,
  <div className={s.stackMock} key="check">
    <ImpactReport />
    <BatchStrip done />
  </div>,
];

function Flow() {
  return (
    <section className={s.rows} data-halo="2" id="how" data-tone="dark" aria-label="How Signals works">
      <div className={s.wrap}>
        {relay.flow.map((r, i) => (
          <div className={s.row} key={r.n} data-flip={i % 2 === 1 ? "true" : "false"}>
            <div className={s.rowText}>
              <p className={s.rowN} data-rise>
                {r.n}
              </p>
              <h3 className={s.h3} data-rise>
                {r.t}
              </h3>
              <p className={s.rowD} data-rise>
                {r.d}
              </p>
              <ul className={s.facts} data-rise>
                {r.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div className={s.rowCard} data-rise aria-hidden="true">
              <Ui className={s.rowUi}>{FLOW_MOCK[i]}</Ui>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------- the panel that grows from a tile */
function Panel() {
  const root = useRef<HTMLElement>(null);
  const p = relay.panel;
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const panel = el.querySelector<HTMLElement>("[data-el=panel]")!;
      const tile = el.querySelector<HTMLElement>("[data-el=tile]")!;
      const words = el.querySelectorAll<HTMLElement>("[data-word]");
      const inner = el.querySelector<HTMLElement>("[data-el=inner]")!;
      // the tile's rect as an inset of the panel, measured on refresh
      const shut = () => {
        const a = panel.getBoundingClientRect();
        const b = tile.getBoundingClientRect();
        return `inset(${b.top - a.top}px ${a.right - b.right}px ${a.bottom - b.bottom}px ${b.left - a.left}px round 22px)`;
      };
      gsap.set(words, { opacity: 0.16 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "+=240%", pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      tl.fromTo(panel, { clipPath: shut, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0)
        .fromTo(panel, { clipPath: shut }, { clipPath: "inset(0px 0px 0px 0px round 36px)", duration: 1.1, ease: "power2.inOut", immediateRender: false }, 0)
        .fromTo(inner, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.5 }, 0.7)
        .to(words, { opacity: 1, stagger: 0.12, duration: 0.2 }, 1.05)
        .to({}, { duration: 0.5 })
        .to(inner, { autoAlpha: 0, duration: 0.35 }, ">")
        .to(panel, { clipPath: shut, duration: 0.9, ease: "power2.inOut" }, "<0.1")
        .to(panel, { autoAlpha: 0, duration: 0.15 }, ">-0.1");
    });
    return () => mm.revert();
  }, []);
  return (
    <section ref={root} className={s.panelSec} data-halo="3" id="for" data-screen="for" data-pin data-tone="dark" aria-label="What Signals is for">
      <span className={s.panelTile} data-el="tile" aria-hidden="true">
        <AanMascot state="diamond" size={56} glow={false} shadow={false} />
      </span>
      <div className={s.panel} data-el="panel">
        <div className={s.panelInner} data-el="inner">
          <p className={s.panelLabel}>{p.label}</p>
          <h2 className={s.panelLine}>
            {p.words.map((w, i) => (
              <span key={i} data-word className={w.startsWith("*") ? s.em : undefined}>
                {w.replace(/\*/g, "")}{" "}
              </span>
            ))}
          </h2>
          <span className={s.panelBadge} aria-hidden="true">
            <AanMascot state="diamond" size={46} glow={false} shadow={false} />
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------- sources and the hand-off */
function HubCard() {
  const h = relay.sources.hub;
  const at: [number, number][] = [
    [60, 58],
    [150, 34],
    [240, 26],
    [330, 34],
    [420, 58],
  ];
  return (
    <div className={s.card}>
      <h3 className={s.cardT}>{h.t}</h3>
      <p className={s.cardD}>{h.d}</p>
      <div className={s.hubWrap}>
        <svg className={s.hub} viewBox="0 0 480 200" role="img" aria-label="Anarix monitoring, email, Slack, meetings and Workspace, all wired into Aan.">
          {at.map(([x, y], i) => {
            const d = `M${x} ${y + 18} C${x} ${y + 76} 240 ${y + 50} 240 118`;
            return (
              <g key={i}>
                <path d={d} className={s.hubWire} />
                <circle r="2.4" className={s.pulse}>
                  <animateMotion dur={`${2.2 + i * 0.35}s`} repeatCount="indefinite" path={d} />
                </circle>
              </g>
            );
          })}
          {h.nodes.map((n, i) => (
            <g key={n.k} transform={`translate(${at[i][0]} ${at[i][1]})`}>
              <rect x="-17" y="-17" width="34" height="34" rx="9" className={s.hubNode} />
              <text y="4" className={s.hubK}>
                {n.k}
              </text>
              <text y="34" className={s.hubT}>
                {n.t}
              </text>
            </g>
          ))}
        </svg>
        <span className={s.hubAan} aria-hidden="true">
          <AanMascot state="diamond" size={64} glow={false} shadow={false} />
        </span>
      </div>
      <p className={s.cardFoot}>{h.foot}</p>
    </div>
  );
}

function HandoffCard() {
  const h = relay.sources.handoff;
  return (
    <div className={s.card}>
      <h3 className={s.cardT}>{h.t}</h3>
      <p className={s.cardD}>{h.d}</p>
      <Ui className={s.handUi}>
        <div className={s.assign} aria-hidden="true">
          <p className={s.assignHead}>Assign to</p>
          {h.people.map((p) => (
            <div className={s.person} key={p.k} data-on={p.aan ? "true" : "false"}>
              {p.aan ? (
                <span className={s.personAan}>
                  <AanMascot state="diamond" size={18} glow={false} shadow={false} />
                </span>
              ) : (
                <span className={s.personDot}>{p.k.slice(0, 2)}</span>
              )}
              <span>
                <b>{p.k}</b>
                <small>{p.note}</small>
              </span>
              {p.aan && (
                <svg viewBox="0 0 16 16" className={s.tickIco} aria-hidden="true">
                  <path d="M3.5 8.5l3 3 6-7" />
                </svg>
              )}
            </div>
          ))}
          <div className={s.statusRow}>
            <StatusTag s="Open" />
            <span aria-hidden="true">→</span>
            <StatusTag s="In progress" />
            <span aria-hidden="true">→</span>
            <StatusTag s="Done" />
          </div>
        </div>
      </Ui>
      <p className={s.cardFoot}>{h.foot}</p>
    </div>
  );
}

function Sources() {
  const q = relay.sources;
  return (
    <section className={`${s.block} ${s.afterPanel}`} data-halo="3" id="sources" data-tone="dark" aria-label="Sources and hand-off">
      <div className={s.wrap}>
        <SectionHead
          pill={q.pill}
          title={
            <>
              {q.title.a} <Em>{q.title.em}</Em> {q.title.b}
            </>
          }
          body={q.body}
        />
        <div className={s.two}>
          <div data-rise>
            <HubCard />
          </div>
          <div data-rise>
            <HandoffCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ the morning brief */
function Brief() {
  const b = relay.brief;
  return (
    <section className={s.block} data-halo="3" id="brief" data-tone="dark" aria-label="The morning brief">
      <div className={s.wrap}>
        <SectionHead
          pill={b.pill}
          title={
            <>
              {b.title.a} <Em>{b.title.em}</Em> {b.title.b}
            </>
          }
          body={b.body}
        />
        <Ui className={s.bento}>
          <div className={s.bRisk} data-rise aria-hidden="true">
            <ValueAtRisk />
          </div>
          <div className={s.bAway} data-rise aria-hidden="true">
            <AwayRail />
          </div>
          <div className={s.bOpp} data-rise aria-hidden="true">
            <OpportunityValue />
          </div>
          <div className={s.bMsg} data-rise aria-hidden="true">
            <Messages />
          </div>
          <div className={s.bMeet} data-rise aria-hidden="true">
            <MeetingCard />
          </div>
        </Ui>
      </div>
    </section>
  );
}

function Meetings() {
  const m = relay.meetings;
  return (
    <section className={s.block} data-halo="3" id="meetings" data-tone="dark" aria-label="Meetings and tasks">
      <div className={s.wrap}>
        <SectionHead
          pill={m.pill}
          title={
            <>
              {m.title.a} <Em>{m.title.em}</Em> {m.title.b}
            </>
          }
          body={m.body}
        />
        <Ui className={s.meetGrid}>
          <div data-rise aria-hidden="true">
            <MeetingPrep />
          </div>
          <div data-rise aria-hidden="true">
            <TaskCard />
          </div>
        </Ui>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- the numbers */
function Numbers() {
  const n = relay.numbers;
  return (
    <section className={s.block} data-halo="4" id="numbers" data-tone="dark" aria-label="The numbers">
      <div className={s.wrap}>
        <SectionHead
          pill={n.pill}
          title={
            <>
              {n.title.a} <Em>{n.title.em}</Em> {n.title.b}
            </>
          }
          body={n.body}
        />
        <div className={s.nums} data-in-view="false">
          {n.items.map((it) => (
            <div className={s.num} key={it.k} data-rise>
              <p className={s.mono}>{it.k}</p>
              <p className={s.numV} data-count={it.v}>
                {it.v}
              </p>
              <p className={s.numD}>{it.d}</p>
              {it.kind === "ticks" && (
                <span className={s.ticks} aria-hidden="true">
                  {Array.from({ length: it.v }, (_, i) => (
                    <i key={i} style={{ "--i": i } as CSSProperties} />
                  ))}
                </span>
              )}
              {it.kind === "segments" && (
                <span className={s.segs} aria-hidden="true">
                  {Array.from({ length: it.v }, (_, i) => (
                    <i key={i} style={{ "--i": i } as CSSProperties} />
                  ))}
                </span>
              )}
              {it.kind === "bar" && (
                <span className={s.bar7} aria-hidden="true">
                  <span />
                  {Array.from({ length: it.v }, (_, i) => (
                    <i key={i} />
                  ))}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ three ways to act */
function Ways() {
  const c = relay.ways;
  return (
    <section className={s.block} data-halo="5" id="ways" data-tone="dark" aria-label="Three ways to act">
      <div className={s.wrap}>
        <SectionHead
          pill={c.pill}
          title={
            <>
              {c.title.a} <Em>{c.title.em}</Em>
            </>
          }
          body={c.body}
        />
        <div className={s.ways}>
          {c.items.map((w) => (
            <div className={s.card} key={w.k} data-hi={"badge" in w ? "true" : "false"} data-rise>
              <p className={s.mono}>{w.d}</p>
              <h3 className={s.wayK}>{w.k}</h3>
              {"badge" in w && <span className={s.badge}>{w.badge}</span>}
              <ul className={s.checks}>
                {w.items.map((t) => (
                  <li key={t}>
                    <svg viewBox="0 0 10 10" aria-hidden="true">
                      <path d="M2 5.2l2 2L8 3" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
              {w.cta.href.startsWith("/") ? (
                <Link className={"badge" in w ? s.act : s.dark} href={w.cta.href}>
                  {w.cta.label}
                </Link>
              ) : (
                <a className={"badge" in w ? s.act : s.dark} href={w.cta.href}>
                  {w.cta.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- the close */
function CloseBlock({ page }: { page: ProductPage }) {
  const c = relay.cta;
  const ask = () =>
    window.dispatchEvent(new CustomEvent("aan:open-chat", { detail: { suggestions: page.faq.slice(0, 3).map((f) => ({ q: f.q, a: f.a })) } }));
  return (
    <section className={s.close} data-halo="6" id="close" data-tone="dark" aria-label="Pick the alert you dread most">
      <div className={s.wrap}>
        <div className={s.pair}>
          <div className={`${s.card} ${s.side}`} data-rise>
            <span className={s.sideGhost} aria-hidden="true" />
            <div className={s.brand}>
              <AanMascot state="diamond" size={30} glow={false} shadow={false} />
              Signals, with Aan
            </div>
            <p className={s.sideT}>{c.side}</p>
            <p className={s.mono}>also on the platform</p>
            <p className={s.links}>
              {c.links.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </p>
          </div>
          <div className={s.lit} data-rise>
            <p className={s.litLabel}>{c.label}</p>
            <h2 className={s.litT}>
              {c.title.a} <Em>{c.title.em}</Em> {c.title.b}
            </h2>
            <p className={s.litB}>{c.body}</p>
            <button type="button" className={s.field} onClick={ask}>
              <span>{c.field}</span>
              <b>{c.button}</b>
            </button>
            <a className={s.litDemo} href={DEMO.href}>
              or {DEMO.label.toLowerCase()}
            </a>
          </div>
        </div>
        <ul className={s.status}>
          {relay.status.map((t) => (
            <li key={t}>
              <i aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- the page */
export function SignalsPage({ page }: { page: ProductPage }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // the hero arrives just after the halo's blast
      gsap.to(el.querySelectorAll("[data-enter]"), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.08, delay: 0.55, ease: "power3.out" });
      // past the hero the halo dims behind a scrim, so the page reads
      const scrim = el.querySelector<HTMLElement>("[data-el=scrim]");
      const hero = el.querySelector<HTMLElement>("#top");
      if (scrim && hero) gsap.fromTo(scrim, { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: hero, start: "35% top", end: "bottom top", scrub: true } });
      // everything else rises into place as it comes into view
      ScrollTrigger.batch(el.querySelectorAll("[data-rise]"), {
        start: "top 90%",
        once: true,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", overwrite: true }),
      });
      // bars, tiles and cells play once when they arrive
      el.querySelectorAll<HTMLElement>("[data-in-view]").forEach((n) =>
        ScrollTrigger.create({ trigger: n, start: "top 82%", once: true, onEnter: () => (n.dataset.inView = "true") }),
      );
      // numbers count up
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
        const to = Number(n.dataset.count);
        n.textContent = "0";
        const o = { v: 0 };
        ScrollTrigger.create({
          trigger: n,
          start: "top 88%",
          once: true,
          onEnter: () => gsap.to(o, { v: to, duration: 1.6, ease: "power2.out", onUpdate: () => (n.textContent = Math.round(o.v).toLocaleString("en-US")) }),
        });
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      el.querySelectorAll<HTMLElement>("[data-in-view]").forEach((n) => (n.dataset.inView = "true"));
      const scrim = el.querySelector<HTMLElement>("[data-el=scrim]");
      if (scrim) scrim.style.opacity = "0.85";
    });
    return () => mm.revert();
  }, []);

  return (
    <div className={s.page} ref={root}>
      <div className={s.haloTrack}>
        <div className={s.haloStick}>
          <Halo className={s.halo} />
          <span className={s.scrim} data-el="scrim" aria-hidden="true" />
        </div>
      </div>
      <Hero />
      <Tour />
      <Watches />
      <Glue />
      <Flow />
      <Panel />
      <Sources />
      <Brief />
      <Meetings />
      <Numbers />
      <Ways />
      <CloseBlock page={page} />
    </div>
  );
}
