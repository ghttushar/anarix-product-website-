# 04 · Screen specs

Every screen is written against the smallest supported desktop: **1280×720, with 546px of content height** between the nav inset (84px) and the island inset (90px). Larger screens get more air, not more content. Phones (390×844, about 670px of budget) follow each screen's phone rule.

Each spec states:
- **Budget:** how the height is spent.
- **Zones:** what goes where on the 12-column grid.
- **Drawing:** the mechanism the line art depicts.
- **Moment:** the single motion moment.
- **Reduced:** what reduced motion shows instead.
- **Aan:** the dock position and the bubble.
- **Phone:** what stacks or hides on a phone.

Items marked *optional* hide below 640px of height and on phones.

---

## Homepage

### 1 · Hero
- **Zones.** Copy in columns 1–6 (h1, lede, actions). The hero visual in columns 7–12 sits in its own grid area with a 24px gap, so overlap is impossible by construction.
- **Budget.** h1 3 lines × ≤96px ≈ 300px; lede ≈ 72px; actions 52px; gaps ≈ 90px. That is about 514px, which fits 546.
- **Drawing.** The new hero concept from the direction round. It must say "one AI watching every marketplace, always on" without words.
- **Moment.** The drawing draws itself, then Aan settles into its place and the bubble appears.
- **Reduced.** The drawing is static; Aan is already docked; the bubble shows.
- **Aan.** Docked inside the hero drawing at 96–104px, bubble "I'm Aan. The Guardian of your Business!" placed on the side away from the h1.
- **Phone.** Copy first, the visual below at ≤34svh, actions above the fold.

### 2 · Mission + proof
- **Zones.** The statement spans columns 1–10. The ruled proof row (4 items) spans the full container directly beneath it, separated by `--gap-l`.
- **Budget.** Statement (≤4 lines at clamp 36–56px) ≈ 230px; gap 56; proof row ≈ 110px. That is about 400px.
- **Drawing.** None. This screen is pure type.
- **Moment.** The proof figures count up once (`CountUp`, 900ms), in reading order.
- **Reduced.** The final figures are shown.
- **Aan.** No dock here; Aan stays at the hero.
- **Phone.** The proof row becomes a 2×2 ruled grid.

### 3 · The Night Watch
- **Zones.** Columns 1–5: h2, statement, the clock (Fraunces), the 5-event list, the scrubber and Replay. Columns 6–12: the line-art night town (home, store, ads billboard, warehouse, a patrol path).
- **Budget.** h2 ≈ 130; statement ≈ 60; clock ≈ 70; list ≈ 150; scrubber ≈ 44. That is about 454px.
- **Drawing.** A town at night. Aan patrols a path between the four places where the night's events happen. Each event draws a short line from Aan to its building.
- **Moment.** A 13-second time-lapse, 6:00 PM → 7:00 AM, starting when 60% of the screen is visible. It holds about 0.9s at each event, then shows the morning brief.
- **Reduced.** Starts at 7:00 AM with the brief; scrubbing jumps with crossfades.
- **Aan.** A perch on the patrol path; the bubble shows each event's line. It never covers the event list.
- **Phone.** The town at ≤34svh, then the clock, the current event and the scrubber. The full list lives in the scrubber ticks.

### 4 · AI for good
- **Zones.** Columns 1–7: "AI for good." (largest type on the page after the hero, ≤96px) and "Built to give you your nights back." Columns 8–12: three ruled commitments (bold lead + one sentence each).
- **Budget.** About 380px.
- **Drawing.** Optional, small: a closed laptop and a moon. The night is given back. Cut it if it competes with the type.
- **Moment.** None beyond the commitments appearing in reading order.
- **Reduced.** Static.
- **Aan.** A perch beside the headline, bubble "Your nights are yours."
- **Phone.** Stacked.

### 5–9 · Product screens (Signals, Profitability, Rules, Ask Aan, MCP)
One template, held identically on all five screens.
- **Zones.**
  - Columns 1–5, top to bottom: h2 (2 lines) → statement (≤3 lines) → 3 ruled points (the third is *optional*) → "Explore …" link.
  - Columns 6–12: the product UI card in `UiFrame`, and the line-art drawing (max 18svh) as a strip *beside or beneath* it, never behind it.
- **Budget.** Copy: h2 ≈ 140; statement ≈ 90; points ≈ 130; link ≈ 24; gaps ≈ 100. That is about 484px. Visual: the UI card scales to ≤ 360px tall plus the drawing ≤ 130px.
- **Drawings:**
  - **Signals:** a field of listing tiles across three marketplace rows. One sweep line finds the single tile that changed, and a leader line runs from it to the alert.
  - **Profitability:** one continuous line that starts at "Sales" and steps down through fees, ads, refunds and COGS to land on "Profit".
  - **Rules:** a stream of spend passing a gate. Good spend continues on the periwinkle path; waste diverts to a stopped path and ends.
  - **Ask Aan:** a question line enters Aan and leaves as an answer line carrying three numbers ("the why").
  - **MCP:** one Anarix socket, with three cables out to Claude, ChatGPT and Gemini, plus a fourth to "your agent".
- **Moment.** Aan docks in the drawing, the drawing completes, then the card settles into its handled state, once:
  - **Signals:** −$136 at risk → +$1,651 protected, Execute → Executed.
  - **Profitability:** the net profit counts up.
  - **Rules:** the rule statuses go Active.
  - **Ask Aan:** the answer types in.
  - **MCP:** the answer appears.
- **Reduced.** The handled state is shown and the drawing is complete.
- **Aan.** Docked in the drawing's perch, never on the card. Bubbles: "Found it. Here's why." / "Counting every fee." / "Good spend in. Waste out." / "Thinking with your data." / "Plugged in."
- **Phone.** h2 → statement → the card scaled to the width → link. The points collapse to one line; the drawing is *optional*.

### 10 · Meet Aan + close
- **Zones.** Columns 1–6: h2 "Meet Aan.", the body (≤4 lines), the actions, the Services cross-link. Columns 8–12: the vertical film player (9:16, height ≤ the content budget).
- **Budget.** About 360px of copy against the player's ≤546px.
- **Moment.** The film plays muted when in view; "Watch with sound" restarts it.
- **Reduced.** No autoplay; the poster with a play button.
- **Aan.** Docked beside the actions, bubble "Ready when you are."
- **Phone.** Copy, then the player at ≤60svh.

### Footer
Compact: brand line, Platform links (to the pages), Services, Company. It isn't a screen and has no budget.

---

## Product page template (`/platform/[product]`)
Each chapter is one screen, built against the same budget.
1. **Page hero.** h1 (the product's headline), lede, the product drawing at full scale with Aan docked, actions.
2. **How it works.** Three steps (Watch → Explain → Act, or the product's own three), each with a small line drawing on one continuous line.
3. **Anatomy.** The product UI at a readable size, with ≤5 numbered callouts drawn as leader lines. On phones the callouts become a numbered list under the UI.
4. **Depth chapter(s).** One or two screens from the copy deck (ranked by money at risk; the profit line; rules in plain words; Aan's shapes; MCP in use).
5. **FAQ.** ≤5 questions using exclusive `<details>`. Opening one never pushes the screen past one viewport: answers stay at ≤3 lines.
6. **CTA screen.** "Let Aan take the night shift." Book a demo / Talk to Aan / Services cross-link.
