import puppiesJson from "@/data/puppies.json";

export type Media = {
  id: string;
  url: string;
  kind: "image" | "video";
  width: number;
  height: number;
  alt: string;
  caption: string;
  /** Focal point (0–1) used for object-position when the media is cropped. */
  focalX: number;
  focalY: number;
  /** Dominant colour, used as a background while the image loads. */
  color: string;
  blurDataUrl: string | null;
  durationS: number | null;
  poster: Media | null;
};

type Term = { slug: string; name: string };

export type Puppy = {
  id: string;
  slug: string;
  /** Pet name; empty when the listing is just "Maltipoo, girl". */
  name: string;
  displayName: string;
  breed: string;
  gender: "male" | "female" | "male-female";
  genderLabel: string;
  age: string;
  status: "available" | "gone-home";
  origin: { slug: "local" | "imported"; name: string };
  breeds: Term[];
  collections: Term[];
  media: Media[];
};

export const puppies = puppiesJson as Puppy[];
export const availablePuppies = puppies.filter((p) => p.status === "available");
export const goneHomePuppies = puppies.filter((p) => p.status === "gone-home");

export const getPuppy = (slug: string) => puppies.find((p) => p.slug === slug);
export const getPuppyById = (id: string) => puppies.find((p) => p.id === id);

/** Previous/next pup within the same list (available or gone home), wrapping around. */
export function getNeighbours(puppy: Puppy) {
  const list = puppy.status === "available" ? availablePuppies : goneHomePuppies;
  const i = list.findIndex((p) => p.id === puppy.id);
  return {
    previous: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
  };
}

export const cover = (p: Puppy) => p.media.find((m) => m.kind === "image") ?? p.media[0].poster!;
export const hasVideo = (p: Puppy) => p.media.some((m) => m.kind === "video");
export const whereLabel = (p: Puppy) => (p.origin.slug === "local" ? "In Dubai" : "Imported for you");

/** "Maltipoo · boy · 3 months" for named pups, "girl · 2 months" when the breed is already the title. */
export function puppyFacts(p: Puppy): string[] {
  return [p.name ? p.breed : null, p.genderLabel.toLowerCase(), p.age].filter((x): x is string => !!x);
}

/** Display label used in enquiry forms, e.g. "Max (Maltipoo)". */
export const enquiryLabel = (p: Puppy) => (p.name ? `${p.name} (${p.breed})` : p.displayName);

export type PuppyFilters = { origin?: string; breed?: string; gender?: string; collection?: string };

export function filterPuppies(list: Puppy[], f: PuppyFilters) {
  return list.filter(
    (p) =>
      (!f.origin || p.origin.slug === f.origin) &&
      (!f.breed || p.breeds.some((b) => b.slug === f.breed)) &&
      // a "boy & girl" litter matches either filter
      (!f.gender || p.gender === f.gender || p.gender === "male-female") &&
      (!f.collection || p.collections.some((c) => c.slug === f.collection)),
  );
}

/** Breed catalogue, in the order the filter chips show it. */
export const BREEDS: Term[] = [
  { slug: "maltipoo", name: "Maltipoo" },
  { slug: "pomeranian", name: "Pomeranian" },
  { slug: "poodle", name: "Poodle" },
  { slug: "cavapoo", name: "Cavapoo" },
  { slug: "shih-tzu", name: "Shih Tzu" },
  { slug: "maltese", name: "Maltese" },
  { slug: "bichon", name: "Bichon" },
  { slug: "pomsky", name: "Pomsky" },
];

/** Breeds that have at least one pup in the list (no empty filter chips). */
export const breedsIn = (list: Puppy[]) => BREEDS.filter((b) => list.some((p) => p.breeds.some((x) => x.slug === b.slug)));
