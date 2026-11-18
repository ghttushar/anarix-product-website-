// "Aan's debut": a vertical reel in the villain-debut trend's grammar (hard
// cuts, giant red serif words, a three-band montage, a DEBUT card) with a
// positive script: Aan is your 24/7 account manager. Every shot is drawn
// (DebutScenes.tsx).
//
// The voice keeps its own pace. scripts/film/voice-winrt.mjs records each
// line's spoken length and when each word lands (debut-voice.json); the cuts
// below are laid out around those lengths, and the stamped words follow the
// voice. Shared by the visuals (Debut.tsx), the voice and the score.

import voiceData from "./debut-voice.json" with { type: "json" };

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
export type Token = { show: string; say?: string; br?: boolean };
export type VoLine = { id: string; t: number; until: number; display: "caption" | "stamp" | "none"; tokens: Token[] };

const words = (s: string): Token[] => s.split(" ").map((w) => ({ show: w }));
const SEVEN: Token = { show: "24/7", say: "twenty-four seven" };

/** Aan's voice-over, one sentence per line (the name is written plainly) */
const SCRIPT: Omit<VoLine, "t" | "until">[] = [
  { id: "open", display: "caption", tokens: [...words("This is a"), { show: "message", br: true }, { show: "to" }, { show: "all", br: true }, ...words("e-commerce sellers.")] },
  { id: "name", display: "stamp", tokens: words("My name is Aan.") },
  { id: "role", display: "stamp", tokens: [...words("I'm your"), SEVEN, ...words("account manager.")] },
  { id: "help", display: "stamp", tokens: words("And I'm here to help you grow your e-commerce business, by watching your stores day and night.") },
  { id: "cover", display: "none", tokens: words("Ads, pricing, stock, profit. All covered.") },
  { id: "rest", display: "none", tokens: words("So you can rest, while your business grows.") },
  { id: "end", display: "none", tokens: [{ show: "Aan." }, ...words("Your"), SEVEN, ...words("account manager.")] },
];

/* ------------------------------------------- the voice: lengths and words */
type Spoken = { length: number; words: (number | null)[] };
const VOICE = voiceData as unknown as Record<string, Spoken | number[] | string>;
/** fallbacks (the first Mark recording) until the voice script has run */
const FALLBACK: Record<string, number> = { open: 2.3, name: 1.3, role: 2.2, help: 5.2, cover: 4.6, rest: 3.0, end: 3.8 };
const spoken = (id: string): Spoken => {
  const v = VOICE[id];
  return v && typeof v === "object" && !Array.isArray(v) ? v : { length: FALLBACK[id], words: [] };
};

/* --------------------------------------------- the cuts, around the voice */
const CUT = 0.9; // the trend's cut: one silhouette beat
const shots: DebutShot[] = [];
const lineAt: Record<string, number> = {};
let now = 0;
const shot = (scene: DebutScene, length: number, push?: number) => {
  shots.push({ start: +now.toFixed(3), end: +(now + length).toFixed(3), scene, push });
  now += length;
};
/** a desk shot that holds for its whole line, plus a breath */
const deskLine = (id: string, lead: number, min: number, push: number) => {
  lineAt[id] = now + lead;
  shot("desk", Math.max(min, lead + spoken(id).length + 0.12), push);
};

deskLine("open", 0.1, 2.27, 0.03);
shot("standChin", CUT, 0.04);
deskLine("name", 0.05, 1.33, 0.02);
shot("closeup", CUT, 0.05);
deskLine("role", 0.05, 2.2, 0.03);
shot("couch", CUT, 0.04);
deskLine("help", 0.05, 5.1, 0.06);

// "Ads, pricing, stock, profit. All covered." over the window, the couch and
// the montage; the montage holds until the line is done
lineAt.cover = now + 0.15;
shot("side", CUT, 0.03);
shot("couchSide", CUT, 0.03);
const bandsStart = now;
shot("bands", Math.max(1.8, lineAt.cover + spoken("cover").length + 0.15 - now));
const bandsEnd = now;

