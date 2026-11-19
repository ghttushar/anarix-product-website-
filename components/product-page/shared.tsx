"use client";

import { useEffect, useState } from "react";
import { useScreen } from "@/components/layout/Screen";

/** a card settles a beat after its screen's moment begins */
export function useHandled(delay = 350) {
  const { arrived } = useScreen();
  const [handled, setHandled] = useState(false);
  useEffect(() => {
    if (!arrived) return;
    const t = window.setTimeout(() => setHandled(true), delay);
    return () => window.clearTimeout(t);
  }, [arrived, delay]);
  return handled;
}

export const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/** a big monospaced figure, with the comma tucked in so it doesn't leave a hole */
export function Figure({ text }: { text: string }) {
  const parts = text.split(",");
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <span style={{ marginInline: "-0.2em" }}>,</span>}
          {p}
        </span>
      ))}
    </>
  );
}
