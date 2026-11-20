"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import b from "./clay-block.module.css";

/*
  Soft clay 3D: the things Aan looks after, as matte, rounded clay objects
  lit from the top left, with the name pressed into them (text, never a
  logo). A "tile" is a store block; a "token" is a pill for a name (the AI
  clients on MCP). Tone carries meaning: slate is quiet, coral is risk,
  periwinkle is something Aan handled. They drop in with a soft squash the
  first time they are on screen; reduced motion shows them at rest.
*/
export function ClayBlock({
  label,
  tone = "slate",
  shape = "tile",
  size = 64,
  order = 0,
  className,
  style,
}: {
  label: string;
  tone?: "slate" | "coral" | "periwinkle";
  shape?: "tile" | "token";
  /** the tile's side, or the token's height, in px */
  size?: number;
  /** stagger for the drop-in */
  order?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span
      ref={ref}
      className={`${b.clay} ${className ?? ""}`}
      data-tone={tone}
      data-shape={shape}
      data-shown={shown ? "true" : "false"}
      style={{ "--b": `${size}px`, "--i": order, ...style } as CSSProperties}
    >
      <span className={b.label}>{label}</span>
    </span>
  );
}
