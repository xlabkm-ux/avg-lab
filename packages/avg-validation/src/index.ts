import {
  type AvgClaim,
  type AvgStructuredResponse,
  type ClaimStatus,
  type DialogueValidationRisk,
  type LanguageMode,
  type ValidationResult,
  validateAvgResponse,
  validateClaim
} from "@avg/schemas";
import { normalizeText, dedupe } from "@avg/utils";
import { type AvgRetrievalHit } from "@avg/retrieval";

export interface ClaimValidationReport {
  schema: ValidationResult;
  accepted: boolean;
  status?: ClaimStatus;
  languageMode?: LanguageMode;
  risks: string[];
  boundaryNotes: string[];
}

export type ClaimExtractionField = "summary" | "scope" | "next_action";

export interface ExtractedClaimRecord {
  sourceField: ClaimExtractionField;
  claim: AvgClaim;
  validation: ClaimValidationReport;
  riskAssessment: ClaimRiskAssessmentReport;
}

export interface ClaimExtractionReport {
  responseSchema: ValidationResult;
  claims: ExtractedClaimRecord[];
  accepted: boolean;
  boundaryNotes: string[];
}

export interface ClaimClassificationReport {
  status: ClaimStatus;
  languageMode: LanguageMode;
  confidence: "high" | "medium" | "low";
  signals: string[];
  boundaryNotes: string[];
}

export interface ClaimRiskAssessmentReport {
  riskLevel: DialogueValidationRisk;
  riskMarkers: string[];
  repairSuggestions: string[];
  boundaryNotes: string[];
  validation: ClaimValidationReport;
  classification: ClaimClassificationReport;
  shouldRepair: boolean;
}

export interface AvgCitation {
  id: string;
  document_id: string;
  snippet_id: string;
  source_label: string;
  quoted_text: string;
  relevance: "supporting" | "context" | "contradicting";
}

export interface AvgGroundedResponseBoundary {
  citations: AvgCitation[];
  grounded_claims: string[];
  interpretations: string[];
  unsupported_claims: string[];
  retrieval_confidence: "none" | "low" | "medium" | "high";
  boundary_statement: string;
}

export interface AvgGroundedResponse {
  response: AvgStructuredResponse;
  grounding: AvgGroundedResponseBoundary;
}

export interface GroundedResponseCompositionReport {
  responseSchema: ValidationResult;
  groundedResponse?: AvgGroundedResponse;
  accepted: boolean;
  boundaryNotes: string[];
}

function makeClaimId(responseId: string, field: ClaimExtractionField): string {
  return `claim_${responseId}_${field}`;
}

function formatSchemaNotes(errors: ValidationResult["errors"]): string[] {
  if (errors.length === 0) {
    return [];
  }

  return errors.map((error) => {
    const location = error.instancePath.length > 0 ? error.instancePath : "/";
    return `AVG structured response schema violation at ${location} (${error.keyword}).`;
  });
}

function buildClaimFromResponse(
  response: AvgStructuredResponse,
  sourceField: ClaimExtractionField,
  statement: string,
  claimStatus: ClaimStatus,
  languageMode: LanguageMode
): AvgClaim {
  return {
    id: makeClaimId(response.id, sourceField),
    statement,
    claim_status: claimStatus,
    language_mode: languageMode,
    scope: response.scope,
    risks: [...response.risk_markers],
    source_refs: [`${response.id}#${sourceField}`]
  };
}

/**
 * Classify strong words into risk marker categories.
 * This is different from collectStrongWordMarkers in utils which returns raw word matches.
 */
