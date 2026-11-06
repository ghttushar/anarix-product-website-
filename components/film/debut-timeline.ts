// "Aan's debut": a vertical reel in the villain-debut trend's grammar (hard
// cuts, backlit silhouettes, giant red serif words, a three-band montage, a
// DEBUT card) with a positive script: Aan is your 24/7 account manager.
// The voice-over is spoken as whole sentences; scripts/film/voice.mjs records
// when each word lands (debut-voice.json) and the stamps follow the voice.
// Shared by the visuals (Debut.tsx), the voice and the score.

import voice from "./debut-voice.json" with { type: "json" };

export const DEBUT_DURATION = 25.4;

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
  | "end"
  | "black";

export type DebutShot = { start: number; end: number; scene: DebutScene; push?: number };

/** the trend's 0.9 s cut grid, opened up where Aan has more to say */
export const DEBUT_SHOTS: DebutShot[] = [
  { start: 0, end: 2.27, scene: "desk", push: 0.03 },
  { start: 2.27, end: 3.17, scene: "standChin", push: 0.04 },
  { start: 3.17, end: 4.5, scene: "desk", push: 0.02 },
  { start: 4.5, end: 5.4, scene: "closeup", push: 0.05 },
  { start: 5.4, end: 7.6, scene: "desk", push: 0.03 },
  { start: 7.6, end: 8.5, scene: "couch", push: 0.04 },
  { start: 8.5, end: 13.6, scene: "desk", push: 0.06 },
  { start: 13.6, end: 14.5, scene: "side", push: 0.03 },
  { start: 14.5, end: 15.4, scene: "couchSide", push: 0.03 },
  { start: 15.4, end: 17.2, scene: "bands" },
  { start: 17.2, end: 18.1, scene: "crossed", push: 0.04 },
  { start: 18.1, end: 19.0, scene: "closeup", push: 0.05 },
  { start: 19.0, end: 19.9, scene: "standSmall", push: 0.03 },
  { start: 19.9, end: 20.8, scene: "chin", push: 0.04 },
  { start: 20.8, end: 25.3, scene: "end", push: 0.015 },
  { start: 25.3, end: 25.4, scene: "black" },
];

/** the montage: three bands land one after another, then the name flashes in all three */
export const BAND_ENTRIES = [15.4, 15.67, 15.87];
export const BAND_FLASHES = [16.57, 16.77, 16.97];

/** when the white wash peaks between the last silhouette and the DEBUT card */
export const WHITE_IN = 20.58;
export const DEBUT_WORD = 21.08;

export type Token = { show: string; say?: string; br?: boolean };
export type VoLine = { id: string; t: number; until: number; display: "caption" | "stamp" | "none"; tokens: Token[] };

const words = (s: string): Token[] => s.split(" ").map((w) => ({ show: w }));

/** Aan's voice-over, one sentence per line, placed on the cut grid */
export const DEBUT_VO: VoLine[] = [
  {
    id: "open",
    t: 0.1,
    until: 2.2,
    display: "caption",
    tokens: [...words("This is a"), { show: "message", br: true }, { show: "to" }, { show: "all", br: true }, ...words("e-commerce sellers.")],
  },
  { id: "name", t: 3.2, until: 4.45, display: "stamp", tokens: [...words("My name is"), { show: "Aan.", say: "Ahn." }] },
  {
    id: "role",
    t: 5.43,
    until: 7.55,
    display: "stamp",
    tokens: [...words("I'm your"), { show: "24/7", say: "twenty-four seven" }, ...words("account manager.")],
  },
  {
    id: "help",
    t: 8.55,
    until: 13.55,
    display: "stamp",
    tokens: words("And I'm here to help you grow your e-commerce business, by watching your stores day and night."),
  },
  { id: "cover", t: 13.75, until: 17.3, display: "none", tokens: words("Ads, pricing, stock, profit. All covered.") },
  { id: "rest", t: 17.6, until: 20.3, display: "none", tokens: words("So you can rest, while your business grows.") },
  {
    id: "end",
    t: 21.4,
    until: 24.9,
    display: "none",
    tokens: [{ show: "Aan.", say: "Ahn." }, ...words("Your"), { show: "24/7", say: "twenty-four seven" }, ...words("account manager.")],
  },
];

/* ---------------------------------------------- word timings from the voice */
type Timed = { show: string; t: number; br?: boolean };
const timed = (id: string): Timed[] => {
  const line = DEBUT_VO.find((l) => l.id === id)!;
  const at = (voice as Record<string, number[]>)[id] ?? [];
  return line.tokens.map((tok, i) => ({ show: tok.show, br: tok.br, t: at[i] ?? line.t + ((line.until - line.t) * i) / line.tokens.length }));
};

const clean = (w: string) => w.replace(/[.,]/g, "").toUpperCase();

export type DebutStamp = { t: number; until: number; text: string };

/** every word of the stamped lines, held until the next word lands */
export const DEBUT_STAMPS: DebutStamp[] = DEBUT_VO.filter((l) => l.display === "stamp").flatMap((l) => {
  const w = timed(l.id);
  const shot = DEBUT_SHOTS.find((s) => l.t >= s.start && l.t < s.end)!;
  return w.map((x, i) => ({ t: x.t, until: i < w.length - 1 ? w[i + 1].t : shot.end, text: clean(x.show) }));
});

export type DebutCaption = { t: number; until: number; lines: string[] };

/** the opening caption builds word by word as Aan says it */
export const DEBUT_CAPTIONS: DebutCaption[] = (() => {
  const w = timed("open");
  const shot = DEBUT_SHOTS[0];
  const out: DebutCaption[] = [];
  const lines: string[] = [""];
  w.forEach((x, i) => {
    if (x.br) lines.push("");
    lines[lines.length - 1] = `${lines[lines.length - 1]} ${x.show}`.trim();
    out.push({ t: i === 0 ? 0 : x.t, until: i < w.length - 1 ? w[i + 1].t : shot.end, lines: [...lines] });
  });
  return out;
})();

export const debutShotAt = (t: number) =>
  DEBUT_SHOTS.find((s) => t >= s.start && t < s.end) ?? DEBUT_SHOTS[DEBUT_SHOTS.length - 1];

export const debutStampAt = (t: number) => DEBUT_STAMPS.find((s) => t >= s.t && t < s.until) ?? null;

export const debutCaptionAt = (t: number) => DEBUT_CAPTIONS.find((c) => t >= c.t && t < c.until) ?? null;
