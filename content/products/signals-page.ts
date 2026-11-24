/*
  The Signals page in the Relay design (getlayers), with Signals' own facts.
  Every number here is either a product fact (79 alert reasons in 12 groups,
  7 days of checking after every fix, Amazon, Walmart and Shopify) or sample
  data that the page labels as such. No prices, no quotes, no customers.
*/

export const DEMO = { label: "Schedule a demo", href: "https://www.anarix.ai/contact-us" };

export const relay = {
  hero: {
    pill: "live / 79 alert reasons watched",
    title: ["3am change.", "9am answer."] as const,
    lede: "Signals watches every price, Buy Box, budget and stock level on Amazon, Walmart and Shopify, and tells you what changed, why, and what to do about it.",
    secondary: { label: "See how it works", href: "#how" },
    note: "amazon / walmart / shopify / every store, all night",
  },

  /** the graph card in the hero: one signal, from the change to the fix */
  graph: {
    name: "Buy Box lost",
    meta: "3 steps / 1 fix",
    status: "watching",
    trigger: { t: "Buy Box lost", d: "walmart · 01:44" },
    cause: { t: "Undercut by $2.10", d: "root cause" },
    yes: { t: "Match at $34.89", d: "waiting on a yes" },
    no: { t: "Hold, tell the team", d: "#store-ops" },
    wait: "26 min",
    last: [
      { t: "03:12", what: "ad eligibility lost", where: "amazon", v: "$1,651" },
      { t: "02:30", what: "undercut by $3", where: "shopify", v: "$412" },
      { t: "01:44", what: "buy box lost", where: "walmart", v: "$940" },
      { t: "00:58", what: "budget capped early", where: "amazon", v: "$318" },
      { t: "00:21", what: "stock under 7 days", where: "walmart", v: "$205" },
    ],
  },

  watches: {
    label: "watches 79 alert reasons in 12 groups, on every store you connect",
    tiles: [
      { k: "PR", t: "price" },
      { k: "BB", t: "buy box" },
      { k: "AD", t: "ad eligibility" },
      { k: "BU", t: "budget" },
      { k: "ST", t: "stock" },
      { k: "LI", t: "listings" },
      { k: "SU", t: "suppressed" },
      { k: "BI", t: "billing" },
    ],
    more: "79 reasons",
  },

  glue: {
    pill: "signals",
    title: { a: "Most of a bad morning is", em: "finding out", b: "." },
    body: "Something changed at 3am and nobody saw it. Signals does the finding out, explains it in plain words, and leaves you the decision.",
  },

  rows: [
    {
      n: "01",
      t: "One feed, every store",
      d: "Prices, Buy Box, listings, ad eligibility, budgets and stock, on Amazon, Walmart and Shopify, all night.",
    },
    {
      n: "02",
      t: "Fixed from the alert",
      d: "Each signal comes with its root cause, the money at risk and a fix. Run it on the items you pick, or share it to Slack, Teams or email.",
    },
    {
      n: "03",
      t: "Every fix is checked",
      d: "Aan follows the result for the next 7 days and reports what the fix was worth.",
    },
  ],

  /** row 01: one night of watching, as a run */
  night: {
    head: "night of jul 18",
    meta: "3 stores / 4 changes",
    rows: [
      { k: "prices", d: "1,240 checked", from: 0, to: 1 },
      { k: "buy box", d: "312 offers", from: 0.05, to: 0.96 },
      { k: "ad eligibility", d: "86 asins", from: 0.1, to: 0.9 },
      { k: "stock", d: "1,240 items", from: 0.02, to: 0.98 },
    ],
    found: "03:12 · change found",
    ask: "ask you",
    askNote: "on execute",
    axis: ["00:00", "02:00", "04:00", "06:00", "08:00"],
  },

  /** row 02: the alert where the team already is */
  thread: {
    channel: "#store-ops",
    when: "today",
    time: "01:46",
    text: "Buy Box lost on Chef knife, 8 inch. A reseller undercut you by $2.10. Match at $34.89? It stays above your floor price.",
    fields: [
      { k: "at risk", v: "$940 tonight" },
      { k: "store", v: "Walmart US" },
      { k: "confidence", v: "91%" },
    ],
    yes: "Match price",
    no: "Hold",
    waiting: "waiting 26 min",
    done: "Price matched by you · 01:52",
    held: "Held. Logged with your reason.",
  },

  /** row 03: ad sales on the fixed product, checked for 7 days */
  checked: {
    head: "ad sales after the fix",
    meta: "checked for 7 days",
    days: [
      { d: "fix", v: 640 },
      { d: "day 1", v: 860 },
      { d: "day 2", v: 1120 },
      { d: "day 3", v: 1190 },
      { d: "day 4", v: 1230 },
      { d: "day 5", v: 1215 },
      { d: "day 6", v: 1240 },
    ],
  },

  panel: {
    label: "[ what signals is for ]",
    words: ["The", "best", "alert", "is", "the", "one", "*fixed*", "before", "you", "read", "it."],
  },

  quiet: {
    pill: "coverage",
    title: { em: "Quiet", b: "in the ways that matter." },
    body: "One feed for every marketplace, ranked by what is at stake. The parts nobody demos, and the parts that decide your morning.",
    hub: {
      t: "Every store, one feed",
      d: "Amazon, Walmart and Shopify in one place. Signals also arrive from Aan, meetings, Slack, Teams and email.",
      nodes: [
        { k: "AM", t: "amazon" },
        { k: "WM", t: "walmart" },
        { k: "SH", t: "shopify" },
        { k: "SL", t: "slack" },
      ],
      foot: "amazon, walmart, shopify / one feed",
    },
    ranked: {
      t: "Biggest risk first",
      d: "Signals rank themselves by dollar impact, so the first fix is the one that matters most.",
      head: "tonight, ranked by money at risk",
      items: [
        { k: "ad eligibility lost", s: "Amazon", v: 1651 },
        { k: "buy box lost", s: "Walmart", v: 940 },
        { k: "undercut by $3", s: "Shopify", v: 412 },
      ],
      foot: "the first fix is the one that matters most",
    },
  },

  brief: {
    pill: "the morning brief",
    title: { a: "A", em: "night,", b: "seen from Signals." },
    body: "The page you keep open: what changed, what it is worth, and what is still waiting on you.",
    week: { head: "this week, change by change", chip: "watching now", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], hours: ["00", "03", "06", "09"] },
    gauge: { head: "tonight's top fix", v: 95, unit: "%", note: "confidence in the fix Aan suggests" },
    waiting: { head: "waiting on you", v: 3, unit: "signals", note: "Biggest: $1,651 on Amazon" },
    after: { head: "before and after", a: "recovered", b: "at risk" },
    where: { head: "where it changed", pins: [{ k: "amazon", v: "$1,651" }, { k: "walmart", v: "$940" }, { k: "shopify", v: "$412" }] },
  },

  numbers: {
    pill: "the facts",
    title: { a: "Counted,", em: "not", b: "estimated." },
    body: "Every reason Signals watches for, how they group, and how long it checks a fix before calling it done.",
    items: [
      { v: 79, k: "alert reasons", d: "each mapped to a recommended action", kind: "ticks" },
      { v: 12, k: "groups", d: "from suppressed listings to billing", kind: "segments" },
      { v: 7, k: "days", d: "of checking after every fix", kind: "bar" },
    ],
    notes: [
      "A change counts when it moves money: price, Buy Box, ad eligibility, budget, stock or a listing.",
      "Every signal says what changed, the root cause and the money at risk.",
      "Undo any action within 30 seconds. Every fix says whether it can be reversed.",
    ],
  },

  catalog: {
    pill: "your catalog",
    title: { a: "Watch every product, not", em: "a sample." },
    body: "Signals watches the whole catalog on every store you connect. Tell us how big yours is.",
    ask: "How many products do you sell?",
    stops: [100, 300, 1000, 3000, 10000, 30000],
    ways: [
      {
        k: "Fix it yourself",
        d: "From the alert",
        items: ["Run the fix on the items you pick", "A different action on the rest", "Undo within 30 seconds"],
        cta: DEMO,
      },
      {
        k: "Let a rule act",
        d: "With Rules",
        badge: "hands off",
        items: ["Aan acts when one of your rules allows it", "Otherwise it suggests and waits", "Every decision logged"],
        cta: { label: "See Rules", href: "/rules" },
      },
      {
        k: "Hand it off",
        d: "To your team",
        items: ["Assign it with a due date", "Share to Slack, Teams or email", "Snooze it until morning"],
        cta: DEMO,
      },
    ],
  },

  cta: {
    side: "What changed and why, every morning, on every store.",
    links: [
      { label: "Profitability", href: "/profitability" },
      { label: "Rules", href: "/rules" },
      { label: "Aan", href: "/aan" },
      { label: "MCP", href: "/mcp" },
    ],
    label: "what now",
    title: { a: "Pick the alert you", em: "dread", b: "most." },
    body: "Ask Aan about the one change you never want to find out about at 9am. Then see Signals catch it in a demo.",
    field: "Which alert would you hate to miss?",
    button: "Ask Aan",
  },

  status: ["watching amazon, walmart and shopify", "79 alert reasons in 12 groups", "every fix checked for 7 days"],
};
