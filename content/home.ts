// Homepage copy (docs/redesign/03-copy-deck.md). Words live here so they can be
// edited without touching layout. Phrases wrapped in **double asterisks** are
// set in full ink inside grey prose.

export const hero = {
  title: ["One AI.", "Every marketplace.", "Always on."],
  lede: "Aan is your **24/7 e-commerce account manager**. It watches your Amazon, Walmart and Shopify accounts around the clock and acts before problems cost you.",
  primary: { label: "Book a demo", href: "https://www.anarix.ai/contact-us" },
  secondary: { label: "Meet Aan", href: "/aan" },
  bubble: "I'm Aan. The Guardian of your Business!",
};

export const mission = {
  statement: "**We are building the guardian every seller deserves.** An AI that watches every change and never stops working for your business.",
  proof: [
    { figure: "$1.2B", text: "GMV driven for the brands Anarix works with" },
    { figure: "500+", text: "brands managed across Amazon and Walmart" },
    { figure: "12.8%", text: "average TACoS across the brands we manage" },
  ],
};

export const night = {
  title: "You sleep. Aan doesn't.",
  statement: "One night on one account. Aan keeps watch from close to open, handles what your rules allow and leaves you a short brief for the morning.",
  note: "A sample night. Figures are illustrative.",
  start: { m: 0, bubble: "Evening. I've got it from here." },
  events: [
    { m: 180, time: "9:00 PM", text: "Lights out. Aan on watch.", at: "home", bubble: "Watching every store." },
    { m: 304, time: "11:04 PM", text: "Price undercut. Flagged.", at: "store", bubble: "Undercut by $3. Flagged." },
    { m: 494, time: "2:14 AM", text: "$86 wasted. Paused.", at: "ads", bubble: "$86, 0 sales. Paused." },
    { m: 640, time: "4:40 AM", text: "Low stock. Reorder drafted.", at: "warehouse", bubble: "Reorder drafted for you." },
    { m: 780, time: "7:00 AM", text: "3 fixes. $1,240 saved.", at: "home", bubble: "Good morning." },
  ],
} as const;

export const good = {
  title: "AI for good.",
  line: "Built to earn your trust.",
  bubble: "On your side.",
  commitments: [
    { title: "It shows its work.", text: "Every action comes with the reason and the numbers behind it." },
    { title: "You stay in charge.", text: "Your rules decide what Aan may do. Approval mode holds any change above your limit until you say yes." },
    { title: "It gives you time back.", text: "Problems are handled as they happen and summed up in one morning brief, so the constant checking can stop." },
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
    link: { label: "Meet Aan", href: "/aan" },
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
      { t: "Four steps to connect", d: "Choose your AI, add the connector, sign in, check it." },
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
  title: "Meet Aan.",
  body: "Aan is the AI inside Anarix: your 24/7 account manager. It reads every change across your Amazon, Walmart and Shopify accounts, explains it in plain words and acts within the rules you set. This is Aan's debut.",
  primary: { label: "Book a demo", href: "https://www.anarix.ai/contact-us" },
  secondary: "Talk to Aan",
  services: { lead: "Rather we run it for you?", label: "See Anarix Services", href: "https://www.anarix.ai" },
  bubble: "Ready when you are.",
};

/** render **bold** phrases as <b> inside grey prose */
export function inkSplit(text: string): { ink: boolean; text: string }[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) => (part.startsWith("**") ? { ink: true, text: part.slice(2, -2) } : { ink: false, text: part }));
}
