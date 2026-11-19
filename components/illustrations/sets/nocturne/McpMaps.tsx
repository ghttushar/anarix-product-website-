"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import { Drawing, Label, art, d, fx, g } from "./kit";
import m from "./mcp-maps.module.css";

/*
  The two MCP drawings the owner keeps in 2D: the wiring map (the MCP hero)
  and the tool panel (what MCP is). Flat, labelled systems: stores in, the
  Anarix hub, AI clients out.
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
    <div ref={box} className={m.map}>
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
        className={m.legible}
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
