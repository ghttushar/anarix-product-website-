"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { Screen } from "@/components/layout/Screen";
import { StoryScroll, useStoryProgress } from "@/components/layout/StoryScroll";
import { Magnetic } from "@/components/motion/Magnetic";
import { Ticker } from "@/components/motion/Ticker";
import { Reveal } from "@/components/motion/Reveal";
import { FilmDialog } from "@/components/home/FilmDialog";
import { AnarixMark } from "@/components/chrome/Logo";
import { SlackApproval } from "@/components/product-ui/SlackApproval";
import type { ProductPage } from "@/content/products/types";
import { aanPage as c, accent } from "@/content/products/aan-page";
import { night } from "@/content/home";
import a from "./aan-relay.module.css";

/*
  The Aan page in the Relay design (Phase 9; the owner: "exact same design
  but with my colors exactly, no more no less"). Relay's sections in Relay's
  order and layouts, carrying Aan's facts: a hero with a live decision graph,
  what Aan watches and talks to, the glue line, three numbered rows, the
  panel that grows open, guardrails, a night seen from Aan, the three proof
  figures, your catalog, and the "task you hate most" card. Relay's lime is
  periwinkle where it acts and coral-to-periwinkle where it is a surface.
  No prices, no quotes: product numbers are sample data and say so.
*/

