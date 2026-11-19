---
name: Anarix Platform
description: City Nocturne. A line-drawn night street of storefronts that Aan, your 24/7 e-commerce account manager, walks and keeps.
colors:
  periwinkle-solid: "hsl(230 65% 57%)"
  periwinkle-solid-hover-night: "hsl(230 65% 52%)"
  periwinkle-day: "hsl(230 65% 50%)"
  periwinkle-night: "hsl(230 75% 72%)"
  periwinkle-chrome-night: "hsl(230 70% 65%)"
  lit-night: "hsl(230 70% 65% / 0.5)"
  lit-day: "hsl(230 65% 57% / 0.22)"
  on-accent: "#fff"
  aan-coral: "#f46d76"
  aan-coral-light: "#f88a93"
  aan-coral-deep: "#f05e6a"
  risk-ink-night: "hsl(355 84% 74%)"
  risk-ink-day: "hsl(355 70% 50%)"
  film-stamp-red: "#e3121b"
  sky-night: "#0e151b"
  line-night: "hsl(228 38% 80% / 0.55)"
  line-strong-night: "hsl(228 40% 90% / 0.92)"
  ink-night: "hsl(228 20% 94%)"
  ink-2-night: "#8d97a5"
  rule-night: "#222e39"
  card-night: "#141c24"
  card-line-night: "#222e39"
  bubble-bg-night: "hsl(228 25% 97%)"
  bubble-ink-night: "hsl(228 40% 14%)"
  sky-day: "hsl(230 60% 97%)"
  line-day: "hsl(209 22% 14% / 0.5)"
  line-strong-day: "hsl(209 22% 14% / 0.88)"
  ink-day: "hsl(209 22% 14%)"
  ink-2-day: "hsl(215 16% 38%)"
  rule-day: "hsl(228 22% 86%)"
  card-day: "#fff"
  card-line-day: "hsl(228 22% 88%)"
  bubble-bg-day: "hsl(209 22% 14%)"
  bubble-ink-day: "#fff"
  chrome-card-day: "hsl(0 0% 100%)"
  chrome-card-night: "hsl(209 28% 11%)"
  chrome-fg-day: "hsl(209 22% 14%)"
  chrome-fg-night: "hsl(228 20% 94%)"
  chrome-muted-fg-day: "hsl(215 14% 42%)"
  chrome-muted-fg-night: "hsl(215 12% 60%)"
  chrome-muted-day: "hsl(228 20% 94%)"
  chrome-muted-night: "hsl(209 25% 16%)"
  chrome-border-day: "hsl(228 20% 90%)"
  chrome-border-night: "hsl(209 25% 18%)"
  chrome-accent-day: "hsl(230 65% 95%)"
  chrome-accent-night: "hsl(230 40% 20%)"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.5rem, min(6vw, 9.4svh), 6rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.028em"
  display-page:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.5rem, min(4.6vw, 8svh), 4.5rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.028em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2rem, min(4.2vw, 7svh), 4rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.024em"
  statement:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, min(1.4vw, 2.5svh), 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  cta:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  point-title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  point-text:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.3
  drawing-label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.06em"
  ui-label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
  caption:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
  ui-figure:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(28px, 4.2svh, 36px)"
    fontWeight: 700
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  figure:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 500
    fontFeature: "tnum"
