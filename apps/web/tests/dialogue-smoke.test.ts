import { describe, expect, it } from "vitest";
import { validateAvgResponse } from "@avg/schemas";
import {
  createLocalWorkspaceState,
  renderConceptMapShell,
  renderDialogueMessageSurface,
  renderDialogueFlowPageFromGroundedReport,
  renderDialogueMessageSurfaceFromGroundedReport,
  renderProjectSessionPage,
  renderStructuredResponseDetailsPanel,
  renderWorkspaceShell,
} from "../src/index";
import { composeGroundedResponse } from "@avg/validation";

describe("first dialogue smoke path", () => {
  it("renders the minimal web dialogue flow end to end", () => {
    const workspace = renderWorkspaceShell(
      createLocalWorkspaceState("Smoke project", "Smoke session", {
        projectId: "project-7",
        sessionId: "session-3",
      }),
    );
    const shell = renderProjectSessionPage("project-7", "session-3");
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
      risk_markers: ["no hidden claims", "explicit scope"],
      map_territory_boundary: "preserved",
      next_action: "continue with the next message",
      artifacts: ["session outline"],
    } as const;
    const report = composeGroundedResponse(response, [
      {
        snippet_id: "snip_doc_001_001",
        document_id: "doc_001",
        project_id: "project-7",
        score: 0.92,
        confidence: "high",
        citation_id: "cit_doc_001_001",
        matched_text: "This response keeps the distinction between map and territory clear.",
        source_label: "Strategy notes",
      },
    ]);
    const messageSurface = renderDialogueMessageSurfaceFromGroundedReport(
      "project-7",
      "session-3",
      [
        { id: "msg-1", role: "user", content: "raw thought" },
        { id: "msg-2", role: "assistant", content: "structured reply" },
      ],
      report,
    );
    const details = renderStructuredResponseDetailsPanel(response);
    const conceptMap = renderConceptMapShell();

    expect(validateAvgResponse(response).valid).toBe(true);
    expect(workspace).toContain('data-shell="workspace-shell"');
    expect(workspace).toContain("Local only");
    expect(workspace).toContain("Dialogue");
    expect(workspace).toContain("Documents");
    expect(workspace).toContain("Map");
    expect(workspace).toContain("Artifacts");
    expect(shell).toContain('data-shell="project-session-shell"');
    expect(messageSurface).toContain('data-surface="dialogue-message-surface"');
    expect(details).toContain('data-panel="structured-response-details-panel"');
    expect(messageSurface).toContain('data-panel="grounded-response-details-panel"');
    expect(messageSurface).toContain('data-citation-id="cit_doc_001_001"');
    expect(conceptMap).toContain('data-shell="concept-map-shell"');
    expect(shell).toContain("Project project-7");
    expect(messageSurface).toContain("raw thought");
    expect(messageSurface).toContain("structured reply");
    expect(details).toContain("A structured reply with explicit boundaries");
    expect(messageSurface).toContain("This answer is grounded only in registered project document snippets.");

    const flowPage = renderDialogueFlowPageFromGroundedReport(
      "project-7",
      "session-3",
      [
        { id: "msg-1", role: "user", content: "raw thought" },
        { id: "msg-2", role: "assistant", content: "structured reply" },
      ],
      report,
    );

    expect(flowPage).toContain('data-page="dialogue-flow-page"');
    expect(flowPage).toContain('data-panel="grounded-response-details-panel"');
  });
});
