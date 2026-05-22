/**
 * @avg/html-rendering - Server-safe HTML rendering utilities for AVG Codex Lab.
 *
 * This package contains pure HTML rendering functions that can be used by
 * both the server (@avg/api) and the browser (@avg/web) without requiring
 * React or browser-specific APIs.
 */

import type { AvgStructuredResponse } from "@avg/schemas";
import type {
  AvgGroundedResponse,
  AvgGroundedResponseBoundary,
  AvgRetrievalHit,
  GroundedResponseCompositionReport,
} from "@avg/validation";
import { escapeHtml } from "@avg/utils";

// ============================================================================
// Types
// ============================================================================

export interface DialogueMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface DialogueSurfaceGrounding {
  response: AvgStructuredResponse;
  grounding: AvgGroundedResponseBoundary;
}

export type DialogueSurfaceGroundedReport = GroundedResponseCompositionReport;

export interface DialogueMessageSurface {
  kind: "dialogue-message-surface";
  title: string;
  projectId: string;
  sessionId: string;
  messages: DialogueMessage[];
  emptyStateTitle: string;
  emptyStateBody: string;
  composerPlaceholder: string;
  submitLabel: string;
  groundedResponse?: DialogueSurfaceGrounding;
}

export interface StructuredResponseDetailsPanel {
  kind: "structured-response-details-panel";
  title: string;
  response: AvgStructuredResponse;
}

export type GroundedResponseBoundary = AvgGroundedResponse["grounding"];

export interface GroundedResponseDetailsPanel {
  kind: "grounded-response-details-panel";
  title: string;
  response: AvgStructuredResponse;
  grounding: GroundedResponseBoundary;
}

export type GroundedRetrievalFlowStatus = "ready" | "missing_evidence";

export interface GroundedRetrievalFlow {
  kind: "grounded-retrieval-flow";
  title: string;
  projectId: string;
  sessionId: string;
  query: string;
  status: GroundedRetrievalFlowStatus;
  retrievalHits: AvgRetrievalHit[];
  retrievalConfidence: "none" | "low" | "medium" | "high";
  boundaryStatement: string;
  groundedResponse?: DialogueSurfaceGrounding;
  queryLabel: string;
  queryPlaceholder: string;
  submitLabel: string;
}

export interface ProjectSessionShell {
  kind: "project-session-shell";
  title: string;
  projectId: string;
  sessionId: string;
  projectLabel: string;
  sessionLabel: string;
  promptLabel: string;
  placeholder: string;
  submitLabel: string;
  emptyStateTitle: string;
  emptyStateBody: string;
}

export interface DialogueFlowPage {
  kind: "dialogue-flow-page";
  title: string;
  projectSession: ProjectSessionShell;
  messageSurface: DialogueMessageSurface;
}

// ============================================================================
// Helpers
// ============================================================================

function indentMarkup(markup: string, indent: string): string[] {
  return markup.split("\n").map((line) => `${indent}${line}`);
}

export function renderShellTitle(): string {
  return "AVG Codex Lab";
}

export function createProjectSessionShell(
  projectId: string,
  sessionId: string,
): ProjectSessionShell {
  return {
    kind: "project-session-shell",
    title: renderShellTitle(),
    projectId,
    sessionId,
    projectLabel: `Project ${projectId}`,
    sessionLabel: `Session ${sessionId}`,
    promptLabel: "Your raw idea",
    placeholder: "Write your raw idea here",
    submitLabel: "Submit raw idea",
    emptyStateTitle: "No idea yet",
    emptyStateBody: "Write your raw idea and submit to start structured dialogue.",
  };
}

function retrievalConfidenceFromHits(
  hits: AvgRetrievalHit[],
): "none" | "low" | "medium" | "high" {
  return hits[0]?.confidence ?? "none";
}

// ============================================================================
// Dialogue rendering
// ============================================================================

