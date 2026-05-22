# Specification: State Graph Orchestrator

**Status:** Draft
**Covers:** AVG-UTS-201, AVG-UTS-202, AVG-UTS-205, AVG-UTS-206

## Purpose

Replace ad hoc dialogue routing with a typed State Graph that can route, retry, suspend, validate and safely fail.

The graph is not a generic autonomous agent. It is a controlled task runner that preserves AVG epistemic boundaries at every node.

## State Contract

```ts
export interface TaskState {
  taskId: string;
  projectId: string;
  sessionId: string;
  userInput: string;
  locale: "ru" | "en";
  messages: TaskMessage[];
  context: TaskContext;
  currentIntent: IntentType | null;
  selectedPatternId: string | null;
  draftResponse: unknown;
  validatedResponse: AvgStructuredResponse | null;
  userState: UserTaskState;
  risks: TaskRisk[];
  adequacy: AdequacyResult | null;
  iterationCount: number;
  nextNode: GraphNodeName | "END" | "SUSPEND";
}
```

Required invariants:

- `taskId`, `projectId` and `sessionId` are stable for the whole run;
- every mutation appends a Task Run event;
- `iterationCount` cannot exceed the configured circuit breaker limit;
- `validatedResponse` exists only after schema and AVG validation pass;
- `draftResponse` is never returned to user directly.

## Graph Nodes

| Node | Type | Responsibility | Failure Behavior |
|---|---|---|---|
| `IntakeNode` | deterministic | sanitize input, detect prompt risk, detect empty input | stop or ask clarification |
| `IntentClassifierNode` | LLM or deterministic fallback | classify task intent with strict JSON | retry invalid JSON, fallback to `unknown` |
| `PatternMatcherNode` | deterministic | choose seed solution pattern | guided choice or no-pattern fallback |
| `ExecutionNode` | graph/subgraph | run selected pattern steps and safe tools | append risk and continue to adequacy |
| `AdequacyGateNode` | LLM-as-judge or deterministic fallback | score relevance, faithfulness and usefulness | retry or fail safe |
| `ValidationNode` | deterministic | validate `AvgStructuredResponse` and AVG claim boundaries | fail safe if invalid |
| `HITLNode` | suspend | request clarification, evidence, choice or approval | set `SUSPEND` |
| `FinalizeNode` | deterministic | create user envelope and next useful move | return response |
| `CircuitBreakerNode` | deterministic | stop loops and unsafe retries | deterministic fallback |

## Routing Rules

- Empty or unsafe input cannot reach `IntentClassifierNode`.
- `unknown` intent routes to `HITLNode` unless a safe smalltalk/out-of-scope response applies.
- Any tool requiring approval routes to `HITLNode`.
- Low adequacy score can retry at most twice before `CircuitBreakerNode`.
- Validation failure never returns raw draft.

## Adequacy Gate

Minimum fields:

```ts
export interface AdequacyResult {
  status: "adequate" | "incomplete" | "uncertain" | "invalid";
  score: number;
  feedback: string;
  risks: TaskRisk[];
}
```

Default thresholds:

- `score >= 0.75`: adequate;
- `0.5 <= score < 0.75`: uncertain, may ask clarification or retry;
- `score < 0.5`: incomplete or invalid;
- schema-invalid result: invalid regardless of score.

## Circuit Breaker

Default limits:

- max LLM structured-output retries: 2;
- max graph iterations per task: 5;
- max tool calls per run in MVP: 8;
- max suspended lifetime in in-memory MVP: current browser/API process only.

On breaker trip, return:

- `userState: "failed_safe"`;
- no raw draft;
- a Russian fallback explaining the boundary;
- a next useful move, usually clarification or smaller task split.

## Package Placement

Preferred initial package:

- `packages/avg-agents/src/state-graph/*`

Allowed dependencies:

- `@avg/schemas`;
- `@avg/validation`;
- `@avg/security`;
- `@avg/openai` only through provider interfaces;
- `@avg/utils`.

Forbidden dependencies:

- app UI code;
- browser APIs;
- production storage drivers in initial MVP.

## Tests

Required:

- intake blocks critical prompt injection;
- unknown intent produces `needs_clarification`;
- invalid LLM JSON retries and then fails safe;
- low adequacy triggers retry and then circuit breaker;
- validated response preserves AVG boundaries;
- no test requires a real OpenAI key.

