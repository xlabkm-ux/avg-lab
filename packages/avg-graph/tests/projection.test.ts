import { describe, expect, it } from "vitest";
import {
  cloneGraphSnapshot,
  createEmptyGraphSnapshot,
  createGraphRepository,
  diffGraphSnapshots,
  projectClaimToMapNode
} from "../src/index";

describe("claim graph projection", () => {
  it("creates an empty snapshot for API diff baselines", () => {
    expect(createEmptyGraphSnapshot()).toEqual({
      nodes: [],
      edges: []
    });
  });

  it("preserves claim status, language mode and risks", () => {
    const projection = projectClaimToMapNode({
      id: "claim_001",
      statement: "AVG keeps maps separate from territory.",
      claim_status: "working_distinction",
      language_mode: "operational_description",
      risks: ["map_territory_confusion"],
      source_refs: ["source_001"],
      scope: "Sprint 5 concept map"
    });

    expect(projection.node.definition).toBe("AVG keeps maps separate from territory.");
    expect(projection.node.coordinates.access_mode).toBe("indirectly_accessible");
    expect(projection.node.coordinates.claim_status).toBe("working_distinction");
    expect(projection.node.coordinates.language_mode).toBe("operational_description");
    expect(projection.node.map_safety.known_risks).toContain("map_territory_confusion");
    expect(projection.edges).toEqual([
      {
        id: "edge_source_001_claim_001",
        type: "cites",
        from: "source_001",
        to: "node_claim_001",
        claim_status: "working_distinction",
        scope: "Sprint 5 concept map",
        constraints: ["source_ref_is_not_full_evidence"]
      }
    ]);
  });

  it("stores graph projections in an in-memory repository", () => {
    const repository = createGraphRepository();

    const projection = repository.ingestClaim({
      id: "claim_002",
      statement: "A graph repository should preserve map boundaries.",
      claim_status: "boundary_statement",
      language_mode: "direct_description",
      risks: [],
      source_refs: ["source_002"],
      scope: "Sprint 5 graph repository"
    });

    expect(repository.getNode("node_claim_002")).toEqual(projection.node);
    expect(repository.getEdge("edge_source_002_claim_002")).toEqual(projection.edges[0]);
    expect(repository.listNodes()).toHaveLength(1);
    expect(repository.listEdges()).toHaveLength(1);

    const before = repository.snapshot();
    repository.upsertNode({
      id: "node_concept_001",
      type: "concept",
      label: "Concept map",
      definition: "A disciplined working map",
      coordinates: {
        access_mode: "knowable",
        language_mode: "operational_description",
        claim_status: "definition"
      },
      map_safety: {
        known_risks: ["scope_drift"]
      }
    });

    const after = repository.snapshot();
    const diff = repository.diff(before, after);
    const directDiff = diffGraphSnapshots(before, after);

    expect(diff.addedNodes).toHaveLength(1);
    expect(diff.addedNodes[0].id).toBe("node_concept_001");
    expect(diff.addedEdges).toHaveLength(0);
    expect(diff.removedNodeIds).toEqual([]);
    expect(directDiff).toEqual(diff);
  });

  it("clones snapshots so callers cannot mutate repository state", () => {
    const repository = createGraphRepository();
    repository.ingestClaim({
      id: "claim_003",
      statement: "Snapshots should be immutable from the caller perspective.",
      claim_status: "operational_marker",
      language_mode: "operational_description",
      risks: ["external_mutation"]
    });

    const snapshot = repository.snapshot();
    const cloned = cloneGraphSnapshot(snapshot);
    cloned.nodes[0].label = "Mutated outside the repository";
    cloned.nodes[0].map_safety.known_risks?.push("new_risk");

    expect(repository.getNode("node_claim_003")?.label).toBe(
      "Snapshots should be immutable from the caller perspective."
    );
    expect(repository.getNode("node_claim_003")?.map_safety.known_risks).toEqual(["external_mutation"]);
  });
});
