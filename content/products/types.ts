// Shape of a dedicated product page (docs/redesign/04-screen-specs.md,
// "Product page template"). Copy comes from docs/redesign/03-copy-deck.md;
// items marked [answer needed] there are left out until the owner answers.

export type ProductId = "aan" | "signals" | "profitability" | "rules" | "mcp";

/** small line drawings that sit on the how-it-works line */
export type GlyphName =
  | "storefront"
  | "storefrontChanged"
  | "signpost"
  | "gate"
  | "buttonCheck"
  | "receipt"
  | "calendar"
  | "threeStores"
  | "speech"
  | "conditions"
  | "clock"
  | "pole"
  | "chat"
  | "sameNumber";

export type Step = { glyph: GlyphName; title: string; text: string; bubble: string };

export type Depth =
  | { kind: "shapes"; title: string; text: string; shapes: { state: "diamond" | "circle" | "bar" | "cube"; name: string; text: string }[] }
  | { kind: "brief"; title: string; text: string }
  | { kind: "ranked"; title: string; text: string }
  | { kind: "markets"; title: string; text: string; flag: string }
  | { kind: "rule"; title: string; text: string; control: string }
  | { kind: "same"; title: string; text: string; what: string };

export type ProductPage = {
  id: ProductId;
  name: string;
  meta: { title: string; description: string };
  hero: { title: string[]; lede: string; lead: "demo" | "talk"; bubble: string };
  how: { title: string; steps: [Step, Step, Step] };
  anatomy: { title: string; text: string; parts: { title: string; text: string }[]; note: string };
  depth: Depth[];
  faq: { q: string; a: string }[];
};