rounded:
  bubble-tail: "4px"
  focus: "8px"
  ui-button: "10px"
  bubble: "14px"
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
  gutter: "24px"
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
  button-primary-hover-night:
    backgroundColor: "{colors.periwinkle-solid-hover-night}"
  button-primary-hover-day:
    backgroundColor: "{colors.periwinkle-day}"
  text-link-night:
    textColor: "{colors.ink-night}"
    typography: "{typography.cta}"
    height: "44px"
  text-link-day:
    textColor: "{colors.ink-day}"
    typography: "{typography.cta}"
    height: "44px"
  ui-card-night:
    backgroundColor: "{colors.card-night}"
    textColor: "{colors.ink-night}"
    rounded: "{rounded.card}"
    padding: "clamp(16px, 2.4svh, 22px)"
  ui-card-day:
    backgroundColor: "{colors.card-day}"
    textColor: "{colors.ink-day}"
    rounded: "{rounded.card}"
    padding: "clamp(16px, 2.4svh, 22px)"
  ui-pill:
    typography: "{typography.ui-label}"
    rounded: "{rounded.pill}"
    padding: "3px 9px"
  ui-button:
    typography: "{typography.label}"
    rounded: "{rounded.ui-button}"
    padding: "7px 12px"
  ui-button-primary:
    backgroundColor: "{colors.periwinkle-solid}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.ui-button}"
    padding: "7px 12px"
  speech-bubble-night:
    backgroundColor: "{colors.bubble-bg-night}"
    textColor: "{colors.bubble-ink-night}"
    typography: "{typography.label}"
    rounded: "{rounded.bubble}"
    padding: "8px 14px"
  speech-bubble-day:
    backgroundColor: "{colors.bubble-bg-day}"
    textColor: "{colors.bubble-ink-day}"
    typography: "{typography.label}"
    rounded: "{rounded.bubble}"
    padding: "8px 14px"
  callout-number:
    textColor: "{colors.ink-night}"
    typography: "{typography.figure}"
    rounded: "{rounded.pill}"
    size: "22px"
  nav-scrolled-night:
    backgroundColor: "{colors.chrome-card-night}"
    textColor: "{colors.chrome-fg-night}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  nav-scrolled-day:
    backgroundColor: "{colors.chrome-card-day}"
    textColor: "{colors.chrome-fg-day}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  chrome-button-primary-night:
    backgroundColor: "{colors.periwinkle-chrome-night}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "40px"
  chrome-button-primary-day:
    backgroundColor: "{colors.periwinkle-solid}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "40px"
  action-island-night:
    backgroundColor: "{colors.chrome-card-night}"
    textColor: "{colors.chrome-fg-night}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
---

# Design System: Anarix Platform

## Overview

**Creative North Star: "City Nocturne"**

The platform site is one night street, drawn in a single hairline. Storefronts for Amazon, Walmart and Shopify stand along it with a few windows lit, and Aan, the coral mascot and the visitor's 24/7 e-commerce account manager, walks it. The whole site sits inside one `.nocturne` scope: in the dark theme (the default, set on `<html data-theme="dark">` before first paint) the street is a deep slate night, the same `#0e151b` as the services site (www.anarix.ai); in the light theme the same street is drawn in slate ink by day. Every screen is the same sky, the same ink, the same line weight.

Pages are made of screens, and a screen holds one idea: a Fraunces headline, one statement in grey Inter with its key phrases lifted to full ink, then either a line drawing that explains a mechanism or the real product card proving it, and at most three hairline-ruled points. There are no tiles, no badges, no section labels above headings. Motion has one job, cause and effect: a drawing draws itself when its screen arrives, Aan docks in it, and then one thing turns periwinkle (what Aan handled) or coral (what was going wrong), and the product card settles into its handled state. Nothing loops, glows or decorates.

Two pieces of chrome are not part of the world and do not follow its rules: the nav and the Ask Aan action island are a 1:1 port of the services site (www.anarix.ai) and stay at parity with it, including their pill shapes, glass, soft shadows and lift-on-hover buttons.

**Key Characteristics:**
- One `.nocturne` world in two lights: a night street (dark, default) and the same street by day (light). Theme is a whole-page switch saved in `localStorage` (`anarix-theme-v2`), never a lit panel inside a dark page.
- Two hues only, periwinkle (230) and coral (355), over slate and navy neutrals. No green anywhere.
- Fraunces 600 speaks, Inter explains, IBM Plex Mono measures (figures only).
- Monoline line art at one 1.4px hairline, drawn on once per page view, with coral for what goes wrong and periwinkle for what Aan handled.
- One idea per screen: each section is exactly one viewport between an 84px nav inset and a 90px island inset.
- Proximity and hairline rules group content; the only boxes are product UI cards, because in the product they are cards.
- Aan is the unchanged brand mascot, docks as a diamond, and is the warmest object on every screen.

## Colors

A slate night matched to the services site (or a pale periwinkle day) inked in slate, with one periwinkle working accent and one coral that belongs to Aan and to risk.

