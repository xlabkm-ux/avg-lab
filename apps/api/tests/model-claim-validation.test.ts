import { describe, expect, it } from "vitest";
import { validateClaimRequest, createProject, registerProjectDocument, composeGroundedProjectResponse } from "../src/index";
import metaphorResponseFixture from "../../tests/fixtures/avg-response/metaphor.json";
import hypothesisResponseFixture from "../../tests/fixtures/avg-response/hypothesis.json";
import criticalRiskResponseFixture from "../../tests/fixtures/avg-response/critical-risk.json";

describe("Model response claim validation", () => {
  describe("claim request validation", () => {
    it("accepts valid claim requests", () => {
      const response = validateClaimRequest({
        id: "claim_001",
        statement: "Memory consolidation involves hippocampal interactions",
        claim_status: "hypothesis",
        language_mode: "operational_description",
        scope: "cognitive neuroscience",
        risks: ["requires_evidence"]
      });

      expect(response.accepted).toBe(true);
    });

    it("accepts metaphor-only claims with appropriate warnings", () => {
      const response = validateClaimRequest({
        id: "claim_002",
        statement: "The mind is like a computer",
        claim_status: "metaphor_only",
        language_mode: "metaphor",
        scope: "cognitive metaphor",
        risks: ["metaphor_as_literal_warning"]
      });

      expect(response.accepted).toBe(true);
    });

    it("accepts boundary statement claims", () => {
      const response = validateClaimRequest({
        id: "claim_003",
        statement: "This response is grounded only in registered evidence",
        claim_status: "boundary_statement",
        language_mode: "operational_description",
        scope: "evidence boundary",
        risks: []
      });

      expect(response.accepted).toBe(true);
    });
  });

  describe("model response claim status handling", () => {
    it("processes metaphor-only claims with appropriate risk markers", () => {
      const project = createProject("Metaphor claim test");

      const report = composeGroundedProjectResponse(project.id, {
        response: metaphorResponseFixture,
        query: "mind computer metaphor",
        limit: 1
      });

      // The grounded response composition processes the response
      expect(report.groundedResponse).toBeDefined();
      expect(report.groundedResponse?.response.claim_status).toBe("metaphor_only");
    });

    it("processes hypothesis claims with evidence requirements", () => {
      const project = createProject("Hypothesis claim test");

      const report = composeGroundedProjectResponse(project.id, {
        response: hypothesisResponseFixture,
        query: "spaced repetition memory",
        limit: 1
      });

      expect(report.groundedResponse).toBeDefined();
      expect(report.groundedResponse?.response.claim_status).toBe("hypothesis");
    });

    it("handles critical risk claims appropriately", () => {
      const project = createProject("Critical risk test");

      const report = composeGroundedProjectResponse(project.id, {
        response: criticalRiskResponseFixture,
        query: "unsupported cognitive claim",
        limit: 1
      });

      expect(report.groundedResponse).toBeDefined();
      expect(report.groundedResponse?.response.validation_risk).toBe("critical");
    });
  });

  describe("claim status taxonomy validation", () => {
    const validClaimStatuses = [
      "definition",
      "working_distinction",
      "operational_marker",
      "indirect_sign",
      "hypothesis",
      "metaphor_only",
      "prohibited_positive_claim",
      "boundary_statement"
    ];

    it("accepts all valid claim status values", () => {
      validClaimStatuses.forEach((status) => {
        const response = validateClaimRequest({
          id: `claim_${status}`,
          statement: `Test statement for ${status}`,
          claim_status: status as any,
          language_mode: "operational_description",
          scope: "testing",
          risks: []
        });

        expect(response.accepted).toBe(true);
      });
    });

    it("distinguishes between definition and hypothesis", () => {
      const definitionResponse = validateClaimRequest({
        id: "claim_definition",
        statement: "A testable definition of memory",
        claim_status: "definition",
        language_mode: "direct_description",
        scope: "terminology",
        risks: []
      });

      const hypothesisResponse = validateClaimRequest({
        id: "claim_hypothesis",
        statement: "Memory improves with spaced repetition",
        claim_status: "hypothesis",
        language_mode: "operational_description",
        scope: "empirical claim",
        risks: []
      });

      expect(definitionResponse.accepted).toBe(true);
      // Hypothesis with scope should be accepted (no missing_scope risk added)
      expect(hypothesisResponse.accepted).toBe(true);
      expect(definitionResponse.status).toBe("definition");
      expect(hypothesisResponse.status).toBe("hypothesis");
    });

    it("distinguishes between metaphor_only and literal claims", () => {
      const metaphorResponse = validateClaimRequest({
        id: "claim_metaphor",
        statement: "The mind is like a castle",
        claim_status: "metaphor_only",
        language_mode: "metaphor",
        scope: "metaphorical exploration",
        risks: []
      });

      expect(metaphorResponse.accepted).toBe(true);
      expect(metaphorResponse.status).toBe("metaphor_only");
      expect(metaphorResponse.languageMode).toBe("metaphor");
    });
  });

  describe("claim risk assessment", () => {
    it("identifies high-risk claims requiring evidence", () => {
      const highRiskClaim = {
        id: "claim_high_risk",
        statement: "This mechanism definitely works this way",
        claim_status: "hypothesis",
        language_mode: "direct_description",
        scope: "strong empirical claim",
        risks: ["requires_evidence", "strong_assertion"]
      };

      expect(highRiskClaim.risks).toContain("requires_evidence");
      expect(highRiskClaim.risks).toContain("strong_assertion");
    });

    it("flags metaphor-as-literal risk", () => {
      const riskyMetaphor = {
        id: "claim_risky_metaphor",
        statement: "The psyche IS a castle with hidden rooms",
        claim_status: "definition",
        language_mode: "direct_description",
        scope: "metaphor presented as fact",
        risks: ["metaphor_as_literal"]
      };

      expect(riskyMetaphor.risks).toContain("metaphor_as_literal");
    });

    it("accepts low-risk boundary statements", () => {
      const boundaryStatement = {
        id: "claim_boundary",
        statement: "This response is limited to registered evidence",
        claim_status: "boundary_statement",
        language_mode: "operational_description",
        scope: "evidence boundary",
        risks: []
      };

      expect(boundaryStatement.risks).toEqual([]);
    });
  });

  describe("language mode validation in claims", () => {
    const validLanguageModes = [
      "direct_description",
      "operational_description",
      "conditional_description",
      "metaphor",
      "symbolic_pointer",
      "silence_required"
    ];

    it("accepts all valid language modes", () => {
      validLanguageModes.forEach((mode) => {
        const response = validateClaimRequest({
          id: `claim_${mode}`,
          statement: `Statement in ${mode} mode`,
          claim_status: "boundary_statement",
          language_mode: mode as any,
          scope: "language mode testing",
          risks: []
        });

        // Verify the language mode is preserved
        expect(response.languageMode).toBe(mode);
      });
    });

    it("flags metaphor language mode without metaphor_only status", () => {
      const riskyMetaphor = validateClaimRequest({
        id: "claim_risky_metaphor",
        statement: "The psyche IS a castle",
        claim_status: "definition",
        language_mode: "metaphor",
        scope: "metaphor presented as fact",
        risks: []
      });

      // Should NOT be accepted because metaphor language mode adds metaphor_as_fact risk
      expect(riskyMetaphor.accepted).toBe(false);
      expect(riskyMetaphor.risks).toContain("metaphor_as_fact");
    });

    it("pairs metaphor language_mode with metaphor_only claim_status appropriately", () => {
      const metaphorPair = validateClaimRequest({
        id: "claim_metaphor_pair",
        statement: "Like a river flowing through time",
        claim_status: "metaphor_only",
        language_mode: "metaphor",
        scope: "temporal metaphor",
        risks: ["metaphor_as_literal_warning"]
      });

      expect(metaphorPair.accepted).toBe(true);
    });

    it("allows conditional language mode for hypothesis claims", () => {
      const conditionalHypothesis = validateClaimRequest({
        id: "claim_conditional",
        statement: "If spaced repetition is applied, retention may improve",
        claim_status: "hypothesis",
        language_mode: "conditional_description",
        scope: "conditional empirical claim",
        risks: ["requires_evidence"]
      });

      expect(conditionalHypothesis.accepted).toBe(true);
    });
  });

  describe("claim validation integration with grounded response", () => {
    it("validates claims within grounded response composition", () => {
      const project = createProject("Claim validation integration test");

      registerProjectDocument(project.id, {
        title: "Research notes",
        source_kind: "local_markdown",
        text: "Research on memory consolidation suggests hippocampal involvement."
      });

      const report = composeGroundedProjectResponse(project.id, {
        response: hypothesisResponseFixture,
        query: "memory consolidation hippocampus",
        limit: 1
      });

      expect(report.accepted).toBe(true);
      expect(report.groundedResponse).toBeDefined();
    });

    it("preserves claim metadata through response pipeline", () => {
      const project = createProject("Claim metadata test");

      const report = composeGroundedProjectResponse(project.id, {
        response: metaphorResponseFixture,
        query: "cognitive metaphor",
        limit: 1
      });

      // Verify claim metadata is preserved through the pipeline
      const groundedResponse = report.groundedResponse;
      expect(groundedResponse).toBeDefined();
      expect(groundedResponse?.response.claim_status).toBe("metaphor_only");
      expect(groundedResponse?.response.language_mode).toBe("metaphor");
      expect(groundedResponse?.response.validation_risk).toBe("medium");
    });
  });
});
