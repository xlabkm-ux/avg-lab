import { describe, expect, it } from "vitest";
import {
  createAndSaveWorkspaceState,
  createLocalProjectRecord,
  createLocalSessionRecord,
  createLocalWorkspaceState,
  createGroundedResponseDetailsPanel,
  createGroundedRetrievalFlow,
  createDialogueMessageSurface,
  createDialogueMessageSurfaceFromGroundedReport,
  createDialogueFlowPage,
  createStructuredDialogueSurface,
  createConceptMapShell,
  createProjectSessionShell,
  createStructuredResponseDetailsPanel,
  createWorkspaceShell,
  createWorkspaceStateFromInput,
  loadWorkspaceState,
  openLocalWorkspaceProject,
  openSavedWorkspaceState,
  materializeConceptMapSnapshot,
  parseWorkspaceState,
  resetWorkspaceState,
  renderConceptMapShell,
  renderDialogueMessageSurface,
  renderDialogueMessageSurfaceFromGroundedReport,
  renderDialogueFlowPageFromGroundedReport,
  renderProjectSessionPage,
  renderWorkspaceShell,
  renderGroundedResponseDetailsPanel,
  renderGroundedRetrievalFlow,
  renderStructuredResponseDetailsPanel,
  renderStructuredDialogueSurface,
  renderShellTitle,
  selectWorkspaceSurface,
  serializeWorkspaceState,
  saveWorkspaceState,
  submitRawThoughtToStructuredDialogue,
  createDocumentRegistrationSurface,
  renderDocumentRegistrationSurface,
  estimateTokenCount,
  createClaimReviewSurface,
  renderClaimReviewSurface,
  workspaceStateStorageKey,
  type WorkspaceStoragePort,
} from "../src/index";
import { validateAvgResponse } from "@avg/schemas";
import { projectClaimToMapNode } from "@avg/graph";
import { composeGroundedResponse } from "@avg/validation";

function createMemoryStorage(): WorkspaceStoragePort & { values: Map<string, string> } {
  const values = new Map<string, string>();

  return {
    values,
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
    removeItem(key: string) {
      values.delete(key);
    },
  };
}

