"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fits a product UI mock into its slot: when the slot is shorter than the
 * mock's natural height, the mock scales down (never up) and keeps its layout,
 * so a screen holds one viewport without cropping or reflowing the product UI.
 */
export function UiFrame({ children, maxHeight, className }: { children: ReactNode; maxHeight: string; className?: string }) {
  const slot = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  const [h, setH] = useState<number | undefined>(undefined);

  useEffect(() => {
    const a = slot.current;
    const b = inner.current;
    if (!a || !b) return;
    const fit = () => {
      const limit = parseFloat(getComputedStyle(a).maxHeight) || Infinity;
      const natural = b.scrollHeight;
      const next = Math.min(1, limit / natural);
      setK(next);
      setH(natural * next);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(a);
    ro.observe(b);
    fit();
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={slot} className={className} style={{ maxHeight, height: h, position: "relative" }}>
      <div ref={inner} style={{ transform: k < 1 ? `scale(${k})` : undefined, transformOrigin: "top left", width: k < 1 ? `${100 / k}%` : undefined }}>
        {children}
      </div>
    </div>
  );
}