export function createDialogueMessageSurface(
  projectId: string,
  sessionId: string,
  messages: DialogueMessage[],
  groundedResponse?: DialogueSurfaceGrounding,
): DialogueMessageSurface {
  return {
    kind: "dialogue-message-surface",
    title: renderShellTitle(),
    projectId,
    sessionId,
    messages,
    emptyStateTitle: "No dialogue yet",
    emptyStateBody: "Submit a raw idea to start the conversation.",
    composerPlaceholder: "Write the next thought",
    submitLabel: "Send message",
    ...(groundedResponse !== undefined ? { groundedResponse } : {}),
  };
}

export function renderDialogueMessageSurface(
  projectId: string,
  sessionId: string,
  messages: DialogueMessage[],
  groundedResponse?: DialogueSurfaceGrounding,
): string {
  const surface = createDialogueMessageSurface(
    projectId,
    sessionId,
    messages,
    groundedResponse,
  );
  const groundedPanel =
    surface.groundedResponse !== undefined
      ? [
          `  <section aria-label="grounded-response-panel">`,
          `    <h3>Grounded response</h3>`,
          ...indentMarkup(
            renderGroundedResponseDetailsPanel(
              surface.groundedResponse.response,
              surface.groundedResponse.grounding,
            ),
            "    ",
          ),
          `  </section>`,
        ]
      : [];

  if (surface.messages.length === 0) {
    return [
      `<section data-surface="${surface.kind}" data-project-id="${escapeHtml(surface.projectId)}" data-session-id="${escapeHtml(surface.sessionId)}">`,
      `  <p>${escapeHtml(surface.title)}</p>`,
      `  <strong>${escapeHtml(surface.emptyStateTitle)}</strong>`,
      `  <p>${escapeHtml(surface.emptyStateBody)}</p>`,
      `  <textarea placeholder="${escapeHtml(surface.composerPlaceholder)}"></textarea>`,
      `  <button type="button">${escapeHtml(surface.submitLabel)}</button>`,
      ...groundedPanel,
      `</section>`,
    ].join("\n");
  }

  return [
    `<section data-surface="${surface.kind}" data-project-id="${escapeHtml(surface.projectId)}" data-session-id="${escapeHtml(surface.sessionId)}">`,
    `  <p>${escapeHtml(surface.title)}</p>`,
    `  <ol>`,
    ...surface.messages.map(
      (message) =>
        `    <li data-message-id="${escapeHtml(message.id)}" data-message-role="${escapeHtml(message.role)}"><strong>${escapeHtml(message.role)}</strong><p>${escapeHtml(message.content)}</p></li>`,
    ),
    `  </ol>`,
    ...groundedPanel,
    `  <textarea placeholder="${escapeHtml(surface.composerPlaceholder)}"></textarea>`,
    `  <button type="button">${escapeHtml(surface.submitLabel)}</button>`,
    `</section>`,
  ].join("\n");
}

export function createDialogueFlowPage(
  projectId: string,
  sessionId: string,
  messages: DialogueMessage[],
  groundedResponse?: DialogueSurfaceGrounding,
): DialogueFlowPage {
  return {
    kind: "dialogue-flow-page",
    title: renderShellTitle(),
    projectSession: createProjectSessionShell(projectId, sessionId),
    messageSurface: createDialogueMessageSurface(
      projectId,
      sessionId,
      messages,
      groundedResponse,
    ),
  };
}

export function renderDialogueFlowPage(
  projectId: string,
  sessionId: string,
  messages: DialogueMessage[],
  groundedResponse?: DialogueSurfaceGrounding,
): string {
  const page = createDialogueFlowPage(
    projectId,
    sessionId,
    messages,
    groundedResponse,
  );

  return [
    `<main data-page="${page.kind}" data-project-id="${escapeHtml(page.projectSession.projectId)}" data-session-id="${escapeHtml(page.projectSession.sessionId)}">`,
    `  <header>`,
    `    <p>${escapeHtml(page.title)}</p>`,
    `    <h1>${escapeHtml(page.projectSession.projectLabel)}</h1>`,
    `    <h2>${escapeHtml(page.projectSession.sessionLabel)}</h2>`,
    `  </header>`,
    `  <section aria-label="dialogue-thread">`,
    ...indentMarkup(
      renderDialogueMessageSurface(
        projectId,
        sessionId,
        messages,
        groundedResponse,
      ),
      "    ",
    ),
    `  </section>`,
    `</main>`,
  ].join("\n");
}

