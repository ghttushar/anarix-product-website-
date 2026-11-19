"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import { Drawing, Label, art, d, fx, g, scallops } from "./kit";
import p from "./places.module.css";

/*
  Each product page is its own place on the street, drawn from its own camera:
  - WindowCloseup  (Signals): one shop window, close up, at 3:12 AM
  - ProfitLedger   (Profitability): the day's money as a cross-section
  - GatehouseBelt  (Rules): the belt, side on, edge to edge
  - AanPortrait    (Aan): Aan alone in an arched frame
  - WiringMap      (MCP): the wiring, seen from above
  One hairline, coral for what goes wrong, periwinkle for what Aan handled.
*/

/** the dock grows with its drawing; Aan is drawn at twice this */
function useDockSize(min: number, max: number, k: number) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(min);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(Math.round(Math.max(min, Math.min(max, e.contentRect.height * k)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [min, max, k]);
  return { box, size };
}

const at = (x: number, base: number, w: number, h: number): CSSProperties => ({ left: `${(x / w) * 100}%`, bottom: `${((h - base) / h) * 100}%` });

/* ---------------------------------------------------- Signals: the window */
/* close up: one bay of one window, the tag that changed at its centre, the
   clock reading 3:12 on the wall above. The facade runs off the right edge. */
export function WindowCloseup({ stop = "signals", bubble }: { stop?: string; bubble?: string }) {
  const W = 420;
  const H = 600;
  const BASE = 584;
  const SILL = 500;
  const { box, size } = useDockSize(28, 46, 0.075);
  return (
    <div ref={box}>
      <Drawing
        w={W}
        h={H}
        label="A close-up of one shop window at 3:12 in the morning. One price tag inside, $18.69, has changed and is marked in coral; Aan stands on the sill, looking at it."
        dock={<AanDock stop={stop} size={size} bubble={bubble} side="right" style={at(92, SILL, W, H)} />}
      >
        <g {...g(0)}>
          <line {...d()} x1={-80} y1={BASE} x2={W + 200} y2={BASE} />
        </g>
        <g {...g(1)}>
          <rect {...d(art.body)} x={0} y={0} width={W + 200} height={BASE} />
          {/* the clock on the wall: 3:12 */}
          <circle {...d()} cx={330} cy={84} r={46} />
          <path {...d()} d="M330 44 v7 M370 84 h-7 M330 124 v-7 M290 84 h7" />
        </g>
        <g {...g(2)}>
          <path {...d(fx.warn)} d="M330 84 L 362 73.6 M330 84 L 351 86.2" />
        </g>
        {/* the bay */}
        <g {...g(3)}>
          <rect {...d()} x={24} y={160} width={W + 200} height={SILL - 160} />
          <line {...d()} x1={24} y1={330} x2={W + 200} y2={330} />
        </g>
        <g {...g(4)}>
          <rect {...d(`${art.win} ${art.lit}`)} x={56} y={232} width={72} height={98} />
          <rect {...d(art.win)} x={146} y={256} width={92} height={74} />
          <rect {...d(art.win)} x={256} y={214} width={64} height={116} />
          <rect {...d(`${art.win} ${art.lit}`)} x={338} y={244} width={70} height={86} />
          <rect {...d(art.win)} x={70} y={402} width={88} height={98} />
          <rect {...d(`${art.win} ${art.lit}`)} x={300} y={418} width={84} height={82} />
          <rect {...d()} x={84} y={340} width={34} height={16} rx={3} />
          <rect {...d()} x={348} y={340} width={34} height={16} rx={3} />
        </g>
        {/* the tag that changed */}
        <g {...g(5)}>
          <line {...d(fx.warn)} x1={192} y1={330} x2={192} y2={346} />
          <rect {...d(fx.warn)} x={138} y={346} width={108} height={44} rx={5} />
          <line {...d(fx.warn)} x1={146} y1={382} x2={238} y2={354} />
        </g>
        <text x={192} y={375} className={`${art.label} ${fx.riskText}`} style={{ "--fs": "22px" } as CSSProperties} fontSize={22} textAnchor="middle">
          $18.69
        </text>
        <g {...g(6)}>
          <rect {...d(art.body)} x={8} y={SILL} width={W + 200} height={16} />
        </g>
        <path d={`M112 ${SILL - 54} C 130 440, 150 410, 168 394`} className={fx.dotsAfter} />
      </Drawing>
    </div>
  );
}

/** a small shopfront, drawn inline for buttons */
export function MiniStore({ lit = false }: { lit?: boolean }) {
  return (
    <svg className={p.mini} viewBox="0 0 64 52" aria-hidden="true">
      <rect x={4} y={10} width={56} height={40} className={p.miniBody} />
      <path d="M4 10 H60" />
      <path d="M4 18 a3.5 3.5 0 0 0 7 0 a3.5 3.5 0 0 0 7 0 a3.5 3.5 0 0 0 7 0 a3.5 3.5 0 0 0 7 0 a3.5 3.5 0 0 0 7 0 a3.5 3.5 0 0 0 7 0 a3.5 3.5 0 0 0 7 0 a3.5 3.5 0 0 0 7 0" />
      <rect x={10} y={26} width={22} height={16} className={lit ? p.miniLit : undefined} />
      <rect x={38} y={26} width={14} height={24} />
    </svg>
  );
}

/* ------------------------------------------ Profitability: the ledger */
const LEDGER = { W: 1200, H: 300, BASE: 262, TOP: 32 };

export function ProfitLedger({ sales, costs, on, stop = "profitability", bubble, dock = true }: { sales: number; costs: readonly { k: string; v: number }[]; on: boolean[]; stop?: string; bubble?: string; dock?: boolean }) {
  const { W, H, BASE, TOP } = LEDGER;
  const S = (BASE - TOP) / sales;
  const BW = 120;
  const xs = [40, 230, 420, 610, 800];
  const profitX = 990;
  let level = TOP;
  const blocks = costs.map((c, i) => {
    const y0 = level;
    const h = c.v * S;
    if (on[i]) level += h;
    return { ...c, x: xs[i + 1], y0, h, on: on[i] };
  });
  const profitTop = level;
  const { box, size } = useDockSize(22, 40, 0.11);
  return (
    <div ref={box}>
      <Drawing
        w={W}
        h={H}
        label="The day's sales as one tall bar. Each cost that is switched on is lifted out as its own block, to scale; what is left at the end is the profit."
        dock={dock ? <AanDock stop={stop} size={size} bubble={bubble} side="left" style={at(profitX + 80, profitTop, W, H)} /> : undefined}
        className={`${p.ledger} ${p.legible}`}
      >
        <g {...g(0)}>
          <line {...d()} x1={-40} y1={BASE} x2={W + 40} y2={BASE} />
        </g>
        <g {...g(1)}>
          <rect {...d(art.body)} x={xs[0]} y={TOP} width={BW} height={BASE - TOP} />
        </g>
        {blocks.map((b, i) => (
          <g key={b.k} {...g(2 + i)} className={p.block} data-on={b.on ? "true" : "false"}>
            <rect className={p.cost} x={b.x} y={0} width={BW} height={Math.max(b.h, 2)} style={{ transform: `translateY(${b.y0}px)` }} />
            <line className={fx.dots} x1={b.x - 70} y1={b.y0} x2={b.x} y2={b.y0} style={{ transition: "none" }} />
          </g>
        ))}
        <g {...g(6)}>
          <line className={fx.dots} x1={xs[4] + BW} y1={profitTop} x2={profitX} y2={profitTop} />
          <rect className={p.profit} x={profitX} y={0} width={160} height={BASE - profitTop} style={{ transform: `translateY(${profitTop}px)`, height: BASE - profitTop }} />
        </g>
        {["Sales", ...costs.map((c) => c.k)].map((k, i) => (
          <Label key={k} x={xs[i] + BW / 2} y={BASE + 26} size={15}>
            {k}
          </Label>
        ))}
        <Label x={profitX + 80} y={BASE + 26} size={15} className={fx.accentText}>
          Profit
        </Label>
      </Drawing>
    </div>
  );
}

/* ------------------------------------------------- Rules: the belt */
export function GatehouseBelt({ stops, label, stop = "rules", bubble, sorting }: { stops: number; label: string; stop?: string; bubble?: string; /** changes each time a rule is applied, to replay the drop */ sorting?: string }) {
  const W = 1600;
  const H = 330;
  const BASE = 322;
  const BELT = 232;
  const GATE = 800;
  const waiting = [140, 240, 340, 440, 540];
  const passed = [1000, 1100, 1200, 1300, 1400];
  const { box, size } = useDockSize(22, 40, 0.13);
  return (
    <div ref={box}>
      <Drawing
        w={W}
        h={H}
        label={`A conveyor belt running through a gatehouse with a rule panel (When, If, Then). Allowed parcels roll on to the right; the one the rule stops drops into the bin: ${label}.`}
        dock={<AanDock stop={stop} size={size} bubble={bubble} side="right" style={at(GATE, 88, W, H)} />}
        className={p.belt}
      >
        <g {...g(0)}>
          <line {...d()} x1={-40} y1={BELT} x2={W + 40} y2={BELT} />
          <line {...d()} x1={-40} y1={BELT + 12} x2={W + 40} y2={BELT + 12} />
          {[60, 180, 300, 420, 540, 1060, 1180, 1300, 1420, 1540].map((x) => (
            <circle key={x} {...d()} cx={x} cy={BELT + 20} r={5} />
          ))}
          {[100, 480, 1260, 1500].map((x) => (
            <line key={x} {...d()} x1={x} y1={BELT + 12} x2={x} y2={BASE} />
          ))}
          <line {...d()} x1={-40} y1={BASE} x2={W + 40} y2={BASE} />
        </g>
        <g {...g(1)}>
          {waiting.map((x) => (
            <rect key={x} {...d(art.body)} x={x} y={BELT - 34} width={34} height={34} />
          ))}
        </g>
        {/* the gatehouse, front open on its rule panel */}
        <g {...g(2)}>
          <rect {...d(art.body)} x={GATE - 104} y={88} width={208} height={12} />
          <rect {...d(art.body)} x={GATE - 92} y={100} width={12} height={BELT - 100} />
          <rect {...d(art.body)} x={GATE + 80} y={100} width={12} height={BELT - 100} />
          <rect {...d(art.body)} x={GATE - 64} y={114} width={128} height={96} />
          <line {...d()} x1={GATE - 64} y1={146} x2={GATE + 64} y2={146} />
          <line {...d()} x1={GATE - 64} y1={178} x2={GATE + 64} y2={178} />
        </g>
        {["When", "If", "Then"].map((k, i) => (
          <g key={k}>
            <Label x={GATE - 52} y={136 + i * 32} size={13} anchor="start">
              {k}
            </Label>
            <circle {...d(fx.hot)} cx={GATE + 48} cy={131 + i * 32} r={5} style={{ "--hot-delay": `${200 + i * 200}ms` } as CSSProperties} />
          </g>
        ))}
        {/* stopped: into the bin */}
        <g {...g(3)}>
          <path {...d()} d={`M${GATE - 36} ${BELT + 26} L${GATE - 28} ${BELT + 80} H${GATE + 28} L${GATE + 36} ${BELT + 26}`} />
        </g>
        <g key={sorting} className={p.drop}>
          <rect className={p.stopped} x={GATE - 14} y={BELT + 42} width={28} height={28} />
          <path className={p.stopped} d={`M${GATE - 8} ${BELT + 48} l16 16 M${GATE + 8} ${BELT + 48} l-16 16`} />
        </g>
        <text key={`l-${sorting}`} x={GATE + 50} y={BELT + 68} className={`${art.label} ${fx.riskText} ${p.dropLabel}`} style={{ "--fs": "14px" } as CSSProperties} fontSize={14}>
          Stopped: {label}
        </text>
        {/* allowed: rolled through */}
        <g {...g(4)}>
          {passed.map((x, i) => (i === stops ? null : <rect key={x} {...d(`${art.body} ${fx.hot}`)} x={x} y={BELT - 34} width={34} height={34} style={{ "--hot-delay": `${300 + i * 120}ms` } as CSSProperties} />))}
        </g>
        <Label x={1440} y={BELT - 50} size={14} anchor="end" className={fx.accentText}>
          Allowed
        </Label>
      </Drawing>
    </div>
  );
}

/* ---------------------------------------------------- Aan: the portrait */
export function AanPortrait({ stop = "aan", bubble }: { stop?: string; bubble?: string }) {
  const W = 440;
  const H = 560;
  const BASE = 520;
  const { box, size } = useDockSize(60, 120, 0.2);
  return (
    <div ref={box}>
      <Drawing
        w={W}
        h={H}
        label="Aan, standing alone in a tall arched frame, with the night street low behind it."
        dock={<AanDock stop={stop} size={size} bubble={bubble} side="right" style={at(W / 2, BASE - 14, W, H)} />}
      >
        <defs>
          <clipPath id="portrait-arch">
            <path d={`M60 ${BASE} V190 A160 160 0 0 1 380 190 V${BASE} Z`} />
          </clipPath>
        </defs>
        <g clipPath="url(#portrait-arch)">
          <g {...g(1)}>
            {[
              [70, 140, 70],
              [150, 90, 50],
              [210, 170, 60],
              [282, 110, 56],
              [330, 150, 60],
            ].map(([x, h, w]) => (
              <rect key={x} {...d(`${art.body} ${p.far}`)} x={x} y={BASE - 30 - h} width={w} height={h} />
            ))}
          </g>
          <path {...d()} d="M300 162 a18 18 0 1 0 13 30 a14 14 0 1 1 -13 -30 z" />
        </g>
        <g {...g(0)}>
          <path {...d()} d={`M60 ${BASE} V190 A160 160 0 0 1 380 190 V${BASE}`} />
          <path {...d()} d={`M40 ${BASE} H400`} />
          <rect {...d(art.body)} x={150} y={BASE - 14} width={140} height={14} />
        </g>
      </Drawing>
    </div>
  );
}

/* ------------------------------------------------------ MCP: the map */
const STORES = ["Amazon", "Walmart", "Shopify"];
const AIS = ["Claude", "ChatGPT", "Gemini", "Your agent"];

export function WiringMap({ stop = "mcp", bubble }: { stop?: string; bubble?: string }) {
  const W = 1280;
  const H = 520;
  const IN = 372; // where wires meet the name, left
  const OUT = 908; // and leave it, right
  const JX = 1000; // the junction Aan stands on
  const JY = 260;
  const { box, size } = useDockSize(22, 40, 0.08);
  return (
    <div ref={box} className={p.map}>
      <Drawing
        w={W}
        h={H}
        label="Seen from above: Amazon, Walmart and Shopify wire into Anarix MCP in the middle, and wires run out to Claude, ChatGPT, Gemini and your own agent. Aan stands on the junction."
        dock={<AanDock stop={stop} size={size} bubble={bubble} side="right" style={at(JX, JY - 12, W, H)} />}
      >
        {STORES.map((k, i) => {
          const y = 140 + i * 120;
          return (
            <g key={k} {...g(1)}>
              <rect {...d(art.body)} x={40} y={y - 30} width={92} height={60} />
              <path {...d()} d={scallops(40, 132, y - 18, 6)} />
              <rect {...d(`${art.win} ${art.lit}`)} x={56} y={y - 4} width={28} height={20} />
              <path {...d()} d={`M132 ${y} C 250 ${y}, 260 ${JY + (i - 1) * 40}, ${IN} ${JY + (i - 1) * 40}`} />
            </g>
          );
        })}
        {STORES.map((k, i) => (
          <Label key={k} x={86} y={140 + i * 120 + 50} size={15}>
            {k}
          </Label>
        ))}
        <g {...g(2)}>
          <path {...d(fx.hot)} d={`M${OUT} ${JY} H${JX - 14}`} />
          <rect {...d(`${art.body} ${fx.hot}`)} x={JX - 14} y={JY - 12} width={28} height={24} rx={3} />
        </g>
        {AIS.map((k, i) => {
          const y = 110 + i * 100;
          return (
            <g key={k} {...g(3)}>
              <path {...d(fx.after)} d={`M${JX + 14} ${JY} C ${JX + 80} ${JY}, ${JX + 60} ${y}, 1124 ${y}`} stroke="var(--accent)" style={{ "--after-delay": `${200 + i * 200}ms` } as CSSProperties} />
              <rect {...d(art.body)} x={1124} y={y - 24} width={128} height={48} rx={10} />
            </g>
          );
        })}
        {AIS.map((k, i) => (
          <Label key={k} x={1188} y={110 + i * 100 + 5} size={15}>
            {k}
          </Label>
        ))}
      </Drawing>
    </div>
  );
}

/* ------------------------------------------------- MCP: the tool panel */
/* top down, close in on the hub: four labelled sockets (the tools), and every
   AI client cabled to the same bus, so they all read the same numbers */
const TOOLS = ["Sales", "Ads", "Inventory", "Profit"];

export function ToolPanel({ stop = "tools", bubble }: { stop?: string; bubble?: string }) {
  const W = 640;
  const H = 440;
  const { box, size } = useDockSize(22, 40, 0.09);
  const sockets = TOOLS.map((t, i) => ({ t, x: 140 + i * 120 }));
  const clients = AIS.map((k, i) => ({ k, x: 92 + i * 152 }));
  return (
    <div ref={box}>
      <Drawing
        w={W}
        h={H}
        label="Seen from above: the Anarix MCP panel with four sockets (sales, ads, inventory and profit). Claude, ChatGPT, Gemini and your own agent are all cabled to the same bus under it."
        dock={<AanDock stop={stop} size={size} bubble={bubble} side="left" style={at(560, 58, W, H)} />}
        className={p.legible}
      >
        <g {...g(0)}>
          <rect {...d(art.body)} x={70} y={58} width={500} height={164} rx={10} />
          <line {...d()} x1={70} y1={98} x2={570} y2={98} />
        </g>
        <Label x={90} y={84} size={14} anchor="start">
          Anarix MCP
        </Label>
        {sockets.map((s, i) => (
          <g key={s.t} {...g(1 + i)}>
            <circle {...d(fx.hot)} cx={s.x} cy={146} r={18} style={{ "--hot-delay": `${150 + i * 150}ms` } as CSSProperties} />
            <circle {...d()} cx={s.x} cy={146} r={6} />
          </g>
        ))}
        {sockets.map((s) => (
          <Label key={s.t} x={s.x} y={198} size={14}>
            {s.t}
          </Label>
        ))}
        {/* the bus, and each AI's cable onto it */}
        <g {...g(5)}>
          <path {...d(fx.hot)} d="M320 222 V270" />
          <path {...d(fx.hot)} d={`M${clients[0].x} 270 H${clients[3].x}`} />
        </g>
        {clients.map((c, i) => (
          <g key={c.k} {...g(6)}>
            <path {...d(fx.after)} d={`M${c.x} 270 V330`} stroke="var(--accent)" style={{ "--after-delay": `${200 + i * 180}ms` } as CSSProperties} />
            <rect {...d(art.body)} x={c.x - 64} y={330} width={128} height={52} rx={10} />
          </g>
        ))}
        {clients.map((c) => (
          <Label key={c.k} x={c.x} y={361} size={14}>
            {c.k}
          </Label>
        ))}
      </Drawing>
    </div>
  );
}
