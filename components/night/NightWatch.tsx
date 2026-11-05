"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The Night Watch. Scroll scrubs a clock from 6:00pm to 7:00am over a sticky
 * scene: the customer's own business (home, store, warehouse, billboard,
 * ledger) drawn as an isometric hairline miniature. The house goes dark at
 * 9pm; Aan keeps watch, walking to each problem as it happens. At 7am the
 * morning brief lands.
 */

// --- isometric helpers (world units -> svg px) ---------------------------
const OX = 450;
const OY = 300;
const iso = (x: number, y: number, z = 0) => [OX + (x - y) * 0.866, OY + (x + y) * 0.5 - z] as const;
const pts = (...p: (readonly [number, number])[]) => p.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");

function box(x: number, y: number, w: number, d: number, h: number, z0 = 0) {
  return {
    top: pts(iso(x, y, z0 + h), iso(x + w, y, z0 + h), iso(x + w, y + d, z0 + h), iso(x, y + d, z0 + h)),
    left: pts(iso(x, y + d, z0), iso(x + w, y + d, z0), iso(x + w, y + d, z0 + h), iso(x, y + d, z0 + h)),
    right: pts(iso(x + w, y, z0), iso(x + w, y + d, z0), iso(x + w, y + d, z0 + h), iso(x + w, y, z0 + h)),
  };
}

function Box({ b, className = "" }: { b: ReturnType<typeof box>; className?: string }) {
  return (
    <g className={`nw-box ${className}`}>
      <polygon points={b.right} className="nw-face nw-face--r" />
      <polygon points={b.left} className="nw-face nw-face--l" />
      <polygon points={b.top} className="nw-face nw-face--t" />
    </g>
  );
}

// window on the +y (left) face of a box
function winL(x: number, yFace: number, w: number, z: number, h: number) {
  return pts(iso(x, yFace, z), iso(x + w, yFace, z), iso(x + w, yFace, z + h), iso(x, yFace, z + h));
}
// window on the +x (right) face
function winR(xFace: number, y: number, d: number, z: number, h: number) {
  return pts(iso(xFace, y, z), iso(xFace, y + d, z), iso(xFace, y + d, z + h), iso(xFace, y, z + h));
}

// --- timeline -------------------------------------------------------------
const TOTAL = 780; // minutes from 18:00 to 07:00
const EVENTS = [
  { m: 180, time: "9:00 PM", text: "Lights out. Aan on watch.", target: "home", bubble: "On watch. Sleep well." },
  { m: 304, time: "11:04 PM", text: "Price undercut. Flagged.", target: "store", bubble: "Undercut by $3. Flagged." },
  { m: 494, time: "2:14 AM", text: "$86 wasted. Paused.", target: "ads", bubble: "$86, 0 sales. Paused." },
  { m: 640, time: "4:40 AM", text: "Low stock. Reorder drafted.", target: "warehouse", bubble: "Reorder drafted for you." },
  { m: 780, time: "7:00 AM", text: "3 fixes. $1,240 saved.", target: "brief", bubble: "Good morning." },
] as const;

// where Aan walks (world coords), keyed by minute
const PATH: { m: number; x: number; y: number }[] = [
  { m: 0, x: -60, y: 40 },
  { m: 180, x: -150, y: -40 }, // home
  { m: 250, x: -70, y: 50 },
  { m: 304, x: -10, y: -60 }, // store
  { m: 400, x: 60, y: 70 },
  { m: 494, x: 150, y: 80 }, // billboard
  { m: 560, x: 100, y: 10 },
  { m: 640, x: 150, y: -40 }, // warehouse
  { m: 720, x: 20, y: 40 },
  { m: 780, x: -20, y: 60 },
];

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function clockText(m: number) {
  const total = (18 * 60 + Math.round(m)) % (24 * 60);
  const h24 = Math.floor(total / 60);
  const mm = total % 60;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return { hm: `${h}:${mm.toString().padStart(2, "0")}`, ampm };
}

// building screen anchors (svg px) for event cards
const ANCHORS: Record<string, readonly [number, number]> = {
  home: iso(-195, -110, 110),
  store: iso(-5, -125, 90),
  ads: iso(240, 60, 150),
  warehouse: iso(175, -120, 110),
};

