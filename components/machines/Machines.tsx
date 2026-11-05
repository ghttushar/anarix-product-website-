"use client";

import { isoBox, isoCircle, isoCylinder, makeIso, pts, type Pt } from "@/lib/iso";

/**
 * Isometric scenes that sit *behind* each product UI card. Each scene is a
 * real 3D isometric drawing (boxes + cylinders on a ground slab) with a socket
 * where Aan docks. Dormant = quiet line art; when the section is powered
 * ([data-powered="true"] on the <section>) lights come on, packets flow,
 * liquids rise and the machinery runs. Animation lives in machines.css.
 */

const W = 640;
const H = 400;
type Iso = ReturnType<typeof makeIso>;
const pct = (p: Pt) => ({ left: `${(p[0] / W) * 100}%`, top: `${(p[1] / H) * 100}%` });
const path = (p: Pt[]) => "M" + p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L");

function Box({ iso, x, y, w, d, h, z = 0, className = "" }: { iso: Iso; x: number; y: number; w: number; d: number; h: number; z?: number; className?: string }) {
  const b = isoBox(iso, x, y, w, d, h, z);
  return (
    <g className={`ib ${className}`}>
      <polygon points={b.right} className="ib-r" />
      <polygon points={b.left} className="ib-l" />
      <polygon points={b.top} className="ib-t" />
    </g>
  );
}

function Cyl({ iso, x, y, r, h, z = 0, className = "" }: { iso: Iso; x: number; y: number; r: number; h: number; z?: number; className?: string }) {
  const c = isoCylinder(iso, x, y, r, h, z);
  return (
    <g className={`ic ${className}`}>
      <path d={c.side} className="ic-side" />
      <path d={c.top} className="ic-top" />
    </g>
  );
}

function Dock({ at, bubble, state = "cube", size = 56, sizeSm = 40 }: { at: Pt; bubble: string; state?: string; size?: number; sizeSm?: number }) {
  return <div className="mx-dock" style={pct(at)} data-dock data-size={size} data-size-sm={sizeSm} data-state={state} data-bubble={bubble} aria-hidden="true" />;
}

