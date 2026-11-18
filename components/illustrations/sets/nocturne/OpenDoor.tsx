"use client";

import { useEffect, useRef, useState } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import { Drawing, art, d, g } from "./kit";

/*
  The close: the door is open. A small shopfront at night with its door swung
  in and the doorway lit; Aan waits on the step beside it.
  viewBox 360 × 150, ground at y = 140.
*/
const W = 360;
const H = 150;
const BASE = 140;
const AAN_X = 262;

export function OpenDoor({ stop = "close", bubble }: { stop?: string; bubble?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(40);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(Math.round(Math.max(28, Math.min(46, e.contentRect.height * 0.3)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box}>
      <Drawing
        w={W}
        h={H}
        label="A small shopfront at night with its door open and the doorway lit. Aan waits on the step beside it."
        dock={<AanDock stop={stop} size={size} bubble={bubble} side="right" style={{ left: `${(AAN_X / W) * 100}%`, bottom: `${((H - BASE) / H) * 100}%` }} />}
      >
        <g {...g(0)}>
          <line {...d()} x1={0} y1={BASE} x2={W} y2={BASE} />
        </g>
        <g {...g(1)}>
          <path {...d(art.body)} d={`M24 ${BASE} V24 H222 V${BASE}`} />
          <line {...d()} x1={24} y1={38} x2={222} y2={38} />
        </g>
        <g {...g(2)}>
          {/* the window */}
          <rect {...d()} x={46} y={62} width={58} height={44} />
          <line {...d()} x1={75} y1={62} x2={75} y2={106} />
          {/* the doorway, lit, and the door swung in */}
          <rect {...d(`${art.win} ${art.lit}`)} x={136} y={58} width={46} height={BASE - 58} />
          <path {...d()} d={`M182 58 L204 66 V${BASE - 6} L182 ${BASE}`} />
          <line {...d()} x1={198} y1={100} x2={198} y2={106} />
          {/* the lamp over the door */}
          <path {...d()} d="M159 38 V44 M152 50 h14 l-3 -6 h-8 z" />
        </g>
      </Drawing>
    </div>
  );
}
