# apps/web

Minimal web dialogue shell for Sprint 2.

## Current Surface

- `renderShellTitle()` returns the stable app title.
- `createLocalProjectRecord(title, options?)` creates a browser-local project record.
- `createLocalSessionRecord(projectId, title, options?)` creates a browser-local session record.
- `createLocalWorkspaceState(projectTitle, sessionTitle?, options?)` creates the active MVP-5 workspace state.
- `createWorkspaceStateFromInput(input)` normalizes project/session form input into a browser-local MVP-5 workspace state.
- `openLocalWorkspaceProject(project, session, selectedSurface?)` opens an existing local project/session pair and rejects project/session drift.
- `selectWorkspaceSurface(state, selectedSurface)` changes the active workspace surface without changing project/session identity.
- `serializeWorkspaceState(state)` and `parseWorkspaceState(serialized)` provide the browser-local persistence boundary.
- `saveWorkspaceState(storage, state)`, `loadWorkspaceState(storage)`, `resetWorkspaceState(storage)`, `createAndSaveWorkspaceState(storage, input)` and `openSavedWorkspaceState(storage, fallback)` wire the shell to browser `localStorage` or a compatible test adapter.
- `createWorkspaceShell(state)` builds the MVP-5 workspace shell view model.
- `renderWorkspaceShell(state)` renders the first-screen workspace shell with local-only status, navigation and compact technical details.
- `createProjectSessionShell(projectId, sessionId)` builds the minimal project/session view model.
- `renderProjectSessionPage(projectId, sessionId)` renders a deterministic HTML shell for smoke tests and later UI wiring.
- `createDialogueMessageSurface(projectId, sessionId, messages, groundedResponse?)` builds the minimal message-thread view model and can carry a real grounded response payload.
- `renderDialogueMessageSurface(projectId, sessionId, messages, groundedResponse?)` renders a deterministic HTML message thread with explicit empty and populated states, plus an inline grounded panel when payload is present.
- `createDialogueMessageSurfaceFromGroundedReport(projectId, sessionId, messages, report)` builds the message-thread view model from a grounded composition report.
- `renderDialogueMessageSurfaceFromGroundedReport(projectId, sessionId, messages, report)` renders the dialogue surface directly from a grounded composition report.
- `createStructuredDialogueSurface(input)` builds the MVP-5 dialogue state model for empty, loading, ready, error and recovered structured-response states.
- `submitRawThoughtToStructuredDialogue(projectId, sessionId, rawThought, response?)` normalizes a user thought and fails visibly for empty input or invalid structured output.
- `renderStructuredDialogueSurface(input)` renders the composer, dialogue thread, fail-visible validation errors and inspectable structured response details without turning the assistant output into plain prose.
- `createDialogueFlowPage(projectId, sessionId, messages, groundedResponse?)` builds the full dialogue page shell and surface composition.
- `renderDialogueFlowPage(projectId, sessionId, messages, groundedResponse?)` renders the full page with project/session framing and the dialogue surface.
- `renderDialogueFlowPageFromGroundedReport(projectId, sessionId, messages, report)` renders the full page from a grounded composition report.
- `createStructuredResponseDetailsPanel(response)` builds a contract-shaped response details view model.
- `renderStructuredResponseDetailsPanel(response)` renders the structured response summary, contract fields, risk markers and artifacts.
- `createGroundedResponseDetailsPanel(response, grounding)` builds the citation panel view model for grounded answers.
- `renderGroundedResponseDetailsPanel(response, grounding)` renders citations, grounded claims, interpretations, unsupported claims and the boundary statement.
- `createGroundedRetrievalFlow(projectId, sessionId, query, retrievalHits, report)` builds the AVG-705 grounded retrieval flow with query, retrieval hits, snippet ids, citation ids, matched text, confidence and grounded response boundary.
- `renderGroundedRetrievalFlow(projectId, sessionId, query, retrievalHits, report)` renders the AVG-705 retrieval flow and keeps missing evidence visible instead of hiding it behind a fluent answer.
- `createConceptMapShell(source)` builds the React Flow-ready concept map shell from a graph snapshot or projection.
- `renderConceptMapShell(source)` renders an explicit empty or populated concept map surface with map/territory boundary copy.

