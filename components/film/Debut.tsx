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
  type DebutScene,
} from "./debut-timeline";

// Stage in CSS px; rendered at DPR 2 → 1080 × 1920.
const W = 540;
const H = 960;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const SRC = "/platform/film/debut";

/** one photographic still per shot (generated for this film; see DESIGN.md provenance) */
const STILL: Partial<Record<DebutScene, { src: string; pos?: string; shift?: number }>> = {
  desk: { src: "desk.jpg" },
  standChin: { src: "stand-chin.jpg" },
  couch: { src: "couch.jpg" },
  side: { src: "side.jpg" },
  couchSide: { src: "couch-side.jpg" },
  crossed: { src: "crossed.jpg" },
  standSmall: { src: "stand-full.jpg" },
  chin: { src: "chin.jpg" },
  end: { src: "end.jpg", shift: 4 },
};

function Still({ src, pos = "50% 50%", scale = 1, shift = 0 }: { src: string; pos?: string; scale?: number; shift?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="dt-still" src={`${SRC}/${src}`} alt="" style={{ objectPosition: pos, transform: `translateY(${shift}%) scale(${scale})` }} />
  );
}

/* --------------------------------------------------------------- montage */
function Bands({ t }: { t: number }) {
  const bh = H / 3;
  const drift = t - 13.73;
  return (
    <div className="dt-set">
      <Still src="couch-side.jpg" scale={1.04} />
      {t >= BAND_ENTRIES[0] && (
        <div className="dt-band" style={{ top: 0, height: bh }}>
          <Still src="band-eye.jpg" pos="70% 50%" scale={1.18 + drift * 0.03} />
        </div>
      )}
      {t >= BAND_ENTRIES[1] && (
        <div className="dt-band" style={{ top: bh, height: bh }}>
          <Still src="band-cash.jpg" pos="50% 50%" scale={1.1 + Math.sin(drift * 9) * 0.012} />
        </div>
      )}
      {t >= BAND_ENTRIES[2] && (
        <div className="dt-band" style={{ top: bh * 2, height: bh }}>
          <div className="dt-band__pan" style={{ transform: `translateX(${-drift * 14}px)` }}>
            <Still src="band-shoes.jpg" pos="45% 60%" scale={1.12} />
          </div>
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
      await Promise.all([...document.images].map((img) => (img.complete ? null : img.decode().catch(() => null))));
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
  else if (shot.scene === "closeup") scene = <Still src="closeup.jpg" pos="50% 30%" scale={zoom} />;
  else if (shot.scene === "black") scene = <div className="dt-set" style={{ background: "#000" }} />;
  else {
    const s = STILL[shot.scene];
    if (s) scene = <Still src={s.src} pos={s.pos} scale={zoom} shift={s.shift} />;
  }

  const stamp = debutStampAt(t);
  // through white: the last silhouette washes out, the DEBUT card comes up out of it
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
      {/* keep every still decoded so frame seeks never wait on the network */}
      <div className="dt-preload" aria-hidden="true">
        {["desk", "stand-chin", "closeup", "couch", "side", "couch-side", "band-eye", "band-cash", "band-shoes", "crossed", "stand-full", "chin", "end"].map((n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={n} src={`${SRC}/${n}.jpg`} alt="" />
        ))}
      </div>
    </div>
  );
}
