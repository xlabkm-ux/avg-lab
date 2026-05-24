import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
import { validateAvgResponse } from "@avg/schemas";
import { loadErMap } from "../src/er-map-loader";
import { createErMapIndex } from "../src/er-map-index";
import { generateDialogueResponse } from "../src/dialogue-engine";

const ER_MAP_ROOT = resolve(__dirname, "../../../er-map");

describe("dialogue-engine", () => {
  const { entries } = loadErMap(ER_MAP_ROOT);
  const index = createErMapIndex(entries);

  const baseInput = {
    projectId: "project_test",
    sessionId: "session_test",
    messageId: "msg_001",
  };

  it("generates valid response for 'Что такое Реальность?'", () => {
    const response = generateDialogueResponse(
      { ...baseInput, query: "Что такое Реальность?" },
      index
    );

    // Must pass schema validation
    const validation = validateAvgResponse(response);
    expect(validation.valid).toBe(true);

    // Summary should contain er-map definition
    expect(response.summary).toContain("Предельная рамка ЭР");

    // Claim status should be working_distinction (per term's allowed_language)
    expect(response.claim_status).toBe("working_distinction");

    // Must have correct IDs
    expect(response.project_id).toBe("project_test");
    expect(response.session_id).toBe("session_test");
  });

  it("generates valid response for term with risks (нетвёрдое)", () => {
    const response = generateDialogueResponse(
      { ...baseInput, query: "Что такое нетвёрдое?" },
      index
    );

    const validation = validateAvgResponse(response);
    expect(validation.valid).toBe(true);

    // Should have risk markers from common_substitutions
    expect(response.risk_markers.length).toBeGreaterThan(0);
    expect(response.risk_markers).toContain("term_reification");

    // Validation risk should be elevated
    expect(["medium", "high"]).toContain(response.validation_risk);
  });

  it("generates boundary response for no-match query", () => {
    const response = generateDialogueResponse(
      { ...baseInput, query: "qqzxwvbnm fghtkl pqrstuvw" },
      index
    );

    const validation = validateAvgResponse(response);
    expect(validation.valid).toBe(true);

    // Should indicate no match boundary
    expect(response.summary).toContain("рабочая граница");
    expect(response.map_territory_boundary).toBe("preserved");
  });

  it("all generated responses pass validateAvgResponse", () => {
    const queries = [
      "Что такое Реальность?",
      "Мир как целое",
      "вложенность уровней",
      "нетвёрдое",
      "Вселенная материальная",
      "крестик жизни",
      "что значит бытийность",
      "непонятный запрос без смысла 12345",
    ];

    for (const query of queries) {
      const response = generateDialogueResponse(
        { ...baseInput, query, messageId: `msg_${query.slice(0, 10)}` },
        index
      );
      const validation = validateAvgResponse(response);
      expect(validation.valid, `Failed for query: "${query}"`).toBe(true);
    }
  });

  it("derives scope from entry coordinates", () => {
    const response = generateDialogueResponse(
      { ...baseInput, query: "Вселенная" },
      index
    );

    expect(response.scope).toContain("universe");
    expect(response.scope).toContain("knowable");
  });

  it("question detection works for 'Что такое' pattern", () => {
    const response = generateDialogueResponse(
      { ...baseInput, query: "Что такое Вселенная?" },
      index
    );

    // For questions with a strong single match, summary gets the "В рамках карты ЭР" prefix
    expect(response.summary).toContain("В рамках карты ЭР");
    // Valid response
    const validation = validateAvgResponse(response);
    expect(validation.valid).toBe(true);
  });
});
