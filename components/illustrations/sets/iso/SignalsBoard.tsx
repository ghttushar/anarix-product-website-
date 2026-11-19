"use client";

import { AanDock } from "@/components/aan/v2/AanDock";
import { SIGNALS } from "@/content/products/samples";
import { Block, Cable, Callout, Cyl, FaceText, Grid, IsoStage, Tag, dockAt, isoCss, makeIso, useDockSize, type P3 } from "./kit";

/*
  Signals: every store is a row of what can change overnight (price, Buy Box,
  ads). One tile turns coral; its packet runs into the Anarix core, and the
  alert comes out ranked by the money at risk. Aan sits on the core.
*/
const W = 760;
const H = 500;

const ROW_D = 70;
const ROWS = SIGNALS.map((s, i) => ({ s, y: -138 + i * 96 }));
const KINDS = ["Price", "Buy Box", "Ads"];
/** which tile each sample signal is about */
const KIND_OF: Record<string, number> = { Amazon: 2, Walmart: 1, Shopify: 0 };

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export function SignalsBoard({ pick = 0, handled = false, stop = "signals", bubble, dock = true, callout = true }: { pick?: number; handled?: boolean; stop?: string; bubble?: string; dock?: boolean; /** off where an alert card already says it */ callout?: boolean }) {
  const iso = makeIso(380, 286);
  const P = 12; // plate top
  const { box, size } = useDockSize(22, 42, 0.08);
  const core = { x: 112, y: -118, w: 76, d: 76, h: 44 };
  const coreTop = P + core.h;
  const aanAt = iso(core.x + core.w / 2, core.y + core.d / 2, coreTop + 10);
  const sig = SIGNALS[pick];
  const row = ROWS[pick];
  const kind = KIND_OF[sig.store];
  const tileX = (k: number) => -126 + k * 44;
  const tx = tileX(kind) + 14;
  const ty = row.y + 13 + 22;
  const lane = row.y + ROW_D + 12;
  const route: P3[] = [
    [tx, row.y + 13 + 44, P],
    [tx, lane, P],
    [60, lane, P],
    [60, core.y + core.d / 2, P],
    [core.x, core.y + core.d / 2, P],
  ];
  const tone = handled ? "hot" : "risk";

  return (
    <div ref={box}>
      <IsoStage
        w={W}
        h={H}
        label={`Three stores, Amazon, Walmart and Shopify, each a row of tiles for price, Buy Box and ads. On ${sig.store}, the ${KINDS[kind]} tile has turned coral: ${sig.title}, ${money(sig.risk)} at risk. A line runs from it into the Anarix core, where Aan sits, and out to a stack of alerts ranked by money at risk.`}
        dock={dock ? <AanDock stop={stop} size={size} bubble={bubble} side="right" style={dockAt(aanAt, W, H)} /> : undefined}
        html={callout ? <Callout key={`k-${pick}-${tone}`} to={iso(tx, ty, P + 8 + 26)} w={W} h={H} title={sig.title} sub={`${money(sig.risk)} ${handled ? "protected" : "at risk"}`} tone={tone} /> : undefined}
      >
        <Block iso={iso} x={-230} y={-150} w={460} d={300} h={P} tone="plate" i={0} />
        <Grid iso={iso} x={-230} y={-150} w={460} d={300} z={P} step={50} />
        <Cable key={`c-${pick}`} iso={iso} path={route} tone="risk" dur={4800} delay={200} />

        {/* the stores */}
        {ROWS.map((r, i) => (
          <g key={r.s.store}>
            <Block iso={iso} x={-215} y={r.y} w={212} d={ROW_D} h={8} z={P} tone="quiet" i={1 + i} />
            <FaceText iso={iso} x={-208} y={r.y + 46} z={P + 8} face="top" size={13}>
              {r.s.store}
            </FaceText>
            {KINDS.map((k, j) => {
              const isIt = i === pick && j === kind;
              return <Block key={k} iso={iso} x={tileX(j)} y={r.y + 13} w={30} d={44} h={isIt ? 26 : 16} z={P + 8} tone={isIt ? tone : "base"} i={2 + i} lift={0} />;
            })}
          </g>
        ))}

        {/* what changed, under the stores, into the core */}
        <Cable iso={iso} path={[[core.x + core.w / 2, core.y + core.d, P], [core.x + core.w / 2, 40, P]]} dur={4800} delay={2600} />

        {/* what each column of tiles watches, in front of the last row */}
        {KINDS.map((k, j) => {
          const [lx, ly] = iso(tileX(j) + 15, ROWS[2].y + ROW_D + 6, P);
          return (
            <text key={k} x={lx} y={ly + 16} textAnchor="middle" className={isoCss.colLabel}>
              {k}
            </text>
          );
        })}

        {/* the Anarix core, Aan on top */}
        <Block iso={iso} x={core.x} y={core.y} w={core.w} d={core.d} h={core.h} z={P} power="hot" i={5} lift={500}>
          <FaceText iso={iso} x={core.x + 12} y={core.y + core.d} z={P + 14} face="left" size={13}>
            Anarix
          </FaceText>
        </Block>
        <Cyl iso={iso} x={core.x + core.w / 2} y={core.y + core.d / 2} r={20} h={10} z={coreTop} power="hot" i={6} lift={700} />

        {/* the alerts, ranked */}
        {[0, 1, 2].map((n) => (
          <Block key={n} iso={iso} x={116} y={40} w={70} d={80} h={6} z={P + n * 13} tone={n === 2 ? tone : "base"} i={6 + n} />
        ))}
        <Tag at={[iso(186, 120, 0)[0] + 40, iso(186, 120, 0)[1] + 20]} to={iso(186, 100, P + 32)} sub="Ranked by money at risk" i={1}>
          Alerts
        </Tag>

      </IsoStage>
    </div>
  );
}
