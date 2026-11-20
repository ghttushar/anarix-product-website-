"use client";

import { AanDock } from "@/components/aan/v2/AanDock";
import { Block, Cable, Grid, IsoStage, Tag, dockAt, makeIso, useDockSize } from "./kit";

/*
  AI for good, as a system: proposed changes run along a lane to the gate of
  your rules. What the rules allow goes live; what is over your limit waits
  on the approval tray for your yes; everything is written to the log with
  its reason. Aan stands on the gate.
*/
const W = 760;
const H = 540;
const P = 10;
const LANE = { y: -26, d: 52 };

export function Guardrails({ stop = "good", bubble, dock = true }: { stop?: string; bubble?: string; dock?: boolean }) {
  const iso = makeIso(372, 286);
  const { box, size } = useDockSize(24, 44, 0.075);
  const gate = { x: -30, w: 18 };
  const beamZ = P + 96;
  const aanAt = iso(gate.x + gate.w / 2, 0, beamZ + 12);
  const lane = P + 6;
  return (
    <div ref={box}>
      <IsoStage
        w={W}
        h={H}
        label="Proposed changes run along a lane to a gate labelled with your rules. Allowed changes pass through and go live. One change over your limit waits on an approval tray. Every action is stacked in a log with its reason. Aan stands on the gate."
        dock={dock ? <AanDock stop={stop} size={size} bubble={bubble} side="right" style={dockAt(aanAt, W, H)} /> : undefined}
      >
        <Block iso={iso} x={-250} y={-120} w={480} d={230} h={P} tone="plate" i={0} />
        <Grid iso={iso} x={-250} y={-120} w={480} d={230} z={P} step={48} />

        {/* the log, at the back: every action, with its reason */}
        {[0, 1, 2, 3].map((n) => (
          <Block key={n} iso={iso} x={110} y={-104} w={88} d={56} h={5} z={P + n * 11} tone={n === 3 ? "data" : "base"} i={1 + n} />
        ))}
        <Cable iso={iso} path={[[gate.x + gate.w + 10, LANE.y, P], [gate.x + gate.w + 10, -76, P], [110, -76, P]]} dur={6200} delay={1800} />

        {/* the gate: back post */}
        <Block iso={iso} x={gate.x} y={LANE.y - 22} w={gate.w} d={14} h={beamZ - P} z={P} i={6} />
        {/* the lane */}
        <Block iso={iso} x={-236} y={LANE.y} w={452} d={LANE.d} h={6} z={P} tone="quiet" i={5} />

        {/* waiting changes */}
        {[-214, -168, -122].map((x, n) => (
          <Block key={x} iso={iso} x={x} y={LANE.y + 12} w={28} d={28} h={26} z={lane} i={7 + n} />
        ))}
        {/* allowed, live */}
        {[40, 92, 144].map((x, n) => (
          <Block key={x} iso={iso} x={x} y={LANE.y + 12} w={28} d={28} h={26} z={lane} power="hot" lift={500 + n * 220} i={10 + n} />
        ))}
        {/* the gate: front post and beam */}
        <Block iso={iso} x={gate.x} y={LANE.y + LANE.d + 8} w={gate.w} d={14} h={beamZ - P} z={P} i={13} />
        <Block iso={iso} x={gate.x} y={LANE.y - 22} w={gate.w} d={LANE.d + 44} h={14} z={beamZ} power="hot" lift={300} i={14} />

        {/* over the limit: waits for your yes */}
        <Block iso={iso} x={-60} y={66} w={76} d={34} h={6} z={P} tone="quiet" i={15} />
        <Block iso={iso} x={-38} y={70} w={28} d={26} h={24} z={P + 6} tone="risk" i={16} />

        <Tag at={[34, 92]} to={iso(-200, LANE.y + 26, lane + 26)} sub="Every change Aan proposes" i={0}>
          Proposed
        </Tag>
        <Tag at={[176, 404]} to={iso(-24, 96, P + 6)} tone="risk" sub="Over your limit, it waits" i={1}>
          Your yes
        </Tag>
        <Tag at={[iso(216, LANE.y, 0)[0] + 18, iso(216, LANE.y, 0)[1] + 50]} to={iso(172, LANE.y + 40, lane + 26)} tone="hot" sub="Allowed by your rules" i={2}>
          Live
        </Tag>
        <Tag at={[548, 196]} to={iso(150, -96, P + 38)} sub="Every action, with its reason" i={3}>
          Logged
        </Tag>
      </IsoStage>
    </div>
  );
}