## Usage Notes

The package intentionally stays framework-free for the first web slice. It gives the repo a stable user-facing shell without inventing extra state or hidden contracts.

## Example Flow

```ts
import {
  createLocalWorkspaceState,
  renderGroundedResponseDetailsPanel,
  renderConceptMapShell,
  renderDialogueMessageSurface,
  renderDialogueMessageSurfaceFromGroundedReport,
  renderDialogueFlowPageFromGroundedReport,
  renderProjectSessionPage,
  renderStructuredDialogueSurface,
  renderStructuredResponseDetailsPanel,
  renderWorkspaceShell,
  submitRawThoughtToStructuredDialogue,
} from "@avg/web";

const workspace = renderWorkspaceShell(
  createLocalWorkspaceState("Research project", "Opening session", {
    projectId: "project-7",
    sessionId: "session-3",
  }),
);
const shell = renderProjectSessionPage("project-7", "session-3");
const messages = renderDialogueMessageSurface("project-7", "session-3", [
  { id: "msg-1", role: "user", content: "raw thought" },
  { id: "msg-2", role: "assistant", content: "structured reply" },
], {
  response: {
    id: "response-7",
    project_id: "project-7",
    session_id: "session-3",
    message_id: "msg-2",
    summary: "A grounded reply with explicit boundaries",
    scope: "planning a dialogue slice",
    claim_status: "boundary_statement",
    language_mode: "operational_description",
    validation_risk: "low",
    risk_markers: ["no hidden claims"],
    map_territory_boundary: "preserved",
    next_action: "continue with the next message",
  },
  grounding: {
    citations: [
      {
        id: "cit_doc_001_001",
        document_id: "doc_001",
        snippet_id: "snip_doc_001_001",
        source_label: "Strategy notes",
        quoted_text: "Document text that supports the reply.",
        relevance: "supporting",
      },
    ],
    grounded_claims: ["Document text that supports the reply."],
    interpretations: ["AVG interprets the citation as support, not proof."],
    unsupported_claims: [],
    retrieval_confidence: "high",
    boundary_statement: "This answer is grounded only in registered project document snippets.",
  },
});
const reportDrivenMessages = renderDialogueMessageSurfaceFromGroundedReport(
  "project-7",
  "session-3",
  [
    { id: "msg-1", role: "user", content: "raw thought" },
    { id: "msg-2", role: "assistant", content: "structured reply" },
  ],
  {
    response: {
      id: "response-7",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-2",
      summary: "A grounded reply with explicit boundaries",
      scope: "planning a dialogue slice",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["no hidden claims"],
      map_territory_boundary: "preserved",
      next_action: "continue with the next message",
    },
    grounding: {
      citations: [
        {
          id: "cit_doc_001_001",
          document_id: "doc_001",
          snippet_id: "snip_doc_001_001",
          source_label: "Strategy notes",
          quoted_text: "Document text that supports the reply.",
          relevance: "supporting",
        },
      ],
      grounded_claims: ["Document text that supports the reply."],
      interpretations: ["AVG interprets the citation as support, not proof."],
      unsupported_claims: [],
      retrieval_confidence: "high",
      boundary_statement: "This answer is grounded only in registered project document snippets.",
    },
  },
);
const structuredDialogue = renderStructuredDialogueSurface(
  submitRawThoughtToStructuredDialogue("project-7", "session-3", "raw thought", {
    id: "response-7",
    project_id: "project-7",
    session_id: "session-3",
    message_id: "msg-2",
    summary: "A structured reply with explicit boundaries",
    scope: "planning a dialogue slice",
    claim_status: "boundary_statement",
    language_mode: "operational_description",
    validation_risk: "low",
    risk_markers: ["no hidden claims"],
    map_territory_boundary: "preserved",
    next_action: "continue with the next message",
  }),
);
const flowPage = renderDialogueFlowPageFromGroundedReport(
  "project-7",
  "session-3",
  [
    { id: "msg-1", role: "user", content: "raw thought" },
    { id: "msg-2", role: "assistant", content: "structured reply" },
  ],
  {
    response: {
      id: "response-7",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-2",
      summary: "A grounded reply with explicit boundaries",
      scope: "planning a dialogue slice",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["no hidden claims"],
      map_territory_boundary: "preserved",
      next_action: "continue with the next message",
    },
    grounding: {
      citations: [
        {
          id: "cit_doc_001_001",
          document_id: "doc_001",
          snippet_id: "snip_doc_001_001",
          source_label: "Strategy notes",
          quoted_text: "Document text that supports the reply.",
          relevance: "supporting",
        },
      ],
      grounded_claims: ["Document text that supports the reply."],
      interpretations: ["AVG interprets the citation as support, not proof."],
      unsupported_claims: [],
      retrieval_confidence: "high",
      boundary_statement: "This answer is grounded only in registered project document snippets.",
    },
  },
);
const details = renderStructuredResponseDetailsPanel({
  id: "response-7",
  project_id: "project-7",
  session_id: "session-3",
  message_id: "msg-2",
  summary: "A structured reply with explicit boundaries",
  scope: "planning a dialogue slice",
  claim_status: "boundary_statement",
  language_mode: "operational_description",
  validation_risk: "low",
  risk_markers: ["no hidden claims"],
  map_territory_boundary: "preserved",
  next_action: "continue with the next message",
});
const grounded = renderGroundedResponseDetailsPanel(
  {
    id: "response-7",
    project_id: "project-7",
    session_id: "session-3",
    message_id: "msg-2",
    summary: "A grounded reply with explicit boundaries",
    scope: "planning a dialogue slice",
    claim_status: "boundary_statement",
    language_mode: "operational_description",
    validation_risk: "low",
    risk_markers: ["no hidden claims"],
    map_territory_boundary: "preserved",
    next_action: "continue with the next message",
  },
  {
    citations: [
      {
        id: "cit_doc_001_001",
        document_id: "doc_001",
        snippet_id: "snip_doc_001_001",
        source_label: "Strategy notes",
        quoted_text: "Document text that supports the reply.",
        relevance: "supporting",
      },
    ],
    grounded_claims: ["Document text that supports the reply."],
    interpretations: ["AVG interprets the citation as support, not proof."],
    unsupported_claims: [],
    retrieval_confidence: "high",
    boundary_statement: "This answer is grounded only in registered project document snippets.",
  },
);
const conceptMap = renderConceptMapShell();
```

