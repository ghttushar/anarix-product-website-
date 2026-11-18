# 05 · Motion grammar

Motion on this site has one job: to show cause and effect. Aan arrives, then something gets handled. Nothing moves to decorate, and nothing takes the scroll away from the visitor.

## Tokens
| Token | Value | Use |
|---|---|---|
| `--dur-micro` | 160ms | hover, press, focus |
| `--dur-ui` | 320ms | state changes inside product UI |
| `--dur-reveal` | 700ms | a screen's content settling (opacity, at most a 16px rise) |
| `--dur-draw` | 1400ms | a line drawing drawing itself |
| `--dur-flight` | 450–700ms | Aan moving between docks, scaled by distance |
| `--stagger` | 90ms | between strokes or items in reading order |
| `--ease-out` | cubic-bezier(.16, 1, .3, 1) | everything that arrives |
| `--ease-inout` | cubic-bezier(.65, 0, .35, 1) | Aan's flight |

Exits run at about two-thirds the duration of entrances. The only spring on the site is Aan's own shape morph, which is part of the mascot.

## Rules
1. **One moment per screen.** It is keyed to `ScreenContext.play`, which turns true when Aan docks on that screen, or 700ms after the screen becomes active if it has no dock.
2. **Content is visible by default.** Entrances start from an already-legible state (opacity ≥ 0, never `display: none`), so nothing can get stuck hidden.
3. **Animate transform, opacity, stroke-dashoffset and clip-path only.** Never width, height, top or left.
4. **No idle loops.** Nothing animates without a cause; there are no `infinite` animations on any site page. Loops that exist (the film player) pause off screen.
5. **No scroll-jacking.** No pinning, snapping or scroll-scrubbing. The Night Watch is a time-lapse the visitor can scrub, not a scroll.
6. **No decoration.** No glows, gradients, shine sweeps, hover lifts, parallax, particles or number jitter.

## Aan
- **Docking.** The active stop is the screen crossing the middle of the viewport. Aan docks there as soon as the screen arrives, in a reserved perch inside that screen's drawing, never on product UI.
- **Flight.** A 450–700ms glide with a gentle 16px lift at the midpoint. Aan stays a diamond and doesn't spin, morph or tilt in flight. If the last dock is more than about 1.2 viewports away, the flight starts just outside the viewport edge, so Aan never streaks across the whole page.
- **Bubble.** Appears 250ms after landing and leaves at lift-off. At most 28 characters, Inter 13/600. Placed on the side the dock declares, away from text and UI.
- **Idle.** Aan's eyes follow the pointer and Aan blinks (the mascot's own behaviour). There is no float bob while docked on a site page.
- **Between pages.** No flight across a page change: Aan fades in at the first active dock of the new page.
- **Reduced motion.** Aan fades out at the old dock and in at the new one; no flight.

## The Night Watch time-lapse
- **Timing.** About 13s from 6:00 PM to 7:00 AM, starting when 60% of the screen is visible. It holds 0.9s at each event and pauses when the screen leaves view or the tab is hidden.
- **Each event.** The clock advances; the event row goes from muted to full ink; a line draws from Aan's perch to the building; Aan's bubble updates.
- **Ending.** At 7:00 AM the morning brief replaces the town's detail and a Replay button appears.
- **Scrubber.** An `<input type="range">` with `aria-valuetext` (for example "11:04 PM"), 15-minute keyboard steps and tick buttons for each event. Grabbing it pauses the playback.
- **Reduced motion.** Starts at 7:00 AM; scrubbing jumps with crossfades.

## Line drawings
- **Draw-on.** Each stroke has `pathLength="1"` and animates `stroke-dashoffset` 1 → 0 over `--dur-draw`, staggered in reading order.
- **Gating.** Strokes are hidden only when JavaScript is running and motion is not reduced. Without JavaScript or with reduced motion, the drawing is simply there.
- **Once.** A drawing draws once per page view, not again on every scroll past.

## Product UI moments
- Each card settles once into its handled state:
  - **Signals:** −$136 at risk → +$1,651 protected; Execute → Executed.
  - **Profitability:** net profit counts up.
  - **Rules:** statuses turn Active.
  - **Ask Aan:** the answer types in.
  - **MCP:** the answer appears.
- `CountUp` is a one-shot tween. The final value is server-rendered and figures are in tabular numerals.

## Reduced motion (an alternative, not an off switch)
- Final states are shown: drawings complete, cards handled, the night at morning.
- Opacity fades of ≤200ms are kept so changes still read as changes. Movement is removed.
- The film never autoplays; it shows the poster with a play control.
