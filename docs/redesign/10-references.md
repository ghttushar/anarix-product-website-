# Phase 10 references: AI Studio (homepage) and Relay (Signals)

The owner rejected the Phase 9 homepage and Signals work on 2026-11-24 and asked for a fresh start:
- The scroll was "glitchy and jittery".
- The homepage had become "all about Aan" instead of a mix of every product.
- Signals had no halo "start blast and blur", and its sections did not follow the videos.
- Soft clay goes; the style is minimal, and the current mock UI cards stay.

Two getlayers templates are the references, used for their section design and motion. The content is Anarix's own:
- **AI Studio** (purple) is the homepage. Sources: getlayers.ai/layer/ai-studio, `ai-studio-desktop.mp4` and `ai-studio-mobile.mp4`.
- **Relay** (green) is the Signals page. Sources: getlayers.ai/templates?layer=relay, `relay-4ee0729d77-desktop.mp4` and `relay-4ee0729d77-mobile.mp4`.

The owner's brief for the star: "replace this shape with aan, repurpose the getlayers design for me, use my elements". AI Studio's sparkle and chrome star both become Aan.

Readings come from frames extracted at 4 fps, cropped to the browser area. In the 4320x3080 desktop recordings that area is `crop=2356:1433:972:600`.

## Why Phase 9 jittered, and the rules now

Phase 9 jittered for five reasons:
- React state changed on every scroll frame.
- Layout was read every frame.
- Long `calc()` chains of CSS variables restyled many elements per frame.
- CSS transitions fought the scroll-driven values.
- Native scrolling had no smoothing.

Phase 10 replaces this with GSAP ScrollTrigger timelines (pinned, `scrub: 1`), running on Lenis smooth scroll (`components/motion/SmoothScroll.tsx`). The rules:
- No React state changes per scroll frame.
- Only transforms and opacity move. Clip-path is the exception, used for the hero frame collapse and the Signals panel.
- Layout is measured on refresh only.
- Centring goes through `xPercent`/`yPercent` or the CSS `translate` property, so GSAP owns `transform`.
- WebGL pauses off screen.
- Reduced motion turns Lenis off, and every scene shows its end state.

## AI Studio → the homepage (`components/home/layers/`)

