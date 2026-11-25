"use client";

import type { CSSProperties, ReactNode } from "react";
import { AanMascot } from "@/components/aan/AanMascot";
import {
  ALERTS,
  BRIEF,
  CAMPAIGNS,
  CHAT,
  KPIS,
  MCP,
  MEETING,
  NOTES,
  PROFIT,
  RULE,
  STORY,
  TASK,
  TODAY,
  type Priority,
  type SampleAlert,
  type Source,
  type Status,
} from "@/content/app-samples";
import u from "./app-ui.module.css";

/*
  The Anarix app's own UI, recreated close to the real thing (the merged
  revamp app) for product mockups. Each piece is one element of a real
  screen, never a whole page. All of it is decoration for the copy beside
  it (aria-hidden at the use site), sized in em from --app-fs, and coloured
  by the theme-following --app-* tokens.
*/

/* ----------------------------------------------------------------- icons */
const P = {
  check: "M3.5 8.5l3 3 6-7",
  chev: "M4 6l4 4 4-4",
  mail: "M2.5 4.5h11v7h-11z M2.5 4.5l5.5 4 5.5-4",
  chat: "M3 3.5h10v7H7l-3 2.5v-2.5H3z",
  cal: "M3 4h10v9H3z M3 7h10 M6 2.5v3 M10 2.5v3",
  bolt: "M9 2L4 9h4l-1 5 5-7H8z",
  user: "M8 8a2.6 2.6 0 100-5.2A2.6 2.6 0 008 8z M3 13.5c.6-2.4 2.6-3.6 5-3.6s4.4 1.2 5 3.6",
  dots: "M4 8h.01 M8 8h.01 M12 8h.01",
  bell: "M4 11V7.5a4 4 0 018 0V11l1 1.2H3z M6.6 13.6a1.5 1.5 0 002.8 0",
  mega: "M3 7v2.5l7 3V4z M10 5.5l3-1.5v8l-3-1.5 M5 9.8l.8 3",
  atom: "M8 8m-1 0a1 1 0 102 0 1 1 0 10-2 0 M2.5 8c0-1.7 2.5-3 5.5-3s5.5 1.3 5.5 3-2.5 3-5.5 3-5.5-1.3-5.5-3z",
  bars: "M3 13V8 M8 13V3 M13 13V6",
  coin: "M8 8m-5 0a5 5 0 1010 0 5 5 0 10-10 0 M8 5.5v5 M6.5 7h2.3a1 1 0 010 2H7",
  send: "M3 8l10-5-4 10-1.5-4z",
  play: "M5.5 3.5l7 4.5-7 4.5z",
  share: "M10.5 4.5l-5 3 5 3 M11.5 3.5a1 1 0 100 .01 M11.5 11.5a1 1 0 100 .01",
};
export function Icon({ d, className }: { d: keyof typeof P; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`${u.ico} ${className ?? ""}`} aria-hidden="true">
      <path d={P[d]} />
    </svg>
  );
}

/* -------------------------------------------------------------- formats */
const MINUS = "−";
export function money(v: number, compact = false) {
  const sign = v < 0 ? MINUS : "+";
  const a = Math.abs(v);
  if (compact && a >= 1000) return `${sign}$${(a / 1000).toFixed(2)}K`;
  return `${sign}$${a.toLocaleString("en-US")}`;
}
export const usd = (v: number) => `$${v.toLocaleString("en-US")}`;

