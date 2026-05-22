# Daily Agent Brief

## Current Mission

Build AVG MVP-0 to MVP-3: repository operating system, structured dialogue, claim validation and concept map.

Approved plan:

- `docs/00-product/mvp-0-2-development-plan.md`
- `.qoder/war-room/sprint-backlog.md`
- `.qoder/war-room/project-backlog-progress.md`
- `.qoder/agent-execution-matrix.md`
- `.qoder/model-policy.md`

## Current Sprint

Active sprint: `none`

Current gate:

- Sprint 5 complete

Approved gate:

- `AVG-505` - graph, API and UI smoke coverage

Execution rule:

- keep completed Sprint 5 work documented and avoid reopening MVP-3 unless a new task is approved.

## Active Branches

| Agent | Branch | Task | Approved Model | Risk | Status |
|---|---|---|---|---|---|
| Architect | agent/architect/AVG-001-contracts | package contracts | gpt-5.5 | red | done |
| Architect | agent/architect/AVG-101-structured-response-contract | structured response contract | gpt-5.5 | red | done |
| Backend | agent/backend/AVG-102-project-session-message-api | project/session/message API | gpt-5.4 | yellow | done |
| Backend | agent/backend/AVG-103-openai-adapter-boundary | OpenAI adapter boundary | gpt-5.4 | yellow | done |
| Backend | agent/backend/AVG-104-mode-router-response-composer | mode router and response composer | gpt-5.4 | yellow | done |
| QA | agent/qa/AVG-105-api-contract-smoke-tests | API contract and smoke tests | gpt-5.4 | yellow | done |
| Frontend | agent/frontend/AVG-201-minimal-project-session-ui | minimal project/session UI | gpt-5.4 | yellow | done |
| Frontend | agent/frontend/AVG-202-dialogue-message-surface | dialogue message surface | gpt-5.4 | yellow | done |
| Frontend | agent/frontend/AVG-203-structured-response-details-panel | structured response details panel | gpt-5.4 | yellow | done |
| QA | agent/qa/AVG-204-first-dialogue-smoke-test | first dialogue smoke test | gpt-5.4 | yellow | done |
| Docs | agent/docs/AVG-205-mvp1-usage-notes | MVP-1 usage notes | gpt-5.4-mini | green | done |
| Backend | agent/backend/AVG-003-package-configs | TypeScript package configs and build scripts | gpt-5.4 | yellow | done |
| DevOps | agent/devops/AVG-002-ci-baseline | CI baseline | gpt-5.4-mini | yellow | done |
| Docs | agent/docs/AVG-005-backlog-progress | project backlog progress view | gpt-5.4-mini | green | done |
| QA | agent/qa/AVG-004-schema-validation | testkit/schema validation | gpt-5.4 | yellow | done |

## Shared Contracts Under Freeze

- ClaimStatus enum.
- ConceptMapNode schema.
- ToolCallResult schema.
- Structured AVG response schema until AVG-101 is approved.

## Red Zones

Do not edit without owner:

- `packages/avg-validation/src/schemas`;
- `schemas/json-schema/claim.schema.json`;
- `schemas/openapi/openapi.yaml`;
- `database migrations`;
- `prompts/system/base.md`.

## Open Decisions

- Should metaphor detection be rule-first, model-first, or hybrid?
- What minimal persistence should MVP-1 use: in-memory, file-backed or local Postgres?
- Which model routing policy should MVP-1 use for local development?

## Context Watch

| Task | Agent | Context | Risk | Action |
|---|---|---|---|---|
| AVG-001 | Architect | green | contract spread | done |
| AVG-002 | DevOps | green | CI churn | done |
| AVG-004 | QA | green | fixtures may become shared contract | done |

## Model Watch

| Task | Agent | Approved Model | Escalation |
|---|---|---|---|
| AVG-001 | Architect | `gpt-5.5` | done |
| AVG-101 | Architect | `gpt-5.5` | done |
| AVG-102 | Backend | `gpt-5.4` | done |
| AVG-103 | Backend | `gpt-5.4` | done |
| AVG-104 | Backend | `gpt-5.4` | done |
| AVG-105 | QA | `gpt-5.4` | done |
| AVG-201 | Frontend | `gpt-5.4` | done |
| AVG-202 | Frontend | `gpt-5.4` | done |
| AVG-203 | Frontend | `gpt-5.4` | done |
| AVG-204 | QA | `gpt-5.4` | done |
| AVG-205 | Docs | `gpt-5.4-mini` | done |
| AVG-002 | DevOps | `gpt-5.4-mini` | done |
| AVG-004 | QA | `gpt-5.4` | done |
