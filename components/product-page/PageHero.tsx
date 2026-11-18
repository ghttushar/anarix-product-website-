"use client";

import { Screen } from "@/components/layout/Screen";
import { Ink } from "@/components/home/Ink";
import type { ProductPage } from "@/content/products/types";
import { pageClose } from "@/content/products/pages";
import { LANDMARK, talkToAan } from "./shared";
import p from "./page.module.css";

/* 1 · The product's landmark on the street, drawn large, with Aan at it. */
export function PageHero({ page }: { page: ProductPage }) {
  const Art = LANDMARK[page.id];
  const demo = (
    <a className={page.hero.lead === "demo" ? "c-cta" : "c-link"} href={pageClose.primary.href}>
      {pageClose.primary.label}
    </a>
  );
  const talk = (
    <button type="button" className={page.hero.lead === "talk" ? "c-cta" : "c-link"} onClick={talkToAan}>
      {pageClose.secondary}
    </button>
  );
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
          {page.hero.lead === "demo" ? (
            <>
              {demo}
              {talk}
            </>
          ) : (
            <>
              {talk}
              {demo}
            </>
          )}
        </div>
      </div>
      <div className={p.heroArt} data-optional>
        <Art stop={page.id} bubble={page.hero.bubble} />
      </div>
    </Screen>
  );
}
