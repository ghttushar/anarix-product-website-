import type { Metadata } from "next";
import { Film } from "@/components/film/Film";
import "@/components/film/film.css";

// Unlisted render route for "Ninety seconds with Aan". The MP4s are rendered
// from here frame by frame (scripts/render-film.mjs); ?play=1 previews live.
export const metadata: Metadata = {
  title: "Ninety seconds with Aan",
  robots: { index: false, follow: false },
};

export default function FilmPage() {
  return <Film />;
}
