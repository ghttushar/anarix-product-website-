---
name: Anarix Platform
description: Dark-first marketing site and brand film for Aan, the always-on AI inside Anarix.
colors:
  periwinkle: "hsl(230 65% 57%)"
  periwinkle-night: "hsl(230 70% 65%)"
  periwinkle-glow: "hsl(230 75% 65%)"
  periwinkle-wash: "hsl(230 65% 95%)"
  coral: "hsl(355 84% 70%)"
  coral-deep: "hsl(355 70% 60%)"
  aan-coral: "#f46d76"
  aan-coral-light: "#f88a93"
  aan-coral-deep: "#f05e6a"
  gain-night: "hsl(230 64% 52%)"
  risk-night: "hsl(355 84% 72%)"
  gain-day: "hsl(230 80% 39%)"
  risk-day: "hsl(355 75% 58%)"
  night-deep: "hsl(209 30% 8%)"
  night: "hsl(209 28% 11%)"
  night-muted: "hsl(209 25% 16%)"
  night-border: "hsl(209 25% 18%)"
  night-ink: "hsl(228 20% 94%)"
  night-ink-2: "hsl(215 12% 60%)"
  day-bg: "hsl(228 25% 97%)"
  day-card: "hsl(0 0% 100%)"
  day-muted: "hsl(228 20% 94%)"
  day-border: "hsl(228 20% 90%)"
  day-ink: "hsl(209 22% 14%)"
  day-ink-2: "hsl(215 14% 42%)"
  film-ink-deep: "hsl(209 30% 6%)"
  film-letterbox: "#050608"
  film-seamless: "hsl(228 12% 86%)"
  film-stamp: "hsl(355 84% 60%)"
  film-caption-yellow: "#ffe45c"
typography:
  display-closing:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(72px, 12vw, 184px)"
    fontWeight: 600
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(52px, 5.6vw, 88px)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(42px, 4.6vw, 72px)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.028em"
  statement:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(21px, 1.95vw, 29px)"
    fontWeight: 400
    lineHeight: 1.38
    letterSpacing: "-0.012em"
  lede:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(18px, 1.55vw, 23px)"
    fontWeight: 400
    lineHeight: 1.5
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    letterSpacing: "0.02em"
  micro-label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.06em"
  film-stamp:
    fontFamily: "Fraunces, Georgia, serif"
    fontWeight: 700
    lineHeight: 0.86
    letterSpacing: "-0.015em"
rounded:
  bubble-tail: "6px"
  focus: "8px"
  bubble: "18px"
  film-card: "22px"
  card: "24px"
  chapter: "40px"
  footer: "48px"
  pill: "9999px"
spacing:
  gutter: "24px"
  card-pad: "22px"
  fact-pad: "32px"
  cap-gap: "48px"
  statement-gap: "80px"
  grid-gap: "96px"
  chapter-top: "200px"
  chapter-bottom: "180px"
  container: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.periwinkle}"
    textColor: "{colors.day-card}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "48px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "48px"
  card:
    backgroundColor: "{colors.night}"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  fact-card:
    backgroundColor: "{colors.night}"
    rounded: "{rounded.card}"
    padding: "{spacing.fact-pad}"
  chapter-light:
    backgroundColor: "{colors.day-bg}"
    textColor: "{colors.day-ink}"
    rounded: "{rounded.chapter}"
  nav:
    backgroundColor: "{colors.night}"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  film-sound-button:
    backgroundColor: "hsl(0 0% 100% / 0.92)"
    textColor: "hsl(209 30% 10%)"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  film-card:
    backgroundColor: "hsl(209 28% 11% / 0.92)"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.film-card}"
    padding: "22px 26px"
  film-chip-on:
    backgroundColor: "hsl(230 70% 65% / 0.16)"
    textColor: "hsl(228 20% 96%)"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
---

# Design System: Anarix Platform

## Overview

**Creative North Star: "The Night Shift"**

