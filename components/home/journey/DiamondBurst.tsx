"use client";

import { forwardRef } from "react";
import { AnarixMark } from "@/components/chrome/Logo";
import { ParticleRing } from "./ParticleRing";
import j from "./journey.module.css";

/*
  The burst: Aan's hollow diamond on the Ask Aan card opens into a hole that
  grows past the edges of the screen, and the page goes through it into the
  dark world inside, where the Anarix mark rises out of the diamond over a
  slow ring of light. The ring scene drives it: --b (0..1) and --r (the
  diamond's half-diagonal in px) are set on the stage; the outline's points
  are written by the scene too.
*/
export const DiamondBurst = forwardRef<SVGPolygonElement, { live: boolean }>(function DiamondBurst({ live }, outline) {
  return (
    <>
      <div className={j.world} aria-hidden="true" data-bleed>
        <ParticleRing live={live} className={j.particles} />
        <div className={j.mark}>
          <AnarixMark height={86} />
        </div>
      </div>
      <svg className={j.outline} aria-hidden="true" data-bleed>
        <polygon ref={outline} points="0,0 0,0 0,0 0,0" />
      </svg>
    </>
  );
});
