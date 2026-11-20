"use client";

import { Screen } from "@/components/layout/Screen";
import { ProductVideo } from "@/components/media/ProductVideo";
import { tour } from "@/content/home";
import t from "./tour.module.css";

/*
  The product tour, right after the promise and its proof. Until the
  recording exists, the frame shows the tour's chapters, so the space reads
  as a contents page rather than an empty player.
*/
function Chapters() {
  return (
    <ol className={t.chapters}>
      {tour.chapters.map((c, i) => (
        <li key={c.id}>
          <span className={t.n}>{String(i + 1).padStart(2, "0")}</span>
          <b>{c.name}</b>
          <span className={t.d}>{c.d}</span>
        </li>
      ))}
    </ol>
  );
}

export function TourScreen() {
  return (
    <Screen id="tour" fit="grow" bodyClassName={`l-container ${t.body}`} label={tour.title}>
      <ProductVideo video={tour.video} title="Anarix product tour" fitRatio={3.4} fallback={<Chapters />} className={t.frame} />
      <header className={t.head}>
        <h2 className="t-h2">{tour.title}</h2>
        <p className="t-statement">{tour.line}</p>
      </header>
    </Screen>
  );
}
