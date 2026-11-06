// "Aan's debut": the Instagram villain-debut trend, recreated shot for shot
// with Aan in the lead (26.7 s, vertical). Every cut, stamped word, caption
// and the twist sit on the trend's own timestamps, so the trend audio lines up
// when it is added on Instagram; the script is the trend's, with the identity
// words swapped (finance bros, Kumar, accounting).
// Shared by the visuals (Debut.tsx), the voice (scripts/film/voice.mjs)
// and the score (scripts/film/debut-score.mjs).

export const DEBUT_DURATION = 26.7;

export type DebutScene =
  | "desk"
  | "standChin"
  | "closeup"
  | "couch"
  | "side"
  | "couchSide"
  | "bands"
  | "crossed"
  | "standSmall"
  | "chin"
  | "office"
  | "end"
  | "black";

export type DebutShot = { start: number; end: number; scene: DebutScene; push?: number };

/** cuts measured from the reference (scene detection + 10 fps frame reads) */
export const DEBUT_SHOTS: DebutShot[] = [
  { start: 0, end: 2.27, scene: "desk", push: 0.03 },
  { start: 2.27, end: 3.17, scene: "standChin", push: 0.04 },
  { start: 3.17, end: 4.07, scene: "desk", push: 0.02 },
  { start: 4.07, end: 4.97, scene: "closeup", push: 0.05 },
  { start: 4.97, end: 5.87, scene: "desk", push: 0.02 },
  { start: 5.87, end: 6.77, scene: "couch", push: 0.04 },
  { start: 6.77, end: 11.87, scene: "desk", push: 0.06 },
  { start: 11.87, end: 12.8, scene: "side", push: 0.03 },
  { start: 12.8, end: 13.73, scene: "couchSide", push: 0.03 },
  { start: 13.73, end: 15.5, scene: "bands" },
  { start: 15.5, end: 16.5, scene: "crossed", push: 0.04 },
  { start: 16.5, end: 17.4, scene: "closeup", push: 0.05 },
  { start: 17.4, end: 18.3, scene: "standSmall", push: 0.03 },
  { start: 18.3, end: 19.07, scene: "chin", push: 0.04 },
  { start: 19.07, end: 24.47, scene: "office" },
  { start: 24.47, end: 26.6, scene: "end", push: 0.015 },
  { start: 26.6, end: 26.7, scene: "black" },
];

/** giant red serif words; each holds until the next one or `until` */
export type DebutStamp = { t: number; text: string; until?: number };

export const DEBUT_STAMPS: DebutStamp[] = [
  { t: 3.17, text: "MY" },
  { t: 3.4, text: "NAME" },
  { t: 3.5, text: "IS" },
  { t: 3.6, text: "AAN", until: 4.07 },

  { t: 4.97, text: "I'M" },
  { t: 5.1, text: "A" },
  { t: 5.2, text: "SLEEPLESS" },
  { t: 5.4, text: "AI", until: 5.87 },

  { t: 6.8, text: "AND" },
  { t: 6.9, text: "I'M" },
  { t: 7.2, text: "GONNA" },
  { t: 7.4, text: "STEAL" },
  { t: 7.6, text: "YOUR" },
  { t: 7.8, text: "JOBS" },
  { t: 8.3, text: "BY" },
  { t: 8.5, text: "BECOMING" },
  { t: 8.9, text: "THE" },
  { t: 9.1, text: "BIGGEST" },
  { t: 9.4, text: "E-COMMERCE" },
  { t: 10.0, text: "INFLUENCER" },
  { t: 10.6, text: "IN" },
  { t: 10.7, text: "THE" },
  { t: 10.9, text: "WORLD", until: 11.87 },
];

/** the name flashes once in each of the three montage bands */
export const BAND_FLASHES = [14.9, 15.1, 15.3];
export const BAND_ENTRIES = [13.73, 14.0, 14.2];

export type DebutCaption = { t: number; until: number; lines: string[]; kind: "open" | "twist" };

