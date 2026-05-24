/**
 * @avg/web - Artifact generators for AVG-708: Artifact Workspace and Export
 *
 * Pure functions that generate artifact envelopes from session data.
 * No React, no side effects — fully testable.
 */

import type { AvgClaim, AvgStructuredResponse, AvgMapNode, AvgMapEdge } from "@avg/schemas";
import type { GraphSnapshot } from "@avg/graph";
import type { DialogueMessage } from "@avg/html-rendering";
import type { AvgRetrievalHit } from "@avg/retrieval";
import type { AvgGroundedResponseBoundary } from "@avg/validation";
import type { ArtifactKind, AvgArtifactEnvelope } from "./types";

// ============================================================================
// Constants
// ============================================================================

const MAP_TERRITORY_BOUNDARY_NOTE =
  "This map is a working projection of session material. It is a model, not Reality. " +
  "Nodes and edges reflect the current understanding within this session and may change as thinking evolves.";

const UNCERTAINTY_PRESERVATION_NOTE =
  "This artifact preserves uncertainty — unsupported claims, risk markers, and boundary notes are included, not hidden. " +
  "Absence of evidence is not evidence of absence.";

// ============================================================================
// Helper functions
// ============================================================================

function collectRiskMarkers(claims: AvgClaim[]): string[] {
  const risks = new Set<string>();
  for (const claim of claims) {
    for (const risk of claim.risks) {
      risks.add(risk);
    }
  }
  return Array.from(risks);
}

function collectCitationIds(retrievalHits: AvgRetrievalHit[]): string[] {
  return retrievalHits.map((hit) => hit.citation_id);
}

function collectSnippetIds(retrievalHits: AvgRetrievalHit[]): string[] {
  return retrievalHits.map((hit) => hit.snippet_id);
}

function getUnsupportedClaims(claims: AvgClaim[]): AvgClaim[] {
  return claims.filter(
    (c) => c.claim_status === "metaphor_only" || c.claim_status === "hypothesis"
  );
}

function createBaseEnvelope(
  kind: ArtifactKind,
  projectId: string,
  sessionId: string,
  claims: AvgClaim[],
  retrievalHits: AvgRetrievalHit[]
): AvgArtifactEnvelope {
  return {
    artifact_kind: kind,
    project_id: projectId,
    session_id: sessionId,
    generated_at: new Date().toISOString(),
    contract_version: "mvp-5",
    scope: "Current session state at time of export",
    risk_markers: collectRiskMarkers(claims),
    citation_ids: collectCitationIds(retrievalHits),
    snippet_ids: collectSnippetIds(retrievalHits),
    map_territory_boundary_note: MAP_TERRITORY_BOUNDARY_NOTE,
    uncertainty_preservation_note: UNCERTAINTY_PRESERVATION_NOTE,
    payload: {},
  };
}

// ============================================================================
// Artifact generators
// ============================================================================

export function generateSessionSummaryArtifact(
  projectId: string,
  sessionId: string,
  projectTitle: string,
  messages: DialogueMessage[],
  claims: AvgClaim[],
  mapSnapshot: GraphSnapshot | undefined,
  retrievalHits: AvgRetrievalHit[] = []
): AvgArtifactEnvelope {
  const envelope = createBaseEnvelope("session_summary", projectId, sessionId, claims, retrievalHits);

  const userMessages = messages.filter((m) => m.role === "user");
  const assistantMessages = messages.filter((m) => m.role === "assistant");

  const claimsByStatus: Record<string, number> = {};
  for (const claim of claims) {
    claimsByStatus[claim.claim_status] = (claimsByStatus[claim.claim_status] || 0) + 1;
  }

  envelope.payload = {
    project_title: projectTitle,
    dialogue_turns: userMessages.length,
    user_messages: userMessages.length,
    assistant_messages: assistantMessages.length,
    total_claims: claims.length,
    claims_by_status: claimsByStatus,
    risk_summary: collectRiskMarkers(claims),
    unsupported_claims: getUnsupportedClaims(claims),
    boundary_notes: [MAP_TERRITORY_BOUNDARY_NOTE],
    messages: messages,
    map_snapshot_summary: mapSnapshot
      ? {
          node_count: mapSnapshot.nodes.length,
          edge_count: mapSnapshot.edges.length,
        }
      : null,
  };

  return envelope;
}

