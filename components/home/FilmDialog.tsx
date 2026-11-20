"use client";

import { useRef } from "react";
import f from "./film-dialog.module.css";

const BASE = "/platform/film";

/**
 * The hero's play chip: "Aan's debut" opens over the page with sound, the
 * way Apple opens a film from a product page. Esc, the close button or a
 * click outside the film closes it and stops the film.
 */
export function FilmDialog({ length = "0:27", className }: { length?: string; className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  const open = () => {
    dialog.current?.showModal();
    const v = video.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };
  const close = () => dialog.current?.close();
  const stop = () => video.current?.pause();

  return (
    <>
      <button type="button" className={`${f.chip} ${className ?? ""}`} onClick={open}>
        <span className={f.play} aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M5 3.2v9.6l8-4.8z" />
          </svg>
        </span>
        <span>Watch Aan&rsquo;s debut</span>
        <span className={f.len}>{length}</span>
      </button>
      <dialog
        ref={dialog}
        className={f.dialog}
        aria-label="Aan's debut"
        onClose={stop}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <video ref={video} className={f.video} controls playsInline preload="none" poster={`${BASE}/aan-debut-poster.jpg`}>
          <source src={`${BASE}/aan-debut.mp4`} type="video/mp4" />
        </video>
        <button type="button" className={f.close} onClick={close} aria-label="Close the film">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </dialog>
    </>
  );
}
