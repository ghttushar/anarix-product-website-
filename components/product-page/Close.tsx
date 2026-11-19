"use client";

import Link from "next/link";
import { Screen } from "@/components/layout/Screen";
import { Reveal } from "@/components/motion/Reveal";
import type { ProductPage } from "@/content/products/types";
import { PAGES, PAGE_IDS, pageClose } from "@/content/products/pages";
import { trust } from "@/content/home";
import c from "./close.module.css";

/*
  The last screen: (on the pages where Aan acts for you) how far it goes, as
  the permission ladder; then the page's own closing line and the two ways
  in, the page's questions folded underneath (one answer open at a time),
  and the way on to the next product. "Talk to Aan" opens with this page's
  questions, so the chat continues the page rather than starting over.
*/
export function Close({ page, ladder = false }: { page: ProductPage; ladder?: boolean }) {
  const next = PAGES[PAGE_IDS[(PAGE_IDS.indexOf(page.id) + 1) % PAGE_IDS.length]];
  const talkToAan = () => window.dispatchEvent(new CustomEvent("aan:open-chat", { detail: { suggestions: page.faq.slice(0, 3).map((f) => ({ q: f.q, a: f.a })) } }));
  return (
    <Screen id="close" fit="grow" bodyClassName={`l-container l-grid ${c.body}`} label={page.close.title}>
      {ladder && (
        <ol className={c.ladder} aria-label="How far Aan goes">
          {trust.ladder.map((s, i) => (
            <Reveal as="li" key={s.t} order={i + 1}>
              <span className={c.rung} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <b>{s.t}</b>
              <span>{s.d}</span>
            </Reveal>
          ))}
        </ol>
      )}
      <div className={c.cta}>
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
      <Link className={c.next} href={`/${next.id}`}>
        <span>Next</span>
        <b>
          {next.name}: {next.slogan}
        </b>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </Link>
    </Screen>
  );
}
