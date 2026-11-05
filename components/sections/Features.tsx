"use client";

import { useEffect, useState } from "react";
import { CountUp, FeatureSection, Station, usePowered } from "./shared";
import { AanMascot } from "../aan/AanMascot";

/* ---------------------------------------------------------------- Signals */
const SIGNALS = [
  { tone: "coral", what: "Sales −18%", item: "Kitchen Knife Set", where: "Amazon", at: "03:12", tag: "Buy Box lost" },
  { tone: "blue", what: "ACoS +9.4 pts", item: "Spring Sale campaign", where: "Walmart", at: "05:40", tag: "Bid war" },
  { tone: "ink", what: "9 days of stock", item: "Bamboo Cutting Board", where: "Shopify", at: "06:05", tag: "Reorder" },
];

function SignalsStation() {
  const [ref, powered] = usePowered<HTMLDivElement>();
  return (
    <div ref={ref}>
      <Station title="Signals" meta="Kitchen Co." dock={{ state: "cube", bubble: "3 changes worth your time." }}>
        <ul className="sig-feed">
          {SIGNALS.map((s, i) => (
            <li key={s.item} className={`sig sig--${s.tone} pw-in`} style={{ "--i": i } as React.CSSProperties}>
              <span className="sig__dot" />
              <span className="sig__main">
                <span className="sig__what">{s.what}</span>
                <span className="sig__item">{s.item}</span>
              </span>
              <span className="sig__tag">{s.tag}</span>
              <span className="sig__meta">
                {s.where} · {s.at}
              </span>
            </li>
          ))}
        </ul>
        <div className="why pw-in" style={{ "--i": 3 } as React.CSSProperties}>
          <p className="why__label">Why it changed</p>
          <p className="why__text">
            A third-party seller undercut you at <b>$24.99</b> at 02:58. Your Buy Box share fell from <b>96%</b> to <b>31%</b>.
          </p>
          <div className="why__actions">
            <span className="chip chip--solid">Match price</span>
            <span className="chip">Raise bid 15%</span>
            <span className="chip">Ignore</span>
          </div>
        </div>
        <p className="station__foot">
          <span>Watching</span> <CountUp to={1248} powered={powered} /> <span>signals across 3 marketplaces</span>
        </p>
      </Station>
    </div>
  );
}

export function SignalsSection() {
  return (
    <FeatureSection
      id="signals"
      eyebrow="Signals"
      title={
        <>
          3am change.
          <br />
          9am answer.
        </>
      }
      body="What moved, why, and what to do. Across every account."
      bullets={["Spend, sales, rank, price and stock, watched 24/7", "Every alert comes with its cause", "One feed for Amazon, Walmart and Shopify"]}
      media={{ kind: "video", label: "Signals walkthrough" }}
      station={<SignalsStation />}
    />
  );
}

/* ---------------------------------------------------------- Profitability */
const WATERFALL = [
  { k: "Sales", v: 225400, kind: "pos" },
  { k: "Fees", v: -61300, kind: "neg" },
  { k: "Ads", v: -38100, kind: "neg" },
  { k: "COGS", v: -71000, kind: "neg" },
  { k: "Returns", v: -6790, kind: "neg" },
  { k: "Profit", v: 48210, kind: "total" },
];

