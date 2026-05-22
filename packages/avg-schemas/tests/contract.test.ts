import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import validClaimFixture from "../../../tests/fixtures/claims/valid.json";
import invalidClaimFixture from "../../../tests/fixtures/claims/invalid-missing-status.json";
import validResponseFixture from "../../../tests/fixtures/avg-response/valid.json";
import invalidResponseFixture from "../../../tests/fixtures/avg-response/invalid-missing-boundary.json";
import { validateAvgResponse, validateClaim, validateDocumentRef, validateMapEdge, validateMapNode } from "../src/index";

describe("AVG JSON Schema contracts", () => {
  it("accepts the valid claim fixture", () => {
    expect(validateClaim(validClaimFixture)).toMatchObject({ valid: true, errors: [] });
  });

  it("rejects a claim without claim_status", () => {
    const result = validateClaim(invalidClaimFixture);

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.keyword === "required")).toBe(true);
  });

  it("accepts a minimal claim map node", () => {
    expect(
      validateMapNode({
        id: "node_claim_001",
        type: "claim",
        label: "Working hypothesis",
        coordinates: {
          access_mode: "indirectly_accessible",
          language_mode: "operational_description",
          claim_status: "hypothesis"
        },
        map_safety: {
          known_risks: []
        }
      })
    ).toMatchObject({ valid: true, errors: [] });
  });

  it("accepts a scoped support edge", () => {
    expect(
      validateMapEdge({
        id: "edge_001",
        type: "supports",
        from: "node_source_001",
        to: "node_claim_001",
        claim_status: "hypothesis",
        scope: "MVP-0 contract fixture"
      })
    ).toMatchObject({ valid: true, errors: [] });
  });

  it("accepts a structured AVG response fixture", () => {
    expect(validateAvgResponse(validResponseFixture)).toMatchObject({ valid: true, errors: [] });
  });

  it("accepts a local document reference", () => {
    expect(
      validateDocumentRef({
        id: "doc_001",
        project_id: "project_001",
        title: "Strategy notes",
        source_kind: "local_markdown",
        created_at: "2026-05-20T00:00:00.000Z",
        metadata: {
          origin: "manual"
        }
      })
    ).toMatchObject({ valid: true, errors: [] });
  });

  it("rejects a document reference with unsupported source kind", () => {
    const result = validateDocumentRef({
      id: "doc_001",
      project_id: "project_001",
      title: "Strategy notes",
      source_kind: "remote_url",
      created_at: "2026-05-20T00:00:00.000Z"
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.keyword === "enum")).toBe(true);
  });

  it("rejects a structured response without a map-territory boundary marker", () => {
    const result = validateAvgResponse(invalidResponseFixture);

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.keyword === "required")).toBe(true);
  });

  it("keeps MVP-4 retrieval routes visible in the OpenAPI contract", () => {
    const openapi = readFileSync(new URL("../../../schemas/openapi/openapi.yaml", import.meta.url), "utf8");

    expect(openapi).toContain("/projects/{projectId}/documents:");
    expect(openapi).toContain("/projects/{projectId}/retrieval/search:");
    expect(openapi).toContain("RegisterDocumentRequest:");
    expect(openapi).toContain("RetrievalSearchResponse:");
  });
});
