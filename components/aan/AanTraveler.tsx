"use client";

import { useEffect, useRef, useState } from "react";
import { AanMascot, type AanState } from "./AanMascot";

/**
 * One persistent Aan for the whole homepage.
 *
 * Every <section data-stop="id"> holds one [data-dock] element. Aan sits on the
 * dock of the section that owns the viewport centre. When the next section's top
 * crosses the centre, Aan lifts off (morphs to "bar"), arcs over to the next
 * dock, lands (morphs to that dock's state) and the section powers up
 * (data-powered="true"). Docks are measured live every frame, so docks inside
 * 3D transforms (the lazy Susan hub) or sticky scenes (Night Watch patrol) work.
 *
 * The same loop flips the nav / island chrome to dark when they sit over a
 * [data-surface="dark"] area.
 */

const BASE = 100; // mascot render size; scaled per dock

type Stop = { id: string; section: HTMLElement; dock: HTMLElement };

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function AanTraveler() {
  const el = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<AanState>("diamond");
  const [bubble, setBubble] = useState<string>("");
  const [showBubble, setShowBubble] = useState(false);
  const [hover, setHover] = useState(false);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let stops: Stop[] = [];
    const collect = () => {
      stops = Array.from(document.querySelectorAll<HTMLElement>("[data-stop]"))
        .map((section) => ({
          id: section.dataset.stop!,
          section,
          dock: section.querySelector<HTMLElement>("[data-dock]")!,
        }))
        .filter((s) => s.dock);
    };
    collect();
    const surfaces = () => Array.from(document.querySelectorAll<HTMLElement>("[data-surface]"));
    let surfaceEls = surfaces();

    const overrides: Record<string, AanState | null> = {};
    const onOverride = (e: Event) => {
      const d = (e as CustomEvent<{ stop: string; state: AanState | null }>).detail;
      overrides[d.stop] = d.state;
    };
    window.addEventListener("aan:override", onOverride);

    let phase = 0;
    let lastNow = 0;
    let lastState: AanState = "diamond";
    let lastBubble = "";
    let lastIndex = -1;
    let lastDocked = false;
    let lastFlip = false;
    let dockedSince = 0;
    let bubbleOn = false;
    let navDark = "";
    let islandDark = "";
    let raf = 0;

    const center = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!stops.length) return;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const c = vh * 0.5;
      // Aan sets off when the next dock rises to y0 and lands when it reaches y1.
      // Sections marked data-hold (the sticky Night Watch) keep Aan docked for
      // as long as they own the viewport centre.
      const y0 = vh * 0.9;
      const y1 = reduce ? y0 - 1 : vh * 0.55;
      const dockRects = stops.map((s) => s.dock.getBoundingClientRect());
      const held = stops.map((s) => s.section.dataset.hold === "true" && s.section.getBoundingClientRect().top <= c);
      // where the scroll says Aan should be: phase = (from stop) + progress
      let ti = 0;
      for (let k = 1; k < stops.length; k++) if (center(dockRects[k]).y <= y0 || held[k]) ti = k;
      const tt = ti > 0 ? (held[ti] ? 1 : clamp((y0 - center(dockRects[ti]).y) / (y0 - y1), 0, 1)) : 1;
      const target = ti === 0 ? 0 : ti - 1 + tt;

      // Aan glides toward it (damped), so fast scrolls become one smooth flight
      const dt = Math.min(300, lastNow ? now - lastNow : 16.67); // catch up after throttled frames
      lastNow = now;
      const gap = target - phase;
      const rate = Math.abs(gap) > 1.2 ? 0.2 : 0.11;
      phase = reduce ? target : phase + gap * (1 - Math.pow(1 - rate, dt / 16.67));
      if (Math.abs(target - phase) < 0.0008) phase = target;

      let j = Math.floor(phase + 1e-6);
      let frac = phase - j;
      if (j >= stops.length - 1) {
        j = stops.length - 1;
        frac = 0;
      }
      const i = frac > 0 ? j + 1 : j; // destination stop
      let t = frac > 0 ? frac : 1;

      const cur = stops[i];
      const B = center(dockRects[i]);
      const small = vw < 640;
      const sizeOf = (d: HTMLElement) => Number((small && d.dataset.sizeSm) || d.dataset.size || 64);
      const sizeB = sizeOf(cur.dock);

      let A = B;
      let sizeA = sizeB;
      if (frac > 0) {
        A = center(dockRects[j]);
        A = { x: clamp(A.x, 40, vw - 40), y: clamp(A.y, 90, vh - 90) };
        sizeA = sizeOf(stops[j].dock);
      } else {
        t = 1;
      }

      const e = ease(t);
      const swing = Math.sin(Math.PI * t) * Math.min(90, vw * 0.08);
      const x = A.x + (B.x - A.x) * e + (B.x < A.x ? -swing : swing);
      const y = A.y + (B.y - A.y) * e - Math.sin(Math.PI * t) * 24;
      const size = sizeA + (sizeB - sizeA) * e;
      const scale = size / BASE;
      const tilt = t > 0 && t < 1 ? Math.sin(Math.PI * t) * (B.x < A.x ? -10 : 10) : 0;
      node.style.transform = `translate3d(${x - BASE / 2}px, ${y - BASE / 2}px, 0) scale(${scale.toFixed(4)}) rotate(${tilt.toFixed(2)}deg)`;
      node.style.setProperty("--k", scale.toFixed(4)); // bubble counter-scales to stay readable

      // light bubble when Aan sits on a dark surface
      const surf = cur.section.dataset.surface === "dark" ? "dark" : "light";
      if (node.dataset.surface !== surf) node.dataset.surface = surf;

      const docked = t >= 0.97;
      const traveling = t > 0.06 && t < 0.94;
      // docked Aan is always the idle diamond, eyes on the pointer
      const dockState: AanState = "diamond";
      void overrides;
      const next: AanState = traveling ? "bar" : dockState;
      if (next !== lastState) {
        lastState = next;
        setState(next);
      }

      // bubble placement: flip to the left when near the right edge
      const f = x > vw * 0.58 && x > 220;
      if (f !== lastFlip) {
        lastFlip = f;
        setFlip(f);
      }

      // powered sections
      for (let k = 0; k < stops.length; k++) {
        const on = k < i || (k === i && t >= 0.9);
        const v = on ? "true" : "false";
        if (stops[k].section.dataset.powered !== v) {
          stops[k].section.dataset.powered = v;
          stops[k].section.dispatchEvent(new CustomEvent("aan:power", { detail: on }));
        }
      }

      if (i !== lastIndex || docked !== lastDocked) {
        if (docked) window.dispatchEvent(new CustomEvent("aan:dock", { detail: cur.id }));
        lastIndex = i;
        lastDocked = docked;
        dockedSince = now;
      }
      const wantBubble = docked && now - dockedSince > 280 && B.y > 60 && B.y < vh - 60;
      const text = cur.dock.dataset.bubble || "";
      if (text !== lastBubble) {
        lastBubble = text;
        setBubble(text);
      }
      if (wantBubble !== bubbleOn) {
        bubbleOn = wantBubble;
        setShowBubble(wantBubble);
      }

      // chrome over dark surfaces
      let nd = "";
      let id = "";
      for (const s of surfaceEls) {
        if (s.dataset.surface !== "dark") continue;
        const r = s.getBoundingClientRect();
        if (r.top <= 40 && r.bottom >= 40) nd = "dark";
        if (r.top <= vh - 44 && r.bottom >= vh - 44) id = "dark";
      }
      if (nd !== navDark) {
        navDark = nd;
        if (nd) document.documentElement.dataset.nav = nd;
        else delete document.documentElement.dataset.nav;
      }
      if (id !== islandDark) {
        islandDark = id;
        if (id) document.documentElement.dataset.island = id;
        else delete document.documentElement.dataset.island;
      }
    };

    raf = requestAnimationFrame(tick);
    const onResize = () => {
      collect();
      surfaceEls = surfaces();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("aan:override", onOverride);
    };
  }, []);

  return (
    <div
      ref={el}
      className="aan-traveler"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <AanMascot state={state} size={BASE} className={hover ? "is-hover" : ""} />
      <div className={`aan-bubble ${showBubble || hover ? "is-on" : ""} ${flip ? "is-flip" : ""}`} role="status">
        {hover && !showBubble ? "I'm Aan. I've got this." : bubble}
      </div>
    </div>
  );
}
