import type { ProductId, ProductPage } from "./types";

// The five dedicated pages, in nav order. Copy: docs/redesign/03-copy-deck.md.
// Left out until the owner answers: data protection (Aan), COGS source
// (Profitability), MCP setup steps, what MCP can see and change.
// Every screen is a headline plus one line at most: the drawing or the
// product does the explaining.

const aan: ProductPage = {
  id: "aan",
  name: "Aan",
  slogan: "Your 24/7 e‑commerce account manager.",
  line: "The AI inside Anarix. It watches your stores, explains **what changed and why**, and acts within your rules.",
  bubble: "Ask me anything.",
  meta: {
    title: "Aan, your 24/7 e-commerce account manager",
    description: "Aan is the AI inside Anarix. It watches your Amazon, Walmart and Shopify accounts around the clock, explains what changed and why, and acts within the rules you set.",
  },
  moment: { title: "Ask Aan.", hint: "Pick a question. Watch Aan listen, think, work, then answer.", note: "Sample conversation" },
  proof: { title: "Your morning brief.", line: "What was handled overnight, what needs you, and what it was worth.", note: "Sample data" },
  close: { title: "Meet Aan in a demo." },
  faq: [
    { q: "What is Aan?", a: "The AI inside Anarix. The name stands for Anarix Analytical Neural." },
    { q: "Which marketplaces does Aan work with?", a: "Amazon, Walmart and Shopify." },
    { q: "Will Aan change things without asking?", a: "Only what your rules allow. Approval mode holds anything above your limit until you say yes, and every action is logged with its reason." },
    { q: "Where can I talk to Aan?", a: "In Anarix, through the Ask Aan button on this site, and inside Claude, ChatGPT or Gemini through Anarix MCP." },
  ],
};

const signals: ProductPage = {
  id: "signals",
  name: "Signals",
  slogan: "3am change. 9am answer.",
  line: "Aan watches every price, Buy Box, budget and stock level, and tells you **what changed and why**.",
  bubble: "Found it. Here's why.",
  meta: {
    title: "Signals: 3am change, 9am answer",
    description: "Signals watches every price, Buy Box, budget and stock level across Amazon, Walmart and Shopify, and tells you what changed, why it matters and what to do.",
  },
  moment: { title: "Tap a store.", hint: "Each one changed overnight. See what Aan found, and fix it from there.", note: "Sample data" },
  proof: { title: "Biggest risk first.", line: "Signals rank themselves by money at risk, so the first fix is the one that matters most.", note: "Sample data" },
  close: { title: "Catch the next 3am change." },
  faq: [
    { q: "What counts as a signal?", a: "A meaningful change on an account (a price, Buy Box, ad eligibility, budget or stock change) together with its root cause and the money at risk." },
    { q: "How are signals ranked?", a: "By dollar impact, highest first." },
    { q: "Can I hand a signal to my team?", a: "Yes. Assign it from the alert." },
    { q: "Does Aan act on signals by itself?", a: "When one of your rules allows it. Otherwise Aan suggests the fix and waits for you." },
    { q: "Which marketplaces?", a: "Amazon, Walmart and Shopify." },
  ],
};

const profitability: ProductPage = {
  id: "profitability",
  name: "Profitability",
  slogan: "Revenue lies. Profit doesn't.",
  line: "Fees, ads, refunds and COGS all take their share. See **true profit on every product, every day**.",
  bubble: "Counting every fee.",
  meta: {
    title: "Profitability: revenue lies, profit doesn't",
    description: "Sales look great until fees, ads, refunds and COGS take their share. Anarix shows true profit on every product, every day.",
  },
  moment: { title: "Take out the costs.", hint: "Switch each cost on and watch what is really left.", note: "Sample data · one day, Walmart US" },
  proof: { title: "Every marketplace, one view.", line: "Amazon, Walmart and Shopify side by side, so you know where you actually make money.", note: "Sample data" },
  close: { title: "See your real profit." },
  faq: [
    { q: "What goes into profit?", a: "Fees, ad spend, refunds and COGS on every SKU." },
    { q: "How often does it update?", a: "Daily, so you see yesterday's profit this morning." },
    { q: "Which marketplaces?", a: "Amazon, Walmart and Shopify." },
  ],
};

const rules: ProductPage = {
  id: "rules",
  name: "Rules",
  slogan: "Your playbook. On autopilot.",
  line: "Write how you run your accounts **in plain words**. Aan turns it into rules that run every hour.",
  bubble: "Good spend in. Waste out.",
  meta: {
    title: "Rules: your playbook, on autopilot",
    description: "Write how you run your accounts in plain words. Aan turns it into rules that run every hour, allowing good spend, stopping waste and logging every decision.",
  },
  moment: { title: "Say it in a sentence.", hint: "Pick one. Aan builds the rule, and the gate starts sorting.", note: "Sample rules" },
  proof: { title: "Every decision, with its reason.", line: "Allowed or stopped, every hour, all logged. Changes above your limit wait for your approval.", note: "Sample data" },
  close: { title: "Hand Aan your playbook." },
  faq: [
    { q: "What can rules do?", a: "For example, cap budgets, adjust bids on high-ACOS keywords and keep inventory in sync." },
    { q: "When do rules run?", a: "Every hour of every day." },
    { q: "Can I approve changes before they go live?", a: "Yes. Approval mode holds any change above your limit." },
    { q: "Where do I see what a rule did?", a: "Every decision is logged with its reason." },
  ],
};

const mcp: ProductPage = {
  id: "mcp",
  name: "MCP",
  slogan: "Your data. Any AI.",
  line: "Anarix MCP plugs your marketplace data into the AI you already use, with **the same live numbers as your dashboard**.",
  bubble: "Plugged in.",
  meta: {
    title: "Anarix MCP: your data, any AI",
    description: "Anarix MCP plugs your marketplace data into Claude, ChatGPT, Gemini or your own agent, with the same live numbers as your dashboard.",
  },
  moment: { title: "Pick your AI.", hint: "Ask the same question anywhere. Get the same number as your dashboard.", note: "Illustrative" },
  proof: {
    title: "What MCP is.",
    line: "An open standard that lets AI assistants use tools. Anarix MCP gives yours four: sales, ads, inventory and profit.",
    note: "Illustrative",
  },
  close: { title: "Plug your data into your AI." },
  faq: [
    { q: "Which AI clients work with it?", a: "Claude, ChatGPT, Gemini, or your own agent." },
    { q: "Is it the same data as my dashboard?", a: "Yes, the same live numbers." },
  ],
};

export const PAGES: Record<ProductId, ProductPage> = { aan, signals, profitability, rules, mcp };
export const PAGE_IDS = Object.keys(PAGES) as ProductId[];

/** what every close offers, under its own line */
export const pageClose = {
  primary: { label: "Book a demo", href: "https://www.anarix.ai/contact-us" },
  secondary: "Talk to Aan",
  services: { lead: "Rather we run it for you?", label: "See Anarix Services", href: "https://www.anarix.ai" },
  faqTitle: "Questions",
};
