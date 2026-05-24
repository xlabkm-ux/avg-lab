import type {
  ClaimStatus,
  LanguageMode,
  DialogueValidationRisk,
  MapTerritoryBoundaryState
} from "@avg/schemas";
import type { ErMapEntry, ErMapTermEntry, ErMapOntologyEntry, ErMapMethodologyEntry } from "./er-map-loader.js";
import type { TermMatchResult } from "./term-matching.js";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DerivedMetadata {
  claim_status: ClaimStatus;
  language_mode: LanguageMode;
  validation_risk: DialogueValidationRisk;
  risk_markers: string[];
  scope: string;
  map_territory_boundary: MapTerritoryBoundaryState;
  next_action: string;
}

// ─── Default Fallbacks ───────────────────────────────────────────────────────

const DEFAULT_METADATA: DerivedMetadata = {
  claim_status: "working_distinction",
  language_mode: "operational_description",
  validation_risk: "low",
  risk_markers: [],
  scope: "В рамках карты ЭР, область определения не указана",
  map_territory_boundary: "preserved",
  next_action: "Уточните область определения и статус утверждения.",
};

// ─── Derivation ──────────────────────────────────────────────────────────────

/**
 * Derives all AvgStructuredResponse metadata fields deterministically
 * from the term matching results. No LLM calls — pure rule-based logic.
 */
export function deriveMetadata(match: TermMatchResult): DerivedMetadata {
  if (!match.primary) {
    return { ...DEFAULT_METADATA };
  }

  const entry = match.primary.entry;

  const claimStatus = deriveClaimStatus(entry, match);
  const languageMode = deriveLanguageMode(entry, match);
  const riskMarkers = deriveRiskMarkers(entry, match);
  const validationRisk = deriveValidationRisk(entry, riskMarkers);
  const scope = deriveScope(entry);
  const mapTerritoryBoundary = deriveBoundaryState(claimStatus, validationRisk);
  const nextAction = deriveNextAction(entry, riskMarkers);

  return {
    claim_status: claimStatus,
    language_mode: languageMode,
    validation_risk: validationRisk,
    risk_markers: riskMarkers,
    scope,
    map_territory_boundary: mapTerritoryBoundary,
    next_action: nextAction,
  };
}

// ─── Individual Field Derivation ─────────────────────────────────────────────

function deriveClaimStatus(entry: ErMapEntry, match: TermMatchResult): ClaimStatus {
  // Check ontology frame's claim_policy first
  if (match.ontologyFrame && match.ontologyFrame.entry.entryType === "ontology") {
    const onto = match.ontologyFrame.entry as ErMapOntologyEntry;
    if (!onto.claim_policy.positive_claims_allowed) {
      return "working_distinction";
    }
    if (onto.claim_policy.default_claim_status) {
      return mapToClaimStatus(onto.claim_policy.default_claim_status);
    }
  }

  // Check methodology claim_policy
  if (match.methodologyConcept && match.methodologyConcept.entry.entryType === "methodology") {
    const method = match.methodologyConcept.entry as ErMapMethodologyEntry;
    if (!method.claim_policy.positive_claims_allowed) {
      return "working_distinction";
    }
  }

  // For term entries, derive from allowed_language
  if (entry.entryType === "term") {
    const term = entry as ErMapTermEntry;
    // If allowed_language includes "boundary_statement" → boundary_statement
    if (term.allowed_language.includes("boundary_statement") && term.allowed_language.length === 1) {
      return "boundary_statement";
    }
    // If term_role is "boundary_marker" → boundary_statement
    if (term.term_role === "boundary_marker") {
      return "boundary_statement";
    }
    // If allowed_language starts with "working_distinction"
    if (term.allowed_language.includes("working_distinction")) {
      return "working_distinction";
    }
  }

  // For ontology/methodology entries with their own claim_policy
  if (entry.entryType === "ontology") {
    const onto = entry as ErMapOntologyEntry;
    if (!onto.claim_policy.positive_claims_allowed) {
      return "working_distinction";
    }
    return mapToClaimStatus(onto.claim_policy.default_claim_status);
  }

  if (entry.entryType === "methodology") {
    const method = entry as ErMapMethodologyEntry;
    if (!method.claim_policy.positive_claims_allowed) {
      return "working_distinction";
    }
    return mapToClaimStatus(method.claim_policy.default_claim_status);
  }

  return "working_distinction";
}

