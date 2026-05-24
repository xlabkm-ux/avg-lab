import { describe, it, expect } from "vitest";
import {
  generateSessionSummaryArtifact,
  generateGroundedAnswerArtifact,
  generateMapSnapshotArtifact,
  generateCitationReportArtifact,
  serializeAsJson,
  serializeAsMarkdown,
} from "../../../src/artifacts/generators";
import type { AvgClaim } from "@avg/schemas";
import type { GraphSnapshot } from "@avg/graph";
import type { AvgRetrievalHit } from "@avg/retrieval";
import type { AvgGroundedResponseBoundary, AvgCitation } from "@avg/validation";
import type { DialogueMessage } from "@avg/html-rendering";

// ============================================================================
// Test fixtures
// ============================================================================

const mockClaims: AvgClaim[] = [
  {
    id: "claim-1",
    statement: "AI will transform healthcare",
    claim_status: "hypothesis",
    language_mode: "literal",
    risks: ["speculation"],
    created_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "claim-2",
    statement: "Data is the new oil",
    claim_status: "metaphor_only",
    language_mode: "metaphorical",
    risks: ["false_analogy"],
    created_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "claim-3",
    statement: "Python is a programming language",
    claim_status: "validated",
    language_mode: "literal",
    risks: [],
    created_at: "2024-01-01T00:00:00.000Z",
  },
];

const mockMessages: DialogueMessage[] = [
  { role: "user", content: "What is AI?", timestamp: Date.now() },
  { role: "assistant", content: "AI is artificial intelligence.", timestamp: Date.now() },
  { role: "user", content: "How does it work?", timestamp: Date.now() },
];

const mockMapSnapshot: GraphSnapshot = {
  nodes: [
    {
      id: "node-1",
      type: "concept",
      label: "AI",
      definition: "Artificial Intelligence",
      coordinates: {
        access_mode: "local",
        language_mode: "literal",
        claim_status: "validated",
      },
      map_safety: {
        known_risks: [],
      },
    },
    {
      id: "node-2",
      type: "concept",
      label: "Healthcare",
      definition: "Medical industry",
      coordinates: {
        access_mode: "local",
        language_mode: "literal",
        claim_status: "hypothesis",
      },
      map_safety: {
        known_risks: ["speculation"],
      },
    },
  ],
  edges: [
    {
      id: "edge-1",
      type: "relates_to",
      from: "node-1",
      to: "node-2",
      claim_status: "hypothesis",
      scope: "current session",
      constraints: [],
    },
  ],
};

const mockRetrievalHits: AvgRetrievalHit[] = [
  {
    citation_id: "cit-1",
    snippet_id: "snip-1",
    document_id: "doc-1",
    matched_text: "AI is transforming healthcare",
    confidence: "high",
    score: 0.95,
    source_label: "Healthcare AI Report",
  },
  {
    citation_id: "cit-2",
    snippet_id: "snip-2",
    document_id: "doc-2",
    matched_text: "Machine learning in medicine",
    confidence: "medium",
    score: 0.85,
    source_label: "ML Research Paper",
  },
];

const mockCitations: AvgCitation[] = [
  {
    id: "cit-1",
    document_id: "doc-1",
    snippet_id: "snip-1",
    source_label: "Healthcare AI Report",
    quoted_text: "AI is transforming healthcare",
    relevance: "supporting",
  },
];

const mockGrounding: AvgGroundedResponseBoundary = {
  citations: mockCitations,
  grounded_claims: ["claim-1"],
  interpretations: ["AI refers to artificial intelligence"],
  unsupported_claims: ["claim-2"],
  retrieval_confidence: "high",
  boundary_statement: "This response is grounded in cited sources",
};

// ============================================================================
// generateSessionSummaryArtifact tests
// ============================================================================

