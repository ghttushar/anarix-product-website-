"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import { useScreen } from "@/components/layout/Screen";
import art from "../../lineart.module.css";
import s from "./street.module.css";

/*
  The street that never closes: the three marketplaces as storefronts, the ad
  billboard, the warehouse and the towers of the city behind. On first arrival
  Aan walks the patrol line to the one store that needs him; the dotted trail
  follows the walk, and the store's window turns coral when Aan reaches it.
  viewBox 1600 × 420, street baseline at y = 380. The baseline and the lane
  run far past the viewBox so the street is full-bleed at any width.
*/
const W = 1600;
const H = 420;
const BASE = 380;
const AAN_X = 606; // in front of the Shopify display window
const WALK_FROM = 40;

const g = (i: number) => ({ style: { "--i": i } as CSSProperties });
/** a stroke that draws itself: pathLength 1 + the draw class */
const d = (cls?: string) => ({ pathLength: 1, className: cls ? `${art.d} ${cls}` : art.d });

function scallops(x0: number, x1: number, y: number, n: number) {
  const step = (x1 - x0) / n;
  const r = step / 2;
  let d = `M${x0} ${y}`;
  for (let k = 0; k < n; k++) d += ` a${r} ${r} 0 0 0 ${step} 0`;
  return d;
}

function Windows({ x, y, cols, rows, w = 14, h = 18, gx = 12, gy = 10, seed = 0 }: { x: number; y: number; cols: number; rows: number; w?: number; h?: number; gx?: number; gy?: number; seed?: number }) {
  const out = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const lit = (r * 7 + c * 3 + seed) % 6 === 0;
      out.push(<rect {...d(`${art.win} ${lit ? art.lit : ""}`)} key={`${r}-${c}`} x={x + c * (w + gx)} y={y + r * (h + gy)} width={w} height={h} />);
    }
  return <>{out}</>;
}

function Tree({ x, s: k = 1 }: { x: number; s?: number }) {
  return (
    <>
      <line {...d()} x1={x} y1={BASE} x2={x} y2={BASE - 30 * k} />
      <ellipse {...d(art.body)} cx={x} cy={BASE - 48 * k} rx={15 * k} ry={22 * k} />
      <line {...d()} x1={x} y1={BASE - 30 * k} x2={x} y2={BASE - 52 * k} />
    </>
  );
}

function Store({ x, w, h, name, awning, children }: { x: number; w: number; h: number; name: string; awning: number; children?: React.ReactNode }) {
  const top = BASE - h;
  return (
    <>
      <rect {...d(art.body)} x={x} y={top} width={w} height={h} />
      <rect {...d()} x={x + 16} y={top + 12} width={w - 32} height={32} />
      <text x={x + w / 2} y={top + 33} textAnchor="middle" fontSize="15" className={art.label}>
        {name}
      </text>
      {awning > 0 ? (
        <>
          <line {...d()} x1={x} y1={top + 56} x2={x + w} y2={top + 56} />
          <path {...d()} d={scallops(x, x + w, top + 56, awning)} />
        </>
      ) : (
        <rect {...d()} x={x} y={top + 52} width={w} height={10} />
      )}
      {children}
    </>
  );
}

