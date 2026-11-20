# 07 · Sitewide UX/UI audit (Phase 7)

**Date:** 2026-11-19.

> **Note (2026-11-20):** the visual direction recorded here (soft isometric drawings) was replaced in Phase 8. The owner read the isometric drawings as "an electronic circuit website". Phase 8 uses Swiss type, long-exposure light, the product UI as the visuals, and a limbless clay Aan that acts through motion. The content, UX and bug fixes below all stand.

**Brief:** the owner said "some things don't make sense" and asked for three things:
- a sitewide UI/UX audit, with issues and solutions;
- ten creative additions that fit without looking overdone;
- every graphic scored as a professional designer would, sorting what fits from what is noise.

**Method:** three independent design reviews (homepage, product pages, graphics), each working from screenshots at five viewports and from the code, plus my own review. The fixes listed here are on branch `redesign/p7-audit`.

## Verdict

**What was strong already:**
- the typography;
- the mock product UI;
- the Night Watch;
- the MCP wiring map;
- the Rules builder.

**What failed:**
- **Repetition:** the same drawings, the "always on" line and Aan's stops all came back again and again.
- **Placeholder chrome:** "coming soon" pills, the Tour placeholder and decorative glyphs.
- **A handful of visible bugs.**
- **Missing buyer basics:** no price, setup, data-handling or real proof.

## Owner decisions

| Question | Decision |
|---|---|
| The travelling Aan | Fewer stops. Every bubble carries a fact or a number. |
| Video space | Frames stay quiet, with no pill. The homepage Tour appears only once its recording exists. |
| Homepage | Restructured from 12 screens to 9. |
| "Aan's debut" film | To be re-cut in the Phase 8 style. Mark's voice and the script are kept. |

## Graphics scorecard (out of 10)

| Graphic | Before | Verdict | What changed |
|---|---|---|---|
| Rule builder (Rules) | 9 | Keep | — |
| NightBoard (home Night Watch) | 8 | Keep | Its second use (Signals How) was cut. |
| WiringMap (MCP hero, 2D) | 8 | Keep | The storybook awnings were removed. |
| RankedList (Signals) | 8 | Keep | Coral is now used for High only. The "By money at risk" label swap is fixed. |
| MarketTable, AI tabs, "=" tile | 8 | Keep | Labels set in Inter. |
| Decision log (Rules) | 8 | Keep | "Held" is now neutral, not coral. |
| Morning brief letter (Aan) | 8 | Keep | Stray signature marks fixed. "Approve" works. |
| McpTerminal | 8 | Keep | — |
| PlatformStack (home hero) | 7 | Fixed | Plain tool blocks named by a legend, with a phone legend. |
| StoreTile | 7 | Keep | The selected border is now periwinkle. |
| Receipt and split bar (Profitability) | 7 | Fixed | Costs not yet taken out are slate. The checkbox is periwinkle. The margin shows only at the end. |
| Ask Aan chat | 7 | Fixed | Answers show their receipts: a chart and sources. |
| McpPole | 7 (home), 5 (How) | Fixed | Added "Your agent" and 12px labels. Cut from MCP How. |
| RuleGate | 6 | Fixed | The skewed lettering is gone. The callout sits below the tray. |
| Guardrails | 6 | Fixed | Home only, as the Trust visual, with short leaders. |
| SignalCard | 6 | Fixed | No longer counts through zero. Execute is a real button. |
| SignalsBoard | 5 | Fixed | One overlay, the callout. No bubble beside it. |
| ProfitStack | 5 | Fixed | Now a waterfall: a ghost sales column with the profit inside. |
| Home Aan chat | 5 | Fixed | The answer is an Inter card with a chart and sources, shown in full. |
| AanConsole (Aan hero) | 4 | Cut | Replaced by "Aan in Slack", holding a change above your limit. |
| Tour glyphs | 4 | Fixed | Numbered type instead of glyphs. |
| Close glyphs | 3 | Cut | — |
| "Coming soon" pills | 3 | Cut | — |
| Meet Aan film | 3 | Pending | To be re-cut in the Phase 8 style once that is signed off. The isometric redraw was dropped. |

## Rules adopted

- One overlay per drawing.
- Labels go in margin tags. Face text is used only for store names.
- Coral means risk, nothing else.
- Big figures are set in Plex Mono.
- Aan docks only where it means "Anarix did this":
  - **Homepage stops:** the hero, the Night Watch, and the film.
  - **Product pages:** one or two stops each.
- Every bubble carries a fact.
- Aan's greeting in the hero is the one exception to the fact rule.

## Findings fixed

### Bugs
- The signal card's figure counted through zero ("−$1,092 protected").
- The ranked list's label never swapped.
- MCP said "$3,412 yesterday" against Profitability's $288 day. MCP now says "this month".
- The Night Watch "$1,240 saved" didn't add up. It is now itemised: $86 + $412 + $380 = $878 protected.
- Stray dashes on the morning brief's signature, and a dead "Approve" link.
- Profitability showed "Margin 78%" mid-animation.

### Homepage (12 → 9 screens)
1. Hero, with the proof figures under the buttons.
2. Night Watch, ending on the itemised brief.
3. Signals.
4. Profitability.
5. Rules.
6. Ask Aan.
7. Trust (the permission ladder beside the Guardrails drawing).
8. MCP, with what Anarix plugs into.
9. Close: "Put Aan on watch tonight", with the film.

The Mission and Works-with screens are folded in. "AI for good" is retitled.

### Product pages
- How it works folds into each hands-on moment as a step rail. It stays a separate screen only where it adds facts: the Profitability cost sources and the MCP setup.
- The closes now carry:
  - the permission ladder (Signals, Rules, Aan);
  - "Next: [product]" links;
  - an Ask Aan chat seeded with the page's own questions.
- MCP explains what MCP is on screen 2.

### Copy
- One demo label everywhere: "Schedule a demo", matching the nav.
- Slogan bubbles replaced by facts.
- "Rules that run on your schedule, as often as every hour."
- "79 ways things go wrong, caught early."
- "Answers you can check. Changes you approve."

## The ten additions

1. **Morning-brief payoff.** The Night Watch ends on an itemised brief.
2. **One store, one night.** Every sample comes from the same kitchenware store's night, and each page hands on to the next product.
3. **Permission ladder.** Watch → Suggest → Act within your rules → Wait above your limit → Undo within 30s → Checked over 7 days.
4. **Proof it worked.** A 7-day chart on the Signals proof screen.
5. **Aan in Slack.** A held $600/day change, with Approve and Keep. It is the Aan hero.
6. **Answers with receipts.** A mini chart and sources under every Ask Aan answer.
7. **MCP setup, copy-ready.** Each AI's setup path plus a copy button for the server address.
8. **Page-aware Ask Aan.** "Talk to Aan" opens with that page's questions.
9. **Profit waterfall.** Revenue finally drawn, as a ghost sales column.
10. **"After you book" strip.** Not built yet: it waits for the owner's facts.

## Still needs the owner (nothing invented)

- **Pricing stance:** "talk to us", or plans.
- **Setup:** how long it takes, and the access needed per marketplace. Addition 10 depends on this.
- **Data:** how Aan uses and protects it.
- **Limits:** what Aan never does.
- **MCP:** what it can see and change. The tool panel still shows four sockets.
- **Proof:** one real customer figure from the Services case studies.
- **Video:** the product-tour recordings, which go in `public/video/<id>.mp4`.
