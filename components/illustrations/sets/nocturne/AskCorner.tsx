"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import { Drawing, Label, art, d, fx, g } from "./kit";

/*
  Ask Aan: a question comes down the street, Aan answers under the lamp, and
  the signpost points to the why (the numbers behind the answer).
  viewBox 640 × 210, ground at y = 192.
*/
const W = 640;
const H = 210;
const BASE = 192;
const AAN_X = 278;
const WHY = ["CPC +22%", "Conversions flat", "Move $400/day"];

export function AskCorner({ stop = "aan", bubble }: { stop?: string; bubble?: string }) {
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
        label="A question arrives from the left; Aan stands under a street lamp; a signpost on the right points to three reasons: CPC up 22%, conversions flat, move $400 a day."
        dock={<AanDock stop={stop} size={size} bubble={bubble} side="right" style={{ left: `${(AAN_X / W) * 100}%`, bottom: `${((H - BASE) / H) * 100}%` }} />}
      >
        <g {...g(0)}>
          <line {...d()} x1={-40} y1={BASE} x2={W + 40} y2={BASE} />
        </g>

        {/* the question */}
        <g {...g(1)}>
          <path {...d(art.body)} d="M28 62 h168 a10 10 0 0 1 10 10 v30 a10 10 0 0 1 -10 10 h-120 l-14 14 v-14 h-34 a10 10 0 0 1 -10 -10 v-30 a10 10 0 0 1 10 -10 z" />
        </g>
        <Label x={112} y={93} size={13}>
          Why did ROAS drop?
        </Label>
        <path d={`M150 126 C 190 170, 220 176, ${AAN_X - 30} 170`} className={fx.dots} />

        {/* the lamp Aan answers under */}
        <g {...g(2)}>
          <line {...d()} x1={236} y1={BASE} x2={236} y2={58} />
          <path {...d()} d="M236 58 C 236 44, 250 40, 266 46" />
          <path {...d(art.body)} d="M258 46 h20 l6 12 h-32 z" />
          <path d="M254 60 L 236 150 M282 60 L 300 150" className={fx.dotsAfter} style={{ "--after-delay": "0ms" } as CSSProperties} />
        </g>

        {/* the signpost: the why */}
        <g {...g(3)}>
          <line {...d()} x1={460} y1={BASE} x2={460} y2={52} />
        </g>
        {WHY.map((w, i) => {
          const y = 62 + i * 36;
          return (
            <g key={w} className={fx.show} style={{ "--after-delay": `${250 + i * 220}ms` } as CSSProperties}>
              <path d={`M460 ${y} h146 l12 12 l-12 12 h-146 z`} className={art.body} stroke="var(--line)" strokeWidth={1.5} />
              <text x={472} y={y + 16} fontSize={12} className={`${art.label} ${i === 2 ? fx.accentText : ""}`}>
                {w}
              </text>
            </g>
          );
        })}
        <path d={`M${AAN_X + 26} 150 C 340 140, 400 120, 452 100`} className={fx.dotsAfter} style={{ "--after-delay": "100ms" } as CSSProperties} />
      </Drawing>
    </div>
  );
}
