# Anarix Platform website

The SaaS/platform marketing site, served at **anarix.ai/platform**. The services site (www.anarix.ai) stays where it is. CloudFront routes `/platform/*` to this project on Vercel.

- **Stack:** Next.js (App Router), plain CSS design tokens, GSAP for count-ups. `basePath: "/platform"`.
- **Look:**
  - Page body: the Anarix revamp brand manual (cream `#FBFAF8`, coral `#F26E77`, blue `#4A62D9`; Space Grotesk, Manrope, IBM Plex Mono).
  - Nav bar and action island: ported 1:1 from the services site, in light and dark variants.

## Run

```bash
npm install
npm run dev     # http://localhost:3000/platform
npm run build
```

## Homepage story

| # | Section | Component |
|---|---------|-----------|
| 1 | Lazy Susan hero: flick to spin, snaps to a sector. It doubles as the jump bar and spins on an MCP spindle | `components/hero/LazySusan.tsx` |
| 2 | Product film slot | `app/page.tsx` |
| 3–6 | Signals · Profitability · Rules · Aan. Aan docks and each station powers up | `components/sections/Features.tsx` |
| 7 | MCP roots | `components/sections/McpSection.tsx` |
| 8 | The Night Watch: scroll scrubs 6pm → 7am | `components/night/NightWatch.tsx` |
| 9 | AI for good + CTA, footer | `components/sections/Closing.tsx` |

### How Aan travels

`components/aan/AanTraveler.tsx` renders one fixed Aan.

- Each `<section data-stop>` has one `[data-dock]` element.
- When the next dock rises into view, Aan lifts off (bar state), arcs over, lands (the dock's `data-state`) and sets `data-powered="true"` on the section. CSS and `usePowered()` light the station up.
- Docks are measured live, so docks inside the 3D turntable and the sticky Night Watch scene work.
- Dock attributes: `data-size` / `data-size-sm`, `data-state` (`diamond | circle | bar | cube`), `data-bubble`. Sections can override Aan's state with `window.dispatchEvent(new CustomEvent("aan:override", { detail: { stop, state } }))`.
- The same loop flips the nav and island to dark over `[data-surface="dark"]`.

### Media placeholders

`MediaSlot` (`components/sections/shared.tsx`) draws labeled empty frames. Swap each one for a `<video>` or `<img>` once real product footage and screenshots exist.

## Deploy (Vercel + CloudFront)

1. Import this repo into Vercel. The site is live at `<project>.vercel.app/platform`.
2. In the existing anarix.ai CloudFront distribution:
   - Add a custom origin pointing to the Vercel domain (HTTPS only).
   - Add behaviors `/platform` and `/platform/*` → that origin.
   - Use origin request policy **AllViewerExceptHostHeader**, and caching that respects origin headers.
3. The distribution's custom error responses (403/404 → `/index.html`, used by the services SPA) apply to every behavior. Move that fallback into a CloudFront Function on the default behavior only, so platform 404s aren't replaced by the services page.