export function renderDialogueFlowPageFromGroundedReport(
  projectId: string,
  sessionId: string,
  messages: DialogueMessage[],
  report: GroundedResponseCompositionReport,
): string {
  return renderDialogueFlowPage(
    projectId,
    sessionId,
    messages,
    report.groundedResponse === undefined
      ? undefined
      : {
          response: report.groundedResponse.response,
          grounding: report.groundedResponse.grounding,
        },
  );
}

export function createDialogueMessageSurfaceFromGroundedReport(
  projectId: string,
  sessionId: string,
  messages: DialogueMessage[],
  report: GroundedResponseCompositionReport,
): DialogueMessageSurface {
  const groundedResponse =
    report.groundedResponse === undefined
      ? undefined
      : {
          response: report.groundedResponse.response,
          grounding: report.groundedResponse.grounding,
        };

  return createDialogueMessageSurface(projectId, sessionId, messages, groundedResponse);
}

export function renderDialogueMessageSurfaceFromGroundedReport(
  projectId: string,
  sessionId: string,
  messages: DialogueMessage[],
  report: GroundedResponseCompositionReport,
): string {
  const surface = createDialogueMessageSurfaceFromGroundedReport(
    projectId,
    sessionId,
    messages,
    report,
  );
  const groundedPanel =
    surface.groundedResponse !== undefined
      ? [
          `  <section aria-label="grounded-response-panel">`,
          `    <h3>Grounded response</h3>`,
          ...indentMarkup(
            renderGroundedResponseDetailsPanel(
              surface.groundedResponse.response,
              surface.groundedResponse.grounding,
            ),
            "    ",
          ),
          `  </section>`,
        ]
      : [];

  if (surface.messages.length === 0) {
    return [
      `<section data-surface="${surface.kind}" data-project-id="${escapeHtml(surface.projectId)}" data-session-id="${escapeHtml(surface.sessionId)}">`,
      `  <p>${escapeHtml(surface.title)}</p>`,
      `  <strong>${escapeHtml(surface.emptyStateTitle)}</strong>`,
      `  <p>${escapeHtml(surface.emptyStateBody)}</p>`,
      `  <textarea placeholder="${escapeHtml(surface.composerPlaceholder)}"></textarea>`,
      `  <button type="button">${escapeHtml(surface.submitLabel)}</button>`,
      ...groundedPanel,
      `</section>`,
    ].join("\n");
  }

  return [
    `<section data-surface="${surface.kind}" data-project-id="${escapeHtml(surface.projectId)}" data-session-id="${escapeHtml(surface.sessionId)}">`,
    `  <p>${escapeHtml(surface.title)}</p>`,
    `  <ol>`,
    ...surface.messages.map(
      (message) =>
        `    <li data-message-id="${escapeHtml(message.id)}" data-message-role="${escapeHtml(message.role)}"><strong>${escapeHtml(message.role)}</strong><p>${escapeHtml(message.content)}</p></li>`,
    ),
    `  </ol>`,
    ...groundedPanel,
    `  <textarea placeholder="${escapeHtml(surface.composerPlaceholder)}"></textarea>`,
    `  <button type="button">${escapeHtml(surface.submitLabel)}</button>`,
    `</section>`,
  ].join("\n");
}

