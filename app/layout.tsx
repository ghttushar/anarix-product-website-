import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import "../components/aan/aan.css";
import "../components/aan/traveler.css";
import "../components/chrome/chrome.css";
import "../components/hero/hero.css";
import "../components/sections/sections.css";
import "../components/machines/machines.css";
import "../components/night/night.css";

// Fraunces (display) + Inter (body): the Anarix website design system
const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-fraunces" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Anarix Platform · One AI. Every marketplace. Always on.",
  description:
    "Aan, the AI inside Anarix, watches your Amazon, Walmart and Shopify accounts 24/7: Signals, Profitability, Rules and MCP, so you can sleep through the 11pm check.",
  openGraph: {
    title: "Anarix Platform",
    description: "One AI. Every marketplace. Always on.",
    siteName: "Anarix",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F6FA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${fraunces.variable} ${plexMono.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
