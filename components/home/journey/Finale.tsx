"use client";

import { useCallback, useRef, type CSSProperties, type ReactNode } from "react";
import { StoryScroll, useStory, useStoryProgress } from "@/components/layout/StoryScroll";
import { useMediaQuery } from "@/components/motion/useMediaQuery";
import { AanClay } from "@/components/aan/clay/AanClay";
import { AanDock } from "@/components/aan/v2/AanDock";
import { Magnetic } from "@/components/motion/Magnetic";
import { FilmDialog } from "@/components/home/FilmDialog";
import { close, trust } from "@/content/home";
import s from "./scenes.module.css";

/*
  6–7 · You stay in charge, then the close (the reference's scattered images
  converging on one card that grows into the final hero). Six fragments of
  the product, one for each step of how far Aan goes, drift up past the card
  in the middle and lock in; then that card opens out to fill the screen and
  becomes the close, with a large clay Aan where the reference has its
  chrome form. --k (converge) and --e (expand) drive it; the fragments are
  decoration around the ladder, which is read in full by assistive tech.
*/
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number) => Math.max(0, Math.min(1, v));

/** where each fragment floats, as [x vw, y vh, depth] from the centre */
const SPOTS: [number, number, number][] = [
  [-34, -12, 0.9],
  [31, -16, 0.6],
  [-37, 18, 0.55],
  [34, 20, 0.85],
  [-14, 28, 0.45],
  [16, -26, 0.5],
];

const FRAGMENTS: ReactNode[] = [
  <>
    <span className={s.chips}>
      <i />
      Amazon <i />
      Walmart <i />
      Shopify
    </span>
    <em>watching</em>
  </>,
  <>
    <span>Lower the cost to Amazon by $1.20</span>
    <em>95% confidence</em>
  </>,
  <>
    <span>Paused &ldquo;chef knife 8 inch&rdquo;</span>
    <em>$86 spent, 0 sales</em>
  </>,
  <>
    <span>Spring Sale wants $600 a day</span>
    <em className={s.held}>Held for your yes</em>
  </>,
  <>
    <span>Lowered the cost to Amazon</span>
    <em>Undo · 0:30</em>
  </>,
  <>
    <span>Checked over 7 days</span>
    <em>Back to $1,230 a day</em>
  </>,
];

function Stage() {
  const { here } = useStory();
  const stage = useRef<HTMLDivElement>(null);
  const narrow = useMediaQuery("(max-width: 640px)");

  const onProgress = useCallback((p: number) => {
    const el = stage.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduced ? (p > 0.05 ? 1 : 0) : smooth(clamp(p / 0.55));
    const e = reduced ? (p > 0.6 ? 1 : 0) : smooth(clamp((p - 0.55) / 0.3));
    el.style.setProperty("--k", k.toFixed(4));
    el.style.setProperty("--e", e.toFixed(4));
    el.dataset.open = e > 0.85 ? "true" : "false";
  }, []);
  useStoryProgress(onProgress);

  return (
    <div ref={stage} className={s.finale} data-open="false">
      <header className={s.charge}>
        <h2 className={s.chargeTitle}>{trust.title}</h2>
        <p>{trust.line}</p>
      </header>

      <ol className={s.fragments} data-bleed>
        {trust.ladder.map((rung, i) => (
          <li key={rung.t} className={s.fragment} style={{ "--x": SPOTS[i][0], "--y": SPOTS[i][1], "--z": SPOTS[i][2] } as CSSProperties}>
            <b>
              {String(i + 1).padStart(2, "0")} {rung.t}
            </b>
            <p>{FRAGMENTS[i]}</p>
          </li>
        ))}
      </ol>

      <section className={s.closeCard} aria-label="Meet Aan">
        <div className={s.closeCopy}>
          <h2 className={s.closeTitle}>{close.title}</h2>
          <p className={s.closeBody}>{close.body}</p>
          <div className="c-actions">
            <Magnetic>
              <a className="c-cta" href={close.primary.href}>
                {close.primary.label}
              </a>
            </Magnetic>
            <button type="button" className="c-link" onClick={() => window.dispatchEvent(new Event("aan:open-chat"))}>
              {close.secondary}
            </button>
            <FilmDialog />
          </div>
          <p className={s.services}>
            {close.services.lead} <a href={close.services.href}>{close.services.label}</a>
          </p>
        </div>
        <div className={s.closeAan} data-here={here ? "true" : "false"}>
          <AanClay size={narrow ? 88 : 200} act="idle" track />
          <AanDock stop="close" size={100} sizeSm={44} hand style={{ left: "50%", bottom: 0 }} />
        </div>
      </section>
    </div>
  );
}

export function Finale() {
  return (
    <StoryScroll id="meet-aan" label="You stay in charge, and meet Aan" chapters={4} per={60} className={s.dark} bodyClassName={s.finaleBody}>
      <Stage />
    </StoryScroll>
  );
}