function deriveLanguageMode(entry: ErMapEntry, _match: TermMatchResult): LanguageMode {
  if (entry.entryType === "term") {
    const term = entry as ErMapTermEntry;
    if (term.allowed_language.length > 0) {
      const first = term.allowed_language[0]!;
      const mapped = mapToLanguageMode(first);
      // If silence_required → downgrade to operational_description
      if (mapped === "silence_required") {
        return "operational_description";
      }
      return mapped;
    }
  }

  if (entry.entryType === "ontology") {
    const onto = entry as ErMapOntologyEntry;
    if (onto.language_policy.allowed_modes.length > 0) {
      const first = onto.language_policy.allowed_modes[0]!;
      const mapped = mapToLanguageMode(first);
      if (mapped === "silence_required") {
        return "operational_description";
      }
      return mapped;
    }
  }

  if (entry.entryType === "methodology") {
    const method = entry as ErMapMethodologyEntry;
    if (method.language_policy.allowed_modes.length > 0) {
      const first = method.language_policy.allowed_modes[0]!;
      const mapped = mapToLanguageMode(first);
      if (mapped === "silence_required") {
        return "operational_description";
      }
      return mapped;
    }
  }

  return "operational_description";
}

function deriveRiskMarkers(entry: ErMapEntry, match: TermMatchResult): string[] {
  const markers = new Set<string>();

  // From term's common_substitutions
  if (entry.entryType === "term") {
    const term = entry as ErMapTermEntry;
    for (const sub of term.common_substitutions) {
      markers.add(sub.risk);
    }
  }

  // From ontology frame's known_risks
  if (match.ontologyFrame && match.ontologyFrame.entry.entryType === "ontology") {
    const onto = match.ontologyFrame.entry as ErMapOntologyEntry;
    for (const risk of onto.map_safety.known_risks) {
      markers.add(risk);
    }
  }

  // From primary entry if it's ontology/methodology
  if (entry.entryType === "ontology") {
    const onto = entry as ErMapOntologyEntry;
    for (const risk of onto.map_safety.known_risks) {
      markers.add(risk);
    }
  }

  if (entry.entryType === "methodology") {
    const method = entry as ErMapMethodologyEntry;
    for (const risk of method.map_safety.known_risks) {
      markers.add(risk);
    }
  }

  // From secondary matches
  for (const sec of match.secondary) {
    if (sec.entry.entryType === "term") {
      const term = sec.entry as ErMapTermEntry;
      for (const sub of term.common_substitutions) {
        markers.add(sub.risk);
      }
    }
  }

  return [...markers];
}

function deriveValidationRisk(entry: ErMapEntry, riskMarkers: string[]): DialogueValidationRisk {
  // If prohibited_positive_claim → critical
  if (entry.entryType === "term") {
    const term = entry as ErMapTermEntry;
    if (term.term_role === "boundary_marker" && term.allowed_language.includes("silence_required")) {
      return "critical";
    }
  }

  // Count risk signals
  const riskCount = riskMarkers.length;

  if (riskCount === 0) {
    return "low";
  }

  if (riskCount <= 2) {
    return "medium";
  }

  return "high";
}

function deriveScope(entry: ErMapEntry): string {
  if (entry.entryType === "fragment") {
    return "В рамках цитируемого источника";
  }

  const nestingLevel = entry.coordinates.nesting_level;
  const accessMode = entry.coordinates.access_mode ?? "mixed";

  return `В рамках ${nestingLevel}, доступ: ${accessMode}`;
}

function deriveBoundaryState(
  claimStatus: ClaimStatus,
  validationRisk: DialogueValidationRisk
): MapTerritoryBoundaryState {
  if (validationRisk === "critical") {
    return "violated";
  }
  if (validationRisk === "high") {
    return "unclear";
  }
  return "preserved";
}

function deriveNextAction(entry: ErMapEntry, riskMarkers: string[]): string {
  // Boundary marker → respect boundary
  if (entry.entryType === "term") {
    const term = entry as ErMapTermEntry;
    if (term.term_role === "boundary_marker") {
      return "Граница обозначена. Требуется уважение границы языка и доступа.";
    }
  }

  // Has risks → review markers
  if (riskMarkers.length > 0) {
    return "Обратите внимание на маркеры риска. Проверьте, не подменяется ли карта территорией.";
  }

  // Default → clarify scope
  return "Уточните область определения для дальнейшей работы с утверждением.";
}

// ─── Mapping Helpers ─────────────────────────────────────────────────────────

const VALID_CLAIM_STATUSES: Set<string> = new Set([
  "definition",
  "working_distinction",
  "operational_marker",
  "indirect_sign",
  "hypothesis",
  "metaphor_only",
  "prohibited_positive_claim",
  "boundary_statement",
]);

const VALID_LANGUAGE_MODES: Set<string> = new Set([
  "direct_description",
  "operational_description",
  "conditional_description",
  "metaphor",
  "symbolic_pointer",
  "silence_required",
]);

function mapToClaimStatus(value: string): ClaimStatus {
  if (VALID_CLAIM_STATUSES.has(value)) {
    return value as ClaimStatus;
  }
  return "working_distinction";
}

function mapToLanguageMode(value: string): LanguageMode {
  if (VALID_LANGUAGE_MODES.has(value)) {
    return value as LanguageMode;
  }
  // Map er-map specific modes to valid LanguageMode values
  if (value === "indirect_signs") return "conditional_description";
  if (value === "working_distinction") return "operational_description";
  if (value === "boundary_statement") return "operational_description";
  return "operational_description";
}
