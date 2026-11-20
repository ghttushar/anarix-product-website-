import type { ProductId, ProductPage } from "./types";

// The five dedicated pages, in nav order. Copy: docs/redesign/03-copy-deck.md.
// Left out until the owner answers: data protection (Aan), COGS source
// (Profitability), MCP setup steps, what MCP can see and change.
// Phase 6: each page also says how it works, what it does and what it works
// with. Every fact traces to the Anarix app or the owner's confirmation
// (docs/redesign/03-copy-deck.md, "Phase 6 facts").

const aan: ProductPage = {
  id: "aan",
  name: "Aan",
  slogan: "Your 24/7 e‑commerce account manager.",
  line: "The AI inside Anarix. It watches your stores, explains **what changed and why**, and acts within your rules.",
  bubble: "",
  meta: {
    title: "Aan, your 24/7 e-commerce account manager",
    description: "Aan is the AI inside Anarix. It watches your Amazon, Walmart and Shopify accounts around the clock, explains what changed and why, and acts within the rules you set.",
  },
  moment: { title: "Ask Aan.", hint: "Pick a question. Watch Aan listen, think, work, then answer.", note: "Sample conversation" },
  proof: { title: "Your morning brief.", line: "What was handled overnight, what needs you, and what it was worth.", note: "Sample data from the same night" },
  close: { title: "Meet Aan in a demo." },
  faq: [
    { q: "What is Aan?", a: "The AI inside Anarix. The name stands for Anarix Analytical Neural." },
    { q: "Which marketplaces does Aan work with?", a: "Amazon, Walmart and Shopify." },
    { q: "Will Aan change things without asking?", a: "Only what your rules allow. Approval mode holds anything above your limit until you say yes, and every action is logged with its reason." },
    { q: "Where can I talk to Aan?", a: "In Anarix, in Slack, Microsoft Teams, Google Workspace, Discord and Zoom Team Chat, and inside Claude, ChatGPT or Gemini through Anarix MCP." },
    { q: "Can I take an answer with me?", a: "Yes. Download it as a CSV or turn it into a report." },
  ],
  how: {
    title: "Ask it like you'd ask your best account manager.",
    steps: [
      { t: "Ask in plain words.", d: "About sales, ads, stock or profit, on any of your marketplaces." },
      { t: "Aan works it out.", d: "It runs the analysis on your own data and shows where each number came from." },
      { t: "Act on the answer.", d: "Build a report, draft a rule, or approve the change Aan proposes." },
    ],
  },
  does: {
    title: "Answers you can check. Changes you approve.",
    intro: "Aan answers in the chat, and it is also inside every alert, meeting, task and rule.",
    items: [
      { t: "Answers with the numbers", d: "Tables, charts and reports, with the sources each answer came from." },
      { t: "Worked out, not guessed", d: "Aan runs the analysis on your data itself before it answers." },
      { t: "Take it with you", d: "Download any answer as a CSV, or turn it into a report." },
      { t: "Drafts for you", d: "Emails, support tickets and images, ready for you to review before they go." },
      { t: "Changes you approve", d: "Aan proposes campaign edits; they apply only after you say yes." },
      { t: "Inside every alert", d: "Ask why it happened, or what to do next, right from the signal." },
    ],
  },
  works: [
    { label: "Marketplaces", items: ["Amazon", "Walmart", "Shopify"] },
    { label: "Ask Aan in", items: ["Anarix", "Slack", "Microsoft Teams", "Google Workspace", "Discord", "Zoom Team Chat"] },
    { label: "Through MCP", items: ["Claude", "ChatGPT", "Gemini"] },
  ],
};

