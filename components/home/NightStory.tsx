"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { StoryScroll, useStory, useStoryProgress } from "@/components/layout/StoryScroll";
import { AanClay, type AanAct } from "@/components/aan/clay/AanClay";
import { AanDock } from "@/components/aan/v2/AanDock";
import { ProductFrame } from "@/components/visual/ProductFrame";
import { LightTrails } from "@/components/visual/LightTrails";
import { Ticker } from "@/components/motion/Ticker";
import { useMediaQuery } from "@/components/motion/useMediaQuery";
import { night } from "@/content/home";
import n from "./night-story.module.css";

/*
  3 · One night with Aan, as a pinned story (Apple's product pages). The
  scroll is the night: the clock runs from 6 PM to 7 AM, each change lands
  as a row in Signals, and Aan handles it in front of you. It looks, then
  acts: points at the undercut, lands on Pause, becomes a bar while it drafts
  the reorder, and at 7 AM the brief arrives with every line adding up.
  Each chapter has two beats: the change lands, then Aan handles it.
*/
const CH = night.chapters;
const N = CH.length;
const TOTAL = night.brief.items.reduce((s, it) => s + it.v, 0);

function clockText(m: number) {
  const total = 18 * 60 + Math.round(m);
  const h24 = Math.floor(total / 60) % 24;
  const mm = total % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return { time: `${h12}:${String(mm).padStart(2, "0")}`, half: h24 < 12 ? "AM" : "PM" };
}

/** the clock runs during the first part of each chapter, then holds */
function minuteAt(p: number) {
  const x = p * N;
  const k = Math.min(N - 1, Math.floor(x));
  const t = Math.min(1, (x - k) / 0.42);
  const from = k === 0 ? 0 : CH[k - 1].m;
  return from + (CH[k].m - from) * t;
}

type RowState = "quiet" | "alert" | "done";

