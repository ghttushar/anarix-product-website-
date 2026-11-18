// The film route ("Aan's debut", /film/debut) renders the reel frame by frame
// for scripts/film/render.mjs. It needs only Aan's own styles; the stage and
// its scenes bring their own (components/film/debut.css).
import "@/components/aan/aan.css";

export default function FilmLayout({ children }: { children: React.ReactNode }) {
  return children;
}
