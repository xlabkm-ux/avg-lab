import type { AvgStructuredResponse } from "@avg/schemas";
import { validateAvgResponse } from "@avg/schemas";
import type { ErMapIndex } from "./er-map-index.js";
import { matchTerms } from "./term-matching.js";
import { assembleSummary } from "./response-assembly.js";
import { deriveMetadata } from "./metadata-derivation.js";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DialogueEngineInput {
  query: string;
  projectId: string;
  sessionId: string;
  messageId: string;
}

// ─── Boundary Fallback ───────────────────────────────────────────────────────

/**
 * Known-good boundary response used when the generated response fails validation.
 */
function createBoundaryFallback(input: DialogueEngineInput): AvgStructuredResponse {
  return {
    id: `response-${input.messageId}`,
    project_id: input.projectId,
    session_id: input.sessionId,
    message_id: input.messageId,
    summary: "Запрос не может быть обработан в текущей рамке карты ЭР. Это граница: ответ требует уточнения.",
    scope: "В рамках карты ЭР, область определения не установлена",
    claim_status: "boundary_statement",
    language_mode: "operational_description",
    validation_risk: "low",
    risk_markers: [],
    map_territory_boundary: "preserved",
    next_action: "Переформулируйте запрос с указанием конкретного термина или области.",
  };
}

// ─── Engine ──────────────────────────────────────────────────────────────────

/**
 * Deterministic dialogue engine that generates AvgStructuredResponse
 * from the er-map knowledge base without any LLM calls.
 *
 * Pipeline:
 * 1. matchTerms(query) → scored matches
 * 2. assembleSummary(matches, query) → Russian text from definitions
 * 3. deriveMetadata(matches) → claim_status, language_mode, risk, scope...
 * 4. validateAvgResponse() → schema guard
 * 5. Return validated response or fallback
 */
export function generateDialogueResponse(
  input: DialogueEngineInput,
  index: ErMapIndex
): AvgStructuredResponse {
  // Step 1: Match terms
  const match = matchTerms(input.query, index);

  // Step 2: Assemble summary text
  const summary = assembleSummary(match, input.query);

  // Step 3: Derive metadata
  const metadata = deriveMetadata(match);

  // Step 4: Compose response
  const response: AvgStructuredResponse = {
    id: `response-${input.messageId}`,
    project_id: input.projectId,
    session_id: input.sessionId,
    message_id: input.messageId,
    summary,
    scope: metadata.scope,
    claim_status: metadata.claim_status,
    language_mode: metadata.language_mode,
    validation_risk: metadata.validation_risk,
    risk_markers: metadata.risk_markers,
    map_territory_boundary: metadata.map_territory_boundary,
    next_action: metadata.next_action,
  };

  // Step 5: Validate against schema
  const validation = validateAvgResponse(response);
  if (!validation.valid) {
    return createBoundaryFallback(input);
  }

  return response;
}
