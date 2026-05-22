# Specification: Unified Dialogue API Boundary

**Status:** Draft
**Covers:** AVG-UTS-105, AVG-UTS-501, AVG-UTS-502

## Purpose

Expose one stable Dialogue endpoint for the user task loop while preserving existing document, retrieval, map and artifact endpoints.

## Endpoint

```http
POST /dialogue/respond
content-type: application/json
```

Request:

```ts
export interface DialogueRespondRequest {
  projectId: string;
  sessionId: string;
  input: string;
  locale?: "ru" | "en";
  selectedText?: string;
  activeSurface?: "dialogue" | "documents" | "retrieval" | "claim-review" | "map" | "artifacts";
  resumeRunId?: string;
  hitlAnswer?: unknown;
}
```

Response:

```ts
export interface DialogueRespondEnvelope {
  status: "ok" | "needs_action" | "error";
  state: UserTaskState;
  response: AvgStructuredResponse | null;
  run: TaskRunSummary;
  hitl: HitlRequest | null;
  suggestions: SurfaceSuggestion[];
  warnings: DialogueWarning[];
  source: "deterministic" | "adaptive_llm" | "mixed";
}
```

## Error Envelope

```ts
export interface DialogueErrorEnvelope {
  status: "error";
  code:
    | "EMPTY_INPUT"
    | "INVALID_JSON"
    | "INVALID_ROUTE_ID"
    | "PROJECT_SESSION_MISMATCH"
    | "LLM_UNAVAILABLE"
    | "LLM_OUTPUT_REJECTED"
    | "VALIDATION_FAILED"
    | "RUN_NOT_FOUND"
    | "RUN_NOT_RESUMABLE"
    | "INTERNAL_ERROR";
  message: string;
  state: UserTaskState;
  run?: TaskRunSummary;
  details: Record<string, unknown>;
}
```

## Surface Suggestions

```ts
export interface SurfaceSuggestion {
  surface: "documents" | "retrieval" | "claim-review" | "map" | "artifacts";
  reason: string;
  actionLabel: string;
  payload?: Record<string, unknown>;
}
```

Rules:

- `needs_evidence` suggests Documents or Retrieval;
- `map_ready` suggests Map;
- `artifact_ready` suggests Artifacts;
- `answer_ready` may suggest Claim Review when risk is medium or higher.

## API Placement

Initial route:

- `apps/api/src/routes/index.ts`, then split if route grows.

Core orchestration:

- `packages/avg-agents` for graph logic;
- `@avg/openai` for provider boundary;
- `@avg/security` for input safety;
- `@avg/validation` for response and claim gates.

## Compatibility

Existing endpoints remain:

- `GET /health`;
- `GET/POST /projects/:id/documents`;
- `POST /projects/:id/retrieval/search`;
- grounded retrieval/page helper routes until replaced.

The new endpoint should not break MVP-5 UI during incremental rollout.

## Contract Tests

Required:

- empty input;
- safe deterministic response;
- LLM unavailable;
- invalid LLM output;
- HITL clarification;
- guided choice;
- surface suggestions;
- project/session mismatch;
- prompt injection blocked.

