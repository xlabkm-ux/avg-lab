import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArtifactWorkspacePanel } from "../../src/components/ArtifactWorkspacePanel";

// Mock the generators module
vi.mock("../../artifacts/generators", () => ({
  generateSessionSummaryArtifact: vi.fn(() => ({
    artifact_kind: "session_summary",
    project_id: "test-project",
    session_id: "test-session",
    payload: { summary: "Test summary" },
    risk_markers: [],
    citation_ids: [],
    snippet_ids: [],
    map_territory_boundary_note: "Test boundary note",
    uncertainty_preservation_note: "Test uncertainty note",
  })),
  generateGroundedAnswerArtifact: vi.fn(() => ({
    artifact_kind: "grounded_answer",
    project_id: "test-project",
    session_id: "test-session",
    payload: { summary: "Grounded answer" },
    risk_markers: [],
    citation_ids: [],
    snippet_ids: [],
    map_territory_boundary_note: "Test boundary note",
    uncertainty_preservation_note: "Test uncertainty note",
  })),
  generateMapSnapshotArtifact: vi.fn(() => ({
    artifact_kind: "map_snapshot",
    project_id: "test-project",
    session_id: "test-session",
    payload: { node_count: 2, edge_count: 1 },
    risk_markers: [],
    citation_ids: [],
    snippet_ids: [],
    map_territory_boundary_note: "Test boundary note",
    uncertainty_preservation_note: "Test uncertainty note",
  })),
  generateCitationReportArtifact: vi.fn(() => ({
    artifact_kind: "citation_report",
    project_id: "test-project",
    session_id: "test-session",
    payload: { citation_count: 2 },
    risk_markers: [],
    citation_ids: [],
    snippet_ids: [],
    map_territory_boundary_note: "Test boundary note",
    uncertainty_preservation_note: "Test uncertainty note",
  })),
  serializeAsJson: vi.fn(() => JSON.stringify({ test: "data" })),
  serializeAsMarkdown: vi.fn(() => "# Test\n\nContent"),
}));

// Mock export-utils
vi.mock("../../artifacts/export-utils", () => ({
  downloadFile: vi.fn(),
  copyToClipboard: vi.fn().mockResolvedValue(true),
  generateFilename: vi.fn(() => "test-project-session_summary-2024-01-01.json"),
  MIME_TYPES: {
    json: "application/json",
    markdown: "text/markdown",
  },
}));

describe("ArtifactWorkspacePanel", () => {
  const defaultProps = {
    projectId: "test-project",
    sessionId: "test-session",
    projectTitle: "Test Project",
    claims: [],
    dialogueMessages: [],
    retrievalHits: [],
    lastGroundedResponse: null,
    lastGrounding: null,
  };

  it("should render with empty state when no data", () => {
    render(<ArtifactWorkspacePanel {...defaultProps} />);

    expect(screen.getByText("Artifacts")).toBeInTheDocument();
    expect(screen.getByTestId("artifact-empty-state")).toBeInTheDocument();
  });

  it("should accept empty arrays for optional props", () => {
    expect(() => render(<ArtifactWorkspacePanel {...defaultProps} />)).not.toThrow();
  });

  it("should accept mapSnapshot as optional prop", () => {
    const props = {
      ...defaultProps,
      mapSnapshot: undefined,
    };

    expect(() => render(<ArtifactWorkspacePanel {...props} />)).not.toThrow();
  });
});

describe("ArtifactWorkspacePanel - With Data", () => {
  const propsWithData = {
    projectId: "test-project",
    sessionId: "test-session",
    projectTitle: "Test Project",
    claims: [{
      id: "claim-1",
      statement: "Test claim",
      claim_status: "validated" as const,
      language_mode: "literal" as const,
      risks: [],
      created_at: "2024-01-01T00:00:00.000Z",
    }],
    dialogueMessages: [
      { role: "user" as const, content: "Hello", timestamp: Date.now() },
    ],
    retrievalHits: [],
    lastGroundedResponse: null,
    lastGrounding: null,
  };

  it("should render generate button when there is data", () => {
    render(<ArtifactWorkspacePanel {...propsWithData} />);

    expect(screen.getByText("Generate")).toBeInTheDocument();
  });
});
