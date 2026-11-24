// The marketing site: every page under the same nav, footer and Ask Aan
// island, on Lenis smooth scroll (the GSAP scenes run on its ticker).
import "@/components/aan/aan.css";
import "@/components/chrome/chrome.css";
import "lenis/dist/lenis.css";
import { Nav } from "@/components/chrome/Nav";
import { Footer } from "@/components/chrome/Footer";
import { ActionIsland } from "@/components/chrome/ActionIsland";
import { AanProvider } from "@/components/aan/v2/AanProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nocturne">
      <SmoothScroll />
      <Nav />
      <AanProvider>
        <main>{children}</main>
      </AanProvider>
      <Footer />
      <ActionIsland />
    </div>
  );
}