/** a headline with its one italic serif word */
function Accent({ text }: { text: string }) {
  return (
    <>
      {accent(text).map((p, i) =>
        p.em ? (
          <em key={i} className={a.em}>
            {p.text}
          </em>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <p className={a.pill}>
      <i aria-hidden="true" />
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ hero */
function Flow() {
  const f = c.hero.flow;
  return (
    <div className={a.flow} data-ui>
      <header className={a.flowHead}>
        <b>{f.title}</b>
        <span>{f.meta}</span>
        <em>{f.state}</em>
      </header>
      <div className={a.flowBody}>
        <div className={a.tools} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <span className={a.zoom}>100%</span>
        <div className={a.graph}>
          <svg className={a.wires} viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
            <path d="M18 30 C 28 30, 30 16, 40 16" />
            <path d="M58 16 C 66 16, 66 12, 74 12" data-lit />
            <path d="M50 22 C 50 32, 50 36, 50 42" />
          </svg>
          <span className={a.wireLabel} style={{ left: "64%", top: "6%" }}>
            within
          </span>
          <span className={a.wireLabel} style={{ left: "52%", top: "52%" }}>
            above
          </span>
          {(
            [
              ["start", "2%", "40%"],
              ["check", "38%", "14%"],
              ["yes", "72%", "8%"],
              ["no", "38%", "66%"],
            ] as const
          ).map(([k, x, y]) => {
            const n = f.nodes[k];
            return (
              <div key={k} className={a.node} data-k={k} style={{ left: x, top: y }}>
                <b>{n.t}</b>
                <small>{n.d}</small>
              </div>
            );
          })}
        </div>
        <p className={a.runsHead}>last runs · sample</p>
        <ul className={a.runs}>
          {f.runs.map((r) => (
            <li key={r.time}>
              <i aria-hidden="true" />
              <time>{r.time}</time>
              <span>{r.what}</span>
              <small>{r.took}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <Screen id="top" fit="grow" className={a.screen} bodyClassName={`l-container ${a.hero}`} label="Aan">
      <div className={a.heroCopy}>
        <Pill>{c.hero.pill}</Pill>
        <h1 className={a.h1}>
          <span>{c.hero.title[0]}</span>
          <br />
          <Accent text={c.hero.title[1]} />
        </h1>
        <p className={a.lede}>{c.hero.line}</p>
        <div className={a.actions}>
          <Magnetic>
            <a className={a.primary} href={c.hero.primary.href}>
              {c.hero.primary.label}
            </a>
          </Magnetic>
          <FilmDialog className={a.secondary} />
        </div>
        <p className={a.note}>{c.hero.note}</p>
      </div>
      <Flow />
    </Screen>
  );
}

/* ------------------------------------------------- what Aan talks to */
function Connects() {
  const [lit, setLit] = useState(1);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setLit((l) => (l + 1) % c.connects.tiles.length), 1600);
    return () => window.clearInterval(t);
  }, []);
  return (
    <Screen id="connects" fit="grow" className={a.screen} bodyClassName={`l-container ${a.connects}`} label="Where Aan works">
      <p className={a.mono}>{c.connects.label}</p>
      <ul className={a.tiles}>
        {c.connects.tiles.map((t, i) => (
          <li key={t.k} data-lit={i === lit ? "true" : "false"}>
            <span className={a.tile}>{t.k}</span>
            <small>{t.t}</small>
          </li>
        ))}
      </ul>
    </Screen>
  );
}

/* --------------------------------------------------------- the glue line */
function SectionHead({ pill, title, line }: { pill: string; title: string; line: string }) {
  return (
    <header className={a.head}>
      <div>
        <Pill>{pill}</Pill>
        <h2 className={a.h2}>
          <Accent text={title} />
        </h2>
      </div>
      <p className={a.headLine}>{line}</p>
    </header>
  );
}

/* ---------------------------------------------------- three numbered rows */
function Analysis() {
  return (
    <div className={a.card} data-ui>
      <p className={a.cardHead}>
        <span>answer · sample</span>
        <span>worked out</span>
      </p>
      <p className={a.question}>{c.analysis.q}</p>
      <ul className={a.steps}>
        {c.analysis.steps.map((s) => (
          <li key={s.t}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.5 8.5l3 3 6-7" />
            </svg>
            <span>{s.t}</span>
            <i style={{ "--v": s.v } as CSSProperties} />
            <small>{s.took}</small>
          </li>
        ))}
      </ul>
      <p className={a.axis}>
        {c.analysis.axis.map((x) => (
          <span key={x}>{x}</span>
        ))}
      </p>
    </div>
  );
}

function Record() {
  const W = 300;
  const H = 150;
  const bw = 26;
  return (
    <div className={a.card} data-ui>
      <p className={a.cardHead}>
        <span>{c.record.head}</span>
        <span>logged with reasons</span>
      </p>
      <svg className={a.iso} viewBox={`0 0 ${W} ${H + 24}`} role="img" aria-label="Actions per weekday, sample data, rising toward Saturday">
        {c.record.days.map((d, i) => {
          const x = 22 + i * 46;
          const h = 20 + d.v * 100;
          const base = H - 6;
          const top = base - h;
          const last = i === c.record.days.length - 1;
          return (
            <g key={d.d} data-last={last ? "true" : undefined}>
              <polygon className={a.isoL} points={`${x},${top} ${x + bw / 2},${top + 7} ${x + bw / 2},${base + 7} ${x},${base}`} />
              <polygon className={a.isoR} points={`${x + bw / 2},${top + 7} ${x + bw},${top} ${x + bw},${base} ${x + bw / 2},${base + 7}`} />
              <polygon className={a.isoT} points={`${x},${top} ${x + bw / 2},${top - 7} ${x + bw},${top} ${x + bw / 2},${top + 7}`} />
              <text x={x + bw / 2} y={H + 20} textAnchor="middle">
                {d.d}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Rows() {
  const visuals = [<Analysis key="0" />, <SlackApproval key="1" />, <Record key="2" />];
  return (
    <Screen id="how" fit="grow" className={a.screen} bodyClassName={`l-container ${a.stack}`} label="What Aan does">
      <SectionHead pill={c.glue.pill} title={c.glue.title} line={c.glue.line} />
      {c.rows.map((r, i) => (
        <div key={r.n} className={a.row} data-flip={i === 1 ? "true" : undefined}>
          <Reveal className={a.rowCopy}>
            <p className={a.rowN}>{r.n}</p>
            <h3 className={a.h3}>{r.t}</h3>
            <p className={a.rowD}>{r.d}</p>
          </Reveal>
          <div className={a.rowVisual}>{visuals[i]}</div>
        </div>
      ))}
    </Screen>
  );
}

/* -------------------------------------------- the panel that grows open */
function PanelInner() {
  const ref = useRef<HTMLDivElement>(null);
  const onP = useCallback((p: number) => {
    const g = Math.min(1, p / 0.6);
    ref.current?.style.setProperty("--g", (g * g * (3 - 2 * g)).toFixed(4));
  }, []);
  useStoryProgress(onP);
  return (
    <div ref={ref} className={a.panelStage}>
      <div className={a.panel}>
        <span className={a.panelColor} aria-hidden="true" />
        <p className={a.panelLabel}>{c.panel.label}</p>
        <h2 className={a.panelTitle}>
          <span>{c.panel.title[0]}</span>
          <br />
          <Accent text={c.panel.title[1]} />
        </h2>
        <span className={a.logoTile}>
          <AnarixMark height={22} />
        </span>
      </div>
    </div>
  );
}

function Panel() {
  return (
    <StoryScroll id="for" label={c.panel.label} chapters={2} per={55} bodyClassName={a.panelBody}>
      <PanelInner />
    </StoryScroll>
  );
}

/* ------------------------------------------------------------ guardrails */
function Careful() {
  const ring = ["amazon", "walmart", "shopify", "slack", "teams", "mcp"];
  return (
    <Screen id="guardrails" fit="grow" className={a.screen} bodyClassName={`l-container ${a.stack}`} label="Guardrails">
      <SectionHead pill={c.careful.pill} title={c.careful.title} line={c.careful.line} />
      <div className={a.two}>
        <div className={a.card} data-ui>
          <h3 className={a.cardTitle}>{c.careful.cards[0].t}</h3>
          <p className={a.cardD}>{c.careful.cards[0].d}</p>
          <div className={a.hub} aria-hidden="true">
            {ring.map((r, i) => (
              <span key={r} className={a.spoke} style={{ "--a": `${i * 60}deg` } as CSSProperties}>
                <small>{r}</small>
              </span>
            ))}
            <span className={a.core}>
              <AnarixMark height={20} />
            </span>
          </div>
        </div>
        <div className={a.card} data-ui>
          <h3 className={a.cardTitle}>{c.careful.cards[1].t}</h3>
          <p className={a.cardD}>{c.careful.cards[1].d}</p>
          <ul className={a.ladder}>
            {c.careful.ladder.map((l) => (
              <li key={l.t}>
                <span>{l.t}</span>
                <i data-on={l.on ? "true" : "false"} aria-label={l.on ? "on" : "off"} />
              </li>
            ))}
          </ul>
          <p className={a.mono}>sample settings · limit $400 a day</p>
        </div>
      </div>
    </Screen>
  );
}

/* ------------------------------------------------------------ the night */
function Night() {
  const week = Array.from({ length: 7 }, (_, d) => Array.from({ length: 5 }, (_, r) => ((d * 7 + r * 3) % 9) / 9));
  return (
    <Screen id="night" fit="grow" className={a.screen} bodyClassName={`l-container ${a.stack}`} label="A night, seen from Aan">
      <SectionHead pill={c.night.pill} title={c.night.title} line={c.night.line} />
      <div className={a.bento}>
        <div className={`${a.card} ${a.wide}`} data-ui>
          <p className={a.cardHead}>
            <span>this week, night by night · sample</span>
            <span className={a.chip}>next check in 12 min</span>
          </p>
          <div className={a.week}>
            {week.map((col, d) => (
              <div key={d}>
                {col.map((v, r) => (
                  <i key={r} style={{ "--v": v } as CSSProperties} data-lit={d === 1 && r === 2 ? "true" : undefined} />
                ))}
                <small>{["mon", "tue", "wed", "thu", "fri", "sat", "sun"][d]}</small>
              </div>
            ))}
          </div>
        </div>
        <div className={a.card} data-ui>
          <p className={a.cardHead}>
            <span>handled without you · sample</span>
          </p>
          <div className={a.ring} style={{ "--v": 0.82 } as CSSProperties}>
            <b>82%</b>
          </div>
        </div>
        <div className={a.card} data-ui>
          <p className={a.cardHead}>
            <span>waiting on you</span>
          </p>
          <p className={a.big}>1</p>
          <p className={a.cardD}>{night.brief.held.replace("Needs you: ", "")}</p>
        </div>
        <div className={a.card} data-ui>
          <p className={a.cardHead}>
            <span>fixes checked · next 7 days</span>
          </p>
          <svg className={a.waves} viewBox="0 0 200 60" aria-hidden="true">
            <path d="M0 30 C 25 5, 50 5, 75 30 S 125 55, 150 30 S 190 8, 200 20" />
            <path d="M0 36 C 25 50, 50 50, 75 36 S 125 18, 150 36 S 190 46, 200 40" data-b />
          </svg>
        </div>
        <div className={a.card} data-ui>
          <p className={a.cardHead}>
            <span>stores watched</span>
          </p>
          <ul className={a.stores}>
            {night.stores.map((s) => (
              <li key={s}>
                <i />
                {s}
                <small>watching</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Screen>
  );
}

/* ----------------------------------------------------------- the numbers */
const FMT: Record<string, (n: number) => string> = {
  billions: (n) => `$${(n / 10).toFixed(1)}B`,
  plus: (n) => `${n}+`,
  percent: (n) => `${(n / 10).toFixed(1)}%`,
};

function Numbers() {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Screen id="proof" fit="grow" className={a.screen} bodyClassName={`l-container ${a.stack}`} label="Proof">
      <SectionHead pill={c.numbers.pill} title={c.numbers.title} line={c.numbers.line} />
      <div ref={ref} className={a.stats}>
        {c.numbers.stats.map((s, i) => (
          <div key={s.label} className={a.stat} data-i={i}>
            <p className={a.statFig}>
              <Ticker value={s.value} from={0} play={shown} duration={1500} format={FMT[s.format]} />
            </p>
            <p className={a.statLabel}>{s.label}</p>
            <span className={a.statArt} aria-hidden="true" data-shown={shown ? "true" : "false"}>
              {i === 1 &&
                Array.from({ length: 14 }, (_, k) => <i key={k} data-on={k < 11 ? "true" : "false"} style={{ "--k": k } as CSSProperties} />)}
            </span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* --------------------------------------------------------- your catalog */
function Plans() {
  const [n, setN] = useState<number>(c.plans.start);
  const pct = (Math.log(n) - Math.log(c.plans.min)) / (Math.log(c.plans.max) - Math.log(c.plans.min));
  const toN = (t: number) => Math.round(Math.exp(Math.log(c.plans.min) + t * (Math.log(c.plans.max) - Math.log(c.plans.min))) / 100) * 100;
  return (
    <Screen id="catalog" fit="grow" className={a.screen} bodyClassName={`l-container ${a.stack}`} label="Your catalog">
      <SectionHead pill={c.plans.pill} title={c.plans.title} line={c.plans.line} />
      <div className={a.estimate} data-ui>
        <div className={a.estLeft}>
          <p className={a.mono}>estimate</p>
          <label className={a.ask} htmlFor="asins">
            {c.plans.ask}
          </label>
          <input
            id="asins"
            className={a.slider}
            type="range"
            min={0}
            max={1000}
            value={Math.round(pct * 1000)}
            onChange={(e) => setN(Math.max(c.plans.min, toN(Number(e.target.value) / 1000)))}
            style={{ "--fill": `${pct * 100}%` } as CSSProperties}
            aria-valuetext={`${n.toLocaleString("en-US")} ASINs`}
          />
          <p className={a.ticks}>
            <span>{c.plans.min.toLocaleString("en-US")}</span>
            <b>{n.toLocaleString("en-US")}</b>
            <span>{c.plans.max.toLocaleString("en-US")}</span>
          </p>
        </div>
        <div className={a.estRight}>
          <p className={a.mono}>{c.plans.yours.k}</p>
          <p className={a.yours}>{c.plans.yours.t}</p>
          <p className={a.cardD}>
            {n.toLocaleString("en-US")} ASINs, {c.plans.yours.d}
          </p>
          <a className={a.primary} href={c.hero.primary.href}>
            {c.hero.primary.label}
          </a>
        </div>
      </div>
      <div className={a.tiers}>
        {c.plans.tiers.map((t) => (
          <div key={t.t} className={a.tier} data-featured={"featured" in t && t.featured ? "true" : undefined} data-ui>
            <p className={a.tierTitle}>{t.t}</p>
            <p className={a.cardD}>{t.d}</p>
            <ul className={a.checks}>
              {t.items.map((it) => (
                <li key={it}>
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3.5 8.5l3 3 6-7" />
                  </svg>
                  {it}
                </li>
              ))}
            </ul>
            <a className={"featured" in t && t.featured ? a.primary : a.ghost} href={c.hero.primary.href}>
              {c.hero.primary.label}
            </a>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* ------------------------------------------------ the task you hate most */
function Cta() {
  const [task, setTask] = useState("");
  const send = (e: FormEvent) => {
    e.preventDefault();
    const q = task.trim();
    if (!q) return;
    window.dispatchEvent(
      new CustomEvent("aan:open-chat", {
        detail: { suggestions: [{ q, a: `Thanks. In a demo I can show you how I would handle "${q}" on your own stores, within the rules you set.` }] },
      }),
    );
  };
  return (
    <Screen id="what-now" fit="grow" className={a.screen} bodyClassName={`l-container ${a.stack}`} label="What now">
      <div className={a.ctaRow}>
        <div className={a.brandCard}>
          <span className={a.brandWatermark} aria-hidden="true">
            <AnarixMark height={150} />
          </span>
          <p className={a.brandName}>
            <AnarixMark height={16} /> {c.cta.lead}
          </p>
          <p className={a.cardD}>{c.cta.blurb}</p>
          <a className={a.mono} href="https://www.anarix.ai">
            see anarix services ↗
          </a>
        </div>
        <form className={a.taskCard} onSubmit={send}>
          <span className={a.panelColor} aria-hidden="true" />
          <p className={a.panelLabel}>{c.cta.label}</p>
          <h2 className={a.taskTitle}>
            <Accent text={c.cta.title} />
          </h2>
          <p className={a.taskLine}>{c.cta.line}</p>
          <div className={a.field}>
            <label className="sr-only" htmlFor="task">
              {c.cta.placeholder}
            </label>
            <input id="task" value={task} onChange={(e) => setTask(e.target.value)} placeholder={c.cta.placeholder} autoComplete="off" />
            <button type="submit">{c.cta.button}</button>
          </div>
        </form>
      </div>
      <ul className={a.status}>
        {c.status.map((s) => (
          <li key={s}>
            <i aria-hidden="true" />
            {s}
          </li>
        ))}
      </ul>
    </Screen>
  );
}

export function AanPage({ page }: { page: ProductPage }) {
  void page;
  return (
    <div className={a.page}>
      <Hero />
      <Connects />
      <Rows />
      <Panel />
      <Careful />
      <Night />
      <Numbers />
      <Plans />
      <Cta />
    </div>
  );
}