The platform site is a dark room where one small coral creature keeps watch. The page loads in the dark theme (`data-theme="dark"` on `<html>`), and the night palette is the default ground: deep blue-black slate, pale ink, periwinkle as the single working accent, coral reserved for Aan and for risk. Two chapters (Profitability and MCP) re-scope the light tokens and sit as rounded, inset "daylight" panels inside the dark page, so the scroll reads as night with lit rooms in it. The Night Watch diorama turns this into a story: in dark mode its night goes light, so contrast always marks the hours Aan is on duty.

The typographic voice is the services site's, unchanged: Fraunces at large optical sizes for statements, Inter for everything a person reads. Density is low and the rhythm is slow (200px chapter tops, 1.1s reveals). Content is set as prose and ruled lists, not as tiles. Product UI cards lead each feature; small isometric machines follow them and power up when Aan docks.

The 90s brand film ("Ninety seconds with Aan") is the same world shot as a villain-debut trailer: near-black rooms, a pale seamless backdrop, giant condensed Fraunces words stamped in coral-red, hard cuts, and a deadpan twist in plain yellow captions. It reuses the site's machines, Night Watch and Aan rather than inventing new assets.

**Key Characteristics:**
- Dark-first; light exists as scoped chapters, never as a global flip.
- Two hue families only: periwinkle (230) and coral (355) over blue-slate neutrals (209/215/228). No green.
- Fraunces 600 display with tight negative tracking; Inter for body, labels and numbers.
- Prose and hairline-ruled lists instead of boxed feature grids.
- Aan, a coral diamond with eyes, is the only character and the only warm object on most screens.
- Isometric line-art machines, small, placed after the UI card at the outer edge.

## Colors

A cool blue-slate night with one periwinkle working accent and one coral that belongs to Aan and to risk.

### Primary
- **Periwinkle** (`--h-primary`, hsl(230 65% 57%); dark theme hsl(230 70% 65%)): primary buttons, focus rings (2px, 3px offset), powered-state card borders, the "you" chat bubble, `::selection` at 18% alpha, the dot grid at 18% alpha. It is also the positive/gain color.
- **Periwinkle Glow** (`--h-glow`, hsl(230 75% 65%)): the second stop of the primary gradient and `--blue-2`; glow shadows on powered cards.
- **Periwinkle Wash** (`--h-accent`, hsl(230 65% 95%); dark hsl(230 40% 20%)): soft accent fills.

