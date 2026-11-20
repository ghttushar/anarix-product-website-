"use client";

import { AanDock } from "@/components/aan/v2/AanDock";
import { Block, Callout, IsoStage, Tag, dockAt, makeIso, useDockSize } from "./kit";
import r from "./rule-gate.module.css";

/*
  Rules: changes ride a conveyor through the gate of your rule. What the rule
  allows rolls on and goes live (periwinkle); the one it stops drops into the
  tray in front of the gate (coral). Aan stands on the gate. `sorting` changes
  each time a new rule is applied, to replay the drop.
*/
const W = 900;
const H = 560;
const BELT = { y: -34, d: 68, h: 14 };
const GATE_X = -12;
const CUBE = 30;
const BEFORE = [-330, -270, -210, -150, -90];
const AFTER = [70, 130, 190, 250, 310];

export function RuleGate({ stops, label, stop = "rules", bubble, sorting, rule, dock = true }: { stops: number; label: string; stop?: string; bubble?: string; sorting?: string; /** the rule on the gate's sign */ rule?: string; dock?: boolean }) {
  const iso = makeIso(452, 300);
  const { box, size } = useDockSize(22, 44, 0.075);
  const top = BELT.h;
  const beamZ = top + 104;
  const aanAt = iso(GATE_X + 11, BELT.y + BELT.d / 2, beamZ + 14);
  const cy = BELT.y + (BELT.d - CUBE) / 2;
  return (
    <div ref={box}>
      <IsoStage
        w={W}
        h={H}
        className={r.gate}
        label={`A conveyor of proposed changes runs through a gate that carries your rule. Allowed changes roll on and go live. The change the rule stops drops into a tray in front of the gate: ${label}. Aan stands on the gate.`}
        dock={dock ? <AanDock stop={stop} size={size} bubble={bubble} side="right" style={dockAt(aanAt, W, H)} /> : undefined}
        html={<Callout key={`s-${sorting}`} to={iso(GATE_X + 13, BELT.y + BELT.d + 71, 8)} w={W} h={H} title={`Stopped: ${label}`} sub={rule} below lift={26} mono={false} />}
      >
        {/* back post */}
        <Block iso={iso} x={GATE_X} y={BELT.y - 30} w={22} d={18} h={beamZ} i={0} />
        {/* the belt */}
        <Block iso={iso} x={-380} y={BELT.y} w={760} d={BELT.d} h={BELT.h} tone="quiet" i={2} />
        {[-300, -200, -100, 0, 100, 200, 300].map((x) => (
          <path key={x} d={`M${iso(x, BELT.y, top).join(",")} L${iso(x, BELT.y + BELT.d, top).join(",")}`} className={r.slat} />
        ))}

        {/* waiting */}
        {BEFORE.map((x, n) => (
          <Block key={x} iso={iso} x={x} y={cy} w={CUBE} d={CUBE} h={CUBE} z={top} i={3 + n} />
        ))}
        {/* allowed: live */}
        {AFTER.map((x, n) =>
          n === stops ? null : <Block key={x} iso={iso} x={x} y={cy} w={CUBE} d={CUBE} h={CUBE} z={top} power="hot" lift={400 + n * 180} i={8 + n} />,
        )}

        {/* front post, beam and sign */}
        <Block iso={iso} x={GATE_X} y={BELT.y + BELT.d + 12} w={22} d={18} h={beamZ} i={13} />
        <Block iso={iso} x={GATE_X} y={BELT.y - 30} w={22} d={BELT.d + 60} h={16} z={beamZ} power="hot" lift={200} i={14} />

        {/* stopped: in the tray */}
        <Block iso={iso} x={GATE_X - 30} y={BELT.y + BELT.d + 44} w={84} d={56} h={8} tone="quiet" i={15} />
        <g key={sorting} className={r.drop}>
          <Block iso={iso} x={GATE_X - 2} y={BELT.y + BELT.d + 56} w={CUBE} d={CUBE} h={CUBE} z={8} tone="risk" i={16} />
        </g>

        <Tag at={[16, 52]} sub="Bids, budgets, keywords" i={0}>
          Proposed changes
        </Tag>
        <Tag at={[iso(380, BELT.y, 0)[0] - 4, iso(380, BELT.y, 0)[1] + 52]} to={iso(325, BELT.y + BELT.d / 2, top + CUBE)} tone="hot" sub="Allowed by your rule" anchor="end" i={1}>
          Live
        </Tag>
      </IsoStage>
    </div>
  );
}