function classifyStrongWordMarkers(statement: string): string[] {
  const normalized = normalizeText(statement);
  const markers: string[] = [];

  if (/\b(always|never|guarantee(?:s|d)?|certain(?:ly)?|definite(?:ly)?|obvious(?:ly)?|every|all|everyone|everything|nothing|proves?|truth|perfect|exactly)\b/.test(normalized)) {
    markers.push("strong_word_substitution", "scheme_absolutization");
  }

  if (/\b(real(?:ity|ly)?|true|essence|undeniable|without doubt|for sure|the truth)\b/.test(normalized)) {
    markers.push("map_territory_substitution", "dogma");
  }

  if (/\b(some people think|everyone agrees|consensus|social proof|popular belief)\b/.test(normalized)) {
    markers.push("social_confirmation_as_proof");
  }

  if (/\b(simple|only|just|merely|merely)\b/.test(normalized) && /\b(important|complex|context|boundary|scope)\b/.test(normalized)) {
    markers.push("reductionism");
  }

  if (/\b(sign|label|word|term)\b/.test(normalized) && /\b(is|are|means)\b/.test(normalized)) {
    markers.push("sign_to_entity_substitution");
  }

  return markers;
}

function classifyRiskLevel(
  claim: AvgClaim,
  markers: string[],
  validation: ClaimValidationReport
): DialogueValidationRisk {
  if (!validation.schema.valid) {
    return "critical";
  }

  if (
    markers.includes("schema_contract_violation") ||
    markers.includes("dogma") ||
    claim.claim_status === "prohibited_positive_claim"
  ) {
    return "critical";
  }

  if (
    markers.some((marker) =>
      [
        "strong_word_substitution",
        "scheme_absolutization",
        "map_territory_substitution",
        "fairy_tale",
        "level_mixing",
        "access_mode_mixing"
      ].includes(marker)
    )
  ) {
    return "high";
  }

  if (
    markers.some((marker) =>
      [
        "reductionism",
        "sign_to_entity_substitution",
        "social_confirmation_as_proof",
        "term_reification"
      ].includes(marker)
    )
  ) {
    return "medium";
  }

  return "low";
}

function repairSuggestionsForMarkers(markers: string[]): string[] {
  const suggestions: string[] = [];

  if (markers.includes("schema_contract_violation")) {
    suggestions.push("Restore the missing required claim fields before this statement enters validation.");
  }

  if (markers.includes("strong_word_substitution")) {
    suggestions.push("Replace absolute wording with a scoped hypothesis, boundary, or explicit evidence condition.");
  }

  if (markers.includes("scheme_absolutization")) {
    suggestions.push("Describe the rule as a working scheme, not a universal law.");
  }

  if (markers.includes("map_territory_substitution")) {
    suggestions.push("State what is a working map, what is unknown, and where the boundary sits.");
  }

  if (markers.includes("access_mode_mixing")) {
    suggestions.push("Separate directly knowable content from inferred or symbolic content.");
  }

  if (markers.includes("level_mixing")) {
    suggestions.push("Rewrite the claim so its status matches its language mode.");
  }

  if (markers.includes("fairy_tale")) {
    suggestions.push("Mark the passage as metaphor_only or rewrite it as an explicit model with scope.");
  }

  if (markers.includes("dogma")) {
    suggestions.push("Downgrade the statement to a boundary statement or hypothesis and name what would falsify it.");
  }

  if (markers.includes("reductionism")) {
    suggestions.push("Restore the missing conditions, exceptions, or scope before reusing the claim.");
  }

  if (markers.includes("sign_to_entity_substitution")) {
    suggestions.push("Treat the term as a sign or label, not as the thing itself.");
  }

  if (markers.includes("social_confirmation_as_proof")) {
    suggestions.push("Replace consensus language with evidence, scope, or a testable condition.");
  }

  if (markers.includes("term_reification")) {
    suggestions.push("Keep the concept as a working term instead of turning it into a fixed object.");
  }

  return dedupe(suggestions);
}

