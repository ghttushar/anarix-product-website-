"use client";

import { Screen } from "@/components/layout/Screen";
import { OpenDoor } from "@/components/illustrations/sets/nocturne/OpenDoor";
import { close } from "@/content/home";
import { FilmPlayer } from "./FilmPlayer";
import h from "./home.module.css";

/* 10 · Meet Aan. Who Aan is in plain words, the debut film beside it, and
   the two ways in: a demo, or a question to Aan right now. */
export function CloseScreen() {
  return (
    <Screen id="meet-aan" hasDock bodyClassName={`l-container l-grid ${h.split}`} label="Meet Aan">
      <div className={h.closeCopy}>
        <h2 className="t-h2">{close.title}</h2>
        <p className="t-statement">{close.body}</p>
        <div className="c-actions">
          <a className="c-cta" href={close.primary.href}>
            {close.primary.label}
          </a>
          <button type="button" className="c-link" onClick={() => window.dispatchEvent(new Event("aan:open-chat"))}>
            {close.secondary}
          </button>
        </div>
        <p className={h.services}>
          {close.services.lead} <a href={close.services.href}>{close.services.label}</a>
        </p>
        <div className={h.closeDoor} data-optional>
          <OpenDoor stop="close" bubble={close.bubble} />
        </div>
      </div>
      <div className={h.closeFilm}>
        <FilmPlayer />
      </div>
    </Screen>
  );
}
