// Sample data for the product pages' hands-on moments. Every screen that
// shows it is labelled "Sample data" (or "Illustrative"). Figures agree with
// the rest of the site: the ranked signals list, the profit card ($5,235 sales,
// $1,568 profit) and the MCP answer ($3,412 across 18 campaigns).

/* -------------------------------------------------------------- Signals */
export type SampleSignal = {
  store: "Amazon" | "Walmart" | "Shopify";
  priority: "High" | "Medium";
  area: string;
  time: string;
  title: string;
  item: string;
  risk: number;
  what: string;
  why: string;
  fix: string;
  confidence: number;
  action: string;
  done: string;
};

export const SIGNALS: SampleSignal[] = [
  {
    store: "Amazon",
    priority: "High",
    area: "Advertising",
    time: "03:12",
    title: "Advertising eligibility lost",
    item: "ASIN B0CSHBTCC6 · Sampler, Decaf 40 Count",
    risk: 1651,
    what: "Ad eligibility lost on Jul 18, the 2nd time in 30 days.",
    why: "Cost to Amazon is too high for an $18.69 retail price.",
    fix: "Lower the cost to Amazon by $1.20 to restore eligibility",
    confidence: 95,
    action: "Lower cost $1.20",
    done: "Cost lowered",
  },
  {
    store: "Walmart",
    priority: "High",
    area: "Buy Box",
    time: "01:44",
    title: "Buy Box lost to a reseller",
    item: "Chef knife, 8 inch",
    risk: 940,
    what: "A reseller undercut you by $2.10 at 1:40 AM and took the Buy Box.",
    why: "Your price rule paused after a cost update.",
    fix: "Match at $34.89, still above your floor price",
    confidence: 91,
    action: "Match price",
    done: "Price matched",
  },
  {
    store: "Shopify",
    priority: "Medium",
    area: "Pricing",
    time: "02:30",
    title: "Undercut by $3",
    item: "Bamboo cutting board",
    risk: 412,
    what: "A competitor dropped to $26.99 overnight; your conversion fell 18%.",
    why: "Their promotion runs until Sunday.",
    fix: "Hold price and raise the bundle offer until Sunday",
    confidence: 84,
    action: "Raise bundle offer",
    done: "Offer raised",
  },
];

/* -------------------------------------------------------- Profitability */
export const SALES = 5235;
export const COSTS = [
  { k: "Fees", long: "Marketplace fees", v: 1151 },
  { k: "Ads", long: "Ad spend", v: 288 },
  { k: "Refunds", long: "Refunds", v: 412 },
  { k: "COGS", long: "Cost of goods", v: 1816 },
] as const;

/* ---------------------------------------------------------------- Rules */
export type SampleRule = {
  sentence: string;
  parts: { k: string; v: string }[];
  /** which parcel on the belt this rule stops, and what it is */
  stops: number;
  stopped: string;
};

export const RULES: SampleRule[] = [
  {
    sentence: "Pause any keyword that spends $50 in 7 days with no sales.",
    parts: [
      { k: "When", v: "Every hour" },
      { k: "If", v: "Spend is $50 or more in 7 days" },
      { k: "And", v: "Sales are 0 in the same 7 days" },
      { k: "Then", v: "Pause the keyword" },
    ],
    stops: 1,
    stopped: "“chef knife 8 inch”: $86, 0 sales",
  },
  {
    sentence: "Cap any campaign at $200 a day.",
    parts: [
      { k: "When", v: "Every hour" },
      { k: "If", v: "A campaign has spent $200 today" },
      { k: "Then", v: "Pause it until midnight" },
    ],
    stops: 3,
    stopped: "Spring Sale: $200 reached at 4 PM",
  },
  {
    sentence: "Pause ads when stock drops below 7 days.",
    parts: [
      { k: "When", v: "Every hour" },
      { k: "If", v: "Days of stock fall below 7" },
      { k: "Then", v: "Pause that product's ads" },
    ],
    stops: 2,
    stopped: "Bamboo board: 5 days of stock left",
  },
];

