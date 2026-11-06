"use client";

import { useEffect, useRef, useState } from "react";
import { subscribePointer } from "@/lib/pointer";

export type AanState = "diamond" | "circle" | "bar" | "cube";

/**
 * Aan, ported from the product's mascot
 * (anarix-insight-engine · src/components/aan/AanMascot.tsx).
 *
 * State IS shape: diamond = idle / speaking · circle = listening ·
 * bar = working (translucent pill with a coral progress fill) ·
 * cube = thinking (spins, liquid swirl inside, eyes closed).
 * Coral body with a radial gradient, sheen, inner periwinkle ring, a blurred
 * coral aura, a floating ground shadow, body lean + eye gaze toward the
 * cursor, petting tilt on hover and random blinks.
 *
 * `size` is the slot. The body uses the product's proportions on a unit of
 * 0.7 × size so the rotated diamond stays inside the slot.
 */
const CORAL = { base: "#f46d76", light: "#f88a93", deep: "#f05e6a" };

export function AanMascot({
  state = "diamond",
  size = 96,
  glow = true,
  shadow = true,
  progress,
  gaze,
  className = "",
}: {
  state?: AanState;
  size?: number;
  /** kept for back-compat; the product mascot has no satellite */
  satellite?: boolean;
  glow?: boolean;
  shadow?: boolean;
  /** bar fill 0–100; omitted = looping work animation */
  progress?: number;
  /** fixed eye direction (-1..1 each axis); disables pointer tracking */
  gaze?: [number, number];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [blink, setBlink] = useState(0);
  const [hover, setHover] = useState(false);

  const u = size * 0.7;
  const shape = state;
  const bodyW = shape === "bar" ? u * 1.8 : shape === "cube" ? u * 0.92 : u;
  const bodyH = shape === "bar" ? u * 0.34 : shape === "cube" ? u * 0.92 : u;
  const rotate = shape === "diamond" ? 45 : 0;
  const hoverDiamond = hover && shape === "diamond" && size > 40;
  const radius = shape === "circle" ? "50%" : shape === "bar" ? "999px" : shape === "cube" ? "16%" : hoverDiamond ? "30%" : "18%";
  const showEyes = shape !== "cube" && size >= 16;
  const eyeSize = shape === "bar" ? u * 0.11 : u * 0.16;
  const eyeOffset = shape === "bar" ? u * 0.1 : shape === "circle" ? u * 0.2 : u * 0.18;
  const eyeY = shape === "diamond" ? u * 0.04 : 0;
  const tiny = size < 24;

  // body lean + eye gaze toward the cursor (product: 0.04·size lean, 0.06·size gaze)
  useEffect(() => {
    const el = ref.current;
    if (!el || tiny) return;
    if (gaze) {
      const eye = Math.max(1, u * 0.05);
      el.style.setProperty("--gx", `${(gaze[0] * eye).toFixed(2)}px`);
      el.style.setProperty("--gy", `${(gaze[1] * eye).toFixed(2)}px`);
      return;
    }
    return subscribePointer((x, y) => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height / 2);
      const ang = Math.atan2(dy, dx);
      const lean = Math.min(1, Math.hypot(dx, dy) / 420);
      const gaze = Math.min(1, Math.hypot(dx, dy) / 260);
      const travel = Math.max(2, u * 0.04);
      const eye = Math.max(1, u * 0.05);
      el.style.setProperty("--lx", `${(Math.cos(ang) * lean * travel).toFixed(2)}px`);
      el.style.setProperty("--ly", `${(Math.sin(ang) * lean * travel).toFixed(2)}px`);
      el.style.setProperty("--lt", `${(Math.cos(ang) * lean * 4).toFixed(2)}deg`);
      el.style.setProperty("--gx", `${Math.max(-eye, Math.min(eye, Math.cos(ang) * gaze * u * 0.06)).toFixed(2)}px`);
      el.style.setProperty("--gy", `${Math.max(-eye, Math.min(eye, Math.sin(ang) * gaze * u * 0.06)).toFixed(2)}px`);
      // petting tilt while hovered
      if (el.matches(":hover")) {
        const rel = Math.max(-1, Math.min(1, dx / (r.width / 2)));
        el.style.setProperty("--pt", `${(rel * 10).toFixed(2)}deg`);
      } else el.style.setProperty("--pt", "0deg");
    });
  }, [u, tiny, gaze?.[0], gaze?.[1]]); // eslint-disable-line react-hooks/exhaustive-deps

  // random blinks (faster while listening)
  useEffect(() => {
    if (!showEyes || tiny) return;
    let t = 0;
    let alive = true;
    const schedule = () => {
      const delay = shape === "circle" ? 2200 + Math.random() * 2200 : 3500 + Math.random() * 3500;
      t = window.setTimeout(() => {
        if (!alive) return;
        setBlink((b) => b + 1);
        schedule();
      }, delay);
    };
    schedule();
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [showEyes, shape, tiny]);

  const isHover = hover || className.includes("is-hover");

  return (
    <div
      ref={ref}
      className={`aan aan--${shape} ${isHover ? "is-hover" : ""} ${tiny ? "aan--tiny" : ""} ${className}`}
      data-state={shape}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={
        {
          "--s": `${size}px`,
          "--u": `${u}px`,
          "--bw": `${bodyW}px`,
          "--bh": `${bodyH}px`,
          "--rot": `${rotate}deg`,
          "--r": radius,
          "--sx": hoverDiamond ? 1.06 : 1,
          "--sy": hoverDiamond ? 0.95 : 1,
          "--es": `${eyeSize}px`,
          "--eo": `${eyeOffset}px`,
          "--ey": `${eyeY}px`,
          "--prog-k": progress === undefined ? undefined : Math.max(0, Math.min(100, progress)) / 100,
          "--c-base": CORAL.base,
          "--c-light": CORAL.light,
          "--c-deep": CORAL.deep,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      {shadow && !tiny && <span className="aan__shadow" />}
      <span className="aan__float">
        <span className="aan__lean">
          {glow && !tiny && <span className="aan__aura" />}
          <span className="aan__body">
            <span className="aan__sheen" />
            <span className="aan__ring" />
            {shape === "bar" && <span className={`aan__fill ${progress === undefined ? "is-loop" : ""}`} />}
            {shape === "cube" && !tiny && (
              <svg className="aan__swirl" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M30,50 Q50,20 70,50 Q50,80 30,50 Z" />
              </svg>
            )}
          </span>
          {showEyes && (
            <span className="aan__eyes">
              <span className="aan__eye aan__eye--l">
                <span key={`l${blink}`} className="aan__lid" />
              </span>
              <span className="aan__eye aan__eye--r">
                <span key={`r${blink}`} className="aan__lid" />
              </span>
            </span>
          )}
          {shape === "diamond" && className.includes("is-speaking") && <span className="aan__ripple" />}
        </span>
      </span>
    </div>
  );
}
