import type { Metadata } from "next";
import { Bodoni_Moda } from "next/font/google";
import { Debut } from "@/components/film/Debut";
import "@/components/film/debut.css";

// Film-only display face: the trend's tall Didone stamps.
const didone = Bodoni_Moda({ subsets: ["latin"], weight: ["500"], variable: "--font-didone", display: "block" });

// Unlisted render route for "Aan's debut" (scripts/film/render.mjs).
export const metadata: Metadata = {
  title: "Aan's debut",
  robots: { index: false, follow: false },
};

export default function DebutPage() {
  return (
    <div className={didone.variable}>
      <Debut />
    </div>
  );
}
