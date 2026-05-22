import { describe, expect, it } from "vitest";
import { classifyClaimRisk } from "../src/index";

describe("claim risk classification", () => {
  it("treats a properly marked metaphor as a high-risk but repairable claim", () => {
    const report = classifyClaimRisk({
      id: "claim_010",
      statement: "The idea is a castle with hidden rooms.",
      claim_status: "metaphor_only",
      language_mode: "metaphor",
      risks: []
    });

    expect(report.riskLevel).toBe("high");
    expect(report.riskMarkers).toEqual(expect.arrayContaining(["fairy_tale", "map_territory_substitution"]));
    expect(report.shouldRepair).toBe(true);
    expect(report.repairSuggestions.some((suggestion) => suggestion.includes("metaphor_only"))).toBe(true);
  });

  it("escalates prohibited positive claims with strong words to critical risk", () => {
    const report = classifyClaimRisk({
      id: "claim_011",
      statement: "The model is the true essence of the user's reality and it always proves the answer.",
      claim_status: "prohibited_positive_claim",
      language_mode: "direct_description",
      risks: []
    });

    expect(report.riskLevel).toBe("critical");
    expect(report.riskMarkers).toEqual(
      expect.arrayContaining(["strong_word_substitution", "scheme_absolutization", "map_territory_substitution", "dogma"])
    );
    expect(report.repairSuggestions.some((suggestion) => suggestion.includes("Replace absolute wording"))).toBe(true);
    expect(report.repairSuggestions.some((suggestion) => suggestion.includes("Downgrade the statement"))).toBe(true);
  });
});
