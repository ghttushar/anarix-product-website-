"use client";

import { useEffect, useRef, useState } from "react";
import { AanMascot, type AanState } from "../aan/AanMascot";

const SUGGESTIONS = [
  {
    q: "What can you do?",
    a: "I watch your Amazon, Walmart and Shopify accounts 24/7. I flag what changed, explain why, run your rules and answer anything about your numbers.",
  },
  {
    q: "What happens at night?",
    a: "I keep watch. Price undercuts get flagged, wasted spend gets paused, low stock gets a reorder draft. You get a brief at 7am.",
  },
  {
    q: "Can I use you in Claude or ChatGPT?",
    a: "Yes. Anarix MCP plugs your marketplace data into any AI client, so the same numbers follow you everywhere.",
  },
];

type Msg = { from: "aan" | "you"; text: string };

export function ActionIsland() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "aan", text: "Hi, I'm Aan. Ask me anything about Anarix." }]);
  const [aanState, setAanState] = useState<AanState>("diamond");
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("aan:open-chat", openChat);
    return () => window.removeEventListener("aan:open-chat", openChat);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("anarix-theme");
      if (saved === "dark" || saved === "light") setTheme(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("anarix-theme", theme);
    } catch {}
  }, [theme]);

  const ask = (q: string, a: string) => {
    setMsgs((m) => [...m, { from: "you", text: q }]);
    setAanState("bar"); // loading: bridge between prompt and output
    window.setTimeout(() => setAanState("cube"), 700); // thinking
    window.setTimeout(() => {
      setMsgs((m) => [...m, { from: "aan", text: a }]);
      setAanState("circle"); // listening again
    }, 1500);
  };

  const onDown = (e: React.PointerEvent) => {
    const r = wrap.current!.getBoundingClientRect();
    drag.current = { sx: e.clientX, sy: e.clientY, ox: r.left + r.width / 2, oy: r.bottom };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const d = drag.current;
    const x = Math.min(window.innerWidth - 40, Math.max(40, d.ox + e.clientX - d.sx));
    const y = Math.min(window.innerHeight - 8, Math.max(120, d.oy + e.clientY - d.sy));
    setPos({ x, y });
  };
  const onUp = () => {
    drag.current = null;
  };

  const style: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y, transform: "translate(-50%, -100%)" }
    : { left: "50%", bottom: 24, transform: "translateX(-50%)" };

  return (
    <div ref={wrap} className="chrome chrome--island island-wrap" style={style}>
      {open && (
        <div className="island-chat" role="dialog" aria-label="Ask Aan">
          <div className="island-chat__head">
            <AanMascot state={aanState} size={28} satellite={false} shadow={false} glow={false} />
            <div>
              <p className="island-chat__name">Aan</p>
              <p className="island-chat__status">
                {aanState === "bar" ? "Reading your question…" : aanState === "cube" ? "Thinking…" : "Online · watching 24/7"}
              </p>
            </div>
            <button className="island-chat__close" aria-label="Close" onClick={() => setOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div className="island-chat__log">
            {msgs.map((m, i) => (
              <p key={i} className={`island-msg island-msg--${m.from}`}>
                {m.text}
              </p>
            ))}
          </div>
          <div className="island-chat__suggest">
            {SUGGESTIONS.map((s) => (
              <button key={s.q} className="island-chip" onClick={() => ask(s.q, s.a)}>
                {s.q}
              </button>
            ))}
          </div>
          <p className="island-chat__fine">Demo answers. Aan can make mistakes.</p>
        </div>
      )}

      <div className="island" data-island="true">
        <div className="island__row">
          <button
            type="button"
            className="island__drag"
            title="Drag to reposition"
            style={{ touchAction: "none" }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            aria-label="Drag to reposition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="9" cy="12" r="1" />
              <circle cx="9" cy="5" r="1" />
              <circle cx="9" cy="19" r="1" />
              <circle cx="15" cy="12" r="1" />
              <circle cx="15" cy="5" r="1" />
              <circle cx="15" cy="19" r="1" />
            </svg>
          </button>
          <div className="island__divider" />
          <button
            type="button"
            className="island__aan"
            title="Ask Aan"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <AanMascot
              state={open ? aanState : "diamond"}
              size={30}
              satellite={false}
              shadow={false}
              glow={false}
              className={hover ? "is-hover" : ""}
            />
            <span className="island__label">Ask Aan</span>
          </button>
          <div className="island__actions">
            <a href="https://www.anarix.ai/contact-us" className="island__btn" title="Schedule a demo" aria-label="Schedule a demo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
                <path d="M3 10h18" />
                <path d="M16 19h6" />
                <path d="M19 16v6" />
              </svg>
            </a>
            <button
              type="button"
              className="island__btn"
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
