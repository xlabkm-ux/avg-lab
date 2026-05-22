export interface StaticEvalFixture {
  id: string;
  requiredBoundary: boolean;
}

export interface NoFairyTaleEvalInput {
  answer: string;
}

export interface NoFairyTaleEvalReport {
  score: number;
  passed: boolean;
  failureSignals: string[];
  rewardSignals: string[];
  boundaryNotes: string[];
}

export interface ClaimSafetyEvalInput {
  answer: string;
}

export interface ClaimSafetyEvalReport {
  score: number;
  passed: boolean;
  strongWordMarkers: string[];
  metaphorMarkers: string[];
  literalStructureClaimed: boolean;
  boundaryVisible: boolean;
  repairSuggestions: string[];
  boundaryNotes: string[];
}

import { normalizeText } from "@avg/utils";

const strongWordPattern =
  /\b(always|never|guarantee(?:s|d)?|certain(?:ly)?|definite(?:ly)?|obvious(?:ly)?|every|all|everyone|everything|nothing|proves?|truth|perfect|exactly|essence|deep essence|understands?)\b/;
const certaintyPattern =
  /\b(literally|really|truly|undeniably|without doubt|for sure|obviously|certain(?:ly)?|proof|prove(?:s|d)?|guarantee(?:s|d)?)\b/;
const metaphorPattern = /\b(castle|hidden rooms|metaphor|as if|like a|story|analogy|symbol)\b/;
const mechanismPattern =
  /\b(because|via|through|by|how|mechanism|process|steps?|method|if|when)\b/;
const actionablePattern =
  /\b(next|step|steps|try|do|test|measure|apply|revise|approve|restore|compose)\b/;
const uncertaintyPattern =
  /\b(may|might|could|possible|possibly|perhaps|likely|seems|appears|hypothesis)\b/;
const scopePattern = /\b(scope|within|for this|in this context|only|limited to|mvp-\d)\b/;
const claimStatusPattern =
  /\b(hypothesis|metaphor_only|boundary_statement|working_distinction)\b/;

function hasDefinitionCue(text: string): boolean {
  return /\b(defined as|means|by this|in this sense|working hypothesis|scope|boundary)\b/.test(text);
}

function hasMechanismCue(text: string): boolean {
  return mechanismPattern.test(text);
}

function hasActionCue(text: string): boolean {
  return actionablePattern.test(text);
}

function hasScopeCue(text: string): boolean {
  return scopePattern.test(text);
}

function hasClaimStatusCue(text: string): boolean {
  return claimStatusPattern.test(text);
}

function collectStrongWordHits(text: string): string[] {
  const hits: string[] = [];

  for (const [pattern, label] of [
    [/\bunderstands?\b/, "understands"],
    [/\bdeep\s+essence\b/, "deep essence"],
    [/\balways\b/, "always"],
    [/\bnever\b/, "never"],
    [/\bguarantee(?:s|d)?\b/, "guarantee"],
    [/\bcertain(?:ly)?\b/, "certain"],
    [/\bdefinite(?:ly)?\b/, "definite"],
    [/\bobvious(?:ly)?\b/, "obvious"],
    [/\beveryone\b/, "everyone"],
    [/\beverything\b/, "everything"],
    [/\bnothing\b/, "nothing"],
    [/\bproves?\b/, "proves"],
    [/\btruth\b/, "truth"],
    [/\bperfect\b/, "perfect"],
    [/\bexactly\b/, "exactly"],
    [/\bessence\b/, "essence"],
  ] as Array<[RegExp, string]>) {
    if (pattern.test(text)) {
      hits.push(label);
    }
  }

  return hits;
}

export function fixtureRequiresBoundary(text: string): boolean {
  return text.includes("must_include_boundary: true");
}

