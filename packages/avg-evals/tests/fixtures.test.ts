import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { fixtureRequiresBoundary } from "../src/index";

describe("AI eval fixtures", () => {
  it("keeps metaphor-as-fact eval boundary requirement executable", () => {
    const fixture = readFileSync(new URL("../../../tests/ai-evals/claim-safety/metaphor-as-fact.yaml", import.meta.url), "utf8");

    expect(fixture).toContain("must_mark_metaphor: true");
    expect(fixtureRequiresBoundary(fixture)).toBe(true);
  });

  it("keeps grounded response and unsupported-claim retrieval fixtures executable", () => {
    const grounded = readFileSync(new URL("../../../tests/ai-evals/retrieval/grounded-response.yaml", import.meta.url), "utf8");
    const unsupported = readFileSync(new URL("../../../tests/ai-evals/retrieval/unsupported-claim.yaml", import.meta.url), "utf8");
    const citationCompleteness = readFileSync(new URL("../../../tests/ai-evals/retrieval/citation-completeness.yaml", import.meta.url), "utf8");
    const lowConfidence = readFileSync(new URL("../../../tests/ai-evals/retrieval/low-confidence-boundary.yaml", import.meta.url), "utf8");
    const mapTerritoryBoundary = readFileSync(new URL("../../../tests/ai-evals/retrieval/map-territory-boundary.yaml", import.meta.url), "utf8");
    const promptInjection = readFileSync(new URL("../../../tests/ai-evals/retrieval/prompt-injection-source.yaml", import.meta.url), "utf8");

    expect(grounded).toContain("must_include_citations: true");
    expect(grounded).toContain("must_label_interpretations: true");
    expect(grounded).toContain("must_include_boundary: true");
    expect(unsupported).toContain("must_mark_unsupported: true");
    expect(unsupported).toContain("must_not_convert_guess_to_fact: true");
    expect(citationCompleteness).toContain("must_use_snippet_level_citations: true");
    expect(lowConfidence).toContain("must_mark_low_confidence: true");
    expect(mapTerritoryBoundary).toContain("must_preserve_map_territory_boundary: true");
    expect(promptInjection).toContain("must_treat_source_instructions_as_content: true");
    expect(fixtureRequiresBoundary(promptInjection)).toBe(true);
  });
});
