"use client";

import { useEffect, useState } from "react";
import { FeatureSection, MachineStage, usePowered } from "./shared";
import { Gearworks, NeuralBrain, RadarCpu, Refinery } from "../machines/Machines";
import { Live, Spark, Ticker, useSeries } from "@/lib/live";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =============================================================== Signals */
// Modelled on the product's Signal card: value at risk, priority chips,
// What happened / Root cause, business impact, Aan's analysis, action bar.
function SignalsStage() {
  const [ref, powered] = usePowered<HTMLDivElement>();
  return (
    <div ref={ref}>
      <MachineStage machine={<RadarCpu />} label="Signal card from Anarix Signals">
        <article className={`card signal ${powered ? "is-good" : ""}`}>
          <header className="signal__head">
            <span className="pill pill--risk">High</span>
            <span className="pill pill--outline">Advertising</span>
            <span className="pill pill--muted">Amazon · US</span>
            <span className="signal__time">03:12</span>
          </header>
          <div className="signal__value">
            <Live powered={powered} bad={-135.97} good={1651} decimals={0} prefix="$" signed tone="sign" jitter={0.015} />
            <span className="signal__value-k">{powered ? "protected" : "ad sales at risk"}</span>
          </div>
          <h3 className="signal__title">Critical advertising eligibility alert</h3>
          <p className="signal__sub">ASIN B0CSHBTCC6 · Sampler, Decaf 40 Count</p>
          <dl className="signal__why">
            <div>
              <dt>What happened</dt>
              <dd>Ad eligibility lost on Jul 18, the 2nd time in 30 days.</dd>
            </div>
            <div>
              <dt>Root cause</dt>
              <dd>Cost to Amazon is too high for an $18.69 retail price.</dd>
            </div>
          </dl>
          <div className="signal__aan">
            <span className="signal__aan-k">✦ Aan&apos;s analysis</span>
            {powered ? (
              <span className="signal__aan-v">
                Cut unit cost by $1.20 to restore eligibility ·{" "}
                <b>
                  <Live powered={powered} bad={0} good={95} jitter={0.02} suffix="%" />
                </b>{" "}
                confidence
              </span>
            ) : (
              <span className="skel skel--line" />
            )}
          </div>
          <footer className="signal__actions">
            <span className={`btn-ui btn-ui--primary ${powered ? "is-done" : ""}`}>{powered ? "✓ Executed: Analyze listing" : "Execute: Analyze listing"}</span>
            <span className="btn-ui">Modify</span>
            <span className="btn-ui">Assign</span>
          </footer>
        </article>
        <p className="stage__foot">
          <span className="dot-live" /> <Ticker powered={powered} from={1248} rate={4} /> signals watched across 3 marketplaces
        </p>
      </MachineStage>
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
      proof={["Every alert comes with its root cause", "One feed for Amazon, Walmart and Shopify"]}
      media={{ kind: "video", label: "Signals walkthrough" }}
      stage={<SignalsStage />}
    />
  );
}

/* ========================================================= Profitability */
// Modelled on the product's Profitability date cards.
const PROFIT = [
  { k: "GMV", bad: 4521.97, good: 5234.87, prefix: "$", d: 0 },
  { k: "Orders", bad: 28, good: 34, d: 0 },
  { k: "Auth sales", bad: 3842.5, good: 4567.23, prefix: "$", d: 0 },
  { k: "Ad cost", bad: 312.45, good: 287.9, prefix: "$", d: 0 },
  { k: "Units", bad: 45, good: 52, d: 0 },
  { k: "Est. payout", bad: 2890, good: 3450, prefix: "$", d: 0 },
];

