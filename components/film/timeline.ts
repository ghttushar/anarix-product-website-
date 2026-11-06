// "Ninety seconds with Aan": one master timeline (seconds) shared by the
// visuals (Film.tsx) and the soundtrack (scripts/score.mjs). Structure follows
// the "villain debut" trend: a whispered threat, giant stamped words on every
// beat, hard cuts to silhouettes and close-ups, a deadpan twist, a DEBUT card.

export const DURATION = 90;
export const FPS = 30;

export type SceneId =
  | "room"
  | "seamless"
  | "closeup"
  | "coins"
  | "signals"
  | "profit"
  | "rules"
  | "brain"
  | "mcp"
  | "night"
  | "stats"
  | "twist"
  | "end";

export type Shot = {
  start: number;
  end: number;
  scene: SceneId;
  /** framing variant inside a scene */
  variant?: "center" | "side" | "low" | "full" | "eyes";
  /** slow camera push over the shot (scale delta) */
  push?: number;
};

export const SHOTS: Shot[] = [
  // ACT 1 · the message
  { start: 0, end: 4.6, scene: "room", push: 0.05 },
  { start: 4.6, end: 6.0, scene: "seamless", variant: "center", push: 0.03 },
  { start: 6.0, end: 8.0, scene: "room", push: 0.03 },
  { start: 8.0, end: 9.6, scene: "closeup", variant: "eyes", push: 0.08 },
  { start: 9.6, end: 12.0, scene: "room", push: 0.03 },
  { start: 12.0, end: 13.2, scene: "seamless", variant: "low", push: 0.02 },
  { start: 13.2, end: 17.6, scene: "room", push: 0.05 },
  { start: 17.6, end: 19.6, scene: "coins", push: 0.06 },
  { start: 19.6, end: 21.0, scene: "seamless", variant: "side", push: 0.03 },
  { start: 21.0, end: 24.0, scene: "closeup", variant: "center", push: 0.1 },
  // ACT 2 · the proof
  { start: 24.0, end: 31.0, scene: "signals", push: 0.06 },
  { start: 31.0, end: 38.0, scene: "profit", push: 0.06 },
  { start: 38.0, end: 45.0, scene: "rules", push: 0.06 },
  { start: 45.0, end: 52.0, scene: "brain", push: 0.06 },
  { start: 52.0, end: 58.0, scene: "mcp", push: 0.06 },
  { start: 58.0, end: 66.0, scene: "night", push: 0.02 },
  // ACT 3 · the climax: hard cuts on every word
  { start: 66.0, end: 67.0, scene: "room", push: 0.04 },
  { start: 67.0, end: 67.6, scene: "signals" },
  { start: 67.6, end: 68.6, scene: "profit" },
  { start: 68.6, end: 69.0, scene: "rules" },
  { start: 69.0, end: 69.7, scene: "brain" },
  { start: 69.7, end: 71.5, scene: "closeup", variant: "eyes", push: 0.12 },
  { start: 71.5, end: 75.2, scene: "stats", push: 0.03 },
  // ACT 4 · the twist
  { start: 75.2, end: 84.5, scene: "twist" },
  // ACT 5 · the debut
  { start: 84.5, end: 90.0, scene: "end", push: 0.025 },
];

export type Stamp = { t: number; text: string; until?: number; sub?: string };