function ProfitStation() {
  const [ref, powered] = usePowered<HTMLDivElement>();
  const max = 225400;
  let run = 0;
  return (
    <div ref={ref}>
      <Station title="Profitability" meta="Last 30 days" dock={{ state: "cube", bubble: "Profit is up 8.4% this week." }}>
        <div className="kpis">
          <div className="kpi pw-in" style={{ "--i": 0 } as React.CSSProperties}>
            <span className="kpi__label">Net profit</span>
            <span className="kpi__value">
              <CountUp to={48210} prefix="$" powered={powered} />
            </span>
            <span className="kpi__delta kpi__delta--up">+8.4%</span>
          </div>
          <div className="kpi pw-in" style={{ "--i": 1 } as React.CSSProperties}>
            <span className="kpi__label">Margin</span>
            <span className="kpi__value">
              <CountUp to={21.4} decimals={1} suffix="%" powered={powered} />
            </span>
            <span className="kpi__delta kpi__delta--up">+1.9 pts</span>
          </div>
          <div className="kpi pw-in" style={{ "--i": 2 } as React.CSSProperties}>
            <span className="kpi__label">TACoS</span>
            <span className="kpi__value">
              <CountUp to={8.2} decimals={1} suffix="%" powered={powered} />
            </span>
            <span className="kpi__delta kpi__delta--down">−0.6 pts</span>
          </div>
        </div>
        <div className="fall" role="img" aria-label="Profit waterfall: sales $225,400 minus fees, ads, COGS and returns leaves $48,210 profit">
          {WATERFALL.map((w, i) => {
            const start = w.kind === "total" ? 0 : w.kind === "pos" ? 0 : run + w.v;
            const len = Math.abs(w.v);
            if (w.kind === "pos") run = w.v;
            else if (w.kind === "neg") run += w.v;
            return (
              <div key={w.k} className={`fall__row fall__row--${w.kind}`} style={{ "--i": i } as React.CSSProperties}>
                <span className="fall__k">{w.k}</span>
                <span className="fall__track">
                  <span
                    className="fall__bar"
                    style={{ left: `${(start / max) * 100}%`, width: `${(len / max) * 100}%` } as React.CSSProperties}
                  />
                </span>
                <span className="fall__v">
                  {w.v < 0 ? "−" : ""}${Math.abs(w.v / 1000).toFixed(1)}k
                </span>
              </div>
            );
          })}
        </div>
        <svg className="spark" viewBox="0 0 400 70" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,58 C30,56 50,50 80,52 S130,40 160,42 S210,30 240,34 S300,18 330,20 S380,8 400,6" className="spark__line" />
          <path d="M0,58 C30,56 50,50 80,52 S130,40 160,42 S210,30 240,34 S300,18 330,20 S380,8 400,6 V70 H0Z" className="spark__area" />
        </svg>
      </Station>
    </div>
  );
}

export function ProfitSection() {
  return (
    <FeatureSection
      id="profitability"
      reverse
      eyebrow="Profitability"
      title={
        <>
          Revenue lies.
          <br />
          Profit doesn&apos;t.
        </>
      }
      body="Every fee, ad dollar and return. One P&L."
      bullets={["Product-level P&L, updated daily", "Fees, ads, returns and COGS included", "Amazon, Walmart and Shopify side by side"]}
      media={{ kind: "image", label: "Profit dashboard" }}
      station={<ProfitStation />}
    />
  );
}

/* ------------------------------------------------------------------ Rules */
const RULES = [
  { name: "Pause keywords with $50+ spend and 0 sales", scope: "All campaigns", runs: "Hourly" },
  { name: "Cap daily budget at 120% of plan", scope: "Walmart", runs: "Every 15 min" },
  { name: "Match price if undercut by less than 5%", scope: "Top 40 SKUs", runs: "Live" },
  { name: "Ask me before any change over $500", scope: "Everything", runs: "Approval" },
];

