"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AanMascot } from "@/components/aan/AanMascot";
import { Halo } from "@/components/visual/Halo";
import type { ProductPage } from "@/content/products/types";
import { DEMO, relay } from "@/content/products/signals-page";
import s from "./signals.module.css";

gsap.registerPlugin(ScrollTrigger);

/*
  Signals, in the Relay design (getlayers), with Signals' own facts. The
  halo behind the page is the energy of the product: it blasts out of a
  white-hot core when the page opens and travels down with you. Sections, in
  Relay's order: hero with a live graph, what it watches, the line, three
  rows, the panel that grows out of a tile, coverage, a night as a bento,
  the numbers, your catalog, and the close.
*/

const Em = ({ children }: { children: ReactNode }) => <em className={s.em}>{children}</em>;

const Mark = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 559 342" aria-hidden="true">
    <polygon fill="#F26E77" points="300.4,149.8 366.5,74.4 299.7,0 233.6,75.4" />
    <path fill="currentColor" d="M399.9,111.7l-99.1,113.1L200.6,113.1L0,342h155.4c27.2,0,53-11.7,70.9-32.1l74.7-85.2l77.2,86.1c17.9,19.9,43.4,31.3,70.2,31.3h158.1L399.9,111.7L399.9,111.7z" />
  </svg>
);

