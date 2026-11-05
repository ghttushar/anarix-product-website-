// Solid isometric miniatures that stand on the lazy Susan. Each one is a tiny
// model of the machine its section runs further down the page, so the hero
// previews the story: compute cube (Aan), chip (Signals), refinery
// (Profitability), factory (Rules) and hub (MCP).
import { isoBox, isoCylinder, makeIso, pts, type Pt } from "@/lib/iso";

const iso = makeIso(60, 74, 0.62);

function Box({ x, y, w, d, h, z = 0, tone = "base" }: { x: number; y: number; w: number; d: number; h: number; z?: number; tone?: string }) {
  const b = isoBox(iso, x, y, w, d, h, z);
  return (
    <g className={`sf sf--${tone}`}>
      <polygon points={b.right} className="sf-r" />
      <polygon points={b.left} className="sf-l" />
      <polygon points={b.top} className="sf-t" />
    </g>
  );
}

function Cyl({ x, y, r, h, z = 0, tone = "base" }: { x: number; y: number; r: number; h: number; z?: number; tone?: string }) {
  const c = isoCylinder(iso, x, y, r, h, z, 24);
  return (
    <g className={`sf sf--${tone}`}>
      <path d={c.side} className="sf-l" />
      <path d={c.top} className="sf-t" />
    </g>
  );
}

function Slab() {
  return <Box x={-40} y={-40} w={80} d={80} h={6} tone="slab" />;
}

const line = (a: Pt, b: Pt) => `M${a[0].toFixed(1)},${a[1].toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)}`;

export function FigAan() {
  const [cx, cy] = iso(0, 0, 32);
  return (
    <svg viewBox="0 0 120 110" className="fig" aria-hidden="true">
      <Slab />
      <Box x={-26} y={-26} w={52} d={52} h={52} z={6} tone="glass" />
      <g transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)})`}>
        <rect x="-8" y="-8" width="16" height="16" rx="3.5" transform="rotate(45)" className="sf-aan" />
        <circle cx="-3" cy="1" r="1.6" className="sf-eye" />
        <circle cx="3" cy="1" r="1.6" className="sf-eye" />
      </g>
    </svg>
  );
}

export function FigSignals() {
  return (
    <svg viewBox="0 0 120 110" className="fig" aria-hidden="true">
      <Slab />
      {[-28, 0, 28].map((y) => (
        <path key={y} d={line(iso(-40, y, 6), iso(-20, y * 0.4, 6))} className="sf-trace" />
      ))}
      <path d={line(iso(20, 0, 6), iso(40, 0, 6))} className="sf-trace sf-trace--out" />
      <Box x={-20} y={-20} w={40} d={40} h={8} z={6} tone="ink" />
      <Box x={-10} y={-10} w={20} d={20} h={5} z={14} tone="coral" />
      <Box x={22} y={-34} w={5} d={22} h={12} z={6} tone="base" />
      <Box x={30} y={-34} w={5} d={22} h={12} z={6} tone="base" />
    </svg>
  );
}

export function FigProfit() {
  return (
    <svg viewBox="0 0 120 110" className="fig" aria-hidden="true">
      <Slab />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <Cyl key={k} x={-22} y={-18} r={11} h={3} z={6 + k * 4} tone="coin" />
      ))}
      {[0, 1, 2, 3].map((k) => (
        <Cyl key={`b${k}`} x={-24} y={14} r={9} h={3} z={6 + k * 4} tone="coin" />
      ))}
      <Box x={4} y={-2} w={10} d={10} h={14} z={6} tone="blue-solid" />
      <Box x={18} y={-2} w={10} d={10} h={24} z={6} tone="blue-solid" />
      <Box x={32} y={-2} w={10} d={10} h={36} z={6} tone="blue-solid" />
    </svg>
  );
}

export function FigRules() {
  return (
    <svg viewBox="0 0 120 110" className="fig" aria-hidden="true">
      <Slab />
      <Box x={-10} y={-36} w={22} d={22} h={42} z={6} tone="base" />
      <polygon
        points={pts(iso(-10, -14, 32), iso(12, -14, 32), iso(12, -14, 40), iso(-10, -14, 40))}
        className="sf-window"
      />
      <Box x={-38} y={6} w={76} d={18} h={8} z={6} tone="ink" />
      <Box x={-30} y={9} w={11} d={11} h={9} z={14} tone="crate" />
      <Box x={-4} y={9} w={11} d={11} h={9} z={14} tone="crate" />
      <Box x={22} y={9} w={11} d={11} h={9} z={14} tone="crate" />
    </svg>
  );
}

export function FigMcp() {
  const nodes: [number, number][] = [
    [26, -30],
    [-30, 26],
    [26, 26],
  ];
  return (
    <svg viewBox="0 0 120 110" className="fig" aria-hidden="true">
      <Slab />
      {nodes.map(([x, y]) => (
        <path key={`c${x}${y}`} d={line(iso(0, 0, 12), iso(x + 5, y + 5, 10))} className="sf-trace" />
      ))}
      {nodes.map(([x, y]) => (
        <Box key={`n${x}${y}`} x={x} y={y} w={10} d={10} h={9} z={6} tone="base" />
      ))}
      <Box x={-16} y={-16} w={32} d={32} h={16} z={6} tone="blue-solid" />
      <Cyl x={0} y={0} r={7} h={3} z={22} tone="coral" />
    </svg>
  );
}

export const FIGURES = {
  aan: FigAan,
  signals: FigSignals,
  profitability: FigProfit,
  rules: FigRules,
  mcp: FigMcp,
} as const;