// "So you can rest, while your business grows." over four silhouettes
lineAt.rest = now + 0.4;
shot("crossed", CUT, 0.04);
shot("closeup", CUT, 0.05);
shot("standSmall", CUT, 0.03);
shot("chin", Math.max(CUT, lineAt.rest + spoken("rest").length + 0.2 - now), 0.04);

// through white into the DEBUT card
const endStart = now;
lineAt.end = endStart + 0.6;
shot("end", Math.max(4.5, 0.6 + spoken("end").length + 0.9), 0.015);
shot("black", 0.1);

export const DEBUT_SHOTS: DebutShot[] = shots;
export const DEBUT_DURATION = +now.toFixed(3);

/** the montage: three bands land one after another, then the name flashes in all three */
export const BAND_ENTRIES = [bandsStart, bandsStart + 0.27, bandsStart + 0.47].map((t) => +t.toFixed(3));
export const BAND_FLASHES = [bandsEnd - 0.63, bandsEnd - 0.43, bandsEnd - 0.23].map((t) => +t.toFixed(3));

/** when the white wash peaks between the last silhouette and the DEBUT card */
export const WHITE_IN = +(endStart - 0.22).toFixed(3);
export const DEBUT_WORD = +(endStart + 0.28).toFixed(3);

export const DEBUT_VO: VoLine[] = SCRIPT.map((l) => ({ ...l, t: +lineAt[l.id].toFixed(3), until: +(lineAt[l.id] + spoken(l.id).length).toFixed(3) }));

/* ---------------------------------------------- word timings from the voice */
type Timed = { show: string; t: number; br?: boolean };
const timed = (id: string): Timed[] => {
  const line = DEBUT_VO.find((l) => l.id === id)!;
  const at = spoken(id).words;
  return line.tokens.map((tok, i) => ({ show: tok.show, br: tok.br, t: at[i] != null ? line.t + (at[i] as number) : line.t + ((line.until - line.t) * i) / line.tokens.length }));
};

const clean = (w: string) => w.replace(/[.,]/g, "").toUpperCase();

export type DebutStamp = { t: number; until: number; text: string };

/** every word of the stamped lines, held until the next word lands */
export const DEBUT_STAMPS: DebutStamp[] = DEBUT_VO.filter((l) => l.display === "stamp").flatMap((l) => {
  const w = timed(l.id);
  const sh = DEBUT_SHOTS.find((s) => l.t >= s.start && l.t < s.end)!;
  return w.map((x, i) => ({ t: x.t, until: i < w.length - 1 ? w[i + 1].t : sh.end, text: clean(x.show) }));
});

export type DebutCaption = { t: number; until: number; lines: string[] };

/** the opening caption builds word by word as Aan says it */
export const DEBUT_CAPTIONS: DebutCaption[] = (() => {
  const w = timed("open");
  const first = DEBUT_SHOTS[0];
  const out: DebutCaption[] = [];
  const lines: string[] = [""];
  w.forEach((x, i) => {
    if (x.br) lines.push("");
    lines[lines.length - 1] = `${lines[lines.length - 1]} ${x.show}`.trim();
    out.push({ t: i === 0 ? 0 : x.t, until: i < w.length - 1 ? w[i + 1].t : first.end, lines: [...lines] });
  });
  return out;
})();

export const debutShotAt = (t: number) => DEBUT_SHOTS.find((s) => t >= s.start && t < s.end) ?? DEBUT_SHOTS[DEBUT_SHOTS.length - 1];

export const debutStampAt = (t: number) => DEBUT_STAMPS.find((s) => t >= s.t && t < s.until) ?? null;

export const debutCaptionAt = (t: number) => DEBUT_CAPTIONS.find((c) => t >= c.t && t < c.until) ?? null;
