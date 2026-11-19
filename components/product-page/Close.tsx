"use client";

import type { ReactNode } from "react";
import { Screen } from "@/components/layout/Screen";
import { AanMascot } from "@/components/aan/AanMascot";
import { McpMark, ProfitMark, RulesMark, SignalsMark } from "@/components/illustrations/sets/iso/glyphs";
import type { ProductId, ProductPage } from "@/content/products/types";
import { pageClose } from "@/content/products/pages";
import c from "./close.module.css";

const talkToAan = () => window.dispatchEvent(new Event("aan:open-chat"));

/* each page signs off with its own mark: a small isometric glyph */
const MARK: Record<ProductId, ReactNode> = {
  signals: <SignalsMark />,
  profitability: <ProfitMark />,
  rules: <RulesMark />,
  aan: <AanMascot state="diamond" size={44} glow={false} shadow={false} />,
  mcp: <McpMark />,
};

/*
  The last screen: the page's own closing line and the two ways in, with
  the page's questions folded underneath (exclusive <details>: one answer
  open at a time, so the screen never grows).
*/
export function Close({ page }: { page: ProductPage }) {
  return (
    <Screen id="close" fit="grow" bodyClassName={`l-container l-grid ${c.body}`} label={page.close.title}>
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
