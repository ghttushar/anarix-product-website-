/*
  Sample data for the app mockups (components/app-ui). Shapes, labels and
  figures follow the Anarix app's own mock data (anarix-revamp-scope-2027),
  with neutral store and product names and no real people. Every mockup
  that shows these numbers is labelled as sample data. The profit figures
  add up.
*/

export type Priority = "High" | "Medium" | "Low";
export type Status = "Open" | "In progress" | "Done";
export type Source = "email" | "slack" | "meeting" | "anarix";

export type SampleAlert = {
  id: string;
  time: string;
  priority: Priority;
  category: string;
  market: string;
  value: number; // signed: negative is money at risk, positive is an opportunity
  impact: string;
  title: string;
  status: Status;
  sources: Source[];
  actioned?: string;
};

/** the story the Signals page follows from alert to verified fix */
export const STORY = {
  alert: {
    id: "a1",
    time: "07:04 AM",
    priority: "High" as Priority,
    category: "Catalog",
    market: "Amazon · US",
    store: "Your store",
    value: -7940,
    impact: "Net profit at risk",
    items: 14,
    title: "Net profit down 12% across 14 ASINs",
    subheader: "A catalog push on 28 Oct cut conversion from 9.1% to 6.4% across 14 ASINs.",
    why: "A catalog push on 28 Oct replaced the bullet copy on 14 ASINs and dropped 3 ranking keywords.",
    root: "No approval step sits on the product feed, so the same overwrite can happen again.",
    status: "Open" as Status,
    sources: ["email", "slack", "meeting"] as Source[],
  },
  options: [
    { label: "Revert bullet points to the 27 Oct version", est: "+$7,100", confidence: 95, recommended: true },
    { label: "Rewrite bullets with the winning keyword set", est: "+$8,400", confidence: 71 },
    { label: "Ask for an approval step on the product feed", meeting: true },
    { label: "Ask Aan", other: true },
  ],
  products: [
    { name: "Whey Protein Isolate 1kg · Chocolate", asin: "B08XK2QW9L", impact: -1240 },
    { name: "Whey Protein Isolate 1kg · Vanilla", asin: "B07QW9LMN2", impact: -1010 },
    { name: "BCAA 250g · Watermelon", asin: "B09LMN4RT8", impact: -860 },
    { name: "Electrolyte Mix · 30 sachets", asin: "B0C1RT7YQ5", impact: -620 },
    { name: "Collagen Peptides 500g", asin: "B08ZK4MNP2", impact: -540 },
    { name: "Creatine Monohydrate 300g", asin: "B06TY7HJ3K", impact: 310 },
  ],
  picked: 9,
  action: "Revert bullet points",
  report: {
    recovered: 7240,
    rows: [
      { metric: "Conversion", before: "6.4%", after: "8.9%", change: "+2.5 pt" },
      { metric: "Net profit · 7 days", before: "$12,180", after: "$19,420", change: "+$7,240" },
      { metric: "Ranking keywords", before: "11", after: "14", change: "+3" },
    ],
  },
};

/** the alert list, newest first */
export const ALERTS: SampleAlert[] = [
  { id: "a1", time: "07:04 AM", priority: "High", category: "Catalog", market: "Amazon · US", value: -7940, impact: "Net profit at risk · 14 ASINs", title: "Net profit down 12% across 14 ASINs", status: "Open", sources: ["email", "slack", "meeting"] },
  { id: "a5", time: "06:12 AM", priority: "High", category: "Compliance", market: "Walmart · US", value: -42600, impact: "Revenue at risk · 600 ASINs", title: "Price parity break flagged across the catalog", status: "In progress", sources: ["anarix"], actioned: "210 of 600 actioned" },
  { id: "a2", time: "05:40 AM", priority: "Medium", category: "Catalog", market: "Amazon · US", value: 5300, impact: "Opportunity · 6 ASINs", title: "Bullet copy is under-performing on 6 hero ASINs", status: "Open", sources: ["anarix"] },
  { id: "a15", time: "02:14 AM", priority: "High", category: "Catalog", market: "Amazon · US", value: -3400, impact: "Revenue at risk · 1 ASIN", title: "Search suppressed: missing main image", status: "Open", sources: ["anarix"] },
  { id: "a3", time: "Yesterday", priority: "Low", category: "Inventory", market: "Amazon · US", value: 6200, impact: "Verified · 3 SKUs", title: "Inventory reorder on three SKUs came back verified", status: "Done", sources: ["anarix"] },
];

/** the morning brief */
export const BRIEF = {
  risk: { total: "$84.2K", alerts: 12, delta: "↓ 8% vs yesterday", rows: [
    { k: "Catalog", v: 38.4 },
    { k: "Advertising", v: 21.6 },
    { k: "Compliance", v: 14.1 },
    { k: "Inventory", v: 10.1 },
  ] },
  opportunity: { total: "$11.6K", alerts: 3 },
  away: [
    { t: "02:14", title: "Search suppressed: missing main image", v: "−$3.4K", cat: "Catalog" },
    { t: "04:40", title: "Card on file declined", v: "−$12.0K", cat: "Billing" },
    { t: "06:05", title: "Low stock: under 2 weeks on 3 SKUs", v: "−$2.1K", cat: "Inventory" },
    { t: "07:04", title: "Net profit down 12% across 14 ASINs", v: "−$7.9K", cat: "Catalog" },
  ],
  messages: [
    { from: "Ops", via: "Slack · #store-ops", t: "06:52", text: "Can we hold the price change until Monday?" },
    { from: "Marketing", via: "Email", t: "06:30", text: "New A+ content for the whey range is ready for review." },
  ],
  meeting: { title: "Weekly performance review", when: "Today, 10:30 – 11:15 AM", alerts: 3, prep: [2, 5] },
};

