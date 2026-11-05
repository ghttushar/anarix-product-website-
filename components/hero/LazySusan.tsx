"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FIGURES } from "./SectorFigures";

/**
 * The hero lazy Susan, built after hairline's Turntable figure: an isometric
 * plate you flick to spin. It coasts, then settles on the nearest quarter turn.
 * The sector facing you is active; clicking it (or its tab) jumps to that
 * section, so the turntable doubles as the homepage jump bar. Aan stands on the
 * hub (the hub is Aan's first dock). The plate spins on an MCP spindle.
 */

export const SECTORS = [
  { id: "aan", label: "Aan", line: "Ask. Get proof." },
  { id: "signals", label: "Signals", line: "Know first." },
  { id: "profitability", label: "Profitability", line: "Real profit. Daily." },
  { id: "rules", label: "Rules", line: "Set once. Runs forever." },
] as const;

const TILT = 62;
const norm = (a: number) => ((a % 360) + 360) % 360;
// point on the plate (1000×1000 svg), rounded so server and client markup match exactly
const pc = (rad: number, ang: number) =>
  [Math.round((500 + rad * Math.cos(ang)) * 100) / 100, Math.round((500 + rad * Math.sin(ang)) * 100) / 100] as const;
// sector i sits at plate angle 90*i; it faces the viewer when theta + 90i = 90
const thetaFor = (i: number) => 90 - 90 * i;
const activeFrom = (theta: number) => ((Math.round((90 - theta) / 90) % 4) + 4) % 4;

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LazySusan() {
  const tiltRef = useRef<HTMLDivElement>(null);
  const theta = useRef(90);
  const vel = useRef(0);
  const anim = useRef(0);
  const target = useRef<number | null>(null);
  const drag = useRef<{ x: number; t: number; theta: number; moved: boolean; lx: number; lt: number } | null>(null);
  const interacted = useRef(false);
  const [active, setActive] = useState(0);

  const paint = useCallback(() => {
    tiltRef.current?.style.setProperty("--theta", `${theta.current}deg`);
    const a = activeFrom(theta.current);
    setActive((p) => (p === a ? p : a));
  }, []);

  const loop = useCallback(() => {
    cancelAnimationFrame(anim.current);
    const step = () => {
      if (drag.current) return;
      if (target.current === null) {
        // coasting
        theta.current += vel.current;
        vel.current *= 0.94;
        if (Math.abs(vel.current) < 0.35) {
          const snapped = Math.round((theta.current - 90) / 90) * 90 + 90;
          target.current = snapped;
        }
      } else {
        // settle on the quarter turn (critically damped-ish)
        const d = target.current - theta.current;
        vel.current = vel.current * 0.72 + d * 0.11;
        theta.current += vel.current;
        if (Math.abs(d) < 0.05 && Math.abs(vel.current) < 0.05) {
          theta.current = target.current;
          target.current = null;
          vel.current = 0;
          paint();
          return;
        }
      }
      paint();
      anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  }, [paint]);

  const goTo = useCallback(
    (i: number) => {
      // shortest way round to sector i
      const want = thetaFor(i);
      const cur = theta.current;
      const delta = ((norm(want - cur) + 180) % 360) - 180;
      target.current = cur + delta;
      vel.current = 0;
      loop();
    },
    [loop],
  );

  const markInteracted = () => {
    interacted.current = true;
  };

  // gentle autoplay until the visitor touches it (hairline's `play`)
  useEffect(() => {
    paint();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      if (interacted.current || drag.current || window.scrollY > 200) return;
      goTo((activeFrom(theta.current) + 1) % 4);
    }, 3800);
    return () => window.clearInterval(id);
  }, [goTo, paint]);

  const onPointerDown = (e: React.PointerEvent) => {
    markInteracted();
    cancelAnimationFrame(anim.current);
    target.current = null;
    drag.current = { x: e.clientX, t: performance.now(), theta: theta.current, moved: false, lx: e.clientX, lt: performance.now() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    const now = performance.now();
    const dt = Math.max(1, now - d.lt);
    // degrees per frame (~16ms) from the last pointer delta
    // dragging right carries the front edge of the plate to the right (theta decreases)
    vel.current = ((-(e.clientX - d.lx) * 0.32) / dt) * 16;
    d.lx = e.clientX;
    d.lt = now;
    theta.current = d.theta - dx * 0.32;
    paint();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) {
      // a tap: if it hit a sector figure, rotate to it / jump
      const hit = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest<HTMLElement>("[data-sector]");
      if (hit) {
        const i = Number(hit.dataset.sector);
        if (i === activeFrom(theta.current)) {
          scrollToSection(SECTORS[i].id);
        } else goTo(i);
        return;
      }
    }
    vel.current = Math.max(-18, Math.min(18, vel.current));
    loop();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    markInteracted();
    const a = activeFrom(theta.current);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo((a + 1) % 4);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo((a + 3) % 4);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToSection(SECTORS[a].id);
    }
  };

  const cur = SECTORS[active];

  return (
    <div className="susan">
      <div
        className="susan__stage"
        role="group"
        aria-roledescription="turntable"
        aria-label={`Lazy Susan. ${cur.label} is in front. Use left and right arrows to spin, Enter to jump.`}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        {/* MCP spindle + base, drawn behind the plate */}
        <div className="susan__shadow" aria-hidden="true" />
        <svg className="susan__spindle" viewBox="0 0 240 260" aria-hidden="true">
          <path d="M112,0 V196 M128,0 V196" className="spindle-line" />
          <ellipse cx="120" cy="196" rx="8" ry="3" className="spindle-line" />
          <ellipse cx="120" cy="214" rx="74" ry="20" className="spindle-base" />
          <path d="M46,214 V226 M194,214 V226" className="spindle-line" />
          <path d="M46,226 A74,20 0 0 0 194,226" className="spindle-line" />
          <path d="M120,196 V214" className="spindle-pulse" />
        </svg>
        <div className="susan__mcp" aria-hidden="true">
          <span className="susan__mcp-tag">MCP</span>
          <span className="susan__mcp-note">everything spins on your data</span>
        </div>

        <div className="susan__tilt" ref={tiltRef} style={{ "--tilt": `${TILT}deg` } as React.CSSProperties}>
          <div className="susan__plate">
            {/* solid rim: stacked discs give the plate real thickness */}
            {Array.from({ length: 14 }).map((_, k) => (
              <div key={k} className="susan__rim" style={{ transform: `translateZ(${-(k + 1) * 2}px)` }} />
            ))}
            <svg className="susan__top" viewBox="0 0 1000 1000" aria-hidden="true">
              <defs>
                <radialGradient id="plate-grad" cx="45%" cy="40%" r="65%">
                  <stop offset="0%" stopColor="var(--plate-hi)" />
                  <stop offset="100%" stopColor="var(--plate-lo)" />
                </radialGradient>
              </defs>
              <circle cx="500" cy="500" r="496" className="plate-fill" />
              <circle cx="500" cy="500" r="496" className="plate-line" />
              <circle cx="500" cy="500" r="462" className="plate-line plate-line--soft" />
              {SECTORS.map((s, i) => {
                const a = (i * 90 * Math.PI) / 180;
                const a0 = a - Math.PI / 4;
                const a1 = a + Math.PI / 4;
                const R = 462;
                const r = 128;
                const P = (rad: number, ang: number) => pc(rad, ang).join(",");
                const d = `M${P(r, a0)} L${P(R, a0)} A${R},${R} 0 0 1 ${P(R, a1)} L${P(r, a1)} A${r},${r} 0 0 0 ${P(r, a0)}Z`;
                return <path key={s.id} d={d} className={`plate-wedge plate-wedge--${i % 2} ${i === active ? "is-active" : ""}`} />;
              })}
              {Array.from({ length: 36 }).map((_, k) => {
                const a = (k * 10 * Math.PI) / 180;
                const long = k % 3 === 0;
                const r0 = long ? 472 : 480;
                const [x1, y1] = pc(r0, a);
                const [x2, y2] = pc(490, a);
                return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} className="plate-tick" />;
              })}
              {[45, 135, 225, 315].map((deg) => {
                const a = (deg * Math.PI) / 180;
                const [x1, y1] = pc(128, a);
                const [x2, y2] = pc(462, a);
                return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} className="plate-line plate-line--soft" />;
              })}
              <circle cx="500" cy="500" r="128" className="plate-line" />
              <circle cx="500" cy="500" r="96" className="plate-line plate-line--soft" strokeDasharray="4 8" />
              {SECTORS.map((s, i) => {
                const deg = i * 90;
                const a = (deg * Math.PI) / 180;
                const [x, y] = pc(420, a);
                return (
                  <text
                    key={s.id}
                    x={x}
                    y={y}
                    transform={`rotate(${deg - 90} ${x} ${y})`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`plate-label ${i === active ? "is-active" : ""}`}
                  >
                    {`0${i + 1} · ${s.label.toUpperCase()}`}
                  </text>
                );
              })}
            </svg>

            {SECTORS.map((s, i) => {
              const Fig = FIGURES[s.id];
              return (
                <div
                  key={s.id}
                  className={`susan__board ${i === active ? "is-active" : ""}`}
                  style={{ "--a": `${i * 90}deg` } as React.CSSProperties}
                  data-sector={i}
                >
                  <Fig />
                </div>
              );
            })}

            {/* hub: Aan's first dock */}
            {/* raised hub Aan stands on */}
            {Array.from({ length: 12 }).map((_, k) => (
              <div key={`hub${k}`} className={`susan__hub ${k === 11 ? "susan__hub--top" : ""}`} style={{ transform: `translateZ(${(k + 1) * 2}px)` }} />
            ))}
            <div className="susan__board susan__board--hub" style={{ "--a": "0deg" } as React.CSSProperties}>
              <div data-dock data-size="104" data-size-sm="64" data-state="diamond" data-bubble="Hi, I'm Aan. Spin me." className="susan__hub-dock" />
            </div>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {cur.label}: {cur.line}
      </p>

      <div className="susan__tabs" role="tablist" aria-label="Jump to a section">
        {SECTORS.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === active}
            className={`susan__tab ${i === active ? "is-active" : ""}`}
            onClick={() => {
              markInteracted();
              if (i === active) scrollToSection(s.id);
              else {
                goTo(i);
                window.setTimeout(() => scrollToSection(s.id), 420);
              }
            }}
          >
            <span className="susan__tab-label">{s.label}</span>
            <span className="susan__tab-line">{s.line}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
