# Specification: Task Run, HITL And Admin Trace

**Status:** Draft
**Covers:** AVG-UTS-103, AVG-UTS-301, AVG-UTS-302, AVG-UTS-305, AVG-UTS-606

## Purpose

Every user task becomes a Task Run. A Task Run is the auditable execution record that supports user progress, admin debugging, suspend/resume and cost tracking.

## Task Run Model

```ts
export interface TaskRun {
  id: string;
  projectId: string;
  sessionId: string;
  status: "pending" | "running" | "suspended" | "completed" | "failed";
  userState: UserTaskState;
  selectedPatternId: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  events: TaskRunEvent[];
}
```

Events are append-only.

```ts
export interface TaskRunEvent {
  id: string;
  runId: string;
  timestamp: string;
  visibility: "user" | "admin" | "hidden";
  type:
    | "task_accepted"
    | "node_started"
    | "node_completed"
    | "risk_detected"
    | "llm_attempt"
    | "tool_call"
    | "hitl_requested"
    | "resumed"
    | "validation_failed"
    | "completed"
    | "failed_safe";
  status: "pending" | "active" | "completed" | "needs_action" | "warning" | "error";
  label: string;
  details?: Record<string, unknown>;
}
```

## User Timeline

User timeline is derived from `visibility: "user"` events.

Labels should be product-language, not internal node names:

- "Задача принята";
- "Уточняю смысл";
- "Выбираю способ решения";
- "Проверяю границы утверждений";
- "Ищу основания";
- "Жду вашего ответа";
- "Готовлю результат";
- "Готово".

## Admin Trace

Admin trace may include:

- task id;
- node name;
- intent classification;
- selected pattern;
- adequacy status;
- validation results;
- normalized provider errors;
- token estimates;
- tool execution status.

Admin trace must not include by default:

- API keys;
- secrets;
- raw system/developer prompts;
- raw LLM output;
- private chain-of-thought.

Raw debug capture requires explicit debug mode and must be redacted before export.

## HITL Requests

```ts
export type HitlRequest =
  | { type: "needs_clarification"; question: string; contextSnippet?: string }
  | { type: "guided_choice"; question: string; options: GuidedChoiceOption[] }
  | { type: "needs_evidence"; entity: string; description: string; uploadAllowed: boolean }
  | { type: "action_approval"; actionName: string; payload: Record<string, unknown>; riskLevel: "low" | "high" };
```

Rules:

- ask at most 3 clarification questions;
- options must be mutually exclusive when possible;
- show implication for each guided choice;
- action approval is required for red-zone tools;
- destructive tools remain disabled until a separate security approval.

## Suspend/Resume

MVP implementation:

- in-memory TaskRunStore;
- suspended state survives only process lifetime;
- response envelope includes `run.status = "suspended"` and HITL request;
- resume request references `runId` and user answer.

Future production implementation:

- persistent store;
- TTL;
- archive;
- resumable worker.

## Pattern Promotion

Adaptive or modified patterns use lifecycle:

- `seed`;
- `project_local_candidate`;
- `project_approved`;
- `deprecated`.

Promotion to global seed requires:

- admin review;
- pattern quality gate;
- eval coverage;
- changelog entry.

## Tests

- event append order is stable;
- user timeline hides admin details;
- admin trace redacts unsafe fields;
- suspended run resumes from HITL answer;
- completed runs cannot be mutated except by archival metadata;
- action approval request does not execute tool before approval.