export function renderProjectSessionPage(
  projectId: string,
  sessionId: string,
): string {
  const shell = createProjectSessionShell(projectId, sessionId);

  return [
    `<section data-shell="${shell.kind}" data-project-id="${escapeHtml(shell.projectId)}" data-session-id="${escapeHtml(shell.sessionId)}">`,
    `  <header>`,
    `    <p>${escapeHtml(shell.title)}</p>`,
    `    <h1>${escapeHtml(shell.projectLabel)}</h1>`,
    `    <h2>${escapeHtml(shell.sessionLabel)}</h2>`,
    `  </header>`,
    `  <section aria-label="project-session-empty-state">`,
    `    <strong>${escapeHtml(shell.emptyStateTitle)}</strong>`,
    `    <p>${escapeHtml(shell.emptyStateBody)}</p>`,
    `  </section>`,
    `  <form aria-label="prompt-input">`,
    `    <label>${escapeHtml(shell.promptLabel)}</label>`,
    `    <textarea placeholder="${escapeHtml(shell.placeholder)}"></textarea>`,
    `    <button type="button">${escapeHtml(shell.submitLabel)}</button>`,
    `  </form>`,
    `</section>`,
  ].join("\n");
}

// ============================================================================
// Response details panels
// ============================================================================

export function createStructuredResponseDetailsPanel(
  response: AvgStructuredResponse,
): StructuredResponseDetailsPanel {
  return {
    kind: "structured-response-details-panel",
    title: renderShellTitle(),
    response,
  };
}

export function renderStructuredResponseDetailsPanel(
  response: AvgStructuredResponse,
): string {
  const panel = createStructuredResponseDetailsPanel(response);
  const artifactItems =
    panel.response.artifacts?.map(
      (artifact) => `    <li>${escapeHtml(artifact)}</li>`,
    ) ?? [];
  const riskMarkerItems = panel.response.risk_markers.map(
    (riskMarker) => `    <li>${escapeHtml(riskMarker)}</li>`,
  );

  return [
    `<section data-panel="${panel.kind}" data-response-id="${escapeHtml(panel.response.id)}" data-project-id="${escapeHtml(panel.response.project_id)}" data-session-id="${escapeHtml(panel.response.session_id)}" data-message-id="${escapeHtml(panel.response.message_id)}">`,
    `  <p>${escapeHtml(panel.title)}</p>`,
    `  <h3>${escapeHtml(panel.response.summary)}</h3>`,
    `  <dl>`,
    `    <div><dt>Scope</dt><dd>${escapeHtml(panel.response.scope)}</dd></div>`,
    `    <div><dt>Claim status</dt><dd>${escapeHtml(panel.response.claim_status)}</dd></div>`,
    `    <div><dt>Language mode</dt><dd>${escapeHtml(panel.response.language_mode)}</dd></div>`,
    `    <div><dt>Validation risk</dt><dd>${escapeHtml(panel.response.validation_risk)}</dd></div>`,
    `    <div><dt>Map/territory boundary</dt><dd>${escapeHtml(panel.response.map_territory_boundary)}</dd></div>`,
    `    <div><dt>Next action</dt><dd>${escapeHtml(panel.response.next_action)}</dd></div>`,
    `  </dl>`,
    `  <section aria-label="risk-markers">`,
    `    <h4>Risk markers</h4>`,
    `    <ul>`,
    ...riskMarkerItems,
    `    </ul>`,
    `  </section>`,
    `  <section aria-label="artifacts">`,
    `    <h4>Artifacts</h4>`,
    `    <ul>`,
    ...(artifactItems.length > 0 ? artifactItems : ["    <li>None</li>"]),
    `    </ul>`,
    `  </section>`,
    `</section>`,
  ].join("\n");
}

export function createGroundedResponseDetailsPanel(
  response: AvgStructuredResponse,
  grounding: GroundedResponseBoundary,
): GroundedResponseDetailsPanel {
  return {
    kind: "grounded-response-details-panel",
    title: renderShellTitle(),
    response,
    grounding,
  };
}

