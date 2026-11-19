"use client";

import { forwardRef } from "react";
import { AanDock } from "@/components/aan/v2/AanDock";
import { Block, Cable, FaceText, Grid, IsoStage, dockAt, makeIso, useDockSize, type Iso, type Tone } from "./kit";

/*
  The Night Watch as four stations on one plate: the store, the ads, the
  stock and Aan's brief. As the night's events happen each station turns
  coral, then periwinkle once Aan has handled it, and every station feeds the
  brief. Aan moves from station to station. The time-lapse writes --t and
  --dawn onto the root, so nothing re-renders per frame.
*/
export type NightPlace = "home" | "store" | "ads" | "warehouse";
type State = "idle" | "alert" | "handled";

const W = 760;
const H = 500;
const P = 10;
const SW = 84;

const STATIONS: { id: NightPlace; name: string; x: number }[] = [
  { id: "home", name: "Brief", x: -270 },
  { id: "store", name: "Store", x: -130 },
  { id: "ads", name: "Ads", x: 10 },
  { id: "warehouse", name: "Stock", x: 150 },
];
const SY = -SW / 2;

const toneOf = (s: State): Tone => (s === "alert" ? "risk" : s === "handled" ? "hot" : "base");

/** what stands on each station: brief sheets, price tags, ad bars, crates */
function Props({ iso, id, x, z, tone }: { iso: Iso; id: NightPlace; x: number; z: number; tone: Tone }) {
  const cx = x + SW / 2;
  if (id === "home")
    return (
      <>
        {[0, 1, 2].map((n) => (
          <Block key={n} iso={iso} x={x + 18} y={SY + 18} w={48} d={48} h={4} z={z + n * 9} tone={n === 2 ? tone : "base"} />
        ))}
      </>
    );
  if (id === "store")
    return (
      <>
        {[0, 1, 2].map((n) => (
          <Block key={n} iso={iso} x={x + 10 + n * 24} y={SY + 22} w={18} d={40} h={n === 1 ? 26 : 16} z={z} tone={n === 1 ? tone : "base"} />
        ))}
      </>
    );
  if (id === "ads")
    return (
      <>
        {[22, 34, 14].map((hh, n) => (
          <Block key={n} iso={iso} x={x + 14 + n * 20} y={SY + 30} w={14} d={14} h={hh} z={z} tone={n === 2 ? tone : "base"} />
        ))}
      </>
    );
  return (
    <>
      <Block iso={iso} x={cx - 30} y={SY + 14} w={26} d={26} h={22} z={z} />
      <Block iso={iso} x={cx + 2} y={SY + 14} w={26} d={26} h={22} z={z} tone={tone} />
      <Block iso={iso} x={cx - 30} y={SY + 44} w={26} d={26} h={22} z={z} />
    </>
  );
}

export const NightBoard = forwardRef<HTMLDivElement, { at: NightPlace; bubble: string; states: Record<NightPlace, State>; stop?: string }>(function NightBoard({ at, bubble, states, stop = "night" }, ref) {
  const iso = makeIso(410, 300);
  const { box, size } = useDockSize(24, 46, 0.075);
  const top = P + 18;
  const here = STATIONS.find((s) => s.id === at) ?? STATIONS[0];
  const aanAt = iso(here.x + SW - 16, SY + SW - 16, top);

  return (
    <div ref={ref}>
      <div ref={box}>
        <IsoStage
          w={W}
          h={H}
          label="Four stations on one plate: Aan's brief, the store, the ads and the stock. As the night's events happen each station turns coral, then periwinkle once Aan has handled it, and each one feeds the morning brief."
          dock={<AanDock stop={stop} at={at} size={size} bubble={bubble} side={at === "warehouse" ? "left" : "right"} style={dockAt(aanAt, W, H)} />}
        >
          <Block iso={iso} x={-300} y={-110} w={570} d={200} h={P} tone="plate" i={0} />
          <Grid iso={iso} x={-300} y={-110} w={570} d={200} z={P} step={57} />
          {/* every station reports to the brief */}
          {STATIONS.slice(1).map((s, i) => (
            <Cable key={s.id} iso={iso} tone={states[s.id] === "alert" ? "risk" : "hot"} path={[[s.x + SW / 2, SY + SW, P], [s.x + SW / 2, 70, P], [STATIONS[0].x + SW / 2, 70, P], [STATIONS[0].x + SW / 2, SY + SW, P]]} delay={i * 1400} dur={6400} />
          ))}
          {STATIONS.map((s, i) => {
            const tone = toneOf(states[s.id]);
            return (
              <g key={s.id}>
                <Block iso={iso} x={s.x} y={SY} w={SW} d={SW} h={18} z={P} tone={s.id === at ? "data" : "quiet"} i={1 + i}>
                  <FaceText iso={iso} x={s.x + 10} y={SY + SW} z={P + 5} face="left" size={11}>
                    {s.name}
                  </FaceText>
                </Block>
                <Props iso={iso} id={s.id} x={s.x} z={top} tone={tone} />
              </g>
            );
          })}
        </IsoStage>
      </div>
    </div>
  );
});
