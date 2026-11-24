// Homepage copy (docs/redesign/03-copy-deck.md). Words live here so they can be
// edited without touching layout. Phrases wrapped in **double asterisks** are
// set in full ink inside grey prose.

export const hero = {
  title: ["One AI.", "Every marketplace.", "Always on."],
  lede: "Aan is your **24/7 e-commerce account manager**. It watches your Amazon, Walmart and Shopify accounts around the clock and acts before problems cost you.",
  primary: { label: "Schedule a demo", href: "https://www.anarix.ai/contact-us" },
  secondary: { label: "Meet Aan", href: "/aan" },
  bubble: "I'm Aan, the guardian of your business.",
};

/** the three approved figures, under the hero's buttons */
export const proof = {
  items: [
    { figure: "$1.2B", text: "GMV driven for the brands Anarix works with", short: "GMV driven" },
    { figure: "500+", text: "brands managed across Amazon and Walmart", short: "brands managed" },
    { figure: "12.8%", text: "average TACoS across the brands we manage", short: "average TACoS" },
  ],
};

export const night = {
  kicker: "One night with Aan",
  title: "You sleep. Aan doesn't.",
  statement: "One night on one account. Aan keeps watch from close to open, handles what your rules allow and leaves you a short brief for the morning.",
  note: "A sample night. Figures are illustrative.",
  /** the story, one chapter per scroll step; m is minutes after 6 PM */
  chapters: [
    { m: 180, time: "9:00 PM", head: "Lights out. Aan on watch.", line: "Three stores, all quiet. Aan reads every change as it lands.", act: "idle" },
    { m: 304, time: "11:04 PM", head: "Price undercut. Flagged.", line: "A rival dropped $3 below you on Shopify. Aan flags it with the money at risk.", act: "point", row: 0 },
    { m: 494, time: "2:14 AM", head: "$86 wasted. Paused.", line: "An ad spent $86 with no sales. Your rules allow a pause, so Aan pauses it.", act: "press", row: 1 },
    { m: 640, time: "4:40 AM", head: "Low stock. Reorder drafted.", line: "Six days of stock left at this pace. Aan drafts the reorder for you to send.", act: "work", row: 2 },
    { m: 780, time: "7:00 AM", head: "2 fixes, 1 flag. $466 protected.", line: "The brief is waiting when you wake. One change waits for your yes.", act: "celebrate" },
  ],
  /** what Aan sees overnight, as rows in Signals */
  rows: [
    { where: "Shopify · Pricing", text: "Rival price $3 below yours", action: "Flag", done: "Flagged" },
    { where: "Amazon · Ads", text: "“chef knife 8 inch”: $86 spent, 0 sales", action: "Pause", done: "Paused" },
    { where: "Amazon · Inventory", text: "6 days of stock left", action: "Draft reorder", done: "Drafted" },
  ],
  stores: ["Amazon", "Walmart", "Shopify"],
  /** the brief Aan leaves at 7:00 AM: the fixes add up to the total; a flag
      shows the money at risk and is not counted as protected */
  brief: {
    title: "Your morning brief",
    items: [
      { time: "11:04 PM", text: "Flagged a $3 undercut on Shopify", v: 412, fix: false },
      { time: "2:14 AM", text: "Paused “chef knife 8 inch”: $86 spent, no sales", v: 86, fix: true },
      { time: "4:40 AM", text: "Drafted a reorder: 6 days of stock left", v: 380, fix: true },
    ],
    held: "Needs you: move $400 a day to Sponsored Brands",
    total: "protected overnight",
  },
} as const;

/** why you can trust Aan with your accounts: how far it goes, step by step */
export const trust = {
  title: "You stay in charge.",
  line: "Aan only goes as far as your rules allow, and every step it takes can be checked.",
  ladder: [
    { t: "Watches", d: "Prices, Buy Box, ads, listings and stock, on every store." },
    { t: "Suggests", d: "A fix with its reason, its confidence and its risk." },
    { t: "Acts within your rules", d: "Only the changes your rules allow." },
    { t: "Waits above your limit", d: "Bigger changes hold until you say yes." },
    { t: "Can be undone", d: "For 30 seconds after any action runs." },
    { t: "Is checked", d: "Every fix is verified over the next 7 days." },
  ],
};

