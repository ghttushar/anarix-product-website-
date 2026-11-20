"use client";

import { Screen } from "@/components/layout/Screen";
import { Reveal } from "@/components/motion/Reveal";
import { ProductFrame } from "@/components/visual/ProductFrame";
import { SlackApproval } from "@/components/product-ui/SlackApproval";
import { trust } from "@/content/home";
import h from "./home.module.css";

/*
  Trust, after the products: how far Aan goes, step by step (the permission
  ladder, set as a Swiss list), beside the moment that proves it: a change
  above your limit, held in your team chat until someone says yes.
*/
export function TrustScreen() {
  return (
    <Screen id="trust" fit="grow" bodyClassName={`l-container l-grid ${h.split}`} label={trust.title}>
      <div className={h.copy}>
        <h2 className="t-h2">{trust.title}</h2>
        <p className="t-statement">{trust.line}</p>
        <ol className={h.ladder}>
          {trust.ladder.map((s, i) => (
            <Reveal as="li" key={s.t} order={i + 1}>
              <span className={h.rung} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <b>{s.t}</b>
              <span>{s.d}</span>
            </Reveal>
          ))}
        </ol>
      </div>
      <div className={`${h.visual} ${h.trustArt}`}>
        <ProductFrame title="Slack / # store-ops" note="Sample message" lean="right">
          <SlackApproval bare />
        </ProductFrame>
      </div>
    </Screen>
  );
}
