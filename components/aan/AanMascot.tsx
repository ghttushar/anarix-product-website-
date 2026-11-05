"use client";

import { useEffect, useRef } from "react";
import { subscribePointer } from "@/lib/pointer";

export type AanState = "diamond" | "circle" | "bar" | "cube";

/**
 * Aan: the Anarix diamond made intelligent (brand manual, Phase 02).
 * diamond = idle · circle = listening · bar = loading · cube = thinking
 * Drawn 2.5D: a coral body with an extruded edge, a ground shadow,
 * a soft glow, an orbiting satellite dot and eyes that follow the pointer.
 */
const SHAPES: Record<AanState, { w: number; h: number; rot: number; r: string }> = {
  diamond: { w: 0.7, h: 0.7, rot: 45, r: "18%" },
  circle: { w: 0.78, h: 0.78, rot: 0, r: "50%" },
  bar: { w: 1.04, h: 0.4, rot: 0, r: "999px" },
  cube: { w: 0.68, h: 0.68, rot: 0, r: "16%" },
};

export function AanMascot({
  state = "diamond",
  size = 96,
  satellite = true,
  glow = true,
  shadow = true,
  className = "",
}: {
  state?: AanState;
  size?: number;
  satellite?: boolean;
  glow?: boolean;
  shadow?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // eyes follow the pointer
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return subscribePointer((x, y) => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, dist / 260);
      el.style.setProperty("--ex", ((dx / dist) * reach).toFixed(3));
      el.style.setProperty("--ey", ((dy / dist) * reach).toFixed(3));
    });
  }, []);

  const s = SHAPES[state];
  // 2.5D extrusion: always pushes "down" in screen space, whatever the rotation
  const depth = Math.max(2, size * 0.05);
  const rad = (s.rot * Math.PI) / 180;
  const dx = depth * Math.sin(rad);
  const dy = depth * Math.cos(rad);

  return (
    <div
      ref={ref}
      className={`aan aan--${state} ${className}`}
      data-state={state}
      style={
        {
          "--s": `${size}px`,
          "--w": `${s.w * size}px`,
          "--h": `${s.h * size}px`,
          "--rot": `${s.rot}deg`,
          "--r": s.r,
          "--dx": `${dx.toFixed(2)}px`,
          "--dy": `${dy.toFixed(2)}px`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      {glow && <span className="aan__glow" />}
      {shadow && <span className="aan__shadow" />}
      <span className="aan__body">
        <span className="aan__shine" />
        <span className="aan__rim" />
      </span>
      <span className="aan__face">
        <span className="aan__eyes">
          <span className="aan__eye" />
          <span className="aan__eye" />
        </span>
      </span>
      {satellite && (
        <span className="aan__orbit">
          <span className="aan__sat" />
        </span>
      )}
    </div>
  );
}
