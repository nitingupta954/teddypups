import { describe, expect, it } from "vitest";
import {
  availablePuppies,
  breedsIn,
  filterPuppies,
  getNeighbours,
  getPuppy,
  goneHomePuppies,
  puppies,
  puppyFacts,
} from "@/lib/puppies";

describe("puppy data", () => {
  it("has 15 available and 27 gone-home pups with unique slugs and media", () => {
    expect(availablePuppies).toHaveLength(15);
    expect(goneHomePuppies).toHaveLength(27);
    expect(new Set(puppies.map((p) => p.slug)).size).toBe(puppies.length);
    expect(puppies.every((p) => p.media.length > 0)).toBe(true);
  });
});

describe("filterPuppies", () => {
  it("returns everything with no filters", () => {
    expect(filterPuppies(availablePuppies, {})).toHaveLength(15);
  });

  it("filters by breed, including mixed litters", () => {
    const cavapoo = filterPuppies(availablePuppies, { breed: "cavapoo" }).map((p) => p.slug);
    expect(cavapoo).toContain("copper-male");
    expect(cavapoo).toContain("maltipoo-cavapoo-male");
  });

  it("counts a boy & girl litter as both boys and girls", () => {
    const boys = filterPuppies(availablePuppies, { gender: "male" }).map((p) => p.slug);
    const girls = filterPuppies(availablePuppies, { gender: "female" }).map((p) => p.slug);
    expect(boys).toContain("toy-poodle-male-female");
    expect(girls).toContain("toy-poodle-male-female");
    expect(boys).not.toContain("korean-teacup-poodle-female");
  });

  it("combines filters and the Korean Teacup collection", () => {
    const result = filterPuppies(availablePuppies, { collection: "korean-teacup", gender: "male" });
    expect(result.map((p) => p.slug)).toEqual(["korean-teacup-pomeranian-male"]);
  });

  it("finds nothing local today (all available pups are imported)", () => {
    expect(filterPuppies(availablePuppies, { origin: "local" })).toEqual([]);
  });
});

describe("display helpers", () => {
  it("only offers breed chips that have pups, in catalogue order", () => {
    expect(breedsIn(availablePuppies).map((b) => b.name)).toEqual(["Maltipoo", "Pomeranian", "Poodle", "Cavapoo", "Shih Tzu"]);
  });

  it("writes facts like the reference site", () => {
    expect(puppyFacts(getPuppy("maltipoo-max-male")!)).toEqual(["Maltipoo", "boy", "3 months"]);
    expect(puppyFacts(getPuppy("korean-teacup-poodle-female")!)).toEqual(["girl", "2 months"]);
  });

  it("wraps previous/next around the list", () => {
    const first = availablePuppies[0];
    const { previous, next } = getNeighbours(first);
    expect(previous.slug).toBe(availablePuppies.at(-1)!.slug);
    expect(next.slug).toBe(availablePuppies[1].slug);
  });
});