describe("web app smoke surface", () => {
  it("exposes a stable shell title", () => {
    expect(renderShellTitle()).toBe("AVG Codex Lab");
  });

  it("creates a minimal project/session shell", () => {
    const shell = createProjectSessionShell("project-7", "session-3");

    expect(shell).toEqual({
      kind: "project-session-shell",
      title: "AVG Codex Lab",
      projectId: "project-7",
      sessionId: "session-3",
      projectLabel: "Project project-7",
      sessionLabel: "Session session-3",
      promptLabel: "Raw idea",
      placeholder: "Enter the thought you want to shape",
      submitLabel: "Submit idea",
      emptyStateTitle: "Start a structured dialogue",
      emptyStateBody:
        "Open a project, choose a session and submit a raw thought to begin the AVG dialogue slice.",
    });
  });

  it("renders a deterministic project/session shell page", () => {
    const page = renderProjectSessionPage("project-7", "session-3");

    expect(page).toContain('data-shell="project-session-shell"');
    expect(page).toContain('data-project-id="project-7"');
    expect(page).toContain('data-session-id="session-3"');
    expect(page).toContain("Project project-7");
    expect(page).toContain("Session session-3");
    expect(page).toContain("Submit idea");
  });

  it("creates browser-local workspace state for a project and session", () => {
    const state = createLocalWorkspaceState("Research map", "First pass", {
      projectId: "project-702",
      sessionId: "session-702",
      createdAt: "2026-05-20T10:00:00.000Z",
    });

    expect(state).toEqual({
      kind: "workspace-state",
      project: {
        id: "project-702",
        title: "Research map",
        accessMode: "browser_local",
        createdAt: "2026-05-20T10:00:00.000Z",
      },
      session: {
        id: "session-702",
        projectId: "project-702",
        title: "First pass",
        createdAt: "2026-05-20T10:00:00.000Z",
      },
      selectedSurface: "dialogue",
      contractVersion: "mvp-5",
      localOnly: true,
    });
  });

  it("opens an existing local project and prevents project/session drift", () => {
    const project = createLocalProjectRecord("Claim map", {
      id: "project-claim-map",
      createdAt: "2026-05-20T10:00:00.000Z",
    });
    const session = createLocalSessionRecord(project.id, "Review session", {
      id: "session-review",
      createdAt: "2026-05-20T10:00:00.000Z",
    });

    const state = openLocalWorkspaceProject(project, session, "documents");

    expect(state.selectedSurface).toBe("documents");
    expect(state.project.id).toBe("project-claim-map");
    expect(state.session.projectId).toBe("project-claim-map");
    expect(() =>
      openLocalWorkspaceProject(
        project,
        { ...session, projectId: "other-project" },
        "dialogue",
      ),
    ).toThrow("Session project id must match the active project id.");
  });

  it("creates a workspace shell with stable navigation and local-only boundary", () => {
    const state = createLocalWorkspaceState("Boundary work", "Map pass", {
      projectId: "project-boundary",
      sessionId: "session-map",
      selectedSurface: "map",
    });
    const shell = createWorkspaceShell(state);

    expect(shell.kind).toBe("workspace-shell");
    expect(shell.localOnlyLabel).toBe("Local only");
    expect(shell.localOnlyBoundary).toContain("browser-local");
    expect(shell.technicalDetails).toEqual({
      projectId: "project-boundary",
      sessionId: "session-map",
      contractVersion: "mvp-5",
    });
    expect(shell.navigation).toEqual([
      { surface: "dialogue", label: "Dialogue", active: false },
      { surface: "documents", label: "Documents", active: false },
      { surface: "retrieval", label: "Retrieval", active: false },
      { surface: "claim-review", label: "Claim Review", active: false },
      { surface: "map", label: "Map", active: true },
      { surface: "artifacts", label: "Artifacts", active: false },
    ]);
  });

  it("selects workspace surfaces without changing project/session identity", () => {
    const state = createLocalWorkspaceState("Artifact work", "Session notes", {
      projectId: "project-artifact",
      sessionId: "session-artifact",
    });
    const nextState = selectWorkspaceSurface(state, "artifacts");

    expect(nextState.selectedSurface).toBe("artifacts");
    expect(nextState.project.id).toBe("project-artifact");
    expect(nextState.session.id).toBe("session-artifact");
  });

  it("serializes and parses local workspace state", () => {
    const state = createLocalWorkspaceState("Local persistence", "Browser session", {
      projectId: "project-local",
      sessionId: "session-local",
      selectedSurface: "documents",
    });

    expect(parseWorkspaceState(serializeWorkspaceState(state))).toEqual(state);
  });

  it("rejects serialized workspace state outside the local MVP-5 contract", () => {
    expect(() =>
      parseWorkspaceState(
        JSON.stringify({
          kind: "workspace-state",
          project: {
            id: "project-cloud",
            title: "Cloud-looking project",
            accessMode: "account",
            createdAt: "2026-05-20T10:00:00.000Z",
          },
          session: {
            id: "session-cloud",
            projectId: "project-cloud",
            title: "Cloud-looking session",
            createdAt: "2026-05-20T10:00:00.000Z",
          },
          selectedSurface: "dialogue",
          contractVersion: "mvp-5",
          localOnly: true,
        }),
      ),
    ).toThrow("Serialized workspace state does not match the MVP-5 local contract.");
  });

  it("creates, saves, opens and resets browser-local workspace state", () => {
    const storage = createMemoryStorage();
    const created = createAndSaveWorkspaceState(storage, {
      projectTitle: "Local evidence map",
      sessionTitle: "Browser pass",
      projectId: "project-local-evidence",
      sessionId: "session-browser-pass",
      createdAt: "2026-05-20T10:00:00.000Z",
    });

    expect(storage.values.has(workspaceStateStorageKey)).toBe(true);
    expect(loadWorkspaceState(storage)).toEqual(created);

    const fallback = createWorkspaceStateFromInput({
      projectTitle: "Fallback project",
      projectId: "project-fallback",
      sessionId: "session-fallback",
    });

    expect(openSavedWorkspaceState(storage, fallback)).toEqual(created);

    resetWorkspaceState(storage);

    expect(loadWorkspaceState(storage)).toBeUndefined();
    expect(openSavedWorkspaceState(storage, fallback)).toEqual(fallback);
    expect(loadWorkspaceState(storage)).toEqual(fallback);
  });

  it("clears invalid saved workspace state instead of opening cross-project drift", () => {
    const storage = createMemoryStorage();
    const state = createLocalWorkspaceState("Drift guard", "Stored pass", {
      projectId: "project-drift",
      sessionId: "session-drift",
    });

    saveWorkspaceState(storage, state);
    storage.setItem(
      workspaceStateStorageKey,
      JSON.stringify({
        ...state,
        session: { ...state.session, projectId: "other-project" },
      }),
    );

    expect(loadWorkspaceState(storage)).toBeUndefined();
    expect(storage.values.has(workspaceStateStorageKey)).toBe(false);
  });

  it("renders the MVP-5 workspace shell as the first product screen", () => {
    const state = createLocalWorkspaceState("Structured thinking", "Opening pass", {
      projectId: "project-702",
      sessionId: "session-702",
      selectedSurface: "dialogue",
    });
    const page = renderWorkspaceShell(state);

    expect(page).toContain('data-shell="workspace-shell"');
    expect(page).toContain('data-project-id="project-702"');
    expect(page).toContain('data-session-id="session-702"');
    expect(page).toContain('data-local-only="true"');
    expect(page).toContain("Local only");
    expect(page).toContain("New local project");
    expect(page).toContain("Open local project");
    expect(page).toContain("Reset local project");
    expect(page).toContain('aria-label="workspace-surfaces"');
    expect(page).toContain("Dialogue");
    expect(page).toContain("Documents");
    expect(page).toContain("Retrieval");
    expect(page).toContain("Claim Review");
    expect(page).toContain("Map");
    expect(page).toContain("Artifacts");
    expect(page).toContain('data-active-surface="dialogue"');
    expect(page).toContain("scope, status, risk and boundary");
    expect(page).toContain("Technical details");
    expect(page).toContain("mvp-5");
  });

  it("creates an empty structured dialogue surface before the first thought", () => {
    const surface = createStructuredDialogueSurface({
      projectId: "project-7",
      sessionId: "session-3",
    });

    expect(surface.kind).toBe("structured-dialogue-surface");
    expect(surface.status).toBe("empty");
    expect(surface.messages).toEqual([]);
    expect(surface.emptyStateBody).toContain("contract-shaped response");
  });

  it("keeps loading state visible after a raw thought is submitted", () => {
    const surface = createStructuredDialogueSurface({
      projectId: "project-7",
      sessionId: "session-3",
      rawThought: "Maps are useful but not reality.",
      isLoading: true,
    });

    expect(surface.status).toBe("loading");
    expect(surface.messages).toEqual([
      { id: "msg-1", role: "user", content: "Maps are useful but not reality." },
    ]);

    const rendered = renderStructuredDialogueSurface({
      projectId: "project-7",
      sessionId: "session-3",
      rawThought: "Maps are useful but not reality.",
      isLoading: true,
    });

    expect(rendered).toContain('data-dialogue-status="loading"');
    expect(rendered).toContain('aria-label="dialogue-loading"');
    expect(rendered).toContain("Structuring response");
  });

  it("submits a raw thought and renders structured response details as the assistant output", () => {
    const response = {
      id: "response-703",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-2",
      summary: "A map can guide the discussion without becoming Reality.",
      scope: "dialogue surface smoke path",
      claim_status: "working_distinction",
      language_mode: "operational_description",
      validation_risk: "medium",
      risk_markers: ["map_territory_boundary_visible"],
      map_territory_boundary: "preserved",
      next_action: "inspect the response details before extending the map",
    } as const;

    const surface = submitRawThoughtToStructuredDialogue(
      "project-7",
      "session-3",
      "Maps are useful but not reality.",
      response,
    );

    expect(surface.status).toBe("ready");
    expect(surface.messages).toEqual([
      { id: "msg-1", role: "user", content: "Maps are useful but not reality." },
      { id: "msg-2", role: "assistant", content: "Structured AVG response" },
    ]);
    expect(surface.responseDetails?.response).toEqual(response);

    const rendered = renderStructuredDialogueSurface({
      projectId: "project-7",
      sessionId: "session-3",
      rawThought: "Maps are useful but not reality.",
      response,
    });

    expect(rendered).toContain('data-surface="structured-dialogue-surface"');
    expect(rendered).toContain('data-dialogue-status="ready"');
    expect(rendered).toContain('data-panel="structured-response-details-panel"');
    expect(rendered).toContain("Claim status");
    expect(rendered).toContain("Language mode");
    expect(rendered).toContain("Validation risk");
    expect(rendered).toContain("Map/territory boundary");
    expect(rendered).toContain("map_territory_boundary_visible");
    expect(rendered).toContain("Structured AVG response");
  });

  it("fails visibly when the structured response violates the schema", () => {
    const surface = submitRawThoughtToStructuredDialogue(
      "project-7",
      "session-3",
      "Untyped output should not render as an answer.",
      {
        id: "response-invalid",
        project_id: "project-7",
        session_id: "session-3",
        message_id: "msg-2",
        summary: "Missing structured fields",
      },
    );

    expect(surface.status).toBe("error");
    expect(surface.error?.code).toBe("invalid_structured_response");
    expect(surface.error?.validation?.valid).toBe(false);
    expect(surface.error?.boundaryNotes.join(" ")).toContain("must not display invalid");

    const rendered = renderStructuredDialogueSurface({
      projectId: "project-7",
      sessionId: "session-3",
      rawThought: "Untyped output should not render as an answer.",
      response: {
        id: "response-invalid",
        project_id: "project-7",
        session_id: "session-3",
        message_id: "msg-2",
        summary: "Missing structured fields",
      },
    });

    expect(rendered).toContain('data-dialogue-status="error"');
    expect(rendered).toContain('data-error-code="invalid_structured_response"');
    expect(rendered).not.toContain('data-panel="structured-response-details-panel"');
  });

  it("fails visibly when a response belongs to a different project or session", () => {
    const response = {
      id: "response-drift",
      project_id: "other-project",
      session_id: "session-3",
      message_id: "msg-2",
      summary: "This response should not cross project boundaries.",
      scope: "dialogue drift guard",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "high",
      risk_markers: ["project_session_drift"],
      map_territory_boundary: "unclear",
      next_action: "stop rendering this response in the active dialogue",
    } as const;

    const surface = createStructuredDialogueSurface({
      projectId: "project-7",
      sessionId: "session-3",
      rawThought: "Use the active project only.",
      response,
    });

    expect(validateAvgResponse(response).valid).toBe(true);
    expect(surface.status).toBe("error");
    expect(surface.error?.code).toBe("response_project_session_mismatch");
    expect(surface.error?.boundaryNotes.join(" ")).toContain("does not match active");
  });

  it("rejects an empty raw thought before response generation", () => {
    const surface = submitRawThoughtToStructuredDialogue(
      "project-7",
      "session-3",
      "   ",
    );

    expect(surface.status).toBe("error");
    expect(surface.error?.code).toBe("empty_raw_thought");
    expect(surface.error?.boundaryNotes.join(" ")).toContain("should not enter the dialogue map");
  });

  it("renders recovered structured response details without hiding the prior error", () => {
    const recoveredFrom = {
      code: "dialogue_runtime_error" as const,
      message: "The previous local dialogue adapter call failed.",
      boundaryNotes: ["Recovered output should keep the failed boundary inspectable."],
    };
    const response = {
      id: "response-recovered",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-2",
      summary: "Recovered response preserves the map boundary.",
      scope: "dialogue recovered state",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["recovered_from_adapter_error"],
      map_territory_boundary: "preserved",
      next_action: "continue only after inspecting the recovered details",
    } as const;

    const rendered = renderStructuredDialogueSurface({
      projectId: "project-7",
      sessionId: "session-3",
      rawThought: "Recover this thought.",
      response,
      recoveredFrom,
    });

    expect(rendered).toContain('data-dialogue-status="recovered"');
    expect(rendered).toContain('aria-label="dialogue-recovered-state"');
    expect(rendered).toContain('data-recovered-from="dialogue_runtime_error"');
    expect(rendered).toContain('data-panel="structured-response-details-panel"');
  });

  it("creates a minimal dialogue message surface", () => {
    const surface = createDialogueMessageSurface("project-7", "session-3", [
      { id: "msg-1", role: "user", content: "raw thought" },
      { id: "msg-2", role: "assistant", content: "structured reply" },
    ]);

    expect(surface).toEqual({
      kind: "dialogue-message-surface",
      title: "AVG Codex Lab",
      projectId: "project-7",
      sessionId: "session-3",
      messages: [
        { id: "msg-1", role: "user", content: "raw thought" },
        { id: "msg-2", role: "assistant", content: "structured reply" },
      ],
      emptyStateTitle: "No dialogue yet",
      emptyStateBody: "Submit a raw idea to start the conversation.",
      composerPlaceholder: "Write the next thought",
      submitLabel: "Send message",
    });
  });

  it("creates a dialogue message surface with grounded payload", () => {
    const response = {
      id: "response-8",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-3",
      summary: "Grounded summary with snippet citations",
      scope: "retrieval smoke path",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["retrieval_grounded"],
      map_territory_boundary: "preserved",
      next_action: "review the cited snippets",
    } as const;
    const grounding = {
      citations: [
        {
          id: "cit_doc_001_001",
          document_id: "doc_001",
          snippet_id: "snip_doc_001_001",
          source_label: "Strategy notes",
          quoted_text: "This response keeps the distinction between map and territory clear.",
          relevance: "supporting",
        },
      ],
      grounded_claims: ["This response keeps the distinction between map and territory clear."],
      interpretations: ["AVG interprets the snippet as a retrieval boundary example."],
      unsupported_claims: ["The next action remains an inference until verified."],
      retrieval_confidence: "high",
      boundary_statement: "This answer is grounded only in registered project document snippets.",
    } as const;

    const surface = createDialogueMessageSurface(
      "project-7",
      "session-3",
      [{ id: "msg-1", role: "user", content: "raw thought" }],
      { response, grounding },
    );

    expect(surface.groundedResponse).toEqual({ response, grounding });
  });

  it("renders a deterministic dialogue message surface", () => {
    const page = renderDialogueMessageSurface("project-7", "session-3", [
      { id: "msg-1", role: "user", content: "raw thought" },
      { id: "msg-2", role: "assistant", content: "structured <reply>" },
    ]);

    expect(page).toContain('data-surface="dialogue-message-surface"');
    expect(page).toContain('data-project-id="project-7"');
    expect(page).toContain('data-session-id="session-3"');
    expect(page).toContain('data-message-id="msg-1"');
    expect(page).toContain('data-message-role="assistant"');
    expect(page).toContain("structured &lt;reply&gt;");
    expect(page).toContain("Send message");
  });

  it("renders a dialogue message surface with grounded payload inline", () => {
    const response = {
      id: "response-8",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-3",
      summary: "Grounded summary with snippet citations",
      scope: "retrieval smoke path",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["retrieval_grounded"],
      map_territory_boundary: "preserved",
      next_action: "review the cited snippets",
    } as const;
    const grounding = {
      citations: [
        {
          id: "cit_doc_001_001",
          document_id: "doc_001",
          snippet_id: "snip_doc_001_001",
          source_label: "Strategy notes",
          quoted_text: "This response keeps the distinction between map and territory clear.",
          relevance: "supporting",
        },
      ],
      grounded_claims: ["This response keeps the distinction between map and territory clear."],
      interpretations: ["AVG interprets the snippet as a retrieval boundary example."],
      unsupported_claims: ["The next action remains an inference until verified."],
      retrieval_confidence: "high",
      boundary_statement: "This answer is grounded only in registered project document snippets.",
    } as const;

    const page = renderDialogueMessageSurface(
      "project-7",
      "session-3",
      [{ id: "msg-1", role: "user", content: "raw thought" }],
      { response, grounding },
    );

    expect(page).toContain('data-panel="grounded-response-details-panel"');
    expect(page).toContain('data-citation-id="cit_doc_001_001"');
    expect(page).toContain("Grounded response");
    expect(page).toContain("This answer is grounded only in registered project document snippets.");
  });

  it("creates and renders a dialogue surface from a grounded composition report", () => {
    const response = {
      id: "response-9",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-4",
      summary: "Grounded reply composed from retrieval hits",
      scope: "report bridge",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["retrieval_grounded"],
      map_territory_boundary: "preserved",
      next_action: "review the report bridge",
    } as const;

    const report = composeGroundedResponse(response, [
      {
        snippet_id: "snip_doc_002_001",
        document_id: "doc_002",
        project_id: "project-7",
        score: 0.9,
        confidence: "high",
        citation_id: "cit_doc_002_001",
        matched_text: "The retrieval report stays grounded in snippet ids.",
        source_label: "Retrieval notes",
      },
    ]);

    expect(report.groundedResponse?.grounding.citations[0]?.snippet_id).toBe("snip_doc_002_001");

    const surface = createDialogueMessageSurfaceFromGroundedReport(
      "project-7",
      "session-3",
      [{ id: "msg-1", role: "assistant", content: "report bridge" }],
      report,
    );

    expect(surface.groundedResponse?.grounding.boundary_statement).toContain("grounded only");
    expect(renderDialogueMessageSurfaceFromGroundedReport("project-7", "session-3", [
      { id: "msg-1", role: "assistant", content: "report bridge" },
    ], report)).toContain('data-panel="grounded-response-details-panel"');
  });

  it("creates and renders a dialogue flow page from a grounded report", () => {
    const response = {
      id: "response-10",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-5",
      summary: "Flow page grounded response",
      scope: "page bridge",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["retrieval_grounded"],
      map_territory_boundary: "preserved",
      next_action: "review the full page",
    } as const;
    const report = composeGroundedResponse(response, [
      {
        snippet_id: "snip_doc_003_001",
        document_id: "doc_003",
        project_id: "project-7",
        score: 0.88,
        confidence: "high",
        citation_id: "cit_doc_003_001",
        matched_text: "The page bridge keeps the dialogue flow grounded.",
        source_label: "Page notes",
      },
    ]);

    const page = createDialogueFlowPage(
      "project-7",
      "session-3",
      [{ id: "msg-1", role: "user", content: "raw thought" }],
      report.groundedResponse
        ? {
            response: report.groundedResponse.response,
            grounding: report.groundedResponse.grounding,
          }
        : undefined,
    );

    expect(page.kind).toBe("dialogue-flow-page");
    expect(page.messageSurface.groundedResponse?.grounding.citations[0]?.snippet_id).toBe("snip_doc_003_001");

    const rendered = renderDialogueFlowPageFromGroundedReport(
      "project-7",
      "session-3",
      [{ id: "msg-1", role: "user", content: "raw thought" }],
      report,
    );

    expect(rendered).toContain('data-page="dialogue-flow-page"');
    expect(rendered).toContain('data-panel="grounded-response-details-panel"');
    expect(rendered).toContain("Project project-7");
    expect(rendered).toContain("Session session-3");
  });

  it("creates a minimal structured response details panel", () => {
    const response = {
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
      artifacts: ["session outline"],
    } as const;

    expect(validateAvgResponse(response).valid).toBe(true);
    expect(createStructuredResponseDetailsPanel(response)).toEqual({
      kind: "structured-response-details-panel",
      title: "AVG Codex Lab",
      response,
    });
  });

  it("creates a minimal concept map shell", () => {
    const shell = createConceptMapShell();

    expect(shell).toEqual({
      kind: "concept-map-shell",
      title: "AVG Codex Lab",
      subtitle: "Concept map shell",
      emptyStateTitle: "No map yet",
      emptyStateBody:
        "Pass a validated graph projection or snapshot to render the first working map.",
      snapshot: { nodes: [], edges: [] },
      nodeCount: 0,
      edgeCount: 0,
    });
  });

  it("materializes concept map snapshots from projections", () => {
    const projection = projectClaimToMapNode({
      id: "claim-7",
      statement: "Maps should keep their boundary explicit.",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      risks: ["map_territory_confusion"],
      scope: "Sprint 5 shell",
    });

    expect(materializeConceptMapSnapshot(projection)).toEqual({
      nodes: [projection.node],
      edges: projection.edges,
    });
  });

  it("renders a deterministic concept map shell", () => {
    const projection = projectClaimToMapNode({
      id: "claim-8",
      statement: "Concept maps should be React Flow ready.",
      claim_status: "working_distinction",
      language_mode: "operational_description",
      risks: ["layout_drift"],
      source_refs: ["source-1"],
      scope: "Sprint 5 shell",
    });

    const renderedEmpty = renderConceptMapShell();
    const renderedPopulated = renderConceptMapShell(projection);

    expect(renderedEmpty).toContain('data-shell="concept-map-shell"');
    expect(renderedEmpty).toContain('data-node-count="0"');
    expect(renderedEmpty).toContain("No map yet");
    expect(renderedEmpty).toContain("The map is a working projection, not Reality.");

    expect(renderedPopulated).toContain('data-shell="concept-map-shell"');
    expect(renderedPopulated).toContain('data-node-count="1"');
    expect(renderedPopulated).toContain('data-edge-count="1"');
    expect(renderedPopulated).toContain("React Flow-ready boundary");
    expect(renderedPopulated).toContain("Concept maps should be React Flow ready.");
    expect(renderedPopulated).toContain("working_distinction");
    expect(renderedPopulated).toContain("source-1");
  });

  it("renders a deterministic structured response details panel", () => {
    const page = renderStructuredResponseDetailsPanel({
      id: "response-7",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-2",
      summary: "A structured reply with explicit boundaries",
      scope: "planning a dialogue slice",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["no hidden claims", "explicit scope"],
      map_territory_boundary: "preserved",
      next_action: "continue with the next message",
      artifacts: ["session outline"],
    });

    expect(page).toContain('data-panel="structured-response-details-panel"');
    expect(page).toContain('data-response-id="response-7"');
    expect(page).toContain("A structured reply with explicit boundaries");
    expect(page).toContain("boundary_statement");
    expect(page).toContain("operational_description");
    expect(page).toContain("Map/territory boundary");
    expect(page).toContain("session outline");
  });

  it("creates and renders a grounded response citation panel", () => {
    const response = {
      id: "response-8",
      project_id: "project-7",
      session_id: "session-3",
      message_id: "msg-3",
      summary: "Grounded summary with snippet citations",
      scope: "retrieval smoke path",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["retrieval_grounded"],
      map_territory_boundary: "preserved",
      next_action: "review the cited snippets",
    } as const;
    const grounding = {
      citations: [
        {
          id: "cit_doc_001_001",
          document_id: "doc_001",
          snippet_id: "snip_doc_001_001",
          source_label: "Strategy notes",
          quoted_text: "This response keeps the distinction between map and territory clear.",
          relevance: "supporting",
        },
      ],
      grounded_claims: ["This response keeps the distinction between map and territory clear."],
      interpretations: ["AVG interprets the snippet as a retrieval boundary example."],
      unsupported_claims: ["The next action remains an inference until verified."],
      retrieval_confidence: "high",
      boundary_statement: "This answer is grounded only in registered project document snippets.",
    } as const;

    expect(createGroundedResponseDetailsPanel(response, grounding)).toEqual({
      kind: "grounded-response-details-panel",
      title: "AVG Codex Lab",
      response,
      grounding,
    });

    const page = renderGroundedResponseDetailsPanel(response, grounding);

    expect(page).toContain('data-panel="grounded-response-details-panel"');
    expect(page).toContain('data-citation-id="cit_doc_001_001"');
    expect(page).toContain('data-snippet-id="snip_doc_001_001"');
    expect(page).toContain("Grounded claims");
    expect(page).toContain("Unsupported claims");
    expect(page).toContain("This answer is grounded only in registered project document snippets.");
  });

  it("creates and renders the grounded retrieval flow with hits and citation ids", () => {
    const response = {
      id: "response-705",
      project_id: "project-705",
      session_id: "session-705",
      message_id: "msg-705",
      summary: "Grounded retrieval keeps source snippets visible.",
      scope: "AVG-705 grounded retrieval flow",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "low",
      risk_markers: ["retrieval_grounded"],
      map_territory_boundary: "preserved",
      next_action: "inspect the retrieval hits before using the answer",
    } as const;
    const hits = [
      {
        snippet_id: "snip_doc_705_001",
        document_id: "doc_705",
        project_id: "project-705",
        score: 0.91,
        confidence: "high",
        citation_id: "cit_doc_705_001",
        matched_text:
          "Prompt injection text inside a source is quoted source content only.",
        source_label: "Security notes",
      },
    ] as const;
    const report = composeGroundedResponse(response, [...hits]);

    const flow = createGroundedRetrievalFlow(
      "project-705",
      "session-705",
      "How should prompt injection text be handled?",
      [...hits],
      report,
    );

    expect(flow.status).toBe("ready");
    expect(flow.retrievalHits[0]).toMatchObject({
      snippet_id: "snip_doc_705_001",
      citation_id: "cit_doc_705_001",
      confidence: "high",
    });
    expect(flow.boundaryStatement).toContain("grounded only");

    const rendered = renderGroundedRetrievalFlow(
      "project-705",
      "session-705",
      "How should prompt injection text be handled?",
      [...hits],
      report,
    );

    expect(rendered).toContain('data-surface="grounded-retrieval-flow"');
    expect(rendered).toContain('data-retrieval-status="ready"');
    expect(rendered).toContain('data-snippet-id="snip_doc_705_001"');
    expect(rendered).toContain('data-citation-id="cit_doc_705_001"');
    expect(rendered).toContain('data-confidence="high"');
    expect(rendered).toContain("Prompt injection text inside a source");
    expect(rendered).toContain("Retrieval confidence is a risk signal, not proof.");
    expect(rendered).toContain('data-panel="grounded-response-details-panel"');
  });

  it("renders missing evidence in the grounded retrieval flow without hiding the boundary", () => {
    const response = {
      id: "response-705-none",
      project_id: "project-705",
      session_id: "session-705",
      message_id: "msg-705-none",
      summary: "No evidence should stay visibly unsupported.",
      scope: "AVG-705 missing evidence path",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "high",
      risk_markers: ["missing_evidence"],
      map_territory_boundary: "preserved",
      next_action: "register relevant documents before grounding this answer",
    } as const;
    const report = composeGroundedResponse(response, []);
    const rendered = renderGroundedRetrievalFlow(
      "project-705",
      "session-705",
      "What evidence exists?",
      [],
      report,
    );

    expect(rendered).toContain('data-retrieval-status="missing_evidence"');
    expect(rendered).toContain('data-retrieval-confidence="none"');
    expect(rendered).toContain("No registered snippets matched this question.");
    expect(rendered).toContain("unsupported working map");
    expect(rendered).toContain("Unsupported claims");
  });
});

