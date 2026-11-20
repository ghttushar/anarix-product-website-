import type { AnswerChart as Chart } from "@/content/products/samples";
import c from "./answer-chart.module.css";

/*
  The receipt under one of Aan's answers: two small trend lines (what moved,
  by how much) or a few ranked bars (which items, how much). Flat, labelled,
  sample data; coral only where it is money lost or at risk.
*/
const W = 120;
const H = 34;

function line(points: number[]) {
  const lo = Math.min(...points);
  const hi = Math.max(...points);
  const span = hi - lo || 1;
  return points.map((p, i) => `${i ? "L" : "M"}${((i / (points.length - 1)) * W).toFixed(1)},${(H - 3 - ((p - lo) / span) * (H - 6)).toFixed(1)}`).join(" ");
}

const money = (v: number) => `${v < 0 ? "−" : ""}$${Math.abs(v).toLocaleString("en-US")}`;

export function AnswerChart({ chart }: { chart: Chart }) {
  if (chart.kind === "lines")
    return (
      <div className={c.lines}>
        {chart.series.map((s) => (
          <figure key={s.label} className={c.spark}>
            <figcaption>
              <span>{s.label}</span>
              <b>{s.note}</b>
            </figcaption>
            <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
              <path d={line(s.points)} />
            </svg>
          </figure>
        ))}
      </div>
    );
  const max = Math.max(...chart.items.map((i) => Math.abs(i.v)));
  return (
    <ol className={c.bars}>
      {chart.items.map((i) => (
        <li key={i.label}>
          <span className={c.label}>{i.label}</span>
          <span className={c.track} aria-hidden="true">
            <span className={c.bar} style={{ width: `${(Math.abs(i.v) / max) * 100}%` }} />
          </span>
          <span className={c.v}>{money(i.v)}</span>
        </li>
      ))}
    </ol>
  );
}
