import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
import { loadErMap } from "../src/er-map-loader";
import { createErMapIndex } from "../src/er-map-index";

const ER_MAP_ROOT = resolve(__dirname, "../../../er-map");

describe("er-map-index", () => {
  const { entries } = loadErMap(ER_MAP_ROOT);
  const index = createErMapIndex(entries);

  it("indexes all entries", () => {
    expect(index.size()).toBe(entries.length);
  });

  it("search for 'реальность' returns term_reality as top hit", () => {
    const results = index.search("реальность");

    expect(results.length).toBeGreaterThan(0);
    const realityHit = results.find((r) => r.entry.id === "term_reality");
    expect(realityHit).toBeDefined();
    expect(realityHit!.score).toBeGreaterThanOrEqual(0.8);
  });

  it("search by alias 'предельная рамка' returns term_reality", () => {
    const results = index.search("предельная рамка");

    expect(results.length).toBeGreaterThan(0);
    const realityHit = results.find((r) => r.entry.id === "term_reality");
    expect(realityHit).toBeDefined();
    expect(realityHit!.score).toBeGreaterThanOrEqual(0.8);
  });

  it("search for non-existent term returns empty", () => {
    const results = index.search("xyznonexistent12345");

    expect(results).toEqual([]);
  });

  it("getEntry retrieves by ID", () => {
    const entry = index.getEntry("term_reality");

    expect(entry).toBeDefined();
    expect(entry!.id).toBe("term_reality");
    expect(entry!.entryType).toBe("term");
  });

  it("getEntry returns undefined for unknown ID", () => {
    const entry = index.getEntry("unknown_id_xyz");

    expect(entry).toBeUndefined();
  });

  it("respects limit parameter", () => {
    const results = index.search("мир", 3);

    expect(results.length).toBeLessThanOrEqual(3);
  });

  it("search for 'вселенная' returns term_universe", () => {
    const results = index.search("вселенная");

    expect(results.length).toBeGreaterThan(0);
    const universeHit = results.find((r) => r.entry.id === "term_universe");
    expect(universeHit).toBeDefined();
  });
});
