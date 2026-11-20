"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useScreen } from "@/components/layout/Screen";
import { ProductVideo } from "@/components/media/ProductVideo";
import type { ProductPage } from "@/content/products/types";

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

/** the hero's product tour once it is recorded; until then, the product UI itself */
export function Tour({ page, title, children }: { page: ProductPage; title: string; children: ReactNode }) {
  return page.video ? <ProductVideo bare video={page.video} title={title} fallback={null} /> : <>{children}</>;
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
