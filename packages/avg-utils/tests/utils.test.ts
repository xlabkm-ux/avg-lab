import { describe, expect, it } from "vitest";
import {
  normalizeText,
  dedupe,
  collectStrongWordMarkers,
  collectStrongWordHits,
  hasUncertaintyMarkers,
  deepEqual,
  truncate,
  generateId,
  sleep,
  clamp,
  formatPercentage,
} from "../src/index.js";

describe("normalizeText", () => {
  it("trims whitespace and lowercases", () => {
    expect(normalizeText("  Hello World  ")).toBe("hello world");
  });

  it("handles empty strings", () => {
    expect(normalizeText("")).toBe("");
    expect(normalizeText("   ")).toBe("");
  });

  it("handles already-normalized strings", () => {
    expect(normalizeText("test")).toBe("test");
  });

  it("handles mixed case with leading/trailing spaces", () => {
    expect(normalizeText("  AbCdEf  ")).toBe("abcdef");
  });
});

describe("dedupe", () => {
  it("removes duplicate values while preserving order", () => {
    expect(dedupe([1, 2, 3, 2, 1])).toEqual([1, 2, 3]);
  });

  it("handles arrays with no duplicates", () => {
    expect(dedupe([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("handles empty arrays", () => {
    expect(dedupe([])).toEqual([]);
  });

  it("handles string arrays", () => {
    expect(dedupe(["a", "b", "a", "c", "b"])).toEqual(["a", "b", "c"]);
  });

  it("preserves first occurrence position", () => {
    expect(dedupe(["x", "y", "x", "y", "z"])).toEqual(["x", "y", "z"]);
  });
});

describe("collectStrongWordMarkers", () => {
  it("returns empty array when no strong words present", () => {
    expect(collectStrongWordMarkers("The system works well")).toEqual([]);
  });

  it("detects absolute language markers", () => {
    const markers = collectStrongWordMarkers("This is absolutely correct");
    expect(markers).toContain("absolutely");
  });

  it("detects always and never", () => {
    const result = collectStrongWordMarkers("AVG is always available and never fails");
    expect(result).toContain("always");
    expect(result).toContain("never");
  });

  it("is case insensitive", () => {
    const result = collectStrongWordMarkers("This is ABSOLUTELY true");
    expect(result).toContain("absolutely");
  });

  it("detects truth and essence", () => {
    const result = collectStrongWordMarkers("The truth about the essence of the matter");
    expect(result).toContain("truth");
    expect(result).toContain("essence");
  });

  it("detects quantifier absolutes", () => {
    const result = collectStrongWordMarkers("Everyone knows nothing about this");
    expect(result).toContain("everyone");
    expect(result).toContain("nothing");
  });
});

describe("collectStrongWordHits", () => {
  it("returns empty array when no strong words present", () => {
    expect(collectStrongWordHits("Normal text")).toEqual([]);
  });

  it("returns hits with word and index", () => {
    const hits = collectStrongWordHits("Always be honest");
    expect(hits.length).toBe(1);
    expect(hits[0].word).toBe("always");
    expect(hits[0].index).toBe(0);
  });

  it("returns multiple hits sorted by index", () => {
    const hits = collectStrongWordHits("Never say always");
    expect(hits.length).toBe(2);
    expect(hits[0].word).toBe("never");
    expect(hits[0].index).toBe(0);
    expect(hits[1].word).toBe("always");
    expect(hits[1].index).toBe(10);
  });

  it("detects words in mixed case", () => {
    const hits = collectStrongWordHits("ABSOLUTELY never GUARANTEE");
    expect(hits.length).toBe(3);
    expect(hits.map((h) => h.word)).toEqual(["absolutely", "never", "guarantee"]);
  });
});

describe("hasUncertaintyMarkers", () => {
  it("returns false for definitive statements", () => {
    expect(hasUncertaintyMarkers("The system is correct")).toBe(false);
  });

  it("returns true for may and might", () => {
    expect(hasUncertaintyMarkers("This may be true")).toBe(true);
    expect(hasUncertaintyMarkers("This might work")).toBe(true);
  });

  it("returns true for suggests and indicates", () => {
    expect(hasUncertaintyMarkers("Evidence suggests this approach")).toBe(true);
    expect(hasUncertaintyMarkers("Data indicates a pattern")).toBe(true);
  });

  it("returns true for multi-word uncertainty markers", () => {
    expect(hasUncertaintyMarkers("This could possibly work")).toBe(true);
    expect(hasUncertaintyMarkers("Perhaps it appears correct")).toBe(true);
  });

  it("is case insensitive", () => {
    expect(hasUncertaintyMarkers("This MAY be correct")).toBe(true);
    expect(hasUncertaintyMarkers("Perhaps we should")).toBe(true);
  });
});

describe("deepEqual", () => {
  it("compares primitive values", () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual("test", "test")).toBe(true);
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual("a", "b")).toBe(false);
  });

  it("compares arrays", () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEqual([1, 2], [1, 3])).toBe(false);
  });

  it("compares objects", () => {
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it("handles nested structures", () => {
    const a = { items: [{ id: 1 }, { id: 2 }] };
    const b = { items: [{ id: 1 }, { id: 2 }] };
    const c = { items: [{ id: 1 }, { id: 3 }] };
    expect(deepEqual(a, b)).toBe(true);
    expect(deepEqual(a, c)).toBe(false);
  });

  it("handles null values", () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(null)).toBe(false);
  });

  it("handles empty collections", () => {
    expect(deepEqual({}, {})).toBe(true);
    expect(deepEqual([], [])).toBe(true);
  });
});