describe("generateSessionSummaryArtifact", () => {
  it("should generate a session summary with all data", () => {
    const envelope = generateSessionSummaryArtifact(
      "proj-1",
      "sess-1",
      "Test Project",
      mockMessages,
      mockClaims,
      mockMapSnapshot,
      mockRetrievalHits
    );

    expect(envelope.artifact_kind).toBe("session_summary");
    expect(envelope.project_id).toBe("proj-1");
    expect(envelope.session_id).toBe("sess-1");
    expect(envelope.contract_version).toBe("mvp-5");
    expect(envelope.payload.project_title).toBe("Test Project");
    expect(envelope.payload.dialogue_turns).toBe(2);
    expect(envelope.payload.user_messages).toBe(2);
    expect(envelope.payload.assistant_messages).toBe(1);
    expect(envelope.payload.total_claims).toBe(3);
    expect(envelope.payload.claims_by_status).toEqual({
      hypothesis: 1,
      metaphor_only: 1,
      validated: 1,
    });
    expect(envelope.payload.map_snapshot_summary).toEqual({
      node_count: 2,
      edge_count: 1,
    });
  });

  it("should generate summary without map snapshot", () => {
    const envelope = generateSessionSummaryArtifact(
      "proj-1",
      "sess-1",
      "Test Project",
      mockMessages,
      mockClaims
    );

    expect(envelope.payload.map_snapshot_summary).toBeNull();
  });

  it("should include risk markers from claims", () => {
    const envelope = generateSessionSummaryArtifact(
      "proj-1",
      "sess-1",
      "Test Project",
      [],
      mockClaims
    );

    expect(envelope.risk_markers).toContain("speculation");
    expect(envelope.risk_markers).toContain("false_analogy");
  });

  it("should preserve map/territory boundary note", () => {
    const envelope = generateSessionSummaryArtifact(
      "proj-1",
      "sess-1",
      "Test Project",
      [],
      []
    );

    expect(envelope.map_territory_boundary_note).toContain("working projection");
    expect(envelope.map_territory_boundary_note).toContain("model, not Reality");
  });

  it("should preserve uncertainty note", () => {
    const envelope = generateSessionSummaryArtifact(
      "proj-1",
      "sess-1",
      "Test Project",
      [],
      []
    );

    expect(envelope.uncertainty_preservation_note).toContain("preserves uncertainty");
  });
});

// ============================================================================
// generateGroundedAnswerArtifact tests
// ============================================================================

describe("generateGroundedAnswerArtifact", () => {
  it("should generate grounded answer with response", () => {
    const mockResponse = {
      id: "resp-1",
      message_id: "msg-1",
      summary: "AI is artificial intelligence",
      scope: "current session",
      claim_status: "validated" as const,
      language_mode: "literal" as const,
      validation_risk: "low" as const,
      risk_marker: [],
      map_territory_boundary: "This is a model",
      next_action: "continue dialogue",
    };

    const envelope = generateGroundedAnswerArtifact(
      "proj-1",
      "sess-1",
      mockResponse,
      mockGrounding,
      mockRetrievalHits,
      mockClaims
    );

    expect(envelope.artifact_kind).toBe("grounded_answer");
    expect(envelope.payload.response_id).toBe("resp-1");
    expect(envelope.payload.summary).toBe("AI is artificial intelligence");
    expect(envelope.payload.grounding).toBeDefined();
    expect(envelope.payload.grounding?.citation_ids).toContain("cit-1");
  });

  it("should handle missing response", () => {
    const envelope = generateGroundedAnswerArtifact(
      "proj-1",
      "sess-1",
      null,
      null,
      []
    );

    expect(envelope.payload.status).toBe("no_grounded_answer_available");
  });

  it("should include citations from retrieval hits", () => {
    const mockResponse = {
      id: "resp-1",
      message_id: "msg-1",
      summary: "Test",
      scope: "current session",
      claim_status: "validated" as const,
      language_mode: "literal" as const,
      validation_risk: "low" as const,
      risk_marker: [],
      map_territory_boundary: "This is a model",
      next_action: "continue",
    };

    const envelope = generateGroundedAnswerArtifact(
      "proj-1",
      "sess-1",
      mockResponse,
      null,
      mockRetrievalHits
    );

    expect(envelope.payload.citations).toHaveLength(2);
    expect(envelope.payload.citations[0].citation_id).toBe("cit-1");
  });
});

// ============================================================================
// generateMapSnapshotArtifact tests
// ============================================================================

