"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { AanMascot } from "../aan/AanMascot";
import { FilmAanContext, NeuralCore, ProfitRefinery, RulesFactory, SignalsBoard } from "../machines/Machines";
import { McpDiagram } from "../sections/McpSection";
import { NightWatch } from "../night/NightWatch";
import { isoBox, isoCylinder, makeIso, pts } from "@/lib/iso";
import { BEATS, DURATION, STAMPS, captionAt, shotAt, stampAt, type Shot } from "./timeline";

type Ratio = "16x9" | "9x16";
const DIMS: Record<Ratio, { w: number; h: number }> = {
  "16x9": { w: 1920, h: 1080 },
  "9x16": { w: 540, h: 960 }, // rendered at 2x device pixels = 1080×1920
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const lerp = (a: number, b: number, v: number) => a + (b - a) * clamp(v);
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

/* ------------------------------------------------------------- stages */
function Seamless({ children }: { children?: ReactNode }) {
  return <div className="fs fs--seam">{children}</div>;
}

function Silhouette({ size, x = 50, y = 54, tilt = 0, eyes = 1 }: { size: number; x?: number; y?: number; tilt?: number; eyes?: number }) {
  return (
    <div className="sil" style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, transform: `translate(-50%, -50%) rotate(${tilt}deg)` }}>
      <span className="sil__body" />
      <span className="sil__eye" style={{ left: "37%", opacity: eyes }} />
      <span className="sil__eye" style={{ left: "63%", opacity: eyes }} />
      <span className="sil__floor" />
    </div>
  );
}

function Room({ H, local }: { H: number; local: number }) {
  const iso = makeIso(960, 760, 1.5);
  const desk = isoBox(iso, -150, -60, 300, 120, 70);
  return (
    <div className="fs fs--room">
      <svg className="fs-room__floor" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {Array.from({ length: 13 }).map((_, k) => {
          const v = -360 + k * 60;
          return (
            <g key={k}>
              <polyline points={pts(iso(-420, v), iso(420, v))} />
              <polyline points={pts(iso(v, -420), iso(v, 420))} />
            </g>
          );
        })}
        <g className="fs-room__desk">
          <polygon points={desk.right} className="r" />
          <polygon points={desk.left} className="l" />
          <polygon points={desk.top} className="t" />
        </g>
      </svg>
      <div className="fs-room__aan" style={{ top: `${40 - Math.sin(local * 1.4) * 0.6}%` }}>
        <AanMascot state="diamond" size={H * 0.36} gaze={[0, 0.15]} />
      </div>
      <div className="fs-room__underlight" />
    </div>
  );
}

function Closeup({ H, W, variant }: { H: number; W: number; variant?: Shot["variant"] }) {
  const base = Math.min(H, W);
  return (
    <Seamless>
      <div className="fs-close" style={{ top: variant === "eyes" ? "52%" : "56%" }}>
        <AanMascot state="diamond" size={base * (variant === "eyes" ? 1.9 : 1.25)} gaze={variant === "eyes" ? [0.15, 0] : [0, 0]} shadow={false} />
      </div>
    </Seamless>
  );
}

function Coins({ local }: { local: number }) {
  const iso = makeIso(960, 720, 1.6);
  const stacks = [
    { x: -120, y: -40, n: 6 + Math.floor(local * 7) },
    { x: 20, y: -80, n: 4 + Math.floor(local * 9) },
    { x: 90, y: 40, n: 3 + Math.floor(local * 5) },
    { x: -230, y: 70, n: Math.floor(Math.max(0, local - 0.3) * 10) },
    { x: 200, y: -60, n: Math.floor(Math.max(0, local - 0.6) * 12) },
  ];
  return (
    <div className="fs fs--dark">
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" className="fs-coins" aria-hidden="true">
        {stacks.map((s, i) => (
          <g key={i}>
            {Array.from({ length: Math.min(s.n, 22) }).map((_, k) => {
              const c = isoCylinder(iso, s.x, s.y, 46, 9, k * 11, 40);
              return (
                <g key={k} className="coin">
                  <path d={c.side} className="coin__side" />
                  <path d={c.top} className="coin__top" />
                </g>
              );
            })}
          </g>
        ))}
      </svg>
      <div className="fs-coins__glow" />
    </div>
  );
}

