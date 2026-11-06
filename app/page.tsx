import { Nav } from "@/components/chrome/Nav";
import { ActionIsland } from "@/components/chrome/ActionIsland";
import { AanTraveler } from "@/components/aan/AanTraveler";
import { LazySusan } from "@/components/hero/LazySusan";
import { Hl, MediaSlot, Reveal } from "@/components/sections/shared";
import { FactCarousel } from "@/components/sections/FactCarousel";
import { AanSection, ProfitSection, RulesSection, SignalsSection } from "@/components/sections/Features";
import { McpSection } from "@/components/sections/McpSection";
import { NightWatch } from "@/components/night/NightWatch";
import { ClosingSection, Footer } from "@/components/sections/Closing";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        {/* 1. Hero: one statement + the lazy Susan (also the homepage jump bar) */}
        <section className="hero" data-stop="hero">
          <div className="container hero__grid">
            <div className="hero__copy">
              <h1 className="display h1 hero__title">
                <span>One AI.</span>
                <span>Every marketplace.</span>
                <span className="text-gradient">Always on.</span>
              </h1>
              <p className="lede hero__lede">
                Aan watches your Amazon, Walmart and Shopify accounts <Hl>around the clock</Hl>, and acts before it costs you.
              </p>
              <div className="hero__ctas">
                <a className="btn btn--primary" href="https://www.anarix.ai/contact-us">
                  Book a demo
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
                <a className="hero__link" href="#aan">
                  Meet Aan →
                </a>
              </div>
            </div>
            <LazySusan />
          </div>
        </section>

        {/* 2. Mission line: one sentence, one screen */}
        <section className="mission" aria-label="Our mission">
          <div className="container">
            <Reveal>
              <p className="mission__text display">
                We are building the guardian every seller deserves.{" "}
                <Hl>An AI that never sleeps, never misses a change, and never stops working for your business.</Hl>
              </p>
            </Reveal>
          </div>
        </section>

        {/* 3. Anarix in numbers */}
        <FactCarousel />

        {/* product film slot */}
        <section className="film" aria-label="Product film">
          <div className="container">
            <Reveal className="film__head">
              <h2 className="display h2">Ninety seconds with Aan.</h2>
              <p className="lede">
                One account, one day, <Hl>every decision Aan made and why</Hl>.
              </p>
            </Reveal>
            <Reveal>
              <MediaSlot kind="video" label="Platform overview film · 90s" ratio="16 / 9" />
            </Reveal>
          </div>
        </section>

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
