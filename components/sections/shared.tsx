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

/** feature section: copy on one side, machine + product UI on the other, media strip below */
export function FeatureSection({
  id,
  eyebrow,
  title,
  body,
  proof,
  details = [],
  media,
  stage,
  reverse = false,
  dark = false,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  body: string;
  proof: string[];
  details?: { title: string; text: string }[];
  media: { kind: "video" | "image"; label: string };
  stage: ReactNode;
  reverse?: boolean;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      data-stop={id}
      data-surface={dark ? "dark" : undefined}
      className={`feature ${reverse ? "feature--reverse" : ""} ${dark ? "feature--dark" : ""}`}
    >
      <div className="container">
        <div className="feature__grid">
          <Reveal className="feature__copy">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="display h2 feature__title">{title}</h2>
            <p className="lede feature__body">{body}</p>
            {details.length > 0 && (
              <div className="feature__more">
                {details.map((d) => (
                  <p key={d.title}>
                    <strong>{d.title}.</strong> {d.text}
                  </p>
                ))}
              </div>
            )}
            <ul className="feature__proof">
              {proof.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
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

/** three capability cards: what Aan does in this part of the product */
export function DetailRow({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="details">
      {items.map((d, i) => (
        <Reveal key={d.title} className="detail" delay={i * 90}>
          <span className="detail__n">0{i + 1}</span>
          <h3 className="detail__title">{d.title}</h3>
          <p className="detail__text">{d.text}</p>
        </Reveal>
      ))}
    </div>
  );
}