export function renderGroundedResponseDetailsPanel(
  response: AvgStructuredResponse,
  grounding: GroundedResponseBoundary,
): string {
  const panel = createGroundedResponseDetailsPanel(response, grounding);
  const citationItems = panel.grounding.citations.map(
    (citation) => [
      `    <li data-citation-id="${escapeHtml(citation.id)}" data-snippet-id="${escapeHtml(citation.snippet_id)}" data-document-id="${escapeHtml(citation.document_id)}" data-relevance="${escapeHtml(citation.relevance)}">`,
      `      <strong>${escapeHtml(citation.source_label)}</strong>`,
      `      <code>${escapeHtml(citation.snippet_id)}</code>`,
      `      <p>${escapeHtml(citation.quoted_text)}</p>`,
      `    </li>`,
    ].join("\n"),
  );

  const groundedClaimItems = panel.grounding.grounded_claims.map(
    (claim) => `    <li>${escapeHtml(claim)}</li>`,
  );
  const interpretationItems = panel.grounding.interpretations.map(
    (interpretation) => `    <li>${escapeHtml(interpretation)}</li>`,
  );
  const unsupportedClaimItems = panel.grounding.unsupported_claims.map(
    (claim) => `    <li>${escapeHtml(claim)}</li>`,
  );

  return [
    `<section data-panel="${panel.kind}" data-response-id="${escapeHtml(panel.response.id)}" data-project-id="${escapeHtml(panel.response.project_id)}" data-session-id="${escapeHtml(panel.response.session_id)}" data-message-id="${escapeHtml(panel.response.message_id)}">`,
    `  <p>${escapeHtml(panel.title)}</p>`,
    `  <h3>${escapeHtml(panel.response.summary)}</h3>`,
    `  <dl>`,
    `    <div><dt>Retrieval confidence</dt><dd>${escapeHtml(panel.grounding.retrieval_confidence)}</dd></div>`,
    `    <div><dt>Boundary statement</dt><dd>${escapeHtml(panel.grounding.boundary_statement)}</dd></div>`,
    `  </dl>`,
    `  <section aria-label="citation-list">`,
    `    <h4>Citations</h4>`,
    `    <ul>`,
    ...(citationItems.length > 0 ? citationItems : ["    <li>No citations</li>"]),
    `    </ul>`,
    `  </section>`,
    `  <section aria-label="grounded-claims">`,
    `    <h4>Grounded claims</h4>`,
    `    <ul>`,
    ...(groundedClaimItems.length > 0 ? groundedClaimItems : ["    <li>None</li>"]),
    `    </ul>`,
    `  </section>`,
    `  <section aria-label="interpretations">`,
    `    <h4>Interpretations</h4>`,
    `    <ul>`,
    ...(interpretationItems.length > 0 ? interpretationItems : ["    <li>None</li>"]),
    `    </ul>`,
    `  </section>`,
    `  <section aria-label="unsupported-claims">`,
    `    <h4>Unsupported claims</h4>`,
    `    <ul>`,
    ...(unsupportedClaimItems.length > 0 ? unsupportedClaimItems : ["    <li>None</li>"]),
    `    </ul>`,
    `  </section>`,
    `</section>`,
  ].join("\n");
}

// ============================================================================
// Grounded retrieval
// ============================================================================

export function createGroundedRetrievalFlow(
  projectId: string,
  sessionId: string,
  query: string,
  retrievalHits: AvgRetrievalHit[],
  report: GroundedResponseCompositionReport,
): GroundedRetrievalFlow {
  const groundedResponse =
    report.groundedResponse === undefined
      ? undefined
      : {
          response: report.groundedResponse.response,
          grounding: report.groundedResponse.grounding,
        };
  const retrievalConfidence =
    groundedResponse?.grounding.retrieval_confidence ?? retrievalConfidenceFromHits(retrievalHits);

  return {
    kind: "grounded-retrieval-flow",
    title: renderShellTitle(),
    projectId,
    sessionId,
    query: query.trim(),
    status: retrievalHits.length === 0 || retrievalConfidence === "none" ? "missing_evidence" : "ready",
    retrievalHits: retrievalHits.map((hit) => ({ ...hit })),
    retrievalConfidence,
    boundaryStatement:
      groundedResponse?.grounding.boundary_statement ??
      "No registered snippets matched this question, so AVG cannot ground the answer in project evidence.",
    ...(groundedResponse !== undefined ? { groundedResponse } : {}),
    queryLabel: "Grounded question",
    queryPlaceholder: "Ask against registered project documents",
    submitLabel: "Ask with evidence",
  };
}

