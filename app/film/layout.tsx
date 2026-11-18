import "@/components/film/legacy/styles/index.css";

// The film routes render against a frozen copy of the site's original CSS
// (see components/film/legacy), so the site can change without changing them.
export default function FilmLayout({ children }: { children: React.ReactNode }) {
  return children;
}
