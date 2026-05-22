# Sprint Backlog

This backlog covers the approved MVP-0 to MVP-3 development plan.

## Sprint 0: MVP-0 Repository Operating System

Goal: make the repository executable, testable and safe for agent work.

| Task | Owner | Parallel | Risk | Output |
|---|---|---:|---|---|
| AVG-001 | Architect | no | red | package contracts and dependency direction confirmed |
| AVG-002 | DevOps | yes | yellow | root CI runs install, lint, typecheck and test |
| AVG-003 | Backend | yes | yellow | TypeScript package configs and build scripts |
| AVG-004 | QA | yes | yellow | baseline testkit and schema validation command |
| AVG-005 | Docs | yes | green | onboarding and first-task docs updated |

Model budget:

| Task | Tier | Model | Approval |
|---|---|---|---|
| AVG-001 | strong | `gpt-5.5` | sprint approval required |
| AVG-002 | minimal | `gpt-5.4-mini` | automatic after sprint approval |
| AVG-003 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-004 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-005 | minimal | `gpt-5.4-mini` | automatic after sprint approval |

Exit criteria:

- root checks pass;
- CI mirrors local checks;
- task protocol includes context budget;
- MVP-1 tasks are ready.

## Sprint 1: MVP-1 Backend Dialogue Slice

Goal: expose the minimal structured dialogue path through API.

| Task | Owner | Parallel | Risk | Output |
|---|---|---:|---|---|
| AVG-101 | Architect | no | red | structured response contract approved |
| AVG-102 | Backend | no | yellow | project/session/message API |
| AVG-103 | Backend | yes | yellow | OpenAI adapter boundary with normalized errors |
| AVG-104 | Backend | yes | yellow | mode router and response composer |
| AVG-105 | QA | yes | yellow | API contract and smoke tests |

Model budget:

| Task | Tier | Model | Approval |
|---|---|---|---|
| AVG-101 | strong | `gpt-5.5` | sprint approval required |
| AVG-102 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-103 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-104 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-105 | standard | `gpt-5.4` | automatic after sprint approval |

Exit criteria:

- API returns structured AVG response;
- provider errors are normalized;
- response contract tests pass.

## Sprint 2: MVP-1 Web Dialogue Slice

Goal: make the first user-facing dialogue path usable.

| Task | Owner | Parallel | Risk | Output |
|---|---|---:|---|---|
| AVG-201 | Frontend | yes | yellow | minimal project/session UI |
| AVG-202 | Frontend | yes | yellow | dialogue message surface |
| AVG-203 | Frontend | yes | yellow | structured response details panel |
| AVG-204 | QA | yes | yellow | E2E smoke test for first dialogue |
| AVG-205 | Docs | yes | green | MVP-1 usage notes |

Model budget:

| Task | Tier | Model | Approval |
|---|---|---|---|
| AVG-201 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-202 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-203 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-204 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-205 | minimal | `gpt-5.4-mini` | automatic after sprint approval |

Exit criteria:

- user can submit a raw idea;
- UI shows structured AVG output;
- smoke path is covered by test.

## Sprint 3: MVP-2 Validation Core

Goal: extract and classify claims from AVG responses.

Claim validation contract baseline: `docs/02-ai-system/claim-validation-contract.md`.

| Task | Owner | Parallel | Risk | Output |
|---|---|---:|---|---|
| AVG-301 | Architect | no | red | claim validation contract freeze |
| AVG-302 | Validation | no | red | claim extraction and schema validation |
| AVG-303 | Validation | yes | yellow | claim status and language mode classifier |
| AVG-304 | Validation | yes | yellow | risk classifier and repair suggestions |
| AVG-305 | QA | yes | yellow | unit and contract tests |

Model budget:

| Task | Tier | Model | Approval |
|---|---|---|---|
| AVG-301 | strong | `gpt-5.5` | sprint approval required |
| AVG-302 | strong | `gpt-5.5` | sprint approval required |
| AVG-303 | strong | `gpt-5.5` | sprint approval required |
| AVG-304 | strong | `gpt-5.5` | sprint approval required |
| AVG-305 | standard | `gpt-5.4` | automatic after sprint approval |

Exit criteria:

- claim validation contract is frozen;
- claims validate against JSON Schema;
- risk and repair fields are produced;
- contract tests pass.

## Sprint 4: MVP-2 Eval and Validation UX/API

Goal: prove AVG claim discipline with evals and visible validation output.

| Task | Owner | Parallel | Risk | Output |
|---|---|---:|---|---|
| AVG-401 | Validation | no | red | No Fairy Tale Gate |
| AVG-402 | QA | yes | yellow | metaphor boundary and claim safety evals |
| AVG-403 | Backend | yes | yellow | validation API integration |
| AVG-404 | Frontend | yes | yellow | minimal validation panel |
| AVG-405 | Docs | yes | green | behavior ledger and release notes |

Model budget:

| Task | Tier | Model | Approval |
|---|---|---|---|
| AVG-401 | strong | `gpt-5.5` | sprint approval required |
| AVG-402 | review | `gpt-5.5` | sprint approval required |
| AVG-403 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-404 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-405 | minimal | `gpt-5.4-mini` | automatic after sprint approval |

Exit criteria:

- critical eval thresholds pass;
- validation output is visible to the user;
- behavior changes are documented.

## Sprint 5: MVP-3 Concept Map

Goal: turn validated terms and claims into a disciplined visual concept map.

Status: completed.

| Task | Owner | Parallel | Risk | Output |
|---|---|---:|---|---|
| AVG-501 | Architect | no | red | MVP-3 concept map contract freeze |
| AVG-502 | Knowledge Graph | yes | yellow | graph model projections and repository surface |
| AVG-503 | Backend | yes | yellow | map diff artifact API and sync helpers |
| AVG-504 | Frontend | yes | yellow | concept map canvas and React Flow-ready shell |
| AVG-505 | QA | yes | yellow | graph, API and UI contract smoke tests |

Model budget:

| Task | Tier | Model | Approval |
|---|---|---|---|
| AVG-501 | strong | `gpt-5.5` | sprint approval required |
| AVG-502 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-503 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-504 | standard | `gpt-5.4` | automatic after sprint approval |
| AVG-505 | standard | `gpt-5.4` | automatic after sprint approval |

Exit criteria:

- MVP-3 concept map contract is approved;
- graph projections preserve node coordinates and boundary metadata;
- concept map shell can render a validated graph projection;
- map diff artifact shape is covered by tests;
- Sprint 5 was activated and completed after the planning gate was cleared.

Completion note:

- Sprint 5 completed with AVG-501 through AVG-505 done and verified;
- package-level smoke coverage, root `pnpm test:contract`, `pnpm typecheck`, and `pnpm test` all passed.
