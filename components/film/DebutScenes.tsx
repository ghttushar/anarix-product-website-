"use client";

import type { CSSProperties, ReactNode } from "react";
import { AanMascot, type AanState } from "../aan/AanMascot";

/*
  "Aan's debut", drawn: every shot of the trend's grammar (the desk, the
  stand, the close-up, the couch, the window, the montage) as a line drawing
  of the City Nocturne world, with the real vector Aan in it. No photographs.
  Stage 540 × 960. Each scene is a back drawing, Aan, then a front drawing
  (the desk or the couch that Aan sits behind).
*/
export const STAGE_W = 540;
export const STAGE_H = 960;

function Art({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <svg className={`ds-art ${className}`} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {children}
    </svg>
  );
}

/** Aan, placed by the point under its feet (x, y) in stage px */
function Aan({ x, y, size, state = "diamond", gaze, shadow = true }: { x: number; y: number; size: number; state?: AanState; gaze?: [number, number]; shadow?: boolean }) {
  return (
    <div className="ds-aan" style={{ left: x, top: y } as CSSProperties}>
      <AanMascot state={state} size={size} glow={false} shadow={shadow} gaze={gaze} />
    </div>
  );
}

/* ---------------------------------------------------------- the city */
const TOWERS = [
  { x: -10, w: 70, h: 260 },
  { x: 66, w: 54, h: 330 },
  { x: 126, w: 82, h: 220 },
  { x: 214, w: 60, h: 380 },
  { x: 280, w: 90, h: 280 },
  { x: 376, w: 58, h: 350 },
  { x: 440, w: 110, h: 240 },
];

/** a skyline standing on y, with a few windows lit */
function Skyline({ base, k = 1, seed = 0 }: { base: number; k?: number; seed?: number }) {
  return (
    <g>
      {TOWERS.map((t, i) => {
        const h = t.h * k;
        const top = base - h;
        const cols = Math.max(2, Math.floor(t.w / 22));
        const rows = Math.floor((h - 24) / 30);
        const wins = [];
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < cols; c++) {
            const lit = (r * 5 + c * 3 + i + seed) % 7 === 0;
            wins.push(<rect key={`${r}-${c}`} className={`ds-win ${lit ? "ds-lit" : ""}`} x={t.x + 8 + c * 20} y={top + 14 + r * 30} width={10} height={14} />);
          }
        return (
          <g key={i}>
            <rect className="ds-body" x={t.x} y={top} width={t.w} height={h} />
            {wins}
          </g>
        );
      })}
    </g>
  );
}

/** a window onto the city: frame, mullions, the skyline inside */
function CityWindow({ x, y, w, h, id }: { x: number; y: number; w: number; h: number; id: string }) {
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <g transform={`translate(${x + w / 2 - 270} 0)`}>
          <Skyline base={y + h + 30} k={(h / 380) * 0.95} seed={x} />
        </g>
        <circle className="ds-moon" cx={x + w * 0.78} cy={y + h * 0.2} r={16} />
      </g>
      <rect x={x} y={y} width={w} height={h} />
      <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} />
      <line x1={x} y1={y + h * 0.42} x2={x + w} y2={y + h * 0.42} />
    </g>
  );
}

const Floor = ({ y }: { y: number }) => <line x1={-20} y1={y} x2={STAGE_W + 20} y2={y} />;

/* ---------------------------------------------------------------- shots */

/** the desk: Aan at work, the city behind */
function Desk() {
  return (
    <>
      <Art>
        <CityWindow x={70} y={120} w={400} h={400} id="w-desk" />
        <Floor y={870} />
      </Art>
      <Aan x={230} y={720} size={250} shadow={false} />
      <Art>
        <rect className="ds-body" x={30} y={688} width={480} height={18} />
        <rect className="ds-body" x={60} y={706} width={420} height={200} />
        <line x1={270} y1={706} x2={270} y2={906} />
        {/* the screen Aan works from */}
        <rect className="ds-body" x={330} y={580} width={150} height={96} rx={6} />
        <path className="ds-hot" d="M346 656 L 378 636 L 404 646 L 434 612 L 464 600" />
        <line x1={405} y1={676} x2={405} y2={688} />
        {/* a mug */}
        <path className="ds-body" d="M86 652 h32 v36 h-32 z" />
        <path d="M118 662 c10 0 10 16 0 16" />
      </Art>
    </>
  );
}

