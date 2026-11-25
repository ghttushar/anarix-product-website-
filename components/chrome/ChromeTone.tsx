"use client";

import { useEffect } from "react";

/*
  The nav and the Ask Aan island take the tone of whatever is under them.
  Sections say what they are with data-tone: "dark" (a fixed dark stage:
  the hero card, the world inside Aan, Signals' black), "light" (a fixed
  light stage) or "ground" (the page colour, which follows the theme).
  When the theme is light but the chrome sits over a dark stage, it
  switches to its dark dress (html[data-nav]/[data-island], tokens.css),
  so its text never disappears. Checked on scroll at most every 90ms and
  whenever the theme or a scene's tone changes: never per frame.
*/
type Tone = "dark" | "light";

function toneAt(x: number, y: number): Tone | null {
  for (const el of document.elementsFromPoint(x, y)) {
    if (el.closest(".chrome")) continue;
    const host = el.closest<HTMLElement>("[data-tone]");
    if (!host) continue;
    const t = host.dataset.tone;
    if (t === "dark" || t === "light") return t;
    if (t === "ground") return document.documentElement.dataset.theme === "light" ? "light" : "dark";
  }
  return null;
}

export function ChromeTone() {
  useEffect(() => {
    const html = document.documentElement;
    let last = 0;
    let timer = 0;
    const apply = () => {
      last = performance.now();
      const light = html.dataset.theme === "light";
      const nav = toneAt(window.innerWidth / 2, 40);
      const island = toneAt(window.innerWidth / 2, window.innerHeight - 46);
      // only the light theme needs help: dark chrome is already dark
      const setTo = (attr: "nav" | "island", t: Tone | null) => {
        if (light && t === "dark") html.dataset[attr] = "dark";
        else delete html.dataset[attr];
      };
      setTo("nav", nav);
      setTo("island", island);
    };
    const schedule = () => {
      window.clearTimeout(timer);
      const wait = Math.max(0, 90 - (performance.now() - last));
      timer = window.setTimeout(apply, wait);
    };
    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // the theme toggle, and scenes that change their own tone as they play
    const mo = new MutationObserver(schedule);
    mo.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    mo.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["data-tone"] });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mo.disconnect();
      delete html.dataset.nav;
      delete html.dataset.island;
    };
  }, []);
  return null;
}
