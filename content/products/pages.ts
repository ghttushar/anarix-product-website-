import type { ProductId, ProductPage } from "./types";

// The five dedicated pages, in nav order. Copy: docs/redesign/03-copy-deck.md.
// Left out until the owner answers: data protection (Aan), COGS source
// (Profitability), MCP setup steps, what MCP can see and change.

const aan: ProductPage = {
  id: "aan",
  name: "Aan",
  meta: {
    title: "Aan, your 24/7 e-commerce account manager",
    description: "Aan is the AI inside Anarix. It watches your Amazon, Walmart and Shopify accounts around the clock, explains what changed and why, and acts within the rules you set.",
  },
  hero: {
    title: ["Your 24/7 e‑commerce", "account manager."],
    lede: "Aan is the AI inside Anarix. It watches your Amazon, Walmart and Shopify accounts around the clock, explains **what changed and why**, and acts within the rules you set.",
    lead: "talk",
    bubble: "Ask me anything.",
  },
  how: {
    title: "How Aan works.",
    steps: [
      { glyph: "storefront", title: "Watch", text: "Every price, Buy Box, budget, stock level and fee, across every marketplace, every hour.", bubble: "Watching every store." },
      { glyph: "signpost", title: "Explain", text: "When something moves, Aan tells you what changed, why, and what it's worth in dollars.", bubble: "Here's what changed." },
      { glyph: "gate", title: "Act", text: "Aan fixes what your rules allow, asks before anything above your limit, and logs every decision.", bubble: "Handled, and logged." },
    ],
  },
  anatomy: {
    title: "Ask it like a person.",
    text: "Get a plain answer with the numbers behind it, then a report, a rule or a fix in one click.",
    parts: [
      { title: "Your question", text: "Ask the way you'd ask your best account manager." },
      { title: "Shows its work", text: "Every answer comes with its numbers and sources." },
      { title: "Turns answers into action", text: "A report, a rule or a fix, straight from the chat." },
    ],
    note: "Sample conversation",
  },
  depth: [
    {
      kind: "brief",
      title: "Your morning brief.",
      text: "Start the day with a brief: what was handled overnight, what needs you, and what it was worth.",
    },
    {
      kind: "shapes",
      title: "Aan's shapes.",
      text: "You can always tell what Aan is doing by its shape.",
      shapes: [
        { state: "diamond", name: "Diamond", text: "On watch." },
        { state: "circle", name: "Circle", text: "Listening to you." },
        { state: "bar", name: "Bar", text: "Working on it." },
        { state: "cube", name: "Cube", text: "Thinking it through." },
      ],
    },
  ],
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
  meta: {
    title: "Signals: 3am change, 9am answer",
    description: "Signals watches every price, Buy Box, budget and stock level across Amazon, Walmart and Shopify, and tells you what changed, why it matters and what to do.",
  },
  hero: {
    title: ["3am change.", "9am answer."],
    lede: "Signals watches every price, Buy Box, budget and stock level across Amazon, Walmart and Shopify. When something moves, Aan tells you **what changed, why it matters and what to do**, before it costs you.",
    lead: "demo",
    bubble: "Found it. Here's why.",
  },
  how: {
    title: "From change to fix.",
    steps: [
      { glyph: "storefrontChanged", title: "Something moves", text: "Price, Buy Box, ad eligibility, budget and spend, or stock level, on Amazon, Walmart or Shopify.", bubble: "Something moved." },
      { glyph: "signpost", title: "Aan finds why", text: "Every signal explains what moved and why, with the money at risk.", bubble: "Here's why." },
      { glyph: "buttonCheck", title: "You fix it there", text: "Execute, modify or assign without opening another tool.", bubble: "Fixed from the alert." },
    ],
  },
  anatomy: {
    title: "Anatomy of a signal.",
    text: "Everything you need to decide sits on one card.",
    parts: [
      { title: "Priority and area", text: "How urgent, which part of the business, which marketplace." },
      { title: "Money at risk", text: "The dollar impact, so you know what it's worth before you open it." },
      { title: "What happened, and why", text: "The change and its root cause, in plain words." },
      { title: "Aan's suggested fix", text: "With Aan's confidence in it." },
      { title: "Act from here", text: "Execute, modify or assign, without opening another tool." },
    ],
    note: "Sample data",
  },
  depth: [
    { kind: "ranked", title: "Ranked by money at risk.", text: "The biggest dollar impact rises to the top, so the first fix is always the one that matters most." },
  ],
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
  meta: {
    title: "Profitability: revenue lies, profit doesn't",
    description: "Sales look great until fees, ads, refunds and COGS take their share. Anarix shows true profit on every product, every day.",
  },
  hero: {
    title: ["Revenue lies.", "Profit doesn't."],
    lede: "Sales look great until fees, ads, refunds and COGS take their share. Anarix shows **true profit on every product, every day**, so you scale what actually makes money.",
    lead: "demo",
    bubble: "Counting every fee.",
  },
  how: {
    title: "Every cost, every day.",
    steps: [
      { glyph: "receipt", title: "Every cost, on every SKU", text: "Fees, ad spend, refunds and COGS, taken off every product's sales.", bubble: "Every fee counted." },
      { glyph: "calendar", title: "Daily, not month-end", text: "See yesterday's profit this morning and catch margin leaks while they're still small.", bubble: "Yesterday, this morning." },
      { glyph: "threeStores", title: "Every marketplace, one view", text: "Amazon, Walmart and Shopify side by side, so you know where you actually make money.", bubble: "All three, side by side." },
    ],
  },
  anatomy: {
    title: "Anatomy of the profit card.",
    text: "Yesterday's numbers for one marketplace, every cost already taken out.",
    parts: [
      { title: "Net profit and its change", text: "What is really left, and how it moved from the day before." },
      { title: "Margin", text: "Net profit as a share of sales." },
      { title: "GMV and orders", text: "What you sold, and how many orders." },
      { title: "Ad cost", text: "What advertising cost you that day." },
      { title: "Estimated payout", text: "What the marketplace should pay you out." },
    ],
    note: "Sample data",
  },
  depth: [
    {
      kind: "markets",
      title: "Every marketplace, one view.",
      text: "Amazon, Walmart and Shopify side by side, so you know where you actually make money.",
      flag: "Aan flags a margin leak while it is still small: a fee change, an ad that stopped paying, a run of refunds.",
    },
  ],
  faq: [
    { q: "What goes into profit?", a: "Fees, ad spend, refunds and COGS on every SKU." },
    { q: "How often does it update?", a: "Daily, so you see yesterday's profit this morning." },
    { q: "Which marketplaces?", a: "Amazon, Walmart and Shopify." },
  ],
};