/* ----------------------------------------------- the machines, powered */
function Machine({ children, card, wide = 0.66, vertical }: { children: ReactNode; card?: ReactNode; wide?: number; vertical: boolean }) {
  return (
    <div className="fs fs--dark fs--machine" data-powered="true">
      <div className="fs-machine__glow" />
      <div className="fs-machine__art" style={{ width: `${(vertical ? 1.28 : wide) * 100}%` }}>
        <FilmAanContext.Provider value={true}>{children}</FilmAanContext.Provider>
      </div>
      {card && <div className="fs-card">{card}</div>}
    </div>
  );
}

function SignalsScene({ t, vertical }: { t: number; vertical: boolean }) {
  const fixed = t >= BEATS.signalsFixed;
  const shown = t >= BEATS.signalsAlert;
  return (
    <Machine
      vertical={vertical}
      card={
        shown && (
          <div className={`fcard ${fixed ? "is-good" : "is-bad"}`}>
            <p className="fcard__k">{fixed ? "✓ Price matched · 03:14" : "03:12 · Buy Box lost · Kitchen Knife Set"}</p>
            <p className="fcard__v">{fixed ? "+$1,651 protected" : "−$136 at risk"}</p>
          </div>
        )
      }
    >
      <SignalsBoard />
    </Machine>
  );
}

function ProfitScene({ t, vertical }: { t: number; vertical: boolean }) {
  const p = ease((t - BEATS.profitCountStart) / (BEATS.profitCountEnd - BEATS.profitCountStart));
  const delta = lerp(-20.6, 25.9, p);
  return (
    <Machine
      vertical={vertical}
      card={
        <div className={`fcard ${p > 0.5 ? "is-good" : "is-bad"}`}>
          <p className="fcard__k">Net profit · today</p>
          <p className="fcard__v">
            {money(lerp(1246, 1568, p))}{" "}
            <span className="fcard__d">
              {delta >= 0 ? "+" : "−"}
              {Math.abs(delta).toFixed(1)}%
            </span>
          </p>
        </div>
      }
    >
      <ProfitRefinery />
    </Machine>
  );
}

const STOPPED = [
  { k: "chef knife 8 inch", v: 86 },
  { k: "cheap knife set", v: 64 },
  { k: "free shipping knives", v: 62 },
];

function RulesScene({ t, vertical }: { t: number; vertical: boolean }) {
  const done = BEATS.rulesStop.filter((s) => t >= s).length;
  const saved = STOPPED.slice(0, done).reduce((a, s) => a + s.v, 0);
  return (
    <Machine
      vertical={vertical}
      card={
        <div className="fcard is-good">
          <p className="fcard__k">Stopped tonight</p>
          {STOPPED.slice(0, done).map((s) => (
            <p key={s.k} className="fcard__row">
              ✕ “{s.k}” <span>${s.v}</span>
            </p>
          ))}
          <p className="fcard__v">{money(saved)} saved</p>
        </div>
      }
    >
      <RulesFactory powered />
    </Machine>
  );
}

const QUESTION = "Why did ROAS drop on Walmart?";
function BrainScene({ t, vertical }: { t: number; vertical: boolean }) {
  const typed = Math.floor(QUESTION.length * clamp((t - BEATS.brainTypeStart) / (BEATS.brainTypeEnd - BEATS.brainTypeStart)));
  return (
    <Machine
      vertical={vertical}
      card={
        t >= BEATS.brainTypeStart - 0.2 && (
          <div className="fcard fcard--chat">
            <p className="fbubble fbubble--you">
              {QUESTION.slice(0, typed)}
              {t < BEATS.brainAnswer && <span className="fcaret" />}
            </p>
            {t >= BEATS.brainAnswer && (
              <p className="fbubble fbubble--aan">CPC rose 22% on “bamboo cutting board”. Move $400/day to Sponsored Brands.</p>
            )}
          </div>
        )
      }
    >
      <NeuralCore />
    </Machine>
  );
}

