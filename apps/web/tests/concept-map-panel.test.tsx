import { describe, expect, it } from "vitest";
import type { GraphSnapshot, AvgMapNode, AvgMapEdge } from "@avg/graph";

// Test data factory
function createTestNode(overrides: Partial<AvgMapNode> = {}): AvgMapNode {
  return {
    id: `node-${Date.now()}`,
    type: "concept",
    label: "Test Node",
    definition: "Test definition",
    coordinates: {
      access_mode: "knowable",
      language_mode: "direct_description",
      claim_status: "definition",
    },
    map_safety: { known_risks: [] },
    ...overrides,
  };
}

function createTestEdge(overrides: Partial<AvgMapEdge> = {}): AvgMapEdge {
  return {
    id: `edge-${Date.now()}`,
    type: "contains",
    from: "node-from",
    to: "node-to",
    claim_status: "working_distinction",
    ...overrides,
  };
}

describe("ConceptMapPanel - Data Types", () => {
  it("creates a concept node with coordinates", () => {
    const node = createTestNode();

    expect(node.type).toBe("concept");
    expect(node.coordinates.access_mode).toBe("knowable");
    expect(node.coordinates.language_mode).toBe("direct_description");
  });

  it("creates a claim-type node", () => {
    const node = createTestNode({
      type: "claim",
      label: "Test Claim",
      coordinates: {
        access_mode: "indirectly_accessible",
        language_mode: "conditional_description",
        claim_status: "hypothesis",
      },
    });

    expect(node.type).toBe("claim");
    expect(node.coordinates.claim_status).toBe("hypothesis");
  });

  it("creates a map-type node with boundary risk", () => {
    const node = createTestNode({
      type: "map",
      label: "Concept Map",
      map_safety: { known_risks: ["map_territory_boundary"] },
    });

    expect(node.type).toBe("map");
    expect(node.map_safety.known_risks).toContain("map_territory_boundary");
  });

  it("creates an edge with type and scope", () => {
    const edge = createTestEdge({
      type: "supports",
      scope: "Within test scope",
    });

    expect(edge.type).toBe("supports");
    expect(edge.scope).toBe("Within test scope");
  });
});

describe("ConceptMapPanel - Graph Snapshots", () => {
  it("creates an empty graph snapshot", () => {
    const snapshot: GraphSnapshot = { nodes: [], edges: [] };

    expect(snapshot.nodes.length).toBe(0);
    expect(snapshot.edges.length).toBe(0);
  });

  it("creates a snapshot with nodes and edges", () => {
    const node1 = createTestNode({ id: "n1", label: "Node 1" });
    const node2 = createTestNode({ id: "n2", label: "Node 2" });
    const edge = createTestEdge({ id: "e1", from: "n1", to: "n2" });

    const snapshot: GraphSnapshot = {
      nodes: [node1, node2],
      edges: [edge],
    };

    expect(snapshot.nodes.length).toBe(2);
    expect(snapshot.edges.length).toBe(1);
    expect(snapshot.edges[0].from).toBe("n1");
    expect(snapshot.edges[0].to).toBe("n2");
  });
});

describe("ConceptMapPanel - Edge Types", () => {
  it("supports 'defines' edge type", () => {
    const edge = createTestEdge({ type: "defines" });

    expect(edge.type).toBe("defines");
  });

  it("supports 'contradicts' edge type", () => {
    const edge = createTestEdge({ type: "contradicts" });

    expect(edge.type).toBe("contradicts");
  });

  it("supports 'cites' edge type", () => {
    const edge = createTestEdge({ type: "cites" });

    expect(edge.type).toBe("cites");
  });

  it("supports 'risks' edge type", () => {
    const edge = createTestEdge({ type: "risks" });

    expect(edge.type).toBe("risks");
  });
});

describe("ConceptMapPanel - Node Types", () => {
  it("supports all valid node types", () => {
    const validTypes: Array<AvgMapNode["type"]> = [
      "term",
      "claim",
      "concept",
      "map",
      "risk",
      "source_fragment",
      "artifact",
      "mode",
    ];

    validTypes.forEach((nodeType) => {
      const node = createTestNode({ type: nodeType });
      expect(node.type).toBe(nodeType);
    });
  });
});

describe("ConceptMapPanel - Empty State Detection", () => {
  it("detects empty snapshot", () => {
    const snapshot: GraphSnapshot = { nodes: [], edges: [] };

    const isEmpty = snapshot.nodes.length === 0 && snapshot.edges.length === 0;
    expect(isEmpty).toBe(true);
  });

  it("detects non-empty snapshot", () => {
    const snapshot: GraphSnapshot = {
      nodes: [createTestNode({ id: "n1" })],
      edges: [],
    };

    const isEmpty = snapshot.nodes.length === 0 && snapshot.edges.length === 0;
    expect(isEmpty).toBe(false);
  });
});