### Primary
- **Working Periwinkle** (`--accent-solid`, periwinkle-solid): the filled primary button in both themes, the primary button inside product cards, the Night Watch scrubber fill, and the "you" bubble in the Ask Aan chat. Its hover deepens (periwinkle-solid-hover-night in the dark theme, periwinkle-day in the light).
- **Handled Periwinkle** (`--accent`, periwinkle-night in dark, periwinkle-day in light): the readable periwinkle. It is what a stroke turns when Aan has handled it, positive figures in product cards (`gain`), the active step or callout, hover color on text links and FAQ summaries, focus rings inside the world, and the third line of the hero headline.
- **Chrome Periwinkle** (periwinkle-chrome-night in dark, periwinkle-solid in light): the services-site primary used by the nav and island chrome and by the global `:focus-visible` ring and `::selection` (18% alpha).
- **Lit Window** (`--lit`, lit-night / lit-day): the fill of lit windows after the line work has drawn, and the Night Watch dawn that lifts the sky in the last hour.

### Secondary
- **Aan Coral** (`--risk`, aan-coral, the same in both themes): Aan's body, and in drawings the stroke that turns coral when Aan reaches the problem (the moved listing, the stop mark, the wasted spend, an alerting place on the patrol). aan-coral-light and aan-coral-deep exist only inside the mascot's body gradient (`AanMascot.tsx`).
- **Risk Ink** (`--risk-ink`, risk-ink-night / risk-ink-day): coral text that must be read, such as costs and money at risk in product cards and coral words on drawings. It is lighter at night and deeper by day so it holds contrast.

### Tertiary
- **Film Stamp Red** (film-stamp-red): only on the `/film/debut` route, for the Bodoni stamps. It never appears on site pages.

### Neutral
- **Night Sky / Day Sky** (`--sky`, sky-night / sky-day): the ground of every page and the fill of solid shapes in drawings that hide what is behind them. The browser theme color matches (`#0e151b` dark, `#f3f4fc` light).
- **Line / Line Strong** (`--line`, `--line-strong`): the drawing ink. Line is the structure stroke; Line Strong is for words on drawings, the moon, leader lines and callout borders.
- **Ink / Ink 2** (`--ink`, `--ink-2`): primary text, and the grey of statements, ruled-point descriptions, captions and the footer.
- **Rule** (`--rule`): every hairline between list rows, the proof row, the footer and the film player border.
- **Card / Card Line** (`--card`, `--card-line`): product UI card surface and its 1px border, pills and inner rules.
- **Bubble** (`--bubble-bg`, `--bubble-ink`): Aan's speech bubble inverts the theme, pale on the night street and slate ink by day.
- **Chrome neutrals** (chrome-card, chrome-fg, chrome-muted-fg, chrome-muted, chrome-border, chrome-accent, each with a day and night value): the services-site chrome palette, used only by the nav, the island and the Ask Aan panel.

### Named Rules
**The No Green Rule.** Positive is periwinkle, negative is coral, in every card, drawing and theme. No hue between roughly 60 and 180 enters the site.

**The Coral Is Aan's Rule.** Coral is Aan, or it is something going wrong. It is never a button, a heading, a link or decoration, and Aan stays the warmest, most saturated object on any screen.

**The One Street Rule.** Theme is the whole street at a different hour. Colors change only through the `.nocturne` scope (dark values, and `html[data-theme="light"] .nocturne`); no section re-scopes itself into the other theme.

## Typography

**Display Font:** Fraunces (600; 400 and 700 also loaded; fallback Georgia, serif)
**Body Font:** Inter (400, 500, 600, 700; fallback system-ui, sans-serif)
**Label/Mono Font:** IBM Plex Mono (400, 500; fallback ui-monospace, monospace), for figures only

**Character:** A soft, high-contrast serif carries every claim at poster scale; a neutral grotesk carries everything a person has to read. Mono appears only where something is counted or timed.

### Hierarchy
- **Display** (Fraunces 600, fluid by width and height and capped at 96px, line-height 1.02): the homepage hero h1, set as three short lines, the last in Handled Periwinkle. Product pages use **Display Page** (capped at 72px) for their hero h1 and closing title, balanced.
- **Headline** (Fraunces 600, capped at 64px, line-height 1.04, balanced): one per screen, at most two short lines. The homepage mission line and proof figures are set in Fraunces 600 between Headline and Statement size.
- **Statement** (Inter 400, 17px to 22px fluid, line-height 1.5, max 42ch): the one paragraph under each headline, in Ink 2, with its key phrases in full Ink at 500 weight.
- **Body** (Inter 400, 16px, line-height 1.6): running text, FAQ answers at 15px / 1.55 with a 56ch measure.
- **Point title / Point text** (Inter 600 15px; Inter 400 14px, line-height 1.45, Ink 2): the two lines of a ruled point. Commitments and depth items step up to 16px / 14.5px.
- **CTA** (Inter 600, 15px): filled buttons and text links.
- **Label** (Inter 600, 13px, line-height 1.3): Aan's speech bubble, footer column heads, UI buttons. **Drawing label** is the same face at 13px with 0.06em tracking, as SVG text, never paths, and never below 11px on screen.
- **UI label / Caption** (Inter 600 / 400, 12px): pills and field labels in product cards; the "Sample data" note under each card.
- **UI figure** (Inter 700, 28px to 36px, -0.02em, tabular): the headline number inside a product card.
- **Figure** (IBM Plex Mono 500, 12px, tabular): times in the Night Watch log, card metadata, step numbers and anatomy callout numbers.