describe("truncate", () => {
  it("returns original text when within limit", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates with default ellipsis", () => {
    expect(truncate("Hello World", 8)).toBe("Hello...");
  });

  it("truncates with custom suffix", () => {
    // maxLength=8, suffix=" [more]" (7 chars) -> keeps 1 char of text
    expect(truncate("Hello World", 8, " [more]")).toBe("H [more]");
  });

  it("handles edge case: exact length", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });

  it("handles edge case: maxLength equals suffix length", () => {
    expect(truncate("Hello", 3)).toBe("...");
  });
});

describe("generateId", () => {
  it("generates IDs with default prefix", () => {
    const id = generateId();
    expect(id.startsWith("id_")).toBe(true);
  });

  it("generates IDs with custom prefix", () => {
    const id = generateId("test");
    expect(id.startsWith("test_")).toBe(true);
  });

  it("generates unique IDs", () => {
    const id1 = generateId("x");
    const id2 = generateId("x");
    expect(id1).not.toBe(id2);
  });

  it("includes timestamp component", () => {
    const id = generateId("test");
    const parts = id.split("_");
    expect(parts.length).toBe(3);
    expect(parseInt(parts[1], 10)).toBeGreaterThan(0);
  });
});

describe("sleep", () => {
  it("resolves after specified time", async () => {
    const start = Date.now();
    await sleep(10);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(8); // allow 2ms tolerance
  });

  it("resolves immediately for zero ms", async () => {
    const start = Date.now();
    await sleep(0);
    const elapsed = Date.now() - start;
    // setTimeout(0) still has platform-dependent overhead
    expect(elapsed).toBeLessThan(20);
  });
});

describe("clamp", () => {
  it("clamps values above maximum", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("clamps values below minimum", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("preserves values within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it("handles equal min and max", () => {
    expect(clamp(5, 10, 10)).toBe(10);
  });
});

describe("formatPercentage", () => {
  it("formats decimals correctly", () => {
    expect(formatPercentage(0.5)).toBe("50.0%");
    expect(formatPercentage(0.123)).toBe("12.3%");
  });

  it("formats zero", () => {
    expect(formatPercentage(0)).toBe("0.0%");
  });

  it("formats values greater than 1", () => {
    expect(formatPercentage(1.5)).toBe("150.0%");
  });

  it("respects custom decimal precision", () => {
    expect(formatPercentage(0.123, 2)).toBe("12.30%");
    expect(formatPercentage(0.5, 0)).toBe("50%");
  });
});
