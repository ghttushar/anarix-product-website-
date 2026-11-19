"use client";

import type { ReactNode } from "react";
import { Screen } from "@/components/layout/Screen";
import { Ink } from "@/components/home/Ink";
import type { ProductPage } from "@/content/products/types";
import { pageClose } from "@/content/products/pages";
import h from "./name-hero.module.css";

/*
  Every product page opens on its own name: the biggest thing on the page,
  the slogan under it, one line and one action, beside the product-tour
  frame (which shows the page's isometric system until a recording exists).
  What changes per page is the composition, so no two heroes share a layout:
  - split    (Signals): name left, the frame right
  - ledger   (Profitability): name across the top, words left, the frame right
  - bleed    (Rules): name and slogan in one row, the frame wide beneath
  - portrait (Aan): the frame left, name right
  - hub      (MCP): name in the middle, wires coming in from both sides
*/
export type HeroLayout = "split" | "ledger" | "bleed" | "portrait" | "hub";

export function NameHero({ page, layout, art, aside }: { page: ProductPage; layout: HeroLayout; art: ReactNode; aside?: ReactNode }) {
  return (
    <Screen id="top" hasDock className={h.screen} bodyClassName={`${h.body} ${h[layout]}`} label={page.name}>
      <div className={h.text}>
        <h1 className={h.name}>{page.name}</h1>
        <p className={h.slogan}>{page.slogan}</p>
        <div className={h.more}>
          <p className={`t-statement ${h.line}`}>
            <Ink text={page.line} />
          </p>
          <div className="c-actions">
            <a className="c-cta" href={pageClose.primary.href}>
              {pageClose.primary.label}
            </a>
          </div>
        </div>
        {aside}
      </div>
      <div className={h.art}>{art}</div>
    </Screen>
  );
}
