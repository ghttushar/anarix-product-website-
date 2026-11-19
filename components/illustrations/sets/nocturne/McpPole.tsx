"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import { Drawing, Label, art, d, fx, g } from "./kit";

/*
  MCP: one plug, any AI. Lines run from the three marketplaces into the Anarix
  pole, and out to the AI clients, which light up one by one as they connect.
  Names sit under the ground line, like street names.
  viewBox 640 × 212, ground at y = 192.
*/
const W = 640;
const H = 212;
const BASE = 192;
const POLE = 320;
const ARM_Y = 58;
const STORES = [
  { k: "Amazon", x: 16 },
  { k: "Walmart", x: 88 },
  { k: "Shopify", x: 160 },
];
const AIS = [
  { k: "Claude", x: 412 },
  { k: "ChatGPT", x: 488 },
  { k: "Gemini", x: 564 },
];
const SW = 60;
const TOP = 150;

const cable = (x1: number, y1: number, x2: number, y2: number) => `M${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.max(y1, y2) + 26} ${x2} ${y2}`;

export function McpPole({ stop = "mcp", bubble }: { stop?: string; bubble?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(36);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(Math.round(Math.max(26, Math.min(44, e.contentRect.height * 0.2)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box}>
      <Drawing
        w={W}
        h={H}
        label="Lines run from the Amazon, Walmart and Shopify stores into the Anarix MCP pole, and out to Claude, ChatGPT and Gemini. Aan sits on top of the pole."
        dock={<AanDock stop={stop} size={size} bubble={bubble} side="right" style={{ left: `${(POLE / W) * 100}%`, bottom: `${((H - 36) / H) * 100}%` }} />}
      >
        <g {...g(0)}>
          <line {...d()} x1={-40} y1={BASE} x2={W + 40} y2={BASE} />
        </g>

        {/* the marketplaces */}
        <g {...g(1)}>
          {STORES.map((s) => (
            <g key={s.k}>
              <rect {...d(art.body)} x={s.x} y={TOP} width={SW} height={BASE - TOP} />
              <rect {...d()} x={s.x + 8} y={TOP + 6} width={SW - 16} height={10} />
              <rect {...d(`${art.win} ${art.lit}`)} x={s.x + 20} y={TOP + 22} width={20} height={14} />
            </g>
          ))}
        </g>
        {STORES.map((s) => (
          <Label key={s.k} x={s.x + SW / 2} y={BASE + 16} size={11}>
            {s.k}
          </Label>
        ))}

        {/* the pole */}
        <g {...g(2)}>
          <line {...d()} x1={POLE} y1={BASE} x2={POLE} y2={36} />
          <line {...d()} x1={POLE - 34} y1={ARM_Y} x2={POLE + 34} y2={ARM_Y} />
          <rect {...d(`${art.body} ${fx.hot}`)} x={POLE - 22} y={80} width={44} height={30} rx={3} />
        </g>
        <Label x={POLE - 42} y={50} size={12} anchor="end">
          Anarix MCP
        </Label>

        {/* in from the marketplaces */}
        <g {...g(3)}>
          {STORES.map((s, i) => (
            <path key={s.k} {...d()} d={cable(s.x + SW / 2, TOP, POLE - 34 + i * 10, ARM_Y)} />
          ))}
        </g>

        {/* the AI clients, plugged in one by one */}
        <g {...g(4)}>
          {AIS.map((a) => (
            <g key={a.k}>
              <rect {...d(art.body)} x={a.x} y={TOP} width={SW} height={BASE - TOP} rx={4} />
              <circle {...d(fx.hot)} cx={a.x + SW / 2} cy={TOP + 20} r={7} style={{ "--hot-delay": "600ms" } as CSSProperties} />
            </g>
          ))}
        </g>
        {AIS.map((a) => (
          <Label key={a.k} x={a.x + SW / 2} y={BASE + 16} size={11}>
            {a.k}
          </Label>
        ))}
        {AIS.map((a, i) => (
          <path key={a.k} {...d(fx.after)} d={cable(POLE + 14 + i * 10, ARM_Y, a.x + SW / 2, TOP)} stroke="var(--accent)" style={{ "--after-delay": `${150 + i * 260}ms` } as CSSProperties} />
        ))}
      </Drawing>
    </div>
  );
}