const signals: ProductPage = {
  id: "signals",
  name: "Signals",
  slogan: "3am change. 9am answer.",
  line: "Aan watches every price, Buy Box, budget and stock level, and tells you **what changed and why**.",
  bubble: "",
  meta: {
    title: "Signals: 3am change, 9am answer",
    description: "Signals watches every price, Buy Box, budget and stock level across Amazon, Walmart and Shopify, and tells you what changed, why it matters and what to do.",
  },
  moment: { title: "Tap a store.", hint: "Each one changed overnight. See what Aan found, then press Execute.", note: "Sample data from one store's night" },
  proof: { title: "Biggest risk first.", line: "Signals rank themselves by money at risk, so the first fix is the one that matters most.", note: "Sample data from one store's night" },
  close: { title: "Catch the next 3am change." },
  faq: [
    { q: "What counts as a signal?", a: "A meaningful change on an account (a price, Buy Box, ad eligibility, budget or stock change) together with its root cause and the money at risk." },
    { q: "How are signals ranked?", a: "By dollar impact, highest first." },
    { q: "Can I hand a signal to my team?", a: "Yes. Assign it from the alert." },
    { q: "Does Aan act on signals by itself?", a: "When one of your rules allows it. Otherwise Aan suggests the fix and waits for you." },
    { q: "Which marketplaces?", a: "Amazon, Walmart and Shopify." },
    { q: "What happens after I act?", a: "Aan checks the result over the next 7 days and reports what the fix was worth." },
    { q: "Can I undo an action?", a: "Yes, within 30 seconds of running it. Every suggested fix also says whether it can be reversed." },
  ],
  how: {
    title: "From a 3am change to a 9am fix.",
    steps: [
      { t: "Aan watches.", d: "Prices, Buy Box, listings, ad eligibility, budgets and stock, on every store, all night." },
      { t: "Aan explains.", d: "Each signal arrives with what changed, the root cause and the money at risk." },
      { t: "You fix it from the alert.", d: "Run the suggested action on the items you choose, hand it to your team, or snooze it." },
    ],
  },
  does: {
    title: "79 ways things go wrong, caught early.",
    intro: "Signals covers 79 alert reasons in 12 groups, from suppressed listings to billing, and maps each one to a recommended action.",
    items: [
      { t: "Ranked by money at risk", d: "The biggest dollar impact comes first, so the first fix is the one that matters most." },
      { t: "The why, and how sure", d: "Each fix comes with its root cause, a confidence, a risk level and whether it can be undone." },
      { t: "Fix the items you pick", d: "Run the action on chosen items, and a different one on the rest." },
      { t: "Hand it off", d: "Assign it with a due date, share it to Slack, Teams or email, or snooze it until morning." },
      { t: "A morning brief", d: "Value at risk, opportunities and what happened while you were away, on one page." },
      { t: "Proof it worked", d: "Every fix is verified over the next 7 days, with a report of its impact." },
    ],
  },
  works: [
    { label: "Marketplaces", items: ["Amazon", "Walmart", "Shopify"] },
    { label: "Signals come from", items: ["Anarix monitoring", "Aan", "Meetings", "Slack", "Microsoft Teams", "Email"] },
    { label: "Reach you in", items: ["Anarix", "Slack", "Microsoft Teams", "Email", "WhatsApp"] },
  ],
};

