"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { AanMascot } from "../AanMascot";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import s from "./aan-v2.module.css";

/*
  One Aan for the whole page (docs/redesign/05-motion.md).
  - Screens hold <AanDock> slots inside their drawings, never on product UI.
  - The active stop is the screen crossing the middle of the viewport, so Aan
    docks the moment a screen is on stage.
  - Aan sits in page coordinates and scrolls with the page: no frame loop
    while idle. It glides between docks (450–700ms) and stays a diamond.
  - A dock may declare an entry walk (the hero street): on first arrival Aan
    walks in along the street instead of appearing.
  - A dock can move within its screen (the Night Watch patrol): Aan walks
    along the ground to the new spot instead of hopping.
  - Reduced motion: Aan fades out and back in at the new dock.
*/
export type AanEntry = { dx: number; delay: number; duration: number };
export type DockInfo = {
  stop: string;
  el: HTMLElement;
  section: HTMLElement | null;
  size: number;
  sizeSm?: number;
  bubble?: string;
  side: "left" | "right";
  entry?: AanEntry;
  /** where in its screen the dock currently is; a change means Aan moves */
  at?: string;
  /** how Aan moves when the dock moves within its screen */
  travel?: "fly" | "walk";
};

type Api = { register: (d: DockInfo) => () => void };
const Ctx = createContext<Api | null>(null);
export const useAanRegistry = () => useContext(Ctx);

type Pos = { x: number; y: number; size: number };
const place = (p: Pos, scale = 1) => `translate(${(p.x - p.size / 2).toFixed(1)}px, ${(p.y - p.size).toFixed(1)}px) scale(${scale.toFixed(3)})`;

