// Isometric helpers shared by the machines (world units -> svg px).
export type Pt = readonly [number, number];

export function makeIso(ox: number, oy: number, s = 1) {
  const iso = (x: number, y: number, z = 0): Pt => [ox + (x - y) * 0.866 * s, oy + (x + y) * 0.5 * s - z * s];
  return iso;
}

export const pts = (...p: Pt[]) => p.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");

/** top / left (+y) / right (+x) faces of an iso box */
export function isoBox(iso: ReturnType<typeof makeIso>, x: number, y: number, w: number, d: number, h: number, z0 = 0) {
  return {
    top: pts(iso(x, y, z0 + h), iso(x + w, y, z0 + h), iso(x + w, y + d, z0 + h), iso(x, y + d, z0 + h)),
    left: pts(iso(x, y + d, z0), iso(x + w, y + d, z0), iso(x + w, y + d, z0 + h), iso(x, y + d, z0 + h)),
    right: pts(iso(x + w, y, z0), iso(x + w, y + d, z0), iso(x + w, y + d, z0 + h), iso(x + w, y, z0 + h)),
  };
}

/** iso ellipse (a circle lying on the ground plane) as an svg path */
export function isoCircle(iso: ReturnType<typeof makeIso>, cx: number, cy: number, r: number, z = 0, n = 48) {
  let d = "";
  for (let k = 0; k <= n; k++) {
    const a = (k / n) * Math.PI * 2;
    const [x, y] = iso(cx + r * Math.cos(a), cy + r * Math.sin(a), z);
    d += `${k ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d + "Z";
}