function analyzeClaimRisk(
  claim: AvgClaim,
  validation: ClaimValidationReport,
  classification: ClaimClassificationReport
): ClaimRiskAssessmentReport {
  const markers = new Set<string>(claim.risks);
  const boundaryNotes = [...validation.boundaryNotes, ...classification.boundaryNotes];

  if (!validation.schema.valid) {
    markers.add("schema_contract_violation");
  }

  if (classification.status === "metaphor_only") {
    markers.add("fairy_tale");
    markers.add("map_territory_substitution");
  }

  if (claim.claim_status === "prohibited_positive_claim") {
    markers.add("dogma");
    markers.add("map_territory_substitution");
  }

  if (claim.claim_status === "hypothesis" && !claim.scope) {
    markers.add("access_mode_mixing");
  }

  if (classification.status !== claim.claim_status) {
    markers.add("level_mixing");
  }

  if (classification.languageMode !== claim.language_mode) {
    markers.add("access_mode_mixing");
  }

  for (const marker of classifyStrongWordMarkers(claim.statement)) {
    markers.add(marker);
  }

  const riskMarkers = [...markers];
  const repairSuggestions = repairSuggestionsForMarkers(riskMarkers);
  const riskLevel = classifyRiskLevel(claim, riskMarkers, validation);

  return {
    riskLevel,
    riskMarkers,
    repairSuggestions,
    boundaryNotes: dedupe(boundaryNotes),
    validation,
    classification,
    shouldRepair: repairSuggestions.length > 0 || riskLevel !== "low"
  };
}

function confidenceFromHits(hits: AvgRetrievalHit[]): "none" | "low" | "medium" | "high" {
  if (hits.length === 0) {
    return "none";
  }

  return hits[0]!.confidence;
}

function citationFromHit(hit: AvgRetrievalHit): AvgCitation {
  return {
    id: hit.citation_id,
    document_id: hit.document_id,
    snippet_id: hit.snippet_id,
    source_label: hit.source_label,
    quoted_text: hit.matched_text,
    relevance: hit.confidence === "high" ? "supporting" : "context"
  };
}

function scoreSignals(statement: string): {
  status: ClaimStatus;
  languageMode: LanguageMode;
  confidence: "high" | "medium" | "low";
  signals: string[];
  boundaryNotes: string[];
} {
  const normalized = normalizeText(statement);
  const signals: string[] = [];
  const boundaryNotes: string[] = [];

  if (normalized.startsWith("scope boundary:")) {
    signals.push("scope_boundary");
    return {
      status: "boundary_statement",
      languageMode: "operational_description",
      confidence: "high",
      signals,
      boundaryNotes
    };
  }

  if (/\b(may|might|could|possible|possibly|perhaps|likely|seems|appears)\b/.test(normalized)) {
    signals.push("hypothesis_markers");
  }

  if (/\b(must|should|need to|needs to|requires?|required|ensure|restore|approve)\b/.test(normalized)) {
    signals.push("operational_markers");
  }

  if (/\b(castle|hidden rooms|metaphor|as if|like a|story|analogy|symbol)\b/.test(normalized)) {
    signals.push("metaphor_markers");
  }

  if (/\b(map|boundary|territory|claim|risk|scope)\b/.test(normalized)) {
    signals.push("discipline_markers");
  }

  if (signals.includes("metaphor_markers")) {
    return {
      status: "metaphor_only",
      languageMode: "metaphor",
      confidence: signals.includes("hypothesis_markers") ? "medium" : "high",
      signals,
      boundaryNotes: [
        "Metaphorical wording should stay marked as metaphor_only unless the text is explicitly re-framed as a model."
      ]
    };
  }

  if (signals.includes("operational_markers")) {
    return {
      status: "operational_marker",
      languageMode: "operational_description",
      confidence: signals.includes("hypothesis_markers") ? "medium" : "high",
      signals,
      boundaryNotes
    };
  }

  if (signals.includes("hypothesis_markers")) {
    return {
      status: "hypothesis",
      languageMode: "conditional_description",
      confidence: "high",
      signals,
      boundaryNotes
    };
  }

  if (signals.includes("discipline_markers")) {
    return {
      status: "working_distinction",
      languageMode: "operational_description",
      confidence: "low",
      signals,
      boundaryNotes: [
        "The text names map discipline terms but does not strongly specify claim status."
      ]
    };
  }

  return {
    status: "definition",
    languageMode: "direct_description",
    confidence: "low",
    signals,
    boundaryNotes: ["The classifier found no strong claim-status marker."]
  };
}

