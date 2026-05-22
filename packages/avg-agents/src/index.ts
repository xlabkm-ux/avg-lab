import type { AvgStructuredResponse, ClaimStatus, DialogueValidationRisk, LanguageMode } from "@avg/schemas";
import { normalizeText } from "@avg/utils";

export type RuntimeMode = "creative" | "architect" | "validator" | "orchestrator";

export interface DialogueRoutingContext {
  instruction: string;
  goal?: string;
  claimedRisk?: DialogueValidationRisk;
  claimStatus?: ClaimStatus;
  languageMode?: LanguageMode;
}

export interface DialogueRouteDecision {
  mode: RuntimeMode;
  rationale: string;
  signals: readonly string[];
}

export interface ComposeStructuredResponseInput {
  id: string;
  projectId: string;
  sessionId: string;
  messageId: string;
  summary: string;
  scope: string;
  claimStatus: ClaimStatus;
  languageMode: LanguageMode;
  validationRisk: DialogueValidationRisk;
  riskMarkers: readonly string[];
  mapTerritoryBoundary: AvgStructuredResponse["map_territory_boundary"];
  nextAction: string;
  artifacts?: readonly string[];
}

function collectSignals(text: string): string[] {
  const normalized = normalizeText(text);
  const signals: string[] = [];

  if (/(validate|claim|risk|metaphor|repair|boundary)/.test(normalized)) {
    signals.push("validation");
  }

  if (/(architect|system|module|contract|milestone|pipeline|compose|route)/.test(normalized)) {
    signals.push("architecture");
  }

  if (/(creative|brainstorm|variants?|alternatives?|explore|invent|generate)/.test(normalized)) {
    signals.push("creative");
  }

  if (signals.length === 0) {
    signals.push("orchestrator");
  }

  return signals;
}

export function routeDialogueMode(context: DialogueRoutingContext): DialogueRouteDecision {
  const combinedText = [context.instruction, context.goal ?? ""].join(" ");
  const signals = collectSignals(combinedText);

  if (signals.includes("validation")) {
    return {
      mode: "validator",
      rationale: "Instruction emphasizes claims, risks, metaphor boundaries, or repairs.",
      signals
    };
  }

  if (signals.includes("architecture")) {
    return {
      mode: "architect",
      rationale: "Instruction emphasizes system design, contracts, or response composition.",
      signals
    };
  }

  if (signals.includes("creative")) {
    return {
      mode: "creative",
      rationale: "Instruction emphasizes generative variation or alternative directions.",
      signals
    };
  }

  if (context.claimStatus === "metaphor_only" || context.claimStatus === "prohibited_positive_claim") {
    return {
      mode: "validator",
      rationale: "Claim status requires a validation-heavy response.",
      signals: ["validation", ...signals]
    };
  }

  return {
    mode: "orchestrator",
    rationale: "No stronger specialist mode was clearly signaled.",
    signals
  };
}

export function composeStructuredResponse(input: ComposeStructuredResponseInput): AvgStructuredResponse {
  return {
    id: input.id,
    project_id: input.projectId,
    session_id: input.sessionId,
    message_id: input.messageId,
    summary: input.summary,
    scope: input.scope,
    claim_status: input.claimStatus,
    language_mode: input.languageMode,
    validation_risk: input.validationRisk,
    risk_markers: [...input.riskMarkers],
    map_territory_boundary: input.mapTerritoryBoundary,
    next_action: input.nextAction,
    ...(input.artifacts ? { artifacts: [...input.artifacts] } : {})
  };
}
