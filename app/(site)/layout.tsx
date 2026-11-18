// The marketing site: one night street (City Nocturne). Every page sits on the
// same sky, under the same nav, with one travelling Aan and the Ask Aan island.
import "@/components/aan/aan.css";
import "@/components/chrome/chrome.css";
import { Nav } from "@/components/chrome/Nav";
import { Footer } from "@/components/chrome/Footer";
import { ActionIsland } from "@/components/chrome/ActionIsland";
import { AanProvider } from "@/components/aan/v2/AanProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nocturne">
      <Nav />
      <AanProvider>
        <main>{children}</main>
      </AanProvider>
      <Footer />
      <ActionIsland />
    </div>
  );
}
