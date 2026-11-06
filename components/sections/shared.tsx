"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** true while Aan is docked on (or has passed) the enclosing section */
export function usePowered<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [powered, setPowered] = useState(false);
  useEffect(() => {
    const section = ref.current?.closest<HTMLElement>("[data-stop]");
    if (!section) return;
    setPowered(section.dataset.powered === "true");
    const on = (e: Event) => setPowered((e as CustomEvent<boolean>).detail);
    section.addEventListener("aan:power", on);
    return () => section.removeEventListener("aan:power", on);
  }, []);
  return [ref, powered] as const;
}

/** reveal on enter (fade + rise), once */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
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
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${shown ? "is-in" : ""} ${className}`} style={{ "--rd": `${delay}ms` } as React.CSSProperties}>
      {children}
    </div>
  );
}

/** quiet slot for real product video / screenshots, to be supplied */
export function MediaSlot({ kind, label, ratio = "16 / 9" }: { kind: "video" | "image"; label: string; ratio?: string }) {
  return (
    <figure className="media" style={{ aspectRatio: ratio }}>
      <span className="media__play" aria-hidden="true">
        {kind === "video" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <circle cx="9" cy="10" r="2" />
            <path d="m21 16-5-5-9 9" />
          </svg>
        )}
      </span>
      <figcaption>
        <span className="media__label">{label}</span>
        <span className="media__meta">{kind === "video" ? "Video" : "Screenshot"} · coming soon</span>
      </figcaption>
    </figure>
  );
}

/**
 * The machine stage: an isometric scene (Aan's machine) behind, and the real
 * product UI it drives floating in front of its lower half.
 */
export function MachineStage({ machine, children, label }: { machine: ReactNode; children: ReactNode; label: string }) {
  return (
    <div className="stage">
      <div className="stage__machine">{machine}</div>
      <div className="stage__ui" aria-label={label}>
        {children}
      </div>
    </div>
  );
}

/** highlighted phrase inside a grey statement paragraph (Sarla-style emphasis) */
export function Hl({ children }: { children: ReactNode }) {
  return <span className="hl">{children}</span>;
}

/**
 * A feature chapter in two beats:
 *  A — statement: big headline + large grey prose with highlighted phrases
 *  B — proof: capability prose beside the product UI and its isometric scene,
 *      then an inset media frame
 */
export function FeatureSection({
  id,
  index,
  eyebrow,
  title,
  statement,
  details = [],
  media,
  stage,
  reverse = false,
  dark = false,
  light = false,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  statement: ReactNode;
  details?: { title: string; text: string }[];
  media: { kind: "video" | "image"; label: string };
  stage: ReactNode;
  reverse?: boolean;
  dark?: boolean;
  light?: boolean;
}) {
  return (
    <section
      id={id}
      data-stop={id}
      data-surface={dark ? "dark" : light ? "light" : undefined}
      className={`feature chapter ${reverse ? "feature--reverse" : ""} ${dark ? "feature--dark" : ""} ${light ? "chapter--light" : ""}`}
    >
      <div className="container">
        <div className="chapter__statement">
          <Reveal className="chapter__head">
            <p className="chapter__label">
              <span>{index}</span>
              {eyebrow}
            </p>
            <h2 className="display h2 chapter__title">{title}</h2>
          </Reveal>
          <Reveal className="chapter__prose" delay={120}>
            <p>{statement}</p>
          </Reveal>
        </div>

        <div className="feature__grid">
          <Reveal className="feature__copy">
            {details.map((d) => (
              <div key={d.title} className="cap">
                <h3 className="cap__title">{d.title}</h3>
                <p className="cap__text">{d.text}</p>
              </div>
            ))}
          </Reveal>
          <div className="feature__stage">{stage}</div>
        </div>

        <Reveal className="feature__media">
          <MediaSlot {...media} />
        </Reveal>
      </div>
    </section>
  );
}

/** capability prose row (MCP) */
export function DetailRow({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="caps-row">
      {items.map((d, i) => (
        <Reveal key={d.title} className="cap" delay={i * 90}>
          <h3 className="cap__title">{d.title}</h3>
          <p className="cap__text">{d.text}</p>
        </Reveal>
      ))}
    </div>
  );
}