export function validateClaimContract(value: unknown): ClaimValidationReport {
  const schema = validateClaim(value);

  if (!schema.valid) {
    return {
      schema,
      accepted: false,
      risks: ["schema_contract_violation"],
      boundaryNotes: ["Claim cannot enter the map until it satisfies the JSON Schema contract."]
    };
  }

  const claim = value as AvgClaim;
  const risks = new Set(claim.risks);
  const boundaryNotes: string[] = [];

  if (claim.language_mode === "metaphor" && claim.claim_status !== "metaphor_only") {
    risks.add("metaphor_as_fact");
    boundaryNotes.push("Metaphorical language must be marked as metaphor_only before it is treated as a map claim.");
  }

  if (claim.claim_status === "hypothesis" && !claim.scope) {
    risks.add("missing_scope");
    boundaryNotes.push("Hypotheses need an explicit scope so AVG does not present a working map as Reality.");
  }

  return {
    schema,
    accepted: risks.size === claim.risks.length,
    status: claim.claim_status,
    languageMode: claim.language_mode,
    risks: [...risks],
    boundaryNotes
  };
}

export function extractClaimsFromAvgResponse(value: unknown): ClaimExtractionReport {
  const responseSchema = validateAvgResponse(value);

  if (!responseSchema.valid) {
    return {
      responseSchema,
      claims: [],
      accepted: false,
      boundaryNotes: [
        "Claim extraction stops until the AVG structured response satisfies its schema.",
        ...formatSchemaNotes(responseSchema.errors)
      ]
    };
  }

  const response = value as AvgStructuredResponse;
  const claimCandidates: Array<{
    sourceField: ClaimExtractionField;
    statement: string;
    claimStatus: ClaimStatus;
    languageMode: LanguageMode;
  }> = [
    {
      sourceField: "summary",
      statement: response.summary,
      claimStatus: response.claim_status,
      languageMode: response.language_mode
    },
    {
      sourceField: "scope",
      statement: `Scope boundary: ${response.scope}`,
      claimStatus: "boundary_statement",
      languageMode: "operational_description"
    },
    {
      sourceField: "next_action",
      statement: response.next_action,
      claimStatus: "operational_marker",
      languageMode: "operational_description"
    }
  ];

  const claims = claimCandidates.map((candidate) => {
    const claim = buildClaimFromResponse(
      response,
      candidate.sourceField,
      candidate.statement,
      candidate.claimStatus,
      candidate.languageMode
    );
    const validation = validateClaimContract(claim);
    const classification = classifyClaimDiscipline(claim);

    return {
      sourceField: candidate.sourceField,
      claim,
      validation,
      riskAssessment: analyzeClaimRisk(claim, validation, classification)
    };
  });

  return {
    responseSchema,
    claims,
    accepted: claims.every((record) => record.validation.accepted),
    boundaryNotes: dedupe(claims.flatMap((record) => record.validation.boundaryNotes))
  };
}

export function classifyClaimDiscipline(value: unknown): ClaimClassificationReport {
  if (typeof value !== "object" || value === null || !("statement" in value)) {
    return {
      status: "boundary_statement",
      languageMode: "silence_required",
      confidence: "low",
      signals: ["invalid_input"],
      boundaryNotes: ["Claim classification requires a claim-like object with a statement."]
    };
  }

  const claim = value as Pick<AvgClaim, "statement" | "claim_status" | "language_mode">;
  const scored = scoreSignals(claim.statement);
  const boundaryNotes = [...scored.boundaryNotes];

  if (claim.claim_status && claim.claim_status !== scored.status) {
    boundaryNotes.push(
      `Claim status mismatch: input uses ${claim.claim_status}, classifier prefers ${scored.status}.`
    );
  }

  if (claim.language_mode && claim.language_mode !== scored.languageMode) {
    boundaryNotes.push(
      `Language mode mismatch: input uses ${claim.language_mode}, classifier prefers ${scored.languageMode}.`
    );
  }

  return {
    status: scored.status,
    languageMode: scored.languageMode,
    confidence: scored.confidence,
    signals: scored.signals,
    boundaryNotes: dedupe(boundaryNotes)
  };
}