export function AanProvider({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const docks = useRef(new Map<string, DockInfo>());
  const [version, bump] = useReducer((x: number) => x + 1, 0);
  const [active, setActive] = useState<string | null>(null);
  const lastAt = useRef(new Map<string, string | undefined>());
  const [moveTick, setMoveTick] = useState(0);

  const register = useCallback((d: DockInfo) => {
    const prev = lastAt.current.get(d.stop);
    lastAt.current.set(d.stop, d.at);
    docks.current.set(d.stop, d);
    if (prev !== undefined && prev !== d.at) setMoveTick((t) => t + 1);
    bump();
    return () => {
      if (docks.current.get(d.stop) === d) docks.current.delete(d.stop);
      bump();
    };
  }, []);

  // the screen crossing the viewport's middle line is where Aan belongs
  useEffect(() => {
    const bySection = new Map<Element, string>();
    docks.current.forEach((d) => d.section && bySection.set(d.section, d.stop));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(bySection.get(e.target) ?? null);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    bySection.forEach((_, el) => io.observe(el));
    return () => io.disconnect();
  }, [version]);

  const api = useMemo(() => ({ register }), [register]);

  return (
    <Ctx.Provider value={api}>
      <div ref={stage} className={s.stage}>
        {children}
        <Traveler stage={stage} docks={docks} active={active} version={version} moveTick={moveTick} />
      </div>
    </Ctx.Provider>
  );
}

function Traveler({ stage, docks, active, version, moveTick }: { stage: RefObject<HTMLDivElement | null>; docks: RefObject<Map<string, DockInfo>>; active: string | null; version: number; moveTick: number }) {
  const node = useRef<HTMLDivElement>(null);
  const pos = useRef<Pos | null>(null);
  const anim = useRef<Animation | null>(null);
  const reduced = useReducedMotion();
  const [look, setLook] = useState<{ size: number; bubble?: string; side: "left" | "right" } | null>(null);
  const [bubbleOn, setBubbleOn] = useState(false);

  const measure = useCallback(
    (d: DockInfo): Pos | null => {
      const st = stage.current;
      if (!st || !d.el.isConnected) return null;
      const sr = st.getBoundingClientRect();
      const r = d.el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return null; // its drawing is hidden at this size
      const size = window.innerWidth <= 640 && d.sizeSm ? d.sizeSm : d.size;
      return { x: r.left + r.width / 2 - sr.left, y: r.bottom - sr.top, size };
    },
    [stage],
  );

  // travel to the active dock
  useLayoutEffect(() => {
    if (!active || !node.current) return;
    const d = docks.current.get(active);
    if (!d) return;
    const to = measure(d);
    if (!to) {
      // no drawing to stand in (hidden on small screens): Aan stays put and
      // the screen's moment plays without waiting for it
      d.section?.dispatchEvent(new CustomEvent("aan:arrive", { detail: { stop: d.stop } }));
      return;
    }
    const el = node.current;
    const from = pos.current;
    if (from && Math.abs(from.x - to.x) < 1 && Math.abs(from.y - to.y) < 1) return;

    anim.current?.cancel();
    setBubbleOn(false);
    setLook({ size: to.size, bubble: d.bubble, side: d.side });
    el.style.transform = place(to);
    el.style.opacity = "1";

    let frames: Keyframe[];
    let timing: KeyframeAnimationOptions;
    let walk = false;
    if (reduced) {
      frames = [{ opacity: 0 }, { opacity: 1 }];
      timing = { duration: 200, easing: "linear" };
    } else if (!from && d.entry) {
      walk = true;
      const start = { ...to, x: to.x + d.entry.dx };
      frames = [{ transform: place(start) }, { transform: place(to) }];
      timing = { duration: d.entry.duration, delay: d.entry.delay, easing: "cubic-bezier(0.45, 0, 0.2, 1)", fill: "backwards" };
    } else if (!from) {
      frames = [{ opacity: 0 }, { opacity: 1 }];
      timing = { duration: 320, easing: "ease-out" };
    } else if (d.travel === "walk" && Math.abs(to.y - from.y) < 4) {
      // along the same street: walk, no hop
      frames = [{ transform: place({ ...from, size: to.size }) }, { transform: place(to) }];
      timing = { duration: Math.min(1100, Math.max(420, Math.abs(to.x - from.x) * 2.4)), easing: "cubic-bezier(0.45, 0, 0.25, 1)" };
    } else {
      // far jumps start just outside the viewport rather than streaking across the page
      const vh = window.innerHeight;
      const far = Math.abs(to.y - from.y) > vh * 1.2;
      const start: Pos = far ? { x: to.x, y: to.y + (to.y > from.y ? -vh * 0.6 : vh * 0.6), size: to.size } : from;
      const dist = Math.hypot(to.x - start.x, to.y - start.y);
      const mid: Pos = { x: (start.x + to.x) / 2, y: (start.y + to.y) / 2 - 16, size: to.size };
      frames = [
        { transform: place({ ...start, size: to.size }, from.size / to.size), opacity: far ? 0 : 1 },
        { transform: place(mid, (from.size / to.size + 1) / 2), opacity: 1, offset: 0.5 },
        { transform: place(to), opacity: 1 },
      ];
      timing = { duration: Math.min(700, 450 + dist / 6), easing: "cubic-bezier(0.65, 0, 0.35, 1)" };
    }

    pos.current = to;
    d.section?.dispatchEvent(new CustomEvent("aan:depart", { detail: { walk, delay: Number(timing.delay ?? 0), duration: Number(timing.duration) } }));
    const a = el.animate(frames, timing);
    anim.current = a;
    let bubbleTimer = 0;
    a.finished
      .then(() => {
        d.section?.dispatchEvent(new CustomEvent("aan:arrive", { detail: { stop: d.stop } }));
        window.dispatchEvent(new CustomEvent("aan:dock", { detail: d.stop })); // nav highlights where Aan is
        bubbleTimer = window.setTimeout(() => setBubbleOn(true), 250);
      })
      .catch(() => {});
    return () => window.clearTimeout(bubbleTimer);
  }, [active, reduced, measure, docks, moveTick]);

  // keep Aan on its dock when layout changes (resize, fonts, dock size); no animation
  useEffect(() => {
    const st = stage.current;
    if (!st) return;
    const settle = () => {
      if (!active || !node.current) return;
      const d = docks.current.get(active);
      if (!d) return;
      // what Aan says can change without Aan moving (the Night Watch at dawn)
      setLook((l) => (l && (l.bubble !== d.bubble || l.side !== d.side) ? { ...l, bubble: d.bubble, side: d.side } : l));
      if (anim.current && anim.current.playState === "running") return;
      const to = measure(d);
      if (!to) return;
      pos.current = to;
      node.current.style.transform = place(to);
      setLook((l) => (l ? { ...l, size: to.size, bubble: d.bubble, side: d.side } : l));
    };
    const ro = new ResizeObserver(settle);
    ro.observe(st);
    if (active) {
      const d = docks.current.get(active);
      if (d) ro.observe(d.el);
    }
    document.fonts?.ready.then(settle);
    return () => ro.disconnect();
  }, [active, version, measure, docks, stage]);

  // what Aan says can change while Aan stays put (the Night Watch at dawn)
  useEffect(() => {
    if (!active) return;
    const d = docks.current.get(active);
    if (d) setLook((l) => (l && (l.bubble !== d.bubble || l.side !== d.side) ? { ...l, bubble: d.bubble, side: d.side } : l));
  }, [active, version, docks]);

  // the bubble opens to the dock's side unless that would run off screen
  const bubble = useRef<HTMLParagraphElement>(null);
  const [side, setSide] = useState<"left" | "right">("left");
  useLayoutEffect(() => {
    const b = bubble.current;
    if (!b || !look) return;
    let next = look.side;
    if (bubbleOn) {
      b.dataset.side = next;
      const r = b.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      if (r.right > vw - 8) next = "left";
      else if (r.left < 8) next = "right";
    }
    b.dataset.side = next;
    setSide(next);
  }, [bubbleOn, look]);

  return (
    <div ref={node} className={s.traveler} data-aan-traveler aria-hidden="true" style={{ opacity: look ? undefined : 0, "--size": `${look?.size ?? 48}px` } as CSSProperties}>
      {look && <AanMascot state="diamond" size={look.size} glow={false} shadow={false} />}
      {look?.bubble && (
        <p ref={bubble} className={s.bubble} data-side={side} data-on={bubbleOn ? "true" : "false"}>
          {look.bubble}
        </p>
      )}
    </div>
  );
}
