import { describe, expect, it } from "vitest";
import { classifyClaimDiscipline } from "../src/index";

describe("claim classification discipline", () => {
  it("classifies a hedged claim as a hypothesis in conditional language", () => {
    const report = classifyClaimDiscipline({
      statement: "The request may be asking for an executable repository baseline.",
      claim_status: "hypothesis",
      language_mode: "operational_description"
    });

    expect(report.status).toBe("hypothesis");
    expect(report.languageMode).toBe("conditional_description");
    expect(report.confidence).toBe("high");
    expect(report.signals).toContain("hypothesis_markers");
  });

  it("classifies metaphorical wording as metaphor_only", () => {
    const report = classifyClaimDiscipline({
      statement: "The idea is a castle with hidden rooms.",
      claim_status: "hypothesis",
      language_mode: "operational_description"
    });

    expect(report.status).toBe("metaphor_only");
    expect(report.languageMode).toBe("metaphor");
    expect(report.boundaryNotes[0]).toContain("Metaphorical wording");
  });

  it("adds mismatch notes when the provided status or language mode diverges from the classifier", () => {
    const report = classifyClaimDiscipline({
      statement: "Approve the downstream API contract and compose the response payload.",
      claim_status: "hypothesis",
      language_mode: "conditional_description"
    });

    expect(report.status).toBe("operational_marker");
    expect(report.languageMode).toBe("operational_description");
    expect(report.boundaryNotes.some((note) => note.includes("Claim status mismatch"))).toBe(true);
    expect(report.boundaryNotes.some((note) => note.includes("Language mode mismatch"))).toBe(true);
  });
});
