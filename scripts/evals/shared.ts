import { readFileSync } from "node:fs";

export function extractFixtureInput(fixtureText: string): string {
  const lines = fixtureText.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => line.startsWith("input:"));

  if (startIndex === -1) {
    throw new Error("Fixture is missing an input block.");
  }

  const contentLines: string[] = [];

  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];

    if (line.startsWith("expected:") || line.startsWith("fail_if_contains:")) {
      break;
    }

    contentLines.push(line.replace(/^  /, ""));
  }

  return contentLines.join("\n").trim();
}

export function readTextFile(relativePath: string, fromUrl: string): string {
  return readFileSync(new URL(relativePath, fromUrl), "utf8");
}