function RulesStation() {
  const [ref] = usePowered<HTMLDivElement>();
  return (
    <div ref={ref}>
      <Station title="Rules" meta="12 active" dock={{ state: "cube", bubble: "12 rules running. All quiet." }}>
        <ul className="rules">
          {RULES.map((r, i) => (
            <li key={r.name} className="rule" style={{ "--i": i } as React.CSSProperties}>
              <span className="toggle" aria-hidden="true">
                <span className="toggle__knob" />
              </span>
              <span className="rule__main">
                <span className="rule__name">{r.name}</span>
                <span className="rule__meta">
                  {r.scope} · {r.runs}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <div className="log pw-in" style={{ "--i": 5 } as React.CSSProperties}>
          <span className="log__check" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span className="log__text">
            <b>02:14</b> Paused &ldquo;chef knife 8 inch&rdquo;. $86 spent, 0 sales.
          </span>
        </div>
      </Station>
    </div>
  );
}

export function RulesSection() {
  return (
    <FeatureSection
      id="rules"
      eyebrow="Rules"
      title={
        <>
          Your playbook.
          <br />
          On autopilot.
        </>
      }
      body="Pause waste. Guard budgets. Answer price moves. 24/7."
      bullets={["Start from templates or write your own", "Every action logged, every time", "Approval mode for the big moves"]}
      media={{ kind: "video", label: "Building a rule" }}
      station={<RulesStation />}
    />
  );
}

/* -------------------------------------------------------------------- Aan */
const QUESTION = "Why did ROAS drop on Walmart last week?";

function AanStation() {
  const [ref, powered] = usePowered<HTMLDivElement>();
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<"idle" | "typing" | "loading" | "thinking" | "answer">("idle");

  useEffect(() => {
    const send = (state: string | null) =>
      window.dispatchEvent(new CustomEvent("aan:override", { detail: { stop: "aan", state } }));
    if (!powered) {
      setTyped(0);
      setPhase("idle");
      send(null);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(QUESTION.length);
      setPhase("answer");
      return;
    }
    const timers: number[] = [];
    setPhase("typing");
    send("circle"); // listening while you type
    for (let k = 1; k <= QUESTION.length; k++) timers.push(window.setTimeout(() => setTyped(k), 300 + k * 28));
    const sent = 300 + QUESTION.length * 28 + 250;
    timers.push(window.setTimeout(() => (setPhase("loading"), send("bar")), sent));
    timers.push(window.setTimeout(() => (setPhase("thinking"), send("cube")), sent + 900));
    timers.push(window.setTimeout(() => (setPhase("answer"), send("circle")), sent + 1900));
    return () => timers.forEach(clearTimeout);
  }, [powered]);

  const status =
    phase === "loading" ? "Reading 7 days of Walmart data…" : phase === "thinking" ? "Comparing campaigns…" : phase === "answer" ? "Answered in 2.1s" : "Listening";

  return (
    <div ref={ref}>
      <Station title="Ask Aan" meta="Walmart" dark dock={{ state: "circle", bubble: "Ask me anything.", size: 64 }}>
        <div className="chat">
          <div className="chat__status">
            <span className={`chat__pulse chat__pulse--${phase}`} />
            {status}
          </div>
          {phase !== "idle" && (
            <p className="chat__msg chat__msg--you">
              {QUESTION.slice(0, typed)}
              {phase === "typing" && <span className="caret" />}
            </p>
          )}
          {(phase === "loading" || phase === "thinking") && (
            <div className="chat__msg chat__msg--aan chat__msg--wait">
              <AanMascot state={phase === "loading" ? "bar" : "cube"} size={22} satellite={false} glow={false} shadow={false} />
              <span className="dots">
                <i />
                <i />
                <i />
              </span>
            </div>
          )}
          {phase === "answer" && (
            <>
              <div className="chat__msg chat__msg--aan chat__answer">
                <p>
                  ROAS fell from <b>4.1</b> to <b>3.2</b>. Two causes:
                </p>
                <ol>
                  <li>&ldquo;Spring Sale&rdquo; lost 38% of impressions to a new competitor.</li>
                  <li>CPC rose 22% on &ldquo;bamboo cutting board&rdquo;.</li>
                </ol>
                <p>Moving $400/day to Sponsored Brands should win back about 0.5 ROAS.</p>
              </div>
              <div className="report">
                <span className="report__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 3v18h18" />
                    <path d="m7 15 4-4 3 3 5-6" />
                  </svg>
                </span>
                <span className="report__main">
                  <span className="report__title">Walmart ROAS review</span>
                  <span className="report__meta">7 days · 4 charts · 2 actions</span>
                </span>
                <span className="chip chip--solid">Open report</span>
              </div>
            </>
          )}
          <div className="chat__input">
            <span>Ask Aan anything…</span>
            <span className="chat__send" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Station>
    </div>
  );
}

export function AanSection() {
  return (
    <FeatureSection
      id="aan"
      dark
      reverse
      eyebrow="Aan · Anarix Analytical Neural"
      title={
        <>
          Ask anything.
          <br />
          Get the why.
        </>
      }
      body="Plain answers. Real numbers. Reports in seconds."
      bullets={["Knows your account history", "Shows the numbers behind every answer", "Turns one question into a full report"]}
      media={{ kind: "video", label: "Ask Aan demo" }}
      station={<AanStation />}
    />
  );
}
