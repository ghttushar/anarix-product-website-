"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import { Drawing, art, d, g } from "./kit";
import h from "./home-at-night.module.css";

/*
  AI for good: your nights back. A home under the moon; when Aan arrives at the
  door, the last light goes out. The seller is asleep and Aan keeps watch.
  viewBox 420 × 240, ground at y = 224.
*/
const W = 420;
const H = 240;
const BASE = 224;
const AAN_X = 272;

export function HomeAtNight({ stop = "good", bubble }: { stop?: string; bubble?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(40);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(Math.round(Math.max(28, Math.min(52, e.contentRect.height * 0.18)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box}>
      <Drawing
        w={W}
        h={H}
        stroke={1.5}
        label="A home under the moon. Aan stands at the door and the last light inside goes out."
        dock={<AanDock stop={stop} size={size} bubble={bubble} side="right" style={{ left: `${(AAN_X / W) * 100}%`, bottom: `${((H - BASE) / H) * 100}%` }} />}
      >
        <g {...g(0)}>
          <line {...d()} x1={-60} y1={BASE} x2={W + 60} y2={BASE} />
        </g>
        <g {...g(1)}>
          <path {...d()} d="M352 34 a20 20 0 1 0 15 32 a15 15 0 1 1 -15 -32 z" />
          <path {...d()} d="M300 40 h8 M304 36 v8 M396 96 h8 M400 92 v8" />
        </g>
        <g {...g(2)}>
          <rect {...d(art.body)} x={92} y={130} width={160} height={BASE - 130} />
          <path {...d(art.body)} d="M80 138 L172 74 L264 138" />
          <path {...d()} d="M200 93.5 V84 H218 V106" />
          <rect {...d()} x={158} y={172} width={30} height={52} />
          <rect {...d(art.win)} x={110} y={152} width={32} height={30} />
          <rect {...d(`${art.win} ${art.lit} ${h.lastLight}`)} x={204} y={152} width={32} height={30} style={{ "--lit-delay": "1.2s" } as CSSProperties} />
          <line {...d()} x1={126} y1={152} x2={126} y2={182} />
          <line {...d()} x1={220} y1={152} x2={220} y2={182} />
        </g>
      </Drawing>
    </div>
  );
}