export function generateGroundedAnswerArtifact(
  projectId: string,
  sessionId: string,
  lastResponse: AvgStructuredResponse | null,
  grounding: AvgGroundedResponseBoundary | null,
  retrievalHits: AvgRetrievalHit[],
  claims: AvgClaim[] = []
): AvgArtifactEnvelope {
  const envelope = createBaseEnvelope("grounded_answer", projectId, sessionId, claims, retrievalHits);

  if (!lastResponse) {
    envelope.payload = {
      status: "no_grounded_answer_available",
      message: "No grounded response has been generated yet. Run a retrieval query first.",
    };
    return envelope;
  }

  envelope.payload = {
    response_id: lastResponse.id,
    message_id: lastResponse.message_id,
    summary: lastResponse.summary,
    scope: lastResponse.scope,
    claim_status: lastResponse.claim_status,
    language_mode: lastResponse.language_mode,
    validation_risk: lastResponse.validation_risk,
    risk_markers: lastResponse.risk_markers,
    map_territory_boundary: lastResponse.map_territory_boundary,
    next_action: lastResponse.next_action,
    grounding: grounding
      ? {
          retrieval_confidence: grounding.retrieval_confidence,
          citation_ids: grounding.citations?.map((c) => c.id) || [],
        }
      : null,
    citations: retrievalHits.map((hit) => ({
      citation_id: hit.citation_id,
      snippet_id: hit.snippet_id,
      document_id: hit.document_id,
      matched_text: hit.matched_text,
      confidence: hit.confidence,
      score: hit.score,
    })),
    unsupported_claims: getUnsupportedClaims(claims),
  };

  return envelope;
}

export function generateMapSnapshotArtifact(
  projectId: string,
  sessionId: string,
  mapSnapshot: GraphSnapshot | undefined,
  claims: AvgClaim[] = [],
  retrievalHits: AvgRetrievalHit[] = []
): AvgArtifactEnvelope {
  const envelope = createBaseEnvelope("map_snapshot", projectId, sessionId, claims, retrievalHits);

  if (!mapSnapshot) {
    envelope.payload = {
      status: "no_map_available",
      message: "No concept map has been generated yet. Submit dialogue thoughts to build the map.",
      boundary_note: MAP_TERRITORY_BOUNDARY_NOTE,
    };
    return envelope;
  }

  envelope.payload = {
    node_count: mapSnapshot.nodes.length,
    edge_count: mapSnapshot.edges.length,
    nodes: mapSnapshot.nodes.map((node: AvgMapNode) => ({
      id: node.id,
      type: node.type,
      label: node.label,
      definition: node.definition,
      access_mode: node.coordinates.access_mode,
      language_mode: node.coordinates.language_mode,
      claim_status: node.coordinates.claim_status,
      known_risks: node.map_safety.known_risks || [],
    })),
    edges: mapSnapshot.edges.map((edge: AvgMapEdge) => ({
      id: edge.id,
      type: edge.type,
      from: edge.from,
      to: edge.to,
      claim_status: edge.claim_status,
      scope: edge.scope,
      constraints: edge.constraints,
    })),
    boundary_note: MAP_TERRITORY_BOUNDARY_NOTE,
    unsupported_claims: getUnsupportedClaims(claims),
  };

  return envelope;
}

export function generateCitationReportArtifact(
  projectId: string,
  sessionId: string,
  retrievalHits: AvgRetrievalHit[],
  claims: AvgClaim[] = []
): AvgArtifactEnvelope {
  const envelope = createBaseEnvelope("citation_report", projectId, sessionId, claims, retrievalHits);

  if (retrievalHits.length === 0) {
    envelope.payload = {
      status: "no_citations_available",
      message: "No retrieval queries have been run yet. Ask a grounded question to generate citations.",
      citation_count: 0,
    };
    return envelope;
  }

  const citations = retrievalHits.map((hit) => ({
    citation_id: hit.citation_id,
    snippet_id: hit.snippet_id,
    document_id: hit.document_id,
    matched_text: hit.matched_text,
    confidence: hit.confidence,
    score: hit.score,
    source_label: hit.source_label,
  }));

  const firstHit = retrievalHits.length > 0 ? retrievalHits[0] : undefined;

  envelope.payload = {
    citation_count: citations.length,
    citations,
    retrieval_confidence: firstHit ? firstHit.confidence : "none",
    source_documents: Array.from(new Set(retrievalHits.map((hit) => hit.document_id))),
    unsupported_claims: getUnsupportedClaims(claims),
  };

  return envelope;
}

// ============================================================================
// Serialization functions
// ============================================================================

export function serializeAsJson(envelope: AvgArtifactEnvelope): string {
  return JSON.stringify(envelope, null, 2);
}

