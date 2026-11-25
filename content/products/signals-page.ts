/*
  The Signals page in the Relay design (getlayers), told from the product
  itself (Anarix's Signals, as the app shows it): an alert for anything
  that costs money or could earn more, with the dollars at stake, Aan's
  analysis, ranked fixes, partial batches with undo, and a report a week
  later. Facts: 78 alert reasons in 12 groups shown in 8 categories, 66
  action types in 8 groups, 7 days of verification, Amazon, Walmart and
  Shopify. Mockup figures come from content/app-samples.ts and are
  labelled as sample data. No prices, no quotes, no customers.
*/

export const DEMO = { label: "Schedule a demo", href: "https://www.anarix.ai/contact-us" };

export const relay = {
  hero: {
    pill: "live / 78 alert reasons watched",
    title: ["3am change.", "9am answer."] as const,
    lede: "Signals watches every store you connect for anything that costs you money or could earn you more. Each alert arrives with the dollars at stake, Aan's analysis of why it happened and ranked fixes you run on the items you choose.",
    secondary: { label: "Watch the tour", href: "#tour" },
    note: "amazon / walmart / shopify / every store, all night",
  },

  /** the product video; set src to play it, until then the frame waits */
  tour: {
    pill: "product tour",
    title: { a: "One alert, from the", em: "change", b: "to the fix." },
    body: "Follow a single alert through Signals: caught at 7:04, explained by Aan, fixed on 9 of 14 items, and checked a week later.",
    label: "Product tour",
    caption: "Signals · Alerts, Brief, Meetings and Work-station",
    video: null as { src: string; poster?: string } | null,
  },

  watches: {
    label: "watches 78 alert reasons in 12 groups, on every store you connect",
    tiles: [
      { k: "CA", t: "catalog" },
      { k: "IN", t: "inventory" },
      { k: "AD", t: "advertising" },
      { k: "PR", t: "pricing" },
      { k: "PL", t: "profitability" },
      { k: "CO", t: "compliance" },
      { k: "BI", t: "billing" },
      { k: "RE", t: "reviews" },
    ],
    more: "78 reasons",
    examples: ["a suppressed listing", "an ad-eligibility block", "a price-parity break", "low stock", "a declined card", "a negative rating"],
  },

  glue: {
    pill: "signals",
    title: { a: "Most of a bad morning is", em: "finding out", b: "." },
    body: "Something changed at 3am and nobody saw it. Signals does the finding out, puts a dollar figure on it, explains it in plain words and leaves you the decision.",
  },

  /** how it works, in the product's own order */
  flow: [
    {
      n: "01",
      t: "Caught, valued and ranked",
      d: "Every alert carries a signed dollar value: red when money is at risk, green when there is more to earn. Priority, category, store and where it came from sit on the same line.",
      facts: ["Value at risk or opportunity", "Priority, category, store, source", "Open, In progress, Done"],
    },
    {
      n: "02",
      t: "Explained by Aan",
      d: "Open an alert and Aan has already read it: what happened, the root cause, and every affected item with what it is costing you.",
      facts: ["What happened and why", "Impact on each ASIN", "Ask Aan about any alert"],
    },
    {
      n: "03",
      t: "Fixed on the items you choose",
      d: "Ranked strategies show an estimate and a confidence, with one Aan recommends. Execute asks which items to act on, so you can fix nine one way and the rest another.",
      facts: ["Estimate and confidence on every fix", "Partial batches, with undo", "66 action types in 8 groups"],
    },
    {
      n: "04",
      t: "Checked after the fix",
      d: "A fix is not done when it runs. Signals follows the result for 7 days and reports what changed, before and after, with the money it recovered.",
      facts: ["Verified over 7 days", "Before and after, metric by metric", "The money it recovered"],
    },
  ],

  panel: {
    label: "[ what signals is for ]",
    words: ["The", "best", "alert", "is", "the", "one", "*fixed*", "before", "you", "read", "it."],
  },

  sources: {
    pill: "sources",
    title: { a: "From every", em: "source,", b: "to the right person." },
    body: "Changes reach Signals from Anarix's own monitoring and from where your team already talks. Each alert then goes to whoever should act on it, a teammate or Aan.",
    hub: {
      t: "Where alerts come from",
      d: "Anarix monitoring, Aan, meetings, email, Slack and Workspace, in one list ranked by what is at stake.",
      nodes: [
        { k: "AN", t: "anarix" },
        { k: "EM", t: "email" },
        { k: "SL", t: "slack" },
        { k: "MT", t: "meetings" },
        { k: "WS", t: "workspace" },
      ],
      foot: "every source / one list",
    },
    handoff: {
      t: "Where they go",
      d: "Assign an alert to a teammate or hand it to Aan, share it by email or Workspace, and watch it move from Open to Done.",
      people: [
        { k: "Ops", note: "Store operations" },
        { k: "Marketing", note: "Listings and content" },
        { k: "Aan", note: "Works it end to end", aan: true },
      ],
      foot: "assign / share / track",
    },
  },

  brief: {
    pill: "the morning brief",
    title: { a: "A", em: "morning,", b: "seen from Signals." },
    body: "Brief is the page you open first: what is at risk, what there is to gain, what happened while you were away, and the meeting you need to be ready for.",
  },

  meetings: {
    pill: "meetings and tasks",
    title: { a: "From alert to", em: "meeting", b: "to task." },
    body: "Meetings turns your alerts into call prep: what to raise, what to get ahead of, and what was done about each. Afterwards every decision becomes a task with an owner, and Aan can complete one for you.",
  },

  numbers: {
    pill: "the facts",
    title: { a: "Counted,", em: "not", b: "estimated." },
    body: "What Signals watches for, how it groups it, what it can do about it, and how long it checks a fix before calling it done.",
    items: [
      { v: 78, k: "alert reasons", d: "from a suppressed listing to a declined card", kind: "ticks" },
      { v: 12, k: "groups", d: "shown in 8 categories", kind: "segments" },
      { v: 66, k: "action types", d: "in 8 groups, mapped to every reason", kind: "ticks" },
      { v: 7, k: "days", d: "of checking after every fix", kind: "bar" },
    ],
  },

  ways: {
    pill: "three ways to act",
    title: { a: "Fix it, let a rule fix it, or", em: "hand it off." },
    body: "Every alert ends one of three ways. You choose, alert by alert.",
    items: [
      {
        k: "Fix it yourself",
        d: "From the alert",
        items: ["Pick a ranked fix, with its estimate", "Run it on the items you choose", "Undo while it runs"],
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
        d: "To your team or to Aan",
        items: ["Assign to a teammate or to Aan", "Share by email or Workspace", "Track it from Open to Done"],
        cta: DEMO,
      },
    ],
  },

  cta: {
    side: "Signals, with Aan inside: what changed and why, every morning, on every store.",
    links: [
      { label: "Profitability", href: "/profitability" },
      { label: "Rules", href: "/rules" },
      { label: "Ask Aan", href: "/aan" },
      { label: "MCP", href: "/mcp" },
    ],
    label: "what now",
    title: { a: "Pick the alert you", em: "dread", b: "most." },
    body: "Ask Aan about the one change you never want to find out about at 9am. Then see Signals catch it in a demo.",
    field: "Which alert would you hate to miss?",
    button: "Ask Aan",
  },

  status: ["watching amazon, walmart and shopify", "78 alert reasons in 12 groups", "every fix checked for 7 days"],
};
