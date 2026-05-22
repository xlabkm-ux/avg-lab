import { describe, expect, it } from "vitest";
import { loadJsonFixture, resolveFixtureUrl, testkitPackageBoundary } from "../src/index";

describe("testkit package baseline", () => {
  it("declares the package boundary as a skeleton", () => {
    expect(testkitPackageBoundary).toEqual({
      packageName: "@avg/testkit",
      implementationStatus: "skeleton",
      capabilities: ["fixture_resolution", "fixture_loading", "test_helpers"],
      dependsOnAppCode: false
    });
  });

  it("resolves and loads package fixtures", () => {
    expect(resolveFixtureUrl("sample.json").pathname).toContain("/tests/fixtures/sample.json");
    expect(loadJsonFixture<{ id: string; label: string }>("sample.json")).toEqual({
      id: "fixture_001",
      label: "AVG testkit sample fixture"
    });
  });
});
