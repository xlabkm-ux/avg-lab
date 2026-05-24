import type { ErMapEntry, ErMapTermEntry, ErMapOntologyEntry, ErMapMethodologyEntry, ErMapFragmentEntry } from "./er-map-loader.js";

/**
 * Flattens an ErMapEntry into readable Russian text suitable for token-overlap matching.
 * Each entry type produces a different text shape optimized for search relevance.
 */
export function flattenEntry(entry: ErMapEntry): string {
  switch (entry.entryType) {
    case "term":
      return flattenTerm(entry);
    case "ontology":
      return flattenOntology(entry);
    case "methodology":
      return flattenMethodology(entry);
    case "fragment":
      return flattenFragment(entry);
  }
}

function flattenTerm(entry: ErMapTermEntry): string {
  const parts: string[] = [];

  parts.push(`${entry.label}: ${entry.definition}`);

  if (entry.aliases.length > 0) {
    parts.push(`Синонимы: ${entry.aliases.join(", ")}`);
  }

  if (entry.allowed_language.length > 0) {
    parts.push(`Допустимый язык: ${entry.allowed_language.join(", ")}`);
  }

  if (entry.common_substitutions.length > 0) {
    const warnings = entry.common_substitutions.map((s) => s.error);
    parts.push(`Типичные подмены: ${warnings.join("; ")}`);
  }

  if (entry.coordinates.nesting_level) {
    parts.push(`Уровень: ${entry.coordinates.nesting_level}`);
  }

  if (entry.coordinates.access_mode) {
    parts.push(`Доступ: ${entry.coordinates.access_mode}`);
  }

  return parts.join(". ");
}

function flattenOntology(entry: ErMapOntologyEntry): string {
  const parts: string[] = [];

  parts.push(`${entry.label} — ${entry.definition}`);

  if (entry.language_policy.allowed_modes.length > 0) {
    parts.push(`Допустимый язык: ${entry.language_policy.allowed_modes.join(", ")}`);
  }

  if (entry.claim_policy.default_claim_status) {
    parts.push(`Статус утверждения: ${entry.claim_policy.default_claim_status}`);
  }

  if (entry.map_safety.known_risks.length > 0) {
    parts.push(`Известные риски: ${entry.map_safety.known_risks.join(", ")}`);
  }

  if (entry.coordinates.nesting_level) {
    parts.push(`Уровень: ${entry.coordinates.nesting_level}`);
  }

  return parts.join(". ");
}

function flattenMethodology(entry: ErMapMethodologyEntry): string {
  const parts: string[] = [];

  parts.push(`${entry.label} — ${entry.definition}`);

  if (entry.language_policy.allowed_modes.length > 0) {
    parts.push(`Допустимый язык: ${entry.language_policy.allowed_modes.join(", ")}`);
  }

  if (entry.does_not_claim && entry.does_not_claim.length > 0) {
    parts.push(`Не претендует на: ${entry.does_not_claim.join("; ")}`);
  }

  if (entry.coordinates.nesting_level) {
    parts.push(`Уровень: ${entry.coordinates.nesting_level}`);
  }

  return parts.join(". ");
}

function flattenFragment(entry: ErMapFragmentEntry): string {
  const parts: string[] = [];

  parts.push(entry.text);

  if (entry.topic) {
    parts.push(`Тема: ${entry.topic}`);
  }

  return parts.join(". ");
}
