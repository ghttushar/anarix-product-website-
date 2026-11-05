"use client";

import { isoBox, isoCircle, makeIso, pts } from "@/lib/iso";

/**
 * The machines Aan powers. Each one is a hairline isometric drawing with a
 * socket in the middle (the Aan dock). Dormant = grey line art; when the section
 * is powered (data-powered on the <section>) strokes light up and the machinery
 * runs. All animation lives in machines.css, keyed off [data-powered="true"].
 */

const W = 560;
const H = 260;
const pct = (x: number, y: number) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

function Dock({ x, y, bubble, state = "cube", size = 60, sizeSm = 44 }: { x: number; y: number; bubble: string; state?: string; size?: number; sizeSm?: number }) {
  return (
    <div
      className="mx-dock"
      style={pct(x, y)}
      data-dock
      data-size={size}
      data-size-sm={sizeSm}
      data-state={state}
      data-bubble={bubble}
      aria-hidden="true"
    />
  );
}

/** packets riding a path (SMIL), rendered always, shown only when powered */
function Packets({ d, n = 3, dur = 1.8, className = "" }: { d: string; n?: number; dur?: number; className?: string }) {
  return (
    <g className={`mx-packets ${className}`}>
      {Array.from({ length: n }).map((_, k) => (
        <circle key={k} r="3.2" className="mx-packet">
          <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${(k * dur) / n}s`} path={d} />
        </circle>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------ Radar CPU */
export function RadarCpu() {
  const iso = makeIso(280, 128);
  const chip = isoBox(iso, -72, -72, 144, 144, 14);
  const die = isoBox(iso, -38, -38, 76, 76, 6, 14);
  const L = iso(-72, 72, 7);
  const T = iso(-72, -72, 7);
  const B = iso(72, 72, 7);
  const mid = (a: readonly [number, number], b: readonly [number, number], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t] as const;
  const ins = [
    { label: "Amazon", y: 54, to: mid(L, T, 0.55) },
    { label: "Walmart", y: 132, to: mid(L, T, 0.05) },
    { label: "Shopify", y: 210, to: mid(L, B, 0.5) },
  ];
  const trace = (y: number, to: readonly [number, number]) => `M96,${y} H128 L${to[0].toFixed(1)},${to[1].toFixed(1)}`;
  const out = `M${B[0].toFixed(1)},${(B[1] + 8).toFixed(1)} V${H}`;
  const pins: string[] = [];
  for (let k = 1; k < 10; k++) {
    const a = iso(-72 + k * 14.4, 72, 0);
    const b = iso(-72 + k * 14.4, 80, 0);
    pins.push(`M${a[0].toFixed(1)},${a[1].toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)}`);
    const c = iso(72, -72 + k * 14.4, 0);
    const e = iso(80, -72 + k * 14.4, 0);
    pins.push(`M${c[0].toFixed(1)},${c[1].toFixed(1)} L${e[0].toFixed(1)},${e[1].toFixed(1)}`);
  }
  const top = iso(0, 0, 20);
  return (
    <div className="mx mx--cpu">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-svg" role="img" aria-label="A processor chip: marketplace data streams in, Aan processes it, a signal streams out">
        {ins.map((p) => (
          <g key={p.label}>
            <path d={trace(p.y, p.to)} className="mx-trace" />
            <rect x="14" y={p.y - 14} width="82" height="28" rx="14" className="mx-port" />
            <text x="55" y={p.y + 4} textAnchor="middle" className="mx-label">
              {p.label}
            </text>
            <Packets d={trace(p.y, p.to)} n={2} dur={1.6} />
          </g>
        ))}
        <path d={out} className="mx-trace mx-trace--out" />
        <Packets d={out} n={3} dur={1.4} className="mx-packets--out" />
        <text x={B[0] + 10} y={H - 14} className="mx-label mx-label--sm">
          SIGNAL
        </text>

        {pins.map((d, k) => (
          <path key={k} d={d} className="mx-pin" />
        ))}
        <polygon points={chip.right} className="mx-face mx-face--r" />
        <polygon points={chip.left} className="mx-face mx-face--l" />
        <polygon points={chip.top} className="mx-face mx-face--t" />
        <polygon points={die.right} className="mx-face mx-face--r" />
        <polygon points={die.left} className="mx-face mx-face--l" />
        <polygon points={die.top} className="mx-face mx-face--t mx-die" />
        {/* grid etched into the die */}
        {[-19, 0, 19].map((v) => (
          <g key={v}>
            <polyline points={pts(iso(v, -38, 20), iso(v, 38, 20))} className="mx-etch" />
            <polyline points={pts(iso(-38, v, 20), iso(38, v, 20))} className="mx-etch" />
          </g>
        ))}
        {/* radar rings rippling out from the socket */}
        {[0, 1, 2].map((k) => (
          <path key={k} d={isoCircle(iso, 0, 0, 40, 20)} className={`mx-ring mx-ring--${k}`} />
        ))}
        <path d={isoCircle(iso, 0, 0, 24, 20)} className="mx-socket" />
        <path d={isoCircle(iso, 0, 0, 14, 20)} className="mx-socket mx-socket--in" />
        <text x={T[0]} y={T[1] - 14} textAnchor="middle" className="mx-label mx-label--sm">
          AAN · SIGNAL CORE
        </text>
      </svg>
      <Dock x={top[0]} y={top[1] - 26} bubble="Reading 1,248 signals." />
    </div>
  );
}

/* ------------------------------------------------------------- Refinery */
export function Refinery() {
  const level = (cx: number, top: number, bottom: number, rx: number, cls: string) => (
    <g className={cls}>
      <rect x={cx - rx} y={top} width={rx * 2} height={bottom - top} className="mx-liquid" />
    </g>
  );
  return (
    <div className="mx mx--refinery">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-svg" role="img" aria-label="A refinery: sales flow in, Aan filters out fees, ads and cost of goods, and profit drips into the beaker">
        <defs>
          <clipPath id="tank-clip">
            <path d="M44,74 A40,13 0 0 0 124,74 V196 A40,13 0 0 1 44,196 Z" />
          </clipPath>
          <clipPath id="beaker-clip">
            <path d="M494,96 A28,10 0 0 0 550,96 V200 A28,10 0 0 1 494,200 Z" />
          </clipPath>
        </defs>

        {/* sales tank */}
        <path d="M44,74 V196 A40,13 0 0 0 124,196 V74" className="mx-face mx-face--l" />
        <g clipPath="url(#tank-clip)">{level(84, 92, 212, 40, "mx-level mx-level--sales")}</g>
        <ellipse cx="84" cy="74" rx="40" ry="13" className="mx-face mx-face--t" />
        <text x="84" y="226" textAnchor="middle" className="mx-label">
          Sales
        </text>

        {/* pipes */}
        <path d="M124,150 H226" className="mx-pipe" />
        <path d="M124,150 H226" className="mx-flow" />
        <path d="M334,150 H494" className="mx-pipe" />
        <path d="M334,150 H494" className="mx-flow mx-flow--late" />

        {/* reactor (Aan) */}
        <path d="M226,96 V176 A54,18 0 0 0 334,176 V96" className="mx-face mx-face--l" />
        <ellipse cx="280" cy="96" rx="54" ry="18" className="mx-face mx-face--t" />
        <path d="M226,136 A54,18 0 0 0 334,136" className="mx-etch" />
        <ellipse cx="280" cy="96" rx="26" ry="9" className="mx-socket" />
        <ellipse cx="280" cy="96" rx="15" ry="5" className="mx-socket mx-socket--in" />
        <ellipse cx="280" cy="96" rx="40" ry="14" className="mx-ring mx-ring--0" />

        {/* filters: fees / ads / cogs */}
        {[
          { x: 362, k: "Fees" },
          { x: 408, k: "Ads" },
          { x: 454, k: "COGS" },
        ].map((f, i) => (
          <g key={f.k} className={`mx-filter mx-filter--${i}`}>
            <rect x={f.x - 14} y="130" width="28" height="40" rx="6" className="mx-face mx-face--t" />
            <path d={`M${f.x - 14},142 h28 M${f.x - 14},152 h28`} className="mx-etch" />
            <path d={`M${f.x},170 V214`} className="mx-drip" />
            <text x={f.x} y="228" textAnchor="middle" className="mx-label mx-label--sm">
              {f.k.toUpperCase()}
            </text>
          </g>
        ))}

        {/* profit beaker */}
        <path d="M494,96 V200 A28,10 0 0 0 550,200 V96" className="mx-face mx-face--l" />
        <g clipPath="url(#beaker-clip)">{level(522, 96, 212, 28, "mx-level mx-level--profit")}</g>
        <ellipse cx="522" cy="96" rx="28" ry="10" className="mx-face mx-face--t mx-face--glass" />
        {[120, 145, 170].map((y) => (
          <path key={y} d={`M494,${y} h8`} className="mx-etch" />
        ))}
        <text x="522" y="226" textAnchor="middle" className="mx-label mx-label--accent">
          Profit
        </text>
      </svg>
      <Dock x={280} y={66} bubble="Refining profit." />
    </div>
  );
}

/* ----------------------------------------------------------- Gearworks */
function gearPath(cx: number, cy: number, r: number, teeth: number) {
  const ro = r;
  const ri = r - Math.max(6, r * 0.16);
  let d = "";
  const step = (Math.PI * 2) / teeth;
  for (let k = 0; k < teeth; k++) {
    const a = k * step;
    const p = [
      [ri, a],
      [ro, a + step * 0.18],
      [ro, a + step * 0.5],
      [ri, a + step * 0.68],
    ] as const;
    p.forEach(([rad, ang], j) => {
      d += `${k === 0 && j === 0 ? "M" : "L"}${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`;
    });
  }
  return d + "Z";
}

const GEARS = [
  { x: 280, y: 128, r: 64, t: 16, label: "", main: true },
  { x: 184, y: 94, r: 40, t: 10, label: "CTR" },
  { x: 196, y: 180, r: 34, t: 9, label: "BUDGET" },
  { x: 372, y: 86, r: 38, t: 10, label: "ACOS" },
  { x: 372, y: 182, r: 42, t: 11, label: "STOCK" },
];

export function Gearworks() {
  return (
    <div className="mx mx--gears">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-svg" role="img" aria-label="Gearworks: Aan is the main gear and drives one gear per rule">
        {GEARS.map((g, i) => {
          const dur = (14 * g.r) / 64;
          return (
            <g key={i} className={`mx-gear ${g.main ? "mx-gear--main" : ""}`} style={{ "--dur": `${dur}s` } as React.CSSProperties}>
              {/* thickness */}
              <path d={gearPath(g.x + 3, g.y + 5, g.r, g.t)} className="mx-gear__back" />
              <g className={`mx-gear__spin ${g.main ? "" : "is-rev"}`} style={{ transformOrigin: `${g.x}px ${g.y}px` }}>
                <path d={gearPath(g.x, g.y, g.r, g.t)} className="mx-face mx-face--t mx-gear__face" />
                <circle cx={g.x} cy={g.y} r={g.r * 0.42} className="mx-etch" />
                {[0, 60, 120].map((deg) => {
                  const a = (deg * Math.PI) / 180;
                  return (
                    <line
                      key={deg}
                      x1={(g.x - g.r * 0.42 * Math.cos(a)).toFixed(1)}
                      y1={(g.y - g.r * 0.42 * Math.sin(a)).toFixed(1)}
                      x2={(g.x + g.r * 0.42 * Math.cos(a)).toFixed(1)}
                      y2={(g.y + g.r * 0.42 * Math.sin(a)).toFixed(1)}
                      className="mx-etch"
                    />
                  );
                })}
              </g>
              {g.main ? (
                <>
                  <circle cx={g.x} cy={g.y} r="26" className="mx-socket mx-socket--fill" />
                  <circle cx={g.x} cy={g.y} r="36" className="mx-ring mx-ring--0" />
                </>
              ) : (
                <text x={g.x} y={g.y + 4} textAnchor="middle" className="mx-label mx-label--sm mx-gear__label">
                  {g.label}
                </text>
              )}
            </g>
          );
        })}
        <path d={`M280,192 V${H}`} className="mx-trace mx-trace--out" />
        <Packets d={`M280,192 V${H}`} n={2} dur={1.2} className="mx-packets--out" />
      </svg>
      <Dock x={280} y={124} bubble="12 rules turning." />
    </div>
  );
}

/* --------------------------------------------------------- Neural brain */
// deterministic PRNG so server and client draw the same brain
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BRAIN = (() => {
  const r = rng(7);
  const nodes: { x: number; y: number; d: number }[] = [];
  while (nodes.length < 34) {
    const x = 160 + r() * 240;
    const y = 50 + r() * 160;
    const nx = (x - 280) / 125;
    const ny = (y - 132) / 82;
    if (nx * nx + ny * ny > 1) continue;
    if (Math.hypot(x - 280, y - 132) < 34) continue;
    nodes.push({ x: Math.round(x), y: Math.round(y), d: Math.hypot(x - 280, y - 132) });
  }
  const edges: [number, number][] = [];
  nodes.forEach((a, i) => {
    const near = nodes
      .map((b, j) => ({ j, dist: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.dist - q.dist)
      .slice(0, 2);
    near.forEach(({ j }) => {
      if (!edges.some(([p, q]) => (p === i && q === j) || (p === j && q === i))) edges.push([i, j]);
    });
  });
  return { nodes, edges };
})();

export function NeuralBrain() {
  const { nodes, edges } = BRAIN;
  return (
    <div className="mx mx--brain">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-svg" role="img" aria-label="A neural brain: your question flows in, Aan reasons across your data, the answer flows out">
        <path
          d="M154,140 C140,92 178,52 228,56 C250,34 306,32 326,54 C374,46 418,84 412,128 C434,160 408,206 362,206 C342,226 300,224 284,212 C266,226 216,226 200,206 C160,212 134,180 154,140 Z"
          className="mx-face mx-face--t mx-brain"
        />
        <path d="M282,58 C268,92 296,120 280,150 C268,176 292,196 284,212" className="mx-etch" />
        <path d="M196,96 C214,104 220,120 206,134 M352,92 C336,104 334,122 350,136 M210,176 C230,170 244,180 246,194 M342,178 C326,172 314,182 312,196" className="mx-etch" />
        {edges.map(([a, b], k) => (
          <line
            key={k}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            className="mx-synapse"
            style={{ animationDelay: `${(Math.min(nodes[a].d, nodes[b].d) / 130).toFixed(2)}s` }}
          />
        ))}
        {nodes.map((n, k) => (
          <circle key={k} cx={n.x} cy={n.y} r="3.4" className="mx-neuron" style={{ animationDelay: `${(n.d / 130).toFixed(2)}s` }} />
        ))}
        <circle cx="280" cy="132" r="26" className="mx-socket mx-socket--fill" />
        <circle cx="280" cy="132" r="38" className="mx-ring mx-ring--0" />

        <path d="M20,132 H150" className="mx-trace" />
        <Packets d="M20,132 H150" n={2} dur={1.4} />
        <text x="20" y="120" className="mx-label mx-label--sm">
          YOUR QUESTION
        </text>
        <path d="M414,132 H540" className="mx-trace mx-trace--out" />
        <Packets d="M414,132 H540" n={2} dur={1.4} className="mx-packets--out" />
        <text x="540" y="120" textAnchor="end" className="mx-label mx-label--sm">
          THE WHY
        </text>
      </svg>
      <Dock x={280} y={128} state="circle" bubble="Thinking with your data." size={58} />
    </div>
  );
}
