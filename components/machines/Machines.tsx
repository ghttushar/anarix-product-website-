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

/* ======================================================== Profitability: refinery */
// flow runs back-to-front along the x axis: sales tank -> Aan reactor ->
// fees / ads / COGS towers -> profit silo (painter order = x + y)
const TOWERS = [
  { x: 36, k: "FEES" },
  { x: 82, k: "ADS" },
  { x: 128, k: "COGS" },
];

export function ProfitRefinery() {
  const iso = makeIso(292, 226);
  const Z = 8;
  const TY = -72; // tower row
  const p1 = path([iso(-175, -55, 30), iso(-60, -55, 30)]);
  const p2 = path([iso(-60, -55, 30), iso(-60, TY, 30), iso(190, TY, 30), iso(190, -40, 30)]);
  return (
    <div className="mx mx--refinery">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-svg" role="img" aria-label="A refinery: sales flow in, Aan's reactor strips fees, ads and cost of goods, and profit fills the silo">
        <Box iso={iso} x={-220} y={-130} w={440} d={200} h={Z} className="ib--slab" />
        {[-90, -50, -10, 30].map((v) => (
          <polyline key={v} points={pts(iso(-220, v, Z), iso(220, v, Z))} className="mx-etch" />
        ))}

        {/* pipes (drawn under the vessels) */}
        {[p1, p2].map((d, i) => (
          <g key={i}>
            <path d={d} className="mx-pipe" />
            <path d={d} className={`mx-flow ${i === 1 ? "mx-flow--gain" : ""}`} />
          </g>
        ))}

        {/* sales tank: glass, liquid inside */}
        <Cyl iso={iso} x={-175} y={-55} r={33} h={40} z={Z} className="ic--liquid ic--sales ic--low" />
        <Cyl iso={iso} x={-175} y={-55} r={33} h={78} z={Z} className="ic--liquid ic--sales ic--high" />
        <Cyl iso={iso} x={-175} y={-55} r={36} h={90} z={Z} className="ic--glass" />
        <text x={iso(-175, -55, Z)[0] - 44} y={iso(-175, -55, Z)[1] + 14} textAnchor="end" className="mx-label">
          Sales
        </text>

        {/* reactor: Aan docks on top */}
        <Cyl iso={iso} x={-60} y={-55} r={44} h={64} z={Z} className="ic--reactor" />
        <path d={isoCircle(iso, -60, -55, 44, Z + 22)} className="mx-band" />
        <path d={isoCircle(iso, -60, -55, 44, Z + 44)} className="mx-band" />
        {[0, 1].map((k) => (
          <path key={k} d={isoCircle(iso, -60, -55, 30, Z + 64)} className={`mx-ring mx-ring--${k}`} />
        ))}
        <path d={isoCircle(iso, -60, -55, 20, Z + 64)} className="mx-socket" />

        {/* filter towers */}
        {TOWERS.map((t, i) => (
          <g key={t.k} className={`mx-tower mx-tower--${i}`}>
            <Box iso={iso} x={t.x - 13} y={TY - 13} w={26} d={26} h={52} z={Z} className="ib--tower" />
            <Cyl iso={iso} x={t.x} y={TY} r={4.5} h={14} z={Z + 52} className="ic--stack" />
            {[0, 1, 2].map((s2) => (
              <circle key={s2} cx={iso(t.x, TY, Z + 72)[0]} cy={iso(t.x, TY, Z + 72)[1]} r="3.5" className={`mx-steam mx-steam--${s2}`} />
            ))}
            <text x={iso(t.x, TY + 13, Z)[0] - 6} y={iso(t.x, TY + 13, Z)[1] + 16} textAnchor="end" className="mx-label mx-label--sm">
              {t.k}
            </text>
          </g>
        ))}

        {/* profit silo */}
        <Cyl iso={iso} x={190} y={-40} r={29} h={18} z={Z} className="ic--liquid ic--profit ic--low" />
        <Cyl iso={iso} x={190} y={-40} r={29} h={70} z={Z} className="ic--liquid ic--profit ic--high" />
        <Cyl iso={iso} x={190} y={-40} r={32} h={84} z={Z} className="ic--glass" />
        <text x={iso(190, -40, Z + 84)[0]} y={iso(190, -40, Z + 84)[1] - 22} textAnchor="middle" className="mx-label mx-label--accent">
          Profit
        </text>
      </svg>
      <Dock at={[iso(-60, -55, Z + 64)[0], iso(-60, -55, Z + 64)[1] - 24]} bubble="Refining profit." size={56} />
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
  const iso = makeIso(330, 190);
  const Z = 8;
  const BZ = Z + 22; // belt surface
  const belt = path([iso(-210, 55, BZ), iso(205, 55, BZ)]);
  const stations = [
    { x: -120, k: "PAUSE" },
    { x: -20, k: "CAP" },
    { x: 80, k: "BID" },
  ];
  const crateStops = [-180, -70, 30, 140];
  return (
    <div className="mx mx--factory">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-svg" role="img" aria-label="A processing factory: campaigns ride the belt through rule stations while Aan runs the line from the control tower">
        <Box iso={iso} x={-240} y={-150} w={480} d={300} h={Z} className="ib--slab" />
        {[-150, -75, 0, 75].map((v) => (
          <polyline key={v} points={pts(iso(-240, v + 37, Z), iso(240, v + 37, Z))} className="mx-etch" />
        ))}

        {/* control tower: Aan on the roof */}
        <Box iso={iso} x={-40} y={-135} w={74} d={74} h={104} z={Z} className="ib--tower" />
        <polygon
          points={pts(iso(-40, -61, Z + 70), iso(34, -61, Z + 70), iso(34, -61, Z + 88), iso(-40, -61, Z + 88))}
          className="mx-window"
        />
        <polygon points={pts(iso(34, -135, Z + 70), iso(34, -61, Z + 70), iso(34, -61, Z + 88), iso(34, -135, Z + 88))} className="mx-window mx-window--side" />
        {[0, 1].map((k) => (
          <path key={k} d={isoCircle(iso, -3, -98, 30, Z + 104)} className={`mx-ring mx-ring--${k}`} />
        ))}
        <path d={isoCircle(iso, -3, -98, 20, Z + 104)} className="mx-socket" />
        <text x={iso(-40, -135, Z + 104)[0] - 10} y={iso(-40, -135, Z + 104)[1] - 6} textAnchor="end" className="mx-label mx-label--sm">
          CONTROL
        </text>

        {/* conveyor */}
        <Box iso={iso} x={-215} y={32} w={425} d={46} h={22} z={Z} className="ib--belt" />
        <path d={path([iso(-215, 36, BZ), iso(210, 36, BZ)])} className="mx-belt-line" />
        <path d={path([iso(-215, 74, BZ), iso(210, 74, BZ)])} className="mx-belt-line" />
        {Array.from({ length: 12 }).map((_, k) => (
          <polyline key={k} points={pts(iso(-205 + k * 35, 78, Z + 4), iso(-205 + k * 35, 78, Z + 18))} className="mx-roller" />
        ))}

        {/* crates: parked when dormant, riding the belt when powered */}
        {powered
          ? crateStops.map((_, k) => (
              <g key={`m${k}`}>
                <Crate />
                <animateMotion dur="6s" repeatCount="indefinite" begin={`${(-k * 1.5).toFixed(1)}s`} path={belt} />
              </g>
            ))
          : crateStops.map((x) => {
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

        {/* output bay */}
        <Box iso={iso} x={212} y={28} w={26} d={54} h={34} z={Z} className="ib--bay" />
      </svg>
      <Dock at={[iso(-3, -98, Z + 104)[0], iso(-3, -98, Z + 104)[1] - 24]} bubble="12 rules on the line." size={54} />
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
