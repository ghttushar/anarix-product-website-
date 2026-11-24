// The Aan page in the Relay design (Phase 9, docs/redesign/09-references-aan.md).
// Relay's sections in Relay's order, carrying Aan's facts only: the product
// copy comes from pages.ts (aan) and the copy deck. One word per headline is
// set in italic serif (*word*). No prices, no customer quotes; every number
// in the product UI is sample data and says so.

export const aanPage = {
  hero: {
    pill: "24/7 / Amazon, Walmart and Shopify",
    title: ["The account manager", "that *never sleeps*."],
    line: "Aan is the AI inside Anarix. It watches your stores around the clock, explains what changed and why, and acts within your rules.",
    primary: { label: "Schedule a demo", href: "https://www.anarix.ai/contact-us" },
    note: "watches every store / acts within your rules / every action logged",
    flow: {
      title: "Price undercut on Shopify",
      meta: "3 steps / 1 branch",
      state: "watching",
      nodes: {
        start: { t: "Price changed", d: "shopify" },
        check: { t: "Within your rules?", d: "your limits" },
        yes: { t: "Flag it", d: "with the money at risk" },
        no: { t: "Ask you", d: "waiting on a yes" },
      },
      runs: [
        { time: "11:04 PM", what: "flagged a $3 undercut", took: "Shopify" },
        { time: "2:14 AM", what: "paused “chef knife 8 inch”", took: "Amazon" },
        { time: "4:40 AM", what: "drafted a reorder", took: "Amazon" },
      ],
    },
  },
  connects: {
    label: "watches Amazon, Walmart and Shopify, and talks where your team already does",
    tiles: [
      { k: "AM", t: "amazon" },
      { k: "WM", t: "walmart" },
      { k: "SH", t: "shopify" },
      { k: "SL", t: "slack" },
      { k: "MT", t: "teams" },
      { k: "GW", t: "google workspace" },
      { k: "DC", t: "discord" },
      { k: "MCP", t: "claude, chatgpt, gemini" },
    ],
  },
  glue: {
    pill: "account management",
    title: "Most of account management is *watching*.",
    line: "Checking prices at midnight. Re-reading the ad report. Spotting the stock-out before it happens. Aan does the watching and leaves you the decisions.",
  },
  rows: [
    {
      n: "01",
      t: "Worked out, not guessed",
      d: "Ask in plain words. Aan runs the analysis on your own data and shows where each number came from.",
    },
    {
      n: "02",
      t: "Approvals where your team already is",
      d: "Anything above your limit waits in your team chat until someone says yes, with the reason it was held.",
    },
    {
      n: "03",
      t: "Every action is on the record",
      d: "Each change Aan makes is logged with its reason, and every fix is checked over the next seven days.",
    },
  ],
  analysis: {
    q: "Why did ROAS drop on Walmart yesterday?",
    steps: [
      { t: "read ads · walmart", v: 0.92, took: "1.2 s" },
      { t: "compare to 7-day average", v: 0.64, took: "0.8 s" },
      { t: "find the cause", v: 0.4, took: "0.6 s" },
      { t: "draft the fix", v: 0.18, took: "0.3 s" },
    ],
    axis: ["0", "1 s", "2 s", "3 s"],
  },
  record: {
    head: "actions this week · sample",
    days: [
      { d: "mon", v: 0.42 },
      { d: "tue", v: 0.55 },
      { d: "wed", v: 0.48 },
      { d: "thu", v: 0.62 },
      { d: "fri", v: 0.7 },
      { d: "sat", v: 0.86 },
    ],
  },
  panel: {
    label: "what aan is for",
    title: ["The best fix is the one", "made *before you wake*."],
  },
  careful: {
    pill: "guardrails",
    title: "*Careful* in the ways that matter.",
    line: "Rules you set, limits you choose, and a log of everything. Aan is exciting to watch and boring to trust.",
    cards: [
      { t: "One AI, every store", d: "The same Aan watches Amazon, Walmart and Shopify, and answers in Anarix, in your team chat and in your AI through MCP." },
      { t: "Goes only as far as you allow", d: "Watching, suggesting and acting within your rules are on; bigger changes wait for you." },
    ],
    ladder: [
      { t: "Watches", on: true },
      { t: "Suggests", on: true },
      { t: "Acts within your rules", on: true },
      { t: "Waits above your limit", on: true },
    ],
  },
  night: {
    pill: "the night shift",
    title: "A *night*, seen from Aan.",
    line: "The screen your team reads at nine: what changed overnight, what Aan handled, and the one thing that waits for you.",
  },
  numbers: {
    pill: "proof",
    title: "Numbers we did *not* have to dress up.",
    line: "The three figures we stand behind, across the brands Anarix works with.",
    stats: [
      { value: 12, format: "billions", label: "GMV driven for the brands Anarix works with" },
      { value: 500, format: "plus", label: "brands managed across Amazon and Walmart" },
      { value: 128, format: "percent", label: "average TACoS across the brands we manage" },
    ],
  },
  plans: {
    pill: "your catalog",
    title: "Every ASIN watched, *not* just the top ten.",
    line: "Tell us how big your catalog is and we will show you Aan on it in a demo.",
    ask: "How many ASINs do you sell?",
    min: 100,
    max: 100000,
    start: 12000,
    yours: { k: "your aan", t: "Watches every one", d: "around the clock, on every store" },
    tiers: [
      { t: "Watches", d: "Every price, Buy Box, budget and stock level, on every store.", items: ["What changed, and why", "Root cause and money at risk", "Biggest risk first"] },
      { t: "Acts within your rules", d: "Changes your rules allow, as often as every hour.", items: ["Rules in plain words", "Checked for conflicts", "Undo for 30 seconds"], featured: true },
      { t: "Waits above your limit", d: "Bigger changes hold until someone says yes.", items: ["Approve from your team chat", "Every action logged", "Fixes checked over 7 days"] },
    ],
  },
  cta: {
    lead: "Anarix",
    blurb: "The AI account manager for Amazon, Walmart and Shopify.",
    label: "what now",
    title: "Hand Aan the task you *hate* most.",
    line: "Describe one job nobody enjoys doing by hand. Aan will tell you how it would handle it.",
    placeholder: "Describe the task",
    button: "Ask Aan",
  },
  status: ["aan on watch", "amazon, walmart and shopify", "every action logged"],
} as const;

/** split "*word*" into plain and italic-serif parts */
export function accent(text: string): { em: boolean; text: string }[] {
  return text.split(/(\*[^*]+\*)/g).filter(Boolean).map((p) => (p.startsWith("*") ? { em: true, text: p.slice(1, -1) } : { em: false, text: p }));
}
