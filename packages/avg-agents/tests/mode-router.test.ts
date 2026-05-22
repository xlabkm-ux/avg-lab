import { describe, expect, it } from "vitest";
import { validateAvgResponse } from "@avg/schemas";
import { composeStructuredResponse, routeDialogueMode } from "../src/index";

describe("avg-agents mode router", () => {
  it("routes claim-heavy prompts to the validator", () => {
    expect(
      routeDialogueMode({
        instruction: "Validate the claim risks and repair the metaphor boundary."
      })
    ).toMatchObject({
      mode: "validator"
    });
  });

  it("routes system design prompts to the architect", () => {
    expect(
      routeDialogueMode({
        instruction: "Design the response composer and package contract."
      })
    ).toMatchObject({
      mode: "architect"
    });
  });

  it("routes generative prompts to the creative mode", () => {
    expect(
      routeDialogueMode({
        instruction: "Generate creative variants and alternatives."
      })
    ).toMatchObject({
      mode: "creative"
    });
  });

  it("defaults to orchestrator when no specialist mode is clear", () => {
    expect(
      routeDialogueMode({
        instruction: "Continue the session."
      })
    ).toMatchObject({
      mode: "orchestrator"
    });
  });
});

describe("avg-agents response composer", () => {
  it("builds a structured AVG response that satisfies the schema contract", () => {
    const response = composeStructuredResponse({
      id: "response_001",
      projectId: "project_001",
      sessionId: "session_001",
      messageId: "message_001",
      summary: "The answer keeps scope and territory distinct.",
      scope: "MVP-1 dialogue slice",
      claimStatus: "boundary_statement",
      languageMode: "operational_description",
      validationRisk: "medium",
      riskMarkers: ["map_territory_boundary_preserved"],
      mapTerritoryBoundary: "preserved",
      nextAction: "Hand off to the API slice.",
      artifacts: ["dialogue summary"]
    });

    expect(response).toEqual({
      id: "response_001",
      project_id: "project_001",
      session_id: "session_001",
      message_id: "message_001",
      summary: "The answer keeps scope and territory distinct.",
      scope: "MVP-1 dialogue slice",
      claim_status: "boundary_statement",
      language_mode: "operational_description",
      validation_risk: "medium",
      risk_markers: ["map_territory_boundary_preserved"],
      map_territory_boundary: "preserved",
      next_action: "Hand off to the API slice.",
      artifacts: ["dialogue summary"]
    });

    expect(validateAvgResponse(response)).toMatchObject({ valid: true, errors: [] });
  });
});
