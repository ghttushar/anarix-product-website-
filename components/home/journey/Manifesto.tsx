"use client";

import type { CSSProperties } from "react";
import { StoryScroll } from "@/components/layout/StoryScroll";
import { AnarixMark } from "@/components/chrome/Logo";
import { journey } from "@/content/home";
import j from "./scenes.module.css";

/*
  4 · What Aan is, inside the dark the burst opened. The Anarix mark that
  rose out of Aan's diamond lifts to the top, and the statement lights up
  word by word as you scroll (each word reads --p from the pinned panel).
  Reduced motion shows every word lit.
*/
const WORDS = journey.manifesto.split(" ");

export function Manifesto() {
  return (
    <StoryScroll id="aan-is" label="What Aan is" chapters={3} per={45} className={`${j.dark} ${j.manifestoScene}`} bodyClassName={`l-container ${j.manifesto}`}>
      <span className={j.lift} aria-hidden="true">
        <AnarixMark height={86} />
      </span>
      <p className={j.words}>
        {WORDS.map((w, i) => (
          <span key={i} style={{ "--w": (i / WORDS.length).toFixed(3) } as CSSProperties}>
            {w}{" "}
          </span>
        ))}
      </p>
    </StoryScroll>
  );
}
