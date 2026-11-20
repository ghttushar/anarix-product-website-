"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ScreenProvider } from "./Screen";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import s from "./story-scroll.module.css";

/*
  A pinned story (Apple's product pages): a tall track with one viewport that
  stays put while the scroll plays the story through its chapters, forward and
  back. The panel carries --p (0 to 1) for CSS; components read the chapter
  from useStory() and can follow the exact progress with useStoryProgress()
  without re-rendering. Chapter buttons jump to a chapter with goTo().

  The travelling Aan lands here with `hand` and the story's own Aan takes
  over (`here` is true while it does), since page coordinates cannot follow
  a pinned panel. Reduced motion keeps the scroll-driven story (the visitor
  drives it) and drops the easing between chapters.
*/
type StoryApi = {
  chapter: number;
  count: number;
  /** the travelling Aan has handed over to this story */
  here: boolean;
  goTo: (i: number) => void;
  subscribe: (fn: (p: number) => void) => () => void;
};

const StoryCtx = createContext<StoryApi>({ chapter: 0, count: 1, here: false, goTo: () => {}, subscribe: () => () => {} });

export const useStory = () => useContext(StoryCtx);

/** follow the story's progress (0..1) every frame, without re-rendering */
export function useStoryProgress(fn: (p: number) => void) {
  const { subscribe } = useStory();
  useEffect(() => subscribe(fn), [subscribe, fn]);
}

export function StoryScroll({
  id,
  label,
  chapters,
  per = 62,
  className,
  bodyClassName,
  children,
}: {
  id: string;
  label: string;
  chapters: number;
  /** scroll length per chapter, in svh */
  per?: number;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  const track = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const subs = useRef(new Set<(p: number) => void>());
  const last = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [inView, setInView] = useState(false);
  const [here, setHere] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = track.current;
    const pn = panel.current;
    if (!el || !pn) return;
    let raf = 0;
    let live = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / total));
      last.current = p;
      pn.style.setProperty("--p", p.toFixed(4));
      setChapter(Math.min(chapters - 1, Math.floor(p * chapters)));
      subs.current.forEach((fn) => fn(p));
    };
    const onScroll = () => {
      if (live && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        live = e.isIntersecting;
        if (live) {
          setInView(true);
          onScroll();
        }
      },
      { rootMargin: "25% 0px" },
    );
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [chapters]);

  // the travelling Aan hands over to the story's own Aan, and takes back
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const arrive = () => setHere(true);
    const leave = () => setHere(false);
    el.addEventListener("aan:arrive", arrive);
    el.addEventListener("aan:leave", leave);
    return () => {
      el.removeEventListener("aan:arrive", arrive);
      el.removeEventListener("aan:leave", leave);
    };
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const total = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + ((i + 0.5) / chapters) * total, behavior: reduced ? "auto" : "smooth" });
    },
    [chapters, reduced],
  );

  const subscribe = useCallback((fn: (p: number) => void) => {
    subs.current.add(fn);
    fn(last.current);
    return () => {
      subs.current.delete(fn);
    };
  }, []);

  const api = useMemo(() => ({ chapter, count: chapters, here, goTo, subscribe }), [chapter, chapters, here, goTo, subscribe]);
  const screen = useMemo(() => ({ inView, arrived: inView, walk: { on: false, delay: 0, duration: 0 }, reduced }), [inView, reduced]);

  return (
    <StoryCtx.Provider value={api}>
      <ScreenProvider value={screen}>
        <section
          ref={track}
          id={id}
          data-screen={id}
          data-story
          data-chapter={chapter}
          data-inview={inView ? "true" : "false"}
          aria-label={label}
          className={`${s.track} ${className ?? ""}`}
          style={{ "--chapters": chapters, "--per": `${per}svh` } as CSSProperties}
        >
          <div ref={panel} className={s.panel} data-story-panel>
            <div className={`${s.body} ${bodyClassName ?? ""}`}>{children}</div>
          </div>
        </section>
      </ScreenProvider>
    </StoryCtx.Provider>
  );
}
