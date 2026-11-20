"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Writes the pointer position into --mx / --my on its element, so a glow
 * border or a soft spotlight can follow it (the Linear card). Pointer only.
 */
export function Spotlight({ children, className, style, as: Tag = "div" }: { children: ReactNode; className?: string; style?: CSSProperties; as?: "div" | "article" | "section" }) {
  const ref = useRef<HTMLElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const Any = Tag as unknown as React.ElementType;
  return (
    <Any ref={ref} className={className} style={style} onPointerMove={move}>
      {children}
    </Any>
  );
}
