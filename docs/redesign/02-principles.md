# 02 · Principles: the rules this site is built by

Each principle has three parts: the rule, why it holds, and how this site applies it. They are written so someone could teach from them. The visual direction (chosen in the direction round) decides the *look*; these principles decide the *behaviour*, and they hold whichever direction wins.

---

## The twelve principles

### 1. One idea per screen
**Rule.** Every section answers one question and fits one screen: content clears the nav and the island, and nothing hangs into the next screen.
**Why.** A screen is the unit of attention. When an idea spills over, the visitor has to hold half of it in memory while scrolling, so it lands as noise.
**Here.** Ten homepage screens (down from about 23). Each screen has one belief to deliver (see `00-brief.md`). Depth moves to the product pages instead of being stacked on the homepage.

### 2. A visible order of reading
**Rule.** One primary element, two or three secondary, everything else muted. A visitor must know what to read first, second and third without thinking.
**Why.** A hierarchy is a promise about order. Equal weight everywhere reads as a data dump.
**Here.** Headline (primary) → one statement → either the product UI or the drawing (secondary) → at most three ruled points (muted). No numbered pills or eyebrow labels; the headline carries its own weight.

### 3. Proximity before containers
**Rule.** Group with space first; add a line second; add a box last, and only when the box is the real object (a product card *is* a card).
**Why.** Every box is a border the eye has to cross. Space groups silently.
**Here.** Points sit in a ruled list, not a row of cards. The proof figures sit in one ruled row, not big-number tiles. Product UI keeps its own card because in the product it is a card.

### 4. Tight within, generous between
**Rule.** One spacing scale (4px base), used as contrast: tight inside a group, generous between groups, and always more space above a heading than below it.
**Why.** Rhythm comes from the difference between intervals, not from the intervals themselves.
**Here.** Fluid vertical gaps (`--gap-s / m / l`) that shrink on short screens before anything else does.

### 5. Prove, don't claim
**Rule.** Show the mechanism working: the real interface, the real flow. Claims are limited to what is true; demonstration data is labelled.
**Why.** Sellers have heard every promise; a working alert convinces where an adjective can't.
**Here.** Each product screen shows the actual product card settling into its "handled" state. The only figures are $1.2B GMV, 500+ brands and 12.8% TACoS. UI numbers are marked as sample data.

### 6. Every drawing explains a mechanism
**Rule.** An illustration earns its place only if it shows how something works: a flow, a gate, a sweep, a ledger. Decoration is deleted.
**Why.** Meaning is what makes minimal art feel rich instead of empty.
**Here.** Signals = finding the one change across many listings. Profitability = sales stepping down through fees, ads, refunds and COGS to profit. Rules = a gate that lets good spend through and stops waste. Ask Aan = question → numbers → answer with the why. MCP = one plug serving many AI clients. Night Watch = a town Aan patrols hour by hour.

### 7. One authored moment per screen
**Rule.** Each screen gets one motion moment that carries its meaning, timed to when the screen arrives. Nothing else moves.
**Why.** When everything animates, nothing is emphasised; motion becomes weather.
**Here.** The drawing draws itself and the product card settles into its handled state, both keyed to Aan docking. No idle loops, jitter, glows, parallax or hover lifts.

### 8. Motion explains; it never decorates or hijacks
**Rule.** Movement follows cause and effect (Aan arrives, then the thing gets handled). Scrolling stays the visitor's: no pinning, snapping or scroll-scrubbing.
**Why.** Scroll-jacking takes control away; unexplained motion competes with reading.
**Here.** The Night Watch becomes a 13-second time-lapse that plays on arrival, with a scrubber the visitor controls, instead of a 4.4-screen pinned scroll.

### 9. One character, one colour
**Rule.** Coral belongs to Aan (and to risk). Periwinkle is the system's single working accent. Everything else is ink at a few strengths.
**Why.** When colour has a job, colour reads as information. Aan is the only warm thing on the page, so the eye finds Aan.
**Here.** No green, no gradients, no glows. Positive states are periwinkle; risk is coral.

### 10. The type does the work
**Rule.** Two families with clear roles: Fraunces speaks (headlines), Inter explains (everything else), Plex Mono measures (figures only). Few sizes, big steps.
**Why.** A strong type system replaces ornament.
**Here.** Display capped at 96px; headlines balanced; body 16px+ at a 65–75 character measure; tabular figures in data.