export function NightWatch() {
  const section = useRef<HTMLElement>(null);
  const dock = useRef<HTMLDivElement>(null);
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    const el = section.current!;
    let raf = 0;
    let lastM = -1;
    let lastOverride: string | null = "";
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = r.height - vh;
      const p = Math.min(1, Math.max(0, -r.top / span));
      const m = Math.min(1, p / 0.94) * TOTAL;

      // dusk -> night -> dawn
      const d = smooth(40, 150, m) * (1 - smooth(690, 765, m));
      el.style.setProperty("--d", d.toFixed(3));
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--sun", (1 - smooth(20, 140, m) + smooth(700, 780, m)).toFixed(3));
      el.dataset.surface = d > 0.5 ? "dark" : "light";

      // Aan walks the path
      let k = 0;
      while (k < PATH.length - 2 && PATH[k + 1].m <= m) k++;
      const a = PATH[k];
      const b = PATH[k + 1];
      const t = smooth(a.m, b.m, m);
      const [sx, sy] = iso(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, 34);
      if (dock.current) {
        dock.current.style.left = `${(sx / 900) * 100}%`;
        dock.current.style.top = `${(sy / 600) * 100}%`;
        const ev = [...EVENTS].reverse().find((e) => m >= e.m);
        dock.current.dataset.bubble = ev ? ev.bubble : "Evening. I've got it from here.";
      }

      // Aan thinks (cube) while handling an event, otherwise watches (diamond)
      const busy = EVENTS.some((e) => e.target !== "home" && e.target !== "brief" && m >= e.m && m < e.m + 45);
      const want = busy ? "cube" : null;
      if (want !== lastOverride) {
        lastOverride = want;
        window.dispatchEvent(new CustomEvent("aan:override", { detail: { stop: "night", state: want } }));
      }

      const rounded = Math.round(m);
      if (rounded !== lastM) {
        lastM = rounded;
        setMinute(rounded);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const clock = clockText(minute);
  const lightsOn = minute < 180;
  const reached = (target: string) => {
    const e = EVENTS.find((x) => x.target === target)!;
    return minute >= e.m;
  };
  const morning = minute >= 760;

  const ground = box(-290, -210, 580, 420, 8, -8);
  const home = box(-250, -160, 100, 90, 62);
  const store = box(-60, -170, 110, 72, 54);
  const warehouse = box(110, -180, 150, 104, 72);
  const ledger = box(-270, 40, 64, 64, 40);
  const boardPanel = box(196, 52, 96, 6, 54, 76);

  return (
    <section ref={section} id="night" data-stop="night" data-hold="true" data-surface="light" className="night">
      <div className="night__sticky">
        <div className="night__sky" aria-hidden="true">
          <span className="night__stars" />
          <span className="night__sun" />
          <span className="night__moon" />
        </div>

        <div className="container night__grid">
          <div className="night__copy">
            <p className="eyebrow">The Night Watch</p>
            <h2 className="display h2 night__title">
              You sleep.
              <br />
              Aan doesn&apos;t.
            </h2>
            <p className="night__clock" aria-live="off">
              <span className="night__hm tabular">{clock.hm}</span>
              <span className="night__ampm">{clock.ampm}</span>
            </p>
            <ol className="night__timeline">
              {EVENTS.map((e) => (
                <li key={e.time} className={minute >= e.m ? "is-done" : ""}>
                  <span className="night__t">{e.time}</span>
                  <span className="night__e">{e.text}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="night__scene">
            <svg viewBox="0 0 900 600" className="nw-svg" role="img" aria-label="Your business at night: home, store, warehouse, billboard and ledger, with Aan on patrol">
              <Box b={ground} className="nw-ground" />
              {/* roads */}
              <polyline points={pts(iso(-170, -50), iso(160, -50), iso(160, 140), iso(-170, 140), iso(-170, -50))} className="nw-road" />
              <polyline points={pts(iso(-20, -50), iso(-20, 140))} className="nw-road" />

              {/* home + roof */}
              <g className={`nw-home ${lightsOn ? "is-lit" : ""}`}>
                <Box b={home} />
                <polygon points={pts(iso(-250, -115, 98), iso(-150, -115, 98), iso(-150, -70, 62), iso(-250, -70, 62))} className="nw-face nw-face--l nw-roof" />
                <polygon points={pts(iso(-150, -160, 62), iso(-150, -70, 62), iso(-150, -115, 98))} className="nw-face nw-face--r" />
                <polygon points={winL(-236, -70, 22, 18, 22)} className="nw-window" />
                <polygon points={winL(-196, -70, 22, 18, 22)} className="nw-window" />
                <polygon points={winR(-150, -144, 22, 18, 22)} className="nw-window" />
                <polygon points={winL(-170, -70, 14, 0, 34)} className="nw-door" />
              </g>
              <text x={iso(-200, -60)[0]} y={iso(-200, -60)[1] + 22} className="nw-tag" textAnchor="middle">
                YOUR HOME
              </text>

              {/* store */}
              <g className={`nw-bld ${reached("store") ? "is-alert" : ""}`}>
                <Box b={store} />
                <polygon points={pts(iso(-60, -98, 40), iso(50, -98, 40), iso(50, -84, 30), iso(-60, -84, 30))} className="nw-awning" />
                <polygon points={winL(-48, -98, 40, 6, 22)} className="nw-window nw-window--shop" />
                <polygon points={winL(4, -98, 30, 0, 30)} className="nw-door" />
              </g>
              <text x={iso(-5, -90)[0]} y={iso(-5, -90)[1] + 26} className="nw-tag" textAnchor="middle">
                STOREFRONT
              </text>

              {/* warehouse */}
              <g className={`nw-bld ${reached("warehouse") ? "is-alert" : ""}`}>
                <Box b={warehouse} />
                {[0, 1, 2, 3, 4].map((k) => (
                  <polyline key={k} points={pts(iso(130, -76, 8 + k * 9), iso(190, -76, 8 + k * 9))} className="nw-line" />
                ))}
                <polygon points={winL(130, -76, 60, 0, 50)} className="nw-door nw-door--roll" />
                <Box b={box(214, -60, 22, 22, 18)} />
                <Box b={box(240, -60, 22, 22, 18)} />
                <Box b={box(227, -60, 22, 22, 18, 18)} />
              </g>
              <text x={iso(185, -70)[0]} y={iso(185, -70)[1] + 30} className="nw-tag" textAnchor="middle">
                WAREHOUSE
              </text>

              {/* billboard (your ads) */}
              <g className={`nw-bld ${reached("ads") ? "is-alert" : ""}`}>
                <polyline points={pts(iso(214, 58, 0), iso(214, 58, 76))} className="nw-line nw-line--post" />
                <polyline points={pts(iso(274, 58, 0), iso(274, 58, 76))} className="nw-line nw-line--post" />
                <Box b={boardPanel} />
                <polygon points={winL(206, 58, 76, 84, 38)} className="nw-ad" />
              </g>
              <text x={iso(244, 70)[0]} y={iso(244, 70)[1] + 22} className="nw-tag" textAnchor="middle">
                YOUR ADS
              </text>

              {/* ledger */}
              <g className="nw-bld">
                <Box b={ledger} />
                <text x={iso(-238, 104, 14)[0]} y={iso(-238, 104, 14)[1]} className="nw-dollar" textAnchor="middle">
                  $
                </text>
              </g>
              <text x={iso(-238, 104)[0]} y={iso(-238, 104)[1] + 24} className="nw-tag" textAnchor="middle">
                LEDGER
              </text>

              {/* Aan's patrol trail */}
              <polyline points={pts(...PATH.map((q) => iso(q.x, q.y)))} className="nw-trail" />
            </svg>

            {/* event cards pinned to the buildings */}
            {EVENTS.filter((e) => e.target in ANCHORS).map((e) => {
              const [ax, ay] = ANCHORS[e.target];
              const on = minute >= e.m;
              const fresh = on && minute < e.m + 120;
              return (
                <div
                  key={e.time}
                  className={`nw-card ${on && !morning ? "is-on" : ""} ${fresh && !morning ? "is-fresh" : ""}`}
                  style={{ left: `${(ax / 900) * 100}%`, top: `${(ay / 600) * 100}%` }}
                >
                  <span className="nw-card__t">{e.time}</span>
                  <span className="nw-card__e">{e.text}</span>
                </div>
              );
            })}

            <div ref={dock} className="nw-dock" data-dock data-size="54" data-state="diamond" data-bubble="On watch." aria-hidden="true" />

            <div className={`brief ${morning ? "is-on" : ""}`}>
              <p className="brief__k">Morning brief · 7:00 AM</p>
              <p className="brief__title">While you slept</p>
              <ul>
                <li>Price undercut on Kitchen Knife Set. Flagged.</li>
                <li>Wasted spend on &ldquo;chef knife 8 inch&rdquo;. Paused.</li>
                <li>Bamboo board reorder. Drafted for your approval.</li>
              </ul>
              <p className="brief__sum">
                <b>3 fixes.</b> $1,240 saved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