function ProfitStage() {
  const [ref, powered] = usePowered<HTMLDivElement>();
  const series = useSeries(powered);
  return (
    <div ref={ref}>
      <MachineStage machine={<Refinery />} label="Profitability date card from Anarix Profitability">
        <article className={`card profit ${powered ? "is-good" : ""}`}>
          <header className="profit__head">
            <span className="profit__date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Nov 05, 2026
            </span>
            <span className="pill pill--muted">Walmart · US</span>
          </header>
          <div className="profit__hero">
            <div>
              <p className="profit__k">Net profit</p>
              <p className="profit__v">
                <Live powered={powered} bad={1246} good={1568} prefix="$" jitter={0.025} />
              </p>
            </div>
            <span className="profit__delta">
              <Live powered={powered} bad={-20.6} good={25.9} decimals={1} suffix="%" signed tone="sign" jitter={0.05} />
            </span>
            <Spark pts={series} className="profit__spark" />
          </div>
          <p className="profit__margin">
            Margin{" "}
            <b>
              <Live powered={powered} bad={27.5} good={30} decimals={1} suffix="%" jitter={0.02} />
            </b>
          </p>
          <dl className="profit__grid">
            {PROFIT.map((m) => (
              <div key={m.k}>
                <dt>{m.k}</dt>
                <dd>
                  <Live powered={powered} bad={m.bad} good={m.good} prefix={m.prefix} decimals={m.d} jitter={0.03} />
                </dd>
              </div>
            ))}
          </dl>
        </article>
        <p className="stage__foot">
          <span className="dot-live" /> Fees, ads and COGS stripped out. Updated daily.
        </p>
      </MachineStage>
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
      proof={["Product-level P&L, updated daily", "Amazon, Walmart and Shopify side by side"]}
      media={{ kind: "image", label: "Profitability dashboard" }}
      stage={<ProfitStage />}
    />
  );
}

/* ================================================================= Rules */
// Modelled on the product's Applied Rules table + "Create Rules with AI".
const RULES = [
  { name: "Auto-Pause Low CTR", type: "Campaign", scope: "22 campaigns", runs: 312 },
  { name: "Budget Cap Protection", type: "Budget", scope: "15 campaigns", runs: 1204 },
  { name: "High ACOS Bid Reducer", type: "Keyword", scope: "142 keywords", runs: 846 },
  { name: "Inventory Sync Rule", type: "Inventory", scope: "189 products", runs: 97 },
];

const LOG = [
  "02:14 · Paused “chef knife 8 inch”. $86 saved.",
  "02:41 · Cut bid 12% on 9 high-ACOS keywords.",
  "03:05 · Capped Spring Sale at 120% of plan.",
  "03:30 · Paused 4 ads on out-of-stock SKUs.",
];

function RulesStage() {
  const [ref, powered] = usePowered<HTMLDivElement>();
  const [log, setLog] = useState(0);
  useEffect(() => {
    if (!powered || reduced()) return;
    const id = window.setInterval(() => setLog((l) => (l + 1) % LOG.length), 2600);
    return () => window.clearInterval(id);
  }, [powered]);
  return (
    <div ref={ref}>
      <MachineStage machine={<Gearworks />} label="Applied Rules table from Anarix Rules">
        <article className={`card rules ${powered ? "is-good" : ""}`}>
          <div className="rules__ai">
            <span className="rules__ai-k">✦ Create rules with AI</span>
            <span className="rules__ai-input">Pause keywords with high ACOS and low conversions</span>
          </div>
          <div className="rules__table" role="table">
            <div className="rules__row rules__row--head" role="row">
              <span role="columnheader">Rule</span>
              <span role="columnheader">Applies to</span>
              <span role="columnheader">Actions</span>
              <span role="columnheader">Status</span>
            </div>
            {RULES.map((r, i) => (
              <div key={r.name} className="rules__row" role="row" style={{ "--i": i } as React.CSSProperties}>
                <span role="cell" className="rules__name">
                  {r.name}
                  <small>{r.type}</small>
                </span>
                <span role="cell" className="rules__scope">
                  {r.scope}
                </span>
                <span role="cell" className="rules__runs">
                  {powered ? <Ticker powered={powered} from={r.runs} rate={2} every={1400 + i * 300} /> : "—"}
                </span>
                <span role="cell">
                  <span className="status">
                    <span className="status__off">Paused</span>
                    <span className="status__on">Active</span>
                  </span>
                </span>
              </div>
            ))}
          </div>
          <p className="rules__log" aria-live="polite">
            <span className="rules__check" aria-hidden="true">
              ✓
            </span>
            <span key={log} className="rules__log-t">
              {powered ? LOG[log] : "No rules running. Nothing is being watched."}
            </span>
          </p>
        </article>
      </MachineStage>
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
      proof={["Describe a rule in plain words", "Every action logged, big moves need approval"]}
      media={{ kind: "video", label: "Building a rule with AI" }}
      stage={<RulesStage />}
    />
  );
}

