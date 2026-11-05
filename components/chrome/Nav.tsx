"use client";

import { useEffect, useState } from "react";
import { AnarixLogo } from "./Logo";

const SERVICES = "https://www.anarix.ai";

// Homepage anchors for now; these become /platform/<page> as sub-pages ship.
const LINKS = [
  { label: "Aan", href: "#aan" },
  { label: "Signals", href: "#signals" },
  { label: "Profitability", href: "#profitability" },
  { label: "Rules", href: "#rules" },
  { label: "MCP", href: "#mcp" },
  { label: "Contact Us", href: `${SERVICES}/contact-us` },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onDock = (e: Event) => setActive((e as CustomEvent<string>).detail);
    window.addEventListener("aan:dock", onDock);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("aan:dock", onDock);
    };
  }, []);

  return (
    <header className="chrome chrome--nav nav-wrap">
      <nav className={`nav ${scrolled ? "is-scrolled" : ""}`} aria-label="Primary">
        <div className="nav__brand">
          <a href="#top" className="nav__logo" aria-label="Anarix Platform home">
            <AnarixLogo height={22} />
          </a>
          <div className="nav__switch" role="group" aria-label="Anarix sites">
            <a href={SERVICES} className="nav__switch-opt">
              Services
            </a>
            <span className="nav__switch-opt is-on" aria-current="true">
              Platform
            </span>
          </div>
        </div>

        <div className="nav__menu">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`nav__link ${active && l.href === `#${active}` ? "is-active" : ""}`}
            >
              {l.label}
              <span className="nav__underline" />
            </a>
          ))}
        </div>

        <div className="nav__actions">
          <a href={`${SERVICES}/contact-us`} className="chrome-btn chrome-btn--primary">
            Schedule Demo
          </a>
          <a href="https://app.anarix.ai/" target="_blank" rel="noopener noreferrer" className="nav__signin">
            Sign In
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav__signin-arrow" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>

        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="nav__mobile">
          <a href={SERVICES} className="nav__mobile-link">
            Services site ↗
          </a>
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="nav__mobile-link" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="https://app.anarix.ai/" className="nav__mobile-link">
            Sign In
          </a>
          <a href={`${SERVICES}/contact-us`} className="chrome-btn chrome-btn--primary nav__mobile-cta">
            Schedule Demo
          </a>
        </div>
      )}
    </header>
  );
}