describe("document registration surface (AVG-704)", () => {
  it("creates an empty document registration surface", () => {
    const surface = createDocumentRegistrationSurface({
      projectId: "project-704",
    });

    expect(surface.kind).toBe("document-registration-surface");
    expect(surface.projectId).toBe("project-704");
    expect(surface.status).toBe("empty");
    expect(surface.documents).toEqual([]);
    expect(surface.formLabel).toBe("Register document");
    expect(surface.titleLabel).toBe("Document title");
    expect(surface.submitLabel).toBe("Register document");
  });

  it("creates a document registration surface with registered documents", () => {
    const mockDocuments = [
      {
        document: {
          id: "doc_001",
          project_id: "project-704",
          title: "Test Document",
          source_kind: "text" as const,
          created_at: "2026-05-21T00:00:00Z",
        },
        snippet_count: 3,
        token_estimate: 250,
      },
    ];

    const surface = createDocumentRegistrationSurface({
      projectId: "project-704",
      documents: mockDocuments,
    });

    expect(surface.status).toBe("registered");
    expect(surface.documents).toHaveLength(1);
    expect(surface.documents[0].document.id).toBe("doc_001");
    expect(surface.documents[0].snippet_count).toBe(3);
  });

  it("creates a document registration surface with error state", () => {
    const surface = createDocumentRegistrationSurface({
      projectId: "project-704",
      error: {
        code: "missing_title",
        message: "Document title is required",
      },
    });

    expect(surface.status).toBe("error");
    expect(surface.error?.code).toBe("missing_title");
    expect(surface.error?.message).toBe("Document title is required");
  });

  it("creates a document registration surface with loading state", () => {
    const surface = createDocumentRegistrationSurface({
      projectId: "project-704",
      isLoading: true,
    });

    expect(surface.status).toBe("loading");
  });

  it("renders empty document registration surface HTML", () => {
    const surface = createDocumentRegistrationSurface({
      projectId: "project-704",
    });

    const rendered = renderDocumentRegistrationSurface(surface);

    expect(rendered).toContain('data-surface="document-registration-surface"');
    expect(rendered).toContain('data-project-id="project-704"');
    expect(rendered).toContain('data-status="empty"');
    expect(rendered).toContain("Register document");
    expect(rendered).toContain('id="doc-title"');
    expect(rendered).toContain('id="doc-source-kind"');
    expect(rendered).toContain('id="doc-text"');
    expect(rendered).toContain("No local documents");
  });

  it("renders document registration surface with registered documents", () => {
    const mockDocuments = [
      {
        document: {
          id: "doc_001",
          project_id: "project-704",
          title: "AVG Architecture Guide",
          source_kind: "markdown" as const,
          created_at: "2026-05-21T00:00:00Z",
        },
        snippet_count: 5,
        token_estimate: 1200,
      },
    ];

    const surface = createDocumentRegistrationSurface({
      projectId: "project-704",
      documents: mockDocuments,
    });

    const rendered = renderDocumentRegistrationSurface(surface);

    expect(rendered).toContain('data-status="registered"');
    expect(rendered).toContain("AVG Architecture Guide");
    expect(rendered).toContain('data-document-id="doc_001"');
    expect(rendered).toContain("<dd>markdown</dd>");
    expect(rendered).toContain("<dd>5</dd>"); // snippet count
    expect(rendered).toContain("<dd>1200</dd>"); // token estimate
  });

  it("renders document registration error state", () => {
    const surface = createDocumentRegistrationSurface({
      projectId: "project-704",
      error: {
        code: "registration_failed",
        message: "Failed to register document",
        details: "Database connection error",
      },
    });

    const rendered = renderDocumentRegistrationSurface(surface);

    expect(rendered).toContain('data-error-code="registration_failed"');
    expect(rendered).toContain("Failed to register document");
    expect(rendered).toContain("Database connection error");
  });

  it("renders all source kind options in the form", () => {
    const surface = createDocumentRegistrationSurface({
      projectId: "project-704",
    });

    const rendered = renderDocumentRegistrationSurface(surface);

    expect(rendered).toContain('<option value="text">Plain text</option>');
    expect(rendered).toContain('<option value="markdown">Markdown</option>');
    expect(rendered).toContain('<option value="pdf">PDF (text extraction)</option>');
    expect(rendered).toContain('<option value="web">Web page</option>');
  });

  it("estimates token count correctly", () => {
    // Rough estimate: ~4 characters per token
    expect(estimateTokenCount("Hello world")).toBe(3); // 11 chars / 4 = 2.75 -> 3
    expect(estimateTokenCount("Test")).toBe(1); // 4 chars / 4 = 1
    expect(estimateTokenCount("   ")).toBe(0); // whitespace trimmed
    expect(estimateTokenCount("A".repeat(100))).toBe(25); // 100 chars / 4 = 25
  });

  it("includes required attributes on form fields", () => {
    const surface = createDocumentRegistrationSurface({
      projectId: "project-704",
    });

    const rendered = renderDocumentRegistrationSurface(surface);

    expect(rendered).toContain('required />'); // title field
    expect(rendered).toMatch(/textarea[^>]*required/); // text field
    expect(rendered).toContain('method="post"');
    expect(rendered).toContain('data-action="register-document"');
  });

  it("renders workspace shell with documents surface selected", () => {
    const state = createLocalWorkspaceState("Test Project", "Test Session", {
      selectedSurface: "documents",
    });

    const rendered = renderWorkspaceShell(state);

    expect(rendered).toContain('data-active-surface="documents"');
    expect(rendered).toContain("document-registration-surface");
    expect(rendered).toContain("Register document");
  });
});

