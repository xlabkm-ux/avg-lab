import type { ErMapEntry } from "./er-map-loader.js";
import { flattenEntry } from "./flatten-text.js";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ScoredEntry {
  entry: ErMapEntry;
  score: number;
}

export interface ErMapIndex {
  /** Search the index for entries matching the query. */
  search(query: string, limit?: number): ScoredEntry[];
  /** Get an entry by its ID. */
  getEntry(id: string): ErMapEntry | undefined;
  /** Get total entry count. */
  size(): number;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function tokenize(value: string): string[] {
  const matches = normalizeWhitespace(value).toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  return Array.from(new Set(matches));
}

function getEntryLabel(entry: ErMapEntry): string {
  if (entry.entryType === "fragment") {
    return "";
  }
  return entry.label;
}

function getEntryAliases(entry: ErMapEntry): string[] {
  if (entry.entryType === "term") {
    return entry.aliases;
  }
  return [];
}

// ─── Index Builder ───────────────────────────────────────────────────────────

/**
 * Creates an in-memory searchable index over er-map entries.
 *
 * Uses two matching strategies:
 * 1. Exact label/alias match (case-insensitive substring) → score boost
 * 2. Token-overlap against flattened text → coverage score
 */
export function createErMapIndex(entries: ErMapEntry[]): ErMapIndex {
  // Entry lookup by ID
  const entriesById = new Map<string, ErMapEntry>();

  // Label/alias → entry ID (lowercase keys for case-insensitive matching)
  const labelMap = new Map<string, string>();

  // Inverted token index: token → Set<entryId>
  const tokenIndex = new Map<string, Set<string>>();

  // Flattened text cache for scoring
  const flatTextCache = new Map<string, string>();

  for (const entry of entries) {
    entriesById.set(entry.id, entry);

    // Index labels and aliases
    const label = getEntryLabel(entry);
    if (label) {
      labelMap.set(label.toLowerCase(), entry.id);
    }

    for (const alias of getEntryAliases(entry)) {
      if (alias) {
        labelMap.set(alias.toLowerCase(), entry.id);
      }
    }

    // Flatten and index tokens
    const flatText = flattenEntry(entry);
    flatTextCache.set(entry.id, flatText);

    const tokens = tokenize(flatText);
    for (const token of tokens) {
      let set = tokenIndex.get(token);
      if (!set) {
        set = new Set();
        tokenIndex.set(token, set);
      }
      set.add(entry.id);
    }
  }

  function search(query: string, limit = 10): ScoredEntry[] {
    const normalizedQuery = normalizeWhitespace(query).toLowerCase();
    const queryTokens = tokenize(query);

    if (queryTokens.length === 0) {
      return [];
    }

    // Collect candidate entry IDs from token index
    const candidateScores = new Map<string, number>();

    for (const token of queryTokens) {
      const entryIds = tokenIndex.get(token);
      if (entryIds) {
        for (const id of entryIds) {
          candidateScores.set(id, (candidateScores.get(id) ?? 0) + 1);
        }
      }
    }

    // Score each candidate
    const scored: ScoredEntry[] = [];

    for (const [entryId, tokenHits] of candidateScores) {
      const entry = entriesById.get(entryId);
      if (!entry) continue;

      // Signal 1: Token overlap ratio (max 0.8)
      const flatText = flatTextCache.get(entryId) ?? "";
      const flatTokens = tokenize(flatText);
      const overlapRatio = flatTokens.length > 0
        ? tokenHits / queryTokens.length
        : 0;
      const tokenScore = Math.min(0.8, overlapRatio * 0.8);

      // Signal 2: Exact label/alias match (max 1.0)
      let labelScore = 0;
      const label = getEntryLabel(entry);
      if (label && normalizedQuery.includes(label.toLowerCase())) {
        labelScore = 1.0;
      } else {
        for (const alias of getEntryAliases(entry)) {
          if (alias && normalizedQuery.includes(alias.toLowerCase())) {
            labelScore = 1.0;
            break;
          }
        }
      }

      // Signal 3: Context boost - nesting level keyword match (max 0.2)
      let contextBoost = 0;
      if (entry.entryType !== "fragment") {
        const nestingLevel = entry.coordinates.nesting_level;
        if (nestingLevel && normalizedQuery.includes(nestingLevel.toLowerCase())) {
          contextBoost = 0.2;
        }
      }

      const totalScore = Math.min(1.0, labelScore + tokenScore + contextBoost);

      if (totalScore > 0) {
        scored.push({ entry, score: Number(totalScore.toFixed(3)) });
      }
    }

    // Also check labelMap for exact matches that might have been missed
    // (e.g., if query IS the label but tokens didn't overlap well)
    for (const [labelKey, entryId] of labelMap) {
      if (normalizedQuery.includes(labelKey) && !candidateScores.has(entryId)) {
        const entry = entriesById.get(entryId);
        if (entry) {
          scored.push({ entry, score: 1.0 });
        }
      }
    }

    // Sort by score descending, then by ID for stability
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.entry.id.localeCompare(b.entry.id);
    });

    return scored.slice(0, limit);
  }

  function getEntry(id: string): ErMapEntry | undefined {
    return entriesById.get(id);
  }

  function size(): number {
    return entriesById.size;
  }

  return { search, getEntry, size };
}
