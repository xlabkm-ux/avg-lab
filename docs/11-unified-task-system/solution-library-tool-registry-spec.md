# Specification: Solution Library And Tool Registry

**Status:** Draft
**Covers:** AVG-UTS-401 through AVG-UTS-407, AVG-UTS-604, AVG-UTS-605

## Purpose

Solution Library turns repeated AVG work into typed, reviewable patterns. The LLM may select or assemble patterns, but cannot invent unchecked capabilities.

## Solution Pattern Contract

```ts
export interface SolutionPattern {
  id: string;
  title: string;
  description: string;
  lifecycle: "seed" | "project_local_candidate" | "project_approved" | "deprecated";
  intents: IntentType[];
  requiredInputs: PatternInputRequirement[];
  steps: SolutionStep[];
  expectedOutputs: PatternOutput[];
  risks: PatternRisk[];
  boundaryRules: string[];
}
```

```ts
export interface SolutionStep {
  id: string;
  kind: "deterministic" | "llm_structured" | "tool" | "hitl" | "validation" | "surface_handoff";
  label: string;
  toolName?: string;
  inputSchemaId?: string;
  outputSchemaId?: string;
  onFailure: "retry" | "hitl" | "fail_safe";
}
```

## Seed Patterns

Required seed patterns:

- `develop_idea`: clarify scope, generate alternatives, classify claims, suggest next move;
- `verify_claim`: extract claims, check evidence, classify risk, suggest repairs;
- `build_map`: extract entities and claims, project graph, offer map surface;
- `create_artifact`: gather material, validate boundaries, format artifact;
- `request_evidence`: search project documents, separate cited facts from interpretations;
- `resolve_contradiction`: compare claims, expose assumptions, propose validation path;
- `clarify_criteria`: ask targeted HITL questions and resume.

## Pattern Matching

Inputs:

- intent;
- confidence;
- user state;
- available documents;
- available map context;
- task risks;
- user-selected HITL answers.

Output:

```ts
export interface PatternMatchResult {
  status: "matched" | "ambiguous" | "no_match";
  selectedPatternId?: string;
  alternatives: Array<{ patternId: string; rationale: string; implication: string }>;
  rationale: string;
}
```

Ambiguous matches route to guided choice.

## Tool Registry

```ts
export interface AvgToolDefinition {
  name: string;
  description: string;
  permission: "safe" | "review" | "red_zone";
  inputSchema: unknown;
  outputSchema: unknown;
  boundaryNotes: string[];
}
```

Initial tools:

| Tool | Permission | Purpose |
|---|---|---|
| `search_project_context` | safe | search project documents and snippets |
| `extract_claims` | safe | extract checkable claims |
| `generate_map_structure` | safe | build graph snapshot from validated claims |
| `format_to_artifact` | safe | format existing material without changing meaning |
| `request_user_clarification` | review | suspend and ask user |
| `request_evidence` | review | guide user to Documents |
| `update_project_status` | red_zone | future only, requires approval |
| `delete_artifact` | red_zone | future only, requires approval |

Red-zone tools are declared to support architecture, but not executed in MVP.

## Adaptive Pattern Generator

Deferred until Phase UTS-6.

Allowed:

- assemble a candidate process from registered tools and step kinds;
- explain scope, risks and expected outputs;
- save candidate as `project_local_candidate`.

Forbidden:

- invent new tools;
- invent new permission levels;
- bypass HITL for red-zone actions;
- produce executable code;
- promote itself to seed.

## Quality Gate

A pattern is accepted only if it has:

- clear goal;
- explicit scope;
- required inputs;
- expected outputs;
- failure behavior for every step;
- boundary rules;
- tests or eval plan;
- no unknown tools;
- no untyped JSON outputs.

## Tests

- seed pattern contract validation;
- matcher returns deterministic result for known intent;
- ambiguous match returns guided choice options;
- unknown tool rejects pattern;
- red-zone tool creates HITL approval request;
- adaptive candidate cannot be promoted without review.