export function classifyClaimRisk(value: unknown): ClaimRiskAssessmentReport {
  if (typeof value !== "object" || value === null || !("statement" in value)) {
    const classification: ClaimClassificationReport = {
      status: "boundary_statement",
      languageMode: "silence_required",
      confidence: "low",
      signals: ["invalid_input"],
      boundaryNotes: ["Claim risk classification requires a claim-like object with a statement."]
    };
    const validation: ClaimValidationReport = {
      schema: { valid: false, errors: [] },
      accepted: false,
      risks: ["schema_contract_violation"],
      boundaryNotes: ["Claim cannot enter the map until it satisfies the JSON Schema contract."]
    };

    return {
      riskLevel: "critical",
      riskMarkers: ["schema_contract_violation"],
      repairSuggestions: repairSuggestionsForMarkers(["schema_contract_violation"]),
      boundaryNotes: dedupe([...validation.boundaryNotes, ...classification.boundaryNotes]),
      validation,
      classification,
      shouldRepair: true
    };
  }

  const claim = value as AvgClaim;
  const validation = validateClaimContract(claim);
  const classification = classifyClaimDiscipline(claim);
  return analyzeClaimRisk(claim, validation, classification);
}

export function composeGroundedResponse(
  response: unknown,
  hits: AvgRetrievalHit[]
): GroundedResponseCompositionReport {
  const responseSchema = validateAvgResponse(response);

  if (!responseSchema.valid) {
    return {
      responseSchema,
      accepted: false,
      boundaryNotes: [
        "Grounded response composition stops until the AVG structured response satisfies its schema.",
        ...formatSchemaNotes(responseSchema.errors)
      ]
    };
  }

  const structuredResponse = response as AvgStructuredResponse;
  const citations = hits.map(citationFromHit);
  const claimReport = extractClaimsFromAvgResponse(structuredResponse);
  const groundedClaims: string[] = [];
  const interpretations: string[] = [];
  const unsupportedClaims: string[] = [];

  for (const record of claimReport.claims) {
    const claimStatement = record.claim.statement;

    if (record.sourceField === "next_action") {
      interpretations.push(claimStatement);
      continue;
    }

    if (citations.length > 0) {
      groundedClaims.push(claimStatement);
      continue;
    }

    unsupportedClaims.push(claimStatement);
  }

  const retrievalConfidence = confidenceFromHits(hits);
  const boundaryStatement =
    retrievalConfidence === "none"
      ? "No registered snippets matched this answer, so it remains an unsupported working map."
      : groundedClaims.length > 0
        ? "This answer is grounded only in registered project document snippets."
        : "Registered snippets were found, but the answer still needs clearer citation alignment.";

  if (retrievalConfidence === "low") {
    unsupportedClaims.push("Retrieval confidence is low enough to require a visible boundary statement.");
  }

  return {
    responseSchema,
    groundedResponse: {
      response: structuredResponse,
      grounding: {
        citations,
        grounded_claims: dedupe(groundedClaims),
        interpretations: dedupe(interpretations),
        unsupported_claims: dedupe(unsupportedClaims),
        retrieval_confidence: retrievalConfidence,
        boundary_statement: boundaryStatement
      }
    },
    accepted: claimReport.accepted && groundedClaims.length > 0 && citations.length > 0,
    boundaryNotes: dedupe([
      ...claimReport.boundaryNotes,
      ...(retrievalConfidence === "none"
        ? ["No retrieval evidence was available for grounded composition."]
        : []),
      ...(retrievalConfidence === "low"
        ? ["Retrieval confidence is low; the boundary statement must remain visible."]
        : []),
      ...(unsupportedClaims.length > 0
        ? ["Some response claims remain unsupported by the retrieved snippet set."]
        : [])
    ])
  };
}

export function isAvgClaim(value: unknown): value is AvgClaim {
  return validateClaim(value).valid;
}

export function isAvgStructuredResponse(value: unknown): value is AvgStructuredResponse {
  return validateAvgResponse(value).valid;
}
