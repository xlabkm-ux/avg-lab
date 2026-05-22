# Project Backlog Progress

This file is the live progress view for the approved backlog.

Source of truth for scope:

- `.qoder/war-room/sprint-backlog.md`
- `.qoder/war-room/daily-agent-brief.md`
- `.qoder/agent-execution-matrix.md`

Status legend:

- `ready`: approved and not started;
- `in progress`: active work exists in the current war-room state;
- `blocked`: cannot continue without decision or upstream work;
- `done`: completed and verified against the task definition of done;
- `deferred`: planned for a later approved milestone.

## Snapshot

| Area | Progress | Current State |
|---|---:|---|
| Sprint 0: Repository Operating System | 5 / 5 done | AVG-001, AVG-002, AVG-003, AVG-004 and AVG-005 are done |
| Sprint 1: Backend Dialogue Slice | 5 / 5 done | all Sprint 1 tasks are done and validated |
| Sprint 2: Web Dialogue Slice | 5 / 5 done | all Sprint 2 tasks are done and validated |
| Sprint 3: Validation Core | 5 / 5 done | AVG-301, AVG-302, AVG-303, AVG-304 and AVG-305 are done |
| Sprint 4: Validation UX/API | 5 / 5 done | claim-safety, metaphor boundary, validation API, validation panel and behavior docs are complete |
| Sprint 5: Concept Map | 5 / 5 done | AVG-501 concept map contract freeze, AVG-502 graph projection surface, AVG-503 map diff artifact API, AVG-504 concept map shell and AVG-505 QA smoke coverage are done |

## Sprint 0: MVP-0 Repository Operating System

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-001 | Architect | done | 100% | package contracts and dependency direction are confirmed in the package map and root checks pass |
| AVG-002 | DevOps | done | 100% | CI baseline mirrors root install, lint, typecheck, test and build commands |
| AVG-003 | Backend | done | 100% | `@avg/openai` package baseline exists; build, lint, typecheck, unit tests and root checks pass locally |
| AVG-004 | QA | done | 100% | `@avg/testkit` exists and `validate:schemas` passes against the schema contract suite |
| AVG-005 | Docs | done | 100% | backlog progress dashboard exists; onboarding and first-task docs are published and current |

Exit criteria:

- root checks pass;
- CI mirrors local checks;
- task protocol includes context budget;
- MVP-1 tasks are ready.

Current exit status: `done`.

## Sprint 1: MVP-1 Backend Dialogue Slice

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-101 | Architect | done | 100% | structured response contract approved and validated with schema, API and workspace checks |
| AVG-102 | Backend | done | 100% | project/session/message API is implemented and validated with package, root and workspace checks |
| AVG-103 | Backend | done | 100% | OpenAI adapter boundary with normalized errors is implemented and validated with package and workspace checks |
| AVG-104 | Backend | done | 100% | mode router and response composer are implemented and validated with package and workspace checks |
| AVG-105 | QA | done | 100% | API contract and smoke tests are implemented and validated with package and workspace checks |

## Sprint 2: MVP-1 Web Dialogue Slice

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-201 | Frontend | done | 100% | minimal project/session UI is implemented and validated with package and workspace checks |
| AVG-202 | Frontend | done | 100% | dialogue message surface is implemented and validated with package and workspace checks |
| AVG-203 | Frontend | done | 100% | structured response details panel is implemented and validated with package and workspace checks |
| AVG-204 | QA | done | 100% | first dialogue smoke test is implemented and validated with package and workspace checks |
| AVG-205 | Docs | done | 100% | MVP-1 web usage notes and example flow are documented |

## Sprint 3: MVP-2 Validation Core

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-301 | Architect | done | 100% | claim validation contract is frozen in `docs/02-ai-system/claim-validation-contract.md` and Sprint 3 can advance |
| AVG-302 | Validation | done | 100% | claim extraction and schema validation are implemented in `packages/avg-validation` and verified with unit, typecheck and build checks |
| AVG-303 | Validation | done | 100% | claim status and language mode classifier is implemented in `packages/avg-validation` and verified with unit, typecheck and build checks |
| AVG-304 | Validation | done | 100% | risk classifier and repair suggestions are implemented in `packages/avg-validation` and verified with unit, typecheck and build checks |
| AVG-305 | QA | done | 100% | unit and contract coverage for the validation package is implemented and verified with package and root checks |

## Sprint 4: MVP-2 Eval and Validation UX/API

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-401 | Validation | done | 100% | No Fairy Tale Gate is implemented in `packages/avg-evals` with package and root eval checks passing |
| AVG-402 | QA | done | 100% | claim-safety and metaphor-boundary evals are implemented with fixture-backed checks and root eval gates passing |
| AVG-403 | Backend | done | 100% | `validateClaimRequest` is exposed in `apps/api` and covered by the API smoke test suite |
| AVG-404 | Frontend | done | 100% | structured validation output is rendered in `apps/web` through the details panel and smoke tests |
| AVG-405 | Docs | done | 100% | behavior ledger and release notes capture the Sprint 4 validation and eval changes |

## Sprint 5: MVP-3 Concept Map

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-501 | Architect | done | 100% | concept map contract freeze is written against the existing graph schema surface and aligned with `@avg/schemas` |
| AVG-502 | Knowledge Graph | done | 100% | graph projection and in-memory repository surface are implemented and validated with package and root checks |
| AVG-503 | Backend | done | 100% | map diff artifact API and sync helpers are implemented on top of `diffGraphSnapshots()` |
| AVG-504 | Frontend | done | 100% | concept map shell and React Flow-ready boundary are implemented with package and root checks |
| AVG-505 | QA | done | 100% | graph, API and UI smoke coverage is implemented and verified with package and root checks |

## Update Rules

- Update this file when a task moves between `ready`, `in progress`, `blocked`, `done` or `deferred`.
- Keep scope changes in `.qoder/war-room/sprint-backlog.md`; keep progress changes here.
- Every `done` task must list the checks or review evidence that closed it.
- Every non-`done` task must state the objective blocker, missing dependency or concrete remaining work in the Evidence / Next Step column.
- If a task has no objective blocker and the required checks already pass, move it to `done` instead of leaving it `ready` or `in progress`.