export function renderGroundedRetrievalFlow(
  projectId: string,
  sessionId: string,
  query: string,
  retrievalHits: AvgRetrievalHit[],
  report: GroundedResponseCompositionReport,
): string {
  const flow = createGroundedRetrievalFlow(
    projectId,
    sessionId,
    query,
    retrievalHits,
    report,
  );
  const hitItems = flow.retrievalHits.map((hit) =>
    [
      `    <li data-retrieval-hit="true" data-snippet-id="${escapeHtml(hit.snippet_id)}" data-citation-id="${escapeHtml(hit.citation_id)}" data-document-id="${escapeHtml(hit.document_id)}" data-confidence="${escapeHtml(hit.confidence)}" data-score="${escapeHtml(String(hit.score))}">`,
      `      <strong>${escapeHtml(hit.source_label)}</strong>`,
      `      <dl>`,
      `        <div><dt>Snippet id</dt><dd>${escapeHtml(hit.snippet_id)}</dd></div>`,
      `        <div><dt>Citation id</dt><dd>${escapeHtml(hit.citation_id)}</dd></div>`,
      `        <div><dt>Confidence</dt><dd>${escapeHtml(hit.confidence)}</dd></div>`,
      `        <div><dt>Score</dt><dd>${escapeHtml(String(hit.score))}</dd></div>`,
      `      </dl>`,
      `      <blockquote>${escapeHtml(hit.matched_text)}</blockquote>`,
      `    </li>`,
    ].join("\n"),
  );
  const groundedPanel =
    flow.groundedResponse === undefined
      ? []
      : [
          `  <section aria-label="grounded-response-panel">`,
          `    <h3>Grounded response</h3>`,
          ...indentMarkup(
            renderGroundedResponseDetailsPanel(
              flow.groundedResponse.response,
              flow.groundedResponse.grounding,
            ),
            "    ",
          ),
          `  </section>`,
        ];

  return [
    `<section data-surface="${flow.kind}" data-project-id="${escapeHtml(flow.projectId)}" data-session-id="${escapeHtml(flow.sessionId)}" data-retrieval-status="${escapeHtml(flow.status)}">`,
    `  <header>`,
    `    <p>${escapeHtml(flow.title)}</p>`,
    `    <h2>Grounded retrieval</h2>`,
    `  </header>`,
    `  <section aria-label="grounded-question">`,
    `    <label>${escapeHtml(flow.queryLabel)}</label>`,
    `    <textarea placeholder="${escapeHtml(flow.queryPlaceholder)}">${escapeHtml(flow.query)}</textarea>`,
    `    <button type="button" data-action="ask-grounded-question">${escapeHtml(flow.submitLabel)}</button>`,
    `  </section>`,
    `  <aside aria-label="retrieval-boundary" data-retrieval-confidence="${escapeHtml(flow.retrievalConfidence)}">`,
    `    <strong>Retrieval confidence is a risk signal, not proof.</strong>`,
    `    <p>${escapeHtml(flow.boundaryStatement)}</p>`,
    `  </aside>`,
    `  <section aria-label="retrieval-hits">`,
    `    <h3>Retrieval hits</h3>`,
    `    <ul>`,
    ...(hitItems.length > 0
      ? hitItems
      : ["    <li>No registered snippets matched this question.</li>"]),
    `    </ul>`,
    `  </section>`,
    ...groundedPanel,
    `</section>`,
  ].join("\n");
}
