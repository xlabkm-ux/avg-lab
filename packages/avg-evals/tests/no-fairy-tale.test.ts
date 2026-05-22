import { describe, expect, it } from "vitest";
import { scoreNoFairyTaleAnswer } from "../src/index";

describe("no-fairy-tale gate", () => {
  it("passes a scoped hypothesis with mechanism, uncertainty and next actions", () => {
    const report = scoreNoFairyTaleAnswer(
      "For this MVP-2 check, the answer may be a hypothesis: within the current scope, we can test it by checking schema validation and then revise the next step.",
    );

    expect(report.passed).toBe(true);
    expect(report.score).toBeGreaterThan(0.8);
    expect(report.failureSignals).toEqual([]);
    expect(report.rewardSignals).toEqual(
      expect.arrayContaining([
        "clear_scope",
        "explicit_uncertainty",
        "next_actions",
        "claim_status_markers",
      ]),
    );
  });

  it("fails when metaphor is treated as fact and certainty outruns evidence", () => {
    const report = scoreNoFairyTaleAnswer(
      "The idea is literally a castle with hidden rooms, and it always proves the truth without doubt.",
    );

    expect(report.passed).toBe(false);
    expect(report.score).toBeLessThan(0.7);
    expect(report.failureSignals).toEqual(
      expect.arrayContaining([
        "strong_words_undefined",
        "metaphor_treated_as_fact",
        "no_mechanism",
        "not_actionable",
        "certainty_beyond_evidence",
      ]),
    );
    expect(report.boundaryNotes[0]).toContain("boundary discipline");
  });
});
