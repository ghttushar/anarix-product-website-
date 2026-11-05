"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import type { AanState } from "../aan/AanMascot";

/** true while Aan is docked on (or has passed) the enclosing section */
export function usePowered<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [powered, setPowered] = useState(false);
  useEffect(() => {
    const section = ref.current?.closest<HTMLElement>("[data-stop]");
    if (!section) return;
    setPowered(section.dataset.powered === "true");
    const on = (e: Event) => setPowered((e as CustomEvent<boolean>).detail);
    section.addEventListener("aan:power", on);
    return () => section.removeEventListener("aan:power", on);
  }, []);
  return [ref, powered] as const;
}

/** count up when powered (GSAP), back to 0 when not */
export function CountUp({
  to,
  powered,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.4,
}: {
  to: number;
  powered: boolean;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const el = useRef<HTMLSpanElement>(null);
  const val = useRef({ v: 0 });
  useEffect(() => {
    const fmt = () => {
      if (el.current)
        el.current.textContent =
          prefix + val.current.v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tween = gsap.to(val.current, {
      v: powered ? to : 0,
      duration: reduce ? 0 : powered ? duration : 0.4,
      ease: powered ? "power3.out" : "power2.in",
      onUpdate: fmt,
    });
    fmt();
    return () => {
      tween.kill();
    };
  }, [powered, to, prefix, suffix, decimals, duration]);
  return <span ref={el} className="tabular" />;
}

/** the dock: a small isometric platform Aan lands on */
export function DockSocket({
  state = "cube",
  bubble,
  size = 60,
  className = "",
}: {
  state?: AanState;
  bubble: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`socket ${className}`} aria-hidden="true">
      <div className="socket__dock" data-dock data-size={size} data-state={state} data-bubble={bubble} />
      <svg className="socket__pad" viewBox="0 0 96 40">
        <ellipse cx="48" cy="14" rx="40" ry="11" className="socket__ring" />
        <ellipse cx="48" cy="14" rx="26" ry="7" className="socket__ring socket__ring--inner" />
        <path d="M8,14 V22 A40,11 0 0 0 88,22 V14" className="socket__side" />
      </svg>
    </div>
  );
}

/** the station: a panel that is grey and dormant until Aan docks */
export function Station({
  title,
  meta,
  children,
  dock,
  dark = false,
  className = "",
}: {
  title: string;
  meta?: string;
  children: ReactNode;
  dock: { state?: AanState; bubble: string; size?: number };
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`station ${dark ? "station--dark" : ""} ${className}`}>
      <span className="station__power" aria-hidden="true" />
      <DockSocket {...dock} />
      <div className="station__head">
        <span className="station__status">
          <span className="station__dot" />
          <span className="station__status-off">Standby</span>
          <span className="station__status-on">Powered by Aan</span>
        </span>
        <span className="station__title">
          {title}
          {meta && <span className="station__meta"> · {meta}</span>}
        </span>
      </div>
      <div className="station__body">{children}</div>
    </div>
  );
}

/** empty slot for real product video / screenshots, to be supplied */
export function MediaSlot({
  kind,
  label,
  ratio = "16 / 10",
  dark = false,
}: {
  kind: "video" | "image";
  label: string;
  ratio?: string;
  dark?: boolean;
}) {
  return (
    <figure className={`media ${dark ? "media--dark" : ""}`} style={{ aspectRatio: ratio }}>
      <div className="media__inner">
        <span className="media__icon" aria-hidden="true">
          {kind === "video" ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="3" />
              <circle cx="9" cy="10" r="2" />
              <path d="m21 16-5-5-9 9" />
            </svg>
          )}
        </span>
        <figcaption>
          <span className="media__kind">{kind === "video" ? "Product video" : "Product screenshot"}</span>
          <span className="media__label">{label}</span>
          <span className="media__ratio">{ratio.replace(/\s/g, "")} · placeholder</span>
        </figcaption>
      </div>
    </figure>
  );
}

/** two-column feature section: copy + media on one side, station on the other */
export function FeatureSection({
  id,
  eyebrow,
  title,
  body,
  bullets,
  media,
  station,
  reverse = false,
  dark = false,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  body: string;
  bullets: string[];
  media: { kind: "video" | "image"; label: string; ratio?: string };
  station: ReactNode;
  reverse?: boolean;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      data-stop={id}
      data-surface={dark ? "dark" : undefined}
      className={`feature ${reverse ? "feature--reverse" : ""} ${dark ? "feature--dark" : ""}`}
    >
      <div className="container feature__grid">
        <div className="feature__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="display h2 feature__title">{title}</h2>
          <p className="lede feature__body">{body}</p>
          <ul className="feature__bullets">
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
        <div className="feature__station">{station}</div>
        <div className="feature__media">
          <MediaSlot {...media} dark={dark} />
        </div>
      </div>
    </section>
  );
}
