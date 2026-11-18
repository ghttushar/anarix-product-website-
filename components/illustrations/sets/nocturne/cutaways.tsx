"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import { Drawing, Label, Tree, art, d, fx, g, scallops } from "./kit";
import c from "./cutaways.module.css";

/*
  The product pages' heroes: each product's landmark on the street, drawn
  large with its front opened, so the mechanism inside shows. One family:
  viewBox 640 × 440, the ground at y = 420 (Profitability: 400, its names sit
  under the ground like a chart's axis), one hairline, coral for what goes
  wrong, periwinkle for what Aan handled. Aan stands where the work happens.
*/
const W = 640;
const H = 440;

function Frame({ label, children, dock }: { label: string; children: ReactNode; dock: (size: number) => ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(44);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(Math.round(Math.max(30, Math.min(56, e.contentRect.height * 0.11)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box}>
      <Drawing w={W} h={H} label={label} className={c.legible} dock={dock(size)}>
        {children}
      </Drawing>
    </div>
  );
}

const at = (x: number, base: number): CSSProperties => ({ left: `${(x / W) * 100}%`, bottom: `${((H - base) / H) * 100}%` });

/* ------------------------------------------------------------- Signals */
/* the store with its front off: three shelves, one per marketplace, and the
   one price tag that changed */
const SHELVES = [
  { y: 196, k: "Amazon", items: [150, 196, 250, 304, 352, 410, 462] },
  { y: 256, k: "Walmart", items: [150, 206, 262, 318, 380, 440, 492] },
  { y: 316, k: "Shopify", items: [150, 200, 254, 316, 370, 428, 480] },
];
const FLAG = { shelf: 0, item: 4 };

export function SignalsCutaway({ stop = "signals", bubble }: { stop?: string; bubble?: string }) {
  const BASE = 420;
  return (
    <Frame
      label="A store drawn with its front wall off: three shelves for Amazon, Walmart and Shopify. One price tag on the Amazon shelf has changed and is marked; Aan stands below it."
      dock={(size) => <AanDock stop={stop} size={size} bubble={bubble} side="left" style={at(440, BASE)} />}
    >
      <g {...g(0)}>
        <line {...d()} x1={-40} y1={BASE} x2={W + 40} y2={BASE} />
      </g>
      {/* the building, in section */}
      <g {...g(1)}>
        <path {...d(art.body)} d="M48 132 L320 62 L592 132 Z" />
        <rect {...d(art.body)} x={70} y={132} width={12} height={BASE - 132} />
        <rect {...d(art.body)} x={558} y={132} width={12} height={BASE - 132} />
        <line {...d()} x1={82} y1={144} x2={558} y2={144} />
        <rect {...d(art.body)} x={262} y={96} width={116} height={24} />
      </g>
      <Label x={320} y={113} size={12}>
        Your store
      </Label>
      <g {...g(2)}>
        <path {...d()} d="M320 144 V156 M308 166 h24 l-5 -10 h-14 z" />
      </g>
      {/* the shelves and what is on them */}
      {SHELVES.map((sh, si) => (
        <g key={sh.k} {...g(3 + si)}>
          <line {...d()} x1={100} y1={sh.y} x2={540} y2={sh.y} />
          <line {...d()} x1={120} y1={sh.y} x2={120} y2={sh.y + 8} />
          <line {...d()} x1={520} y1={sh.y} x2={520} y2={sh.y + 8} />
          {sh.items.map((x, i) => {
            const h = 22 + ((i * 7 + si * 5) % 4) * 6;
            const flagged = si === FLAG.shelf && i === FLAG.item;
            return (
              <g key={x}>
                <rect {...d(flagged ? fx.warn : undefined)} x={x} y={sh.y - h} width={30} height={h} />
                {i % 2 === 1 || flagged ? <rect {...d(flagged ? fx.warn : undefined)} x={x + 4} y={sh.y + 6} width={22} height={12} rx={2} /> : null}
                {flagged && <line {...d(fx.warn)} x1={x + 6} y1={sh.y + 16} x2={x + 24} y2={sh.y + 8} />}
              </g>
            );
          })}
        </g>
      ))}
      {SHELVES.map((sh) => (
        <Label key={sh.k} x={100} y={sh.y + 18} size={12} anchor="start">
          {sh.k}
        </Label>
      ))}
      {/* Aan has followed the change to its tag */}
      <path d="M440 372 C 430 300, 400 240, 381 218" className={fx.dotsAfter} />
      <Tree x={610} base={BASE} s={0.8} />
    </Frame>
  );
}

/* ------------------------------------------------------- Profitability */
/* sales, with every cost lifted out as its own block; what is left is the
   profit, and Aan stands on it. Heights to scale ($5,235 sales). */
const COSTS = [
  { k: "Fees", v: 1151 },
  { k: "Ads", v: 288 },
  { k: "Refunds", v: 412 },
  { k: "COGS", v: 1816 },
];

export function ProfitCutaway({ stop = "profitability", bubble }: { stop?: string; bubble?: string }) {
  const BASE = 400;
  const SCALE = 270 / 5235;
  const TOP = BASE - 270;
  const BW = 62;
  const xs = [30, 120, 210, 300, 390, 480];
  let level = TOP;
  const blocks = COSTS.map((cst, i) => {
    const y0 = level;
    level += cst.v * SCALE;
    return { ...cst, x: xs[i + 1], y0, y1: level };
  });
  const profitTop = level;
  const profitX = xs[5];
  return (
    <Frame
      label="Sales drawn as a tall block; fees, ads, refunds and cost of goods are each lifted out as their own block, to scale, and what is left at the end is the profit. Aan stands on the profit."
      dock={(size) => <AanDock stop={stop} size={size} bubble={bubble} side="right" style={at(profitX + BW / 2, profitTop)} />}
    >
      <g {...g(0)}>
        <line {...d()} x1={-40} y1={BASE} x2={W + 40} y2={BASE} />
      </g>
      <g {...g(1)}>
        <rect {...d(art.body)} x={xs[0]} y={TOP} width={BW} height={BASE - TOP} />
      </g>
      {blocks.map((b, i) => (
        <g key={b.k} {...g(2 + i)}>
          <line x1={xs[i] + BW} y1={b.y0} x2={b.x} y2={b.y0} className={fx.dots} />
          <rect {...d(`${art.body} ${fx.warn}`)} x={b.x} y={b.y0} width={BW} height={Math.max(b.y1 - b.y0, 2)} style={{ "--hot-delay": `${i * 140}ms` } as CSSProperties} />
          <line x1={b.x + BW / 2} y1={b.y1 + 6} x2={b.x + BW / 2} y2={BASE} className={fx.dots} />
        </g>
      ))}
      <g {...g(6)}>
        <line x1={blocks[3].x + BW} y1={profitTop} x2={profitX} y2={profitTop} className={fx.dots} />
        <rect {...d(`${art.body} ${fx.hot}`)} x={profitX} y={profitTop} width={BW} height={BASE - profitTop} style={{ "--hot-delay": "600ms" } as CSSProperties} />
      </g>
      {["Sales", ...COSTS.map((x) => x.k), "Profit"].map((k, i) => (
        <Label key={k} x={xs[i] + BW / 2} y={BASE + 22} size={12} className={i === 5 ? fx.accentText : undefined}>
          {k}
        </Label>
      ))}
    </Frame>
  );
}

/* --------------------------------------------------------------- Rules */
/* the gatehouse over the belt, its front open on the rule panel: good spend
   rolls through, waste drops into the stopped bin. Aan keeps the gate. */
export function RulesCutaway({ stop = "rules", bubble }: { stop?: string; bubble?: string }) {
  const BASE = 420;
  const BELT = 300;
  const ROWS = ["When", "If", "Then"];
  return (
    <Frame
      label="A gatehouse over a conveyor belt, drawn with its front open: inside, a rule panel reads When, If, Then. Parcels that pass roll on to the right as allowed; one drops into the stopped bin. Aan stands on the gatehouse roof."
      dock={(size) => <AanDock stop={stop} size={size} bubble={bubble} side="right" style={at(320, 138)} />}
    >
      <g {...g(0)}>
        <line {...d()} x1={-40} y1={BASE} x2={W + 40} y2={BASE} />
      </g>
      {/* the belt */}
      <g {...g(1)}>
        <line {...d()} x1={10} y1={BELT} x2={630} y2={BELT} />
        <line {...d()} x1={10} y1={BELT + 12} x2={630} y2={BELT + 12} />
        {[40, 110, 180, 460, 530, 600].map((x) => (
          <circle key={x} {...d()} cx={x} cy={BELT + 20} r={5} />
        ))}
        {[30, 210, 452, 610].map((x) => (
          <line key={x} {...d()} x1={x} y1={BELT + 12} x2={x} y2={BASE} />
        ))}
      </g>
      {/* waiting to be checked */}
      <g {...g(2)}>
        {[30, 92, 154].map((x) => (
          <rect key={x} {...d(art.body)} x={x} y={BELT - 34} width={34} height={34} />
        ))}
      </g>
      {/* the gatehouse, in section, open at the front */}
      <g {...g(3)}>
        <rect {...d(art.body)} x={228} y={138} width={184} height={12} />
        <rect {...d(art.body)} x={240} y={150} width={12} height={BELT - 150} />
        <rect {...d(art.body)} x={388} y={150} width={12} height={BELT - 150} />
        <rect {...d(art.body)} x={270} y={168} width={100} height={102} />
        <line {...d()} x1={270} y1={202} x2={370} y2={202} />
        <line {...d()} x1={270} y1={236} x2={370} y2={236} />
      </g>
      {ROWS.map((k, i) => (
        <g key={k}>
          <Label x={282} y={190 + i * 34} size={12} anchor="start">
            {k}
          </Label>
          <circle {...d(fx.hot)} cx={354} cy={185 + i * 34} r={5} style={{ "--hot-delay": `${200 + i * 200}ms` } as CSSProperties} />
        </g>
      ))}
      {/* stopped: the bin under the gate */}
      <g {...g(4)}>
        <path {...d()} d={`M296 ${BELT + 26} L306 ${BELT + 84} H354 L364 ${BELT + 26}`} />
        <rect {...d(fx.warn)} x={316} y={BELT + 46} width={28} height={28} />
        <path {...d(fx.warn)} d={`M322 ${BELT + 52} l16 16 M338 ${BELT + 52} l-16 16`} />
      </g>
      <Label x={374} y={BELT + 70} size={12} anchor="start" className={fx.riskText}>
        Stopped
      </Label>
      {/* allowed: through the gate */}
      <g {...g(5)}>
        {[452, 516, 580].map((x, i) => (
          <rect key={x} {...d(`${art.body} ${fx.hot}`)} x={x} y={BELT - 34} width={34} height={34} style={{ "--hot-delay": `${400 + i * 160}ms` } as CSSProperties} />
        ))}
      </g>
      <Label x={614} y={BELT - 46} size={12} anchor="end" className={fx.accentText}>
        Allowed
      </Label>
    </Frame>
  );
}

/* ----------------------------------------------------------------- Aan */
/* the Ask Aan kiosk on the corner, its front open: a question comes in, Aan
   answers at the counter, and the signpost outside points to the why */
const WHY = ["CPC +22%", "Conversions flat", "Move $400/day"];

export function AanCutaway({ stop = "aan", bubble }: { stop?: string; bubble?: string }) {
  const BASE = 420;
  return (
    <Frame
      label="The Ask Aan kiosk, drawn with its front open. A question arrives from the left; Aan stands on the counter beside a screen showing the answer; a signpost outside points to three reasons."
      dock={(size) => <AanDock stop={stop} size={size} bubble={bubble} side="left" style={at(256, 330)} />}
    >
      <g {...g(0)}>
        <line {...d()} x1={-40} y1={BASE} x2={W + 40} y2={BASE} />
      </g>
      {/* the question, arriving */}
      <g {...g(1)}>
        <path {...d(art.body)} d="M20 78 h156 a10 10 0 0 1 10 10 v30 a10 10 0 0 1 -10 10 h-104 l-14 14 v-14 h-38 a10 10 0 0 1 -10 -10 v-30 a10 10 0 0 1 10 -10 z" />
      </g>
      <Label x={98} y={109} size={13}>
        Why did ROAS drop?
      </Label>
      <path d="M120 144 C 140 200, 180 250, 226 270" className={fx.dots} />
      {/* the kiosk, in section, open at the front */}
      <g {...g(3)}>
        <rect {...d(art.body)} x={170} y={140} width={280} height={22} />
        <path {...d()} d={scallops(170, 450, 162, 10)} />
        <rect {...d(art.body)} x={182} y={176} width={10} height={BASE - 176} />
        <rect {...d(art.body)} x={428} y={176} width={10} height={BASE - 176} />
        <rect {...d(art.body)} x={200} y={330} width={220} height={BASE - 330} />
        <path {...d()} d="M310 176 V186 M300 194 h20 l-4 -8 h-12 z" />
      </g>
      <Label x={310} y={156} size={12}>
        Ask Aan
      </Label>
      {/* the screen with Aan's answer */}
      <g {...g(4)}>
        <rect {...d(art.body)} x={326} y={262} width={78} height={60} rx={4} />
        <line {...d()} x1={365} y1={322} x2={365} y2={330} />
        <line {...d(fx.hot)} x1={338} y1={280} x2={390} y2={280} style={{ "--hot-delay": "200ms" } as CSSProperties} />
        <line {...d(fx.hot)} x1={338} y1={294} x2={378} y2={294} style={{ "--hot-delay": "350ms" } as CSSProperties} />
        <line {...d(fx.hot)} x1={338} y1={308} x2={384} y2={308} style={{ "--hot-delay": "500ms" } as CSSProperties} />
      </g>
      {/* the signpost: the why */}
      <g {...g(5)}>
        <line {...d()} x1={500} y1={BASE} x2={500} y2={200} />
      </g>
      {WHY.map((w, i) => {
        const y = 212 + i * 38;
        return (
          <g key={w} className={fx.show} style={{ "--after-delay": `${300 + i * 220}ms` } as CSSProperties}>
            <path d={`M500 ${y} h110 l12 13 l-12 13 h-110 z`} className={art.body} />
            <text x={510} y={y + 17} className={`${art.label} ${i === 2 ? fx.accentText : ""}`} style={{ "--fs": "12px" } as CSSProperties}>
              {w}
            </text>
          </g>
        );
      })}
      <path d="M404 292 C 440 286, 470 260, 494 238" className={fx.dotsAfter} />
    </Frame>
  );
}

/* ----------------------------------------------------------------- MCP */
/* the Anarix pole with its box opened: the marketplaces wire in at the
   bottom, the box turns them into tools, and the AI clients wire out */
const STORES = ["Amazon", "Walmart", "Shopify"];
const AIS = ["Claude", "ChatGPT", "Gemini"];
const TOOLS = ["Sales", "Ads", "Inventory", "Profit"];

export function McpCutaway({ stop = "mcp", bubble }: { stop?: string; bubble?: string }) {
  const BASE = 420;
  const SW = 50;
  const ST = 356;
  return (
    <Frame
      label="The Anarix MCP pole with its box drawn open: Amazon, Walmart and Shopify wire into the bottom of the box, which holds four tools (sales, ads, inventory and profit), and wires run out to Claude, ChatGPT and Gemini. Aan stands at the foot of the pole."
      dock={(size) => <AanDock stop={stop} size={size} bubble={bubble} side="right" style={at(352, BASE)} />}
    >
      <g {...g(0)}>
        <line {...d()} x1={-40} y1={BASE} x2={W + 40} y2={BASE} />
      </g>
      {/* the marketplaces */}
      <g {...g(1)}>
        {STORES.map((k, i) => {
          const x = 12 + i * 62;
          return (
            <g key={k}>
              <rect {...d(art.body)} x={x} y={ST} width={SW} height={BASE - ST} />
              <line {...d()} x1={x + 6} y1={ST + 12} x2={x + SW - 6} y2={ST + 12} />
              <rect {...d(`${art.win} ${art.lit}`)} x={x + 15} y={ST + 26} width={20} height={16} />
            </g>
          );
        })}
      </g>
      {STORES.map((k, i) => (
        <Label key={k} x={12 + i * 62 + SW / 2} y={BASE + 17} size={11}>
          {k}
        </Label>
      ))}
      {/* the pole */}
      <g {...g(2)}>
        <line {...d()} x1={320} y1={BASE} x2={320} y2={44} />
        <line {...d()} x1={284} y1={66} x2={356} y2={66} />
      </g>
      {/* wired in at the bottom */}
      <g {...g(3)}>
        {STORES.map((k, i) => {
          const x = 12 + i * 62 + SW / 2;
          return <path key={k} {...d()} d={`M${x} ${ST} C ${x + 20} ${ST - 40}, ${262 + i * 18} ${348}, ${262 + i * 18} 316`} />;
        })}
      </g>
      {/* the box, open: its door swung back, the four tools inside */}
      <g {...g(4)}>
        <rect {...d(art.body)} x={240} y={136} width={160} height={180} />
        <path {...d(art.body)} d="M240 136 L208 148 V304 L240 316 Z" />
        <line {...d()} x1={216} y1={222} x2={216} y2={234} />
        {TOOLS.map((t, i) => {
          const y = 176 + i * 36;
          return (
            <g key={t}>
              <circle {...d()} cx={254} cy={y - 4} r={3.5} />
              <line {...d(fx.hot)} x1={330} y1={y - 4} x2={384} y2={y - 4} style={{ "--hot-delay": `${150 + i * 150}ms` } as CSSProperties} />
              <circle {...d(fx.hot)} cx={388} cy={y - 4} r={3.5} style={{ "--hot-delay": `${150 + i * 150}ms` } as CSSProperties} />
            </g>
          );
        })}
      </g>
      {TOOLS.map((t, i) => (
        <Label key={t} x={264} y={176 + i * 36} size={12} anchor="start">
          {t}
        </Label>
      ))}
      <Label x={320} y={124} size={13}>
        Anarix MCP
      </Label>
      {/* the AI clients, wired out one by one */}
      <g {...g(5)}>
        {AIS.map((k, i) => {
          const x = 456 + i * 62;
          return (
            <g key={k}>
              <rect {...d(art.body)} x={x} y={ST} width={SW} height={BASE - ST} rx={4} />
              <circle {...d(fx.hot)} cx={x + SW / 2} cy={ST + 24} r={7} style={{ "--hot-delay": `${700 + i * 200}ms` } as CSSProperties} />
            </g>
          );
        })}
      </g>
      {AIS.map((k, i) => (
        <Label key={k} x={456 + i * 62 + SW / 2} y={BASE + 17} size={11}>
          {k}
        </Label>
      ))}
      {AIS.map((k, i) => {
        const x = 456 + i * 62 + SW / 2;
        return <path key={k} {...d(fx.after)} d={`M400 ${190 + i * 40} C ${440} ${190 + i * 40}, ${x - 10} ${ST - 50}, ${x} ${ST}`} stroke="var(--accent)" style={{ "--after-delay": `${200 + i * 240}ms` } as CSSProperties} />;
      })}
    </Frame>
  );
}
