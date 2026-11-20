---
name: Anarix Platform
description: Swiss type on a slate night, long-exposure light converging on Aan (the island's mascot, no limbs), and the real product on cards that turn toward you.
colors:
  periwinkle-solid: "hsl(230 65% 57%)"
  periwinkle-solid-hover-night: "hsl(230 65% 52%)"
  periwinkle-night: "hsl(230 75% 72%)"
  periwinkle-day: "hsl(230 65% 50%)"
  lit-night: "hsl(230 70% 65% / 0.5)"
  lit-day: "hsl(230 65% 57% / 0.22)"
  on-accent: "#fff"
  aan-coral: "#f46d76"
  risk-ink-night: "hsl(355 84% 74%)"
  risk-ink-day: "hsl(355 70% 50%)"
  sky-night: "#0e151b"
  ink-night: "hsl(228 20% 94%)"
  ink-2-night: "#8d97a5"
  rule-night: "#222e39"
  card-night: "#141c24"
  card-line-night: "#222e39"
  bubble-bg-night: "hsl(228 25% 97%)"
  bubble-ink-night: "hsl(228 40% 14%)"
  sky-day: "hsl(230 60% 97%)"
  ink-day: "hsl(209 22% 14%)"
  ink-2-day: "hsl(215 16% 38%)"
  rule-day: "hsl(228 22% 86%)"
  card-day: "#fff"
  card-line-day: "hsl(228 22% 88%)"
  bubble-bg-day: "hsl(209 22% 14%)"
  bubble-ink-day: "#fff"
  video-ground: "hsl(228 50% 6%)"
  film-stamp-red: "#e3121b"
  chrome-card-day: "hsl(0 0% 100%)"
  chrome-card-night: "hsl(209 28% 11%)"
  chrome-fg-day: "hsl(209 22% 14%)"
  chrome-fg-night: "hsl(228 20% 94%)"
  chrome-muted-fg-day: "hsl(215 14% 42%)"
  chrome-muted-fg-night: "hsl(215 12% 60%)"
  chrome-border-day: "hsl(228 20% 90%)"
  chrome-border-night: "hsl(209 25% 18%)"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, min(7.6vw, 13svh), 7.5rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.05em"
  display-name:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(4rem, min(10vw, 17svh), 10rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.055em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2rem, min(4.2vw, 7svh), 4rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  slogan:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, min(2.4vw, 4.2svh), 2.25rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  figure:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, min(2.6vw, 4.6svh), 2.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
    fontFeature: "\"tnum\""
  editorial:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  statement:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, min(1.4vw, 2.5svh), 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  point-title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  cta:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  bubble:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.3
  ui-label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
  index:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.06em"
  frame-note:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.02em"
rounded:
  hairline: "2px"
  bar: "4px"
  control: "10px"
  bubble: "14px"
  frame: "16px"
  card: "20px"
  pill: "999px"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "24px"
  s-6: "32px"
  s-7: "48px"
  s-8: "64px"
  s-9: "96px"
  gap-s: "clamp(12px, 2svh, 20px)"
  gap-m: "clamp(16px, 3svh, 32px)"
  gap-l: "clamp(24px, 5svh, 56px)"
  inset-top: "84px"
  inset-bottom: "90px"
  measure: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.periwinkle-solid}"
    textColor: "{colors.on-accent}"
    typography: "{typography.cta}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.periwinkle-solid-hover-night}"
    textColor: "{colors.on-accent}"
  link-secondary:
    textColor: "{colors.ink-night}"
    typography: "{typography.cta}"
    height: "44px"
  link-secondary-hover:
    textColor: "{colors.periwinkle-night}"
  product-frame:
    backgroundColor: "{colors.card-night}"
    textColor: "{colors.ink-night}"
    rounded: "{rounded.frame}"
    padding: "18px"
  product-frame-note:
    textColor: "{colors.ink-2-night}"
    typography: "{typography.frame-note}"
    rounded: "{rounded.pill}"
    padding: "4px 7px"
  product-ui-card:
    backgroundColor: "{colors.card-night}"
    textColor: "{colors.ink-night}"
    rounded: "{rounded.card}"
    padding: "clamp(16px, 2.4svh, 22px)"
  ui-pill:
    textColor: "{colors.ink-night}"
    typography: "{typography.ui-label}"
    rounded: "{rounded.pill}"
    padding: "3px 9px"
  aan-bubble:
    backgroundColor: "{colors.bubble-bg-night}"
    textColor: "{colors.bubble-ink-night}"
    typography: "{typography.bubble}"
    rounded: "{rounded.bubble}"
    padding: "8px 14px"
  nav-scrolled:
    backgroundColor: "{colors.chrome-card-day}"
    textColor: "{colors.chrome-muted-fg-day}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
---

# Design System: Anarix Platform

## Overview

**Creative North Star: "The Long Exposure"**

The platform site is a Swiss poster shot at night with the shutter open. Headlines are heavy Inter set tight on a 12-column grid you can see; everything that moves leaves light behind it. The one ambient motif is the long-exposure light trail: thin periwinkle streaks that come in from the screen edges, bend late and converge on whatever matters on that screen (Aan in the hero, the stage in the night story, the film at the close, the product card in each product hero). Where a screen carries risk, exactly one of those trails runs coral.

The proof is the product. Every visual that is not light or Aan is real Anarix UI (Signals, the profit waterfall, a rule being built, an Aan answer, a Slack approval, an MCP session) on a card that stands slightly turned in space and catches a light that follows the cursor. Every number in that UI is labelled as sample data in the card's own top bar. Aan, the coral diamond from the Ask Aan island, is the only warm object on any screen; it has no arms or legs and acts through motion alone.

Density is one idea per viewport. Copy is short, grey, and lets its key phrases step up to full ink. Motion has one arrival curve, settles once, and always has a designed reduced-motion state that shows the end of the story. Rejected and gone: the City Nocturne line-art scenes and the soft isometric "circuit" drawings. Neither returns on site pages.

**Key Characteristics:**
- Inter 800 headlines at -0.04em to -0.055em tracking, on a visible 12-column grid in the hero.
- IBM Plex Mono for indexes, clocks, figures and the honest labels; Fraunces only for editorial moments (the morning brief, Aan's letter).
- Long-exposure light trails as the single ambient motif, one coral trail for risk.
- Real product UI on tilted ProductFrame cards with a cursor spotlight and a floor glow.
- One travelling, limbless Aan per page (the island's mascot), landing on two or three stops at most.
- One arrival easing (`cubic-bezier(0.16, 1, 0.3, 1)`), blur-rise reveals, magnetic primary CTAs, number tickers and one Apple-style pinned story.
- Night by default, day by theme toggle; only periwinkle (230) and coral (355) carry hue.

## Colors

Slate night with one cool light and one warm creature: periwinkle is light, data and what Aan handled; coral is Aan or what is going wrong. Every live role is set inside the `.nocturne` scope, with day values under `html[data-theme="light"] .nocturne`.

### Primary
- **Working Periwinkle** (`periwinkle-solid`, `--accent-solid`): the fill of the one primary CTA and solid UI buttons, in both themes. Deepens to `periwinkle-solid-hover-night` on hover.
- **Handled Periwinkle** (`periwinkle-night` / `periwinkle-day`, `--accent`): the light itself. Light-trail strokes and pools, the CTA focus ring, link hover, the third hero line, index numerals, handled states in product UI and the gliding Aan's tail. Day drops it to 50% lightness to hold contrast on pale sky.
- **Lit** (`lit-night` / `lit-day`, `--lit`): a translucent periwinkle wash for glows (night story dawn, floor glows).

### Secondary
- **Aan Coral** (`aan-coral`, `--risk`): Aan's body, the one risk trail, and risk marks in product UI (cost bars, alert dots). Aan's body is the product mascot's coral (`#f46d76`, with `#f88a93` and `#f05e6a` in its gradient); those belong to the mascot and are not tokens.
- **Risk Ink** (`risk-ink-night` / `risk-ink-day`, `--risk-ink`): coral as text, for costs and losses in UI figures.

### Tertiary
- **Film Stamp Red** (`film-stamp-red`): the stamped words of the "Aan's debut" film, on its route only.

### Neutral
- **Sky** (`sky-night` / `sky-day`, `--sky`): the page ground; the body behind `.nocturne` matches it so overscroll never flashes.
- **Ink** and **Ink 2** (`ink-*`, `ink-2-*`): headlines and key phrases in Ink; statements, captions, notes and mono indexes in Ink 2.
- **Rule** (`rule-*`, `--rule`): the 1px hairline that groups ruled lists, proof figures, the permission ladder and the hero's top index bar.
- **Card** and **Card Line** (`card-*`, `card-line-*`): the ProductFrame and product UI surface and its 1px border.
- **Bubble** (`bubble-bg-*`, `bubble-ink-*`): Aan's speech bubble, inverted against the theme (pale on night, ink on day).
- **Video Ground** (`video-ground`): the near-black behind the film player and product video.
- **Chrome** (`chrome-*`, the `--c-*` set): the nav and Ask Aan island only, ported from www.anarix.ai and switched by `data-nav` / `data-island` / `data-theme`.

### Named Rules
**The No Green Rule.** Positive is periwinkle, negative is coral, in every card, chart and theme. No hue between roughly 60 and 180 enters the site.

**The Coral Is Aan's Rule.** Coral is Aan, or it is something going wrong. It is never a button, a heading, a link or decoration, and Aan stays the warmest, most saturated object on any screen.

**The One Risk Trail Rule.** A set of light trails is all periwinkle, except that a screen about a risk may run exactly one trail coral (`risk` index on `LightTrails`), and only while that risk is live.

**The One Scope Rule.** Colours come from the `.nocturne` roles (`--sky`, `--ink`, `--ink-2`, `--accent`, `--accent-solid`, `--risk`, `--risk-ink`, `--rule`, `--card`, `--card-line`, `--bubble-*`). Theme is the whole page at a different hour; no section re-scopes itself into the other theme.

## Typography

**Display Font:** Inter (with system-ui, sans-serif), via `--font-display`
**Body Font:** Inter, via `--font-body`
**Label/Mono Font:** IBM Plex Mono (with ui-monospace), via `--font-mono`
**Editorial Font:** Fraunces (with Georgia, serif), via `--font-editorial`

**Character:** Swiss and heavy. Inter 800 with negative tracking does the shouting in short stacked lines; Plex Mono does the counting and indexing in small uppercase; Fraunces appears only where a piece of writing should feel written.

### Hierarchy
- **Display** (Inter 800, `clamp(2.75rem, min(7.6vw, 13svh), 7.5rem)`, 0.92, -0.05em): the homepage hero, three lines across the full grid, the third in Handled Periwinkle. Each line rises out of its own clip (`translateY(104%)`, 1.1s, 110ms apart).
- **Display Name** (Inter 800, 0.9, -0.055em): a product's own name in its hero, the largest type on its page. Its size is set per hero layout, from `clamp(3.5rem, min(9vw, 13svh), 9rem)` up to `clamp(5rem, min(14vw, 24svh), 15rem)`.
- **Headline** (Inter 800, `--fs-h2`, 0.98, -0.04em, balanced): every screen heading (`.t-h2`).
- **Slogan** (Inter 600, `clamp(1.375rem, min(2.4vw, 4.2svh), 2.25rem)`, 1.1, -0.015em, Ink 2): the line under a product name.
- **Figure** (Inter 800, `clamp(1.75rem, min(2.6vw, 4.6svh), 2.5rem)`, 1, -0.04em, tabular): proof figures in a ruled row; the night story's clock uses the same face much larger.
- **Editorial** (Fraunces 400, 1.5rem, 1.1, -0.01em): the 7 AM morning brief title in the night story and the letter on the Aan page. Nowhere else.
- **Statement** (Inter 400, `--fs-statement`, 1.5, max 42 to 44ch, Ink 2): the paragraph under a headline (`.t-statement`), key phrases in `<b>` at 500 and full Ink.
- **Point title / text** (Inter 600 15px / 400 14px, 1.45, Ink 2): ruled points. Descriptions hide below 800px of viewport height.
- **Index** (Plex Mono 500, 0.75rem, 0.06em, uppercase, Ink 2): sequence numerals such as product screens "01" to "05" (in Handled Periwinkle), ladder rungs "01" to "04", the night story's time rail.
- **Frame note** (Plex Mono 500, 0.6875rem, 0.02em): the honest label in each ProductFrame's top-right pill.

### Named Rules
**The Heavy And Tight Rule.** Headlines are Inter 800 between -0.04em and -0.055em, line-height under 1, fluid by both width and height (`min(vw, svh)`). Type shrinks on short screens before a screen is allowed to grow.

**The Grey Prose, Ink Phrase Rule.** Statements are Ink 2; only the phrases that carry the argument switch to full Ink at 500. Emphasis is contrast, not colour or size.

**The Fraunces Is A Letter Rule.** Fraunces is for writing that reads as written by someone (the morning brief, Aan's letter). It never sets a headline, a figure or UI.

**The Mono Counts Rule.** Plex Mono sets numbers that count, time or order something, and the sample-data notes. Every figure that changes uses tabular numerals.

## Layout

One idea, one screen. A `Screen` is a grid of three rows: `--inset-top` (84px) for the nav, the content (`--content-h`), and `--inset-bottom` (90px) for the island. `fit="screen"` holds exactly one viewport; `fit="grow"` (the hero, product screens, trust, information sections on product pages) starts at one viewport and may run taller when the information needs it. Below 620px of viewport height any screen may grow rather than clip. Off-view screens pause every animation inside them.

Content sits in `.l-container`, `min(1280px, 100% - 48px)` (32px gutter below 400px), on `.l-grid`: 12 columns with a 24px gap. The hero draws that grid as faint 1px columns (`--gl`, periwinkle at 5.5% night, 7% day) that fade out toward the foot, sets its headline across all 12, docks Aan in columns 9 to 12, puts the lede in columns 1 to 6 and the three proof figures in 8 to 12. Product screens alternate a 5fr / 7fr split, copy then card and card then copy, so the sequence reads as a rhythm; they collapse to one column at 900px.

Spacing is a 4px scale (`--s-1` 4px to `--s-9` 96px) plus three height-aware gaps (`--gap-s`, `--gap-m`, `--gap-l`) that tighten on short screens first. Breakpoints in use: 1100px (proof row drops below the lede), 900px (splits stack), 760px (cards go flat), 640px (Aan uses its small dock size), 400px; heights 800px, 760px and 620px.

The night story is the one pinned story on the homepage (`StoryScroll`): a tall track at 62svh per chapter with a sticky one-viewport panel, the progress in `--p`, chapter buttons that scroll to a chapter's middle, and the travelling Aan handing over to the story's own Aan.

### Named Rules
**The One Viewport Rule.** Above 620px of height, a `fit="screen"` section never grows past one viewport; cut copy or hide optional detail instead. QA is `scripts/qa/screens.mjs` at 1280x720, 1366x768, 1440x900, 1920x1080 and 390x844, which scrolls each screen to the top, checks it with `fit-check.js`, and checks a pinned story at each chapter.

**The Ruled, Not Boxed Rule.** Group with space first and a 1px Rule hairline second (`.c-points`, proof figures, the permission ladder, the hero index bar). Only product UI, the film and video frames are boxed, and nothing is a card inside a card.

## Elevation & Depth

Depth is light, not material. The ground is flat Sky; the only things standing off it are ProductFrame cards, which sit in perspective (1600px, origin 50% 30%) with a base tilt of `rotateY(-4deg) rotateX(2deg)` (mirrored for `lean="right"`, `rotateX(3deg)` only for `lean="none"`), and a pointer that adds up to 2.5deg more. Beneath each card is an oval periwinkle floor glow; above its UI, a 420px cursor spotlight and a 260px glow on the border it catches. The light trails' meeting point holds a soft periwinkle pool. On phones and touch the cards go flat and the spotlight is removed.

### Shadow Vocabulary
- **Frame drop** (`0 1px 0 hsl(0 0% 100% / 0.06) inset, 0 50px 90px -40px rgb(0 0 0 / 0.65), 0 18px 36px -24px rgb(0 0 0 / 0.5)`): ProductFrame at night. Day uses `0 50px 80px -40px hsl(230 40% 30% / 0.35), 0 18px 36px -24px hsl(230 40% 30% / 0.25)`.
- **UI card drop** (`0 24px 48px -32px hsl(228 60% 4% / 0.7)`): a product UI card shown without a frame.
- **Bubble** (`0 8px 20px -12px hsl(228 50% 4% / 0.6)`): Aan's speech bubble.
- **Chrome soft / medium / strong** (`--c-shadow-*`): nav and island only.

### Named Rules
**The Light Is The Depth Rule.** Lift comes from trails, pools, floor glows and the cursor spotlight, all periwinkle. Nothing gets a hover lift, a hard shadow or a glossy gradient. The one light sweep is the primary CTA's streak, because a light crossing the button is the long exposure in miniature.

## Shapes

Soft rectangles and pills. Product UI cards round at 20px, ProductFrame at 16px, Aan's bubble at 14px with the corner nearest Aan cut to 4px, buttons inside UI at 10px, chart bars at 4px top / 2px bottom, and every CTA, pill, chip and frame note is a full pill (999px). Borders are 1px hairlines in Card Line or Rule. Aan is the one organic form: a 45deg diamond with a corner radius of 17% of its size, which morphs into a cube (thinking) and a bar (working).

## Components

### Buttons
Quiet and solid: one filled pill per screen, everything else is a link.
- **Shape:** full pill (999px), at least 48px tall, 24px side padding, Inter 600 15px.
- **Primary (`.c-cta`):** white on Working Periwinkle, wrapped in `<Magnetic>` so it leans toward the pointer (strength 0.25, 14px live margin, 300ms spring back). On hover the fill deepens (160ms) and a 40%-wide white streak at 38% crosses it (700ms on the arrive curve). Press scales to 0.97.
- **Secondary (`.c-link`):** Ink text, 44px target, 1px underline at 40% ink offset 6px, an optional 16px stroked arrow. Hover turns text and underline Handled Periwinkle.
- **Focus:** 2px Handled Periwinkle outline at 4px offset.

### Ruled points and ladders
The default list: rows split by 1px Rule hairlines, a 15px/600 title and a 14px Ink 2 line, never a row of boxes. The trust ladder prefixes each rung with a mono "01" to "04" index. Proof figures are three Figure-type numbers under hairlines, counted up once by `Ticker`.

### ProductFrame (signature)
Real product UI in space. A Card surface, 16px radius, 1px Card Line border, the frame drop shadow and the perspective tilt above. Its top bar (10px 16px, 12px Inter 500, Ink 2) shows a breadcrumb of where in the product this is ("Anarix / Signals / Today") and, at the right, the frame note in a mono pill: "Sample data", "Sample rule", "Sample conversation", "Sample message", "Sample night", "Illustrative" or "Product tour". The body pads 18px (12px on phones) and can scale UI down, never up, to a height (`fit`). The card rises once from `translateY(56px) rotateX(24deg)` over 1100ms when 15% is in view; hover adds the cursor tilt and spotlight. Product UI inside a frame runs in its `bare` mode (`RankedList`, `SignalCard`, `SlackApproval`, `McpTerminal`), dropping its own card, title bar and caption so the frame is the only chrome.

### Product UI cards
Modelled on the product (anarix-insight-engine): Card surface, 20px radius, 1px Card Line, padding `clamp(16px, 2.4svh, 22px)`, outlined 12px/600 pills, 12px Ink 2 metadata, tabular figures. Each settles once into `data-state="handled"`, its border mixing 45% toward periwinkle. New in this phase: `ProfitWaterfall` (one day's sales stepping down cost by cost to profit; each cost is a switch and the profit rolls with `Ticker`; cost bars coral, profit bar periwinkle) and `RuleCard` ("You say" sentence, "Aan builds" When / If / Then parts appearing in turn, the conflict check, the first logged decision). UI is `aria-hidden`; the copy beside it carries the meaning.

### LightTrails (signature)
An SVG (`viewBox 0 0 1000 600`, stretched, non-scaling strokes) behind a screen's content that never takes a click. 7 to 10 trails start off the edge (`from` left, right or both), take a long flat approach and bend late into the target, which is either a percentage point or a live element (`aim`). Each trail is a 1.6px core (1.8px for the risk trail) over an 8px bloom at 16% (8% in day), with a gradient that fades in from the edge. On first view the strokes draw on (core 1.8s, bloom 2.2s, 70ms apart) and the pool fades in; while on screen the core breathes to 62% opacity over 7s and a short bright pulse runs down one trail at a time every 9s. Reduced motion shows them drawn and still.

### Aan acting (signature)
Aan looks exactly as it does in the Ask Aan island: `AanClay` renders the product's own `AanMascot` (coral body, sheen, inner ring, no aura or ground shadow) and carries the act as motion on a wrapper, with the mascot's own idle float switched off. The mascot blinks on its own; with `track` (the hero only) its eyes follow the pointer as the island's do, otherwise the act sets a fixed gaze. It acts only through motion and shape:
- **idle:** breathes (3.2s, rises 4% and squashes 2%). **look:** the eyes lead. **hop:** squash, stretch, land (700ms spring). **glide:** leans 8deg into travel with a periwinkle tail behind it. **point:** leans toward the target; the caller draws the beam. **press:** lands and squashes on a button (520ms). **think:** the mascot's cube (spins, swirl inside). **work:** the mascot's bar with its coral fill. **celebrate:** one spin and a periwinkle ring, once per page.

The same `AanMascot` (ported from the product, state as shape) is used directly at small sizes: the Ask Aan island, chat avatars, the speaker beside an answer in product UI. One Aan, one look, at every size.

### Travelling Aan and stops
`AanProvider` holds one Aan per page, drawn at twice its dock size. Screens reserve `AanDock` slots; Aan lands at the dock of whichever screen crosses the middle of the viewport, gliding 450 to 700ms on the travel curve with its light tail (far jumps fade in from just off screen). Each dock names its act, its bubble side and an optional `tuck` (Aan lands behind the film at the close, with no bubble). A pinned story docks with `hand`: Aan lands, the story's own Aan (`AanClay`) takes over inside the sticky panel, and on leaving the traveller takes off from wherever that Aan now stands. Reduced motion swaps the flight for a 200ms fade. Stops in the build: homepage `top`, `night` (hand) and `close` (tuck); each product page's hero card, and on MCP also `tools`.

### Aan bubble
Inverted Bubble colours, 8px 14px, 14px radius with the corner toward Aan cut to 4px, Inter 600 13px, one line on desktop (wraps at 220px or 44vw on phones). It fades in once Aan has landed and opens away from what Aan is watching.

### Navigation and Ask Aan island
Both are 1:1 ports of www.anarix.ai and must track it, not this document. The nav is transparent with no shadow until the page scrolls, then a chrome card pill at 80% with a 12px backdrop blur. The island is a fixed chrome pill carrying the "Ask Aan" button with a small flat Aan, the theme toggle and a chat panel.

### Film player
The homepage close holds a 9:16 player (20px radius, Video Ground) with a pale "Watch with sound" pill; light trails converge on it and Aan tucks in behind it. It plays muted only when in view and never autoplays under reduced motion. The film it plays, "Aan's debut", is still the earlier line-art cut with the flat mascot; a re-cut in the Phase 8 language is pending, so its look is not a reference for site pages.

### Motion
One arrival curve: `--ease-arrive` `cubic-bezier(0.16, 1, 0.3, 1)` for everything that arrives or settles; `--ease-travel` `cubic-bezier(0.65, 0, 0.35, 1)` for Aan's flights and trail pulses; `--ease-spring` `cubic-bezier(0.34, 1.56, 0.64, 1)` for Aan's acts. Durations: micro 160ms, UI 320ms, reveal 700ms, flight 600ms, stagger 90ms. `Reveal` is the blur-rise: from opacity 0, 16px down and 4px blur, in reading order, and only when script is running, so content is never hidden without it. `Ticker` rolls a figure with a cubic ease-out (650ms default, 1400ms for the hero proof). Under reduced motion draw, flight and stagger go to 0, reveals become 200ms fades without rise or blur, figures jump to their value, cards sit flat and still, trails show drawn, and every story shows its final state.

**The Transform And Opacity Rule.** Animate transform and opacity. The exceptions the build carries are the reveal's 4px blur, the trails' stroke draw, colour transitions on hover and state, and Aan's cube and bar morphs (which change the body's size); add no more.

## Do's and Don'ts

### Do:
- **Do** take every colour from the `.nocturne` roles so both night and day work, and keep periwinkle and coral as the only hues.
- **Do** set headlines in Inter 800 with tight tracking (`.t-h2`, or the hero and name sizes above), and keep Fraunces for the morning brief and Aan's letter.
- **Do** put product proof in a `ProductFrame` with a breadcrumb title and an honest note ("Sample data", "Sample rule", "Sample conversation", "Sample message", "Illustrative"), and use the UI's `bare` mode inside it.
- **Do** aim `LightTrails` at the thing the screen is about, and give at most one trail the `risk` index.
- **Do** keep proof figures to $1.2B GMV, 500+ brands and 12.8% TACoS, in a ruled row.
- **Do** name marketplaces and apps (Amazon, Walmart, Shopify, Slack, Claude) as text.
- **Do** give a page no more than three Aan stops, with bubbles of 28 characters or fewer that state a fact the screen shows ("Fees took $1,151 today.", "Same $3,412 in any AI.").
- **Do** dock Aan beside or at the edge of product UI, where the light converges, never over it; the night story's own Aan, which acts on the Signals rows, is the one exception.
- **Do** wrap the screen's one primary CTA in `<Magnetic>` and count proof figures up once with `Ticker`.
- **Do** build each section as one `Screen` (or a `StoryScroll` for a pinned story) and run `scripts/qa/screens.mjs` before shipping.
- **Do** design the reduced-motion state on purpose: the final state shown, nothing travelling.

### Don't:
- **Don't** use green, teal or any hue outside periwinkle (230) and coral (355).
- **Don't** use coral for buttons, headings, links or decoration.
- **Don't** give Aan arms, legs, hands or a face beyond its two eyes, or restyle it: every Aan on the site is the island's `AanMascot` (via `AanClay` when it acts).
- **Don't** bring back City Nocturne line-art scenes or the soft isometric drawings, or add a second ambient motif beside the light trails.
- **Don't** put a card inside a card, or box content that a ruled list can carry.
- **Don't** show an unlabelled number in product UI, or fabricate customers, testimonials, logos or prices.
- **Don't** draw marketplace or app logos.
- **Don't** let a `fit="screen"` section grow past one viewport above 620px of height.
- **Don't** add hover lifts, hard shadows, gradient text or glossy surfaces; depth is light.
- **Don't** add a second pinned story to a page, parallax, or idle loops beyond Aan's breath, the trails' breath and pulse, and the hero's live dot.
- **Don't** bring the film's stamp red, Bodoni or grain onto site pages.

## Film: "Aan's debut" (provenance)

- Route `/film/debut` renders the reel (`components/film/Debut.tsx`, cuts in `components/film/debut-timeline.ts`); stamps use Bodoni Moda 500 in Film Stamp Red, loaded only on that route.
- Every shot is drawn in code (`components/film/DebutScenes.tsx`) in the earlier City Nocturne line art with the flat `AanMascot`. It predates the Phase 8 language; a re-cut with the light trails and Aan's acts is pending.
- `public/film/aan-debut.mp4` carries an original synthesized score (`scripts/film/debut-score.mjs`, -14 LUFS) and Aan's voice-over (`scripts/film/voice-winrt.mjs`, cues in `components/film/debut-voice.json`); `public/film/aan-debut-instagram.mp4` is the silent master. The homepage close plays it in `components/home/FilmPlayer.tsx`.
