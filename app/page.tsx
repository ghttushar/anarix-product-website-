import { Nav } from "@/components/chrome/Nav";
import { ActionIsland } from "@/components/chrome/ActionIsland";
import { AanTraveler } from "@/components/aan/AanTraveler";
import { LazySusan } from "@/components/hero/LazySusan";
import { MediaSlot } from "@/components/sections/shared";
import { AanSection, ProfitSection, RulesSection, SignalsSection } from "@/components/sections/Features";
import { McpSection } from "@/components/sections/McpSection";
import { NightWatch } from "@/components/night/NightWatch";
import { ClosingSection, Footer } from "@/components/sections/Closing";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        {/* 1. Hero: the lazy Susan (also the homepage jump bar) */}
        <section className="hero" data-stop="hero">
          <div className="container hero__grid">
            <div className="hero__copy">
              <p className="eyebrow">Anarix Platform · Powered by Aan</p>
              <h1 className="display h1 hero__title">
                <span>One AI.</span>
                <span>Every marketplace.</span>
                <span className="is-accent">Always on.</span>
              </h1>
              <p className="lede hero__lede">
                Aan watches your Amazon, Walmart and Shopify accounts 24/7, and acts before it costs you.
              </p>
              <div className="hero__ctas">
                <a className="btn btn--primary" href="https://www.anarix.ai/contact-us">
                  Book a demo
                </a>
                <a className="btn btn--secondary" href="#aan">
                  Meet Aan
                </a>
              </div>
              <p className="hero__meta">
                <span>Signals</span>
                <span>Profitability</span>
                <span>Rules</span>
                <span>MCP</span>
              </p>
            </div>
            <LazySusan />
          </div>
        </section>

        {/* product film slot */}
        <div className="film">
          <div className="container">
            <div className="film__head">
              <div>
                <p className="eyebrow">See it work</p>
                <h2 className="display h2">Ninety seconds with Aan.</h2>
              </div>
              <p className="lede">One account, one day, every decision Aan made and why.</p>
            </div>
            <MediaSlot kind="video" label="Platform overview film · 90s" ratio="16 / 9" />
          </div>
        </div>

        {/* 3–6. Aan travels and docks: each section powers up */}
        <SignalsSection />
        <ProfitSection />
        <RulesSection />
        <AanSection />

        {/* 7. MCP: the spindle under the lazy Susan */}
        <McpSection />

        {/* 8. The Night Watch */}
        <NightWatch />

        {/* 9. AI for good */}
        <ClosingSection />
      </main>
      <Footer />

      <AanTraveler />
      <ActionIsland />
    </>
  );
}