describe("grounded retrieval flow UI (AVG-705)", () => {
  it("creates grounded retrieval flow with empty query", () => {
    const response = {
      id: "response-705-empty",
      project_id: "project-705",
      session_id: "session-705",
      message_id: "msg-705-empty",
      summary: "No query submitted",
      scope: "AVG-705 grounded retrieval",
      claim_status: "boundary_statement" as const,
      language_mode: "operational_description" as const,
      validation_risk: "high" as const,
      risk_markers: ["no_query"],
      map_territory_boundary: "preserved" as const,
      next_action: "enter a question to search documents",
    };

    const report = composeGroundedResponse(response, []);
    const flow = createGroundedRetrievalFlow(
      "project-705",
      "session-705",
      "",
      [],
      report,
    );

    expect(flow.kind).toBe("grounded-retrieval-flow");
    expect(flow.projectId).toBe("project-705");
    expect(flow.sessionId).toBe("session-705");
    expect(flow.status).toBe("missing_evidence");
    expect(flow.retrievalHits).toEqual([]);
    expect(flow.retrievalConfidence).toBe("none");
  });

  it("creates grounded retrieval flow with hits", () => {
    const response = {
      id: "response-705-hits",
      project_id: "project-705",
      session_id: "session-705",
      message_id: "msg-705-hits",
      summary: "Evidence found",
      scope: "AVG-705 grounded retrieval",
      claim_status: "working_distinction" as const,
      language_mode: "factual_reporting" as const,
      validation_risk: "low" as const,
      risk_markers: [],
      map_territory_boundary: "preserved" as const,
      next_action: "review citations",
    };

    const mockHits = [
      {
        snippet_id: "snip_001",
        document_id: "doc_001",
        project_id: "project-705",
        score: 0.85,
        confidence: "high" as const,
        citation_id: "cit_001",
        matched_text: "Test evidence text",
        source_label: "Test Document",
      },
    ];

    const report = composeGroundedResponse(response, mockHits);
    const flow = createGroundedRetrievalFlow(
      "project-705",
      "session-705",
      "What is the evidence?",
      mockHits,
      report,
    );

    expect(flow.status).toBe("ready");
    expect(flow.retrievalHits).toHaveLength(1);
    expect(flow.retrievalConfidence).toBe("high");
    expect(flow.query).toBe("What is the evidence?");
  });

  it("renders grounded retrieval flow HTML with empty state", () => {
    const response = {
      id: "response-705-render-empty",
      project_id: "project-705",
      session_id: "session-705",
      message_id: "msg-705-render-empty",
      summary: "No evidence",
      scope: "AVG-705 grounded retrieval",
      claim_status: "boundary_statement" as const,
      language_mode: "operational_description" as const,
      validation_risk: "high" as const,
      risk_markers: ["no_query"],
      map_territory_boundary: "preserved" as const,
      next_action: "register documents first",
    };

    const report = composeGroundedResponse(response, []);
    const rendered = renderGroundedRetrievalFlow(
      "project-705",
      "session-705",
      "",
      [],
      report,
    );

    expect(rendered).toContain('data-surface="grounded-retrieval-flow"');
    expect(rendered).toContain('data-project-id="project-705"');
    expect(rendered).toContain('data-session-id="session-705"');
    expect(rendered).toContain('data-retrieval-status="missing_evidence"');
    expect(rendered).toContain("Grounded retrieval");
    expect(rendered).toContain("Ask against registered project documents");
    expect(rendered).toContain("Retrieval confidence is a risk signal, not proof.");
    expect(rendered).toContain("No registered snippets matched this question.");
  });

  it("renders grounded retrieval flow HTML with hits", () => {
    const response = {
      id: "response-705-render-hits",
      project_id: "project-705",
      session_id: "session-705",
      message_id: "msg-705-render-hits",
      summary: "Evidence found",
      scope: "AVG-705 grounded retrieval",
      claim_status: "working_distinction" as const,
      language_mode: "factual_reporting" as const,
      validation_risk: "low" as const,
      risk_markers: [],
      map_territory_boundary: "preserved" as const,
      next_action: "review citations",
    };

    const mockHits = [
      {
        snippet_id: "snip_705_001",
        document_id: "doc_705_001",
        project_id: "project-705",
        score: 0.92,
        confidence: "high" as const,
        citation_id: "cit_705_001",
        matched_text: "Important evidence content",
        source_label: "Evidence Document",
      },
    ];

    const report = composeGroundedResponse(response, mockHits);
    const rendered = renderGroundedRetrievalFlow(
      "project-705",
      "session-705",
      "Show me evidence",
      mockHits,
      report,
    );

    expect(rendered).toContain('data-retrieval-status="ready"');
    expect(rendered).toContain('data-snippet-id="snip_705_001"');
    expect(rendered).toContain('data-citation-id="cit_705_001"');
    expect(rendered).toContain('data-document-id="doc_705_001"');
    expect(rendered).toContain('data-confidence="high"');
    expect(rendered).toContain("Important evidence content");
    expect(rendered).toContain("Evidence Document");
  });

  it("renders retrieval boundary with confidence warning", () => {
    const response = {
      id: "response-705-boundary",
      project_id: "project-705",
      session_id: "session-705",
      message_id: "msg-705-boundary",
      summary: "Low confidence result",
      scope: "AVG-705 grounded retrieval",
      claim_status: "hypothesis" as const,
      language_mode: "speculative_exploration" as const,
      validation_risk: "medium" as const,
      risk_markers: ["low_confidence"],
      map_territory_boundary: "preserved" as const,
      next_action: "verify with additional sources",
    };

    const mockHits = [
      {
        snippet_id: "snip_705_low",
        document_id: "doc_705_low",
        project_id: "project-705",
        score: 0.3,
        confidence: "low" as const,
        citation_id: "cit_705_low",
        matched_text: "Weakly matching text",
        source_label: "Marginal Document",
      },
    ];

    const report = composeGroundedResponse(response, mockHits);
    const rendered = renderGroundedRetrievalFlow(
      "project-705",
      "session-705",
      "Uncertain query",
      mockHits,
      report,
    );

    expect(rendered).toContain('data-retrieval-confidence="low"');
    expect(rendered).toContain("Retrieval confidence is a risk signal, not proof.");
  });

  it("includes query input and submit button in rendered HTML", () => {
    const response = {
      id: "response-705-form",
      project_id: "project-705",
      session_id: "session-705",
      message_id: "msg-705-form",
      summary: "Form test",
      scope: "AVG-705",
      claim_status: "boundary_statement" as const,
      language_mode: "operational_description" as const,
      validation_risk: "high" as const,
      risk_markers: [],
      map_territory_boundary: "preserved" as const,
      next_action: "test form",
    };

    const report = composeGroundedResponse(response, []);
    const rendered = renderGroundedRetrievalFlow(
      "project-705",
      "session-705",
      "Test query",
      [],
      report,
    );

    expect(rendered).toContain("Grounded question");
    expect(rendered).toContain("Ask with evidence");
    expect(rendered).toContain('data-action="ask-grounded-question"');
  });

  it("renders workspace shell with retrieval surface selected", () => {
    const state = createLocalWorkspaceState("Test Project", "Test Session", {
      selectedSurface: "retrieval",
    });

    const rendered = renderWorkspaceShell(state);

    expect(rendered).toContain('data-active-surface="retrieval"');
    expect(rendered).toContain("grounded-retrieval-flow");
    expect(rendered).toContain("Grounded retrieval");
  });
});

