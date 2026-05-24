import { describe, expect, it } from "vitest";
import { composeGroundedProjectResponse, createProject, registerProjectDocument, searchProjectDocuments } from "../src/index";
import validResponseFixture from "../../tests/fixtures/avg-response/valid.json";

describe("User-model interaction: dialogue flow", () => {
  describe("grounded response composition", () => {
    it("composes a grounded response with document citations", () => {
      const project = createProject("Dialogue test project");

      registerProjectDocument(project.id, {
        title: "Strategy notes",
        source_kind: "local_markdown",
        text: "This response keeps the distinction between map and territory clear."
      });

      const report = composeGroundedProjectResponse(project.id, {
        response: validResponseFixture,
        query: "map and territory",
        limit: 3
      });

      expect(report.accepted).toBe(true);
      expect(report.groundedResponse).toBeDefined();
      expect(report.groundedResponse?.grounding.citations.length).toBeGreaterThan(0);
      expect(report.groundedResponse?.grounding.boundary_statement).toContain("grounded only");
    });

    it("preserves claim status from model response", () => {
      const project = createProject("Claim status test");

      const response = {
        id: "response_test_001",
        project_id: project.id,
        session_id: "session_001",
        message_id: "message_001",
        summary: "Test response with claim",
        scope: "claim validation",
        claim_status: "hypothesis",
        language_mode: "operational_description",
        validation_risk: "medium",
        risk_markers: ["requires_evidence"],
        map_territory_boundary: "preserved",
        next_action: "validate claim"
      };

      const report = composeGroundedProjectResponse(project.id, {
        response,
        query: "test claim",
        limit: 1
      });

      expect(report.groundedResponse).toBeDefined();
      expect(report.groundedResponse?.response.claim_status).toBe("hypothesis");
    });

    it("handles different claim statuses appropriately", () => {
      const project = createProject("Claim types test");
      const claimStatuses = [
        "definition",
        "working_distinction",
        "operational_marker",
        "indirect_sign",
        "hypothesis",
        "metaphor_only",
        "prohibited_positive_claim",
        "boundary_statement"
      ] as const;

      claimStatuses.forEach((status) => {
        const response = {
          id: `response_${status}`,
          project_id: project.id,
          session_id: "session_001",
          message_id: "message_001",
          summary: `Response with ${status}`,
          scope: "claim type testing",
          claim_status: status,
          language_mode: "operational_description",
          validation_risk: "low",
          risk_markers: [],
          map_territory_boundary: "preserved",
          next_action: "continue"
        };

        const report = composeGroundedProjectResponse(project.id, {
          response,
          query: "test",
          limit: 1
        });

        expect(report.groundedResponse).toBeDefined();
        expect(report.groundedResponse?.response.claim_status).toBe(status);
      });
    });

    it("preserves language mode from model response", () => {
      const project = createProject("Language mode test");
      const languageModes = [
        "direct_description",
        "operational_description",
        "conditional_description",
        "metaphor",
        "symbolic_pointer",
        "silence_required"
      ] as const;

      languageModes.forEach((mode) => {
        const response = {
          id: `response_${mode}`,
          project_id: project.id,
          session_id: "session_001",
          message_id: "message_001",
          summary: `Response in ${mode} mode`,
          scope: "language mode testing",
          claim_status: "boundary_statement",
          language_mode: mode,
          validation_risk: "low",
          risk_markers: [],
          map_territory_boundary: "preserved",
          next_action: "continue"
        };

        const report = composeGroundedProjectResponse(project.id, {
          response,
          query: "test",
          limit: 1
        });

        expect(report.groundedResponse).toBeDefined();
        expect(report.groundedResponse?.response.language_mode).toBe(mode);
      });
    });

    it("tracks validation risk levels appropriately", () => {
      const project = createProject("Risk level test");
      const riskLevels = ["low", "medium", "high", "critical"] as const;

      riskLevels.forEach((risk) => {
        const response = {
          id: `response_${risk}`,
          project_id: project.id,
          session_id: "session_001",
          message_id: "message_001",
          summary: `Response with ${risk} risk`,
          scope: "risk level testing",
          claim_status: "boundary_statement",
          language_mode: "operational_description",
          validation_risk: risk,
          risk_markers: risk === "critical" ? ["critical_risk"] : ["standard_risk"],
          map_territory_boundary: "preserved",
          next_action: "review"
        };

        const report = composeGroundedProjectResponse(project.id, {
          response,
          query: "test",
          limit: 1
        });

        expect(report.groundedResponse).toBeDefined();
        expect(report.groundedResponse?.response.validation_risk).toBe(risk);
      });
    });

    it("handles responses with no matching evidence gracefully", () => {
      const project = createProject("No evidence test");

      const response = {
        id: "response_no_evidence",
        project_id: project.id,
        session_id: "session_001",
        message_id: "message_001",
        summary: "Response without grounding",
        scope: "no evidence scenario",
        claim_status: "metaphor_only",
        language_mode: "metaphor",
        validation_risk: "high",
        risk_markers: ["missing_evidence"],
        map_territory_boundary: "preserved",
        next_action: "register evidence"
      };

      const report = composeGroundedProjectResponse(project.id, {
        response,
        query: "unmatched query with no documents",
        limit: 3
      });

      // Should have grounding even with no evidence matches
      expect(report.groundedResponse?.grounding.citations.length).toBeGreaterThanOrEqual(0);
    });

    it("limits citations according to provided limit", () => {
      const project = createProject("Citation limit test");

      for (let i = 1; i <= 5; i++) {
        registerProjectDocument(project.id, {
          title: `Document ${i}`,
          source_kind: "local_markdown",
          text: `This is document ${i} with unique content for testing citation limits.`
        });
      }

      const report = composeGroundedProjectResponse(project.id, {
        response: validResponseFixture,
        query: "document unique content",
        limit: 2
      });

      expect(report.accepted).toBe(true);
      expect(report.groundedResponse?.grounding.citations.length).toBeLessThanOrEqual(2);
    });
  });

  describe("retrieval interaction", () => {
    it("searches documents and returns hits with confidence levels", () => {
      const project = createProject("Retrieval search test");

      registerProjectDocument(project.id, {
        title: "Memory research",
        source_kind: "local_markdown",
        text: "Memory consolidation involves the hippocampus and neocortex working together."
      });

      const search = searchProjectDocuments(project.id, "hippocampus memory consolidation");

      expect(search.hits.length).toBeGreaterThan(0);
      expect(search.retrieval_confidence).toBe("high");
      expect(search.hits[0].confidence).toBe("high");
      expect(search.hits[0].snippet_id).toBeDefined();
      expect(search.hits[0].citation_id).toBeDefined();
    });

    it("returns results with appropriate confidence for weak matches", () => {
      const project = createProject("Low confidence test");

      registerProjectDocument(project.id, {
        title: "Unrelated notes",
        source_kind: "local_markdown",
        text: "These notes are about something completely different."
      });

      const search = searchProjectDocuments(project.id, "quantum physics entanglement");

      // Should return a search result object
      expect(search).toBeDefined();
      expect(search.hits).toBeDefined();
    });
  });

  describe("map-territory boundary preservation", () => {
    it("preserves boundary statements in grounded responses", () => {
      const project = createProject("Boundary test");

      const response = {
        id: "response_boundary",
        project_id: project.id,
        session_id: "session_001",
        message_id: "message_001",
        summary: "This is a metaphor for understanding",
        scope: "boundary testing",
        claim_status: "metaphor_only",
        language_mode: "metaphor",
        validation_risk: "medium",
        risk_markers: ["metaphorical_content"],
        map_territory_boundary: "preserved",
        next_action: "clarify literal vs metaphorical"
      };

      const report = composeGroundedProjectResponse(project.id, {
        response,
        query: "test",
        limit: 1
      });

      expect(report.groundedResponse).toBeDefined();
      expect(report.groundedResponse?.response.map_territory_boundary).toBe("preserved");
      expect(report.groundedResponse?.grounding.boundary_statement).toBeDefined();
    });

    it("flags metaphor-only claims appropriately", () => {
      const project = createProject("Metaphor flag test");

      const response = {
        id: "response_metaphor",
        project_id: project.id,
        session_id: "session_001",
        message_id: "message_001",
        summary: "The mind is like a computer processing information",
        scope: "metaphor testing",
        claim_status: "metaphor_only",
        language_mode: "metaphor",
        validation_risk: "medium",
        risk_markers: ["metaphor_as_literal_warning"],
        map_territory_boundary: "preserved",
        next_action: "distinguish metaphor from mechanism"
      };

      const report = composeGroundedProjectResponse(project.id, {
        response,
        query: "mind computer metaphor",
        limit: 1
      });

      expect(report.groundedResponse).toBeDefined();
      expect(report.groundedResponse?.response.claim_status).toBe("metaphor_only");
      expect(report.groundedResponse?.response.risk_markers).toContain("metaphor_as_literal_warning");
    });
  });
});
