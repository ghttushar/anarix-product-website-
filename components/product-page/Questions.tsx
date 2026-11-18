"use client";

import { Screen } from "@/components/layout/Screen";
import { OpenDoor } from "@/components/illustrations/sets/nocturne/OpenDoor";
import type { ProductPage } from "@/content/products/types";
import { pageClose } from "@/content/products/pages";
import { talkToAan } from "./shared";
import p from "./page.module.css";

/*
  5 · Questions. Exclusive <details>: one answer open at a time, so the
  screen never grows.
*/
export function Questions({ page }: { page: ProductPage }) {
  return (
    <Screen id="questions" bodyClassName={`l-container l-grid ${p.split}`} label="Questions">
      <h2 className={`t-h2 ${p.faqHead}`}>{pageClose.faqTitle}</h2>
      <div className={p.faqList}>
        {page.faq.map((f, i) => (
          <details key={f.q} name={`faq-${page.id}`} open={i === 0}>
            <summary>
              {f.q}
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h10" />
                <path className={p.plusV} d="M8 3v10" />
              </svg>
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </Screen>
  );
}

/* 6 · The way in: the night shift, and Aan waiting at the open door. */
export function Close() {
  return (
    <Screen id="close" hasDock bodyClassName={`l-container l-grid ${p.split} ${p.close}`} label="Book a demo">
      <div className={p.copy}>
        <h2 className={`t-display ${p.pageTitle} ${p.closeTitle}`}>
          {pageClose.title.map((line, i) => (
            <span key={line}>
              {i > 0 && " "}
              {line}
            </span>
          ))}
        </h2>
        <div className="c-actions">
          <a className="c-cta" href={pageClose.primary.href}>
            {pageClose.primary.label}
          </a>
          <button type="button" className="c-link" onClick={talkToAan}>
            {pageClose.secondary}
          </button>
        </div>
        <p className={p.services}>
          {pageClose.services.lead} <a href={pageClose.services.href}>{pageClose.services.label}</a>
        </p>
      </div>
      <div className={p.door}>
        <OpenDoor stop="close" bubble={pageClose.bubble} />
      </div>
    </Screen>
  );
}