| Reference beat | What it does | Anarix build |
|---|---|---|
| Hero card | A full-bleed gradient card inset 12px from the edges. The headline sits top left on two lines, the second grey. A portrait card is centred. Lede and two buttons bottom left, avatars under them, small text bottom right | `Intro`: "One AI. / Every marketplace." The centred card is the Signals alert (`SignalCard`), and a proof row ($1.2B GMV, 500+ brands, 12.8% TACoS) replaces the avatars |
| Tilt into a ring | On scroll the card tilts away in 3D and collapses into the first tall card of a ring on white. Giant marquee words slide behind it, with "Explore the collection" below | The frame's clip-path closes onto the centre card while the hero tilts (rotationZ/X keyframes). A ring of five cards (Signals, Profitability, Rules, MCP, Ask Aan) turns 72° per step. Marquee: "One AI ◦ Every marketplace ◦ Always on". "Explore the platform" links to `#products` |
| Sparkle burst | The last card's sparkle grows into a star-shaped hole that fills the screen. Inside is a black world with a dense particle sphere | The Ask Aan card's white diamond (Aan's shape) is the window: the outer square scales to fill the screen while the world inside counter-scales. `ParticleSphere`: 22k points in periwinkle, coral and white, which disperse with scroll |
| Manifesto | The sparkle sits at the top, with a paragraph bottom left | The Anarix mark lifts to the top. The paragraph names all five products |
| Gallery | Wide named panels with meta lines, sliding sideways while pinned | `Gallery`: five panels, each with a product UI drifting at its own depth, a big name, an index and a progress glow |
| Converge | Scattered images drift up while a centre card with a chrome star grows | `Finale`: eight fragments of the platform drift up at different depths past the small card. `GlossyAan` (three.js, clearcoat coral) turns inside it |
| Final hero | The card opens into the closing hero, framed in white | "Put Aan on watch tonight." with Schedule a demo, Talk to Aan, the film chip and the services line |

On phones the hero card is shorter (`--ch: min(cw*1.32, 36svh)`) and sits between the title and the lede. Below 740px of height it is hidden.

## Relay → Signals (`components/product-page/pages/SignalsPage.tsx`)

**Colour mapping**:
- Lime used as an action becomes periwinkle `#8a9cf6` with ink text.
- Lime used as a surface becomes a coral → lavender → periwinkle gradient with ink text.
- The green and cyan halo becomes periwinkle with about 18% coral fibres.
- Headlines are Inter 500 with one Fraunces italic word, as in Relay. Labels are Plex Mono.

**The halo** (`components/visual/Halo.tsx`):
- **Structure**: 320 fibres (200 on phones), each a ribbon of quads shaped on the GPU from a five-point spine. On top of the fibres:
  - specks, which turn into bokeh discs out of focus;
  - a white-hot core sprite with an anamorphic streak;
  - UnrealBloom.
- **Start blast**: the core flares (about 2.6×, peaking at 220ms), the fibres grow out of it blurred, and both settle sharp by about 1.5s.
- **Down the page**: each section names a shape with `data-halo`:
  0. the hero arc, pinched to a core left of centre (portrait: along the right edge);
  1. an S-ribbon;
  2. broad and out of focus;
  3. a soft field;
  4. a sharp diagonal;
  5. a horizontal sweep behind the catalog;
  6. drifting off the top.

  The shape eases toward the scroll's key, which is measured on refresh only. The halo also leans toward the pointer.
- **Layering**: the canvas is sticky inside a track as tall as the page, so it never covers the footer.
- **Black**: it clears to true black. A coloured clear gets sRGB-encoded twice inside the bloom chain and lifts the field to grey.

| Relay section | Signals section |
|---|---|
| Hero: "The handoffs run *themselves.*" with a workflow graph and last runs | "3am change. *9am answer.*" The graph runs from Buy Box lost to the undercut, then splits to "Match at $34.89" or "Hold, tell the team". The last signals rotate in from the top |
| App tiles with a moving highlight, "connects to 240 apps" | "watches 78 alert reasons in 12 groups": price, Buy Box, ad eligibility, budget, stock, listings, suppressed, billing, plus 78 reasons |
| "Most of a process is *glue*." | "Most of a bad morning is *finding out*." |
| 01 run card | 01 "One feed, every store": a night as a run, with a marker where the change was found at 03:12 |
| 02 Slack approval, typing first | 02 "Fixed from the alert": Aan types in #store-ops, then the Walmart Buy Box signal with Match price / Hold |
| 03 iso bars | 03 "Every fix is checked": ad sales for the 7 days after the fix as isometric bars |
| Logo tile into a lime panel, line revealed word by word, back to the tile | The Anarix tile opens into the gradient panel: "The best alert is the one *fixed* before you read it." |
| "*Boring* in the ways that matter." | "*Quiet* in the ways that matter.": every store in one feed (hub), and the biggest risk first (bars) |
| "A *Tuesday*, seen from Relay." bento | "A *night*, seen from Signals.": a heatmap of changes, confidence ring, waiting on you, before and after, where it changed |
| Numbers counting up, with quotes | "Counted, *not* estimated.": 79, 12, 7, with facts in place of quotes |
| Pricing slider and three tiers | "Watch every product, not *a sample*.": a catalog slider (products × 78 reasons) and three ways to act (Fix it yourself, Let a rule act, Hand it off). No prices |
| CTA pair, status line, footer | "Pick the alert you *dread* most." The field opens Ask Aan with the Signals questions. A status line follows, then the site's own footer |

Every section's sample data is labelled as sample data.

## Phase 11 revisions (owner notes, 2026-11-25)

**Homepage.** It now covers the whole platform, as six products: Signals, Profitability, Advertising, Rules, MCP and Ask Aan.

- **Hero.** It is full rather than empty:
  - a prominent "AI for good" kicker;
  - real app pieces floating around the centre card;
  - a proof stat strip and a platform index.
- **Hand-off.** It no longer swaps the hero for the ring:
  - the ring's own front card sits under the hero from the start;
  - the floating pieces fly into the card;
  - the side cards rise in from depth.
- **Inside Aan.** The world says "AI for good. Built to earn your trust." and gives three principles.
- **Gallery.** The panels tell each product's story beside a piece of its UI.
- **Close.** It uses the flat Aan; the glossy three.js Aan is gone.
- **Logo.** The mark's viewBox was 559 wide and cropped the blue peak; it is now 607.

**Signals.** It is told by the product itself. One alert's story runs from catch to a verified fix:

| Step | Elements |
|---|---|
| Catch, value and rank | AlertRow |
| Explain | Aan's analysis and the affected items |
| Fix | the item picker and a partial batch with undo |
| Verify | the 7-day impact report |

The page also carries:
- a product-tour placeholder;
- the 8 categories (78 reasons in 12 groups);
- sources and hand-off;
- the morning Brief;
- meetings and tasks;
- 66 action types.

Aan replaces the Anarix mark. Past the hero the halo is out of focus, dimmer, and sits behind a scrim.

**Theme.** Three layers:

| Layer | Behaviour |
|---|---|
| Page ground | Follows the theme |
| Brand stages | Gradients, the world inside Aan and Signals' black stay one colour |
| Product mockups | The app's own light or dark UI, through the `--app-*` tokens |

`ChromeTone` switches the nav and island to their dark dress over a dark stage in light theme.
