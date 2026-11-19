"use client";

import { AanDock } from "@/components/aan/v2/AanDock";
import { Block, Cable, Cyl, FaceText, Grid, IsoStage, Ring, Shadow, Tag, dockAt, isoCss, makeIso, useDockSize, type P3 } from "./kit";

/*
  The platform as an exploded stack, read bottom to top:
  every marketplace → one data layer → the tools, with Aan on top.
  Used on the homepage hero (and, lit module by module, in Night Watch).
*/
const W = 780;
const H = 660;
const S = 236; // slab side
const GAP = 150; // between layers
const T = 10; // slab thickness
const half = S / 2;

export type StackModule = "signals" | "profitability" | "rules" | "mcp";

const STORES = ["Amazon", "Walmart", "Shopify"];
const LAYERS: { title: string; sub: string; z: number; tone?: "hot" }[] = [
  { title: "Four tools, one AI", sub: "Signals, Profitability, Rules, MCP", z: GAP * 2 },
  { title: "One data layer", sub: "Sales, ads, inventory, profit", z: GAP, tone: "hot" },
  { title: "Every marketplace", sub: "Amazon, Walmart, Shopify", z: 0 },
];

/** each tool wears its own mark on top: the tiles, the stack, the gate, the pins */
function ToolMark({ iso, id, x, y, z }: { iso: ReturnType<typeof makeIso>; id: StackModule; x: number; y: number; z: number }) {
  if (id === "signals")
    return (
      <>
        <Block iso={iso} x={x + 8} y={y + 16} w={9} d={24} h={6} z={z} />
        <Block iso={iso} x={x + 20} y={y + 16} w={9} d={24} h={11} z={z} tone="risk" />
        <Block iso={iso} x={x + 32} y={y + 16} w={9} d={24} h={6} z={z} />
      </>
    );
  if (id === "profitability")
    return (
      <>
        <Block iso={iso} x={x + 10} y={y + 12} w={28} d={30} h={8} z={z} tone="hot" />
        <Block iso={iso} x={x + 10} y={y + 12} w={28} d={30} h={5} z={z + 11} tone="risk" />
      </>
    );
  if (id === "rules")
    return (
      <>
        <Block iso={iso} x={x + 20} y={y + 10} w={7} d={7} h={18} z={z} />
        <Block iso={iso} x={x + 20} y={y + 40} w={7} d={7} h={18} z={z} />
        <Block iso={iso} x={x + 20} y={y + 10} w={7} d={37} h={5} z={z + 18} tone="hot" />
      </>
    );
  return (
    <>
      <Cyl iso={iso} x={x + 17} y={y + 22} r={4} h={12} z={z} power="hot" />
      <Cyl iso={iso} x={x + 31} y={y + 34} r={4} h={12} z={z} power="hot" />
    </>
  );
}

export function PlatformStack({ stop = "top", bubble, lit, label = true }: { stop?: string; bubble?: string; /** Night Watch: the one module working now */ lit?: StackModule | null; label?: boolean }) {
  const iso = makeIso(268, 498);
  const z1 = GAP;
  const z2 = GAP * 2;
  const top = z2 + T;
  const { box, size } = useDockSize(26, 48, 0.07);

  // stores on the bottom slab, as three long tiles
  const tileW = 66;
  const tiles = STORES.map((name, i) => ({ name, x: -half + 9 + i * (tileW + 10), y: -half + 18, w: tileW, d: S - 36, h: 22 }));

  // the four tools around Aan on the top slab
  const MW = 48;
  const mods: { id: StackModule; name: string; x: number }[] = (
    [
      ["signals", "Signals"],
      ["profitability", "Profit"],
      ["rules", "Rules"],
      ["mcp", "MCP"],
    ] as const
  ).map(([id, name], i) => ({ id, name, x: -half + 16 + i * (MW + 10) }));
  const modY = half - 16 - 56;
  const plinth = { x: 0, y: -46 };
  const aanAt = iso(plinth.x, plinth.y, top + 16);
  const risers: P3[][] = tiles.map((t) => [
    [t.x + t.w / 2, half - 30, T + t.h],
    [t.x + t.w / 2, half - 30, z1],
  ]);

  return (
    <div ref={box}>
      <IsoStage
        w={W}
        h={H}
        label="The Anarix platform as three layers. At the bottom, your Amazon, Walmart and Shopify stores. Their data rises into one Anarix data layer in the middle. On top sit Signals, Profitability, Rules and MCP around Aan."
        dock={<AanDock stop={stop} size={size} bubble={bubble} side="right" style={dockAt(aanAt, W, H)} />}
      >
        <Shadow iso={iso} x={0} y={0} r={half * 1.25} z={-6} />

        {/* 1 · every marketplace */}
        <Block iso={iso} x={-half} y={-half} w={S} d={S} h={T} tone="plate" i={0} />
        <Grid iso={iso} x={-half} y={-half} w={S} d={S} z={T} step={S / 6} />
        {tiles.map((t, i) => (
          <Block key={t.name} iso={iso} x={t.x} y={t.y} w={t.w} d={t.d} h={t.h} z={T} i={1 + i}>
            <FaceText iso={iso} x={t.x + 6} y={t.y + t.d} z={T + 7} face="left" size={12}>
              {t.name}
            </FaceText>
          </Block>
        ))}
        {risers.map((r, i) => (
          <Cable key={i} iso={iso} path={r} delay={i * 900} dur={6000} />
        ))}

        {/* 2 · one data layer */}
        <Block iso={iso} x={-half} y={-half} w={S} d={S} h={T} z={z1} tone="data" power="hot" lift={400} i={4} />
        <Grid iso={iso} x={-half} y={-half} w={S} d={S} z={z1 + T} step={S / 6} />
        <Ring iso={iso} x={0} y={0} r={46} z={z1 + T} className={isoCss.ringHot} />
        <Cable iso={iso} path={[[half - 40, half - 40, z1 + T], [half - 40, half - 40, z2]]} delay={2400} dur={6000} />
        <Cable iso={iso} path={[[-half + 40, half - 40, z1 + T], [-half + 40, half - 40, z2]]} delay={3600} dur={6000} />

        {/* 3 · the tools, with Aan on top */}
        <Block iso={iso} x={-half} y={-half} w={S} d={S} h={T} z={z2} tone="plate" i={5} />
        <Cyl iso={iso} x={plinth.x} y={plinth.y} r={26} h={16} z={top} i={6} power="hot" lift={700} />
        {mods.map((m, i) => (
          <g key={m.id}>
            <Block iso={iso} x={m.x} y={modY} w={MW} d={56} h={30} z={top} i={7 + i} tone={lit === m.id ? "hot" : "base"} power={lit === undefined ? "hot" : undefined} lift={900 + i * 160} />
            <ToolMark iso={iso} id={m.id} x={m.x} y={modY} z={top + 30} />
          </g>
        ))}

        {label &&
          LAYERS.map((L, i) => {
            const c = iso(half, -half, L.z + T / 2);
            return (
              <Tag key={L.title} at={[c[0] + 44, c[1] + 4]} to={[c[0] + 6, c[1]]} sub={L.sub} tone={L.tone} i={i}>
                {L.title}
              </Tag>
            );
          })}
      </IsoStage>
    </div>
  );
}