/* ---------------------------------------------------------------- atoms */
export function Ui({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`${u.ui} ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
}

export function Card({ title, meta, icon, sample, children, className, flush }: { title?: ReactNode; meta?: ReactNode; icon?: keyof typeof P; sample?: string | false; children: ReactNode; className?: string; flush?: boolean }) {
  return (
    <div className={`${u.card} ${className ?? ""}`}>
      {title && (
        <div className={u.cardHead}>
          <span className={u.cardTitle}>
            {icon && (
              <span className={u.iconTile}>
                <Icon d={icon} />
              </span>
            )}
            {title}
          </span>
          {meta && <span className={u.cardMeta}>{meta}</span>}
        </div>
      )}
      {flush ? children : <div className={u.cardBody}>{children}</div>}
      {sample !== false && <span className={u.sample}>{sample ?? "Sample data"}</span>}
    </div>
  );
}

export const PriorityPill = ({ p }: { p: Priority }) => (p === "Low" ? null : <span className={u.prio} data-p={p}>{p}</span>);
export const CategoryPill = ({ c }: { c: string }) => <span className={u.cat}>{c}</span>;
export const MarketChip = ({ m }: { m: string }) => (
  <span className={u.market}>
    <i aria-hidden="true" />
    {m}
  </span>
);
const SRC: Record<Source, keyof typeof P> = { email: "mail", slack: "chat", meeting: "cal", anarix: "bolt" };
export const SourceDots = ({ s }: { s: Source[] }) => (
  <span className={u.sources}>
    {s.map((x) => (
      <span key={x}>
        <Icon d={SRC[x]} />
      </span>
    ))}
  </span>
);
export function StatusTag({ s }: { s: Status }) {
  return (
    <span className={u.status} data-s={s}>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        {s === "In progress" && <path d="M8 2a6 6 0 010 12z" fill="currentColor" />}
        {s === "Done" && (
          <>
            <circle cx="8" cy="8" r="6" fill="currentColor" />
            <path d="M5.2 8.2l1.9 1.9 3.6-3.9" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
      {s}
    </span>
  );
}
export function BadgeStrip({ a, time = true }: { a: Pick<SampleAlert, "priority" | "category" | "market" | "sources" | "time">; time?: boolean }) {
  return (
    <div className={u.strip}>
      <PriorityPill p={a.priority} />
      <CategoryPill c={a.category} />
      <span className={u.bar} />
      <MarketChip m={a.market} />
      {a.sources.some((x) => x !== "anarix") && (
        <>
          <span className={u.bar} />
          <SourceDots s={a.sources.filter((x) => x !== "anarix")} />
        </>
      )}
      {time && <span className={u.time}>{a.time}</span>}
    </div>
  );
}
export function Pill({ children, tone }: { children: ReactNode; tone?: "gain" | "risk" | "warn" | "primary" }) {
  return (
    <span className={u.pill} data-tone={tone}>
      {children}
    </span>
  );
}
export const Spark = () => <span className={u.spark}>✦</span>;

/* --------------------------------------------------------------- signals */
export function AlertRow({ a = ALERTS[0], selected = false }: { a?: SampleAlert; selected?: boolean }) {
  const [n, unit] = a.impact.split(" · ");
  return (
    <div className={u.alert} data-selected={selected} data-done={a.status === "Done"}>
      <div className={u.alertTop}>
        <StatusTag s={a.status} />
        <span className={u.alertTools}>
          <Icon d="user" />
          <Icon d="dots" />
        </span>
      </div>
      <span className={`${u.value} ${a.value < 0 ? u.risk : u.gain}`}>{money(a.value, true)}</span>
      <span className={u.impact}>
        {n} · <b>{unit}</b>
        {a.actioned && <span className={u.gain}> · {a.actioned}</span>}
      </span>
      <span className={u.alertTitle}>{a.title}</span>
      <BadgeStrip a={a} />
    </div>
  );
}

export function DayBand({ label = "Today", count = "43 alerts" }: { label?: string; count?: string }) {
  return (
    <div className={u.band}>
      <span>{label}</span>
      <span>{count}</span>
    </div>
  );
}

export function AanAnalysis({ why = STORY.alert.why, root = STORY.alert.root }: { why?: string; root?: string }) {
  return (
    <div className={u.analysis}>
      <span className={u.label}>
        <span className={u.spark}>✦</span> Aan&apos;s analysis
      </span>
      <p>
        {why} {root}
      </p>
    </div>
  );
}

export function SuggestedActions({ pick = 0, compact = false }: { pick?: number; compact?: boolean }) {
  const opts = compact ? STORY.options.slice(0, 2) : STORY.options;
  return (
    <div className={u.actions}>
      <div className={u.actionsHead}>Suggested actions</div>
      {opts.map((o, i) => (
        <div className={u.option} key={o.label} data-on={i === pick}>
          <span className={u.radio} />
          <div>
            <div className={u.optionLabel}>
              {o.label}
              {"recommended" in o && o.recommended && (
                <span className={u.aanPill}>
                  <span>✦</span> Aan recommends
                </span>
              )}
            </div>
            {"est" in o && (
              <div className={u.optionNote}>
                Est. <b>{o.est}</b> · {o.confidence}% confidence
              </div>
            )}
            {"meeting" in o && <div className={u.optionLink}>Choose action type →</div>}
          </div>
        </div>
      ))}
      <div className={u.actionsFoot}>
        <span className={u.btn}>
          <Icon d="check" /> Execute
        </span>
        <span className={u.btnLine}>Dismiss</span>
      </div>
    </div>
  );
}

/** the alert detail panel: header, value, Aan's analysis and the actions */
export function AlertDetail({ compact = false }: { compact?: boolean }) {
  const a = STORY.alert;
  return (
    <div className={u.card}>
      <div className={u.detailHead}>
        <BadgeStrip a={a} />
        <h4 className={u.detailTitle}>{a.title}</h4>
        {!compact && <p className={u.detailSub}>{a.subheader}</p>}
        <span className={`${u.detailValue} ${u.risk}`}>
          {money(a.value)}
          <small>
            {a.impact} · {a.items} ASINs
          </small>
        </span>
      </div>
      <AanAnalysis />
      <SuggestedActions compact={compact} />
    </div>
  );
}

export function AffectedItems({ rows = 4 }: { rows?: number }) {
  return (
    <Card title="Affected items" meta={`${STORY.alert.items} items`} flush>
      <div className={u.picker}>
        {STORY.products.slice(0, rows).map((p) => (
          <div className={u.pickRow} key={p.asin} style={{ gridTemplateColumns: "2.4em minmax(0,1fr) auto" }}>
            <span className={u.thumb} />
            <span className={u.pickName}>
              {p.name}
              <small>ASIN {p.asin}</small>
            </span>
            <b className={p.impact < 0 ? u.risk : u.gain}>{money(p.impact)}</b>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ItemPicker() {
  const on = [true, true, true, false, true, true];
  return (
    <Card title={`Choose items · ${STORY.action}`} meta="Showing 6 of 14" flush sample={false}>
      <div className={u.picker}>
        {STORY.products.map((p, i) => (
          <div className={u.pickRow} key={p.asin}>
            <span className={u.tick} data-on={on[i]}>
              {on[i] && <Icon d="check" />}
            </span>
            <span className={u.thumb} />
            <span className={u.pickName}>
              {p.name}
              <small>ASIN {p.asin}</small>
            </span>
            <b className={p.impact < 0 ? u.risk : u.gain}>{money(p.impact)}</b>
          </div>
        ))}
      </div>
      <div className={u.pickFoot}>
        <span>
          <b>{STORY.picked} of 14 selected</b> · The other 5 stay open for a different action.
        </span>
        <span className={u.btn}>Execute on {STORY.picked} items</span>
      </div>
      <span className={u.sample} style={{ paddingTop: "0.85em" }}>
        Sample data
      </span>
    </Card>
  );
}

export function BatchStrip({ done = false, pct = 62 }: { done?: boolean; pct?: number }) {
  return (
    <div className={u.batch}>
      {done ? (
        <div className={u.batchTop}>
          <span className={u.batchDone}>
            <Icon d="check" />
            <span>
              <b>{STORY.action}</b> applied to {STORY.picked} items. Pick an action for the 5 left.
            </span>
          </span>
          <span className={u.undo}>Undo</span>
        </div>
      ) : (
        <>
          <div className={u.batchTop}>
            <span>
              Applying <b>{STORY.action}</b> to {STORY.picked} items… {pct}%
            </span>
            <span className={u.undo}>Undo</span>
          </div>
          <div className={u.progress}>
            <span style={{ width: `${pct}%` }} />
          </div>
        </>
      )}
    </div>
  );
}

export function ImpactReport() {
  const r = STORY.report;
  return (
    <div className={u.card}>
      <div className={u.report}>
        <span className={u.verified}>
          <i /> Verified over 7 days on conversion
        </span>
        <p className={`${u.recovered} ${u.gain}`}>Recovered {usd(r.recovered)}</p>
        <table className={u.table}>
          <thead>
            <tr>
              <th>Metric</th>
              <th className={u.num}>Before</th>
              <th className={u.num}>After</th>
              <th className={u.num}>Change</th>
            </tr>
          </thead>
          <tbody>
            {r.rows.map((x) => (
              <tr key={x.metric}>
                <td>{x.metric}</td>
                <td className={u.num}>{x.before}</td>
                <td className={u.num}>{x.after}</td>
                <td className={`${u.num} ${u.gain}`}>{x.change}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <span className={u.sample}>Sample data</span>
    </div>
  );
}

/* -------------------------------------------------------------- platform */
export function KpiStrip({ count = 5 }: { count?: number }) {
  return (
    <div className={u.kpis} style={{ "--n": count } as CSSProperties}>
      {KPIS.slice(0, count).map((k) => (
        <div className={u.kpi} data-tone={k.tone} key={k.k}>
          <span className={u.kpiK}>{k.k}</span>
          <span className={u.kpiV}>{k.v}</span>
          <span className={u.delta} data-up={k.up}>
            ↑ {k.d}
          </span>
        </div>
      ))}
    </div>
  );
}

export function KpiCell({ k, v, d, up = true, tone = "primary" }: { k: string; v: string; d: string; up?: boolean; tone?: string }) {
  return (
    <div className={u.kpis} style={{ "--n": 1 } as CSSProperties}>
      <div className={u.kpi} data-tone={tone}>
        <span className={u.kpiK}>{k}</span>
        <span className={u.kpiV}>{v}</span>
        <span className={u.delta} data-up={up}>
          {up ? "↑" : "↓"} {d}
        </span>
      </div>
    </div>
  );
}

const STATUS_TONE: Record<string, "gain" | "warn" | undefined> = { Live: "gain", "Out of budget": "warn" };
export function PulseTable({ rows = 4, compact = false }: { rows?: number; compact?: boolean }) {
  const t = CAMPAIGNS.total;
  if (compact)
    return (
      <div className={u.pulse}>
        <table>
          <thead>
            <tr>
              <th>Campaign</th>
              <th className={u.num}>Spend</th>
              <th className={u.num}>ROAS</th>
            </tr>
            <tr className={u.totals}>
              <td>
                <small>{t.label}</small>
              </td>
              <td className={u.num}>{t.spend}</td>
              <td className={u.num}>{t.roas}</td>
            </tr>
          </thead>
          <tbody>
            {CAMPAIGNS.rows.slice(0, rows).map((r, i) => (
              <tr key={r.name} className={i === 1 ? u.hover : undefined}>
                <td>
                  <span className={u.cellName}>{r.name}</span>
                  <Pill tone={STATUS_TONE[r.status]}>{r.status}</Pill>
                </td>
                <td className={u.num}>{r.spend}</td>
                <td className={u.num}>{r.roas}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <span className={u.sample} style={{ paddingTop: "0.7em" }}>
          Sample data
        </span>
      </div>
    );
  return (
    <div className={u.pulse}>
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Campaign</th>
            <th className={u.num}>Spend</th>
            <th className={u.num}>Sales</th>
            <th className={u.num}>ROAS</th>
            <th className={u.num}>ACOS</th>
          </tr>
          <tr className={u.totals}>
            <td />
            <td>
              <small>{t.label}</small>
            </td>
            <td className={u.num}>{t.spend}</td>
            <td className={u.num}>{t.sales}</td>
            <td className={u.num}>{t.roas}</td>
            <td className={u.num}>{t.acos}</td>
          </tr>
        </thead>
        <tbody>
          {CAMPAIGNS.rows.slice(0, rows).map((r, i) => (
            <tr key={r.name} className={i === 1 ? u.hover : undefined}>
              <td>
                <Pill tone={STATUS_TONE[r.status]}>{r.status}</Pill>
              </td>
              <td>{r.name}</td>
              <td className={u.num}>{r.spend}</td>
              <td className={u.num}>{r.sales}</td>
              <td className={u.num}>{r.roas}</td>
              <td className={u.num}>{r.acos}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <span className={u.sample} style={{ paddingTop: "0.7em" }}>
        Sample data
      </span>
    </div>
  );
}

type Series = { label: string; color: string; values: number[]; area?: boolean };
/** the app's chart: dashed horizontal grid, monotone lines, legend under */
export function MiniChart({ series, labels, height = 120, bars = false }: { series: Series[]; labels: string[]; height?: number; bars?: boolean }) {
  const W = 320;
  const H = height;
  const pad = { l: 6, r: 6, t: 8, b: 18 };
  const n = labels.length;
  const x = (i: number) => pad.l + (i / Math.max(1, n - 1)) * (W - pad.l - pad.r);
  const scale = (vals: number[]) => {
    const mx = Math.max(...vals) * 1.1;
    const mn = Math.min(0, Math.min(...vals) * 0.9);
    return (v: number) => pad.t + (1 - (v - mn) / (mx - mn)) * (H - pad.t - pad.b);
  };
  return (
    <div className={u.chart}>
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {[0, 1, 2, 3].map((g) => {
          const yy = pad.t + (g / 3) * (H - pad.t - pad.b);
          return <line key={g} x1={pad.l} x2={W - pad.r} y1={yy} y2={yy} className={u.grid} />;
        })}
        {series.map((s, si) => {
          const y = scale(s.values);
          if (bars) {
            const bw = Math.min(14, (W - pad.l - pad.r) / n / 2.2);
            return s.values.map((v, i) => (
              <rect key={`${si}-${i}`} x={x(i) - bw / 2 + si * (bw + 2) - (series.length - 1) * (bw / 2)} y={y(v)} width={bw} height={H - pad.b - y(v)} rx="2.5" fill={s.color} />
            ));
          }
          const d = s.values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
          return (
            <g key={s.label}>
              {s.area && <path d={`${d} L${x(n - 1).toFixed(1)},${H - pad.b} L${x(0).toFixed(1)},${H - pad.b} Z`} fill={s.color} opacity="0.14" />}
              <path d={d} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            </g>
          );
        })}
        {labels.map((l, i) => (
          <text key={l} x={x(i)} y={H - 4} textAnchor="middle" className={u.axis}>
            {l}
          </text>
        ))}
      </svg>
      <div className={u.legend}>
        {series.map((s) => (
          <span key={s.label}>
            <i style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProfitNugget({ chart = false }: { chart?: boolean }) {
  const max = PROFIT.sales;
  return (
    <div className={u.nugget}>
      <div className={u.nuggetHead}>
        <span className={u.iconTile}>
          <Icon d="coin" />
        </span>
        <div>
          <div className={u.nuggetTitle}>Net profit</div>
          <div className={u.nuggetScope}>
            {usd(PROFIT.net)} net · {PROFIT.margin} margin · 30 days
          </div>
        </div>
        <Icon d="dots" className={u.faint} />
      </div>
      <div className={u.stats} style={{ "--n": 3 } as CSSProperties}>
        <div>
          <small>Net profit</small>
          <b className={u.gain}>{usd(PROFIT.net)}</b>
        </div>
        <div>
          <small>Margin</small>
          <b>{PROFIT.margin}</b>
        </div>
        <div>
          <small>Vs prior 30 days</small>
          <b className={u.gain}>{PROFIT.vs}</b>
        </div>
      </div>
      <div className={u.shares}>
        {PROFIT.parts.map((p) => (
          <div className={u.share} data-tone={p.tone} key={p.k}>
            <span>{p.k}</span>
            <b>{usd(p.v)}</b>
            <span className={u.shareBar}>
              <span style={{ width: `${(p.v / max) * 100}%` }} />
            </span>
          </div>
        ))}
      </div>
      {chart && <MiniChart series={[{ label: "Net profit by week", color: "#4A64D9", values: PROFIT.weeks, area: true }]} labels={["Wk 1", "Wk 2", "Wk 3", "Wk 4"]} height={96} />}
      <span className={u.sample} style={{ padding: 0 }}>
        Sample data
      </span>
    </div>
  );
}

export function PeriodRow() {
  return (
    <div className={u.period}>
      <div className={u.periodHead}>
        <span>Today</span>
        <span>Net profit {TODAY.net}</span>
      </div>
      <div className={u.periodCells}>
        <div>
          <small>GMV</small>
          <b>{TODAY.gmv}</b>
        </div>
        <div>
          <small>Orders | Units</small>
          <b>
            {TODAY.orders} | {TODAY.units}
          </b>
        </div>
        <div>
          <small>Ad cost</small>
          <b>{TODAY.adCost}</b>
        </div>
        <div>
          <small>Net profit</small>
          <b className={u.gain}>{TODAY.net}</b>
        </div>
      </div>
    </div>
  );
}

const Sel = ({ v }: { v: string }) => (
  <span className={u.select}>
    <span>{v}</span>
    <Icon d="chev" />
  </span>
);
export function RuleCriteria() {
  return (
    <div className={u.criteria}>
      <div className={u.criteriaHead}>
        <span className={u.prioBadge}>1</span>
        Criteria 1 · {RULE.name}
      </div>
      {RULE.criteria.map((c) => (
        <div className={`${u.cond} ${c.k === "THEN" ? u.then : ""}`} key={c.k}>
          <span>{c.k}</span>
          {c.parts.map((p) => (
            <Sel key={p} v={p} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function AppliedRules({ rows = 3 }: { rows?: number }) {
  return (
    <Card title="Applied rules" meta="3 rules" flush>
      {RULE.applied.slice(0, rows).map((r) => (
        <div className={u.ruleRow} key={r.name}>
          <b>{r.name}</b>
          <span className={u.switch} data-on={r.on}>
            <i />
          </span>
          <small>
            {r.kind} · {r.scope} · {r.freq}
          </small>
        </div>
      ))}
    </Card>
  );
}

export function AanChat({ chart = true, head = true, input = true }: { chart?: boolean; head?: boolean; input?: boolean }) {
  return (
    <div className={u.chat}>
      {head && (
        <div className={u.chatHead}>
          <AanMascot state="diamond" size={22} glow={false} shadow={false} />
          Ask Aan
          <small>Context: Campaign Manager</small>
        </div>
      )}
      <div className={u.me}>{CHAT.ask}</div>
      <div className={u.aanMsg}>
        <AanMascot state="diamond" size={20} glow={false} shadow={false} />
        <div className={u.aanBubble}>
          {CHAT.answer.map((line, i) => (
            <p key={i}>
              {line.map((part, j) => (j % 2 ? <b key={j}>{part}</b> : <span key={j}>{part}</span>))}
            </p>
          ))}
          {chart && (
            <MiniChart
              series={[
                { label: "Ad spend", color: "#4A64D9", values: CHAT.spend, area: true },
                { label: "ROAS", color: "#F29E0D", values: CHAT.roas.map((r) => r * 480) },
              ]}
              labels={CHAT.days}
              height={92}
            />
          )}
        </div>
      </div>
      <div className={u.chips}>
        {CHAT.suggestions.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      {input && (
        <div className={u.input}>
          Ask Aan anything…
          <span className={u.send}>
            <Icon d="send" />
          </span>
        </div>
      )}
    </div>
  );
}

const NOTE_ICON: Record<string, keyof typeof P> = { campaign: "mega", rule: "atom", report: "bars" };
export function NotificationRow({ i = 0 }: { i?: number }) {
  const n = NOTES[i];
  return (
    <div className={u.note}>
      <span className={u.iconTile}>
        <Icon d={NOTE_ICON[n.kind]} />
      </span>
      <div>
        <div className={u.noteTitle}>{n.title}</div>
        {"detail" in n && n.detail && <div className={u.noteDetail}>{n.detail}</div>}
        {"cta" in n && n.cta && <span className={u.noteCta}>{n.cta} →</span>}
      </div>
      <span className={u.noteTime}>{n.t}</span>
    </div>
  );
}

export function McpCard() {
  return (
    <Card title="Claude · connected to Anarix MCP" icon="bolt" flush sample="Illustrative">
      <div className={u.term}>
        <span className={u.q}>{MCP.ask}</span>
        <span className={u.tool}>{MCP.tool}</span>
        <span className={u.a}>{MCP.answer}</span>
        <span className={u.q}>{MCP.ask2}</span>
        <span className={u.tool}>{MCP.tool2}</span>
        <span className={u.a}>{MCP.answer2}</span>
      </div>
    </Card>
  );
}

/* ----------------------------------------------------------------- brief */
export function ValueAtRisk() {
  const r = BRIEF.risk;
  const max = r.rows[0].v;
  return (
    <Card title="Value at risk" icon="coin" meta="Today">
      <div style={{ display: "grid", gap: "0.9em" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.6em", flexWrap: "wrap" }}>
          <span className={`${u.big} ${u.risk}`}>{r.total}</span>
          <Pill tone="gain">{r.delta}</Pill>
        </div>
        <span className={u.dim} style={{ fontSize: "0.9em" }}>
          {r.alerts} alerts today
        </span>
        <div className={u.shares}>
          {r.rows.map((x) => (
            <div className={u.share} key={x.k}>
              <span>{x.k}</span>
              <b>${x.v}K</b>
              <span className={u.shareBar}>
                <span style={{ width: `${(x.v / max) * 100}%`, background: "var(--app-risk)", opacity: 0.75 }} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function OpportunityValue() {
  return (
    <Card title="Opportunity value" icon="bars" meta="Today">
      <span className={`${u.big} ${u.gain}`}>{BRIEF.opportunity.total}</span>
      <div className={u.dim} style={{ fontSize: "0.9em", marginTop: "0.5em" }}>
        across {BRIEF.opportunity.alerts} alerts
      </div>
    </Card>
  );
}

export function AwayRail() {
  return (
    <Card title="While you were away" icon="bell" meta="Last night">
      <div className={u.rail}>
        {BRIEF.away.map((a) => (
          <div className={u.railRow} key={a.t}>
            <time>{a.t}</time>
            <span className={u.railDot} />
            <span>
              {a.title}
              <small>
                <span className={u.prio} data-p="High" style={{ fontSize: "0.82em", padding: "0.1em 0.45em" }}>
                  High
                </span>{" "}
                {a.cat}
              </small>
            </span>
            <b className={u.risk}>{a.v}</b>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function Messages() {
  return (
    <Card title="Important messages" icon="mail" meta="2 new">
      {BRIEF.messages.map((m) => (
        <div className={u.msg} key={m.t}>
          <span className={u.avatar}>{m.from.slice(0, 2)}</span>
          <span>
            <b>{m.from}</b> <span className={u.faint}>· {m.via}</span>
            <small>{m.text}</small>
          </span>
          <span className={u.noteTime}>{m.t}</span>
        </div>
      ))}
    </Card>
  );
}

export function MeetingCard() {
  const m = BRIEF.meeting;
  return (
    <Card title="Upcoming meetings" icon="cal">
      <div className={u.prep}>
        <b>{m.title}</b>
        <span className={u.dim} style={{ fontSize: "0.88em" }}>
          {m.when} · {m.alerts} open alerts
        </span>
        <span style={{ fontSize: "0.85em" }}>
          Prep {m.prep[0]}/{m.prep[1]} tasks done
        </span>
        <span className={u.progress}>
          <span style={{ width: `${(m.prep[0] / m.prep[1]) * 100}%` }} />
        </span>
      </div>
    </Card>
  );
}

export function MeetingPrep() {
  return (
    <Card title={MEETING.title} icon="cal" meta={MEETING.when}>
      <div style={{ display: "grid", gap: "1.1em" }}>
        <div className={u.cols}>
          <div>
            <span className={u.label}>Positives to raise</span>
            <ul className={u.bullets}>
              {MEETING.positives.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className={u.label}>Negatives to get ahead of</span>
            <ul className={u.bullets} data-tone="risk">
              {MEETING.negatives.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
        <table className={u.table}>
          <thead>
            <tr>
              <th>Alert</th>
              <th>Action taken</th>
              <th className={u.num}>Impact</th>
            </tr>
          </thead>
          <tbody>
            {MEETING.rows.map((r) => (
              <tr key={r.alert}>
                <td>{r.alert}</td>
                <td>{r.action}</td>
                <td className={`${u.num} ${u.gain}`}>{r.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function TaskCard() {
  return (
    <Card title="Task" icon="check" meta={<StatusTag s={TASK.status} />}>
      <div style={{ display: "grid", gap: "1em" }}>
        <b style={{ fontSize: "1.08em" }}>
          <span className={u.risk}>{TASK.value}</span> {TASK.title}
        </b>
        <div className={u.taskFields}>
          <div>
            <small>Assignee</small>
            <span className={u.who}>
              <AanMascot state="diamond" size={16} glow={false} shadow={false} /> {TASK.assignee}
            </span>
          </div>
          <div>
            <small>Status</small>
            {TASK.status}
          </div>
          <div>
            <small>Priority</small>
            <span className={u.risk}>{TASK.priority}</span>
          </div>
          <div>
            <small>Due</small>
            {TASK.due}
          </div>
        </div>
        <span className={u.btn} style={{ justifySelf: "start" }}>
          <span>✦</span> Complete with Aan
        </span>
      </div>
    </Card>
  );
}

/* ------------------------------------------------ small floating pieces */
export function RuleChip() {
  return (
    <div className={u.ruleChip}>
      <b>IF</b> ACOS &gt; 30% <b>AND</b> ROAS &lt; 2 <b>THEN</b> lower bid 15%
    </div>
  );
}

export function AskBubble({ q = "Why did ROAS drop on Tuesday?", a = "Aan · 3 campaigns hit their budget by 2 PM" }: { q?: string; a?: string }) {
  return (
    <div className={u.askBubble}>
      <AanMascot state="diamond" size={20} glow={false} shadow={false} />
      <span>
        {q}
        <small>{a}</small>
      </span>
    </div>
  );
}

export function DoneChip() {
  return (
    <span className={u.doneChip}>
      <Pill tone="gain">✓ Done</Pill> Verified over 7 days · <b>+$7,240</b>
    </span>
  );
}
