"use client";

import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { Screen, useScreen } from "@/components/layout/Screen";
import { NightTown, type NightPlace, type NightState } from "@/components/illustrations/sets/nocturne/NightTown";
import { useTimelapse } from "@/components/motion/useTimelapse";
import { night } from "@/content/home";
import h from "./home.module.css";

/*
  3 · The Night Watch. One night, 6 pm to 7 am, in about thirteen seconds: the
  clock runs, Aan walks the street to each event and the building it handled
  settles. It plays once when Aan arrives; after that it is the visitor's to
  pause, scrub or replay. Reduced motion opens on the morning.
*/
const END = 780; // minutes after 6 pm
const HOLDS = night.events.slice(0, -1).map((e) => e.m);
const ALERT_FOR = 60; // minutes a building stays coral before it reads as handled

function clockText(m: number) {
  const total = 18 * 60 + Math.round(m);
  const h24 = Math.floor(total / 60) % 24;
  const mm = total % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return { time: `${h12}:${String(mm).padStart(2, "0")}`, half: h24 < 12 ? "AM" : "PM" };
}

function currentEvent(m: number) {
  let cur: (typeof night.events)[number] | null = null;
  for (const e of night.events) if (e.m <= m) cur = e;
  return cur;
}

function placeStates(m: number): Record<NightPlace, NightState> {
  const out = { home: "idle", store: "idle", ads: "idle", warehouse: "idle" } as Record<NightPlace, NightState>;
  for (const e of night.events) {
    if (e.at === "home" || m < e.m) continue;
    out[e.at] = m < e.m + ALERT_FOR ? "alert" : "handled";
  }
  return out;
}

const PlayIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 2.5v11l9-5.5z" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
  </svg>
);
const ReplayIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" style={{ fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" }}>
    <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" />
  </svg>
);

function Watch() {
  const { arrived, reduced } = useScreen();
  const town = useRef<HTMLDivElement>(null);
  const sky = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const half = useRef<HTMLSpanElement>(null);

  // per frame: the sky and the clock, written straight to the DOM
  const onFrame = useCallback((m: number) => {
    const dawn = Math.max(0, Math.min(1, (m - 660) / 120)).toFixed(3);
    const el = town.current;
    if (el) {
      el.style.setProperty("--t", (m / END).toFixed(4));
      el.style.setProperty("--dawn", dawn);
    }
    sky.current?.style.setProperty("--dawn", dawn);
    const c = clockText(m);
    if (clock.current) clock.current.textContent = c.time;
    if (half.current) half.current.textContent = c.half;
  }, []);

  const tl = useTimelapse({ from: 0, to: END, duration: 13000, holds: HOLDS, holdMs: 900, step: 15, onFrame });
  const { minute, playing, play, pause, seek, done } = tl;

  // the first frame, then one play when Aan gets here (or the morning, calmly)
  const started = useRef(false);
  useEffect(() => onFrame(0), [onFrame]);
  useEffect(() => {
    if (!arrived || started.current) return;
    started.current = true;
    if (reduced) seek(END);
    else play();
  }, [arrived, reduced, play, seek]);

  const cur = currentEvent(minute);
  const at: NightPlace = cur?.at ?? "home";
  const bubble = cur?.bubble ?? night.start.bubble;
  const states = placeStates(minute);
  const lightsOn = minute < 180 || minute >= 760;
  const c = clockText(minute);

  return (
    <>
      <div ref={sky} className={h.dawnSky} aria-hidden="true" />
      <div className={`${h.copy} ${h.nightCopy}`}>
        <h2 className="t-h2">{night.title}</h2>
        <p className="t-statement" data-optional>
          {night.statement}
        </p>
        <p className={h.clock} aria-hidden="true">
          <span ref={clock}>6:00</span>
          <span ref={half} className={h.clockNote}>
            PM
          </span>
        </p>
        <ol className={h.events}>
          {night.events.map((e) => {
            const state = minute < e.m ? "next" : cur?.m === e.m ? "now" : "past";
            return (
              <li key={e.m}>
                <button type="button" className={h.event} data-state={state} onClick={() => seek(e.m)} aria-current={state === "now" ? "step" : undefined}>
                  <time>{e.time}</time>
                  <span>{e.text}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className={h.now} aria-live="polite">
          {cur ? `${cur.time} · ${cur.text}` : "Evening · Aan takes the watch."}
        </p>
        <div className={h.controls}>
          <button type="button" className={h.play} onClick={playing ? pause : play}>
            {playing ? <PauseIcon /> : done ? <ReplayIcon /> : <PlayIcon />}
            {playing ? "Pause" : done ? "Replay" : "Play"}
          </button>
          <input
            className={h.scrub}
            type="range"
            min={0}
            max={END}
            step={15}
            value={Math.round(minute / 15) * 15}
            style={{ "--fill": `${((Math.round(minute / 15) * 15) / END) * 100}%` } as CSSProperties}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Time of night"
            aria-valuetext={`${c.time} ${c.half}`}
          />
        </div>
        <p className={h.note}>{night.note}</p>
      </div>
      <div className={`${h.visual} ${h.visualWide}`}>
        <NightTown ref={town} at={at} bubble={bubble} lightsOn={lightsOn} states={states} />
      </div>
    </>
  );
}

export function NightWatchScreen() {
  return (
    <Screen id="night-watch" hasDock className={h.nightScreen} bodyClassName={`l-container l-grid ${h.split}`} label="The Night Watch">
      <Watch />
    </Screen>
  );
}

