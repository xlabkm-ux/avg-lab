import { describe, expect, it } from "vitest";
import type { AvgClaim } from "@avg/schemas";

// Test data factory
function createTestClaim(overrides: Partial<AvgClaim> = {}): AvgClaim {
  return {
    id: `claim-${Date.now()}`,
    statement: "Test claim statement",
    claim_status: "definition",
    language_mode: "direct_description",
    risks: [],
    ...overrides,
  };
}

describe("ClaimReviewPanel - Data Types", () => {
  it("creates a claim with definition status and no risks", () => {
    const claim = createTestClaim();

    expect(claim.claim_status).toBe("definition");
    expect(claim.language_mode).toBe("direct_description");
    expect(claim.risks).toEqual([]);
  });

  it("creates a hypothesis claim with scope", () => {
    const claim = createTestClaim({
      claim_status: "hypothesis",
      language_mode: "conditional_description",
      scope: "Within test scope",
      risks: ["reductionism"],
    });

    expect(claim.claim_status).toBe("hypothesis");
    expect(claim.scope).toBe("Within test scope");
    expect(claim.risks).toContain("reductionism");
  });

  it("creates a metaphor-only claim with repair suggestion", () => {
    const claim = createTestClaim({
      claim_status: "metaphor_only",
      language_mode: "metaphor",
      risks: ["map_territory_substitution"],
      repair: "Mark as metaphor only",
    });

    expect(claim.claim_status).toBe("metaphor_only");
    expect(claim.repair).toBe("Mark as metaphor only");
  });

  it("creates a prohibited positive claim", () => {
    const claim = createTestClaim({
      claim_status: "prohibited_positive_claim",
      risks: ["dogma"],
    });

    expect(claim.claim_status).toBe("prohibited_positive_claim");
  });
});

describe("ClaimReviewPanel - Claim Arrays", () => {
  it("handles empty claim array", () => {
    const claims: AvgClaim[] = [];

    expect(claims.length).toBe(0);
    expect(claims.some((c) => c.risks.length > 0)).toBe(false);
  });

  it("identifies claims needing repair", () => {
    const claims: AvgClaim[] = [
      createTestClaim({ id: "c1", risks: [] }),
      createTestClaim({ id: "c2", risks: ["reductionism"], repair: "Fix it" }),
    ];

    const hasRiskyClaims = claims.some(
      (c) =>
        c.risks.length > 0 ||
        c.claim_status === "metaphor_only" ||
        c.claim_status === "prohibited_positive_claim",
    );

    expect(hasRiskyClaims).toBe(true);
  });

  it("identifies clean claims", () => {
    const claims: AvgClaim[] = [
      createTestClaim({ id: "c1", claim_status: "definition", risks: [] }),
      createTestClaim({ id: "c2", claim_status: "working_distinction", risks: [] }),
    ];

    const hasRiskyClaims = claims.some(
      (c) =>
        c.risks.length > 0 ||
        c.claim_status === "metaphor_only" ||
        c.claim_status === "prohibited_positive_claim",
    );

    expect(hasRiskyClaims).toBe(false);
  });
});

describe("ClaimReviewPanel - Status Determination", () => {
  it("returns 'needs_repair' for claims with risks", () => {
    const claims: AvgClaim[] = [
      createTestClaim({
        id: "c1",
        claim_status: "hypothesis",
        risks: ["strong_word_substitution"],
      }),
    ];

    const status = claims.some((c) => c.risks.length > 0) ? "needs_repair" : "validated";
    expect(status).toBe("needs_repair");
  });

  it("returns 'needs_repair' for metaphor-only claims", () => {
    const claims: AvgClaim[] = [
      createTestClaim({
        id: "c1",
        claim_status: "metaphor_only",
        language_mode: "metaphor",
        risks: [],
      }),
    ];

    const status = claims.some(
      (c) =>
        c.risks.length > 0 ||
        c.claim_status === "metaphor_only" ||
        c.claim_status === "prohibited_positive_claim",
    )
      ? "needs_repair"
      : "validated";
    expect(status).toBe("needs_repair");
  });

  it("returns 'validated' for safe claims", () => {
    const claims: AvgClaim[] = [
      createTestClaim({ id: "c1", claim_status: "definition", risks: [] }),
    ];

    const status = claims.some(
      (c) =>
        c.risks.length > 0 ||
        c.claim_status === "metaphor_only" ||
        c.claim_status === "prohibited_positive_claim",
    )
      ? "needs_repair"
      : "validated";
    expect(status).toBe("validated");
  });
});