### Named Rules
**The Grey Prose, Ink Phrase Rule.** Statements are Ink 2; only the phrases that carry the argument switch to full Ink. Emphasis is contrast, not color or size.

**The Mono Measures Rule.** IBM Plex Mono is for numbers that count or time something, always with tabular numerals. It is never used for labels, headings or UI text.

**The Fraunces Ceiling Rule.** Display type is fluid by both width and height (`min(vw, svh)`) and never exceeds 96px; headlines never exceed 64px. Type shrinks on short screens before a screen is allowed to grow.

## Layout

The page is a stack of screens. A screen is exactly one viewport (`min-height: 100svh`) split into three rows: the nav inset (84px), the content, and the island inset (90px). Content lives in a 1280px measure with 24px gutters (16px below 400px wide) on a 12-column grid with a 24px column gap. Only below 620px of height may a screen grow taller than the viewport; anywhere else, growth is a bug fixed by editing copy.

The homepage is ten screens in fixed order: hero street, mission with proof, the Night Watch time-lapse, AI for good, five product screens (Signals, Profitability, Rules, Ask Aan, MCP), and Meet Aan with the film. Copy sits on the left (columns 1 to 5, or 1 to 6 on close screens) and the visual on the right (columns 7 to 12). On product screens the visual is the line drawing with the product card beneath it and a "Sample data" caption under the card. The hero street bleeds across the full width along the bottom of the screen.

Product pages (`/platform/[product]`) are the same grid and rhythm: a hero with the product's landmark drawn large on the ground line, How it works (three steps on one continuous drawn line), Anatomy (the product card with up to five numbered leader-line callouts), one or two depth screens, Questions (exclusive `<details>` with hairline rules), and a close with the open door.

**Density tiers.** Spacing is the 4px scale (4 to 96px) plus three fluid gaps that tighten on short screens first. Below 800px of height, optional items (`data-optional`: third ruled points, secondary card rows, statement extras) hide; below 760px gaps and the mission line tighten further. Below 900px wide everything stacks to one column and dense lists collapse (the Night Watch log becomes a single "now" line; anatomy callouts become a numbered list under the card). Below 640px the drawings on product screens and the ruled points hide, leaving headline, statement, card and link.