function Packets({ d, n = 3, dur = 1.8, className = "" }: { d: string; n?: number; dur?: number; className?: string }) {
  return (
    <g className={`mx-packets ${className}`}>
      {Array.from({ length: n }).map((_, k) => (
        <circle key={k} r="3" className="mx-packet">
          <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${((k * dur) / n).toFixed(2)}s`} path={d} />
        </circle>
      ))}
    </g>
  );
}

/* ============================================================ Signals: motherboard */
export function SignalsBoard() {
  const iso = makeIso(320, 178);
  const Z = 8;
  const ports = [
    { label: "Amazon", y: -95 },
    { label: "Walmart", y: -5 },
    { label: "Shopify", y: 85 },
  ];
  const traceIn = (y: number) => path([iso(-182, y + 20, Z), iso(-110, y + 20, Z), iso(-55, y * 0.35, Z)]);
  const toRam = path([iso(30, -55, Z), iso(30, -80, Z), iso(70, -80, Z)]);
  const toOut = path([iso(40, 55, Z), iso(40, 80, Z), iso(100, 80, Z)]);
  const caps = [-46, -28, -10, 8, 26];
  return (
    <div className="mx mx--board">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-svg" role="img" aria-label="A motherboard: marketplace data enters through ports, Aan processes it in the CPU, signals stream out">
        <Box iso={iso} x={-210} y={-150} w={420} d={300} h={Z} className="ib--pcb" />
        {/* etched grid on the board */}
        {[-150, -90, -30, 30, 90].map((v) => (
          <polyline key={`gx${v}`} points={pts(iso(-210, v + 30, Z), iso(210, v + 30, Z))} className="mx-etch" />
        ))}
        {[-130, -50, 30, 110, 190].map((v) => (
          <polyline key={`gy${v}`} points={pts(iso(v, -150, Z), iso(v, 150, Z))} className="mx-etch" />
        ))}

        {/* traces + packets */}
        {ports.map((p) => (
          <g key={p.label}>
            <path d={traceIn(p.y)} className="mx-trace" />
            <Packets d={traceIn(p.y)} n={2} dur={1.6} />
          </g>
        ))}
        <path d={toRam} className="mx-trace" />
        <Packets d={toRam} n={2} dur={1.2} className="mx-packets--out" />
        <path d={toOut} className="mx-trace mx-trace--out" />
        <Packets d={toOut} n={2} dur={1.2} className="mx-packets--out" />

        {/* ports on the back-left edge */}
        {ports.map((p) => (
          <g key={`port-${p.label}`}>
            <Box iso={iso} x={-210} y={p.y} w={28} d={40} h={18} z={Z} className="ib--port" />
            <text x={iso(-210, p.y + 20, Z + 18)[0] - 16} y={iso(-210, p.y + 20, Z + 18)[1] - 8} textAnchor="end" className="mx-label">
              {p.label}
            </text>
          </g>
        ))}

        {/* capacitors behind the CPU */}
        {caps.map((cx) => (
          <Cyl key={cx} iso={iso} x={cx} y={-92} r={6} h={16} z={Z} className="ic--cap" />
        ))}

        {/* RAM sticks */}
        {[0, 1, 2, 3].map((k) => (
          <g key={`ram${k}`}>
            <Box iso={iso} x={72 + k * 16} y={-138} w={7} d={96} h={30} z={Z} className="ib--ram" />
            <polyline points={pts(iso(79 + k * 16, -126, Z + 22), iso(79 + k * 16, -54, Z + 22))} className="mx-led-line" />
          </g>
        ))}
        <text x={iso(130, -138, Z + 30)[0] + 8} y={iso(130, -138, Z + 30)[1] - 4} className="mx-label mx-label--sm">
          MEMORY
        </text>

        {/* small chips */}
        <Box iso={iso} x={-150} y={60} w={52} d={40} h={7} z={Z} className="ib--chip" />
        <Box iso={iso} x={100} y={58} w={64} d={50} h={9} z={Z} className="ib--chip ib--out" />
        <text x={iso(132, 108, Z + 9)[0]} y={iso(132, 108, Z + 9)[1] + 20} textAnchor="middle" className="mx-label mx-label--sm">
          SIGNALS OUT
        </text>

        {/* status LEDs along the front edge */}
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <Box key={`led${k}`} iso={iso} x={-60 + k * 16} y={128} w={8} d={8} h={4} z={Z} className={`ib--led ib--led-${k % 3}`} />
        ))}

        {/* CPU socket + die */}
        <Box iso={iso} x={-55} y={-55} w={110} d={110} h={14} z={Z} className="ib--socket" />
        <Box iso={iso} x={-36} y={-36} w={72} d={72} h={8} z={Z + 14} className="ib--die" />
        {[0, 1, 2].map((k) => (
          <path key={k} d={isoCircle(iso, 0, 0, 34, Z + 22)} className={`mx-ring mx-ring--${k}`} />
        ))}
        <path d={isoCircle(iso, 0, 0, 20, Z + 22)} className="mx-socket" />
      </svg>
      <Dock at={[iso(0, 0, 30)[0], iso(0, 0, 30)[1] - 24]} bubble="Reading 1,248 signals." />
    </div>
  );
}

/* ===================================================== Profitability: profit engine */
// Sales arrive as coin stacks, Aan's counting machine strips fees / ads / COGS
// into coral trays at the back, and profit comes out as a rising bar chart.
function CoinStack({ iso, x, y, n, tone }: { iso: Iso; x: number; y: number; n: number; tone: "sales" | "cost" }) {
  return (
    <g className={`mx-coins mx-coins--${tone}`}>
      {Array.from({ length: n }).map((_, k) => (
        <Cyl key={k} iso={iso} x={x} y={y} r={tone === "sales" ? 15 : 11} h={4} z={8 + k * 5} className="ic--coin" />
      ))}
    </g>
  );
}

const CUTS = [
  { x: 52, k: "FEES" },
  { x: 96, k: "ADS" },
  { x: 140, k: "COGS" },
];
const BARS = [
  { lo: 10, hi: 34 },
  { lo: 16, hi: 50 },
  { lo: 12, hi: 66 },
  { lo: 18, hi: 88 },
];

export function ProfitRefinery() {
  const iso = makeIso(300, 196);
  const Z = 8;
  const toMachine = path([iso(-128, -24, 20), iso(-55, -24, 20)]);
  const toChart = path([iso(40, -24, 20), iso(96, -24, 20), iso(96, 6, 20)]);
  return (
    <div className="mx mx--profit">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-svg" role="img" aria-label="A profit engine: sales arrive as coin stacks, Aan's counting machine strips out fees, ads and cost of goods, and profit rises as a bar chart">
        <Box iso={iso} x={-225} y={-130} w={450} d={200} h={Z} className="ib--slab" />
        {[-90, -50, -10, 30].map((v) => (
          <polyline key={v} points={pts(iso(-225, v, Z), iso(225, v, Z))} className="mx-etch" />
        ))}

        {/* deduction trays at the back */}
        {CUTS.map((c) => (
          <g key={c.k} className="mx-cut">
            <Box iso={iso} x={c.x - 16} y={-120} w={32} d={32} h={6} z={Z} className="ib--tray" />
            <g className="mx-cut__lo">
              <CoinStack iso={iso} x={c.x} y={-104} n={1} tone="cost" />
            </g>
            <g className="mx-cut__hi">
              <CoinStack iso={iso} x={c.x} y={-104} n={5} tone="cost" />
            </g>
            <text x={iso(c.x, -104, Z + 40)[0]} y={iso(c.x, -104, Z + 40)[1] - 6} textAnchor="middle" className="mx-label mx-label--sm">
              {c.k}
            </text>
          </g>
        ))}
        {CUTS.map((c) => {
          const d = path([iso(10, -64, 50), iso(c.x, -88, 40), iso(c.x, -104, 36)]);
          return (
            <g key={`p${c.k}`}>
              <path d={d} className="mx-trace mx-trace--cut" />
              <Packets d={d} n={1} dur={1.8} className="mx-packets--cut" />
            </g>
          );
        })}

        {/* sales coin stacks */}
        <CoinStack iso={iso} x={-185} y={-52} n={9} tone="sales" />
        <CoinStack iso={iso} x={-150} y={-52} n={12} tone="sales" />
        <CoinStack iso={iso} x={-170} y={-14} n={7} tone="sales" />
        <text x={iso(-200, -14, Z)[0] - 10} y={iso(-200, -14, Z)[1] + 16} textAnchor="end" className="mx-label">
          Sales
        </text>

        <path d={toMachine} className="mx-trace" />
        <Packets d={toMachine} n={3} dur={1.4} />

        {/* Aan's counting machine */}
        <Box iso={iso} x={-55} y={-64} w={95} d={80} h={56} z={Z} className="ib--machine" />
        <polygon points={pts(iso(-45, 16, Z + 16), iso(30, 16, Z + 16), iso(30, 16, Z + 46), iso(-45, 16, Z + 46))} className="mx-screen" />
        {[0, 1, 2, 3].map((k) => (
          <polygon
            key={k}
            points={pts(iso(-36 + k * 16, 16, Z + 20), iso(-28 + k * 16, 16, Z + 20), iso(-28 + k * 16, 16, Z + 26 + k * 4), iso(-36 + k * 16, 16, Z + 26 + k * 4))}
            className="mx-screen-bar"
          />
        ))}
        {[0, 1].map((k) => (
          <path key={k} d={isoCircle(iso, -8, -24, 28, Z + 56)} className={`mx-ring mx-ring--${k}`} />
        ))}
        <path d={isoCircle(iso, -8, -24, 18, Z + 56)} className="mx-socket" />

        <path d={toChart} className="mx-trace mx-trace--out" />
        <Packets d={toChart} n={2} dur={1.2} className="mx-packets--out" />

        {/* profit chart */}
        {BARS.map((b, i) => (
          <g key={i}>
            <g className="mx-bar__lo">
              <Box iso={iso} x={72 + i * 30} y={8} w={20} d={20} h={b.lo} z={Z} className="ib--bar-lo" />
            </g>
            <g className="mx-bar__hi" style={{ transitionDelay: `${0.2 + i * 0.15}s` }}>
              <Box iso={iso} x={72 + i * 30} y={8} w={20} d={20} h={b.hi} z={Z} className="ib--bar" />
            </g>
          </g>
        ))}
        <text x={iso(162, 18, Z + 88)[0] + 22} y={iso(162, 18, Z + 88)[1] - 4} className="mx-label mx-label--accent">
          Profit
        </text>
      </svg>
      <Dock at={[iso(-8, -24, Z + 56)[0], iso(-8, -24, Z + 56)[1] - 24]} bubble="Counting every fee." size={56} />
    </div>
  );
}

/* ====================================================== Rules: processing factory */
// crate drawn around (0,0) in screen space so it can ride a motion path
function Crate({ s = 22, h = 16 }: { s?: number; h?: number }) {
  const loc = (dx: number, dy: number, dz: number): Pt => [(dx - dy) * 0.866, (dx + dy) * 0.5 - dz];
  const a = -s / 2;
  const b = s / 2;
  return (
    <g className="mx-crate">
      <polygon points={pts(loc(b, a, 0), loc(b, b, 0), loc(b, b, h), loc(b, a, h))} className="ib-r" />
      <polygon points={pts(loc(a, b, 0), loc(b, b, 0), loc(b, b, h), loc(a, b, h))} className="ib-l" />
      <polygon points={pts(loc(a, a, h), loc(b, a, h), loc(b, b, h), loc(a, b, h))} className="ib-t" />
      <polyline points={pts(loc(a, 0, h), loc(b, 0, h))} className="mx-crate-tape" />
    </g>
  );
}

export function RulesFactory({ powered = false }: { powered?: boolean }) {
  const iso = makeIso(330, 182);
  const Z = 8;
  const BZ = Z + 22; // belt surface
  const GX = 110; // diverter gate
  const allow = path([iso(-210, 55, BZ), iso(GX, 55, BZ), iso(212, 55, BZ)]);
  const stop = path([iso(-210, 55, BZ), iso(GX, 55, BZ), iso(GX, -38, BZ)]);
  const stations = [
    { x: -168, k: "PAUSE" },
    { x: -98, k: "CAP" },
    { x: -28, k: "BID" },
  ];
  // which crates the rules stop (coral) vs allow (periwinkle)
  const crates = [false, true, false, false, true];
  const parked = [-185, -125, -60, 10, 70];
  return (
    <div className="mx mx--factory">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-svg" role="img" aria-label="A processing factory: campaigns ride the belt through rule stations; a gate sends each one to the Allowed channel or the Stopped channel while Aan runs the line from the control tower">
        <Box iso={iso} x={-240} y={-150} w={480} d={300} h={Z} className="ib--slab" />
        {[-150, -75, 0, 75].map((v) => (
          <polyline key={v} points={pts(iso(-240, v + 37, Z), iso(240, v + 37, Z))} className="mx-etch" />
        ))}

        {/* control tower: Aan on the roof */}
        <Box iso={iso} x={-40} y={-135} w={74} d={74} h={104} z={Z} className="ib--tower" />
        <polygon points={pts(iso(-40, -61, Z + 70), iso(34, -61, Z + 70), iso(34, -61, Z + 88), iso(-40, -61, Z + 88))} className="mx-window" />
        <polygon points={pts(iso(34, -135, Z + 70), iso(34, -61, Z + 70), iso(34, -61, Z + 88), iso(34, -135, Z + 88))} className="mx-window mx-window--side" />
        {[0, 1].map((k) => (
          <path key={k} d={isoCircle(iso, -3, -98, 30, Z + 104)} className={`mx-ring mx-ring--${k}`} />
        ))}
        <path d={isoCircle(iso, -3, -98, 20, Z + 104)} className="mx-socket" />
        <text x={iso(-40, -135, Z + 104)[0] - 10} y={iso(-40, -135, Z + 104)[1] - 6} textAnchor="end" className="mx-label mx-label--sm">
          CONTROL
        </text>

        {/* stopped channel: turns off to the back, into the reject bin */}
        <Box iso={iso} x={91} y={-22} w={38} d={54} h={22} z={Z} className="ib--lane-stop" />
        <path d={path([iso(GX, 32, BZ), iso(GX, -22, BZ)])} className="mx-lane mx-lane--stop" />
        <Box iso={iso} x={86} y={-52} w={48} d={30} h={30} z={Z} className="ib--bin-stop" />
        <text x={iso(134, -52, Z + 30)[0] + 8} y={iso(134, -52, Z + 30)[1] - 4} className="mx-label mx-label--stop">
          ✕ Stopped
        </text>

        {/* main conveyor */}
        <Box iso={iso} x={-215} y={32} w={308} d={46} h={22} z={Z} className="ib--belt" />
        <path d={path([iso(-215, 36, BZ), iso(93, 36, BZ)])} className="mx-belt-line" />
        <path d={path([iso(-215, 74, BZ), iso(93, 74, BZ)])} className="mx-belt-line" />

        {/* allowed channel: straight on */}
        <Box iso={iso} x={127} y={34} w={86} d={42} h={22} z={Z} className="ib--lane-allow" />
        <path d={path([iso(127, 55, BZ), iso(213, 55, BZ)])} className="mx-lane mx-lane--allow" />
        <Box iso={iso} x={213} y={28} w={26} d={54} h={34} z={Z} className="ib--bin-allow" />
        <text x={iso(239, 28, Z + 34)[0] + 6} y={iso(239, 28, Z + 34)[1] - 4} className="mx-label mx-label--allow">
          ✓ Allowed
        </text>

        {/* diverter gate */}
        <Box iso={iso} x={93} y={32} w={34} d={46} h={22} z={Z} className="ib--gate" />
        <Box iso={iso} x={104} y={46} w={12} d={18} h={16} z={BZ} className="ib--gate-head" />
        <Box iso={iso} x={107} y={52} w={6} d={6} h={5} z={BZ + 16} className="ib--led ib--led-gate" />

        {/* crates: parked when dormant; when powered each rides to its channel */}
        {powered
          ? crates.map((stopped, k) => (
              <g key={`m${k}`} className={stopped ? "is-stopped" : "is-allowed"}>
                <Crate />
                <animateMotion dur="7s" repeatCount="indefinite" begin={`${(-k * 1.4).toFixed(1)}s`} path={stopped ? stop : allow} />
              </g>
            ))
          : parked.map((x) => {
              const [cx, cy] = iso(x, 55, BZ);
              return (
                <g key={`s${x}`} transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)})`}>
                  <Crate />
                </g>
              );
            })}

        {/* rule stations (gantries with a press) */}
        {stations.map((s, i) => (
          <g key={s.k} className={`mx-station mx-station--${i}`}>
            <Box iso={iso} x={s.x} y={24} w={7} d={7} h={70} z={Z} className="ib--post" />
            <Box iso={iso} x={s.x} y={79} w={7} d={7} h={70} z={Z} className="ib--post" />
            <Box iso={iso} x={s.x - 3} y={24} w={13} d={62} h={9} z={Z + 70} className="ib--beam" />
            <g className="mx-press">
              <Box iso={iso} x={s.x - 6} y={44} w={19} d={22} h={14} z={Z + 50} className="ib--press" />
            </g>
            <Box iso={iso} x={s.x + 1} y={52} w={5} d={5} h={5} z={Z + 79} className="ib--led" />
            <text x={iso(s.x + 3, 24, Z + 79)[0]} y={iso(s.x + 3, 24, Z + 79)[1] - 10} textAnchor="middle" className="mx-label mx-label--sm">
              {s.k}
            </text>
          </g>
        ))}
      </svg>
      <Dock at={[iso(-3, -98, Z + 104)[0], iso(-3, -98, Z + 104)[1] - 24]} bubble="Allowing good spend, stopping waste." size={54} />
    </div>
  );
}