export function scoreClaimSafetyAnswer(answer: string): ClaimSafetyEvalReport {
  const text = normalizeText(answer);
  const strongWordMarkers = collectStrongWordHits(text);
  const metaphorMarkers: string[] = [];
  const repairSuggestions = new Set<string>();
  const boundaryNotes: string[] = [];

  const hasStrongWords = strongWordPattern.test(text);
  const hasMetaphor = metaphorPattern.test(text);
  const hasBoundary = /\b(boundary|scope|model|working map|metaphor_only|hypothesis)\b/.test(text);
  const claimsLiteralStructure = /\b(literally|really|truly|is reality|is the truth)\b/.test(text);

  if (hasStrongWords) {
    if (!strongWordMarkers.includes("strong_word_substitution")) {
      strongWordMarkers.push("strong_word_substitution");
    }
    repairSuggestions.add("Replace absolute wording with a scoped hypothesis or explicit boundary.");
  }

  if (hasMetaphor) {
    metaphorMarkers.push("metaphor_detected");
    repairSuggestions.add("Mark the passage as metaphor_only or restate it as a model with scope.");
  }

  if (claimsLiteralStructure) {
    repairSuggestions.add("Separate the metaphor from the literal claim and name the boundary.");
  }

  if (!hasBoundary && hasMetaphor) {
    boundaryNotes.push("Metaphorical language needs an explicit boundary before it can be treated as a safe claim.");
    repairSuggestions.add("Add a boundary statement so the metaphor does not get read as fact.");
  }

  if (strongWordPattern.test(text) && !hasDefinitionCue(text)) {
    boundaryNotes.push("Strong words need definition, scope, or evidence before they become safe.");
  }

  const score = Math.max(
    0,
    Math.min(
      1,
      1 -
        (hasStrongWords && !hasDefinitionCue(text) ? 0.25 : 0) -
        (hasMetaphor && claimsLiteralStructure ? 0.35 : 0) -
        (!hasBoundary && hasMetaphor ? 0.2 : 0),
    ),
  );

  const passed =
    (!hasStrongWords || hasDefinitionCue(text)) &&
    (!hasMetaphor || hasBoundary) &&
    !claimsLiteralStructure;

  return {
    score,
    passed,
    strongWordMarkers,
    metaphorMarkers,
    literalStructureClaimed: claimsLiteralStructure,
    boundaryVisible: hasBoundary,
    repairSuggestions: [...repairSuggestions],
    boundaryNotes:
      boundaryNotes.length > 0
        ? boundaryNotes
        : ["The answer preserves claim-safety boundaries well enough for the eval gate."],
  };
}

export function scoreNoFairyTaleAnswer(answer: string): NoFairyTaleEvalReport {
  const text = normalizeText(answer);
  const failureSignals = new Set<string>();
  const rewardSignals = new Set<string>();

  if (strongWordPattern.test(text) && !hasDefinitionCue(text)) {
    failureSignals.add("strong_words_undefined");
  }

  if (metaphorPattern.test(text) && /\b(literally|really|truly|is reality|is the truth)\b/.test(text)) {
    failureSignals.add("metaphor_treated_as_fact");
  }

  if (!hasMechanismCue(text)) {
    failureSignals.add("no_mechanism");
  }

  if (
    (strongWordPattern.test(text) || metaphorPattern.test(text)) &&
    !hasActionCue(text)
  ) {
    failureSignals.add("not_actionable");
  }

  if (certaintyPattern.test(text) && !uncertaintyPattern.test(text)) {
    failureSignals.add("certainty_beyond_evidence");
  }

  if (hasScopeCue(text)) {
    rewardSignals.add("clear_scope");
  }

  if (metaphorPattern.test(text) && /\b(model|working map|as a model|as a map)\b/.test(text)) {
    rewardSignals.add("useful_creativity");
  }

  if (uncertaintyPattern.test(text)) {
    rewardSignals.add("explicit_uncertainty");
  }

  if (hasActionCue(text)) {
    rewardSignals.add("next_actions");
  }

  if (hasClaimStatusCue(text)) {
    rewardSignals.add("claim_status_markers");
  }

  const score = Math.max(
    0,
    Math.min(1, 1 - failureSignals.size * 0.2 + rewardSignals.size * 0.08),
  );

  return {
    score,
    passed: failureSignals.size === 0,
    failureSignals: [...failureSignals],
    rewardSignals: [...rewardSignals],
    boundaryNotes:
      failureSignals.size === 0
        ? ["The answer keeps the boundary visible enough for a no-fairy-tale gate pass."]
        : [
            "The answer needs more boundary discipline before it can pass the no-fairy-tale gate.",
          ],
  };
}