Breakpoints: 400px, 640px, 900px wide (1100px for the chrome's desktop menu); 620px, 760px, 800px tall.

## Elevation & Depth

The world is flat. Depth comes from drawing order and from solid sky-colored shapes that hide the lines behind them, not from shading. The only shadows inside the world are two soft, dark, downward drops: one under product UI cards so they read as real objects on the street, and one under Aan's speech bubble. Glass (backdrop blur) and the periwinkle-tinted soft/medium/strong shadow scale belong to the chrome alone.

### Shadow Vocabulary
- **Card drop** (`box-shadow: 0 24px 48px -32px hsl(228 60% 4% / 0.7)`): every product UI card.
- **Bubble drop** (`box-shadow: 0 8px 20px -12px hsl(228 50% 4% / 0.6)`): Aan's speech bubble.
- **Chrome soft / medium / strong** (`0 2px 8px -2px`, `0 4px 16px -4px`, `0 8px 32px -8px` in periwinkle at 0.08 / 0.12 / 0.18 alpha by day, black at 0.3 / 0.4 / 0.5 by night): the scrolled nav, chrome buttons and the Ask Aan panel, at services-site parity.

### Named Rules
**The Flat Street Rule.** Nothing in the world glows, shades or blurs. A handled state is shown by a stroke changing color, never by a halo. The one soft light is the Night Watch dawn, a `--lit` wash rising from the bottom of the sky in the last hour of the night, because the drawing is about the night ending.

## Shapes

Line art is monoline: round caps, round joins, no fills except the sky color (to occlude) and the lit-window wash. UI follows the product: product cards at 20px, buttons inside cards at 10px, pills fully round (999px), the speech bubble at 14px with a 4px corner on the side its tail points from. Callout numbers are 22px circles. Focus rings are 2px periwinkle outlines with an 8px radius globally (6px on list rows, 4px in the footer). Aan's own geometry is the brand exception: a square rotated 45 degrees with an 18% corner radius.

## Components

### Buttons
Quiet and solid: one filled pill per screen, everything else is a link.
- **Shape:** full pill (999px), at least 48px tall, 24px side padding, Inter 600 15px.
- **Primary:** white on Working Periwinkle. Hover deepens the fill over 160ms; no lift, no shine, no shadow.
- **Text link (secondary):** Ink, 44px tall target, a 1px underline at 40% ink offset 6px, with an optional 16px stroke arrow. Hover turns text and underline Handled Periwinkle.
- **Focus:** 2px Handled Periwinkle outline, 4px offset.
- **Control pill:** the Night Watch play/replay is a 44px outlined pill (Rule border, Inter 600 14px) whose border turns periwinkle on hover.

### Ruled lists
The site's default container. Each row is separated by a 1px Rule hairline on top, 10px to 14px fluid padding, a 15px/600 title over a 14px Ink 2 line. Used for product points, commitments, proof figures, the Night Watch log, anatomy parts and the FAQ. The proof row is three figures (Fraunces 600) with one-line explanations, each under a hairline, never in tiles.

### Product UI cards
- **Corner Style:** 20px.
- **Background:** Card with a 1px Card Line border and the card drop shadow.
- **Internal Padding:** 16px to 22px, fluid by height.
- **Parts:** outlined pills (12px/600), monospace metadata at the right of the header, a UI figure in periwinkle for gain or Risk Ink for cost, inner 1px rules, 10px-radius buttons (primary filled in Working Periwinkle).
- **State:** each card settles once into `data-state="handled"`: its border mixes 45% toward periwinkle, labels swap in place without reflow, and late rows fade in from reserved slots.
- **Labelling:** every card is captioned "Sample data", "Sample conversation" or "Sample session" in 12px Ink 2 directly beneath it. Cards are `aria-hidden`; the copy beside them carries the meaning.

### Navigation
A 1:1 port of the services site nav. A full-width bar (max 1280px, 16px from the top, 10px 20px padding) that is transparent with no shadow until the page scrolls, by the owner's request; then it becomes a pill of chrome card at 80% with a 12px backdrop blur and soft (resting) or medium (scrolled) shadow. Inter 500 14px links in chrome muted-fg turn to chrome fg on hover with a 2px periwinkle underline that scales in. A Services | Platform switcher sits by the logo from 640px; the desktop menu and actions appear from 1100px. Its look must track www.anarix.ai, not this document.

### Ask Aan action island
A 1:1 port of the services site island: a fixed pill with a 1px periwinkle border at 60%, chrome card at 95% with a 12px blur, a drag grip, a 36px "Ask Aan" button carrying a 28px Aan, and icon actions including the theme toggle. It opens a 360px, 20px-radius chat panel with 14px bubbles (Aan's on chrome muted, the visitor's on periwinkle) and outlined suggestion chips. Its look must track the services site.

### Aan (signature)
The coral mascot (`AanMascot`), ported unchanged from the product. State is shape: diamond (idle, speaking), circle (listening), bar (working), cube (thinking). The body is a coral radial gradient with a sheen and a faint periwinkle inner ring; its eyes follow the pointer and it blinks.

On the site there is one travelling Aan per page. It walks into the hero street, then flies to a dock reserved inside each screen's drawing as that screen crosses the middle of the viewport, and lands there before the screen's moment plays. Docked Aan is a diamond, with no aura glow, no ground shadow and no float. Its speech bubble (28 characters or fewer, Inter 600 13px) fades in on landing and opens away from what Aan is looking after. Aan docks in drawings, never on product UI. The depth screen on the Ask Aan page is the one place the four shapes appear side by side, standing on one drawn ground line, to explain them.

### Line drawings (signature)
Every drawing explains a mechanism: the street of storefronts, the shop row where one window moved (Signals), the road that steps down from sales to profit (Profitability), the gate that lets good spend through (Rules), the corner where a question becomes an answer (Ask Aan), the pole with cables to every AI client (MCP), the patrolled town (Night Watch), the home at night (AI for good), the open door (close), and the cutaway landmarks and step glyphs on product pages.
- **Stroke:** one hairline per drawing, held at 1.4px on screen at any size by `useHairline` (not `non-scaling-stroke`, which breaks the draw-on).
- **Draw-on:** each stroke has `pathLength="1"` and draws once over 1400ms in reading order, 90ms apart, when its screen arrives. Lit windows fill in after the lines; words fade in after that.
- **The moment:** after Aan docks, marked strokes turn Handled Periwinkle (what Aan handled) or Aan Coral (what was wrong), and strokes reserved for the outcome draw in. Dotted guides fade rather than draw.
- **Words:** live SVG text in Inter 600 with 0.06em tracking, in Line Strong, never below 11px on screen.
- **Gating:** strokes start hidden only when script is running and motion is allowed; without script or with reduced motion the drawing is simply there.

### Night Watch (signature)
A 13-second time-lapse from 6:00 PM to 7:00 AM that plays once when its screen arrives. A Fraunces clock with tabular numerals, a ruled event log with Plex Mono times (the current row in full ink with a periwinkle time), a play/replay pill and a hairline scrubber (3px track, periwinkle fill, 16px ink thumb) the visitor controls. The moon crosses the sky, stars fade, places on the patrol turn coral while something is wrong and periwinkle once handled, and the dawn lifts the sky at the end. No scroll pinning.

### Film player
The close screen holds a 9:16 player (20px radius, 1px Rule border, near-black ground) sized to the content height, with a pale pill "Watch with sound" button (44px, Inter 600 14px) centred at the bottom. It plays muted only when in view and never autoplays under reduced motion.

### Motion
Tokens: micro 160ms (hover, press, focus), UI 320ms (state changes in cards), reveal 700ms with at most a 16px rise, draw 1400ms, flight 600ms, stagger 90ms. Everything that arrives eases on `cubic-bezier(0.16, 1, 0.3, 1)`; Aan's travel eases on `cubic-bezier(0.65, 0, 0.35, 1)`. Under reduced motion, draw, flight and stagger drop to 0, reveals become 200ms fades, and every screen shows its final, handled state. Animations pause on screens that are out of view.

## Page identities

The world is shared; the pages are not. Each product page is its own place on the street, drawn from its own camera, with its own layout grammar and one hands-on moment, so a visitor always knows where they are. Every page opens on its own name (Fraunces, the biggest thing on the page, slogan under it, one action) and runs four screens: name, hands-on, proof, close. Every screen is a headline and at most one line of 20 words.

| Page | Place and camera | Layout grammar | Hands-on moment | Proof | Close mark |
|---|---|---|---|---|---|
| **Signals** | one window bay at 3:12 AM, close up, running off the right edge (`WindowCloseup`) | a centred feed; mono timestamps; coral-forward | **Tap a store**: three shopfront buttons; the chosen store's signal card rises, at risk then fixed | the ranked list as an open feed, no card | the changed tag |
| **Profitability** | the day's money in cross-section (`ProfitLedger`), name across the top, chart across the bottom | the ledger: ruled receipt rows, figures as type | **Take out the costs**: switch each cost on (they come off one by one if nobody taps); one bar of sales splits into costs and what is left | marketplaces side by side | a receipt |
| **Rules** | the gatehouse on the belt, side on, edge to edge (`GatehouseBelt`) | read left to right: bands and arrows | **Say it in a sentence**: a sentence goes in, When / If / Then comes out, the gate drops what it stops | the decision log: allowed, stopped or held, each with its reason | a parcel through the gate |
| **Aan** | Aan alone in an arched frame (`AanPortrait`), mirrored | a conversation, centred, unboxed | **Ask Aan**: the mini Aan goes circle, cube, bar while it listens, thinks and works, then answers as the diamond | the morning brief as a letter, signed by Aan | Aan |
| **MCP** | the wiring from above, the name as the hub (`WiringMap`) | technical: tabs, a terminal, an equals sign | **Pick your AI**: Claude, ChatGPT, Gemini or your own agent; the same question gives the same $3,412 as the dashboard tile | the tool panel from above (`ToolPanel`): four sockets, every AI on one bus | a plug |

The homepage's five product screens preview their pages in the same grammars: the shop row over the alert, the ledger with the profit figure set large, the belt edge to edge, Aan answering as the speaker in a conversation, the pole over the terminal.

**The Name First Rule.** A product page never opens on a slogan alone; its name is the largest type on the page.

**The One Moment Rule.** One hands-on moment per page, unique to it, built from real buttons or tabs, starting in a state that already makes the point.

## Do's and Don'ts

### Do:
- **Do** keep Fraunces + Inter and the periwinkle, coral and ink tokens exactly as defined in `app/styles/tokens.css`; use IBM Plex Mono only for figures.
- **Do** put every page inside the `.nocturne` scope and take colors from its tokens (`--sky`, `--line`, `--ink`, `--accent`, `--risk`), so both the night and day streets work.
- **Do** build each section as one `Screen`: one headline, one statement, one visual, at most three ruled points, inside the 84px and 90px insets.
- **Do** group with space first and a 1px Rule hairline second; box only the product UI, because it is a card in the product.
- **Do** caption every product card "Sample data" (or "Sample conversation" / "Sample session") and label any illustrative number as such.
- **Do** limit proof figures to $1.2B GMV, 500+ brands and 12.8% TACoS, set in a ruled row.
- **Do** draw new illustrations in one 1.4px hairline via `useHairline`, with `pathLength="1"` draw-on, words as live text, and Aan Coral for what goes wrong and Handled Periwinkle for what Aan handled.
- **Do** reserve an `AanDock` inside the drawing for Aan, with a bubble of 28 characters or fewer, and dock Aan as the diamond.
- **Do** design the reduced-motion state on purpose: final states shown, 200ms fades kept.
- **Do** keep the nav and Ask Aan island at parity with www.anarix.ai, including the transparent-until-scroll nav.

### Don't:
- **Don't** use green, teal or any hue outside periwinkle (230) and coral (355) for status, charts or decoration.
- **Don't** put a label, eyebrow, kicker or numbered pill above a headline; the headline carries its own weight.
- **Don't** use gradient text, glows, halos, shine sweeps or hover lifts on the site; the chrome's glass and lift are services-site parity, not a pattern to copy.
- **Don't** set figures as big-number tiles or hero-metric templates; figures live in ruled rows or inside product cards.
- **Don't** lay content out as grids of boxed tiles where a ruled list will do.
- **Don't** let a screen grow past one viewport above 620px of height; cut copy or hide `data-optional` items instead.
- **Don't** redraw, recolor or restyle Aan, dock it on product UI, or show it docked as circle, bar or cube.
- **Don't** add idle loops, parallax, scroll pinning or scroll-scrubbing; motion follows cause and effect, once.
- **Don't** fabricate customers, testimonials, logos or prices, or show an unlabelled number in product UI.
- **Don't** use coral for buttons, headings, links or decoration.
- **Don't** bring the film's stamp red, Bodoni or grain onto site pages.

## Film: "Aan's debut" (provenance)

- Route `/film/debut` renders the reel in the villain-debut trend's grammar with a positive script (Aan, your 24/7 account manager) (`components/film/Debut.tsx`; cuts laid out from the voice in `components/film/debut-timeline.ts`); stamps use Bodoni Moda 500 in `#e3121b`, loaded only on that route.
- Every shot is drawn in code (`components/film/DebutScenes.tsx`): City Nocturne line art and the real vector Aan (`AanMascot`). The film ships no raster imagery; the earlier photographic stills were removed. `public/film/aan-debut-poster.jpg` is a frame of the film's end card.
- `public/film/aan-debut.mp4` carries an original synthesized score (`scripts/film/debut-score.mjs`; the bed ducks under the voice; master normalised to -14 LUFS) and Aan's voice-over from the Windows speech engine, Microsoft Mark, softened with SSML prosody (`scripts/film/voice-winrt.mjs`). The engine's word-boundary cues (`components/film/debut-voice.json`) set each line's length and drive the stamped words. The name is written plainly as "Aan" and spoken as one syllable. `public/film/aan-debut-instagram.mp4` is the silent master for Instagram.
- The homepage close screen plays this film in its 9:16 player (`components/home/FilmPlayer.tsx`). The earlier 90-second film route is retired.
