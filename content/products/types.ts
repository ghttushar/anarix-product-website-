// The five product pages. Each page has its own place on the street, its own
// camera, layout and hands-on moment (components/product-page/pages/*); this
// is only the words they share a shape for. Copy: docs/redesign/03-copy-deck.md;
// items marked [answer needed] there stay off the pages.

export type ProductId = "aan" | "signals" | "profitability" | "rules" | "mcp";

export type ProductPage = {
  id: ProductId;
  /** the page's name: the biggest thing on the page */
  name: string;
  slogan: string;
  /** one line, 20 words or fewer; **phrase** is set in full ink */
  line: string;
  /** what Aan says in the hero, 28 characters or fewer */
  bubble: string;
  meta: { title: string; description: string };
  /** the hands-on screen: a headline and one instruction */
  moment: { title: string; hint: string; note: string };
  /** the one proof screen */
  proof: { title: string; line: string; note: string };
  close: { title: string };
  faq: { q: string; a: string }[];
  /** the product tour; until a recording exists the hero shows the drawing in its frame */
  video?: { src: string; poster?: string };
  /** how it works: a hook and three (or four) steps */
  how: { title: string; steps: Point[] };
  /** what it does: a hook, one intro line and six capabilities */
  does: { title: string; intro: string; items: Point[] };
  /** what it works with, as named groups (text only, never logos) */
  works: { label: string; items: string[] }[];
};

/** a short title and one line under it */
export type Point = { t: string; d: string };
