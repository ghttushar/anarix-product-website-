"use client";

import type { ReactNode } from "react";
import { Screen } from "@/components/layout/Screen";
import { AanMascot } from "@/components/aan/AanMascot";
import type { ProductId, ProductPage } from "@/content/products/types";
import { pageClose } from "@/content/products/pages";
import c from "./close.module.css";

const talkToAan = () => window.dispatchEvent(new Event("aan:open-chat"));

/* each page signs off with its own mark, drawn small */
const MARK: Record<ProductId, ReactNode> = {
  signals: (
    <svg viewBox="0 0 64 40" aria-hidden="true">
      <path d="M32 2 V8" />
      <rect x="4" y="8" width="56" height="28" rx="4" className={c.coral} />
      <path d="M10 32 L54 12" className={c.coral} />
    </svg>
  ),
  profitability: (
    <svg viewBox="0 0 48 56" aria-hidden="true">
      <path d="M4 2 h40 v50 l-6.7 -4 l-6.7 4 l-6.6 -4 l-6.7 4 l-6.7 -4 l-6.6 4 z" />
      <path d="M12 14 h24 M12 22 h18 M12 30 h20" className={c.coral} />
      <path d="M12 40 h24" className={c.accent} />
    </svg>
  ),
  rules: (
    <svg viewBox="0 0 72 44" aria-hidden="true">
      <path d="M2 40 H70" />
      <path d="M22 40 V6 H50 V40" />
      <rect x="54" y="26" width="14" height="14" className={c.accent} />
      <rect x="4" y="26" width="14" height="14" />
    </svg>
  ),
  aan: <AanMascot state="diamond" size={44} glow={false} shadow={false} />,
  mcp: (
    <svg viewBox="0 0 56 48" aria-hidden="true">
      <rect x="8" y="14" width="40" height="22" rx="4" className={c.accent} />
      <path d="M20 14 V4 M36 14 V4 M28 36 V46" />
    </svg>
  ),
};

/*
  The last screen: the page's own closing line and the two ways in, with
  the page's questions folded underneath (exclusive <details>: one answer
  open at a time, so the screen never grows).
*/
export function Close({ page }: { page: ProductPage }) {
  return (
    <Screen id="close" bodyClassName={`l-container l-grid ${c.body}`} label={page.close.title}>
      <div className={c.cta}>
        <span className={c.mark}>{MARK[page.id]}</span>
        <h2 className={c.title}>{page.close.title}</h2>
        <div className="c-actions">
          <a className="c-cta" href={pageClose.primary.href}>
            {pageClose.primary.label}
          </a>
          <button type="button" className="c-link" onClick={talkToAan}>
            {pageClose.secondary}
          </button>
        </div>
        <p className={c.services}>
          {pageClose.services.lead} <a href={pageClose.services.href}>{pageClose.services.label}</a>
        </p>
      </div>
      <div className={c.faq}>
        <h3 className={c.faqTitle}>{pageClose.faqTitle}</h3>
        {page.faq.map((f) => (
          <details key={f.q} name={`faq-${page.id}`}>
            <summary>
              {f.q}
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h10" />
                <path className={c.plusV} d="M8 3v10" />
              </svg>
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </Screen>
  );
}