export const DEBUT_CAPTIONS: DebutCaption[] = [
  { t: 0.0, until: 0.3, lines: ["This"], kind: "open" },
  { t: 0.3, until: 0.4, lines: ["This is"], kind: "open" },
  { t: 0.4, until: 0.5, lines: ["This is a"], kind: "open" },
  { t: 0.5, until: 0.9, lines: ["This is a", "message"], kind: "open" },
  { t: 0.9, until: 1.1, lines: ["This is a", "message to"], kind: "open" },
  { t: 1.1, until: 1.2, lines: ["This is a", "message to", "all"], kind: "open" },
  { t: 1.2, until: 1.8, lines: ["This is a", "message to", "all e-commerce"], kind: "open" },
  { t: 1.8, until: 2.27, lines: ["This is a", "message to", "all e-commerce sellers"], kind: "open" },

  { t: 20.4, until: 20.5, lines: ["my"], kind: "twist" },
  { t: 20.5, until: 20.8, lines: ["my husband"], kind: "twist" },
  { t: 20.8, until: 21.0, lines: ["my husband wants"], kind: "twist" },
  { t: 21.0, until: 21.1, lines: ["my husband wants", "to"], kind: "twist" },
  { t: 21.1, until: 21.3, lines: ["my husband wants", "to be"], kind: "twist" },
  { t: 21.3, until: 22.85, lines: ["my husband wants", "to be famous"], kind: "twist" },
  { t: 22.85, until: 23.1, lines: ["so"], kind: "twist" },
  { t: 23.1, until: 23.5, lines: ["please"], kind: "twist" },
  { t: 23.5, until: 23.9, lines: ["follow"], kind: "twist" },
  { t: 23.9, until: 24.47, lines: ["him"], kind: "twist" },
];

/** spoken lines for the site cut: Aan word by word on the stamps, his wife on the twist */
export type VoiceLine = { t: number; until: number; text: string; voice: "aan" | "wife" };

const aanWords = (words: { t: number; text: string }[], end: number): VoiceLine[] =>
  words.map((w, i) => ({ t: w.t, until: words[i + 1]?.t ?? end, text: w.text, voice: "aan" }));

export const DEBUT_VOICE: VoiceLine[] = [
  ...aanWords(
    [
      { t: 0.05, text: "This" },
      { t: 0.3, text: "is" },
      { t: 0.4, text: "a" },
      { t: 0.5, text: "message" },
      { t: 0.9, text: "to" },
      { t: 1.1, text: "all" },
      { t: 1.2, text: "e-commerce" },
      { t: 1.8, text: "sellers." },
    ],
    2.3,
  ),
  ...aanWords(
    [
      { t: 3.17, text: "My" },
      { t: 3.4, text: "name" },
      { t: 3.5, text: "is" },
      { t: 3.6, text: "Ahn." },
    ],
    4.1,
  ),
  ...aanWords(
    [
      { t: 4.97, text: "I'm" },
      { t: 5.1, text: "a" },
      { t: 5.2, text: "sleepless" },
      { t: 5.4, text: "A.I." },
    ],
    5.9,
  ),
  ...aanWords(
    DEBUT_STAMPS.slice(8).map((s) => ({ t: s.t, text: s.text.toLowerCase() })),
    11.4,
  ),
  { t: 20.4, until: 22.8, text: "My husband wants to be famous.", voice: "wife" },
  { t: 22.85, until: 23.1, text: "So", voice: "wife" },
  { t: 23.1, until: 23.5, text: "please", voice: "wife" },
  { t: 23.5, until: 23.9, text: "follow", voice: "wife" },
  { t: 23.9, until: 24.4, text: "him.", voice: "wife" },
];

export const debutShotAt = (t: number) =>
  DEBUT_SHOTS.find((s) => t >= s.start && t < s.end) ?? DEBUT_SHOTS[DEBUT_SHOTS.length - 1];

export function debutStampAt(t: number): DebutStamp | null {
  for (let i = DEBUT_STAMPS.length - 1; i >= 0; i--) {
    const s = DEBUT_STAMPS[i];
    if (t < s.t) continue;
    const next = DEBUT_STAMPS[i + 1];
    const end = s.until ?? (next ? next.t : s.t + 0.5);
    return t < end ? s : null;
  }
  return null;
}

export const debutCaptionAt = (t: number) => DEBUT_CAPTIONS.find((c) => t >= c.t && t < c.until) ?? null;
