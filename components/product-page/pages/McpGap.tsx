"use client";

import { useCallback, useRef, type CSSProperties, type ReactNode } from "react";
import { StoryScroll, useStoryProgress } from "@/components/layout/StoryScroll";
import { AnarixMark } from "@/components/chrome/Logo";
import g from "./mcp-gap.module.css";

/*
  MCP's problem, told the way dreamteam.ai tells its "Legacy CRM problem"
  (owner: "look how the elements are coming from the side ... exact same
  style"). One pinned scroll:
  1. the scattered places your marketplace data lives (reports, exports, a
     sheet, a sticky note, a Slack ask, your AI saying it can't see it) slide
     in from both sides around the headline;
  2. they converge on the centre and shrink into the Anarix mark while the
     headline blurs away;
  3. an iris of dark opens from the mark with lines streaming out of it, and
     Anarix MCP is introduced.
  The pieces are illustrative. --a (arrive), --c (converge) and --i (iris)
  drive everything as transforms and opacity; reduced motion jumps between
  the three states.
*/
type Piece = { x: number; y: number; r: number; w: number; side: -1 | 1; d: number; body: ReactNode; cls?: string; phone?: boolean };

const Wave = () => (
  <span className={g.wave} aria-hidden="true">
    {Array.from({ length: 46 }, (_, i) => (
      <i key={i} style={{ "--h": (0.25 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))).toFixed(2) } as CSSProperties} />
    ))}
  </span>
);

