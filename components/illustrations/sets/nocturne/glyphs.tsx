import type { ReactElement } from "react";
import type { GlyphName } from "@/content/products/types";
import { Label, art, d, scallops } from "./kit";

/*
  Small drawings that stand on the how-it-works line, one per step. Local
  coordinates: centred on x = 0, standing on the ground at y = 0 (up is
  negative), about 120 wide and at most 100 tall. `on` is the class for the
  strokes that turn periwinkle once the step is reached; `off` for the ones
  that show the problem (coral).
*/
type Cls = { on: string; off: string };

const shop = (c: Cls, changed: boolean) => (
  <>
    <rect {...d(art.body)} x={-44} y={-78} width={88} height={78} />
    <rect {...d()} x={-34} y={-72} width={68} height={14} />
    <path {...d()} d={scallops(-44, 44, -52, 6)} />
    <rect {...d(`${art.win} ${art.lit}`)} x={-34} y={-40} width={34} height={26} />
    <rect {...d()} x={10} y={-36} width={22} height={36} />
    {changed && <line {...d(c.off)} x1={-30} y1={-18} x2={-4} y2={-36} />}
  </>
);

export const GLYPHS: Record<GlyphName, (c: Cls) => ReactElement> = {
  storefront: (c) => shop(c, false),
  storefrontChanged: (c) => shop(c, true),

  signpost: (c) => (
    <>
      <line {...d()} x1={0} y1={0} x2={0} y2={-98} />
      <path {...d(art.body)} d="M0 -92 h50 l8 8 l-8 8 h-50 z" />
      <path {...d(art.body)} d="M0 -68 h-48 l-8 8 l8 8 h48 z" />
      <path {...d(`${art.body} ${c.on}`)} d="M0 -44 h40 l8 8 l-8 8 h-40 z" />
    </>
  ),

  gate: (c) => (
    <>
      <rect {...d(art.body)} x={-50} y={-58} width={16} height={58} />
      <line {...d(c.on)} x1={-42} y1={-48} x2={52} y2={-48} />
      <line {...d()} x1={52} y1={-52} x2={52} y2={-44} />
      <rect {...d(art.body)} x={8} y={-24} width={24} height={24} />
      <path {...d(c.on)} d="M14 -12 l5 5 l9 -10" />
    </>
  ),

  buttonCheck: (c) => (
    <>
      <rect {...d(art.body)} x={-56} y={-92} width={112} height={68} rx={6} />
      <line {...d()} x1={0} y1={-24} x2={0} y2={0} />
      <line {...d()} x1={-18} y1={0} x2={18} y2={0} />
      <rect {...d(c.on)} x={-40} y={-72} width={80} height={26} rx={6} />
      <path {...d(c.on)} d="M-28 -59 l5 5 l10 -11" />
      <line {...d()} x1={-6} y1={-59} x2={28} y2={-59} />
    </>
  ),

  receipt: (c) => (
    <>
      <path {...d(art.body)} d="M-32 -98 h64 v98 l-10.7 -6 l-10.7 6 l-10.7 -6 l-10.7 6 l-10.7 -6 l-10.7 6 z" />
      <line {...d()} x1={-20} y1={-82} x2={20} y2={-82} />
      <line {...d(c.off)} x1={-20} y1={-66} x2={8} y2={-66} />
      <line {...d(c.off)} x1={-20} y1={-54} x2={14} y2={-54} />
      <line {...d(c.off)} x1={-20} y1={-42} x2={4} y2={-42} />
      <line {...d(c.on)} x1={-20} y1={-26} x2={20} y2={-26} />
    </>
  ),

  calendar: (c) => (
    <>
      <rect {...d(art.body)} x={-42} y={-86} width={84} height={86} rx={4} />
      <line {...d()} x1={-42} y1={-66} x2={42} y2={-66} />
      <line {...d()} x1={-20} y1={-94} x2={-20} y2={-80} />
      <line {...d()} x1={20} y1={-94} x2={20} y2={-80} />
      {[-30, -6, 18].map((x) =>
        [-56, -32].map((y) => (x === 18 && y === -32 ? null : <rect key={`${x}${y}`} {...d()} x={x} y={y} width={12} height={12} />)),
      )}
      <rect {...d(`${art.win} ${art.lit} ${c.on}`)} x={18} y={-32} width={12} height={12} />
    </>
  ),

  threeStores: (c) => (
    <>
      {[-56, -16, 24].map((x, i) => (
        <g key={x}>
          <rect {...d(`${art.body} ${c.on}`)} x={x} y={i === 1 ? -62 : -52} width={32} height={i === 1 ? 62 : 52} />
          <line {...d()} x1={x + 4} y1={i === 1 ? -52 : -42} x2={x + 28} y2={i === 1 ? -52 : -42} />
          <rect {...d(`${art.win} ${art.lit}`)} x={x + 8} y={-30} width={16} height={14} />
        </g>
      ))}
    </>
  ),

  speech: (c) => (
    <>
      <path {...d(art.body)} d="M-48 -98 h96 a8 8 0 0 1 8 8 v34 a8 8 0 0 1 -8 8 h-62 l-14 14 v-14 h-20 a8 8 0 0 1 -8 -8 v-34 a8 8 0 0 1 8 -8 z" />
      <line {...d(c.on)} x1={-36} y1={-82} x2={36} y2={-82} />
      <line {...d(c.on)} x1={-36} y1={-66} x2={14} y2={-66} />
    </>
  ),

  conditions: (c) => (
    <>
      {[
        [-100, "When"],
        [-68, "If"],
        [-36, "Then"],
      ].map(([y, k]) => (
        <g key={k}>
          <rect {...d(art.body)} x={-46} y={y as number} width={92} height={22} rx={4} />
          <Label x={-36} y={(y as number) + 15} size={11} anchor="start">
            {k}
          </Label>
        </g>
      ))}
      <line {...d()} x1={0} y1={-78} x2={0} y2={-68} />
      <line {...d()} x1={0} y1={-46} x2={0} y2={-36} />
      <line {...d(c.on)} x1={0} y1={-14} x2={0} y2={0} />
    </>
  ),

  clock: (c) => (
    <>
      <line {...d()} x1={0} y1={0} x2={0} y2={-40} />
      <circle {...d(art.body)} cx={0} cy={-68} r={28} />
      <path {...d()} d="M0 -92 v5 M24 -68 h-5 M0 -44 v-5 M-24 -68 h5" />
      <path {...d(c.on)} d="M0 -68 V-84 M0 -68 L12 -62" />
    </>
  ),

  pole: (c) => (
    <>
      <line {...d()} x1={0} y1={0} x2={0} y2={-100} />
      <line {...d()} x1={-32} y1={-88} x2={32} y2={-88} />
      <path {...d()} d="M-32 -88 Q -46 -60 -62 -44" />
      <path {...d(c.on)} d="M32 -88 Q 46 -60 62 -44" />
      <rect {...d(`${art.body} ${c.on}`)} x={-14} y={-72} width={28} height={20} rx={3} />
    </>
  ),

  chat: (c) => (
    <>
      <rect {...d(art.body)} x={-56} y={-96} width={112} height={74} rx={6} />
      <line {...d()} x1={-56} y1={-84} x2={56} y2={-84} />
      <rect {...d()} x={-6} y={-76} width={50} height={14} rx={7} />
      <rect {...d(c.on)} x={-46} y={-56} width={62} height={22} rx={8} />
      <line {...d()} x1={0} y1={-22} x2={0} y2={0} />
      <line {...d()} x1={-18} y1={0} x2={18} y2={0} />
    </>
  ),

  sameNumber: (c) => (
    <>
      {[-38, 38].map((x) => (
        <g key={x}>
          <rect {...d(art.body)} x={x - 26} y={-90} width={52} height={54} rx={4} />
          <line {...d()} x1={x} y1={-36} x2={x} y2={0} />
          <Label x={x} y={-58} size={11}>
            $3,412
          </Label>
        </g>
      ))}
      <path {...d(c.on)} d="M-6 -66 h12 M-6 -58 h12" />
    </>
  ),
};
