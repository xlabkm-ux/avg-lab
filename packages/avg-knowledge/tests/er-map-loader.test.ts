import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
import { loadErMap } from "../src/er-map-loader";

const ER_MAP_ROOT = resolve(__dirname, "../../../er-map");

describe("er-map-loader", () => {
  it("loads all er-map entry types from disk", () => {
    const result = loadErMap(ER_MAP_ROOT);

    expect(result.entries.length).toBeGreaterThan(0);
    expect(result.counts.terms).toBeGreaterThan(0);
  });

  it("loads terms with correct structure", () => {
    const result = loadErMap(ER_MAP_ROOT);
    const terms = result.entries.filter((e) => e.entryType === "term");

    expect(terms.length).toBe(result.counts.terms);

    const reality = terms.find((t) => t.id === "term_reality");
    expect(reality).toBeDefined();
    expect(reality!.entryType).toBe("term");

    if (reality!.entryType === "term") {
      expect(reality!.label).toBe("Реальность");
      expect(reality!.aliases).toContain("предельная рамка");
      expect(reality!.definition).toContain("Предельная рамка ЭР");
      expect(reality!.coordinates.nesting_level).toBe("reality");
      expect(reality!.allowed_language).toContain("working_distinction");
      expect(reality!.common_substitutions.length).toBeGreaterThan(0);
    }
  });

  it("loads ontology entries", () => {
    const result = loadErMap(ER_MAP_ROOT);
    const ontology = result.entries.filter((e) => e.entryType === "ontology");

    // May be 0 if no ontology files exist yet, but should not throw
    expect(ontology.length).toBe(result.counts.ontology);
  });

  it("handles missing directories gracefully", () => {
    const result = loadErMap("/nonexistent/path/er-map");

    expect(result.entries).toEqual([]);
    expect(result.counts.terms).toBe(0);
    expect(result.counts.ontology).toBe(0);
    expect(result.counts.methodology).toBe(0);
    expect(result.counts.fragments).toBe(0);
  });

  it("skips terms_index.json", () => {
    const result = loadErMap(ER_MAP_ROOT);
    const ids = result.entries.map((e) => e.id);

    // terms_index.json should not produce entries
    expect(ids.every((id) => !id.includes("index"))).toBe(true);
  });
});
