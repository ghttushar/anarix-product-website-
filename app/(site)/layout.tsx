// The marketing site. Until the Phase 2 swap it still loads the legacy styles
// the current homepage is built on; new screens use app/styles + CSS modules.
import "../styles/legacy-globals.css";
import "@/components/aan/aan.css";
import "@/components/aan/traveler.css";
import "@/components/chrome/chrome.css";
import "@/components/hero/hero.css";
import "@/components/sections/sections.css";
import "@/components/machines/machines.css";
import "@/components/night/night.css";
import "@/components/readability.css";
import "@/components/premium.css";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
