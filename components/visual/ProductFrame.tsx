"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { UiFrame } from "@/components/layout/UiFrame";
import f from "./product-frame.module.css";

/*
  Product-led: the visual is the product. A real piece of Anarix UI on a card
  that stands slightly turned in space (Linear, Stripe), with a light that
  follows the cursor and a tilt that eases toward it. It rises into place the
  first time it is on screen. Touch and reduced motion get the card flat and
  still; the UI inside is the same.
*/
export function ProductFrame({
  children,
  title,
  note = "Sample data",
  lean = "left",
  fit,
  className,
  style,
}: {
  children: ReactNode;
  /** the product (and view) in the card's top bar */
  title: string;
  /** the honest label, top right: sample data, illustrative, sample rule */
  note?: string;
  /** which way the card turns: "left" faces the copy on its left */
  lean?: "left" | "right" | "none";
  /** scale the UI down (never up) to fit this height */
  fit?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const card = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = card.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.setProperty("--px", ((x / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--py", ((y / r.height) * 2 - 1).toFixed(3));
  };
  const leave = () => {
    const el = card.current;
    if (!el) return;
    el.style.setProperty("--px", "0");
    el.style.setProperty("--py", "0");
  };

  const parts = title.split(" / ");

  return (
    <div className={`${f.stage} ${className ?? ""}`} style={style} data-lean={lean} data-shown={shown ? "true" : "false"}>
      <div ref={card} className={f.card} onPointerMove={move} onPointerLeave={leave}>
        <div className={f.bar} data-ui>
          <span className={f.crumb}>
            <span className={f.brand}>Anarix</span>
            {parts.map((p) => (
              <span key={p}>
                <i aria-hidden="true">/</i>
                {p}
              </span>
            ))}
          </span>
          {note && <span className={f.note}>{note}</span>}
        </div>
        <div className={f.body}>{fit ? <UiFrame maxHeight={fit}>{children}</UiFrame> : children}</div>
        <span className={f.spot} aria-hidden="true" />
      </div>
      <span className={f.floor} aria-hidden="true" />
    </div>
  );
}