/** standing, thinking it through */
function StandChin() {
  return (
    <>
      <Art>
        {[60, 200, 340].map((x, i) => (
          <CityWindow key={x} x={x} y={90} w={130} h={560} id={`w-stand-${i}`} />
        ))}
        <Floor y={840} />
      </Art>
      <Aan x={270} y={840} size={300} gaze={[0.2, -0.6]} />
    </>
  );
}

/** the close-up: Aan's face fills the frame */
function Closeup({ scale = 1 }: { scale?: number }) {
  return (
    <>
      <Art>
        <CityWindow x={-40} y={60} w={620} h={840} id="w-close" />
      </Art>
      <div className="ds-zoom" style={{ transform: `scale(${scale})` }}>
        <Aan x={270} y={1010} size={880} shadow={false} gaze={[0, -0.1]} />
      </div>
    </>
  );
}

/** the couch: off duty, still watching */
function Couch() {
  return (
    <>
      <Art>
        <rect x={180} y={250} width={180} height={120} />
        <path className="ds-hot" d="M198 350 L 236 322 L 270 332 L 306 296 L 342 284" />
        <line x1={460} y1={840} x2={460} y2={470} />
        <path className="ds-body" d="M432 470 h56 l-12 -40 h-32 z" />
        <rect className="ds-body" x={92} y={540} width={356} height={150} rx={18} />
        <Floor y={840} />
      </Art>
      <Aan x={270} y={700} size={190} shadow={false} />
      <Art>
        <rect className="ds-body" x={78} y={680} width={384} height={90} rx={10} />
        <rect className="ds-body" x={56} y={610} width={56} height={176} rx={14} />
        <rect className="ds-body" x={428} y={610} width={56} height={176} rx={14} />
        <line x1={100} y1={786} x2={100} y2={840} />
        <line x1={440} y1={786} x2={440} y2={840} />
      </Art>
    </>
  );
}

/** at the window, looking out over the stores */
function Side() {
  return (
    <>
      <Art>
        <CityWindow x={240} y={110} w={330} h={640} id="w-side" />
        <Floor y={840} />
      </Art>
      <Aan x={140} y={840} size={230} gaze={[1, -0.3]} />
    </>
  );
}

/** the couch from the side */
function CouchSide() {
  return (
    <>
      <Art>
        <CityWindow x={300} y={140} w={220} h={420} id="w-couch-side" />
        <Floor y={840} />
        <path className="ds-body" d="M120 690 V 560 Q 120 530 150 530 H 196 V 690 Z" />
      </Art>
      <Aan x={290} y={700} size={200} gaze={[0.8, -0.2]} shadow={false} />
      <Art>
        <path className="ds-body" d="M100 690 H 470 Q 490 690 490 710 V 770 H 100 Z" />
        <path className="ds-body" d="M440 640 Q 476 640 476 676 V 770 H 440 Z" />
        <line x1={130} y1={770} x2={130} y2={840} />
        <line x1={460} y1={770} x2={460} y2={840} />
      </Art>
    </>
  );
}

/** arms crossed, in front of the wall of screens */
function Crossed() {
  return (
    <>
      <Art>
        {[
          [40, 150],
          [200, 120],
          [360, 150],
        ].map(([x, y], i) => (
          <g key={x}>
            <rect className="ds-body" x={x} y={y} width={140} height={100} rx={6} />
            <path className={i === 1 ? "ds-hot" : undefined} d={`M${x + 14} ${y + 80} L ${x + 44} ${y + 60} L ${x + 70} ${y + 68} L ${x + 100} ${y + 40} L ${x + 126} ${y + 30}`} />
          </g>
        ))}
        {[
          [40, 280],
          [200, 270],
          [360, 280],
        ].map(([x, y]) => (
          <g key={x}>
            <rect className="ds-body" x={x} y={y} width={140} height={100} rx={6} />
            {[0, 1, 2, 3].map((b) => (
              <line key={b} x1={x + 24 + b * 28} y1={y + 84} x2={x + 24 + b * 28} y2={y + 84 - (18 + ((b * 13 + x) % 40))} />
            ))}
          </g>
        ))}
        <Floor y={860} />
      </Art>
      <Aan x={270} y={860} size={290} />
    </>
  );
}

