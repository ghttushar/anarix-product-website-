// Hairline mini-figures that stand on the lazy Susan (hairline-library style:
// thin isometric line drawings). Grey at rest; they light up and animate when
// their sector faces the viewer (.is-active on the billboard).

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const panel = { fill: "var(--panel-solid)" };

function Ground() {
  return <ellipse cx="60" cy="108" rx="42" ry="9" {...S} opacity="0.55" />;
}

function isoBox(x: number, base: number, w: number, h: number, d = 10) {
  const k = d * 0.58;
  return {
    front: `M${x},${base - h} H${x + w} V${base} H${x} Z`,
    top: `M${x},${base - h} L${x + d},${base - h - k} H${x + w + d} L${x + w},${base - h} Z`,
    side: `M${x + w},${base - h} L${x + w + d},${base - h - k} V${base - k} L${x + w},${base} Z`,
  };
}

export function FigAan() {
  return (
    <svg viewBox="0 0 120 120" className="fig fig--aan" aria-hidden="true">
      <Ground />
      <path d="M16,24 h60 a8,8 0 0 1 8,8 v22 a8,8 0 0 1 -8,8 h-40 l-10,9 v-9 h-10 a8,8 0 0 1 -8,-8 v-22 a8,8 0 0 1 8,-8z" {...S} {...panel} />
      <path d="M26,36 h40 M26,46 h28" {...S} opacity="0.6" />
      <path d="M44,62 h56 a8,8 0 0 1 8,8 v18 a8,8 0 0 1 -8,8 h-6 v9 l-10,-9 h-40 a8,8 0 0 1 -8,-8 v-18 a8,8 0 0 1 8,-8z" {...S} {...panel} className="fig-accent-stroke" />
      <circle cx="62" cy="79" r="3" className="fig-dot fig-dot--1" />
      <circle cx="74" cy="79" r="3" className="fig-dot fig-dot--2" />
      <circle cx="86" cy="79" r="3" className="fig-dot fig-dot--3" />
    </svg>
  );
}

export function FigSignals() {
  return (
    <svg viewBox="0 0 120 120" className="fig fig--signals" aria-hidden="true">
      <Ground />
      <path d="M22,100 a38,38 0 0 1 76,0" {...S} opacity="0.5" />
      <path d="M34,100 a26,26 0 0 1 52,0" {...S} opacity="0.7" />
      <path d="M46,100 a14,14 0 0 1 28,0" {...S} />
      <path d="M60,100 L88,72" {...S} className="fig-sweep" />
      <path d="M14,46 l12,0 l6,-14 l8,26 l6,-12 l8,0" {...S} className="fig-accent-stroke" />
      <circle cx="80" cy="70" r="4" className="fig-blip" />
      <circle cx="80" cy="70" r="4" className="fig-blip-ring" {...S} />
    </svg>
  );
}

export function FigProfit() {
  const bars = [
    { x: 18, h: 18 },
    { x: 40, h: 30 },
    { x: 62, h: 44 },
    { x: 84, h: 62 },
  ];
  return (
    <svg viewBox="0 0 120 120" className="fig fig--profit" aria-hidden="true">
      <Ground />
      {bars.map((b, i) => {
        const p = isoBox(b.x, 104, 14, b.h);
        return (
          <g key={i} className={`fig-bar fig-bar--${i}`}>
            <path d={p.side} {...S} {...panel} />
            <path d={p.top} {...S} {...panel} />
            <path d={p.front} {...S} {...panel} className={i === 3 ? "fig-accent-fill" : ""} />
          </g>
        );
      })}
      <path d="M16,60 L40,52 L62,40 L94,20" {...S} className="fig-trend" />
      <path d="M86,18 L95,19.5 L92,28" {...S} className="fig-trend" />
    </svg>
  );
}

export function FigRules() {
  return (
    <svg viewBox="0 0 120 120" className="fig fig--rules" aria-hidden="true">
      <Ground />
      <path d="M18,98 L60,76 L102,98 L60,120 Z" {...S} opacity="0" />
      {[0, 1, 2].map((i) => {
        const y = 30 + i * 24;
        return (
          <g key={i} className={`fig-toggle fig-toggle--${i}`}>
            <rect x="20" y={y} width="44" height="16" rx="8" {...S} {...panel} className="fig-track" />
            <circle cx="28" cy={y + 8} r="5.5" className="fig-knob" />
            <path d={`M74,${y + 8} h28`} {...S} opacity="0.55" />
          </g>
        );
      })}
    </svg>
  );
}

export const FIGURES = {
  aan: FigAan,
  signals: FigSignals,
  profitability: FigProfit,
  rules: FigRules,
} as const;