const PIECES: Piece[] = [
  // ------------------------------------------------------------ the left
  {
    x: -33, y: -21, r: 8, w: 360, side: -1, d: 0.9, phone: true,
    body: (
      <>
        <p className={g.title}>
          <b className={g.dot} /> Seller Central · Business report
        </p>
        <dl className={g.kv}>
          <dt>Sessions</dt>
          <dd>4,812</dd>
          <dt>Units</dt>
          <dd>312</dd>
          <dt>Next step</dt>
          <dd>
            Pull ad spend<span className={g.caret} />
          </dd>
        </dl>
        <p className={g.faint}>Downloaded 23 days ago</p>
      </>
    ),
  },
  { x: -19, y: -33, r: -10, w: 84, side: -1, d: 0.6, cls: g.tile, body: <b className={g.tileTxt}>29</b> },
  {
    x: -37, y: 3, r: -4, w: 300, side: -1, d: 0.7, cls: g.file,
    body: (
      <>
        <span className={g.fileIcon}>CSV</span>
        <p className={g.title}>ads_export_FINAL_v3.csv</p>
        <p className={g.faint}>Sponsored Products · 1,284 rows</p>
      </>
    ),
  },
  {
    x: -24, y: 10, r: 6, w: 96, side: -1, d: 0.5, cls: g.tile,
    body: (
      <>
        <b className={g.tileTxt}>@</b>
        <span className={g.badge}>12</span>
      </>
    ),
  },
  {
    x: -34, y: 21, r: -3, w: 330, side: -1, d: 0.8, phone: true,
    body: (
      <>
        <p className={g.flag}>3 campaigns over budget</p>
        <p className={g.title}>Walmart Ad Center</p>
        <p className={g.faint}>ROAS 2.4 yesterday, down from 3.0</p>
      </>
    ),
  },
  {
    x: -24, y: 34, r: -6, w: 330, side: -1, d: 0.65,
    body: (
      <>
        <p className={g.title}>Weekly ads review</p>
        <p className={g.faint}>4:30 PM to 5:30 PM</p>
        <p className={g.pillSmall}>Starts in 11:32</p>
      </>
    ),
  },
  // ----------------------------------------------------------- the right
  {
    x: 33, y: -33, r: 4, w: 300, side: 1, d: 0.6,
    body: (
      <>
        <p className={g.title}>Shopify · New order #4521</p>
        <p className={g.faint}>$86.40 · 2 items · ships today</p>
      </>
    ),
  },
  {
    x: 31, y: -16, r: -2, w: 360, side: 1, d: 0.85, phone: true,
    body: (
      <>
        <p className={g.title}>
          <b className={g.rec} /> Agency call recording
        </p>
        <Wave />
        <p className={g.faint}>42:36</p>
      </>
    ),
  },
  { x: 23, y: -6, r: -12, w: 92, side: 1, d: 0.5, cls: g.tile, body: <b className={g.tileTxt}>AM</b> },
  {
    x: 33, y: 4, r: 6, w: 280, side: 1, d: 0.75, cls: g.sticky,
    body: <p className={g.hand}>check TACoS before Mon!! FBA fees up??</p>,
  },
  { x: 24, y: 15, r: -8, w: 78, side: 1, d: 0.45, cls: g.tile, body: <b className={g.tileTxt}>PDF</b> },
  { x: 38, y: 16, r: 10, w: 96, side: 1, d: 0.55, cls: g.tile, body: <b className={g.tileTxt}>SL</b> },
  {
    x: 32, y: 27, r: -3, w: 330, side: 1, d: 0.7, phone: true,
    body: (
      <>
        <p className={g.title}>inventory_tracker_v2.xlsx</p>
        <table className={g.sheet}>
          <tbody>
            <tr>
              <td>Chef knife</td>
              <td className={g.hot}>6 days?</td>
              <td>reorder</td>
            </tr>
            <tr>
              <td>Bamboo board</td>
              <td>21 days</td>
              <td>ok</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    x: 33, y: 39, r: 3, w: 330, side: 1, d: 0.6, cls: g.bubble,
    body: <p>can you pull last week&rsquo;s ROAS before the call?</p>,
  },
  {
    x: -12, y: 38, r: -2, w: 300, side: -1, d: 0.5, cls: g.ai, phone: true,
    body: (
      <>
        <p className={g.faint}>Your AI</p>
        <p>I can&rsquo;t see your Amazon data.</p>
      </>
    ),
  },
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number) => Math.max(0, Math.min(1, v));

function Gap() {
  const stage = useRef<HTMLDivElement>(null);
  const onP = useCallback((p: number) => {
    const el = stage.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = (t: number) => (reduced ? (t > 0.5 ? 1 : 0) : smooth(clamp(t)));
    el.style.setProperty("--a", step(p / 0.3).toFixed(4));
    el.style.setProperty("--c", step((p - 0.38) / 0.3).toFixed(4));
    el.style.setProperty("--i", step((p - 0.7) / 0.24).toFixed(4));
  }, []);
  useStoryProgress(onP);

  return (
    <div ref={stage} className={g.stage}>
      <div className={g.pieces} data-bleed aria-hidden="true">
        {PIECES.map((pc, k) => (
          <div
            key={k}
            className={`${g.piece} ${pc.cls ?? ""}`}
            data-phone={pc.phone ? "true" : undefined}
            style={{ "--x": pc.x, "--y": pc.y, "--r": pc.r, "--w": `${pc.w}px`, "--side": pc.side, "--d": pc.d } as CSSProperties}
          >
            {pc.body}
          </div>
        ))}
      </div>

      <header className={g.copy}>
        <p className={g.label}>The AI gap</p>
        <h2 className={g.h2}>Your data lives everywhere except your AI.</h2>
        <p className={g.sr}>Reports, exports, spreadsheets, sticky notes and team chats hold your marketplace data; the AI you use cannot see any of it.</p>
      </header>

      <div className={g.iris} data-bleed aria-hidden="true">
        <svg className={g.rays} viewBox="-50 -50 100 100" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 72 }, (_, k) => {
            const t = (k / 72) * Math.PI * 2;
            // rounded, so the server and the browser print the same numbers
            const f = (v: number) => +v.toFixed(3);
            return <line key={k} x1={f(Math.cos(t) * 6)} y1={f(Math.sin(t) * 6)} x2={f(Math.cos(t) * 90)} y2={f(Math.sin(t) * 90)} />;
          })}
        </svg>
      </div>

      <div className={g.meet}>
        <h2 className={g.meetTitle}>Meet Anarix MCP.</h2>
        <p className={g.meetLine}>Your live marketplace data, inside the AI you already use: the same numbers as your dashboard.</p>
      </div>

      <span className={g.mark} aria-hidden="true">
        <AnarixMark height={30} />
      </span>
      <span className={g.stem} aria-hidden="true" />
      <p className={g.note}>Illustrative</p>
    </div>
  );
}

export function McpGap() {
  return (
    <StoryScroll id="the-gap" label="Your data lives everywhere except your AI" chapters={4} per={55} bodyClassName={g.body}>
      <Gap />
    </StoryScroll>
  );
}
