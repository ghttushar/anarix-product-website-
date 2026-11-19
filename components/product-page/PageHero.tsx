"use client";

import { Screen } from "@/components/layout/Screen";
import { Ink } from "@/components/home/Ink";
import type { ProductPage } from "@/content/products/types";
import { pageClose } from "@/content/products/pages";
import { LANDMARK } from "./shared";
import p from "./page.module.css";

/* 1 · The product's landmark on the street, drawn large, with Aan at it.
   One action: book a demo (Ask Aan lives in the island and the close). */
export function PageHero({ page }: { page: ProductPage }) {
  const Art = LANDMARK[page.id];
  return (
    <Screen id="top" hasDock bodyClassName={`l-container l-grid ${p.split} ${p.hero}`} label={page.name}>
      <div className={p.copy}>
        <h1 className={`t-display ${p.pageTitle}`}>
          {page.hero.title.map((line, i) => (
            <span key={line}>
              {i > 0 && " "}
              {line}
            </span>
          ))}
        </h1>
        <p className="t-statement">
          <Ink text={page.hero.lede} />
        </p>
        <div className="c-actions">
          <a className="c-cta" href={pageClose.primary.href}>
            {pageClose.primary.label}
          </a>
        </div>
      </div>
      <div className={p.heroArt} data-optional>
        <Art stop={page.id} bubble={page.hero.bubble} />
      </div>
    </Screen>
  );
}
