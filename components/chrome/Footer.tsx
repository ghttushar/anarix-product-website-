import { AnarixLogo } from "./Logo";
import f from "./footer.module.css";

const SERVICES = "https://www.anarix.ai";

const COLS = [
  {
    h: "Platform",
    links: [
      ["Aan", "#aan"],
      ["Signals", "#signals"],
      ["Profitability", "#profitability"],
      ["Rules", "#rules"],
      ["MCP", "#mcp"],
      ["The Night Watch", "#night-watch"],
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
      ["Book a demo", `${SERVICES}/contact-us`],
      ["Sign In", "https://app.anarix.ai/"],
    ],
  },
];

/* a quiet ledger at the end of the street: one hairline, four columns */
export function Footer() {
  return (
    <footer className={f.footer}>
      <div className={`l-container ${f.grid}`}>
        <div className={f.brand}>
          <AnarixLogo height={22} />
          <p>One AI for every marketplace. Amazon, Walmart and Shopify, watched over 24/7 by Aan.</p>
        </div>
        {COLS.map((c) => (
          <nav key={c.h} className={f.col} aria-label={c.h}>
            <p className={f.h}>{c.h}</p>
            <ul>
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className={`l-container ${f.base}`}>
        <span>© {new Date().getFullYear()} Anarix. All rights reserved.</span>
        <span>Aan · Anarix Analytical Neural</span>
      </div>
    </footer>
  );
}