const profitability: ProductPage = {
  id: "profitability",
  name: "Profitability",
  slogan: "Revenue lies. Profit doesn't.",
  line: "Fees, ads, refunds and COGS all take their share. See **true profit on every product, every day**.",
  bubble: "Fees took $1,151 today.",
  meta: {
    title: "Profitability: revenue lies, profit doesn't",
    description: "Sales look great until fees, ads, refunds and COGS take their share. Anarix shows true profit on every product, every day.",
  },
  moment: { title: "Take out the costs.", hint: "Switch each cost on and watch what is really left.", note: "Sample data · one day, Walmart US" },
  proof: { title: "Every marketplace, one view.", line: "Amazon, Walmart and Shopify side by side, so you know where you actually make money.", note: "Sample data" },
  close: { title: "See your real profit." },
  faq: [
    { q: "What goes into profit?", a: "Marketplace fees and commissions, shipping, refunds, taxes, promotions, ad spend by ad type, and your cost of goods, on every SKU." },
    { q: "Where does COGS come from?", a: "You upload a default cost for each product. It applies to your next inbound shipments." },
    { q: "How often does it update?", a: "Daily, so you see yesterday's profit this morning." },
    { q: "Can I compare periods?", a: "Yes. Pick any range, from daily to yearly, and compare it with the period before." },
    { q: "Which marketplaces?", a: "Amazon, Walmart and Shopify." },
  ],
  how: {
    title: "From sales to what's really yours.",
    steps: [
      { t: "Every cost line, pulled in.", d: "Fees and commissions, shipping, refunds, taxes, promotions and ad spend by ad type." },
      { t: "Your cost of goods, added.", d: "Upload a default cost per product; it applies to your next inbound shipments." },
      { t: "True profit, every day.", d: "Net profit and margin on every product, as a dashboard, a trend and a full P&L." },
    ],
  },
  does: {
    title: "Know which products actually pay.",
    intro: "Profitability splits every sale into what the marketplace kept, what you spent and what was left.",
    items: [
      { t: "Profit dashboard", d: "Net profit, margin and TACoS at a glance, for any date range." },
      { t: "Trends", d: "Daily, weekly, monthly, quarterly or yearly, against the period before." },
      { t: "Profit and loss", d: "A full P&L, line by line, from gross sales to estimated payout." },
      { t: "Least profitable items", d: "The products losing money, and which cost is doing it." },
      { t: "Fee watch", d: "Marketplace fees tracked as they change, so a new fee never hides in a total." },
      { t: "Refunds and reimbursements", d: "What came back to you, and what you are still owed." },
    ],
  },
  works: [
    { label: "Marketplaces", items: ["Amazon", "Walmart", "Shopify"] },
    { label: "Cost lines", items: ["Referral and FBA fees", "WFS fees", "Commission", "Shipping", "Refunds", "Taxes", "Promotions", "Ad spend", "COGS"] },
    { label: "Views", items: ["Dashboard", "Trends", "Profit and loss"] },
  ],
};

const rules: ProductPage = {
  id: "rules",
  name: "Rules",
  slogan: "Your playbook. On autopilot.",
  line: "Write how you run your accounts **in plain words**. Aan turns it into rules that run on your schedule, as often as every hour.",
  bubble: "",
  meta: {
    title: "Rules: your playbook, on autopilot",
    description: "Write how you run your accounts in plain words. Aan turns it into rules that run on your schedule, allowing good spend, stopping waste and logging every decision.",
  },
  moment: { title: "Pick a rule.", hint: "Pick one. Aan builds the rule and shows what it would stop.", note: "Sample rules" },
  proof: { title: "Every decision, with its reason.", line: "Allowed or stopped, every run, all logged. Changes above your limit wait for your approval.", note: "Sample data from the same night" },
  close: { title: "Hand Aan your playbook." },
  faq: [
    { q: "What can rules do?", a: "Set and adjust bids and budgets, harvest keywords, change placements and bidding strategy, day-part your spend and react to inventory, across 13 kinds of rule." },
    { q: "Can Aan write the rule for me?", a: "Yes. Describe it in plain words or start from a template. Aan builds it and checks it for conflicts." },
    { q: "When do rules run?", a: "On the schedule you choose: hourly, daily, weekly or monthly." },
    { q: "What do rules look at?", a: "Performance over the last 7, 14, 30 or 60 days, whichever you choose." },
    { q: "Can I approve changes before they go live?", a: "Yes. Approval mode holds any change above your limit." },
    { q: "Where do I see what a rule did?", a: "Every decision is logged with its reason." },
  ],
  how: {
    title: "From a sentence to a rule that runs.",
    steps: [
      { t: "Say it in plain words.", d: "Describe the rule, or start from a template." },
      { t: "Aan builds and checks it.", d: "It sets the conditions, scope and schedule, and audits the rule for conflicts." },
      { t: "It runs on your schedule.", d: "Hourly, daily, weekly or monthly. Changes above your limit wait for your yes." },
    ],
  },
  does: {
    title: "Thirteen kinds of rule. One playbook.",
    intro: "Rules work across campaigns, ad groups, products, keywords and targets, judged on the last 7, 14, 30 or 60 days.",
    items: [
      { t: "Bids", d: "Set, raise or lower bids, or let a bidding strategy move them within your limits." },
      { t: "Budgets", d: "Change budgets by a percentage or an amount, or hold them steady." },
      { t: "Keyword harvesting", d: "Move winning search terms into the campaigns where they belong." },
      { t: "Day-parting", d: "Spend more when shoppers buy and less when they don't." },
      { t: "Inventory-aware", d: "Ease off ads on products that are running low." },
      { t: "Every decision logged", d: "Allowed, stopped or held, each with its reason." },
    ],
  },
  works: [
    { label: "Ad platforms", items: ["Amazon", "Walmart"] },
    { label: "Applies to", items: ["Campaigns", "Ad groups", "Products", "Keywords", "Targets"] },
    { label: "Runs", items: ["Hourly", "Daily", "Weekly", "Monthly"] },
    { label: "All 13 kinds of rule", items: ["Inventory", "Share of voice", "Keyword harvesting", "Budget", "Placement", "Platform", "Page type", "Bidding strategy", "State change", "Bidder", "Day-parting", "Keyword", "Target"] },
  ],
};

