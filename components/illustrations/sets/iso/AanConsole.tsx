"use client";

import { AanDock } from "@/components/aan/v2/AanDock";
import { Block, Cable, Cyl, FaceText, Grid, IsoStage, Ring, Tag, dockAt, isoCss, makeIso, useDockSize, type P3 } from "./kit";

/*
  Aan: four sources of your data (sales, ads, stock, profit) wired into one
  plinth, and Aan standing on it, large. Ask in plain words; the answer is
  built from these. The portrait of the set.
*/
const W = 560;
const H = 500;
const P = 10;

const SOURCES: { name: string; x: number; y: number; h: number; face: "left" | "right" }[] = [
  { name: "Sales", x: -150, y: -20, h: 40, face: "left" },
  { name: "Ads", x: -150, y: 74, h: 28, face: "left" },
  { name: "Stock", x: -20, y: -150, h: 34, face: "right" },
  { name: "Profit", x: 74, y: -150, h: 46, face: "right" },
];
const CORE = { x: 36, y: 36, r: 40 };

export function AanConsole({ stop = "aan", bubble }: { stop?: string; bubble?: string }) {
  const iso = makeIso(282, 300);
  const { box, size } = useDockSize(46, 92, 0.13);
  const top = P + 18;
  const aanAt = iso(CORE.x, CORE.y, top);
  const wire = (s: (typeof SOURCES)[number]): P3[] =>
    s.face === "left"
      ? [
          [s.x + 46, s.y + 23, P],
          [CORE.x - CORE.r + 4, s.y + 23, P],
          [CORE.x - CORE.r + 4, CORE.y, P],
        ]
      : [
          [s.x + 23, s.y + 46, P],
          [s.x + 23, CORE.y - CORE.r + 4, P],
          [CORE.x, CORE.y - CORE.r + 4, P],
        ];
  return (
    <div ref={box}>
      <IsoStage
        w={W}
        h={H}
        label="Aan stands on a round plinth at the centre of a plate. Four blocks at the back, your sales, ads, stock and profit, are wired into it: every answer Aan gives is built from them."
        dock={<AanDock stop={stop} size={size} bubble={bubble} side="right" style={dockAt(aanAt, W, H)} />}
      >
        <Block iso={iso} x={-160} y={-160} w={320} d={320} h={P} tone="plate" i={0} />
        <Grid iso={iso} x={-160} y={-160} w={320} d={320} z={P} step={40} />
        {SOURCES.map((s, i) => (
          <Cable key={`w-${s.name}`} iso={iso} path={wire(s)} delay={i * 1100} dur={5600} />
        ))}
        {SOURCES.map((s, i) => (
          <Block key={s.name} iso={iso} x={s.x} y={s.y} w={46} d={46} h={s.h} z={P} power="hot" lift={300 + i * 200} i={1 + i}>
            {s.face === "left" ? (
              <FaceText iso={iso} x={s.x + 7} y={s.y + 46} z={P + 8} face="left" size={11}>
                {s.name}
              </FaceText>
            ) : (
              <FaceText iso={iso} x={s.x + 46} y={s.y + 39} z={P + 8} face="right" size={11}>
                {s.name}
              </FaceText>
            )}
          </Block>
        ))}
        <Ring iso={iso} x={CORE.x} y={CORE.y} r={CORE.r + 22} z={P} className={isoCss.ringHot} />
        <Cyl iso={iso} x={CORE.x} y={CORE.y} r={CORE.r} h={18} z={P} power="hot" lift={200} i={6} />
        <Tag at={[iso(-160, 160, 0)[0] - 4, iso(-160, 160, 0)[1] + 84]} to={iso(-104, 120, P)} sub="Every answer is built from them" i={0}>
          Your data, wired in
        </Tag>
      </IsoStage>
    </div>
  );
}