const rules: ProductPage = {
  id: "rules",
  name: "Rules",
  meta: {
    title: "Rules: your playbook, on autopilot",
    description: "Write how you run your accounts in plain words. Aan turns it into rules that run every hour, allowing good spend, stopping waste and logging every decision.",
  },
  hero: {
    title: ["Your playbook.", "On autopilot."],
    lede: "Write how you run your accounts **in plain words**. Aan turns it into rules that run every hour of every day, allowing good spend, stopping waste and logging every decision.",
    lead: "demo",
    bubble: "Good spend in. Waste out.",
  },
  how: {
    title: "From words to rules.",
    steps: [
      { glyph: "speech", title: "Describe it", text: "Write how you run your accounts in plain words.", bubble: "Tell me how you run it." },
      { glyph: "conditions", title: "Aan builds it", text: "Aan turns your words into conditions, a scope and a schedule.", bubble: "Built: when, if, then." },
      { glyph: "clock", title: "It runs every hour", text: "Every campaign and keyword passes the gate, and every decision is logged.", bubble: "Running every hour." },
    ],
  },
  anatomy: {
    title: "Anatomy of your rules.",
    text: "Every rule shows what it covers, how often it has run and whether it is on.",
    parts: [
      { title: "Create rules with AI", text: "Describe the rule; Aan writes it." },
      { title: "The rule and its type", text: "Budget, keyword or inventory." },
      { title: "Its scope", text: "The campaigns, keywords or products it applies to." },
      { title: "Runs and status", text: "How often it has run, and whether it is active." },
      { title: "The decision log", text: "Every decision, with its reason." },
    ],
    note: "Sample data",
  },
  depth: [
    {
      kind: "rule",
      title: "Rules in plain words.",
      text: "Say what you want in a sentence. Aan builds the conditions, scope and schedule for you.",
      control: "Approval mode holds any change above your limit until you say yes.",
    },
  ],
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
  meta: {
    title: "Anarix MCP: your data, any AI",
    description: "Anarix MCP plugs your marketplace data into Claude, ChatGPT, Gemini or your own agent, with the same live numbers as your dashboard.",
  },
  hero: {
    title: ["Your data.", "Any AI."],
    lede: "Anarix MCP plugs your marketplace data into Claude, ChatGPT, Gemini or your own agent. Every answer uses **the same live numbers as your dashboard**.",
    lead: "demo",
    bubble: "Plugged in.",
  },
  how: {
    title: "How MCP works.",
    steps: [
      { glyph: "pole", title: "Your data, as tools", text: "Sales, ads, inventory and profit, as tools your AI can call.", bubble: "Your data, as tools." },
      { glyph: "chat", title: "Ask where you work", text: "Inside Claude, ChatGPT, Gemini or your own agent.", bubble: "Ask in your own AI." },
      { glyph: "sameNumber", title: "Same numbers everywhere", text: "Every AI answer matches your Anarix dashboard.", bubble: "Same numbers. Always." },
    ],
  },
  anatomy: {
    title: "MCP in use.",
    text: "Your AI calls an Anarix tool, then answers with your numbers.",
    parts: [
      { title: "Your AI client", text: "Claude here; ChatGPT, Gemini or your own agent work the same way." },
      { title: "Your question", text: "Asked in your AI, in plain words." },
      { title: "The Anarix tool call", text: "Your AI calls an Anarix tool for the numbers." },
      { title: "The answer", text: "Built from your live marketplace data." },
    ],
    note: "Illustrative session",
  },
  depth: [
    {
      kind: "same",
      title: "Same numbers everywhere.",
      text: "One source of truth, so every AI answer matches your Anarix dashboard.",
      what: "MCP (the Model Context Protocol) is an open standard that lets AI assistants use tools. Anarix MCP gives your AI tools for your sales, ads, inventory and profit.",
    },
  ],
  faq: [
    { q: "Which AI clients work with it?", a: "Claude, ChatGPT, Gemini, or your own agent." },
    { q: "Is it the same data as my dashboard?", a: "Yes, the same live numbers." },
  ],
};

export const PAGES: Record<ProductId, ProductPage> = { aan, signals, profitability, rules, mcp };
export const PAGE_IDS = Object.keys(PAGES) as ProductId[];

/** the shared closing screen on every page */
export const pageClose = {
  title: ["Let Aan take", "the night shift."],
  primary: { label: "Book a demo", href: "https://www.anarix.ai/contact-us" },
  secondary: "Talk to Aan",
  services: { lead: "Rather we run it for you?", label: "See Anarix Services", href: "https://www.anarix.ai" },
  bubble: "Ready when you are.",
  faqTitle: "Questions.",
};
