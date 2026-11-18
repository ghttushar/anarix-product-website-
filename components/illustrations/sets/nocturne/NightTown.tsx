"use client";

import { forwardRef, useEffect, useRef, useState, type CSSProperties } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import { Drawing, Label, Tree, Windows, art, d, g, scallops } from "./kit";
import n from "./night-town.module.css";

/*
  The Night Watch: one account's street through one night. Aan patrols from
  building to building as the night's events happen; each building turns
  coral when something goes wrong and periwinkle once Aan has handled it.
  The moon crosses the sky and dawn lightens it at the end.
  The time-of-night variables (--t 0–1, --dawn 0–1) are written straight onto
  the root by the screen's time-lapse, so the drawing does not re-render per
  frame. viewBox 900 × 420, ground at y = 360.
*/
const W = 900;
const H = 420;
const BASE = 360;
export type NightPlace = "home" | "store" | "ads" | "warehouse";
export const PLACE_X: Record<NightPlace, number> = { home: 150, store: 360, ads: 560, warehouse: 772 };
type State = "idle" | "alert" | "handled";

export const NightTown = forwardRef<HTMLDivElement, { at: NightPlace; bubble: string; lightsOn: boolean; states: Record<NightPlace, State>; stop?: string }>(function NightTown({ at, bubble, lightsOn, states, stop = "night" }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(44);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(Math.round(Math.max(30, Math.min(56, e.contentRect.height * 0.12)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const st = (p: NightPlace) => states[p];

  return (
    <div ref={ref} className={n.night}>
      <div ref={box}>
        <Drawing
          w={W}
          h={H}
          stroke={1.6}
          label="A street at night with a home, a store, an ad billboard and a warehouse. Aan walks between them as the night's events happen."
          dock={<AanDock stop={stop} at={at} size={size} bubble={bubble} side={at === "warehouse" ? "left" : "right"} style={{ left: `${(PLACE_X[at] / W) * 100}%`, bottom: `${((H - BASE) / H) * 100}%` }} />}
        >
          {/* the moon's path (the dawn wash is the screen's own sky) */}
          <g className={n.moon}>
            <path d="M0 -16 a16 16 0 1 0 12 26 a12 12 0 1 1 -12 -26 z" className={n.moonShape} />
          </g>
          {[
            [90, 70],
            [260, 40],
            [470, 90],
            [640, 50],
            [830, 100],
          ].map(([x, y]) => (
            <path key={`${x}`} d={`M${x - 4} ${y} h8 M${x} ${y - 4} v8`} className={n.star} />
          ))}

          <g {...g(0)}>
            <line {...d()} x1={-40} y1={BASE} x2={W + 2000} y2={BASE} />
          </g>

          {/* home */}
          <g {...g(1)} data-state={st("home")} className={n.place}>
            <rect {...d(art.body)} x={74} y={262} width={150} height={BASE - 262} />
            <path {...d(`${art.body} ${n.edge}`)} d="M62 270 L149 204 L236 270" />
            <rect {...d()} x={136} y={312} width={28} height={48} />
            <rect {...d(`${art.win} ${lightsOn ? art.lit : ""}`)} x={92} y={290} width={30} height={28} />
            <rect {...d(`${art.win} ${lightsOn ? art.lit : ""}`)} x={178} y={290} width={30} height={28} />
          </g>
          <Tree x={262} base={BASE} />

          {/* store */}
          <g {...g(2)} data-state={st("store")} className={n.place}>
            <rect {...d(`${art.body} ${n.edge}`)} x={292} y={240} width={150} height={BASE - 240} />
            <rect {...d()} x={306} y={250} width={122} height={26} />
            <line {...d()} x1={292} y1={290} x2={442} y2={290} />
            <path {...d()} d={scallops(292, 442, 290, 7)} />
            <rect {...d(`${art.win} ${art.lit}`)} x={360} y={308} width={68} height={44} />
            <rect {...d()} x={306} y={308} width={28} height={52} />
          </g>
          <Label x={367} y={268} size={13}>
            Store
          </Label>

          {/* ads billboard */}
          <g {...g(3)} data-state={st("ads")} className={n.place}>
            <line {...d()} x1={510} y1={BASE} x2={510} y2={286} />
            <line {...d()} x1={610} y1={BASE} x2={610} y2={286} />
            <rect {...d(`${art.body} ${n.edge}`)} x={484} y={206} width={152} height={80} />
            <polyline {...d()} points="500,266 530,252 556,258 586,234 618,224" />
            <g className={n.pause}>
              <line x1={552} y1={222} x2={552} y2={250} />
              <line x1={566} y1={222} x2={566} y2={250} />
            </g>
          </g>
          <Label x={560} y={300} size={13}>
            Ads
          </Label>
          <Tree x={672} base={BASE} s={0.8} />

          {/* warehouse */}
          <g {...g(4)} data-state={st("warehouse")} className={n.place}>
            <rect {...d(art.body)} x={700} y={268} width={176} height={BASE - 268} />
            <path {...d(`${art.body} ${n.edge}`)} d="M690 272 L788 222 L886 272" />
            <rect {...d()} x={716} y={300} width={70} height={60} />
            <line {...d()} x1={716} y1={314} x2={786} y2={314} />
            <line {...d()} x1={716} y1={328} x2={786} y2={328} />
            <line {...d()} x1={716} y1={342} x2={786} y2={342} />
            <rect {...d()} x={804} y={334} width={24} height={26} />
            <rect {...d()} x={832} y={340} width={20} height={20} />
            <g className={n.reorder}>
              <rect x={818} y={300} width={24} height={22} rx={2} />
              <path d="M830 305 v12 M824 311 h12" />
            </g>
          </g>
          <Label x={788} y={258} size={13}>
            Warehouse
          </Label>
          <Label x={149} y={252} size={13}>
            Home
          </Label>

          {/* towers far behind, quiet */}
          <g {...g(5)} className={n.far}>
            <rect {...d()} x={450} y={120} width={44} height={86} />
            <Windows x={458} y={132} cols={2} rows={3} w={10} h={12} gx={8} gy={10} seed={2} every={4} />
            <rect {...d()} x={650} y={150} width={40} height={118} />
            <Windows x={657} y={162} cols={2} rows={4} w={10} h={12} gx={6} gy={12} seed={5} every={5} />
          </g>
        </Drawing>
      </div>
    </div>
  );
});

export type { State as NightState };
export const nightStyle = (t: number, dawn: number) => ({ "--t": t.toFixed(4), "--dawn": dawn.toFixed(3) }) as CSSProperties;
