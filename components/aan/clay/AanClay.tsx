"use client";

import type { CSSProperties } from "react";
import { AanMascot, type AanState } from "../AanMascot";
import c from "./aan-clay.module.css";

/*
  Aan acting. Aan looks exactly as it does in the Ask Aan island (the
  product's own mascot: coral body, sheen, inner ring, no aura or shadow);
  what it does is carried by motion around it. No arms, no legs.
  - idle: a slow breath          - look: the eyes lead
  - hop: squash and stretch      - glide: leans into travel (the trail is drawn
                                   by the traveller and by LightTrails)
  - point: leans toward its target; the beam is drawn by the caller
  - press: lands and squashes on a button
  - think: becomes the cube      - work: becomes the bar that fills
  - celebrate: one spin and a ring of light (once per page)
  The mascot blinks on its own; with `track` its eyes follow the pointer, as
  in the island. Reduced motion keeps the shape and the eyes, and drops the
  movement.
*/
export type AanAct = "idle" | "look" | "hop" | "glide" | "point" | "press" | "think" | "work" | "celebrate";

const SHAPE: Partial<Record<AanAct, AanState>> = { think: "cube", work: "bar" };

export function AanClay({
  size = 96,
  act = "idle",
  gaze,
  track = false,
  className,
  style,
}: {
  size?: number;
  act?: AanAct;
  /** where the eyes look, -1..1 on each axis */
  gaze?: [number, number];
  /** eyes follow the pointer (the hero), as the island's Aan does */
  track?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const fixed: [number, number] = gaze ?? (act === "point" ? [0.9, -0.2] : act === "look" ? [0.8, -0.3] : [0, 0]);
  return (
    <span className={`${c.aan} ${className ?? ""}`} data-act={act} style={{ "--s": `${size}px`, ...style } as CSSProperties} aria-hidden="true">
      <span className={c.sq}>
        <AanMascot state={SHAPE[act] ?? "diamond"} size={size} glow={false} shadow={false} gaze={track ? undefined : fixed} />
        <span className={c.ring} />
      </span>
    </span>
  );
}
