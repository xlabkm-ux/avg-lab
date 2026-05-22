import assert from "node:assert/strict";
import { readTextFile } from "./shared.ts";

const prompt = readTextFile("../../prompts/evals/no-fairy-tale-judge.md", import.meta.url);

assert.ok(prompt.includes("strong words are undefined"));
assert.ok(prompt.includes("metaphor is treated as fact"));
assert.ok(prompt.includes("clear scope"));
assert.ok(prompt.includes("claim status markers"));

console.log("prompt regression gate passed");
