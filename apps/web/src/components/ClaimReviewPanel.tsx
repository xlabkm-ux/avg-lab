import { useState } from "react";
import type { AvgClaim } from "@avg/schemas";

interface ClaimReviewPanelProps {
  claims: AvgClaim[];
  projectId: string;
  sessionId: string;
}

const claimStatusLabels: Record<string, string> = {
  definition: "Definition",
  working_distinction: "Working Distinction",
  operational_marker: "Operational Marker",
  indirect_sign: "Indirect Sign",
  hypothesis: "Hypothesis",
  metaphor_only: "Metaphor Only",
  prohibited_positive_claim: "Prohibited",
  boundary_statement: "Boundary Statement",
};

const languageModeLabels: Record<string, string> = {
  direct_description: "Direct",
  operational_description: "Operational",
  conditional_description: "Conditional",
  metaphor: "Metaphor",
  symbolic_pointer: "Symbolic",
  silence_required: "Silence",
};

function ClaimStatusBadge({ status }: { status: string }) {
  const label = claimStatusLabels[status] ?? status;
  const className = `claim-status-badge claim-status-${status.replace(/_/g, "-")}`;

  return (
    <span className={className} data-testid="claim-status-badge" data-status={status}>
      {label}
    </span>
  );
}

function LanguageModeBadge({ mode }: { mode: string }) {
  const label = languageModeLabels[mode] ?? mode;

  return (
    <span className="language-mode-badge" data-testid="claim-language-mode" data-mode={mode}>
      {label}
    </span>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const className = `risk-badge risk-${risk}`;
  const label = risk.charAt(0).toUpperCase() + risk.slice(1).replace(/_/g, ' ');

  return (
    <span className={className} data-testid="claim-risk-marker">
      {label}
    </span>
  );
}

function ClaimCard({ claim }: { claim: AvgClaim }) {
  const [expanded, setExpanded] = useState(false);

  const hasRisks = claim.risks.length > 0;
  const needsRepair = claim.repair !== undefined;
  const isMetaphorOrProhibited =
    claim.claim_status === "metaphor_only" ||
    claim.claim_status === "prohibited_positive_claim";
  const validationStatus = hasRisks || isMetaphorOrProhibited ? "needs-review" : "validated";

  return (
    <li
      className={`claim-review-item ${hasRisks ? "has-risks" : ""} ${needsRepair ? "needs-repair" : ""}`}
      data-claim-id={claim.id}
      data-claim-status={claim.claim_status}
      data-language-mode={claim.language_mode}
      data-validation-status={validationStatus}
    >
      <div className="claim-review-header">
        <button
          type="button"
          className="claim-expand-btn"
          data-testid="expand-claim-btn"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse claim details" : "Expand claim details"}
        >
          <span className="claim-expand-icon">{expanded ? "\u25BC" : "\u25B6"}</span>
          <span className="claim-statement" data-testid="claim-statement">{claim.statement}</span>
        </button>
        <div className="claim-badges">
          <ClaimStatusBadge status={claim.claim_status} />
          <LanguageModeBadge mode={claim.language_mode} />
        </div>
      </div>

      {expanded && (
        <div className="claim-review-details">
          {/* Validation Status Indicator */}
          <div className="claim-review-field">
            <strong>Validation Status</strong>
            <span className={`validation-badge validation-${validationStatus}`} data-testid="validation-status-badge">
              {validationStatus === "validated" ? "\u2713 Validated" : "\u26A0 Needs Review"}
            </span>
          </div>

          {claim.scope !== undefined && (
            <div className="claim-review-field">
              <strong>Scope</strong>
              <p>{claim.scope}</p>
            </div>
          )}

          <div className="claim-review-field">
            <strong>Risks</strong>
            {hasRisks ? (
              <ul className="claim-risk-list">
                {claim.risks.map((risk, index) => (
                  <li key={index} className="claim-risk-item">
                    <RiskBadge risk={risk} />
                    <span>{risk.replace(/_/g, ' ')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-risks">No risks identified</p>
            )}
          </div>

          {needsRepair && (
            <div className="claim-review-field claim-repair">
              <strong>Repair Suggestion</strong>
              <p>{claim.repair}</p>
            </div>
          )}

          {claim.source_refs !== undefined && claim.source_refs.length > 0 && (
            <div className="claim-review-field">
              <strong>Source References</strong>
              <ul className="claim-source-list">
                {claim.source_refs.map((ref, index) => (
                  <li key={index}>{ref}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export function ClaimReviewPanel({ claims, projectId, sessionId }: ClaimReviewPanelProps) {
  if (claims.length === 0) {
    return (
      <section
        className="claim-review-surface"
        data-testid="claim-review-panel"
        data-project-id={projectId}
        data-session-id={sessionId}
        data-status="empty"
      >
        <header>
          <h2>Claim Review</h2>
        </header>
        <div className="claim-review-empty" data-testid="claim-review-empty-state">
          <h3>No claims to inspect</h3>
          <p>
            Structured response claims will appear here with status, language mode and validation
            risk.
          </p>
        </div>
      </section>
    );
  }

  const hasRiskyClaims = claims.some(
    (claim) =>
      claim.risks.length > 0 ||
      claim.claim_status === "metaphor_only" ||
      claim.claim_status === "prohibited_positive_claim",
  );

  const status = hasRiskyClaims ? "needs_repair" : "validated";

  return (
    <section
      className="claim-review-surface"
      data-testid="claim-review-panel"
      data-project-id={projectId}
      data-session-id={sessionId}
      data-status={status}
    >
      <header>
        <h2>Claim Review</h2>
        <span className="claim-review-count">{claims.length} claims</span>
      </header>
      <ul className="claim-review-list">
        {claims.map((claim) => (
          <ClaimCard key={claim.id} claim={claim} />
        ))}
      </ul>
    </section>
  );
}