export const DECISIONS = [
  { t: "02:14", ok: false, what: "Stopped “chef knife 8 inch”", why: "$86 spent in 7 days, 0 sales" },
  { t: "02:00", ok: true, what: "Allowed “bamboo cutting board”", why: "ROAS 4.1, above your 3.0 target" },
  { t: "01:00", ok: true, what: "Allowed Spring Sale budget", why: "$140 of $200 spent today" },
  { t: "00:00", ok: false, what: "Held a $600/day increase", why: "Above your $400 limit: waiting for approval" },
  { t: "23:00", ok: true, what: "Allowed “decaf sampler”", why: "In stock for 21 days" },
];

/* ------------------------------------------------------------------ Aan */
/** the receipt under an answer: two small trend lines, or ranked bars */
export type AnswerChart =
  | { kind: "lines"; series: { label: string; note: string; points: number[] }[] }
  | { kind: "bars"; unit: string; items: { label: string; v: number }[] };

export type SampleQA = { q: string; a: string; sources: string[]; actions: [string, string]; chart: AnswerChart };

export const QUESTIONS: SampleQA[] = [
  {
    q: "Why did ROAS drop on Walmart yesterday?",
    a: "CPC rose 22% on “bamboo cutting board” while conversions held flat. Move $400/day to Sponsored Brands to recover about 0.6 ROAS.",
    sources: ["Ads · Walmart", "Yesterday vs 7-day average"],
    actions: ["Draft the rule", "Build a report"],
    chart: {
      kind: "lines",
      series: [
        { label: "CPC", note: "+22%", points: [1.12, 1.1, 1.13, 1.15, 1.14, 1.21, 1.29, 1.37] },
        { label: "ROAS", note: "−0.6", points: [3.0, 3.1, 3.0, 2.9, 3.0, 2.8, 2.6, 2.4] },
      ],
    },
  },
  {
    q: "Which products lost money last week?",
    a: "Three: Chef knife 8 inch (−$214), Bamboo board (−$96) and Decaf sampler (−$41). Ad spend and refunds did most of it.",
    sources: ["Profitability · All marketplaces", "Last 7 days"],
    actions: ["Show the products", "Draft a rule"],
    chart: {
      kind: "bars",
      unit: "last week",
      items: [
        { label: "Chef knife 8 inch", v: -214 },
        { label: "Bamboo board", v: -96 },
        { label: "Decaf sampler", v: -41 },
      ],
    },
  },
  {
    q: "What should I fix first today?",
    a: "The Amazon ad eligibility signal: $1,651 at risk. Lowering the cost to Amazon by $1.20 restores it.",
    sources: ["Signals · Amazon", "Ranked by money at risk"],
    actions: ["Fix it now", "Assign it"],
    chart: {
      kind: "bars",
      unit: "at risk",
      items: [
        { label: "Ad eligibility · Amazon", v: 1651 },
        { label: "Buy Box · Walmart", v: 940 },
        { label: "Undercut · Shopify", v: 412 },
      ],
    },
  },
];

/* ------------------------------------------------------------------ MCP */
export const CLIENTS = ["Claude", "ChatGPT", "Gemini", "Your agent"] as const;
export type Client = (typeof CLIENTS)[number];
export const MCP_ASK = "What did I spend on Walmart ads this month?";
export const MCP_TOOL = "Anarix · ad spend · Walmart · this month";
export const MCP_ANSWER = { figure: "$3,412", rest: "across 18 campaigns." };

/** the server every AI connects to, and how each one adds it (Anarix app, MCP connect dialog) */
export const MCP_SERVER = "https://mcp.anarix.ai/mcp/sse";
export const MCP_SETUP: Record<Client, string[]> = {
  Claude: ["Settings → Connectors → Add custom connector", "Paste the server address and save", "Ask Claude to “use anarix mcp and login”, then follow the link"],
  ChatGPT: ["Settings → MCP servers → Add server", "Paste the server address, transport “Streamable HTTP”", "Ask ChatGPT to “use anarix mcp and login”, then follow the link"],
  Gemini: ["Add a custom MCP server in Gemini", "Paste the server address", "Ask Gemini to “use anarix mcp and login”, then follow the link"],
  "Your agent": ["Point any MCP client at the server address", "Sign in with your Anarix account when it asks", "Check it: ask which accounts you can see"],
};
export const MCP_TOOLS = ["Sales", "Ads", "Inventory", "Profit"];
