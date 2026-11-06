"use client";

import { useEffect, useRef, useState } from "react";

const BASE = "/platform/film";

/**
 * "Ninety seconds with Aan". Plays muted while in view (unless the visitor
 * prefers reduced motion), pauses when scrolled away; the sound button
 * unmutes and restarts so the score lands from the first braam.
 * Narrow screens get the vertical cut.
 */
export function FilmPlayer() {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !calm) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.45 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const withSound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    v.play().catch(() => {});
    setMuted(false);
  };

  return (
    <figure className="filmplayer">
      <video
        ref={ref}
        className="filmplayer__video"
        muted={muted}
        playsInline
        loop
        controls={!muted}
        preload="metadata"
        poster={`${BASE}/poster.jpg`}
        aria-label="Ninety seconds with Aan: Aan, the AI that watches your stores, makes its debut"
      >
        <source src={`${BASE}/aan-90s-vertical.mp4`} type="video/mp4" media="(max-width: 640px)" />
        <source src={`${BASE}/aan-90s.mp4`} type="video/mp4" />
      </video>
      {muted && (
        <button type="button" className="filmplayer__sound" onClick={withSound}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
          Watch with sound
        </button>
      )}
    </figure>
  );
}