function Night() {
  const { here, goTo } = useStory();
  const [beat, setBeat] = useState(0); // two beats per chapter
  const time = useRef<HTMLSpanElement>(null);
  const half = useRef<HTMLSpanElement>(null);

  const onProgress = useCallback((p: number) => {
    const c = clockText(minuteAt(p));
    if (time.current) time.current.textContent = c.time;
    if (half.current) half.current.textContent = c.half;
    setBeat(Math.min(2 * N - 1, Math.floor(p * N * 2)));
  }, []);
  useStoryProgress(onProgress);

  const ch = Math.floor(beat / 2);
  const late = beat % 2 === 1;
  const cur = CH[ch];
  const rowState = (r: number): RowState => {
    const at = r + 1; // the chapter each row belongs to
    if (ch < at) return "quiet";
    if (ch === at && !late) return "alert";
    return "done";
  };
  const briefOn = ch === N - 1;

  // what Aan does on this beat
  const act: AanAct = ch === 0 ? "idle" : ch === N - 1 ? (late ? "celebrate" : "hop") : late ? (cur.act as AanAct) : "look";

  return (
    <>
      <span className={n.dawn} aria-hidden="true" />
      <div className={n.copy}>
        <p className={n.kicker}>{night.kicker}</p>
        <h2 className={`t-h2 ${n.title}`}>{night.title}</h2>
        <p className={n.clock} aria-hidden="true">
          <span ref={time}>6:00</span>
          <span ref={half} className={n.ampm}>
            PM
          </span>
        </p>
        <div className={n.caption} aria-live="polite">
          <p key={ch} className={n.capIn}>
            <b>{cur.head}</b>
            <span>{cur.line}</span>
          </p>
        </div>
        <ol className={n.rail}>
          {CH.map((c, i) => (
            <li key={c.m}>
              <button type="button" onClick={() => goTo(i)} data-state={i < ch ? "past" : i === ch ? "now" : "next"} aria-current={i === ch ? "step" : undefined}>
                <span>{c.time}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className={n.note}>{night.note}</p>
      </div>
      <Stage ch={ch} late={late} act={act} here={here} rowState={rowState} briefOn={briefOn} />
    </>
  );
}

function Stage({ ch, late, act, here, rowState, briefOn }: { ch: number; late: boolean; act: AanAct; here: boolean; rowState: (r: number) => RowState; briefOn: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLSpanElement | null)[]>([]);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const total = useRef<HTMLParagraphElement>(null);
  const narrow = useMediaQuery("(max-width: 900px)");
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [moving, setMoving] = useState(false);
  const first = useRef(true);

  // where Aan stands on this beat: in the lane beside the row it is handling,
  // on the button it presses, beside the brief's total at 7 AM
  const place = useCallback(() => {
    const st = stage.current;
    if (!st) return;
    const s = st.getBoundingClientRect();
    const card = st.querySelector<HTMLElement>("[data-card]")?.getBoundingClientRect();
    if (!card) return;
    const lane = narrow ? card.right - s.left - 34 : card.right - s.left + (s.right - card.right) / 2;
    const mid = (r: DOMRect | undefined) => (r ? r.top + r.height / 2 - s.top : 0);
    let x = lane;
    let y: number;
    if (narrow) {
      // phones: Aan keeps to the right end of the stores row
      const hr = head.current?.getBoundingClientRect();
      x = card.right - s.left - 26;
      y = hr ? hr.bottom - s.top - 2 : 0;
    } else if (ch === 0) {
      y = mid(head.current?.getBoundingClientRect()) + 24;
    } else if (ch === N - 1) {
      y = mid(total.current?.getBoundingClientRect()) + 24;
    } else {
      const r = ch - 1;
      if (late && act === "press") {
        const b = buttons.current[r]?.getBoundingClientRect();
        x = b ? b.left + b.width / 2 - s.left : lane;
        y = b ? b.top + b.height * 0.8 - s.top : 0;
      } else {
        y = mid(rows.current[r]?.getBoundingClientRect()) + 24;
      }
    }
    setPos((p) => (p && Math.abs(p.x - x) < 1 && Math.abs(p.y - y) < 1 ? p : { x, y }));
  }, [ch, late, act, narrow]);

  useLayoutEffect(place, [place]);
  useEffect(() => {
    const st = stage.current;
    if (!st) return;
    const ro = new ResizeObserver(place);
    ro.observe(st);
    // the card rises in once; place again when it has settled
    const t = window.setTimeout(place, 1300);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, [place]);

  // glide between places, with the light tail
  const last = useRef(pos);
  useEffect(() => {
    const prev = last.current;
    last.current = pos;
    if (first.current) {
      first.current = false;
      return;
    }
    if (!prev || !pos || (Math.abs(prev.x - pos.x) < 2 && Math.abs(prev.y - pos.y) < 2)) return;
    stage.current?.style.setProperty("--tail", `${(Math.atan2(prev.y - pos.y, prev.x - pos.x) * 180) / Math.PI}deg`);
    setMoving(true);
    const t = window.setTimeout(() => setMoving(false), 620);
    return () => window.clearTimeout(t);
  }, [pos]);

  const size = narrow ? 30 : 56;

  return (
    <div ref={stage} className={n.stage}>
      <LightTrails aim={stage} from="right" count={9} risk={ch === 1 || ch === 2 ? 4 : undefined} bend={1.6} spread={[-0.2, 1.2]} className={n.trails} />
      <ProductFrame title="Signals / Tonight" note="Sample night" lean="none" className={n.frame}>
        <div className={n.card} data-card data-ui>
          <div ref={head} className={n.head}>
            {night.stores.map((st) => (
              <span key={st} className={n.store}>
                <i aria-hidden="true" />
                {st}
              </span>
            ))}
            <span className={n.watching}>Watching</span>
          </div>
          <ul className={n.rows}>
            {night.rows.map((r, i) => {
              const state = rowState(i);
              return (
                <li key={r.where} ref={(el) => void (rows.current[i] = el)} className={n.row} data-state={state}>
                  <span className={n.dot} aria-hidden="true" />
                  <span className={n.what}>
                    <small>{r.where}</small>
                    <span>{state === "quiet" ? "No change" : r.text}</span>
                  </span>
                  <span ref={(el) => void (buttons.current[i] = el)} className={n.act} data-state={state}>
                    {state === "done" ? r.done : r.action}
                  </span>
                </li>
              );
            })}
          </ul>
          <aside className={n.brief} data-shown={briefOn ? "true" : "false"} aria-hidden={briefOn ? undefined : true}>
            <p className={n.briefTitle}>{night.brief.title}</p>
            <ul>
              {night.brief.items.map((it) => (
                <li key={it.text}>
                  <time>{it.time}</time>
                  <span>{it.text}</span>
                  <b>${it.v}</b>
                </li>
              ))}
            </ul>
            <p className={n.held}>{night.brief.held}</p>
            <p ref={total} className={n.total}>
              <b>
                $<Ticker value={briefOn ? TOTAL : 0} duration={1100} />
              </b>{" "}
              {night.brief.total}
            </p>
          </aside>
        </div>
      </ProductFrame>

      <div
        className={n.actor}
        data-here={here ? "true" : "false"}
        data-act={moving ? "glide" : act}
        data-moving={moving ? "true" : undefined}
        style={{ "--size": `${size}px`, transform: pos ? `translate(${(pos.x - size / 2).toFixed(1)}px, ${(pos.y - size).toFixed(1)}px)` : undefined } as CSSProperties}
      >
        <span className={n.beam} aria-hidden="true" />
        <AanClay size={size} act={moving ? "glide" : act} gaze={act === "look" || act === "point" ? [-0.9, 0.1] : undefined} />
        <AanDock stop="night" size={size / 2} hand style={{ left: "50%", bottom: 0 }} />
      </div>
    </div>
  );
}

export function NightStory() {
  return (
    <StoryScroll id="night-watch" label="One night with Aan" chapters={N} per={70} className={n.track} bodyClassName={`l-container l-grid ${n.body}`}>
      <Night />
    </StoryScroll>
  );
}
