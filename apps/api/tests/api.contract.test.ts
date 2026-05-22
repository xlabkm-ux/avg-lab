import { describe, expect, it } from "vitest";
import validResponseFixture from "../../../tests/fixtures/avg-response/valid.json";
import invalidResponseFixture from "../../../tests/fixtures/avg-response/invalid-missing-boundary.json";
import { validateAvgResponse } from "@avg/schemas";
import { createEmptyGraphSnapshot, projectClaimToMapNode } from "@avg/graph";
import { createMapDiffArtifact } from "../src/index";

describe("api contract smoke path", () => {
  it("accepts the approved structured AVG response fixture", () => {
    expect(validateAvgResponse(validResponseFixture)).toMatchObject({
      valid: true,
      errors: []
    });
  });

  it("rejects a structured response missing the map-territory boundary marker", () => {
    const result = validateAvgResponse(invalidResponseFixture);

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.keyword === "required")).toBe(true);
  });

  it("freezes the map diff artifact shape around diffGraphSnapshots output", () => {
    const artifact = createMapDiffArtifact(
      createEmptyGraphSnapshot(),
      projectClaimToMapNode({
        id: "claim_020",
        statement: "Map diff artifacts should carry projection metadata.",
        claim_status: "working_distinction",
        language_mode: "operational_description",
        risks: ["artifact_shape_drift"],
        scope: "Sprint 5 contract slice"
      })
    );

    expect(artifact).toMatchObject({
      kind: "map_diff",
      from: { nodes: [], edges: [] },
      diff: {
        removedNodeIds: [],
        removedEdgeIds: []
      }
    });
    expect(artifact.to.nodes[0].coordinates.claim_status).toBe("working_distinction");
    expect(artifact.to.nodes[0].coordinates.language_mode).toBe("operational_description");
    expect(artifact.to.nodes[0].map_safety.known_risks).toContain("artifact_shape_drift");
  });
});
