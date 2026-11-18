"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import {
  BAND_ENTRIES,
  DEBUT_WORD,
  WHITE_IN,
  BAND_FLASHES,
  DEBUT_DURATION,
  DEBUT_STAMPS,
  debutCaptionAt,
  debutShotAt,
  debutStampAt,
} from "./debut-timeline";
import { BandEye, BandProfit, BandStores, Scene, STAGE_H as H, STAGE_W as W } from "./DebutScenes";

// Stage in CSS px; rendered at DPR 2 → 1080 × 1920. Every shot is drawn
// (DebutScenes.tsx): the vector Aan in the City Nocturne line-art world.
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* --------------------------------------------------------------- montage */
function Bands({ t }: { t: number }) {
  const bh = H / 3;
  const drift = t - BAND_ENTRIES[0];
  return (
    <div className="dt-set">
      <Scene name="couchSide" zoom={1.04} />
      {t >= BAND_ENTRIES[0] && (
        <div className="dt-band" style={{ top: 0, height: bh }}>
          <BandEye drift={drift} />
        </div>
      )}
      {t >= BAND_ENTRIES[1] && (
        <div className="dt-band" style={{ top: bh, height: bh }}>
          <BandProfit drift={t - BAND_ENTRIES[1]} />
        </div>
      )}
      {t >= BAND_ENTRIES[2] && (
        <div className="dt-band" style={{ top: bh * 2, height: bh }}>
          <BandStores drift={t - BAND_ENTRIES[2]} />
        </div>
      )}
      {BAND_FLASHES.map((f) =>
        t >= f && t < f + 0.1 ? (
          <div key={f} className="dt-flash">
            {[0, 1, 2].map((b) => (
              <p key={b} className="dt-flash__w" style={{ top: bh * b + bh / 2, fontSize: bh * 0.3 }}>
                AAN
              </p>
            ))}
          </div>
        ) : null,
      )}
    </div>
  );
}

/* --------------------------------------------------------------- overlays */
function FitWord({ text, size, maxW, base, className }: { text: string; size: number; maxW: number; base: number; className: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [sx, setSx] = useState(base);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el) setSx(Math.min(base, maxW / el.offsetWidth));
  }, [text, size, maxW, base]);
  return (
    <p className={`dt-word ${className}`} style={{ fontSize: size }}>
      <span ref={ref} style={{ transform: `scaleX(${sx})` }}>
        {text}
      </span>
    </p>
  );
}

function Caption({ t }: { t: number }) {
  const c = debutCaptionAt(t);
  if (!c) return null;
  return (
    <div className="dt-cap dt-cap--open">
      {c.lines.map((l, i) => (
        <span key={i}>{l}</span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ film */
export function Debut() {
  const [t, setT] = useState(0);
  const [scale, setScale] = useState(1);

  const sync = useCallback((time: number) => {
    document.getAnimations().forEach((a) => {
      a.pause();
      a.currentTime = time * 1000;
    });
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const start = Number(q.get("t") || 0);
    setT(start);
    const w = window as unknown as { __seek: (s: number) => Promise<boolean>; __duration: number };
    w.__duration = DEBUT_DURATION;
    w.__seek = async (s: number) => {
      flushSync(() => setT(s));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      sync(s);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null))));
      return true;
    };
    document.documentElement.classList.add("is-film");
    if (q.get("play") === "1") {
      let raf = 0;
      const t0 = performance.now() - start * 1000;
      const loop = () => {
        setT(((performance.now() - t0) / 1000) % DEBUT_DURATION);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }
  }, [sync]);

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const shot = debutShotAt(t);
  const local = t - shot.start;
  const prog = clamp(local / (shot.end - shot.start));
  // a small punch-in on every word at the desk, like the trend's jump cuts
  const word = [...DEBUT_STAMPS].reverse().find((s) => s.t <= t);
  const punch = shot.scene === "desk" && word && t - word.t < 0.12 ? 0.012 : 0;
  const zoom = 1 + (shot.push ?? 0) * prog + punch;

  let scene: ReactNode = null;
  if (shot.scene === "bands") scene = <Bands t={t} />;
  else if (shot.scene === "black") scene = <div className="dt-set" style={{ background: "#000" }} />;
  else scene = <Scene name={shot.scene} zoom={zoom} />;

  const stamp = debutStampAt(t);
  // through white: the last shot washes out, the DEBUT card comes up out of it
  const end = DEBUT_WORD - 0.28;
  const white = t >= WHITE_IN && t < end ? (t - WHITE_IN) / (end - WHITE_IN) : t >= end && t < end + 0.35 ? 1 - (t - end) / 0.35 : 0;

  return (
    <div className="film-viewport">
      <div className="dt-stage" style={{ width: W, height: H, transform: `scale(${scale})` }} data-scene={shot.scene}>
        <div key={shot.start} className="dt-set">
          {scene}
        </div>
        {stamp && <FitWord text={stamp.text} size={H * 0.21} maxW={W * 0.95} base={0.62} className="dt-stamp" />}
        {shot.scene === "end" && (
          <>
            <FitWord text="AAN'S" size={H * 0.22} maxW={W * 0.9} base={0.7} className="dt-end dt-end--top" />
            {t >= DEBUT_WORD && <FitWord text="DEBUT" size={H * 0.22} maxW={W * 0.9} base={0.7} className="dt-end dt-end--bottom" />}
            <p className={`dt-tagline ${t >= DEBUT_WORD + 1.1 ? "is-on" : ""}`}>
              Your 24/7 e-commerce account manager
              <span>anarix.ai/platform</span>
            </p>
          </>
        )}
        <Caption t={t} />
        {white > 0 && <div className="dt-white" style={{ opacity: clamp(white) }} />}
      </div>
    </div>
  );
}
