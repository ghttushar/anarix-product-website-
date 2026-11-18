import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import "./styles/index.css";

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
  themeColor: "#0e141a",
};

// Runs before first paint: applies a saved theme (no dark flash for visitors
// who chose light) and marks script support, so line drawings only start
// hidden when script is there to draw them.
const boot = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("anarix-theme-v2");if(t==="light"||t==="dark")d.dataset.theme=t;}catch(e){}d.setAttribute("data-js","");})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${fraunces.variable} ${plexMono.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
