"use client";

import { useRef, type ReactNode } from "react";
import m from "./motion.module.css";

/**
 * A primary action that leans toward the pointer (Linear, Apple): the area
 * around it is live, the button follows a little and springs back on leave.
 * Pointer only; touch and reduced motion leave it still.
 */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const area = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !inner.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = inner.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    inner.current.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(dy * strength * 1.2).toFixed(1)}px)`;
  };
  const leave = () => {
    if (inner.current) inner.current.style.transform = "";
  };
  return (
    <span ref={area} className={m.magnet} onPointerMove={move} onPointerLeave={leave}>
      <span ref={inner} className={m.magnetInner}>
        {children}
      </span>
    </span>
  );
}
