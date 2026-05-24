import type { ErMapIndex, ScoredEntry } from "./er-map-index.js";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TermMatchResult {
  /** Best matching term entry (if any, threshold >= 0.15). */
  primary: ScoredEntry | null;
  /** Additional related terms (score >= 0.3, max 2). */
  secondary: ScoredEntry[];
  /** Best matching ontology frame (if score >= 0.2). */
  ontologyFrame: ScoredEntry | null;
  /** Best matching methodology concept (if score >= 0.2). */
  methodologyConcept: ScoredEntry | null;
  /** Whether the query appears to be a question. */
  isQuestion: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PRIMARY_THRESHOLD = 0.15;
const SECONDARY_THRESHOLD = 0.3;
const ONTOLOGY_THRESHOLD = 0.2;
const METHODOLOGY_THRESHOLD = 0.2;
const MAX_SECONDARY = 2;

// ─── Question Detection ──────────────────────────────────────────────────────

const QUESTION_PATTERNS = [
  /^что\s/i,
  /^кто\s/i,
  /^как\s/i,
  /^зачем\s/i,
  /^почему\s/i,
  /^где\s/i,
  /^когда\s/i,
  /^какой\s/i,
  /^какая\s/i,
  /^какое\s/i,
  /^какие\s/i,
  /\?$/,
  /что такое/i,
  /что значит/i,
  /в чём/i,
  /в чем/i,
];

function detectQuestion(query: string): boolean {
  const trimmed = query.trim();
  return QUESTION_PATTERNS.some((pattern) => pattern.test(trimmed));
}

// ─── Matching ────────────────────────────────────────────────────────────────

/**
 * Matches a user query against the er-map index and selects structured results.
 *
 * Uses three-signal scoring per entry:
 * - Exact label/alias match (1.0)
 * - Token overlap ratio (up to 0.8)
 * - Context boost from nesting_level keyword (0.2)
 *
 * Selection heuristic:
 * - Primary term: highest-scored `term` entry (>= 0.15)
 * - Secondary terms: next 1-2 terms with score >= 0.3
 * - Ontology frame: highest-scored ontology entry (>= 0.2)
 * - Methodology concept: highest-scored methodology entry (>= 0.2)
 */
export function matchTerms(query: string, index: ErMapIndex): TermMatchResult {
  const hits = index.search(query, 20);

  let primary: ScoredEntry | null = null;
  const secondary: ScoredEntry[] = [];
  let ontologyFrame: ScoredEntry | null = null;
  let methodologyConcept: ScoredEntry | null = null;

  // Partition hits by entry type
  const termHits: ScoredEntry[] = [];
  const ontologyHits: ScoredEntry[] = [];
  const methodologyHits: ScoredEntry[] = [];

  for (const hit of hits) {
    switch (hit.entry.entryType) {
      case "term":
        termHits.push(hit);
        break;
      case "ontology":
        ontologyHits.push(hit);
        break;
      case "methodology":
        methodologyHits.push(hit);
        break;
      // fragments are not selected as primary results
    }
  }

  // Select primary term
  if (termHits.length > 0 && termHits[0]!.score >= PRIMARY_THRESHOLD) {
    primary = termHits[0]!;

    // Select secondary terms (excluding primary)
    for (let i = 1; i < termHits.length && secondary.length < MAX_SECONDARY; i++) {
      if (termHits[i]!.score >= SECONDARY_THRESHOLD) {
        secondary.push(termHits[i]!);
      }
    }
  }

  // Select ontology frame
  if (ontologyHits.length > 0 && ontologyHits[0]!.score >= ONTOLOGY_THRESHOLD) {
    ontologyFrame = ontologyHits[0]!;
  }

  // Select methodology concept
  if (methodologyHits.length > 0 && methodologyHits[0]!.score >= METHODOLOGY_THRESHOLD) {
    methodologyConcept = methodologyHits[0]!;
  }

  return {
    primary,
    secondary,
    ontologyFrame,
    methodologyConcept,
    isQuestion: detectQuestion(query),
  };
}