function Pill({ children }: { children: ReactNode }) {
  return (
    <p className={s.pill} data-rise>
      <i aria-hidden="true" />
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ hero */
function Graph() {
  const g = relay.graph;
  const [at, setAt] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setAt((a) => (a + 1) % g.last.length), 2800);
    return () => window.clearInterval(t);
  }, [g.last.length]);
  // newest on top: each tick, a new signal slides in above the others
  const rows = [2, 1, 0].map((i) => g.last[(at + i) % g.last.length]);
  return (
    <div className={s.graph} data-enter>
      <header className={s.gHead}>
        <span>{g.name}</span>
        <span className={s.dim}>{g.meta}</span>
        <span className={s.live}>
          <i aria-hidden="true" />
          {g.status}
        </span>
      </header>
      <div className={s.canvas}>
        <div className={s.tools} aria-hidden="true">
          <span>
            <svg viewBox="0 0 12 12"><path d="M3 2l6 4-3 .6L4.6 10z" /></svg>
          </span>
          <span>
            <svg viewBox="0 0 12 12"><path d="M6 2.5v7M2.5 6h7" /></svg>
          </span>
          <span>
            <svg viewBox="0 0 12 12"><path d="M3 2.5v4a2 2 0 002 2h4M7 6.5l2 2-2 2" /></svg>
          </span>
        </div>
        <span className={s.zoom} aria-hidden="true">100%</span>
        <svg className={s.wires} viewBox="0 0 520 250" aria-hidden="true">
          <path d="M144 126 C162 126 158 52 178 52" />
          <path d="M308 52 C334 52 330 114 356 114" />
          <path d="M244 75 C244 128 260 118 260 176" />
          <circle r="2.6" className={s.pulse}>
            <animateMotion dur="2.4s" repeatCount="indefinite" path="M144 126 C162 126 158 52 178 52 L308 52 C334 52 330 114 356 114" />
          </circle>
          <text x="318" y="90" className={s.wireTag}>above floor</text>
          <text x="252" y="134" className={s.wireTag}>else</text>
        </svg>
        <div className={s.node} style={{ left: "3%", top: "41.6%" }}>
          <b>{g.trigger.t}</b>
          <span>{g.trigger.d}</span>
        </div>
        <div className={s.node} style={{ left: "34.2%", top: "12%" }}>
          <b>{g.cause.t}</b>
          <span>{g.cause.d}</span>
        </div>
        <div className={`${s.node} ${s.nodeYes}`} style={{ left: "68.4%", top: "36.8%" }}>
          <b>{g.yes.t}</b>
          <span>{g.yes.d}</span>
        </div>
        <span className={s.wait} style={{ left: "70%", top: "60%" }}>
          <i aria-hidden="true" /> {g.wait}
        </span>
        <div className={s.node} style={{ left: "37.6%", top: "70.4%" }}>
          <b>{g.no.t}</b>
          <span>{g.no.d}</span>
        </div>
      </div>
      <div className={s.last}>
        <p className={s.lastHead}>
          <span>last signals</span>
          <span>sample data</span>
        </p>
        <ul>
          {rows.map((r) => (
            <li key={r.t}>
              <i aria-hidden="true" />
              <time>{r.t}</time>
              <span>
                {r.what} <span className={s.dim}>· {r.where}</span>
              </span>
              <b>{r.v}</b>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Hero() {
  const h = relay.hero;
  return (
    <section className={s.hero} data-halo="0" id="top" data-screen="top" data-fit="grow" aria-label="Signals">
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
        <Graph />
      </div>
    </section>
  );
}

/* --------------------------------------------- what it watches, the line */
function Watches() {
  const w = relay.watches;
  return (
    <section className={s.watches} data-halo="1" id="watches" aria-label="What Signals watches">
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
      </div>
    </section>
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

function Glue() {
  const g = relay.glue;
  return (
    <section className={s.glue} data-halo="1" id="finding-out" aria-label="Finding out">
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

/* --------------------------------------------------------------- the rows */
function NightCard() {
  const n = relay.night;
  return (
    <div className={s.card} data-in-view="false">
      <header className={s.cardHead}>
        <span>{n.head}</span>
        <span className={s.dim}>{n.meta}</span>
      </header>
      <div className={s.runs}>
        <span className={s.found} style={{ left: "calc(var(--lab) + (100% - var(--lab) - var(--val)) * 0.4)" }}>
          <i aria-hidden="true" />
          <span>{n.found}</span>
        </span>
        {n.rows.map((r, i) => (
          <div className={s.run} key={r.k} style={{ "--i": i } as CSSProperties}>
            <span className={s.runK}>
              <svg viewBox="0 0 10 10" aria-hidden="true">
                <path d="M2 5.2l2 2L8 3" />
              </svg>
              {r.k}
            </span>
            <span className={s.runTrack}>
              <span className={s.runBar} style={{ left: `${r.from * 100}%`, width: `${(r.to - r.from) * 100}%` }} />
            </span>
            <span className={s.runV}>{r.d}</span>
          </div>
        ))}
        <div className={`${s.run} ${s.runAsk}`} style={{ "--i": 4 } as CSSProperties}>
          <span className={s.runK}>
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <circle cx="5" cy="5" r="3.4" />
            </svg>
            {n.ask}
          </span>
          <span className={s.runTrack}>
            <span className={s.runPend} />
          </span>
          <span className={s.runV}>{n.askNote}</span>
        </div>
        <p className={s.axis} aria-hidden="true">
          {n.axis.map((a) => (
            <span key={a}>{a}</span>
          ))}
        </p>
      </div>
      <p className={s.sample}>Sample data</p>
    </div>
  );
}

function ThreadCard() {
  const t = relay.thread;
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "typing" | "shown" | "yes" | "no">("idle");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("shown");
      return;
    }
    let timer = 0;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 78%",
      once: true,
      onEnter: () => {
        setState("typing");
        timer = window.setTimeout(() => setState("shown"), 1200);
      },
    });
    return () => {
      st.kill();
      window.clearTimeout(timer);
    };
  }, []);
  const open = state !== "idle" && state !== "typing";
  return (
    <div className={s.card} ref={ref}>
      <header className={s.cardHead}>
        <span>{t.channel}</span>
        <span className={s.dim}>{t.when}</span>
      </header>
      <div className={s.thread}>
        {!open ? (
          <p className={s.typing} data-on={state === "typing" ? "true" : "false"} aria-label="Aan is typing">
            <i />
            <i />
            <i />
          </p>
        ) : (
          <div className={s.msg}>
            <span className={s.avatar}>
              <AanMascot state="diamond" size={22} glow={false} shadow={false} />
            </span>
            <div className={s.msgBody}>
              <p className={s.who}>
                <b>Aan</b>
                <span>app</span>
                <time>{t.time}</time>
              </p>
              <p className={s.text}>{t.text}</p>
              <dl className={s.fields}>
                {t.fields.map((f) => (
                  <div key={f.k}>
                    <dt>{f.k}</dt>
                    <dd>{f.v}</dd>
                  </div>
                ))}
              </dl>
              <div className={s.answer} aria-live="polite">
                {state === "shown" ? (
                  <>
                    <button type="button" className={s.yes} onClick={() => setState("yes")}>
                      <svg viewBox="0 0 10 10" aria-hidden="true">
                        <path d="M2 5.2l2 2L8 3" />
                      </svg>
                      {t.yes}
                    </button>
                    <button type="button" className={s.hold} onClick={() => setState("no")}>
                      {t.no}
                    </button>
                    <span className={s.waiting}>{t.waiting}</span>
                  </>
                ) : (
                  <p className={s.done}>{state === "yes" ? t.done : t.held}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <p className={s.sample}>Sample message</p>
    </div>
  );
}

/* row 03: isometric bars, ad sales for the 7 days after the fix */
const ISO = { W: 470, H: 230, base: 178, a: 17, b: 9.8, gap: 64, x0: 44 };
const prism = (cx: number, h: number) => {
  const { base, a, b } = ISO;
  const top = base - h;
  return {
    top: `${cx},${top - b} ${cx + a},${top} ${cx},${top + b} ${cx - a},${top}`,
    left: `${cx - a},${top} ${cx},${top + b} ${cx},${base + b} ${cx - a},${base}`,
    right: `${cx},${top + b} ${cx + a},${top} ${cx + a},${base} ${cx},${base + b}`,
  };
};
function IsoCard() {
  const c = relay.checked;
  const ref = useRef<HTMLDivElement>(null);
  const max = Math.max(...c.days.map((d) => d.v));
  const full = (v: number) => 20 + (v / max) * 118;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const groups = Array.from(el.querySelectorAll<SVGGElement>("[data-bar]"));
    const draw = (g: SVGGElement, h: number) => {
      const cx = Number(g.dataset.cx);
      const p = prism(cx, h);
      const [t, l, r] = Array.from(g.querySelectorAll("polygon"));
      t.setAttribute("points", p.top);
      l.setAttribute("points", p.left);
      r.setAttribute("points", p.right);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    groups.forEach((g) => draw(g, 2));
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 78%",
      once: true,
      onEnter: () =>
        groups.forEach((g, i) => {
          const o = { h: 2 };
          gsap.to(o, { h: Number(g.dataset.h), duration: 1.1, delay: i * 0.09, ease: "power3.out", onUpdate: () => draw(g, o.h) });
        }),
    });
    return () => st.kill();
  }, []);
  return (
    <div className={s.card} ref={ref}>
      <header className={s.cardHead}>
        <span>{c.head}</span>
        <span className={s.dim}>{c.meta}</span>
      </header>
      <svg className={s.iso} viewBox={`0 0 ${ISO.W} ${ISO.H}`} role="img" aria-label="Ad sales on the fixed product: $640 on the day of the fix, back to about $1,230 a day by day 4.">
        <defs>
          <linearGradient id="isoHi" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d6dcff" />
            <stop offset="1" stopColor="#f6a3a9" />
          </linearGradient>
        </defs>
        {c.days.map((d, i) => {
          const cx = ISO.x0 + i * ISO.gap;
          const h = full(d.v);
          const p = prism(cx, h);
          const last = i === c.days.length - 1;
          return (
            <g key={d.d} data-bar data-cx={cx} data-h={h} className={last ? s.isoHi : undefined}>
              <polygon points={p.top} className={s.isoTop} />
              <polygon points={p.left} className={s.isoL} />
              <polygon points={p.right} className={s.isoR} />
              <text x={cx} y={ISO.base + 36} className={s.isoLabel}>
                {d.d}
              </text>
            </g>
          );
        })}
      </svg>
      <p className={s.sample}>Sample data</p>
    </div>
  );
}

function Rows() {
  const cards = [<NightCard key="n" />, <ThreadCard key="t" />, <IsoCard key="i" />];
  return (
    <section className={s.rows} data-halo="2" id="how" aria-label="How Signals works">
      <div className={s.wrap}>
        {relay.rows.map((r, i) => (
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
            </div>
            <div className={s.rowCard} data-rise>
              {cards[i]}
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
    <section ref={root} className={s.panelSec} data-halo="3" id="for" data-screen="for" data-pin aria-label="What Signals is for">
      <span className={s.panelTile} data-el="tile" aria-hidden="true">
        <Mark className={s.tileMark} />
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
            <Mark className={s.tileMark} />
          </span>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- quiet */
function HubCard() {
  const h = relay.quiet.hub;
  const at: [number, number][] = [
    [70, 60],
    [190, 42],
    [290, 42],
    [410, 60],
  ];
  return (
    <div className={s.card}>
      <h3 className={s.cardT}>{h.t}</h3>
      <p className={s.cardD}>{h.d}</p>
      <svg className={s.hub} viewBox="0 0 480 190" role="img" aria-label="Amazon, Walmart, Shopify and Slack, all wired into one Anarix feed.">
        <defs>
          <linearGradient id="hubG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3828a" />
            <stop offset="1" stopColor="#8a9cf6" />
          </linearGradient>
        </defs>
        {at.map(([x, y], i) => {
          const d = `M${x} ${y + 18} C${x} ${y + 70} 240 ${y + 40} 240 112`;
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
        <rect x="208" y="112" width="64" height="64" rx="16" fill="url(#hubG)" className={s.hubCore} />
        <g transform="translate(222 131) scale(0.064)">
          <polygon fill="#0b0e14" points="300.4,149.8 366.5,74.4 299.7,0 233.6,75.4" />
          <path fill="#0b0e14" d="M399.9,111.7l-99.1,113.1L200.6,113.1L0,342h155.4c27.2,0,53-11.7,70.9-32.1l74.7-85.2l77.2,86.1c17.9,19.9,43.4,31.3,70.2,31.3h158.1L399.9,111.7L399.9,111.7z" />
        </g>
      </svg>
      <p className={s.cardFoot}>{h.foot}</p>
    </div>
  );
}

function RankedCard() {
  const r = relay.quiet.ranked;
  const max = r.items[0].v;
  return (
    <div className={s.card} data-in-view="false">
      <h3 className={s.cardT}>{r.t}</h3>
      <p className={s.cardD}>{r.d}</p>
      <p className={s.cardMono}>{r.head}</p>
      <ul className={s.ranked}>
        {r.items.map((it, i) => (
          <li key={it.k} style={{ "--i": i, "--w": it.v / max } as CSSProperties}>
            <span className={s.rankK}>
              {it.k}
              <small>{it.s}</small>
            </span>
            <span className={s.rankTrack}>
              <span className={s.rankFill} />
            </span>
            <b>${it.v.toLocaleString("en-US")}</b>
          </li>
        ))}
      </ul>
      <p className={s.cardFoot}>{r.foot}</p>
    </div>
  );
}

function Quiet() {
  const q = relay.quiet;
  return (
    <section className={`${s.block} ${s.afterPanel}`} data-halo="3" id="coverage" aria-label="Coverage">
      <div className={s.wrap}>
        <SectionHead
          pill={q.pill}
          title={
            <>
              <Em>{q.title.em}</Em> {q.title.b}
            </>
          }
          body={q.body}
        />
        <div className={s.two}>
          <div data-rise>
            <HubCard />
          </div>
          <div data-rise>
            <RankedCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- the night, bento */
const HEAT: Record<string, "hi" | "risk" | "on"> = { "1-1": "hi", "3-0": "risk", "0-2": "on", "2-1": "on", "4-0": "on", "5-3": "on", "6-1": "on", "2-3": "risk" };
function Brief() {
  const b = relay.brief;
  const R = 34;
  const C = 2 * Math.PI * R;
  return (
    <section className={s.block} data-halo="3" id="brief" aria-label="The morning brief">
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
        <div className={s.bento} data-in-view="false">
          <div className={`${s.card} ${s.bWeek}`} data-rise>
            <header className={s.cardHead}>
              <span>{b.week.head}</span>
              <span className={s.chip}>
                <i aria-hidden="true" />
                {b.week.chip}
              </span>
            </header>
            <div className={s.heat}>
              <span className={s.heatHours} aria-hidden="true">
                {b.week.hours.map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </span>
              {b.week.days.map((d, x) => (
                <span className={s.heatCol} key={d}>
                  {b.week.hours.map((h, y) => (
                    <i key={h} data-k={HEAT[`${x}-${y}`] ?? "off"} style={{ "--i": x * 4 + y } as CSSProperties} />
                  ))}
                  <small>{d}</small>
                </span>
              ))}
            </div>
          </div>
          <div className={`${s.card} ${s.bGauge}`} data-rise>
            <header className={s.cardHead}>
              <span>{b.gauge.head}</span>
            </header>
            <div className={s.gauge}>
              <svg viewBox="0 0 84 84" aria-hidden="true">
                <circle cx="42" cy="42" r={R} className={s.gaugeTrack} />
                <circle cx="42" cy="42" r={R} className={s.gaugeFill} style={{ "--c": C, "--v": b.gauge.v / 100 } as CSSProperties} />
              </svg>
              <b>
                <span data-count={b.gauge.v}>{b.gauge.v}</span>
                {b.gauge.unit}
              </b>
            </div>
            <p className={s.cardFoot}>{b.gauge.note}</p>
          </div>
          <div className={s.card} data-rise>
            <header className={s.cardHead}>
              <span>{b.waiting.head}</span>
            </header>
            <p className={s.stores} aria-hidden="true">
              <span>AM</span>
              <span>WM</span>
              <span>SH</span>
            </p>
            <p className={s.big}>
              <b data-count={b.waiting.v}>{b.waiting.v}</b> {b.waiting.unit}
            </p>
            <p className={s.cardFoot}>{b.waiting.note}</p>
          </div>
          <div className={s.card} data-rise>
            <header className={s.cardHead}>
              <span>{b.after.head}</span>
            </header>
            <svg className={s.waves} viewBox="0 0 220 70" aria-hidden="true">
              <path className={s.waveA} d="M0 22 C30 22 40 24 60 52 S100 30 120 24 S180 18 220 16" />
              <path className={s.waveB} d="M0 48 C30 48 40 46 60 18 S100 40 120 46 S180 52 220 54" />
            </svg>
            <p className={s.legend}>
              <span>
                <i aria-hidden="true" /> {b.after.a}
              </span>
              <span>
                <i aria-hidden="true" className={s.coral} /> {b.after.b}
              </span>
            </p>
          </div>
          <div className={s.card} data-rise>
            <header className={s.cardHead}>
              <span>{b.where.head}</span>
            </header>
            <div className={s.dots}>
              {b.where.pins.map((p, i) => (
                <span key={p.k} className={s.pin} style={{ left: `${[16, 52, 74][i]}%`, top: `${[38, 18, 56][i]}%` }}>
                  <i aria-hidden="true" />
                  {p.k} <b>{p.v}</b>
                </span>
              ))}
            </div>
          </div>
          <p className={`${s.sample} ${s.bentoSample}`}>Sample data</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- the numbers */
function Numbers() {
  const n = relay.numbers;
  return (
    <section className={s.block} data-halo="4" id="numbers" aria-label="The numbers">
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
        <ul className={s.notes}>
          {n.notes.map((t) => (
            <li key={t} data-rise>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- the catalog */
function Catalog() {
  const c = relay.catalog;
  const [i, setI] = useState(2);
  const n = c.stops[i];
  const fmt = (v: number) => v.toLocaleString("en-US");
  return (
    <section className={s.block} data-halo="5" id="catalog" aria-label="Your catalog">
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
        <div className={`${s.card} ${s.estimate}`} data-rise>
          <div className={s.estL}>
            <p className={s.mono}>estimate</p>
            <label className={s.estQ} htmlFor="sig-catalog">
              {c.ask}
            </label>
            <input
              id="sig-catalog"
              type="range"
              min={0}
              max={c.stops.length - 1}
              step={1}
              value={i}
              onChange={(e) => setI(Number(e.target.value))}
              className={s.range}
              style={{ "--f": i / (c.stops.length - 1) } as CSSProperties}
              aria-valuetext={`${fmt(n)} products`}
            />
            <p className={s.stops} aria-hidden="true">
              {c.stops.map((v, j) => (
                <span key={v} data-on={j === i ? "true" : "false"}>
                  {v >= 30000 ? "30,000+" : fmt(v)}
                </span>
              ))}
            </p>
          </div>
          <div className={s.estR}>
            <p className={s.mono}>signals watches</p>
            <p className={s.estV} aria-live="polite">
              {fmt(n * 79)}
              <small>ways to go wrong, on every store</small>
            </p>
            <p className={s.estMath}>
              {fmt(n)} products × 79 alert reasons
            </p>
            <a className={s.act} href={DEMO.href}>
              {DEMO.label}
            </a>
          </div>
        </div>
        <div className={s.ways}>
          {c.ways.map((w) => (
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
    <section className={s.close} data-halo="6" id="close" aria-label="Pick the alert you dread most">
      <div className={s.wrap}>
        <div className={s.pair}>
          <div className={`${s.card} ${s.side}`} data-rise>
            <Mark className={s.sideGhost} />
            <p className={s.brand}>
              <Mark className={s.brandMark} />
              Anarix Signals
            </p>
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
      // everything else rises out of a soft blur as it comes into view
      ScrollTrigger.batch(el.querySelectorAll("[data-rise]"), {
        start: "top 90%",
        once: true,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.08, ease: "power3.out", overwrite: true }),
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
    });
    return () => mm.revert();
  }, []);

  return (
    <div className={s.page} ref={root}>
      <div className={s.haloTrack}>
        <Halo className={s.halo} />
      </div>
      <Hero />
      <Watches />
      <Glue />
      <Rows />
      <Panel />
      <Quiet />
      <Brief />
      <Numbers />
      <Catalog />
      <CloseBlock page={page} />
    </div>
  );
}
