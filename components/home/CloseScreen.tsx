"use client";

import { useRef } from "react";
import { Screen } from "@/components/layout/Screen";
import { AanDock } from "@/components/aan/v2/AanDock";
import { LightTrails } from "@/components/visual/LightTrails";
import { Magnetic } from "@/components/motion/Magnetic";
import { close } from "@/content/home";
import { FilmPlayer } from "./FilmPlayer";
import h from "./home.module.css";

/* 10 · Meet Aan. Who Aan is in plain words, the debut film beside it (the
   light runs into it and so does Aan), and the two ways in: a demo, or a
   question to Aan now. */
export function CloseScreen() {
  const film = useRef<HTMLDivElement>(null);
  return (
    <Screen id="meet-aan" hasDock bodyClassName={`l-container l-grid ${h.split}`} label="Meet Aan">
      <div className={h.closeCopy}>
        <h2 className="t-h2">{close.title}</h2>
        <p className="t-statement">{close.body}</p>
        <div className="c-actions">
          <Magnetic>
            <a className="c-cta" href={close.primary.href}>
              {close.primary.label}
            </a>
          </Magnetic>
          <button type="button" className="c-link" onClick={() => window.dispatchEvent(new Event("aan:open-chat"))}>
            {close.secondary}
          </button>
        </div>
        <p className={h.services}>
          {close.services.lead} <a href={close.services.href}>{close.services.label}</a>
        </p>
      </div>
      <div ref={film} className={`${h.closeFilm} ${h.visual}`}>
        <LightTrails aim={film} from="both" count={10} bend={1.3} className={h.trails} />
        <FilmPlayer />
        {/* Aan goes into its own film: it lands behind the player */}
        <AanDock stop="close" size={44} tuck act="hop" style={{ left: "50%", bottom: "45%" }} />
      </div>
    </Screen>
  );
}