export type ProductCopy = {
  id: "signals" | "profitability" | "rules" | "aan" | "mcp";
  /** the product's name, over the hook */
  kicker: string;
  title: [string, string];
  statement: string;
  /** three things it does: a short title and one line */
  points: { t: string; d: string }[];
  link: { label: string; href: string };
  bubble: string;
};

export const products: ProductCopy[] = [
  {
    id: "signals",
    title: ["3am change.", "9am answer."],
    kicker: "Signals",
    statement: "Signals watches every price, Buy Box, budget and stock level, and tells you **what changed and why**.",
    points: [
      { t: "What changed, and why", d: "Every signal comes with its root cause and the money at risk." },
      { t: "Biggest risk first", d: "Signals rank themselves by dollar impact." },
      { t: "Fixed from the alert", d: "Run the fix, assign it or snooze it, right where you read it." },
    ],
    link: { label: "Explore Signals", href: "/signals" },
    bubble: "Found it. Here's why.",
  },
  {
    id: "profitability",
    title: ["Revenue lies.", "Profit doesn't."],
    kicker: "Profitability",
    statement: "Sales look great until fees, ads, refunds and COGS take their share. See **true profit on every product, every day.**",
    points: [
      { t: "Every cost line", d: "Fees, commissions, shipping, refunds, taxes, promotions, ads and COGS." },
      { t: "Every product, every day", d: "Net profit and margin per product, updated daily." },
      { t: "One view", d: "A dashboard, trends and a full P&L for each marketplace." },
    ],
    link: { label: "Explore Profitability", href: "/profitability" },
    bubble: "Counting every fee.",
  },
  {
    id: "rules",
    title: ["Your playbook.", "On autopilot."],
    kicker: "Rules",
    statement: "Write how you run your accounts **in plain words**. Aan turns it into rules that run on your schedule, as often as every hour.",
    points: [
      { t: "Plain words in", d: "Describe the rule; Aan builds the conditions, scope and schedule." },
      { t: "Checked before it runs", d: "Aan audits every rule for conflicts." },
      { t: "You set the limit", d: "Changes above it wait for your approval." },
    ],
    link: { label: "Explore Rules", href: "/rules" },
    bubble: "Good spend in. Waste out.",
  },
  {
    id: "aan",
    title: ["Ask anything.", "Get the why."],
    kicker: "Ask Aan",
    statement: "Ask like you'd ask your best account manager, and get **a plain answer with the numbers behind it**.",
    points: [
      { t: "The numbers behind it", d: "Answers come with their sources, as tables, charts or reports." },
      { t: "Inside everything", d: "Aan is in every alert, meeting, task and rule." },
      { t: "Acts when you say yes", d: "Proposed campaign changes apply only after you approve them." },
    ],
    link: { label: "Explore Ask Aan", href: "/aan" },
    bubble: "Thinking with your data.",
  },
  {
    id: "mcp",
    title: ["Your data.", "Any AI."],
    kicker: "Anarix MCP",
    statement: "Plug your live marketplace data into Claude, ChatGPT, Gemini or your own agent, with **the same numbers as your dashboard**.",
    points: [
      { t: "Any AI", d: "Claude, ChatGPT, Gemini, or your own agent." },
      { t: "Same numbers", d: "The answer in your AI matches the tile in Anarix." },
      { t: "Where you already work", d: "Answers inside the AI chat your team already has open." },
    ],
    link: { label: "Explore MCP", href: "/mcp" },
    bubble: "Plugged in.",
  },
];

/** the product tour, after the hero; until the recording exists the frame shows its chapters */
export const tour = {
  title: "See Anarix at work.",
  line: "From the overnight change to the morning fix: Signals, profit, rules, and asking Aan.",
  chapters: [
    { id: "signals", name: "Signals", d: "What changed overnight, and why" },
    { id: "profitability", name: "Profitability", d: "What you really made" },
    { id: "rules", name: "Rules", d: "Your playbook, running" },
    { id: "aan", name: "Ask Aan", d: "Answers with the numbers" },
  ],
  video: undefined as { src: string; poster?: string } | undefined,
};