const mcp: ProductPage = {
  id: "mcp",
  name: "MCP",
  slogan: "Your data. Any AI.",
  line: "Anarix MCP plugs your marketplace data into the AI you already use, with **the same live numbers as your dashboard**.",
  bubble: "Same $3,412 in any AI.",
  meta: {
    title: "Anarix MCP: your data, any AI",
    description: "Anarix MCP plugs your marketplace data into Claude, ChatGPT, Gemini or your own agent, with the same live numbers as your dashboard.",
  },
  moment: { title: "Pick your AI.", hint: "Ask the same question anywhere. Get the same number as your dashboard.", note: "Illustrative" },
  proof: {
    title: "What MCP is.",
    line: "An open standard that lets AI assistants use tools. Anarix MCP connects yours to your Anarix accounts.",
    note: "Illustrative",
  },
  close: { title: "Plug your data into your AI." },
  faq: [
    { q: "Which AI clients work with it?", a: "Claude, ChatGPT, Gemini, or your own agent." },
    { q: "Is it the same data as my dashboard?", a: "Yes, the same live numbers." },
    { q: "How do I connect it?", a: "Choose your AI, add Anarix MCP as a custom connector, sign in, then ask a test question. Claude and ChatGPT add it from their connector settings." },
    { q: "Do I need to sign in?", a: "Yes, with your Anarix account. It tells you when you need to sign in again." },
  ],
  how: {
    title: "Connected in four steps.",
    steps: [
      { t: "Choose your AI.", d: "Claude, ChatGPT, Gemini, or your own agent." },
      { t: "Add the connector.", d: "Point it at the Anarix MCP server, mcp.anarix.ai." },
      { t: "Sign in.", d: "Ask your AI to log in to Anarix MCP, then follow the link." },
      { t: "Check it.", d: "Ask which accounts you can see, or for last month's top campaigns." },
    ],
  },
  does: {
    title: "Your numbers, in the AI you already use.",
    intro: "Ask in the chat you already have open, and get the same answer your dashboard would give.",
    items: [
      { t: "Same numbers as the dashboard", d: "One source, so the answer in your AI matches the tile in Anarix." },
      { t: "Your accounts", d: "Ask which accounts and marketplaces you can see." },
      { t: "Campaign questions", d: "Ask for last month's top campaigns, and what put them there." },
      { t: "Charts in the chat", d: "Ask for weekly ad spend and ROAS as a chart, and get one." },
      { t: "Sign-in you control", d: "You log in with Anarix, and it tells you when to sign in again." },
      { t: "Your own agent", d: "Any agent that speaks MCP can use the same connection." },
    ],
  },
  works: [
    { label: "AI clients", items: ["Claude", "ChatGPT", "Gemini", "Your own agent"] },
    { label: "Server", items: ["mcp.anarix.ai"] },
    { label: "Marketplaces", items: ["Amazon", "Walmart", "Shopify"] },
  ],
};

export const PAGES: Record<ProductId, ProductPage> = { aan, signals, profitability, rules, mcp };
export const PAGE_IDS = Object.keys(PAGES) as ProductId[];

/** what every close offers, under its own line */
export const pageClose = {
  primary: { label: "Schedule a demo", href: "https://www.anarix.ai/contact-us" },
  secondary: "Talk to Aan",
  services: { lead: "Rather we run it for you?", label: "See Anarix Services", href: "https://www.anarix.ai" },
  faqTitle: "Questions",
};