### 11. Calm is a feature, and so is access
**Rule.** Every motion has a reduced-motion alternative designed on purpose (final states with fades), not a global "off" switch. Contrast ≥4.5:1, focus rings themed, targets ≥44px, everything reachable by keyboard.
**Why.** Sophistication includes the visitor who can't or won't watch motion.
**Here.** In reduced motion the drawings appear fully drawn, the Night Watch shows the morning summary, and Aan fades between docks.

### 12. The edges are designed too
**Rule.** Selection colour, caret, scrollbars, focus rings, link underlines and table numerals are themed from the palette. A page is judged by the parts nobody planned.
**Why.** Browser defaults are the cheapest tell that a page was assembled rather than built.
**Here.** `app/styles/base.css` themes them in both light and dark.

---

## Specifications

### Grid and space
- **Container:** 1280px (matches the nav), 24px gutter (16px under 400px wide). A 12-column grid with a 24px column gap.
- **Product screens:** copy in columns 1–5 and the visual in 6–12 on every screen (one side, held consistently). On phones they stack in one column.
- **One-screen budget:** each screen sits between a top inset of 84px (nav) and a bottom inset of 90px (island). That leaves **546px** of content height at 1280×720 and 726px at 1440×900.
- **Spacing scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96px. Fluid gaps: `--gap-s` clamp(12px, 2svh, 20px), `--gap-m` clamp(16px, 3svh, 32px), `--gap-l` clamp(24px, 5svh, 56px).
- **When a screen is short:**
  1. Gaps tighten below 760px of height.
  2. Items marked optional hide below 640px of height and on phones.
  3. Product UI scales to fit its slot.
  4. A screen may grow taller than the viewport only below 620px of height or at 150% zoom and up. Anywhere else, a growing screen is a bug, fixed by editing the copy.

### Type scale
| Role | Face | Size | Notes |
|---|---|---|---|
| Display (hero h1) | Fraunces 600 | clamp(2.5rem, min(6vw, 10svh), 6rem) | Line-height 1.02, tracking ≥ −0.03em, balanced, never `nowrap` |
| Headline (screen h2) | Fraunces 600 | clamp(2rem, min(4.2vw, 7svh), 4rem) | Two short lines at most |
| Statement | Inter 400 | clamp(1.0625rem, min(1.5vw, 2.6svh), 1.5rem) | Up to 34ch; key phrases in full ink, the rest in ink-2 |
| Body | Inter 400 | 16–17px | Line-height 1.6, 65–75 characters |
| Label | Inter 600 | 13px | Sentence case, no tracking tricks |
| Figure | IBM Plex Mono 500 | per context | Tabular numerals; numbers only |

### Colour use
- Grounds and inks come from the existing tokens, unchanged. Which ground leads (dark-first or light-first) is set by the direction round from the visitor's real scene, not by habit.
- **Periwinkle:** links, primary buttons, positive states, the focal stroke of a drawing.
- **Coral:** Aan and risk only. Never a button, a heading or decoration.
- No gradients on text, no coloured halos, no glass used as decoration.

### Illustration language (holds for any direction)
- **Monoline vector SVG.** One stroke weight per drawing (1.5px at 1×, `vector-effect: non-scaling-stroke`), round caps and joins.
- **Ink:** structure at reduced ink strength; the focal path in full ink or periwinkle. **Coral only for Aan** (Aan is the real mascot, never redrawn) and for a risk mark.
- **Fills:** none, or a single 4–6% tint. No shading, gradients, shadows or glows.
- **Perspective:** one viewpoint across the whole site, chosen in the direction round.
- **Meaning test:** someone should be able to explain the mechanism from the drawing alone. If they can't, the drawing is decoration and is cut.
- **Budget:** about 40 paths or fewer per drawing. Labels are text (Inter 13px), never baked into paths.
- **Motion:** the drawing draws itself once, in reading order, when the screen arrives; reduced motion shows it drawn.
- **Aan's place:** every drawing has an `AanPerch` where Aan docks. It is always part of the drawing (the watcher, the gate keeper, the plug), never on top of product UI.

### Accessibility floor
- Contrast ≥4.5:1 for body text and ≥3:1 for large text, in both themes.
- Visible, themed focus rings on every interactive element. Targets ≥44px on touch.
- Every animation has a reduced-motion form. Nothing flashes more than three times a second.
- Product UI mocks are `aria-hidden` illustrations with a text equivalent in the copy. Drawings carry a `<title>`.
- No information appears only in Aan's bubble.