/** where Anarix plugs in: names as text, never logos */
export const works = {
  title: "Works where you already work.",
  line: "Your marketplaces in. Alerts, answers and approvals out, to the apps your team lives in and the AI you already use.",
  groups: [
    { label: "Marketplaces", items: ["Amazon", "Walmart", "Shopify"] },
    { label: "Team apps", items: ["Slack", "Microsoft Teams", "Google Workspace", "Discord", "Zoom Team Chat", "WhatsApp"] },
    { label: "AI, through MCP", items: ["Claude", "ChatGPT", "Gemini", "Your own agent"] },
  ],
};

export const close = {
  title: "Put Aan on watch tonight.",
  body: "Aan reads every change across your Amazon, Walmart and Shopify accounts, explains it in plain words and acts within the rules you set. Watch its debut.",
  primary: { label: "Schedule a demo", href: "https://www.anarix.ai/contact-us" },
  secondary: "Talk to Aan",
  services: { lead: "Rather we run it for you?", label: "See Anarix Services", href: "https://www.anarix.ai" },
  bubble: "Ready when you are.",
};

/** the homepage as one scroll journey (Phase 9): the words that slide behind
    the product ring, the order the ring turns in (it settles on Aan, whose
    diamond the page bursts through), and what Aan is, read word by word */
export const journey = {
  marquee: ["One AI", "Every marketplace", "Always on", "Amazon", "Walmart", "Shopify"],
  ringOrder: ["signals", "profitability", "rules", "mcp", "aan"] as const,
  manifesto:
    "Aan is your 24/7 e-commerce account manager. It watches your Amazon, Walmart and Shopify accounts around the clock, explains what changed and why, and acts within the rules you set. Bigger changes wait for your yes. Every action is logged, and every fix is checked over the next seven days.",
};

/** the homepage in the AI Studio design (Phase 10): every product, one scroll */
export const layers = {
  hero: {
    title: ["One AI.", "Every marketplace."],
    lede: "Always on. Anarix watches your Amazon, Walmart and Shopify accounts around the clock: what changed, what you really made, what your rules should do, and the answer to any question.",
    primary: { label: "Schedule a demo", href: "https://www.anarix.ai/contact-us" },
    secondary: { label: "Meet Aan", href: "/aan" },
    corner: ["Amazon, Walmart and Shopify,", "watched around the clock."],
  },
  marquee: ["One AI", "Every marketplace", "Always on", "Amazon", "Walmart", "Shopify"],
  explore: { label: "Explore the platform", href: "#products" },
  manifesto: [
    "Anarix is one AI over every marketplace you sell on. Signals tells you what changed overnight and why. Profitability shows what you really made after every fee. Rules runs your playbook while you sleep.",
    "Ask Aan answers with the numbers behind it, and MCP brings all of it into the AI you already use. One place, watched around the clock.",
  ],
  gallery: [
    { id: "signals", name: "Signals", meta: ["Signals", "Alerts", "What changed and why"], href: "/signals" },
    { id: "profitability", name: "Profitability", meta: ["Profitability", "P&L", "True profit, every product"], href: "/profitability" },
    { id: "rules", name: "Rules", meta: ["Rules", "Automation", "Your playbook, running"], href: "/rules" },
    { id: "aan", name: "Ask Aan", meta: ["Ask Aan", "Answers", "The numbers behind it"], href: "/aan" },
    { id: "mcp", name: "MCP", meta: ["Anarix MCP", "Any AI", "Same numbers everywhere"], href: "/mcp" },
  ],
  fragments: [
    { k: "Signals", v: "$1,651 protected" },
    { k: "Buy Box", v: "Lost to a reseller · $940" },
    { k: "Profit", v: "$1,568 true profit" },
    { k: "Rule", v: "Pause at $50, 0 sales" },
    { k: "Ask Aan", v: "Why did ROAS drop?" },
    { k: "MCP", v: "$3,412 in any AI" },
    { k: "Undo", v: "0:30 to change your mind" },
    { k: "Stores", v: "Amazon · Walmart · Shopify" },
  ],
};

/** render **bold** phrases as <b> inside grey prose */
export function inkSplit(text: string): { ink: boolean; text: string }[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) => (part.startsWith("**") ? { ink: true, text: part.slice(2, -2) } : { ink: false, text: part }));
}
