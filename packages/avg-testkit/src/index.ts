import { readFileSync } from "node:fs";

export type TestkitCapability = "fixture_resolution" | "fixture_loading" | "test_helpers";

export interface TestkitPackageBoundary {
  packageName: "@avg/testkit";
  implementationStatus: "skeleton";
  capabilities: readonly TestkitCapability[];
  dependsOnAppCode: false;
}

export const testkitPackageBoundary: TestkitPackageBoundary = {
  packageName: "@avg/testkit",
  implementationStatus: "skeleton",
  capabilities: ["fixture_resolution", "fixture_loading", "test_helpers"],
  dependsOnAppCode: false
};

export function resolveFixtureUrl(relativePath: string): URL {
  return new URL(`../tests/fixtures/${relativePath}`, import.meta.url);
}

export function loadJsonFixture<T>(relativePath: string): T {
  return JSON.parse(readFileSync(resolveFixtureUrl(relativePath), "utf8")) as T;
}
