/**
 * Claim review panel types for AVG Codex Lab.
 */

export interface AvgClaim {
  id: string;
  statement: string;
  claim_status: "definition" | "working_distinction" | "operational_marker" | "indirect_sign" | "hypothesis" | "metaphor_only" | "prohibited_positive_claim" | "boundary_statement";
  language_mode: "direct_description" | "operational_description" | "conditional_description" | "metaphor" | "symbolic_pointer" | "silence_required";
  scope?: string;
  risks: string[];
  repair?: string;
  source_refs?: string[];
}

export type ClaimReviewStatus = "empty" | "reviewing" | "validated" | "needs_repair";

export interface ClaimReviewSurfaceInput {
  projectId: string;
  sessionId: string;
  claims?: AvgClaim[];
  isLoading?: boolean;
}

export interface ClaimReviewSurface {
  kind: "claim-review-surface";
  title: string;
  projectId: string;
  sessionId: string;
  claims: AvgClaim[];
  status: ClaimReviewStatus;
  panelTitle: string;
  emptyStateTitle: string;
  emptyStateBody: string;
  claimStatusLabel: string;
  languageModeLabel: string;
  scopeLabel: string;
  risksLabel: string;
  repairLabel: string;
  sourceRefsLabel: string;
}
