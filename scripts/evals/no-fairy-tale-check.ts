import assert from "node:assert/strict";
import { scoreNoFairyTaleAnswer } from "../../packages/avg-evals/src/index.ts";

const passingReport = scoreNoFairyTaleAnswer(
  "For this MVP-2 check, the answer may be a hypothesis: within the current scope, we can test it by checking schema validation and then revise the next step.",
);

assert.equal(passingReport.passed, true);
assert.ok(passingReport.score > 0.8);
assert.deepEqual(passingReport.failureSignals, []);
assert.ok(passingReport.rewardSignals.includes("clear_scope"));
assert.ok(passingReport.rewardSignals.includes("explicit_uncertainty"));
assert.ok(passingReport.rewardSignals.includes("next_actions"));
assert.ok(passingReport.rewardSignals.includes("claim_status_markers"));

const failingReport = scoreNoFairyTaleAnswer(
  "The idea is literally a castle with hidden rooms, and it always proves the truth without doubt.",
);

assert.equal(failingReport.passed, false);
assert.ok(failingReport.score < 0.7);
assert.ok(failingReport.failureSignals.includes("strong_words_undefined"));
assert.ok(failingReport.failureSignals.includes("metaphor_treated_as_fact"));
assert.ok(failingReport.failureSignals.includes("no_mechanism"));
assert.ok(failingReport.failureSignals.includes("not_actionable"));
assert.ok(failingReport.failureSignals.includes("certainty_beyond_evidence"));

console.log("no-fairy-tale eval gate passed");