describe("claim review panel UI (AVG-706)", () => {
  it("creates empty claim review surface", () => {
    const surface = createClaimReviewSurface({
      projectId: "project-706",
      sessionId: "session-706",
    });

    expect(surface.kind).toBe("claim-review-surface");
    expect(surface.projectId).toBe("project-706");
    expect(surface.sessionId).toBe("session-706");
    expect(surface.status).toBe("empty");
    expect(surface.claims).toEqual([]);
    expect(surface.panelTitle).toBe("Claim Review Panel");
  });

  it("creates claim review surface with validated claims", () => {
    const mockClaims = [
      {
        id: "claim_001",
        statement: "AVG preserves claim status taxonomy",
        claim_status: "working_distinction" as const,
        language_mode: "factual_reporting" as any,
        scope: "AVG-706 validation",
        risks: [],
      },
    ];

    const surface = createClaimReviewSurface({
      projectId: "project-706",
      sessionId: "session-706",
      claims: mockClaims,
    });

    expect(surface.status).toBe("validated");
    expect(surface.claims).toHaveLength(1);
    expect(surface.claims[0].id).toBe("claim_001");
  });

  it("creates claim review surface with risky claims needing repair", () => {
    const mockClaims = [
      {
        id: "claim_002",
        statement: "This is a metaphor presented as fact",
        claim_status: "metaphor_only" as const,
        language_mode: "metaphor" as any,
        risks: ["pseudo_depth", "metaphor_as_fact"],
        repair: "Reclassify as metaphor and add boundary statement",
      },
    ];

    const surface = createClaimReviewSurface({
      projectId: "project-706",
      sessionId: "session-706",
      claims: mockClaims,
    });

    expect(surface.status).toBe("needs_repair");
  });

  it("creates claim review surface with loading state", () => {
    const surface = createClaimReviewSurface({
      projectId: "project-706",
      sessionId: "session-706",
      isLoading: true,
    });

    expect(surface.status).toBe("reviewing");
  });

  it("renders empty claim review surface HTML", () => {
    const surface = createClaimReviewSurface({
      projectId: "project-706",
      sessionId: "session-706",
    });

    const rendered = renderClaimReviewSurface(surface);

    expect(rendered).toContain('data-surface="claim-review-surface"');
    expect(rendered).toContain('data-project-id="project-706"');
    expect(rendered).toContain('data-session-id="session-706"');
    expect(rendered).toContain('data-status="empty"');
    expect(rendered).toContain("Claim Review Panel");
    expect(rendered).toContain("No claims to inspect");
  });

  it("renders claim review surface with claims", () => {
    const mockClaims = [
      {
        id: "claim_706_001",
        statement: "Epistemic discipline prevents fairy tales",
        claim_status: "working_distinction" as const,
        language_mode: "operational_description" as any,
        scope: "AVG core principle",
        risks: [],
        source_refs: ["doc_architecture", "adr_001"],
      },
    ];

    const surface = createClaimReviewSurface({
      projectId: "project-706",
      sessionId: "session-706",
      claims: mockClaims,
    });

    const rendered = renderClaimReviewSurface(surface);

    expect(rendered).toContain('data-status="validated"');
    expect(rendered).toContain("Epistemic discipline prevents fairy tales");
    expect(rendered).toContain('data-claim-id="claim_706_001"');
    expect(rendered).toContain('data-claim-status="working_distinction"');
    expect(rendered).toContain("Working Distinction");
    expect(rendered).toContain("Operational Description");
    expect(rendered).toContain("AVG core principle");
    expect(rendered).toContain("doc_architecture, adr_001");
  });

  it("renders claim with risks and repair suggestion", () => {
    const mockClaims = [
      {
        id: "claim_706_risky",
        statement: "Reality can be fully captured in models",
        claim_status: "prohibited_positive_claim" as const,
        language_mode: "direct_description" as any,
        risks: ["map_territory_confusion", "overclaim"],
        repair: "Convert to boundary statement: 'Models are working maps, not Reality'",
      },
    ];

    const surface = createClaimReviewSurface({
      projectId: "project-706",
      sessionId: "session-706",
      claims: mockClaims,
    });

    const rendered = renderClaimReviewSurface(surface);

    expect(rendered).toContain('data-status="needs_repair"');
    expect(rendered).toContain('data-claim-status="prohibited_positive_claim"');
    expect(rendered).toContain("Prohibited Positive Claim");
    expect(rendered).toContain("map_territory_confusion");
    expect(rendered).toContain("overclaim");
    expect(rendered).toContain("Convert to boundary statement");
  });

  it("renders all claim status labels correctly", () => {
    const statuses = [
      "definition",
      "working_distinction",
      "hypothesis",
      "metaphor_only",
      "boundary_statement",
    ] as const;

    statuses.forEach((status) => {
      const surface = createClaimReviewSurface({
        projectId: "project-706",
        sessionId: "session-706",
        claims: [
          {
            id: `claim_${status}`,
            statement: `Test ${status}`,
            claim_status: status,
            language_mode: "operational_description" as any,
            risks: [],
          },
        ],
      });

      const rendered = renderClaimReviewSurface(surface);
      expect(rendered).toContain(status.replace("_", " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));
    });
  });

  it("includes claim count in section header", () => {
    const mockClaims = [
      {
        id: "claim_1",
        statement: "First claim",
        claim_status: "definition" as const,
        language_mode: "direct_description" as any,
        risks: [],
      },
      {
        id: "claim_2",
        statement: "Second claim",
        claim_status: "hypothesis" as const,
        language_mode: "conditional_description" as any,
        risks: [],
      },
    ];

    const surface = createClaimReviewSurface({
      projectId: "project-706",
      sessionId: "session-706",
      claims: mockClaims,
    });

    const rendered = renderClaimReviewSurface(surface);

    expect(rendered).toContain("Claims (2)");
  });

  it("renders workspace shell with claim-review surface selected", () => {
    const state = createLocalWorkspaceState("Test Project", "Test Session", {
      selectedSurface: "claim-review",
    });

    const rendered = renderWorkspaceShell(state);

    expect(rendered).toContain('data-active-surface="claim-review"');
    expect(rendered).toContain("claim-review-surface");
    expect(rendered).toContain("Claim Review Panel");
  });
});
