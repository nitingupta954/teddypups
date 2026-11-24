/**
 * Hand-drawn look for a puppy's sketch card: a wobbly photo mask, a pencil outline
 * with a partial "retrace", a colour wash behind it and 2–3 doodles around the rim.
 *
 * Everything is derived from a PRNG seeded with the puppy's slug, so a pup always
 * gets the same drawing (server and client agree, no hydration mismatch).
 */

type Point = [number, number];
type Rng = () => number;

export type DoodleKind = "sparkle" | "heart" | "dashes" | "swirl" | "dots" | "paw";

export type Doodle = { kind: DoodleKind; x: number; y: number; rot: number; size: number; ink: string };

export type Sketch = {
  /** Closed path used (as an SVG data URL) to mask the photo. */
  mask: string;
  outline: string;
  /** Open arc drawn over part of the outline, like a second pencil pass. */
  retrace: string;
  wash: { d: string; dx: number; dy: number; color: string };
  /** Card tilt in degrees. */
  tilt: number;
  doodles: Doodle[];
};

const WASHES = ["#f2be6b", "#f9cdbf", "#bfddf5", "#fbe3b4", "#e8c39a"];
const INKS = ["#c2622b", "#a24a1a", "#2a170e", "#d4893f"];
const KINDS: DoodleKind[] = ["sparkle", "heart", "dashes", "swirl", "dots", "paw"];

/** FNV-1a hash of the seed feeding a mulberry32 generator. */
function seededRandom(seed: string): Rng {
  let h = 0x811c9dc5;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 0x1000193);
  let state = h >>> 0;
  return () => {
    let t = (state = (state + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

/** Points on a wobbly circle around (50, 50): radius `r` ± `wobble`, optionally only an arc. */
function wobblyRing(rand: Rng, r: number, wobble: number, count = 40, start = 0, sweep = Math.PI * 2): Point[] {
  const phase = [rand() * 6.28, rand() * 6.28, rand() * 6.28];
  const squash = 1 + (rand() - 0.5) * 0.05;
  const closed = sweep >= Math.PI * 2;
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const a = start + (i / (closed ? count : count - 1)) * sweep;
    const radius =
      r + wobble * (0.55 * Math.sin(2 * a + phase[0]) + 0.3 * Math.sin(3 * a + phase[1]) + 0.15 * Math.sin(5 * a + phase[2]));
    points.push([50 + Math.cos(a) * radius * squash, 50 + (Math.sin(a) * radius) / squash]);
  }
  return points;
}

const fmt = (n: number) => n.toFixed(2);

/** Smooth path through the points (Catmull-Rom converted to cubic Béziers). */
function smoothPath(points: Point[], closed: boolean): string {
  const n = points.length;
  const at = (i: number) => points[closed ? (i + n) % n : Math.min(n - 1, Math.max(0, i))];
  let d = `M${fmt(points[0][0])} ${fmt(points[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${fmt(c1[0])} ${fmt(c1[1])} ${fmt(c2[0])} ${fmt(c2[1])} ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return closed ? `${d}Z` : d;
}

export function makeSketch(seed: string): Sketch {
  const rand = seededRandom(seed);
  const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)];

  const mask = smoothPath(wobblyRing(rand, 45.5, 2.6), true);
  const outline = smoothPath(wobblyRing(rand, 47.8, 3.1), true);
  const retraceStart = rand() * Math.PI * 2;
  const retrace = smoothPath(wobblyRing(rand, 49, 3.4, 30, retraceStart, Math.PI * (1.15 + 0.5 * rand())), false);
  const wash = { d: smoothPath(wobblyRing(rand, 46.5, 3.6), true), dx: (rand() - 0.5) * 9, dy: 3 + 4 * rand(), color: pick(WASHES) };
  const tilt = (rand() - 0.5) * 5;

  // Doodles sit in different zones around the rim (angles in units of π), in shuffled order.
  const zones = [
    [0.86, 1.08], // left
    [1.16, 1.42], // top left
    [-0.08, 0.16], // right
  ]
    .map((zone) => ({ zone, key: rand() }))
    .sort((a, b) => a.key - b.key)
    .map((z) => z.zone);

  const doodles: Doodle[] = [];
  const used = new Set<DoodleKind>();
  const count = 2 + Math.floor(2 * rand());
  for (let i = 0; i < count; i++) {
    let kind = pick(KINDS);
    if (used.has(kind)) kind = KINDS.find((k) => !used.has(k))!;
    used.add(kind);
    const [from, to] = zones[i];
    const angle = Math.PI * (from + rand() * (to - from));
    const dist = 55 + 4 * rand();
    doodles.push({
      kind,
      x: 50 + Math.cos(angle) * dist,
      y: 50 + Math.sin(angle) * dist,
      rot: (rand() - 0.5) * 50,
      size: 0.85 + 0.35 * rand(),
      ink: pick(INKS),
    });
  }

  return { mask, outline, retrace, wash, tilt, doodles };
}

/** CSS `mask-image` value for a closed path in a 100×100 box. */
export function svgMask(d: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${d}" fill="#000"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
