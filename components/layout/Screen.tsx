"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import s from "./screen.module.css";

/*
  One idea, one screen. A Screen is one viewport tall (fit="grow" lets a
  content section run taller when its information needs the room), its content sits
  between the nav and island insets, and it tells its children three things:
  - inView: it has arrived on screen (drawings draw themselves);
  - walk: Aan is walking or flying in (delay and duration, for trails);
  - arrived: Aan has docked here, so the screen's one moment can play.
  Screens without a dock count as "arrived" shortly after they come into view,
  and a safety timeout makes sure a moment is never stuck waiting.
*/
type ScreenState = {
  inView: boolean;
  arrived: boolean;
  walk: { on: boolean; delay: number; duration: number };
  reduced: boolean;
};

const ScreenCtx = createContext<ScreenState>({ inView: true, arrived: true, walk: { on: false, delay: 0, duration: 0 }, reduced: false });

export const useScreen = () => useContext(ScreenCtx);

export function Screen({
  id,
  className,
  bodyClassName,
  hasDock = false,
  children,
  style,
  label,
  fit = "screen",
}: {
  id: string;
  /** "screen": exactly one viewport; "grow": at least one, taller when the content needs it */
  fit?: "screen" | "grow";
  className?: string;
  bodyClassName?: string;
  /** true when an AanDock lives in this screen (otherwise "arrived" follows inView) */
  hasDock?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  label?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [walk, setWalk] = useState({ on: false, delay: 0, duration: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    const depart = (e: Event) => {
      const d = (e as CustomEvent<{ walk: boolean; delay: number; duration: number }>).detail;
      setWalk({ on: d.walk, delay: d.delay, duration: d.duration });
    };
    const arrive = () => setArrived(true);
    el.addEventListener("aan:depart", depart);
    el.addEventListener("aan:arrive", arrive);
    return () => {
      io.disconnect();
      el.removeEventListener("aan:depart", depart);
      el.removeEventListener("aan:arrive", arrive);
    };
  }, []);

  // no dock (or reduced motion): the moment follows arrival on screen; with a
  // dock, a generous safety net in case Aan is held up elsewhere
  useEffect(() => {
    if (!inView || arrived) return;
    const wait = !hasDock || reduced ? (reduced ? 0 : 700) : 6000;
    const t = window.setTimeout(() => setArrived(true), wait);
    return () => window.clearTimeout(t);
  }, [inView, arrived, hasDock, reduced]);

  return (
    <ScreenCtx.Provider value={{ inView, arrived, walk, reduced }}>
      <section
        ref={ref}
        id={id}
        data-screen={id}
        aria-label={label}
        data-inview={inView ? "true" : "false"}
        data-arrived={arrived ? "true" : "false"}
        data-fit={fit}
        className={`${s.screen} ${fit === "grow" ? s.grow : ""} ${className ?? ""}`}
        style={style}
      >
        <div className={`${s.body} ${bodyClassName ?? ""}`}>{children}</div>
      </section>
    </ScreenCtx.Provider>
  );
}