describe("generateMapSnapshotArtifact", () => {
  it("should generate map snapshot with nodes and edges", () => {
    const envelope = generateMapSnapshotArtifact(
      "proj-1",
      "sess-1",
      mockMapSnapshot,
      mockClaims,
      mockRetrievalHits
    );

    expect(envelope.artifact_kind).toBe("map_snapshot");
    expect(envelope.payload.node_count).toBe(2);
    expect(envelope.payload.edge_count).toBe(1);
    expect(envelope.payload.nodes).toHaveLength(2);
    expect(envelope.payload.edges).toHaveLength(1);
    expect(envelope.payload.nodes[0].id).toBe("node-1");
    expect(envelope.payload.edges[0].claim_status).toBe("hypothesis");
  });

  it("should handle missing map", () => {
    const envelope = generateMapSnapshotArtifact("proj-1", "sess-1");

    expect(envelope.payload.status).toBe("no_map_available");
  });

  it("should include boundary note", () => {
    const envelope = generateMapSnapshotArtifact(
      "proj-1",
      "sess-1",
      mockMapSnapshot
    );

    expect(envelope.payload.boundary_note).toContain("working projection");
  });
});

// ============================================================================
// generateCitationReportArtifact tests
// ============================================================================

describe("generateCitationReportArtifact", () => {
  it("should generate citation report with hits", () => {
    const envelope = generateCitationReportArtifact(
      "proj-1",
      "sess-1",
      mockRetrievalHits,
      mockClaims
    );

    expect(envelope.artifact_kind).toBe("citation_report");
    expect(envelope.payload.citation_count).toBe(2);
    expect(envelope.payload.citations).toHaveLength(2);
    expect(envelope.payload.source_documents).toContain("doc-1");
    expect(envelope.payload.source_documents).toContain("doc-2");
  });

  it("should handle empty retrieval hits", () => {
    const envelope = generateCitationReportArtifact(
      "proj-1",
      "sess-1",
      []
    );

    expect(envelope.payload.status).toBe("no_citations_available");
    expect(envelope.payload.citation_count).toBe(0);
  });

  it("should include retrieval confidence", () => {
    const envelope = generateCitationReportArtifact(
      "proj-1",
      "sess-1",
      mockRetrievalHits
    );

    expect(envelope.payload.retrieval_confidence).toBe("high");
  });
});

// ============================================================================
// Serialization tests
// ============================================================================

describe("serializeAsJson", () => {
  it("should serialize envelope as JSON", () => {
    const envelope = generateSessionSummaryArtifact(
      "proj-1",
      "sess-1",
      "Test",
      [],
      []
    );

    const json = serializeAsJson(envelope);
    const parsed = JSON.parse(json);

    expect(parsed.artifact_kind).toBe("session_summary");
    expect(parsed.project_id).toBe("proj-1");
  });
});

describe("serializeAsMarkdown", () => {
  it("should serialize envelope as Markdown with YAML frontmatter", () => {
    const envelope = generateSessionSummaryArtifact(
      "proj-1",
      "sess-1",
      "Test",
      [],
      []
    );

    const md = serializeAsMarkdown(envelope);

    expect(md).toContain("---");
    expect(md).toContain("artifact_kind: session_summary");
    expect(md).toContain("project_id: proj-1");
    expect(md).toContain("# Session Summary");
  });

  it("should include risk markers section when present", () => {
    const envelope = generateSessionSummaryArtifact(
      "proj-1",
      "sess-1",
      "Test",
      [],
      mockClaims
    );

    const md = serializeAsMarkdown(envelope);

    expect(md).toContain("## Risk Markers");
    expect(md).toContain("speculation");
  });

  it("should include unsupported claims section always", () => {
    const envelope = generateSessionSummaryArtifact(
      "proj-1",
      "sess-1",
      "Test",
      [],
      mockClaims
    );

    const md = serializeAsMarkdown(envelope);

    expect(md).toContain("## Unsupported Claims");
    expect(md).toContain("Data is the new oil");
    expect(md).toContain("metaphor_only");
  });

  it("should show no unsupported claims when none exist", () => {
    const validatedClaims: AvgClaim[] = [
      {
        id: "claim-1",
        statement: "Python is a programming language",
        claim_status: "validated",
        language_mode: "literal",
        risks: [],
        created_at: "2024-01-01T00:00:00.000Z",
      },
    ];

    const envelope = generateSessionSummaryArtifact(
      "proj-1",
      "sess-1",
      "Test",
      [],
      validatedClaims
    );

    const md = serializeAsMarkdown(envelope);

    expect(md).toContain("No unsupported claims detected");
  });

  it("should handle empty status payloads", () => {
    const envelope = generateGroundedAnswerArtifact(
      "proj-1",
      "sess-1",
      null,
      null,
      []
    );

    const md = serializeAsMarkdown(envelope);

    expect(md).toContain("> No grounded response has been generated yet");
  });
});
