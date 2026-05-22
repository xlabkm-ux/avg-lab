import { describe, expect, it } from "vitest";
import { validateClaimContract } from "../src/index";

describe("claim validation discipline", () => {
  it("accepts a scoped hypothesis", () => {
    const report = validateClaimContract({
      id: "claim_001",
      statement: "The request may be asking for an executable repository baseline.",
      claim_status: "hypothesis",
      language_mode: "operational_description",
      scope: "Based on repository audit context.",
      risks: []
    });

    expect(report.accepted).toBe(true);
    expect(report.risks).toEqual([]);
  });

  it("marks metaphor language that is not bounded as metaphor_only", () => {
    const report = validateClaimContract({
      id: "claim_002",
      statement: "The idea is a castle with hidden rooms.",
      claim_status: "hypothesis",
      language_mode: "metaphor",
      scope: "Creative exploration only.",
      risks: []
    });

    expect(report.accepted).toBe(false);
    expect(report.risks).toContain("metaphor_as_fact");
    expect(report.boundaryNotes[0]).toContain("Metaphorical language");
  });
});
