"use client";

import { AnarixLogo } from "../chrome/Logo";

const SERVICES = "https://www.anarix.ai";

export function ClosingSection() {
  return (
    <section id="ai-for-good" data-stop="cta" className="closing">
      <div className="container closing__inner">
        <div className="closing__dock-wrap" aria-hidden="true">
          <div className="closing__halo" />
          <div className="closing__dock" data-dock data-size="120" data-size-sm="88" data-state="diamond" data-bubble="Ready when you are." />
          <svg className="closing__pad" viewBox="0 0 200 60">
            <ellipse cx="100" cy="22" rx="84" ry="20" />
            <ellipse cx="100" cy="22" rx="56" ry="13" />
            <path d="M16,22 V32 A84,20 0 0 0 184,32 V22" />
          </svg>
        </div>
        <p className="chapter__label">
          <span>06</span>Our promise
        </p>
        <h2 className="display closing__title">AI for good.</h2>
        <p className="lede closing__lede">Built to give you your nights back.</p>
        <div className="closing__ctas">
          <a href={`${SERVICES}/contact-us`} className="btn btn--primary">
            Book a demo
          </a>
          <button className="btn btn--secondary" onClick={() => window.dispatchEvent(new Event("aan:open-chat"))}>
            Talk to Aan
          </button>
        </div>
        <p className="closing__cross">
          Rather we run it for you?{" "}
          <a href={`${SERVICES}/amazon-account-management`}>See Anarix Services →</a>
        </p>
      </div>
    </section>
  );
}

const COLS = [
  {
    h: "Platform",
    links: [
      ["Aan", "#aan"],
      ["Signals", "#signals"],
      ["Profitability", "#profitability"],
      ["Rules", "#rules"],
      ["MCP", "#mcp"],
    ],
  },
  {
    h: "Services",
    links: [
      ["Account Management", `${SERVICES}/amazon-account-management`],
      ["Amazon Marketing Cloud", `${SERVICES}/amazon-marketing-cloud`],
      ["Case Studies", `${SERVICES}/case-studies`],
      ["Blogs", `${SERVICES}/blogs`],
    ],
  },
  {
    h: "Company",
    links: [
      ["Contact Us", `${SERVICES}/contact-us`],
      ["Schedule a demo", `${SERVICES}/contact-us`],
      ["Sign In", "https://app.anarix.ai/"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <AnarixLogo height={24} />
          <p>One AI for every marketplace. Amazon, Walmart and Shopify, watched over 24/7 by Aan.</p>
        </div>
        {COLS.map((c) => (
          <div key={c.h} className="footer__col">
            <p className="footer__h">{c.h}</p>
            <ul>
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container footer__base">
        <span>© {new Date().getFullYear()} Anarix. All rights reserved.</span>
        <span className="footer__aan">Aan · Anarix Analytical Neural</span>
      </div>
    </footer>
  );
}
