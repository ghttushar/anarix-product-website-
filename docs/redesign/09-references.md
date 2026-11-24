# Phase 9 references: Superconscious (homepage) and Relay (Aan page)

The owner shared two GetLayers gallery templates on 2026-11-24:
- **Superconscious** (`Recording 2026-11-24 185332.mp4`): "structural inspiration for the website home page, how the scroll effect is working and it's a whole journey".
- **Relay** (`Recording 2026-11-24 185347.mp4`): the Aan page, "exact same design but with my colors exactly, no more no less".

Later owner decisions:
- Relay's lime becomes a mix of periwinkle and coral.
- The energy halo goes on the Signals page, not the Aan page.
- Sections Anarix has no facts for keep their layout but carry real facts: no prices, no quotes.
- The diamond burst is homepage only: Aan's hollow diamond opens, and the Anarix mark comes out of it.

Both readings below come from frames extracted at 1–3 fps.

## Superconscious → the homepage journey (structure only, our look)

| Reference beat | What it does | Anarix scene (`components/home/journey/`) |
|---|---|---|
| Hero card | A tilted image card under the headline | `HeroScreen` stays as it is (Swiss headline, clay Aan on clay store blocks) |
| Card ring | Tall cards (about 22vw) on a 3D arc that turns with scroll; giant marquee words (about 10vw) slide behind; one action pill under the ring | `ProductRing`: five product cards on a 38° arc that dwells on each card; `journey.marquee` words; the action follows the card that faces you |
| Star burst | The front card shows a sparkle outline; the star becomes a hole that grows past the edges; inside is a dark world with a particle sphere | `DiamondBurst` + `ParticleRing`: Aan's hollow coral diamond on the Ask Aan card opens (clip-path driven by `--r`); the Anarix mark rises inside |
| Manifesto | A short paragraph in the dark, with the sparkle at the top | `Manifesto`: the mark lifts; the statement lights up word by word |
| Horizontal gallery | Wide image panels with meta labels top left and big names bottom left, scrolling sideways while pinned | `NightGallery`: five hours of the night as panels with their own sky; Aan rides the timeline and acts |
| Scatter, then converge | Small images drift up past a centre card that grows | `Finale`: six fragments, one per step of the trust ladder, drift up while the centre card grows |
| Final hero | The centre card expands into the closing hero with its chrome form | `Finale` close card: "Put Aan on watch tonight.", a large clay Aan in place of the chrome form |

From the burst onward the journey stays in the dark world in both themes (`.dark` in `scenes.module.css`), as the reference goes from white into black.

## Relay → the Aan page (`components/product-page/pages/AanPage.tsx`)

**Type:**
- Headlines in medium-weight Inter (500, −0.035em), with one Fraunces italic word.
- Labels in Plex Mono, in bordered 6px pills with a glowing dot.

**Surfaces:** glass cards (`hsl(214 30% 9% / .78)` with 14px blur, 1px `hsl(0 0% 100% / .08)` border, 16–18px radius) on near-black `#07090c`.

**Colors:**

| Relay | Role | Anarix |
|---|---|---|
| Lime as action | Start free, slider, status dot, highlighted tile, featured card | Periwinkle (`hsl(230 70% 62%)`, glow `hsl(230 75% 72%)`) |
| Lime as surface | The panel that grows open, the "Pick the task" card | Coral → mauve → periwinkle (`#f46d76 → #c486c8 → #8b9cf0`), dark ink `#12101f` |
| Lime + cyan halo | The fibre ribbon behind the page | Periwinkle with coral threads (`EnergyField`, on Signals) |

**Sections** (Relay → Aan; copy in `content/products/aan-page.ts`):
1. Hero: "The handoffs run *themselves*." + workflow graph → "The account manager that *never sleeps*." + Aan's decision graph (price changed → within your rules? → flag it / ask you) + last runs (sample).
2. Connects to 240 apps → the eight places Aan watches and talks (Amazon, Walmart, Shopify, Slack, Teams, Google Workspace, Discord, MCP), shown as text tiles with a moving highlight.
3. "Most of a process is *glue*." → "Most of account management is *watching*."
4. Rows 01–03 (canvas, approvals, iso record) → worked out not guessed (analysis steps), approvals in your team chat (`SlackApproval`), every action on the record (iso bars, the last in coral-to-periwinkle).
5. The lime panel growing open with the logo tile → a coral-to-periwinkle panel, "The best fix is the one made *before you wake*.", with the Anarix tile (no diamond burst here).
6. "*Boring* in the ways that matter." → "*Careful* in the ways that matter." (one AI every store; the permission ladder as switches, sample settings).
7. "A *Tuesday*, seen from Relay." → "A *night*, seen from Aan." (bento: week grid, handled ring, waiting on you, fixes checked, stores watched; all sample).
8. Numbers with customer quotes → the three approved figures, counted up, no quotes.
9. Pricing slider and three priced plans → "Every ASIN watched, *not* just the top ten.": an ASIN slider, "Watches every one", and three tiers of how far Aan goes, each with Schedule a demo; no prices.
10. Relay card + "Pick the task you *hate* most." → the Anarix card + "Hand Aan the task you *hate* most."; the field opens Ask Aan with the task; then the status line.

Relay's own nav and footer are replaced by the site's global nav, island and footer (parity with the services site).