/** the wide: the whole street at night, Aan small in the middle of it */
function StandSmall() {
  return (
    <>
      <Art>
        <circle className="ds-moon" cx={420} cy={150} r={22} />
        {[
          [70, 90],
          [180, 200],
          [330, 120],
          [480, 260],
          [110, 320],
        ].map(([x, y]) => (
          <path key={`${x}`} d={`M${x - 5} ${y} h10 M${x} ${y - 5} v10`} />
        ))}
        <g transform="translate(0 40)">
          <Skyline base={820} k={1.2} seed={3} />
        </g>
        <Floor y={860} />
        <line x1={-20} y1={900} x2={560} y2={900} strokeDasharray="22 18" />
      </Art>
      <Aan x={270} y={860} size={84} />
    </>
  );
}

/** chin up: close, thoughtful */
function Chin() {
  return (
    <>
      <Art>
        <CityWindow x={20} y={70} w={500} h={760} id="w-chin" />
      </Art>
      <Aan x={270} y={900} size={460} gaze={[-0.5, -0.5]} shadow={false} />
    </>
  );
}

/** the DEBUT card: Aan, on the light card the trend ends on */
function End() {
  return (
    <div className="ds-end">
      <Aan x={270} y={600} size={300} />
    </div>
  );
}

/* ------------------------------------------------------------- montage */
/** band 1: Aan's eye, watching */
export function BandEye({ drift }: { drift: number }) {
  return (
    <div className="ds-scene ds-scene--band">
      <div className="ds-zoom" style={{ transform: `scale(${1 + drift * 0.03})` }}>
        <Aan x={270} y={720} size={1120} shadow={false} gaze={[0.3, 0]} />
      </div>
    </div>
  );
}

/** band 2: the profit line climbing */
export function BandProfit({ drift }: { drift: number }) {
  const k = Math.min(1, 0.55 + drift * 0.5);
  return (
    <div className="ds-scene ds-scene--band">
      <svg className="ds-art" viewBox="0 0 540 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {[80, 140, 200, 260].map((y) => (
          <line key={y} className="ds-faint" x1={20} y1={y} x2={520} y2={y} />
        ))}
        {[40, 110, 180, 250, 320, 390, 460].map((x, i) => (
          <rect key={x} className="ds-body" x={x} y={280 - (40 + i * 26) * k} width={44} height={(40 + i * 26) * k} />
        ))}
        <path className="ds-hot ds-thick" d={`M62 ${280 - 60 * k} L 132 ${280 - 78 * k} L 202 ${280 - 100 * k} L 272 ${280 - 118 * k} L 342 ${280 - 150 * k} L 412 ${280 - 170 * k} L 482 ${280 - 210 * k}`} />
        <line x1={20} y1={280} x2={520} y2={280} />
      </svg>
    </div>
  );
}

/** band 3: past every store on the street */
export function BandStores({ drift }: { drift: number }) {
  const shops = ["Amazon", "Walmart", "Shopify", "Amazon", "Walmart", "Shopify"];
  return (
    <div className="ds-scene ds-scene--band">
      <svg className="ds-art" viewBox="0 0 540 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g transform={`translate(${-drift * 60} 0)`}>
          {shops.map((k, i) => {
            const x = 20 + i * 190;
            return (
              <g key={i}>
                <rect className="ds-body" x={x} y={90} width={170} height={200} />
                <rect x={x + 16} y={104} width={138} height={30} />
                <text x={x + 85} y={125} className="ds-label">
                  {k}
                </text>
                <rect className={`ds-win ${i === 2 ? "ds-lit" : ""}`} x={x + 16} y={160} width={70} height={70} />
                <rect x={x + 104} y={190} width={50} height={100} />
              </g>
            );
          })}
          <line x1={-20} y1={290} x2={1200} y2={290} />
        </g>
      </svg>
    </div>
  );
}

/* --------------------------------------------------------------- routing */
export type SceneName = "desk" | "standChin" | "closeup" | "couch" | "side" | "couchSide" | "crossed" | "standSmall" | "chin" | "end";

const SCENES: Record<SceneName, () => ReactNode> = {
  desk: () => <Desk />,
  standChin: () => <StandChin />,
  closeup: () => <Closeup />,
  couch: () => <Couch />,
  side: () => <Side />,
  couchSide: () => <CouchSide />,
  crossed: () => <Crossed />,
  standSmall: () => <StandSmall />,
  chin: () => <Chin />,
  end: () => <End />,
};

/** one shot, with the trend's slow push-in */
export function Scene({ name, zoom = 1 }: { name: SceneName; zoom?: number }) {
  return (
    <div className={`ds-scene ${name === "end" ? "ds-scene--end" : ""}`}>
      <div className="ds-zoom" style={{ transform: `scale(${zoom})` }}>
        {SCENES[name]()}
      </div>
    </div>
  );
}