The concept map shell keeps the boundary explicit and treats the graph as a working map, not Reality.
The workspace shell keeps project/session state browser-local and labels that boundary instead of implying accounts, shared workspace or production persistence.
The grounded response panel keeps citations explicit and separates supported claims from interpretation and unsupported content.
The dialogue surface can inline the grounded response payload so the same real grounded object that comes from the API is visible alongside the dialogue thread.
The structured dialogue surface treats invalid assistant output as a visible schema or boundary error instead of rendering it as normal prose.
The report-driven helper keeps the web flow aligned with grounded composition output rather than with ad hoc local panel assembly.
The flow page helper composes the shell and dialogue surface into a single page-level HTML artifact.

## Document Workspace Flow

The AVG-704 document workspace contract is documented in `../../docs/05-ui-ux/document-workspace-registration-flow.md`.

The Documents surface must use the active workspace project id, register local text-like sources through the frozen API boundary, and show returned document ids plus generated snippet ids without implying global knowledge, production persistence or cross-project access.

## Grounded Retrieval Flow

The AVG-705 retrieval surface accepts an active project/session, a grounded question, deterministic retrieval hits and a grounded composition report. It renders the hits before or alongside the grounded response, including snippet ids, citation ids, matched source text, source labels, scores and confidence.

Retrieval confidence is labeled as a risk signal, not proof. Missing evidence renders a visible boundary statement and keeps unsupported claims inspectable.