/* =================================================================== Aan */
// Modelled on the product's Ask Aan chat + morning Brief.
const AWAY = [
  { t: "Reordered inventory on 3 at-risk SKUs", v: "+$6,200", ok: true },
  { t: "Paused spend on an underperforming SKU", v: "+$1,150 saved", ok: true },
  { t: "Price parity violation across the catalog", v: "−$42,600 at risk", ok: false },
];

function AanStage() {
  const [ref, powered] = usePowered<HTMLDivElement>();
  const [phase, setPhase] = useState<"idle" | "asked" | "answer">("idle");

  useEffect(() => {
    const send = (state: string | null) => window.dispatchEvent(new CustomEvent("aan:override", { detail: { stop: "aan", state } }));
    if (!powered) {
      setPhase("idle");
      send(null);
      return;
    }
    if (reduced()) {
      setPhase("answer");
      return;
    }
    setPhase("asked");
    send("bar");
    const a = window.setTimeout(() => send("cube"), 800);
    const b = window.setTimeout(() => {
      setPhase("answer");
      send("circle");
    }, 1700);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [powered]);

  return (
    <div ref={ref}>
      <MachineStage machine={<NeuralBrain />} label="Ask Aan chat from Anarix">
        <article className="card chat">
          {phase === "idle" && <p className="chat__empty">Ask Aan anything about your accounts.</p>}
          {phase !== "idle" && <p className="chat__you">What changed overnight?</p>}
          {phase === "asked" && (
            <p className="chat__thinking">
              <span className="dots">
                <i />
                <i />
                <i />
              </span>
              Reading 3 marketplaces…
            </p>
          )}
          {phase === "answer" && (
            <div className="chat__brief">
              <p className="chat__hello">Good morning. Here&apos;s where things stand.</p>
              <div className="tiles">
                <div className="tile tile--risk">
                  <span>Critical alerts</span>
                  <b>
                    <Live powered={powered} bad={7} good={3} jitter={0} />
                  </b>
                </div>
                <div className="tile tile--risk">
                  <span>At risk</span>
                  <b>
                    <Live powered={powered} bad={-128.4} good={-42.6} decimals={1} prefix="$" suffix="k" jitter={0.03} />
                  </b>
                </div>
                <div className="tile tile--gain">
                  <span>Verified gain</span>
                  <b>
                    <Live powered={powered} bad={0} good={13.3} decimals={1} prefix="$" suffix="k" signed jitter={0.04} />
                  </b>
                </div>
                <div className="tile">
                  <span>Meetings today</span>
                  <b>2</b>
                </div>
              </div>
              <p className="chat__k">While you were away</p>
              <ul className="away">
                {AWAY.map((a, i) => (
                  <li key={a.t} style={{ "--i": i } as React.CSSProperties}>
                    <span className={`away__chip ${a.ok ? "is-ok" : "is-review"}`}>{a.ok ? "Handled" : "Needs review"}</span>
                    <span className="away__t">{a.t}</span>
                    <span className={`away__v ${a.ok ? "is-ok" : "is-review"}`}>{a.v}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="chat__composer">
            <span>Ask Aan anything…</span>
            <span className="chat__send" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
            </span>
          </div>
        </article>
      </MachineStage>
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
      proof={["Knows your account history", "Shows the numbers behind every answer"]}
      media={{ kind: "video", label: "Ask Aan demo" }}
      stage={<AanStage />}
    />
  );
}
