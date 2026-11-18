"use client";

import { useEffect, useRef, useState } from "react";
import f from "./film-player.module.css";

const BASE = "/platform/film";

/**
 * "Aan's debut", the vertical reel. Plays muted while in view (never under
 * reduced motion), pauses when scrolled away; the sound button unmutes and
 * restarts it so Aan's first line lands.
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
    <figure className={f.player}>
      <video
        ref={ref}
        className={f.video}
        muted={muted}
        playsInline
        loop
        controls={!muted}
        preload="metadata"
        poster={`${BASE}/aan-debut-poster.jpg`}
        aria-label="Aan's debut: Aan, the AI account manager that watches your stores, introduces itself"
      >
        <source src={`${BASE}/aan-debut.mp4`} type="video/mp4" />
      </video>
      {muted && (
        <button type="button" className={f.sound} onClick={withSound}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
          <span className={f.long}>Watch with sound</span>
          <span className={f.short}>Sound on</span>
        </button>
      )}
    </figure>
  );
}
