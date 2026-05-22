# Specification: Adaptive LLM Layer

**Status:** Draft
**Covers:** AVG-UTS-203, AVG-UTS-204 and LLM parts of AVG-UTS-205/207

## Purpose

LLM is an internal adaptive capability for routing, drafting and adequacy checking. It is never the final authority.

## Configuration

Environment variables:

```env
AVG_LLM_ADAPTIVE=false
OPENAI_API_KEY=
OPENAI_MODEL=
OPENAI_INTENT_MODEL=
OPENAI_ADEQUACY_MODEL=
AVG_LLM_TIMEOUT_MS=20000
AVG_LLM_MAX_RETRIES=2
```

Defaults:

- adaptive LLM disabled unless `AVG_LLM_ADAPTIVE=true`;
- tests run without external calls;
- missing key returns normalized unavailable state;
- model choice is recorded in admin trace when used.

## Provider Interface

```ts
export interface AdaptiveLlmProvider {
  classifyIntent(input: IntentClassificationRequest): Promise<IntentClassificationResult>;
  draftStructuredResponse(input: StructuredDraftRequest): Promise<StructuredDraftResult>;
  judgeAdequacy(input: AdequacyJudgeRequest): Promise<AdequacyResult>;
}
```

Provider outputs must be structured JSON. Free text is only allowed inside typed fields.

## Intent Classifier Output

```ts
export interface IntentClassificationResult {
  intent: IntentType;
  confidence: number;
  rationale: string;
  missingInputs: string[];
  safetyNotes: string[];
}
```

Rules:

- temperature should be `0` or near deterministic;
- low confidence routes to `unknown`;
- classifier may not answer the user;
- classifier may not request tool execution.

## Structured Draft Output

The draft must become `AvgStructuredResponse` after validation. Required generated fields:

- `summary`;
- `scope`;
- `claim_status`;
- `language_mode`;
- `validation_risk`;
- `risk_markers`;
- `map_territory_boundary`;
- `next_action`;
- optional artifact references.

If any field is missing, invalid or unsafe, the draft is rejected.

## Adequacy Judge Output

The judge evaluates:

- relevance to user task;
- faithfulness to provided context;
- helpfulness;
- AVG boundary preservation;
- source-grounding when sources are used.

The judge is not allowed to "fix" the answer. It returns score, risks and feedback for the graph.

## Raw Output Boundary

Raw LLM data can be stored only in admin debug trace when explicitly enabled. Default admin trace records:

- model;
- provider;
- latency;
- token estimate if available;
- normalized error;
- structured result status;
- redacted prompt summary.

User envelope never includes:

- raw prompt;
- raw provider response;
- hidden system messages;
- chain-of-thought or scratchpad;
- API keys or secrets.

## Prompt Safety

Before prompt assembly:

- use `@avg/security.preparePromptInput`;
- mark retrieved source text as untrusted source content;
- separate user instructions from source snippets;
- never let source snippets override system/developer/tool instructions.

## Fallback Matrix

| Condition | Behavior |
|---|---|
| `AVG_LLM_ADAPTIVE=false` | deterministic fallback path |
| missing API key | deterministic fallback with admin warning |
| provider timeout | retry if retryable, then deterministic fallback |
| invalid JSON | retry with validation error feedback |
| schema-valid but AVG-invalid | reject draft and fail safe |
| adequacy below threshold | retry or HITL depending on missing input |

## Tests And Evals

Required tests:

- disabled LLM path;
- missing key path;
- provider error normalization;
- invalid JSON retry;
- invalid AVG response rejection;
- prompt injection in user input;
- prompt injection in retrieved source;
- accepted structured output passes `validateAvgResponse`.

Required evals when prompts change:

- intent classification set;
- no-fairy-tale preservation;
- metaphor boundary preservation;
- unsupported claim refusal or `needs_evidence`.