export function serializeAsMarkdown(envelope: AvgArtifactEnvelope): string {
  const {
    artifact_kind,
    project_id,
    session_id,
    generated_at,
    scope,
    risk_markers,
    citation_ids,
    snippet_ids,
    map_territory_boundary_note,
    uncertainty_preservation_note,
    payload,
  } = envelope;

  const title = artifact_kind.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  let md = `---\n`;
  md += `artifact_kind: ${artifact_kind}\n`;
  md += `project_id: ${project_id}\n`;
  md += `session_id: ${session_id}\n`;
  md += `generated_at: ${generated_at}\n`;
  md += `contract_version: ${envelope.contract_version}\n`;
  md += `---\n\n`;

  md += `# ${title}\n\n`;

  md += `## Scope\n\n`;
  md += `${scope}\n\n`;

  if (risk_markers.length > 0) {
    md += `## Risk Markers\n\n`;
    for (const risk of risk_markers) {
      md += `- ${risk}\n`;
    }
    md += `\n`;
  }

  md += `## Map/Territory Boundary\n\n`;
  md += `${map_territory_boundary_note}\n\n`;

  md += `## Uncertainty Preservation\n\n`;
  md += `${uncertainty_preservation_note}\n\n`;

  if (citation_ids.length > 0) {
    md += `## Citations\n\n`;
    md += `Citation IDs: ${citation_ids.join(", ")}\n\n`;
    md += `Snippet IDs: ${snippet_ids.join(", ")}\n\n`;
  }

  // Payload content
  md += `## Content\n\n`;

  if (payload.status && typeof payload.status === "string" && payload.status.includes("no_")) {
    md += `> ${payload.message || "No data available"}\n\n`;
  } else {
    // Render payload as structured content
    if (payload.summary) {
      md += `### Summary\n\n`;
      md += `${payload.summary}\n\n`;
    }

    if (payload.dialogue_turns !== undefined) {
      md += `### Dialogue Statistics\n\n`;
      md += `- Dialogue turns: ${payload.dialogue_turns}\n`;
      md += `- User messages: ${payload.user_messages}\n`;
      md += `- Assistant messages: ${payload.assistant_messages}\n`;
      md += `- Total claims: ${payload.total_claims}\n\n`;

      if (payload.claims_by_status) {
        md += `#### Claims by Status\n\n`;
        for (const [status, count] of Object.entries(payload.claims_by_status as Record<string, number>)) {
          md += `- ${status}: ${count}\n`;
        }
        md += `\n`;
      }
    }

    if (payload.node_count !== undefined) {
      md += `### Map Statistics\n\n`;
      md += `- Nodes: ${payload.node_count}\n`;
      md += `- Edges: ${payload.edge_count}\n\n`;

      if (Array.isArray(payload.nodes)) {
        md += `### Nodes\n\n`;
        md += "| ID | Type | Label | Claim Status |\n";
        md += "|---|---|---|---|\n";
        for (const node of payload.nodes as Array<Record<string, unknown>>) {
          md += `| ${node.id} | ${node.type} | ${node.label} | ${node.claim_status || "-"} |\n`;
        }
        md += `\n`;
      }

      if (Array.isArray(payload.edges)) {
        md += `### Edges\n\n`;
        md += "| ID | Type | From | To | Claim Status |\n";
        md += "|---|---|---|---|---|\n";
        for (const edge of payload.edges as Array<Record<string, unknown>>) {
          md += `| ${edge.id} | ${edge.type} | ${edge.from} | ${edge.to} | ${edge.claim_status} |\n`;
        }
        md += `\n`;
      }
    }

    if (payload.citation_count !== undefined) {
      md += `### Citations\n\n`;
      md += `Total citations: ${payload.citation_count}\n\n`;

      if (Array.isArray(payload.citations)) {
        md += "| Citation ID | Snippet ID | Document ID | Confidence | Score |\n";
        md += "|---|---|---|---|---|\n";
        for (const citation of payload.citations as Array<Record<string, unknown>>) {
          md += `| ${citation.citation_id} | ${citation.snippet_id} | ${citation.document_id} | ${citation.confidence} | ${citation.score} |\n`;
        }
        md += `\n`;
      }
    }

    // Raw payload as JSON code block
    md += `### Raw Payload\n\n`;
    md += "```json\n";
    md += JSON.stringify(payload, null, 2);
    md += "\n```\n\n";
  }

  // Unsupported claims section - ALWAYS visible
  const unsupportedClaims = (payload.unsupported_claims as AvgClaim[]) || [];
  if (unsupportedClaims.length > 0) {
    md += `## Unsupported Claims\n\n`;
    md += `> These claims are marked as metaphor-only or hypothesis. They are included for context but should not be treated as established fact.\n\n`;
    for (const claim of unsupportedClaims) {
      md += `- **${claim.statement}** (status: ${claim.claim_status}, language_mode: ${claim.language_mode})\n`;
      if (claim.repair) {
        md += `  - Repair suggestion: ${claim.repair}\n`;
      }
    }
    md += `\n`;
  } else {
    md += `## Unsupported Claims\n\n`;
    md += `No unsupported claims detected. All claims are currently within their stated scope.\n\n`;
  }

  return md;
}
