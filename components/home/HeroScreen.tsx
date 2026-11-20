"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { Screen, useScreen } from "@/components/layout/Screen";
import { AanDock } from "@/components/aan/v2/AanDock";
import { LightTrails } from "@/components/visual/LightTrails";
import { Magnetic } from "@/components/motion/Magnetic";
import { Ticker } from "@/components/motion/Ticker";
import { Reveal } from "@/components/motion/Reveal";
import { hero, proof } from "@/content/home";
import { FilmDialog } from "./FilmDialog";
import { Ink } from "./Ink";
import x from "./hero.module.css";

/*
  1 · The promise, set like a Swiss poster: three lines across the grid, and
  the light of every store streaming in to Aan, who looks at you (its eyes
  follow the cursor). Under it, what Aan is, the two ways in and the three
  approved figures, counted up once.
*/
const FIGURES = [
  { value: 12, format: (n: number) => `$${(n / 10).toFixed(1)}B` },
  { value: 500, format: (n: number) => `${n}+` },
  { value: 128, format: (n: number) => `${(n / 10).toFixed(1)}%` },
];

function Figures() {
  const { arrived } = useScreen();
  return (
    <ul className={x.proof}>
      {proof.items.map((p, i) => (
        <Reveal as="li" key={p.figure} order={i + 4}>
          <b>
            <Ticker value={FIGURES[i].value} from={0} play={arrived} duration={1400} format={FIGURES[i].format} />
          </b>
          <span>{p.text}</span>
        </Reveal>
      ))}
    </ul>
  );
}

export function HeroScreen() {
  const spot = useRef<HTMLSpanElement>(null);
  return (
    <Screen id="top" hasDock fit="grow" className={x.hero} bodyClassName={`l-container ${x.body}`} label="Anarix platform">
      <LightTrails aim={spot} from="right" count={9} bend={1.6} spread={[-0.45, 1.45]} className={x.trails} />
      <span className={x.columns} aria-hidden="true" />

      <p className={x.eyebrow}>
        <span>Anarix platform</span>
        <span className={x.live}>
          <i aria-hidden="true" />
          Watching Amazon, Walmart and Shopify
        </span>
      </p>

      <h1 className={x.title}>
        {hero.title.map((t, i) => (
          <span key={t} className={`${x.line} ${i === 2 ? "t-accent" : ""}`}>
            <span style={{ "--n": i } as CSSProperties}>{t}</span>{" "}
          </span>
        ))}
      </h1>

      <div className={x.aan}>
        <span ref={spot} className={x.focus} aria-hidden="true" />
        <AanDock stop="top" size={64} sizeSm={34} bubble={hero.bubble} side="left" act="idle" track style={{ left: "var(--x)", bottom: "var(--feet)" }} />
        <FilmDialog className={x.film} />
      </div>

      <div className={x.foot}>
        <div className={x.lead}>
          <p className={x.lede}>
            <Ink text={hero.lede} />
          </p>
          <div className="c-actions">
            <Magnetic>
              <a className="c-cta" href={hero.primary.href}>
                {hero.primary.label}
              </a>
            </Magnetic>
            <Link className="c-link" href={hero.secondary.href}>
              {hero.secondary.label}
            </Link>
            {/* on phones the film sits with the actions, clear of the headline */}
            <FilmDialog className={x.filmSm} />
          </div>
        </div>
        <Figures />
      </div>
    </Screen>
  );
}