/** giant stamped words; each holds until the next stamp unless `until` is set */
export const STAMPS: Stamp[] = [
  { t: 6.0, text: "MY NAME" },
  { t: 6.9, text: "AAN", until: 8.0 },
  { t: 9.6, text: "I'M AN" },
  { t: 10.4, text: "AI", until: 12.0 },
  { t: 13.2, text: "AND I'M" },
  { t: 13.9, text: "HERE" },
  { t: 14.4, text: "TO" },
  { t: 14.9, text: "WATCH" },
  { t: 15.6, text: "YOUR" },
  { t: 16.2, text: "STORES" },
  { t: 16.9, text: "24/7", until: 17.6 },
  { t: 22.4, text: "WATCH ME", until: 24.0 },

  { t: 24.0, text: "I SEE" },
  { t: 24.7, text: "EVERYTHING", until: 25.8 },
  { t: 31.0, text: "I COUNT" },
  { t: 31.7, text: "EVERY DOLLAR", until: 32.8 },
  { t: 38.0, text: "I STOP" },
  { t: 38.7, text: "THE WASTE", until: 39.8 },
  { t: 45.0, text: "I ANSWER" },
  { t: 45.7, text: "ANYTHING", until: 46.6 },
  { t: 52.0, text: "I PLUG INTO" },
  { t: 52.8, text: "ANY AI", until: 53.9 },
  { t: 58.0, text: "WHILE YOU" },
  { t: 58.7, text: "SLEEP", until: 59.8 },

  { t: 66.0, text: "BECOMING" },
  { t: 66.6, text: "THE" },
  { t: 67.0, text: "BIGGEST" },
  { t: 67.6, text: "GUARDIAN" },
  { t: 68.2, text: "OF" },
  { t: 68.6, text: "THE" },
  { t: 69.0, text: "E-COM" },
  { t: 69.7, text: "WORLD", until: 71.5 },
  { t: 71.7, text: "$1.2B", sub: "GMV driven", until: 72.9 },
  { t: 72.9, text: "500+", sub: "brands", until: 74.1 },
  { t: 74.1, text: "24/7", sub: "on watch", until: 75.2 },
];

export type Caption = { t: number; until: number; text: string; kind: "open" | "twist" };

export const CAPTIONS: Caption[] = [
  { t: 0.3, until: 0.7, text: "This", kind: "open" },
  { t: 0.7, until: 1.2, text: "This is a", kind: "open" },
  { t: 1.2, until: 1.8, text: "This is a message", kind: "open" },
  { t: 1.8, until: 2.4, text: "This is a message to all", kind: "open" },
  { t: 2.4, until: 3.2, text: "This is a message to all e-commerce", kind: "open" },
  { t: 3.2, until: 4.6, text: "This is a message to all e-commerce sellers", kind: "open" },
  { t: 75.7, until: 77.0, text: "ok so he's technically", kind: "twist" },
  { t: 77.0, until: 78.2, text: "a SaaS", kind: "twist" },
  { t: 78.2, until: 79.6, text: "but he really wants", kind: "twist" },
  { t: 79.6, until: 81.2, text: "to be famous", kind: "twist" },
  { t: 81.2, until: 82.2, text: "please", kind: "twist" },
  { t: 82.2, until: 84.5, text: "help him", kind: "twist" },
];

/** scene-local beats used by both the cards and the sound effects */
export const BEATS = {
  signalsAlert: 26.0,
  signalsFixed: 28.4,
  profitCountStart: 33.2,
  profitCountEnd: 36.2,
  rulesStop: [40.2, 41.6, 43.0],
  brainTypeStart: 46.8,
  brainTypeEnd: 48.6,
  brainAnswer: 49.2,
  mcpPlugs: [54.0, 54.8, 55.6],
  nightStart: 59.4,
  nightEnd: 65.6,
  scratch: 75.2,
  debut: 84.5,
  url: 87.2,
};

export const shotAt = (t: number) => SHOTS.find((s) => t >= s.start && t < s.end) ?? SHOTS[SHOTS.length - 1];

export function stampAt(t: number): Stamp | null {
  for (let i = STAMPS.length - 1; i >= 0; i--) {
    const s = STAMPS[i];
    if (t < s.t) continue;
    const next = STAMPS[i + 1];
    const end = s.until ?? (next ? next.t : s.t + 0.6);
    return t < end ? s : null;
  }
  return null;
}

export const captionAt = (t: number) => CAPTIONS.find((c) => t >= c.t && t < c.until) ?? null;
