"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import v from "./product-video.module.css";

/** raw <video src> does not get the basePath, so it is added by hand */
const BASE = "/platform";

export type VideoSource = { src: string; poster?: string };

/**
 * The frame a product tour plays in. With a recording it plays muted while in
 * view (never under reduced motion), pauses when scrolled away, and "Watch
 * with sound" unmutes and restarts it. Until the recording exists it shows
 * the fallback (the page's drawing) in the same frame, quietly: the space is
 * there, ready for the video, and nothing announces what is missing.
 */
export function ProductVideo({ video, title, fallback, ratio = 16 / 9, fitRatio, className }: { video?: VideoSource; title: string; fallback: ReactNode; ratio?: number; /** the fallback drawing's own width / height */ fitRatio?: number; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !calm) el.play().catch(() => {});
        else if (!e.isIntersecting) el.pause();
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [video?.src]);

  const withSound = () => {
    const el = ref.current;
    if (!el) return;
    el.muted = false;
    el.currentTime = 0;
    el.play().catch(() => {});
    setMuted(false);
  };

  return (
    <figure className={`${v.frame} ${className ?? ""}`} style={{ aspectRatio: String(ratio), "--fit": fitRatio ? String(fitRatio) : undefined } as CSSProperties} data-video={video ? "true" : "false"}>
      {video ? (
        <>
          <video
            ref={ref}
            className={v.video}
            muted={muted}
            playsInline
            loop
            controls={!muted}
            preload="metadata"
            poster={video.poster ? `${BASE}${video.poster}` : undefined}
            aria-label={title}
          >
            <source src={`${BASE}${video.src}`} type="video/mp4" />
          </video>
          {muted && (
            <button type="button" className={v.sound} onClick={withSound}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              </svg>
              Watch with sound
            </button>
          )}
        </>
      ) : (
        <>
          <div className={v.fallback}>
            <div className={v.fit}>{fallback}</div>
          </div>
        </>
      )}
    </figure>
  );
}
