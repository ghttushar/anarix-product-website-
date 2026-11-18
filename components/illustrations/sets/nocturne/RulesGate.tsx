"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import { Drawing, Label, art, d, fx, g } from "./kit";

/*
  Rules: your playbook at the gate. Spend rides a belt through a gate Aan
  keeps; what your rules allow rolls on, waste drops into the stopped bin.
  viewBox 640 × 210, belt at y = 150.
*/
const W = 640;
const H = 210;
const BELT = 150;
const GATE = 336;

export function RulesGate({ stop = "rules", bubble }: { stop?: string; bubble?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(36);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(Math.round(Math.max(26, Math.min(44, e.contentRect.height * 0.2)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const parcel = (x: number, cls?: string) => <rect {...d(cls ? `${art.body} ${cls}` : art.body)} x={x} y={BELT - 24} width={24} height={22} rx={2} />;

  return (
    <div ref={box}>
      <Drawing
        w={W}
        h={H}
        label="A conveyor carries spend through a gate. Allowed spend rolls on to the right; waste drops into a stopped bin. Aan keeps the gate."
        dock={<AanDock stop={stop} size={size} bubble={bubble} side="left" style={{ left: `${(GATE / W) * 100}%`, bottom: `${((H - 92) / H) * 100}%` }} />}
      >
        {/* the belt and its legs */}
        <g {...g(0)}>
          <line {...d()} x1={16} y1={BELT} x2={W - 16} y2={BELT} />
          <line {...d()} x1={16} y1={BELT + 10} x2={W - 16} y2={BELT + 10} />
          {[44, 124, 204, 284, 476, 556].map((x) => (
            <circle key={x} {...d()} cx={x} cy={BELT + 5} r={4} />
          ))}
          <line {...d()} x1={30} y1={BELT + 10} x2={30} y2={H - 4} />
          <line {...d()} x1={W - 30} y1={BELT + 10} x2={W - 30} y2={H - 4} />
        </g>

        {/* spend waiting for the gate */}
        <g {...g(1)}>
          {parcel(58)}
          {parcel(130)}
          {parcel(202)}
          {parcel(274)}
        </g>

        {/* the gate */}
        <g {...g(2)}>
          <line {...d()} x1={GATE - 18} y1={BELT} x2={GATE - 18} y2={92} />
          <line {...d()} x1={GATE + 18} y1={BELT} x2={GATE + 18} y2={92} />
          <line {...d()} x1={GATE - 24} y1={92} x2={GATE + 24} y2={92} />
          <circle {...d(fx.hot)} cx={GATE} cy={106} r={5} />
        </g>

        {/* the stopped bin under the belt, past the gate */}
        <g {...g(3)}>
          <path {...d()} d={`M372 ${BELT + 10} L380 ${H - 6} L448 ${H - 6} L456 ${BELT + 10}`} />
          <g className={fx.show} style={{ "--after-delay": "350ms" } as CSSProperties}>
            <rect x={400} y={H - 30} width={24} height={22} rx={2} className={`${art.body} ${fx.coral}`} strokeWidth={1.5} />
            <path d={`M404 ${H - 26} l16 14 M420 ${H - 26} l-16 14`} className={fx.coral} strokeWidth={1.5} />
          </g>
        </g>

        {/* allowed spend rolling on */}
        <g {...g(4)}>
          {parcel(484, fx.hot)}
          {parcel(556, fx.hot)}
        </g>

        <Label x={W - 16} y={BELT - 38} anchor="end" size={12} className={fx.accentText}>
          Allowed
        </Label>
        <Label x={468} y={H - 14} anchor="start" size={12} className={fx.riskText}>
          Stopped
        </Label>
      </Drawing>
    </div>
  );
}