/* ================================================== Aan: neural compute cube */
const L = [-62, 0, 62];
const LZ = [46, 108, 170];

export function NeuralCore() {
  const iso = makeIso(320, 238);
  const Z = 14;
  const nodes: { p: Pt; d: number; key: string }[] = [];
  L.forEach((x) =>
    L.forEach((y) =>
      LZ.forEach((z) => {
        if (x === 0 && y === 0 && z === 108) return; // Aan sits in the centre
        nodes.push({ p: iso(x, y, z), d: Math.abs(x) / 62 + Math.abs(y) / 62 + Math.abs(z - 108) / 62, key: `${x}.${y}.${z}` });
      }),
    ),
  );
  const edges: { a: Pt; b: Pt; d: number }[] = [];
  L.forEach((x, i) =>
    L.forEach((y, j) =>
      LZ.forEach((z, k) => {
        const here = iso(x, y, z);
        const d = Math.abs(x) / 62 + Math.abs(y) / 62 + Math.abs(z - 108) / 62;
        if (i < 2) edges.push({ a: here, b: iso(L[i + 1], y, z), d });
        if (j < 2) edges.push({ a: here, b: iso(x, L[j + 1], z), d });
        if (k < 2) edges.push({ a: here, b: iso(x, y, LZ[k + 1]), d });
      }),
    ),
  );
  const c = 96;
  const cube = isoBox(iso, -c, -c, c * 2, c * 2, 190, Z);
  const back = [
    [iso(-c, -c, Z), iso(-c, -c, Z + 190)],
    [iso(-c, -c, Z), iso(c, -c, Z)],
    [iso(-c, -c, Z), iso(-c, c, Z)],
  ];
  const qIn = path([iso(-230, 0, 108), iso(-c, 0, 108)]);
  const qOut = path([iso(c, 0, 108), iso(230, 0, 108)]);
  return (
    <div className="mx mx--core">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-svg" role="img" aria-label="A glass compute cube: your question flows in, Aan reasons across a lattice of your data, the answer flows out">
        <Box iso={iso} x={-130} y={-130} w={260} d={260} h={Z} className="ib--slab" />
        <path d={isoCircle(iso, 0, 0, 120, Z)} className="mx-etch" />
        {back.map(([a, b], k) => (
          <line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="mx-etch" />
        ))}

        <path d={qIn} className="mx-trace" />
        <Packets d={qIn} n={2} dur={1.4} />
        <text x={iso(-230, 0, 108)[0]} y={iso(-230, 0, 108)[1] - 12} className="mx-label mx-label--sm">
          YOUR QUESTION
        </text>

        {edges.map((e, k) => (
          <line key={k} x1={e.a[0].toFixed(1)} y1={e.a[1].toFixed(1)} x2={e.b[0].toFixed(1)} y2={e.b[1].toFixed(1)} className="mx-synapse" style={{ animationDelay: `${(e.d * 0.35).toFixed(2)}s` }} />
        ))}
        {nodes.map((n) => (
          <circle key={n.key} cx={n.p[0].toFixed(1)} cy={n.p[1].toFixed(1)} r="4" className="mx-neuron" style={{ animationDelay: `${(n.d * 0.35).toFixed(2)}s` }} />
        ))}

        {/* glass walls in front */}
        <polygon points={cube.right} className="mx-glass" />
        <polygon points={cube.left} className="mx-glass" />
        <polygon points={cube.top} className="mx-glass mx-glass--top" />

        <path d={qOut} className="mx-trace mx-trace--out" />
        <Packets d={qOut} n={2} dur={1.4} className="mx-packets--out" />
        <text x={iso(230, 0, 108)[0]} y={iso(230, 0, 108)[1] - 12} textAnchor="end" className="mx-label mx-label--sm">
          THE WHY
        </text>
      </svg>
      <Dock at={iso(0, 0, 108)} state="circle" bubble="Thinking with your data." size={60} sizeSm={42} />
    </div>
  );
}
