"use client";

import { useRef, type ReactNode } from "react";
import { Screen } from "@/components/layout/Screen";
import { AanDock } from "@/components/aan/v2/AanDock";
import { LightTrails } from "@/components/visual/LightTrails";
import { ProductFrame } from "@/components/visual/ProductFrame";
import { Magnetic } from "@/components/motion/Magnetic";
import { Ink } from "@/components/home/Ink";
import type { ProductPage } from "@/content/products/types";
import { pageClose } from "@/content/products/pages";
import h from "./name-hero.module.css";

/*
  Every product page opens on its own name, set like a Swiss poster: the
  biggest thing on the page, the slogan under it, one line and one action,
  beside the product itself on a card in the light (the tour plays there once
  it is recorded). Aan stands on the card's edge where the light converges.
  What changes per page is the composition, so no two heroes share a layout:
  - split    (Signals): name left, the card right
  - ledger   (Profitability): name across the top, words left, the card right
  - bleed    (Rules): name and slogan in one row, the card wide beneath
  - portrait (Aan): the card left, name right
  - hub      (MCP): name in the middle, the light of every AI coming in
*/
export type HeroLayout = "split" | "ledger" | "bleed" | "portrait" | "hub";

export function NameHero({
  page,
  layout,
  art,
  aside,
  frame,
  dock = true,
  trails = true,
}: {
  page: ProductPage;
  layout: HeroLayout;
  art: ReactNode;
  aside?: ReactNode;
  /** the card's title (where in the product this is); none for a bare art */
  frame?: string;
  /** Aan stands on the card (off where the art holds Aan's dock itself) */
  dock?: boolean;
  /** the hero's own light trails (off where the page has the energy halo) */
  trails?: boolean;
}) {
  const spot = useRef<HTMLSpanElement>(null);
  const lean = layout === "portrait" ? "right" : layout === "bleed" ? "none" : "left";
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
            <Magnetic>
              <a className="c-cta" href={pageClose.primary.href}>
                {pageClose.primary.label}
              </a>
            </Magnetic>
          </div>
        </div>
        {aside}
      </div>
      <div className={h.art}>
        {frame ? (
          <>
            {trails && <LightTrails aim={dock ? spot : undefined} from={layout === "portrait" ? "left" : "right"} count={10} bend={1.4} className={h.trails} />}
            <ProductFrame title={frame} note={page.video ? "Product tour" : "Sample data"} lean={lean} fit="var(--art-h)">
              {art}
            </ProductFrame>
            {dock && (
              <span ref={spot} className={h.spot}>
                <AanDock stop={page.id} size={30} sizeSm={20} bubble={page.bubble || undefined} side="left" act="look" style={{ left: "50%", bottom: 0 }} />
              </span>
            )}
          </>
        ) : (
          art
        )}
      </div>
    </Screen>
  );
}
