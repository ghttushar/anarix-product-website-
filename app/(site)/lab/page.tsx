import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/chrome/Nav";
import { ActionIsland } from "@/components/chrome/ActionIsland";
import { AanProvider } from "@/components/aan/v2/AanProvider";
import { LabHero, LabSignals } from "@/components/lab/LabScreens";

// Unlisted prototype surface for the redesign (City Nocturne). Visible on
// local dev and Vercel previews, never in production.
export const metadata: Metadata = {
  title: "Lab · Anarix Platform",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return (
    <>
      <Nav />
      <main className="nocturne">
        <AanProvider>
          <LabHero />
          <LabSignals />
        </AanProvider>
      </main>
      <ActionIsland />
    </>
  );
}