export function Street({ stop = "hero", bubble, className }: { stop?: string; bubble?: string; className?: string }) {
  const { inView, arrived, walk } = useScreen();
  const box = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState({ w: 1200, h: 315 });

  // Aan scales with the drawing (about 13% of the street's height); the walk
  // distance follows the drawing's width
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setFrame({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const aanSize = Math.round(Math.max(30, Math.min(72, frame.h * 0.13)));
  const walkDx = Math.round(((WALK_FROM - AAN_X) / W) * frame.w);

  const dots = [];
  for (let x = WALK_FROM + 22; x < AAN_X - 26; x += 16) dots.push(x);

  return (
    <div
      className={`${s.street} ${className ?? ""}`}
      data-play={inView ? "true" : "false"}
      data-walking={walk.on ? "true" : "false"}
      data-arrived={arrived ? "true" : "false"}
      style={{ "--walk-delay": `${walk.delay}ms`, "--walk-dur": `${walk.duration}ms` } as CSSProperties}
    >
      <div ref={box} className={s.box}>
        <svg className={art.art} viewBox={`0 0 ${W} ${H}`} data-play={inView ? "true" : "false"} role="img" aria-label="A street of storefronts at night: Amazon, Walmart and Shopify stores, an ad billboard, a warehouse with a truck, and towers behind. Aan stands at the Shopify store.">
          {/* the street itself */}
          <g {...g(0)}>
            <line {...d()} x1={-3000} y1={BASE} x2={W + 3000} y2={BASE} />
          </g>

          {/* towers behind, drawn first so the low buildings sit in front */}
          <g {...g(5)}>
            <rect {...d(art.body)} x={1056} y={96} width={92} height={BASE - 96} />
            <Windows x={1068} y={110} cols={3} rows={6} seed={1} />
            <rect {...d(art.body)} x={1166} y={52} width={82} height={BASE - 52} />
            <line {...d()} x1={1207} y1={52} x2={1207} y2={16} />
            <Windows x={1176} y={66} cols={3} rows={7} w={13} seed={2} />
          </g>
          <g {...g(6)}>
            <rect {...d(art.body)} x={1352} y={140} width={98} height={BASE - 140} />
            <Windows x={1364} y={156} cols={3} rows={7} w={16} seed={3} />
            <rect {...d(art.body)} x={1468} y={84} width={106} height={BASE - 84} />
            <rect {...d(art.body)} x={1494} y={62} width={54} height={22} />
            <line {...d()} x1={1521} y1={62} x2={1521} y2={30} />
            <Windows x={1480} y={100} cols={4} rows={9} w={14} h={16} gx={11} seed={4} />
          </g>

          {/* the three marketplaces */}
          <g {...g(1)}>
            <Tree x={34} />
            <Store x={66} w={210} h={150} name="Amazon" awning={10}>
              <rect {...d(`${art.win} ${art.lit}`)} x={82} y={308} width={56} height={50} />
              <line {...d()} x1={110} y1={308} x2={110} y2={358} />
              <rect {...d(art.win)} x={204} y={308} width={56} height={50} />
              <line {...d()} x1={232} y1={308} x2={232} y2={358} />
              <rect {...d()} x={154} y={318} width={34} height={62} />
              <line {...d()} x1={171} y1={318} x2={171} y2={380} />
            </Store>
          </g>
          <g {...g(2)}>
            <Store x={300} w={200} h={164} name="Walmart" awning={0}>
              <rect {...d(art.win)} x={312} y={296} width={46} height={58} />
              <rect {...d(`${art.win} ${art.lit}`)} x={442} y={296} width={46} height={58} />
              <rect {...d()} x={368} y={310} width={64} height={70} />
              <line {...d()} x1={400} y1={310} x2={400} y2={380} />
            </Store>
          </g>
          <g {...g(3)}>
            <Store x={524} w={196} h={150} name="Shopify" awning={9}>
              <rect {...d()} x={540} y={318} width={32} height={62} />
              {/* the display window that needs Aan tonight */}
              <rect {...d(s.alert)} x={590} y={304} width={114} height={60} />
              <rect {...d()} x={630} y={322} width={30} height={32} />
              <path {...d()} d="M660 322 l14 -8 l8 6" />
            </Store>
          </g>

          {/* ads: the billboard over a low building */}
          <g {...g(4)}>
            <rect {...d(art.body)} x={760} y={296} width={182} height={BASE - 296} />
            <rect {...d(art.win)} x={776} y={316} width={28} height={30} />
            <rect {...d(`${art.win} ${art.lit}`)} x={818} y={316} width={28} height={30} />
            <rect {...d(art.win)} x={860} y={316} width={28} height={30} />
            <rect {...d(art.win)} x={902} y={316} width={28} height={30} />
            <line {...d()} x1={796} y1={296} x2={796} y2={236} />
            <line {...d()} x1={906} y1={296} x2={906} y2={236} />
            <rect {...d(art.body)} x={752} y={150} width={198} height={86} />
            <polyline {...d()} points="772,214 802,200 828,206 858,182 886,188 918,162" />
            <path {...d()} d="M906 160 l12 2 l-3 12" />
          </g>

          {/* the warehouse, its loading door and the truck at the dock */}
          <g {...g(7)}>
            <Tree x={968} />
            <Tree x={992} s={0.8} />
            <rect {...d(art.body)} x={1012} y={290} width={318} height={BASE - 290} />
            <path {...d(art.body)} d="M1000 294 L1171 228 L1342 294" />
            <rect {...d()} x={1036} y={318} width={112} height={62} />
            <line {...d()} x1={1036} y1={332} x2={1148} y2={332} />
            <line {...d()} x1={1036} y1={346} x2={1148} y2={346} />
            <line {...d()} x1={1036} y1={360} x2={1148} y2={360} />
            <rect {...d()} x={1160} y={352} width={26} height={28} />
            <rect {...d()} x={1190} y={358} width={22} height={22} />
            <rect {...d(art.body)} x={1218} y={326} width={76} height={44} />
            <path {...d(art.body)} d="M1294 340 L1318 340 L1332 356 L1332 370 L1294 370 Z" />
            <circle {...d(art.body)} cx={1240} cy={372} r={8} />
            <circle {...d(art.body)} cx={1312} cy={372} r={8} />
          </g>

          {/* lane markings fade in last */}
          <line x1={-3000} y1={402} x2={W + 3000} y2={402} className={s.lane} />

          {/* the patrol line Aan has walked */}
          {dots.map((x) => (
            <circle key={x} cx={x} cy={BASE - 7} r={2.6} className={s.dot} style={{ "--k": (x - WALK_FROM) / (AAN_X - WALK_FROM) } as CSSProperties} />
          ))}
        </svg>

        <AanDock
          stop={stop}
          size={aanSize}
          bubble={bubble}
          side="left"
          entry={{ dx: walkDx, delay: 1900, duration: 1600 }}
          style={{ left: `${(AAN_X / W) * 100}%`, bottom: `${((H - BASE) / H) * 100}%` }}
        />
      </div>
    </div>
  );
}
