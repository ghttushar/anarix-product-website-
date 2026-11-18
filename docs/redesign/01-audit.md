# 01 · Audit of the current site (2026-11-18, commit 7624c39)

Measured with `scripts/qa/screens.mjs` (headless Edge, every section scrolled to the top of the viewport and left to settle). The raw report and screenshots are in `qa-out/baseline/` (git-ignored).

## 1. Height: the homepage is ~23 screens tall
| Section | 1440×900 | 1920×1080 | 390×844 | Verdict |
|---|---|---|---|---|
| Hero | 1.06 | 1.05 | 1.07 | taller than a screen |
| Mission | 1.00 | 1.00 | 0.80 | fits |
| Facts carousel | 0.69 | 0.57 | 0.64 | content under the nav |
| Film | 1.15 | 0.95 | 1.48 | taller than a screen |
| Signals | 2.81 | 2.44 | 2.66 | content under the island |
| Profitability | 2.75 | 2.39 | 2.60 | |
| Rules | 2.83 | 2.46 | 2.62 | content under the island |
| Aan | 2.75 | 2.40 | 2.49 | |
| MCP | 2.25 | 1.98 | 2.49 | content under the island |
| Night Watch | **4.40** | **4.40** | 3.60 | a 440vh pinned scroll |
| AI for good | 1.18 | 1.00 | 1.22 | content under the island |
| **Total** | **23.6** | **21.2** | **23.1** | 44 failed checks |

## 2. What the owner pointed at, and why it happens
1. **The hero headline runs into the lazy Susan.**
   - "Every marketplace." at its 88px cap is about 778px wide. Its column is 672px, and `white-space: nowrap` stops it wrapping (`components/hero/hero.css:35-39`).
   - It collides with the plate and a sector figure at every width above about 1,400px.
   - The text column and the visual share one grid row with no guaranteed gap.
2. **The mission is strong, but its proof is far away and hidden.**
   - About 350px separates the sentence from the facts.
   - The facts sit in a manual carousel showing 3 of 6. At desktop widths dots 5–6 can never become active.
3. **"Aan's debut" has almost no words.** A heading, one line and a link sit next to a 711px video.
4. **Signals is a data dump.** In DOM order the section stacks:
   - a numbered pill;
   - the headline;
   - a 3-line statement in a 62vh block;
   - three capability rows;
   - the alert card, with 8 distinct pieces of information;
   - a live ticker;
   - an isometric motherboard;
   - a 693px "coming soon" video frame.

   Nothing is clearly first. The card, the ticker and the machine animate at the same time.
5. **Aan docks only at the end of each section.**
   - Aan flies when its dock (inside the machine, at the bottom of the stage) crosses 90% of the viewport height and lands at 55% (`components/aan/AanTraveler.tsx:85-93`).
   - The dock sits about 1,310px into Signals, so the card's whole "fixed it" moment plays out above the viewport.
6. **Wasted width on large screens.**
   - The 1280px container leaves about 326px empty on each side at 1900px.
   - Inner caps (card 520px, machine 480px, lede 27em) shrink the content further.
   - Type stops growing at about 1,500px.
7. **Night Watch and AI for good are buried.**
   - They are the most emotional, most memorable sections, and sit at screens 17–23.
   - The Night Watch costs 4.4 screens of scrolling to see a 13-hour story.
8. **Gaudy motion and illustration.** About 34 keyframe animations, 3 SMIL motion paths, 2 always-on animation loops, random number jitter, glows, a gradient headline and a shine sweep on buttons. Shaded isometric machines decorate rather than explain.

## 3. Technical debt that blocks a clean result
- **CSS:** ten global files, 6,374 lines, loaded on every route.
  - `sections.css` and `hero.css` carry v3–v8 override layers.
  - `premium.css` overrides almost everything.
  - Many selectors and keyframes are dead.
- **Reduced motion:** handled by a global 0.001ms kill. The Night Watch ignores reduced motion entirely.
- **Theme:** a saved light theme flashes dark on load (the theme is applied after hydration).
- **Wiring:** the 90s film route imports the live site components, so changing the site changes the film.
- **Dead code:** `next lint` no longer exists in Next 16; GSAP is used for one number tween.

## 4. Inventory: every current element and where it goes
Nothing is lost silently. Each element is kept, moved, merged or retired on purpose.

| Element today | Fate |
|---|---|
| Lazy Susan hero | **Replaced** by a new hero visual (owner decision). Its job, introducing the five areas, moves to the product screens and the nav. |
| Hub bubble "I'm Aan. The Guardian of your Business!" | **Kept**: Aan's line in the hero. |
| Mission statement | **Kept**, with the proof directly beneath it. |
| Facts carousel (6 cards) | **Merged** into a single ruled proof row: 24/7, $1.2B GMV, 500+ brands, 12.8% TACoS. "3 marketplaces" lives in the hero lede; "Any AI" lives in MCP. |
| Film section | **Moved** to the final screen as "Meet Aan", with real written content and the close. |
| Five feature chapters | **Condensed** into five one-screen product screens. Depth moves to the dedicated pages. |
| Capability rows (3 per area) | **Moved** to the pages (how it works and FAQ). The homepage keeps at most 3 one-line points. |
| Product UI cards | **Kept**, simplified, settling to one calm final state. |
| Live ticker, value jitter, sparkline streaming | **Retired**. |
| Isometric machines | **Retired**, replaced by meaningful line-art drawings. |
| "Coming soon" media slots | **Removed** from the homepage. Real walkthrough videos get a slot on the product pages once they exist. |
| Night Watch diorama | **Rebuilt** as one screen: a 13-second night that plays when it arrives and can be scrubbed. |
| AI for good closing | **Moved up** to screen 4 and given its own screen. |
| CTAs: "Book a demo", "Talk to Aan", the Services link | **Kept** on the final screen. |
| Nav, Ask Aan island, theme toggle, island chat | **Kept**, at parity with the services site. |
| Aan traveler | **Rewritten**: it docks the moment a screen arrives, never on product UI, and works across pages. |
| Footer | **Kept**, with its links pointing to the new pages. |