function McpScene({ t, H, vertical }: { t: number; H: number; vertical: boolean }) {
  const on = BEATS.mcpPlugs.filter((s) => t >= s).length;
  const names = ["Claude", "ChatGPT", "Gemini"];
  return (
    <div className="fs fs--dark fs--machine" data-powered="true">
      <div className="fs-machine__glow" />
      <div className="fs-machine__art fs-machine__art--mcp" style={{ width: vertical ? "135%" : "80%" }}>
        <McpDiagram />
        <div className="fs-mcp-aan">
          <AanMascot state="diamond" size={H * (vertical ? 0.1 : 0.09)} gaze={[0, 0.3]} />
        </div>
      </div>
      <div className="fs-card fs-card--mcp">
        <div className="fcard is-good">
          <p className="fcard__k">Anarix MCP</p>
          <p className="fcard__chips">
            {names.map((n, i) => (
              <span key={n} className={`fchip ${i < on ? "is-on" : ""}`}>
                {n}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

function NightScene({ t }: { t: number }) {
  const holder = useRef<HTMLDivElement>(null);
  const p = clamp((t - BEATS.nightStart) / (BEATS.nightEnd - BEATS.nightStart));
  useEffect(() => {
    const host = holder.current;
    const sec = host?.querySelector<HTMLElement>(".night");
    if (!host || !sec) return;
    const span = sec.offsetHeight - host.clientHeight;
    sec.style.top = `${-p * span}px`;
  }, [p]);
  return (
    <div className="fs fs--night" ref={holder}>
      <FilmAanContext.Provider value={true}>
        <NightWatch />
      </FilmAanContext.Provider>
    </div>
  );
}

function Twist({ H, local }: { H: number; local: number }) {
  return (
    <div className="fs fs--twist">
      <div className="fs-twist__wall" />
      <div className="fs-twist__desk" />
      <div className="fs-twist__aan" style={{ transform: `translate(-50%, -100%) translateY(${Math.abs(Math.sin(local * 5)) * -6}px)` }}>
        <AanMascot state={local > 6 ? "diamond" : "circle"} size={H * 0.22} gaze={[local > 5 ? 0 : -0.4, -0.2]} />
      </div>
    </div>
  );
}

function EndCard({ H, t }: { H: number; t: number }) {
  return (
    <Seamless>
      <p className="fend fend--top">AAN&apos;S</p>
      <div className="fend__aan">
        <AanMascot state="diamond" size={H * 0.34} gaze={[0, 0]} />
      </div>
      <p className="fend fend--bottom">DEBUT</p>
      <p className={`fend__url ${t >= BEATS.url ? "is-on" : ""}`}>anarix.ai/platform</p>
    </Seamless>
  );
}

function Stats() {
  return <div className="fs fs--dark fs--stats" />;
}

/* -------------------------------------------------------------- overlay */
function StampLayer({ t, W, H, light }: { t: number; W: number; H: number; light: boolean }) {
  const s = stampAt(t);
  if (!s) return null;
  const size = Math.min(H * (W > H ? 0.27 : 0.2), (W * 0.92) / (s.text.length * 0.47));
  const age = t - s.t;
  return (
    <div className={`fstamp ${light ? "on-light" : ""} ${s.sub ? "has-sub" : ""}`}>
      <p className="fstamp__w" style={{ fontSize: size, transform: `scaleX(0.62) scale(${1 + Math.max(0, 0.06 - age * 0.5)})` }}>
        {s.text}
      </p>
      {s.sub && <p className="fstamp__sub" style={{ fontSize: H * 0.045 }}>{s.sub}</p>}
    </div>
  );
}

function CaptionLayer({ t, H }: { t: number; H: number }) {
  const c = captionAt(t);
  if (!c) return null;
  return (
    <p className={`fcap fcap--${c.kind}`} style={{ fontSize: H * (c.kind === "twist" ? 0.05 : 0.042) }}>
      {c.text}
    </p>
  );
}

/* ---------------------------------------------------------------- film */
export function Film() {
  const [ratio, setRatio] = useState<Ratio>("16x9");
  const [t, setT] = useState(0);
  const [scale, setScale] = useState(1);
  const stage = useRef<HTMLDivElement>(null);
  const { w: W, h: H } = DIMS[ratio];

  // align every CSS animation and SMIL timeline to the film clock
  const syncAnimations = useCallback((time: number) => {
    document.getAnimations().forEach((a) => {
      a.pause();
      a.currentTime = time * 1000;
    });
    stage.current?.querySelectorAll("svg").forEach((svg) => {
      try {
        svg.pauseAnimations();
        svg.setCurrentTime(time);
      } catch {}
    });
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("ar") === "9x16") setRatio("9x16");
    const start = Number(q.get("t") || 0);
    setT(start);
    const w = window as unknown as { __seek: (s: number) => Promise<boolean>; __duration: number };
    w.__duration = DURATION;
    w.__seek = async (s: number) => {
      flushSync(() => setT(s));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      syncAnimations(s);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null))));
      return true;
    };
    document.documentElement.dataset.theme = "dark";
    document.documentElement.classList.add("is-film");

    // live preview: ?play=1 plays in real time
    if (q.get("play") === "1") {
      let raf = 0;
      const t0 = performance.now() - start * 1000;
      const loop = () => {
        const now = ((performance.now() - t0) / 1000) % DURATION;
        setT(now);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }
  }, [syncAnimations]);

  // fit the stage into the window for preview (render viewport = stage size)
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [W, H]);

  const shot = shotAt(t);
  const local = t - shot.start;
  // every stamp lands like a punch: a short flash and a camera kick
  const hit = [...STAMPS].reverse().find((s) => s.t <= t);
  const hitAge = hit ? t - hit.t : 9;
  const kick = hitAge < 0.18 ? (1 - hitAge / 0.18) : 0;
  const shake = kick * H * 0.008;
  const prog = clamp(local / (shot.end - shot.start));
  const vertical = ratio === "9x16";
  const light = shot.scene === "seamless" || shot.scene === "closeup" || shot.scene === "end";

  let scene: ReactNode = null;
  switch (shot.scene) {
    case "room":
      scene = <Room H={H} local={local} />;
      break;
    case "seamless":
      scene = (
        <Seamless>
          {shot.variant === "low" ? (
            <Silhouette size={H * 0.3} x={62} y={66} tilt={18} />
          ) : shot.variant === "side" ? (
            <Silhouette size={H * 0.46} x={vertical ? 50 : 40} y={56} tilt={-12} />
          ) : (
            <Silhouette size={H * 0.5} y={55} eyes={local > 0.6 ? 1 : 0.15} />
          )}
        </Seamless>
      );
      break;
    case "closeup":
      scene = <Closeup H={H} W={W} variant={shot.variant} />;
      break;
    case "coins":
      scene = <Coins local={local} />;
      break;
    case "signals":
      scene = <SignalsScene t={t} vertical={vertical} />;
      break;
    case "profit":
      scene = <ProfitScene t={t} vertical={vertical} />;
      break;
    case "rules":
      scene = <RulesScene t={t} vertical={vertical} />;
      break;
    case "brain":
      scene = <BrainScene t={t} vertical={vertical} />;
      break;
    case "mcp":
      scene = <McpScene t={t} H={H} vertical={vertical} />;
      break;
    case "night":
      scene = <NightScene t={t} />;
      break;
    case "stats":
      scene = <Stats />;
      break;
    case "twist":
      scene = <Twist H={H} local={local} />;
      break;
    case "end":
      scene = <EndCard H={H} t={t} />;
      break;
  }

  return (
    <div className="film-viewport">
      <div
        ref={stage}
        className={`film-stage film-stage--${ratio}`}
        style={{ width: W, height: H, transform: `scale(${scale})` }}
        data-scene={shot.scene}
      >
        <div key={`${shot.start}`} className="film-cam" style={{ transform: `translate(${(Math.sin(t * 91) * shake).toFixed(2)}px, ${(Math.cos(t * 77) * shake).toFixed(2)}px) scale(${1 + (shot.push ?? 0) * prog + kick * 0.03})` }}>
          {scene}
        </div>
        {kick > 0 && <div className="film-flash" style={{ opacity: kick * (light ? 0.18 : 0.12) }} />}
        <StampLayer t={t} W={W} H={H} light={light} />
        <CaptionLayer t={t} H={H} />
        <div className={`film-vignette ${light ? "is-light" : ""}`} />
        <div className="film-grain" />
      </div>
    </div>
  );
}
