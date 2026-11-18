import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/chrome/Nav";
import { ActionIsland } from "@/components/chrome/ActionIsland";
import { LabHero, LabSignals } from "@/components/lab/LabScreens";
import labStyles from "@/components/lab/lab.module.css";

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
      <main className={labStyles.world}>
        <LabHero />
        <LabSignals />
      </main>
      <ActionIsland />
    </>
  );
}
