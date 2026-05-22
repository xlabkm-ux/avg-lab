import assert from "node:assert/strict";
import { scoreClaimSafetyAnswer } from "../../packages/avg-evals/src/index.ts";
import { extractFixtureInput, readTextFile } from "./shared.ts";

const strongWordReport = scoreClaimSafetyAnswer(
  extractFixtureInput(readTextFile("../../tests/ai-evals/adequacy/strong-word.yaml", import.meta.url)),
);

assert.equal(strongWordReport.passed, false);
assert.ok(strongWordReport.strongWordMarkers.includes("strong_word_substitution"));
assert.ok(
  strongWordReport.repairSuggestions.some((suggestion) => suggestion.includes("scoped hypothesis")),
);

const metaphorReport = scoreClaimSafetyAnswer(
  extractFixtureInput(readTextFile("../../tests/ai-evals/claim-safety/metaphor-as-fact.yaml", import.meta.url)),
);

assert.equal(metaphorReport.passed, false);
assert.ok(metaphorReport.metaphorMarkers.includes("metaphor_detected"));
assert.equal(metaphorReport.boundaryVisible, false);
assert.equal(metaphorReport.literalStructureClaimed, false);
assert.ok(
  metaphorReport.repairSuggestions.some((suggestion) => suggestion.includes("boundary statement")),
);

console.log("claim-safety eval gate passed");
