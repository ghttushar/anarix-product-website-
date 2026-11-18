"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useScreen } from "@/components/layout/Screen";
import s from "./reveal.module.css";

/**
 * Settles content into place when its screen arrives: from an already legible
 * state (never hidden without script), at most a 16px rise, in reading order.
 */
export function Reveal({ children, as: Tag = "div", order = 0, className, style }: { children: ReactNode; as?: ElementType; order?: number; className?: string; style?: CSSProperties }) {
  const { inView } = useScreen();
  return (
    <Tag className={`${s.reveal} ${className ?? ""}`} data-shown={inView ? "true" : "false"} style={{ ...style, "--order": order } as CSSProperties}>
      {children}
    </Tag>
  );
}