### Secondary
- **Signal Coral** (`--h-coral`, hsl(355 84% 70%); dark 355 84% 72%) and **Coral Deep** (`--coral-deep`, hsl(355 70% 60%)): negative/risk values, the conduit packet that runs from machine to card, faint coral radial in media backgrounds (8% alpha).
- **Aan Coral** (#f46d76, light #f88a93, deep #f05e6a): hard-coded in `AanMascot.tsx` as `CORAL`. The mascot's body gradient, aura (rgba(244,109,118,0.32)), progress fill and ripple. Do not reuse it for UI chrome.

### Tertiary (film only)
- **Stamp Red** (`--stamp`, hsl(355 84% 60%)): the giant stamped words and end card. A deeper coral than Signal Coral so it holds on both near-black and the pale seamless.
- **Twist Yellow** (#ffe45c): only the deadpan twist captions, with a hard black outline shadow. Scoped to `.fcap--twist`; not part of the site palette.

### Neutral
- **Night Deep** (`--night-deep`, hsl(209 30% 8%)): dark-theme page background.
- **Night** (`--night`, hsl(209 28% 11%)): dark cards, the always-dark footer, Aan's speech bubble.
- **Night Muted / Border** (hsl(209 25% 16%) / hsl(209 25% 18%)): skeletons and hairlines on dark.
- **Night Ink** (hsl(228 20% 94%)) and **Night Ink 2** (hsl(215 12% 60%)): primary and secondary text on dark; `--ink-3` is Ink 2 at 75%.
- **Day Background** (hsl(228 25% 97%)), **Day Card** (white), **Day Muted** (hsl(228 20% 94%)), **Day Border** (hsl(228 20% 90%)): the light-chapter surfaces.
- **Day Ink** (hsl(209 22% 14%)) and **Day Ink 2** (hsl(215 14% 42%)): text in light chapters.
- **Film Ink Deep** (hsl(209 30% 6%)), **Letterbox** (#050608), **Seamless Grey** (hsl(228 12% 86%) with a radial from hsl(228 20% 96%) to hsl(228 10% 74%)): the film's two stages.

### Named Rules
**The No Green Rule.** Positive is periwinkle, negative is coral, everywhere: `--gain`/`--risk` in every theme scope, the film's `is-good`/`is-bad` cards, chips, coins and charts. Even a class named `sf--green` is filled hsl(230 60% 62%). No hue between roughly 60 and 180 enters the palette.

**The Two Hues Rule.** Every chromatic value in the build sits at hue 230 (periwinkle) or 355 (coral). Neutrals are blue-slate (209, 215, 228). The one exception is the film's twist yellow, and it stays in the film.

**The Aan Owns Coral Rule.** On any screen, the warmest, most saturated object is Aan. Coral elsewhere is data (risk) or a faint radial tint, never a button or a heading fill.

## Typography

**Display Font:** Fraunces (loaded at 400/600/700, `font-optical-sizing: auto`, fallback Georgia, serif)
**Body Font:** Inter (400/500/600/700, fallback system-ui, sans-serif)
**Mono:** IBM Plex Mono (400/500) is loaded for code, ASINs and numbers only.

**Character:** A soft, high-contrast serif at poster scale against a neutral grotesk at reading scale. The serif carries the claim; Inter carries everything you have to read.

### Hierarchy
- **Closing display** (600, clamp(72px, 12vw, 184px), 0.92, -0.04em): the closing statement only.
- **Display / H1** (600, clamp(52px, 5.6vw, 88px), 1, -0.03em): hero headline.
- **Headline / H2** (600, clamp(42px, 4.6vw, 72px), 1.02, -0.028em): chapter titles. The mission line is set at clamp(36px, 4.4vw, 66px), 1.1, -0.025em, in `--ink-3`.
- **Statement** (Inter 400, clamp(21px, 1.95vw, 29px), 1.38, -0.012em): the paragraph that answers each chapter title, in `--ink-2`, with key phrases lifted to full ink via highlight spans.
- **Lede** (Inter 400, clamp(18px, 1.55vw, 23px), 1.5): hero lede, max 27em.
- **Title** (Inter 500, 20px, -0.012em): capability titles in ruled lists. Body under them is 16.5px / 1.6.
- **Body** (Inter 400, 16px, 1.6).
- **Label** (Inter 500, 14px, 0.02em): chapter labels, preceded by a 36px pill holding the tabular chapter number.
- **Micro-label** (Inter 600, 11px, 0.06em, sentence case): card field labels (KPI, rule headers). Metadata lines are 12.5px. This is the floor.

### Named Rules
**The Grey Prose, Ink Phrase Rule.** Long statements are set in `--ink-2`; only the phrases that carry the argument switch to `--ink`. Emphasis is contrast, not weight or color.

**The Readable Label Rule.** Labels are Inter at 11px or larger with at least 600 weight, at 0.8 foreground alpha or the muted-fg token. Monospace is for code, ASINs and figures, never for UI labels.

## Layout

A 1280px container with 24px gutters. Chapters are tall and slow: 200px top / 180px bottom padding (120px below 1023px). Each chapter opens with a two-column statement (title left, prose right, 80px gap, bottom-aligned, min-height 62vh, 140px below), then a 96px-gap grid of sticky copy beside the product stage, then a three-column ruled capability row (48px gaps, 96px above). The hero is 1.12fr / 0.88fr filling `100svh - 80px`; the mission line is a full-viewport single sentence.

**Stage order:** the product UI card comes first (max 520px, aligned to the inner edge), then the isometric machine (82% width, max 480px, 28px below, pushed to the outer edge). Reversed features mirror the edges. A 2px conduit with a coral packet links them when powered.

The fact carousel is a horizontal scroll-snap track of three 340px-tall cards with a pill pager. The footer is always dark with a 48px top radius.

Breakpoints: 1023px (everything stacks to one column, chapters inset 8px with 28px radius, footer radius 32px) and 640px (film player goes 9:16, stage machine 92%).

## Elevation & Depth

A hybrid: soft periwinkle-tinted shadows in light chapters, black shadows in the dark theme, and tonal layering (night-deep page, night card) doing most of the work. Media frames are flat (`box-shadow: none`) and get depth from two faint radials, periwinkle top-left and coral bottom-right. Glass appears only on the scrolled nav (`blur(12px)` over card at 80%).

### Shadow Vocabulary
- **Soft** (`0 2px 8px -2px hsl(var(--h-primary) / 0.08)`; dark `hsl(0 0% 0% / 0.3)`): nav at rest.
- **Medium** (`0 4px 16px -4px … / 0.12`; dark `/ 0.4`): cards at rest, scrolled nav.
- **Strong** (`0 8px 32px -8px … / 0.18`; dark `/ 0.5`): card hover, primary button hover.
- **Glow** (`0 0 24px -4px hsl(var(--h-primary) / 0.25)`): added to cards when their machine is powered.

### Named Rules
**The Powered Glow Rule.** Glow is a state, not a decoration: a card earns the periwinkle border (35% alpha) and glow only when Aan has docked and its machine is powered.

## Shapes

Generous, consistent rounding. Pills (9999px) for every button, chip, nav bar and pager; 24px for cards, fact cards, media and the film player; 40px for the inset light chapters (28px mobile); 48px for the footer's top corners. Chat bubbles are 18px with a 6px tail corner on the speaker's side. Aan's own geometry is the exception that defines the brand: a 45-degree diamond with an 18% corner radius.

## Components

### Buttons
- **Shape:** full pill (9999px), 48px tall, 32px side padding, Inter 600 16px.
- **Primary:** white on periwinkle, with a white shine sweep (18% alpha) crossing on hover.
- **Hover / Active:** lift 2px and strong shadow, 0.2s; active returns to 0 and scales to 0.97.
- **Secondary:** transparent with a 1px border token, border moves to periwinkle at 40% on hover.
- **Text link:** Inter 500 16px with a 1px underline in the border token that darkens to ink on hover.

### Cards
- **Corner Style:** 24px.
- **Background:** card token (night in dark, white in light chapters); 1px border token; 22px padding.
- **Shadow Strategy:** medium at rest, strong on hover, glow when powered.
- **Content:** labelled values and short sentences, gain/risk in periwinkle/coral.

### Chapter labels
A 36px bordered pill containing the tabular chapter number, then the chapter name in Inter 500 14px `--ink-2`. This is how sections are named; it replaces uppercase tracked kickers.

### Navigation
A floating pill (max 1280px, 16px from the top) that is transparent until scrolled, then becomes card at 80% with a 12px backdrop blur and medium shadow. Over dark surfaces it switches to the night chrome tokens.

### Aan (signature)
The coral mascot, `AanMascot`. State is shape:
- **diamond** (idle / speaking): a square rotated 45 degrees, 18% radius (30% on hover above 40px), two near-black eyes (#1a0608) that track the cursor; speaking adds a coral ripple ring.
- **circle** (listening): 50% radius, faster blinks.
- **bar** (working): a translucent coral pill (1.8u by 0.34u) with a coral progress fill.
- **cube** (thinking): 16% radius, spins over 5s with a counter-rotating liquid swirl, eyes closed.

The body is a radial gradient from light to base to deep coral with a top sheen and a faint periwinkle inner ring; a blurred coral aura and a floating ground shadow sit beneath. It floats on a 7s loop and morphs between states with a spring (`cubic-bezier(0.34, 1.3, 0.64, 1)`, 0.6s). Below 24px it becomes a flat coral chip with no eyes or aura. All loops stop under reduced motion.

**The Docked Diamond Rule.** Wherever Aan sits docked on the site (every `AanMascot` placement in the build passes `state="diamond"`, including the traveler that docks at each machine), it is the diamond. The other states are reserved for in-product moments that show work happening.

### Isometric machines (signature)
Dormant line-art boxes and cylinders (`.mx`) built from three faces mixed from the panel color toward ink (100% / 93% / 85%) with 1px strokes at 24% ink. When Aan docks, fills and strokes transition over 0.7s to their powered colors: periwinkle for flow and gain, coral for cost and risk, never green. Labels inside the SVG use the readable-label scale (Inter 600 13px, small labels 11.5px 700). Machines are always secondary to the UI: at most 480px wide and placed after the card.

**The Beside, Never Behind Rule.** An isometric scene never sits under a UI card or copy. It follows the card, aligned to the outer edge, at no more than 82% of the stage width.

### Night Watch (signature)
A 440vh scroll-driven diorama with a sticky viewport. A `--d` variable from 0 to 1 mixes every color (ink, line, the three box faces, ground, background) between day and night with `color-mix`. In dark mode the mixes are reversed so the scene goes light at night; stars invert, lamps and windows glow warm (rgba(255,196,92)) or periwinkle as it darkens.

### Film player
A 16:9 frame, 24px radius, on film-ink-deep, with a white pill sound button bottom-left (Inter 600 15px). Below 640px it becomes 9:16, 20px radius, sized to 82svh, button centred.

### The film's look ("Ninety seconds with Aan")
- **Stages:** near-black rooms (film-ink-deep with a periwinkle radial at centre and a dark coral radial below), Aan lit from below by a blurred coral underlight; a pale seamless backdrop for silhouettes (a dark diamond silhouette with one glowing coral eye); a twist set with a pale wall over a warm desk.
- **Stamps:** Fraunces 700, line-height 0.86, horizontally condensed with `scaleX(0.62)` (0.7 on the end card in 9:16), in stamp red with a soft red-black text shadow on dark and none on light. Each lands with a brief scale overshoot, a coral screen-blend flash and a camera kick.
- **Captions:** the opening line types in coral (hsl(355 90% 62%)) under Aan; twist captions are plain twist yellow with a black outline. Captions are Inter, sized from frame height (4.2% and 5%).
- **UI in film:** dark glass cards (22px radius, 92% night, black drop shadow), periwinkle for good and coral for bad, pill chips, chat bubbles with a 6px tail.
- **Finish:** a radial vignette (light variant on the seamless, none on the twist) and a 6% fractal-noise grain over everything.
- **End card:** stamped words top and bottom with Aan centred and the URL fading in beneath in Inter 600.

## Do's and Don'ts

### Do:
- **Do** keep Fraunces + Inter and the services-site HSL tokens exactly as defined in `app/globals.css`; change scale and rhythm, not values.
- **Do** encode positive as periwinkle (`--gain`) and negative as coral (`--risk`) in every theme scope.
- **Do** set feature content as a statement paragraph plus hairline-ruled capability lists (26px padding, 1px border-token rules).
- **Do** light a chapter by re-scoping the light tokens inside `.chapter--light` with a 40px radius and 16px inset, rather than flipping the page theme.
- **Do** place the UI card first and the isometric machine after it at the outer edge, max 480px.
- **Do** dock Aan as the diamond, and keep its coral the warmest thing on screen.
- **Do** use `--ease-out` (`cubic-bezier(0.22, 1, 0.36, 1)`) for reveals (1.1s, 28px rise) and state fades, and honor reduced motion.
- **Do** keep labels in Inter at 11px or larger, 600 weight or heavier.

### Don't:
- **Don't** use green, teal or any hue outside periwinkle and coral for status, charts or decoration.
- **Don't** put an isometric scene behind a UI card or text, or let it outgrow the card it supports.
- **Don't** set UI labels in tiny monospace; IBM Plex Mono is for code, ASINs and figures.
- **Don't** break content into grids of boxed tiles where a paragraph or ruled list will do.
- **Don't** show Aan docked in circle, bar or cube form, or recolor it.
- **Don't** use the film's twist yellow, stamp scaleX condensing or grain on the site; they belong to the film.
- **Don't** add uppercase tracked eyebrow pills above headings; chapters are named by the numbered chapter label.
