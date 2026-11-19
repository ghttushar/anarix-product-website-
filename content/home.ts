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
  statement: "**We are building the guardian every seller deserves.** An AI that never misses a change and never stops working for your business.",
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
  title: [string, string];
  statement: string;
  link: { label: string; href: string };
  bubble: string;
};

export const products: ProductCopy[] = [
  {
    id: "signals",
    title: ["3am change.", "9am answer."],
    statement: "Signals watches every price, Buy Box, budget and stock level, and tells you **what changed and why**.",
    link: { label: "Explore Signals", href: "/signals" },
    bubble: "Found it. Here's why.",
  },
  {
    id: "profitability",
    title: ["Revenue lies.", "Profit doesn't."],
    statement: "Sales look great until fees, ads, refunds and COGS take their share. See **true profit on every product, every day.**",
    link: { label: "Explore Profitability", href: "/profitability" },
    bubble: "Counting every fee.",
  },
  {
    id: "rules",
    title: ["Your playbook.", "On autopilot."],
    statement: "Write how you run your accounts **in plain words**. Aan turns it into rules that run every hour.",
    link: { label: "Explore Rules", href: "/rules" },
    bubble: "Good spend in. Waste out.",
  },
  {
    id: "aan",
    title: ["Ask anything.", "Get the why."],
    statement: "Ask like you'd ask your best account manager, and get **a plain answer with the numbers behind it**.",
    link: { label: "Meet Aan", href: "/aan" },
    bubble: "Thinking with your data.",
  },
  {
    id: "mcp",
    title: ["Your data.", "Any AI."],
    statement: "Plug your live marketplace data into Claude, ChatGPT, Gemini or your own agent, with **the same numbers as your dashboard**.",
    link: { label: "Explore MCP", href: "/mcp" },
    bubble: "Plugged in.",
  },
];

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
