import type { ErMapTermEntry, ErMapOntologyEntry, ErMapMethodologyEntry } from "./er-map-loader.js";
import type { TermMatchResult } from "./term-matching.js";

// ─── Constants ───────────────────────────────────────────────────────────────

const NO_MATCH_RESPONSE =
  "Запрос не сопоставляется с известными терминами карты ЭР. Это рабочая граница: ответ остаётся неподкреплённой рабочей гипотезой.";

const STRONG_MATCH_THRESHOLD = 0.6;

// ─── Assembly ────────────────────────────────────────────────────────────────

/**
 * Assembles a summary string (Russian text) from the term matching results.
 * Uses deterministic template substitution — no neural generation.
 */
export function assembleSummary(match: TermMatchResult, query: string): string {
  if (!match.primary) {
    return NO_MATCH_RESPONSE;
  }

  const primaryEntry = match.primary.entry;
  const primaryScore = match.primary.score;

  // Case: Single strong match (score >= 0.6)
  if (primaryScore >= STRONG_MATCH_THRESHOLD && match.secondary.length === 0) {
    return assembleStrongSingleMatch(primaryEntry, match, query);
  }

  // Case: Multiple matches (primary + secondary)
  if (match.secondary.length > 0) {
    return assembleMultipleMatches(primaryEntry, match);
  }

  // Case: Weak match or raw thought (no question, weak score)
  return assembleWeakMatch(primaryEntry, match);
}

function assembleStrongSingleMatch(
  entry: import("./er-map-loader.js").ErMapEntry,
  match: TermMatchResult,
  _query: string
): string {
  const parts: string[] = [];

  if (entry.entryType === "term") {
    const term = entry as ErMapTermEntry;

    // Prefix for question queries
    if (match.isQuestion) {
      parts.push(`В рамках карты ЭР: ${term.definition}`);
    } else {
      parts.push(term.definition);
    }

    // Append substitution warnings
    if (term.common_substitutions.length > 0) {
      const warnings = term.common_substitutions
        .map((s) => s.error)
        .join("; ");
      parts.push(`Внимание: типичные подмены — ${warnings}.`);
    }
  } else if (entry.entryType === "ontology") {
    const onto = entry as ErMapOntologyEntry;
    parts.push(`В рамках карты ЭР: ${onto.definition}`);
  } else if (entry.entryType === "methodology") {
    const method = entry as ErMapMethodologyEntry;
    parts.push(`В рамках карты ЭР: ${method.definition}`);
    if (method.does_not_claim && method.does_not_claim.length > 0) {
      parts.push(`Не претендует на: ${method.does_not_claim.join("; ")}.`);
    }
  } else {
    parts.push(entry.text);
  }

  // Append ontology frame context if available
  if (match.ontologyFrame && match.ontologyFrame.entry.entryType === "ontology") {
    const onto = match.ontologyFrame.entry as ErMapOntologyEntry;
    if (onto.coordinates.access_mode) {
      parts.push(`Уровень доступа: ${onto.coordinates.access_mode}.`);
    }
  }

  return parts.join(" ");
}

function assembleMultipleMatches(
  primaryEntry: import("./er-map-loader.js").ErMapEntry,
  match: TermMatchResult
): string {
  const parts: string[] = [];

  // Primary definition
  const primaryDef = getEntryDefinition(primaryEntry);
  const primaryLabel = getEntryLabel(primaryEntry);
  parts.push(`${primaryLabel}: ${primaryDef}`);

  // Secondary definitions
  for (const secondary of match.secondary) {
    const secLabel = getEntryLabel(secondary.entry);
    const secDef = getEntryDefinition(secondary.entry);
    parts.push(`Связанный концепт: ${secLabel} — ${secDef}`);
  }

  // Ontology frame info
  if (match.ontologyFrame && match.ontologyFrame.entry.entryType === "ontology") {
    const onto = match.ontologyFrame.entry as ErMapOntologyEntry;
    const levelInfo = onto.coordinates.nesting_level
      ? `уровень: ${onto.coordinates.nesting_level}`
      : "";
    const accessInfo = onto.coordinates.access_mode
      ? `доступ: ${onto.coordinates.access_mode}`
      : "";
    const combined = [levelInfo, accessInfo].filter(Boolean).join(", ");
    if (combined) {
      parts.push(`Рамка: ${combined}.`);
    }
  }

  return parts.join(" ");
}

function assembleWeakMatch(
  primaryEntry: import("./er-map-loader.js").ErMapEntry,
  _match: TermMatchResult
): string {
  const label = getEntryLabel(primaryEntry);
  const definition = getEntryDefinition(primaryEntry);

  return `Ваш запрос затрагивает область: ${label}. ${definition} В рамках карты ЭР это требует указания области определения и статуса утверждения.`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getEntryLabel(entry: import("./er-map-loader.js").ErMapEntry): string {
  if (entry.entryType === "fragment") {
    return entry.topic ?? "фрагмент";
  }
  return entry.label;
}

function getEntryDefinition(entry: import("./er-map-loader.js").ErMapEntry): string {
  if (entry.entryType === "fragment") {
    return entry.text;
  }
  return entry.definition;
}
