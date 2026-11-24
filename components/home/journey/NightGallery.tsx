"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { StoryScroll, useStory, useStoryProgress } from "@/components/layout/StoryScroll";
import { AanClay, type AanAct } from "@/components/aan/clay/AanClay";
import { AanDock } from "@/components/aan/v2/AanDock";
import { night } from "@/content/home";
import s from "./scenes.module.css";

/*
  5 · One night with Aan, as a gallery that slides sideways while the page
  stays pinned (the reference's horizontal gallery). Each panel is an hour
  of the night with its own sky, dusk to the darkest hour to a coral dawn,
  and the one moment Aan handled then, as it looks in Signals. The gallery
  dwells on each panel before it slides on. Aan rides the timeline along the
  bottom and acts at each hour: it looks, points at the undercut, presses
  Pause, works the reorder and celebrates at the brief.
*/
const CH = night.chapters;
const N = CH.length;
const TOTAL = night.brief.items.reduce((t, it) => t + (it.fix ? it.v : 0), 0);
const ACTS: AanAct[] = ["idle", "point", "press", "work", "celebrate"];

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number) => Math.max(0, Math.min(1, v));

function Moment({ i }: { i: number }) {
  if (i === 0) {
    return (
      <div className={s.ui} data-ui>
        <p className={s.uiHead}>
          {night.stores.map((st) => (
            <span key={st}>
              <i />
              {st}
            </span>
          ))}
        </p>
        {night.rows.map((r) => (
          <p key={r.where} className={s.uiRow} data-state="quiet">
            <small>{r.where}</small>
            <span>No change</span>
          </p>
        ))}
      </div>
    );
  }
  if (i === N - 1) {
    return (
      <div className={s.ui} data-ui>
        <p className={s.briefTitle}>{night.brief.title}</p>
        {night.brief.items.map((it) => (
          <p key={it.text} className={s.briefRow} data-fix={it.fix ? "true" : "false"}>
            <time>{it.time}</time>
            <span>{it.text}</span>
            <b>{it.fix ? `$${it.v}` : `$${it.v} at risk`}</b>
          </p>
        ))}
        <p className={s.briefHeld}>{night.brief.held}</p>
        <p className={s.briefTotal}>
          <b>${TOTAL}</b> {night.brief.total}
        </p>
      </div>
    );
  }
  const r = night.rows[i - 1];
  return (
    <div className={s.ui} data-ui>
      <p className={s.uiRow} data-state="alert">
        <small>{r.where}</small>
        <span>{r.text}</span>
        <em>{r.done}</em>
      </p>
    </div>
  );
}

function Gallery() {
  const { here, chapter } = useStory();
  const track = useRef<HTMLDivElement>(null);
  const rider = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const step = useRef(0);
  const [moving, setMoving] = useState(false);
  const last = useRef(0);

  // one panel's width plus the gap: how far the gallery slides per hour
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const a = el.children[0] as HTMLElement | undefined;
      const b = el.children[1] as HTMLElement | undefined;
      step.current = a && b ? b.offsetLeft - a.offsetLeft : 0;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onProgress = useCallback((p: number) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const x = Math.min(N - 1, p * N);
    const c = Math.floor(x);
    const t = x - c;
    const pos = c >= N - 1 ? N - 1 : c + (reduced ? (t > 0.5 ? 1 : 0) : smooth(clamp((t - 0.55) / 0.45)));
    if (track.current) track.current.style.transform = `translateX(${(-pos * step.current).toFixed(1)}px)`;
    // Aan rides the timeline with the night
    const w = line.current?.clientWidth ?? 0;
    if (rider.current) rider.current.style.transform = `translateX(${((pos / (N - 1)) * w).toFixed(1)}px)`;
    if (line.current) line.current.style.setProperty("--fill", (pos / (N - 1)).toFixed(4));
    const m = Math.abs(pos - Math.round(pos)) > 0.02;
    if (m !== last.current > 0) {
      last.current = m ? 1 : 0;
      setMoving(m);
    }
  }, []);
  useStoryProgress(onProgress);

  const act: AanAct = moving ? "glide" : ACTS[chapter] ?? "idle";

  return (
    <>
      <header className={s.galleryHead}>
        <p className={s.kicker}>{night.kicker}</p>
        <h2 className={s.galleryTitle}>{night.title}</h2>
      </header>
      <div className={s.window}>
        <div ref={track} className={s.track}>
          {CH.map((c, i) => (
            <article key={c.m} className={s.panel} data-ch={i} aria-label={`${c.time}: ${c.head}`} aria-current={i === chapter ? "step" : undefined}>
              <span className={s.sky} aria-hidden="true" />
              <p className={s.meta}>
                <span>{c.time}</span>
                <span>
                  {i + 1} of {N}
                </span>
                <span>Sample night</span>
              </p>
              <div className={s.moment}>
                <Moment i={i} />
              </div>
              <div className={s.caption}>
                <h3>{c.head}</h3>
                <p>{c.line}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className={s.timeline}>
        <div ref={line} className={s.line}>
          <div ref={rider} className={s.rider} data-here={here ? "true" : "false"}>
            <AanClay size={44} act={act} gaze={act === "point" ? [-0.6, -0.6] : undefined} />
            <AanDock stop="night" size={22} hand style={{ left: "50%", bottom: 0 }} />
          </div>
          {CH.map((c, i) => (
            <span key={c.m} className={s.tick} style={{ "--at": i / (N - 1) } as CSSProperties} data-on={i <= chapter ? "true" : "false"}>
              {c.time}
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {CH[chapter].time}: {CH[chapter].head} {CH[chapter].line}
      </p>
    </>
  );
}

export function NightGallery() {
  return (
    <StoryScroll id="night-watch" label="One night with Aan" chapters={N} per={72} className={s.dark} bodyClassName={s.galleryBody}>
      <Gallery />
    </StoryScroll>
  );
}
