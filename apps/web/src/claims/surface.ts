/**
 * Claim review panel surface for AVG Codex Lab.
 */

import { escapeHtml } from "@avg/utils";
import { renderShellTitle } from "@avg/html-rendering";

import {
  type AvgClaim,
  type ClaimReviewStatus,
  type ClaimReviewSurfaceInput,
  type ClaimReviewSurface,
} from "./types";

// Re-export types
export type {
  AvgClaim,
  ClaimReviewStatus,
  ClaimReviewSurfaceInput,
  ClaimReviewSurface,
};

// ============================================================================
// Constants
// ============================================================================

const claimStatusLabels: Record<string, string> = {
  definition: "Definition",
  working_distinction: "Working Distinction",
  operational_marker: "Operational Marker",
  indirect_sign: "Indirect Sign",
  hypothesis: "Hypothesis",
  metaphor_only: "Metaphor Only",
  prohibited_positive_claim: "Prohibited Positive Claim",
  boundary_statement: "Boundary Statement",
};

const languageModeLabels: Record<string, string> = {
  direct_description: "Direct Description",
  operational_description: "Operational Description",
  conditional_description: "Conditional Description",
  metaphor: "Metaphor",
  symbolic_pointer: "Symbolic Pointer",
  silence_required: "Silence Required",
};

// ============================================================================
// Claim Review Surface
// ============================================================================

export function createClaimReviewSurface(
  input: ClaimReviewSurfaceInput,
): ClaimReviewSurface {
  const baseSurface = {
    kind: "claim-review-surface" as const,
    title: renderShellTitle(),
    projectId: input.projectId,
    sessionId: input.sessionId,
    claims: input.claims ?? [],
    panelTitle: "Claim Review Panel",
    emptyStateTitle: "No claims to inspect",
    emptyStateBody: "Structured response claims will appear here with status, language mode and validation risk.",
    claimStatusLabel: "Claim Status",
    languageModeLabel: "Language Mode",
    scopeLabel: "Scope",
    risksLabel: "Risks",
    repairLabel: "Repair Suggestion",
    sourceRefsLabel: "Source References",
  };

  if (input.isLoading === true) {
    return {
      ...baseSurface,
      status: "reviewing",
    };
  }

  const hasRiskyClaims = input.claims?.some(claim =>
    claim.risks.length > 0 || claim.claim_status === "metaphor_only" || claim.claim_status === "prohibited_positive_claim"
  );

  return {
    ...baseSurface,
    status: hasRiskyClaims ? "needs_repair" : input.claims && input.claims.length > 0 ? "validated" : "empty",
  };
}

export function renderClaimReviewSurface(
  input: ClaimReviewSurfaceInput | ClaimReviewSurface,
): string {
  const surface =
    "kind" in input && input.kind === "claim-review-surface"
      ? input
      : createClaimReviewSurface(input);

  const claimItems = surface.claims.map((claim) => {
    const scopeLine = claim.scope
      ? `      <div><dt>${escapeHtml(surface.scopeLabel)}</dt><dd>${escapeHtml(claim.scope)}</dd></div>\n`
      : "";
    const repairLine = claim.repair
      ? `      <div><dt>${escapeHtml(surface.repairLabel)}</dt><dd>${escapeHtml(claim.repair)}</dd></div>\n`
      : "";
    const sourceRefsLine = claim.source_refs && claim.source_refs.length > 0
      ? `      <div><dt>${escapeHtml(surface.sourceRefsLabel)}</dt><dd>${claim.source_refs.map(ref => escapeHtml(ref)).join(", ")}</dd></div>\n`
      : "";

    const riskItems = claim.risks.map(risk => `          <li>${escapeHtml(risk)}</li>`);

    return [
      `    <li data-claim-id="${escapeHtml(claim.id)}" data-claim-status="${escapeHtml(claim.claim_status)}" data-language-mode="${escapeHtml(claim.language_mode)}">`,
      `      <strong>${escapeHtml(claim.statement)}</strong>`,
      `      <dl>`,
      `        <div><dt>${escapeHtml(surface.claimStatusLabel)}</dt><dd>${escapeHtml(claimStatusLabels[claim.claim_status] ?? claim.claim_status)}</dd></div>`,
      `        <div><dt>${escapeHtml(surface.languageModeLabel)}</dt><dd>${escapeHtml(languageModeLabels[claim.language_mode] ?? claim.language_mode)}</dd></div>`,
      scopeLine,
      `        <div><dt>${escapeHtml(surface.risksLabel)}</dt>`,
      `          <ul>`,
      ...(riskItems.length > 0 ? riskItems : [`          <li>No risks identified</li>`]),
      `          </ul>`,
      `        </div>`,
      repairLine,
      sourceRefsLine,
      `      </dl>`,
      `    </li>`,
    ].join("\n");
  });

  const loadingIndicator =
    surface.status === "reviewing"
      ? [
          `  <section aria-label="claim-review-loading">`,
          `    <p>Reviewing claims...</p>`,
          `  </section>`,
        ]
      : [];

  return [
    `<section data-surface="${surface.kind}" data-project-id="${escapeHtml(surface.projectId)}" data-session-id="${escapeHtml(surface.sessionId)}" data-status="${surface.status}">`,
    `  <header>`,
    `    <p>${escapeHtml(surface.title)}</p>`,
    `    <h2>${escapeHtml(surface.panelTitle)}</h2>`,
    `  </header>`,
    ...loadingIndicator,
    `  <section aria-label="claims-list">`,
    ...(claimItems.length > 0
      ? [
          `    <h3>Claims (${surface.claims.length})</h3>`,
          `    <ul>`,
          ...claimItems,
          `    </ul>`,
        ]
      : [
          `    <strong>${escapeHtml(surface.emptyStateTitle)}</strong>`,
          `    <p>${escapeHtml(surface.emptyStateBody)}</p>`,
        ]),
    `  </section>`,
    `</section>`,
  ].join("\n");
}