/** meeting prep and a task, for "from alert to meeting to task" */
export const MEETING = {
  title: "Weekly performance review",
  when: "Today · 10:30 – 11:15 AM",
  positives: ["Conversion back to 8.9% on the whey range", "ROAS 4.8 on brand campaigns"],
  negatives: ["Price parity break on Walmart", "Card on file declined at 04:40"],
  rows: [
    { alert: "Net profit down 12%", action: "Reverted bullets on 9 ASINs", impact: "+$7,240" },
    { alert: "Search suppressed", action: "New white-background image", impact: "+$3,100" },
  ],
};

export const TASK = {
  value: "−$7.94K",
  title: "Revert bullet points on the 5 remaining ASINs",
  assignee: "Aan",
  status: "In progress" as Status,
  priority: "High" as Priority,
  due: "Today",
};

/* ------------------------------------------------------------ the platform */
export const KPIS = [
  { k: "Ad spend", v: "$8,456", d: "+16.9%", up: true, tone: "primary" },
  { k: "Ad sales", v: "$38,235", d: "+17.8%", up: true, tone: "gain" },
  { k: "Ad units", v: "1,203", d: "+10.7%", up: true, tone: "lilac" },
  { k: "ROAS", v: "4.52", d: "+0.7%", up: true, tone: "warn" },
  { k: "Impressions", v: "1.2M", d: "+13.4%", up: true, tone: "risk" },
] as const;

export const CAMPAIGNS = {
  total: { label: "Total (4 campaigns)", spend: "$5,776.06", sales: "$22,423.52", roas: "3.88", acos: "25.76%" },
  rows: [
    { status: "Live", name: "Brand awareness · Q1", spend: "$2,847.32", sales: "$12,453.87", roas: "4.37", acos: "22.86%" },
    { status: "Live", name: "Organic products launch", spend: "$876.54", sales: "$4,532.10", roas: "5.17", acos: "19.34%" },
    { status: "Out of budget", name: "Competitor targeting", spend: "$1,412.20", sales: "$3,050.35", roas: "2.16", acos: "46.30%" },
    { status: "Paused", name: "Summer sale", spend: "$640.00", sales: "$2,387.20", roas: "3.73", acos: "26.81%" },
  ],
};

/** 30 days of one store: the parts add up to sales */
export const PROFIT = {
  sales: 48600,
  net: 14580,
  margin: "30.0%",
  vs: "+6.2%",
  parts: [
    { k: "Cost of goods", v: 19440, tone: "neutral" },
    { k: "Marketplace fees", v: 7290, tone: "neutral" },
    { k: "Ad spend", v: 5830, tone: "neutral" },
    { k: "Refunds", v: 1460, tone: "warn" },
    { k: "Net profit", v: 14580, tone: "gain" },
  ],
  tacos: "12.0%",
  /** net profit by week over the same 30 days (adds up to net) */
  weeks: [3320, 3510, 3740, 4010],
};

export const TODAY = { gmv: "$4,521.97", orders: "28", units: "45", adCost: "$312.45", net: "$1,245.67" };

export const RULE = {
  name: "High ACOS bid reducer",
  criteria: [
    { k: "IF", parts: ["ACOS", "Greater than", "30%"] },
    { k: "AND", parts: ["ROAS", "Less than", "2"] },
    { k: "THEN", parts: ["Decrease bid by %", "15"] },
  ],
  applied: [
    { name: "High ACOS bid reducer", kind: "Keyword rule", scope: "142 keywords", freq: "Daily", on: true },
    { name: "Budget cap protection", kind: "Budget rule", scope: "15 campaigns", freq: "Hourly", on: true },
    { name: "Peak-hour top-up", kind: "Budget rule", scope: "Max +$50 an action", freq: "Hourly", on: false },
  ],
};

export const CHAT = {
  ask: "Generate a report for my last 7 days of campaign performance",
  answer: [
    ["Total ad spend ", "$10,973.60", ", ad sales ", "$36,955.24", ", overall ROAS ", "3.37x", ", above your 2.5x target."],
    ["Top performer: ", "Catch-all brand", " at 4.2x ROAS."],
  ],
  spend: [1380, 1520, 1610, 1490, 1655, 1702, 1617],
  roas: [3.1, 3.2, 3.4, 3.3, 3.5, 3.4, 3.6],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  suggestions: ["Show me wasted spend", "Which keywords should I pause?", "Compare this week with last"],
};

export const NOTES = [
  { kind: "campaign", title: "Daily budget reached on 3 campaigns", t: "2 min", cta: "Review budgets" },
  { kind: "rule", title: "Low ACOS bid optimization ran", t: "1 h", detail: "Lowered 41 bids across 24 campaigns." },
  { kind: "report", title: "Your weekly performance report is ready", t: "3 h", detail: "Sales $128,430 · ACOS 22.4%" },
];

export const MCP = {
  ask: "What did I spend on Walmart ads this month?",
  tool: "anarix · ad spend · walmart · this month",
  answer: "$3,412 across 18 campaigns. Top spender: Spring Sale ($890, ROAS 3.6).",
  ask2: "Which of those lost money?",
  tool2: "anarix · profit by campaign · walmart",
  answer2: "Two: Clearance Knives (−$140) and Brand Defense (−$62).",
};
