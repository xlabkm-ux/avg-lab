# AVG Unified Task System - Expanded Plan

**Status:** Draft for owner review
**Date:** 2026-05-22
**Supersedes planning drafts:** `docs/99-doc/Open AI PLAN.md`, `docs/99-doc/Open AI CONCEPT + PLAN.md`
**Uses architecture input:** `docs/99-doc/Архитектурные Спецификации AVG.md`, `docs/99-doc/Аудит концепции AVG.md`
**Current product baseline:** MVP-5 interface is partially complete; artifact export, E2E hardening and release documentation remain open.

## Executive Decision

AVG should move from "workspace with panels" toward **Unified Task System** only after MVP-5 closure.

The new plan keeps the product principle from the concept document:

> User controls the meaning of the task. AVG controls the process of solving it.

The plan also accepts the audit correction:

- build the orchestrator as a typed State Graph, not a monolithic deterministic router;
- introduce the LLM provider boundary early enough to test real intent routing;
- keep raw LLM output behind AVG validation;
- postpone free-form Adaptive Solution Generator until seed patterns, tool permissions and HITL are stable;
- keep RU as the dialogue language; UI i18n is useful, but not earlier than the core task loop.

## Baseline And Constraints

Already available:

- `@avg/schemas`: claim status, language mode, validation risk, map/territory boundary and document contracts;
- `@avg/validation`: claim extraction, risk classification, repair suggestions and grounded response reports;
- `@avg/retrieval`: local document registration, chunking and deterministic search;
- `@avg/graph`: claim-to-map projections and snapshot diff;
- `@avg/security`: deterministic prompt safety primitives;
- `@avg/openai`: provider error normalization and adapter boundary, but not a real adaptive response provider yet;
- `apps/api`: modular API routes for documents and retrieval;
- `apps/web`: modular workspace surfaces for dialogue, documents, retrieval, claim review and map.

Non-negotiable constraints:

- every important answer preserves `scope`, `claim_status`, `language_mode`, `validation_risk` and `map_territory_boundary`;
- LLM is a draft generator and router, not a source of truth;
- raw LLM output is never shown as final user answer;
- prompt text, tool permissions and AI behavior changes require evals;
- adaptive process generation can only assemble pre-approved tools and steps;
- production storage, auth, realtime collaboration and external ingestion remain out of scope unless explicitly approved.

## Strategy Change From Earlier Plan

The earlier draft placed i18n and deterministic dialogue before LLM. The new sequence changes this:

1. Finish MVP-5 closure first, because the current interface still lacks artifact export and hardening.
2. Freeze Unified Task contracts before implementation.
3. Build State Graph + LLM provider boundary together, because intent routing without LLM would create disposable heuristics.
4. Add Task Run timeline and HITL early, so every graph pause, risk and retry has a visible product shape.
5. Implement seed Solution Patterns before any adaptive generator.
6. Add cross-surface guidance and artifacts after the orchestration loop is stable.
7. Put UI i18n and adaptive pattern generation into later controlled phases.

## Phase Overview

| Phase | Focus | Plan Tokens | Status | Primary Specs |
|---|---:|---:|---|---|
| UTS-0 | MVP-5 closure and readiness gate | 35,000 | pending | MVP-5 docs, QA specs |
| UTS-1 | Product contracts and data model freeze | 95,000 | pending | Product, Task Run, API specs |
| UTS-2 | State Graph orchestrator and adaptive LLM core | 210,000 | pending | State Graph, LLM specs |
| UTS-3 | Task Run, HITL and progress surfaces | 170,000 | pending | Task Run/HITL, UX specs |
| UTS-4 | Seed Solution Library and tool registry | 185,000 | pending | Solution Library, security specs |
| UTS-5 | Unified API and cross-surface guidance | 145,000 | pending | API, UX specs |
| UTS-6 | Controlled advanced capabilities | 140,000 | pending | i18n, adaptive pattern rules |
| UTS-7 | E2E hardening, evals, docs and release | 130,000 | pending | QA/security rollout |
| **Total** | | **1,110,000** | pending | |

## Phase UTS-0: MVP-5 Closure And Readiness Gate

Goal: close the current interface work before building the agentic layer.

| Task | Owner | Risk | Output | Plan Tokens | Spec |
|---|---|---|---|---:|---|
| AVG-708 | Frontend/Product | yellow | Artifact workspace and JSON/Markdown export | 6,000 | `mvp-5-working-interface-plan.md` |
| AVG-713 | Frontend | yellow | UI polish pass for existing surfaces | 5,000 | `quality-security-rollout-spec.md` |
| AVG-714 | Docs/Product | green | Product landing/positioning page | 3,000 | `quality-security-rollout-spec.md` |
| AVG-709 | QA | red | MVP-5 happy path E2E | 8,000 | `quality-security-rollout-spec.md` |
| AVG-710 | QA/Security | red | Prompt-injection-as-source proof | 6,000 | `quality-security-rollout-spec.md` |
| AVG-711 | Frontend/QA | yellow | Visual and accessibility smoke | 4,000 | `quality-security-rollout-spec.md` |
| AVG-712 | Product/Release | yellow | Release notes, risk review, rollback plan | 3,000 | `quality-security-rollout-spec.md` |

Exit criteria:

- user can complete dialogue -> documents -> retrieval -> map -> artifact;
- all existing MVP-5 quality gates pass;
- known local-only limitations are documented;
- no UTS implementation starts until MVP-5 closure is accepted.

## Phase UTS-1: Product Contracts And Data Model Freeze

Goal: make Unified Task System executable by agents without ambiguity.

| Task | Owner | Risk | Output | Plan Tokens | Spec |
|---|---|---|---|---:|---|
| AVG-UTS-101 | Product/Architect | red | Unified Dialogue product contract | 18,000 | `product-contract.md` |
| AVG-UTS-102 | Product/Validation | yellow | Intent taxonomy and user state taxonomy | 15,000 | `product-contract.md` |
| AVG-UTS-103 | Architect | red | TaskState, TaskRun and event contracts | 22,000 | `task-run-hitl-spec.md` |
| AVG-UTS-104 | Architect/Security | red | Product boundary and refusal contract | 14,000 | `quality-security-rollout-spec.md` |
| AVG-UTS-105 | Backend/API | yellow | Unified response envelope contract | 16,000 | `api-boundary-spec.md` |
| AVG-UTS-106 | QA | yellow | Contract tests and schema fixtures plan | 10,000 | `quality-security-rollout-spec.md` |

Exit criteria:

- all public shapes are documented before implementation;
- any schema change has owner approval;
- "smalltalk", out-of-scope and safety refusal states are typed;
- Task Run events separate user timeline from admin trace.

## Phase UTS-2: State Graph Orchestrator And Adaptive LLM Core

Goal: prove that AVG can route a natural-language task through a controlled graph.

| Task | Owner | Risk | Output | Plan Tokens | Spec |
|---|---|---|---|---:|---|
| AVG-UTS-201 | Backend/Architect | red | Minimal State Graph engine and node contracts | 38,000 | `state-graph-orchestrator-spec.md` |
| AVG-UTS-202 | Security/Backend | red | Intake node with prompt safety and input normalization | 24,000 | `state-graph-orchestrator-spec.md` |
| AVG-UTS-203 | AI/Backend | red | OpenAI adaptive provider boundary with config | 32,000 | `adaptive-llm-layer-spec.md` |
| AVG-UTS-204 | AI/Validation | red | LLM intent classifier with strict structured output | 34,000 | `adaptive-llm-layer-spec.md` |
| AVG-UTS-205 | Validation/AI | red | Adequacy gate and self-correction loop | 36,000 | `state-graph-orchestrator-spec.md` |
| AVG-UTS-206 | Backend | yellow | Circuit breaker and deterministic fallback | 22,000 | `state-graph-orchestrator-spec.md` |
| AVG-UTS-207 | QA/Evals | red | LLM disabled, no-key, invalid JSON and low-score tests | 24,000 | `quality-security-rollout-spec.md` |

Exit criteria:

- graph can run intake -> intent -> pattern match -> execution stub -> adequacy -> final;
- invalid LLM output is retried and then safely stopped;
- no raw prompt or raw response is returned to user;
- OpenAI dependency is isolated behind `@avg/openai`;
- tests pass with LLM disabled.

## Phase UTS-3: Task Run, HITL And Progress Surfaces

Goal: make task execution understandable and resumable.

| Task | Owner | Risk | Output | Plan Tokens | Spec |
|---|---|---|---|---:|---|
| AVG-UTS-301 | Backend | red | In-memory TaskRunStore with append-only events | 28,000 | `task-run-hitl-spec.md` |
| AVG-UTS-302 | Backend/Architect | red | Suspend/resume contract for clarification and choice | 32,000 | `task-run-hitl-spec.md` |
| AVG-UTS-303 | Frontend/Product | yellow | User Progress Center | 32,000 | `ux-surface-guidance-spec.md` |
| AVG-UTS-304 | Frontend/Product | yellow | HITL action cards for clarification, guided choice and evidence | 30,000 | `ux-surface-guidance-spec.md` |
| AVG-UTS-305 | Frontend/Admin | red | Admin Run Console with safe trace view | 34,000 | `task-run-hitl-spec.md` |
| AVG-UTS-306 | QA | yellow | Timeline, suspend/resume and trace tests | 14,000 | `quality-security-rollout-spec.md` |

Exit criteria:

- every dialogue request creates a Task Run;
- user sees only useful progress states;
- admin sees node-level trace without secrets by default;
- suspended runs can resume from user input;
- action approval is typed, but destructive tools remain disabled until later approval.

## Phase UTS-4: Seed Solution Library And Tool Registry

Goal: turn orchestration into repeatable task-solving patterns.

| Task | Owner | Risk | Output | Plan Tokens | Spec |
|---|---|---|---|---:|---|
| AVG-UTS-401 | Architect/Product | red | `SolutionPattern`, `SolutionStep` and lifecycle types | 28,000 | `solution-library-tool-registry-spec.md` |
| AVG-UTS-402 | Product/AI | yellow | Seed patterns: develop idea, verify claim, build map, create artifact, request evidence | 34,000 | `solution-library-tool-registry-spec.md` |
| AVG-UTS-403 | Backend | yellow | Pattern matcher using intent, signals and context | 26,000 | `solution-library-tool-registry-spec.md` |
| AVG-UTS-404 | Security/Backend | red | Tool registry with safe/red-zone permission model | 30,000 | `solution-library-tool-registry-spec.md` |
| AVG-UTS-405 | Backend/Validation | red | Tool quality gate: inputs, outputs, claim boundary and risk checks | 28,000 | `solution-library-tool-registry-spec.md` |
| AVG-UTS-406 | Backend | yellow | Project-local pattern store for approved seed variants | 22,000 | `solution-library-tool-registry-spec.md` |
| AVG-UTS-407 | QA/Evals | red | Pattern matching, tool permission and rejection tests | 17,000 | `quality-security-rollout-spec.md` |

Exit criteria:

- graph routes to a seed pattern, not arbitrary generated logic;
- tools have typed schemas and permission level;
- red-zone tools only produce HITL approval requests;
- project-local patterns cannot become global seed patterns without review.

## Phase UTS-5: Unified API And Cross-Surface Guidance

Goal: make Dialogue the single entry point while preserving Documents, Map and Artifacts as first-class surfaces.

| Task | Owner | Risk | Output | Plan Tokens | Spec |
|---|---|---|---|---:|---|
| AVG-UTS-501 | Backend/API | red | `POST /dialogue/respond` endpoint | 32,000 | `api-boundary-spec.md` |
| AVG-UTS-502 | Backend/API | yellow | Response envelope: response, state, run, warnings, suggestions | 24,000 | `api-boundary-spec.md` |
| AVG-UTS-503 | Frontend | yellow | React Dialogue integration with unified endpoint | 28,000 | `ux-surface-guidance-spec.md` |
| AVG-UTS-504 | Frontend/Product | yellow | Next useful move UI | 22,000 | `ux-surface-guidance-spec.md` |
| AVG-UTS-505 | Frontend/Retrieval | yellow | `needs_evidence` -> Documents flow | 16,000 | `ux-surface-guidance-spec.md` |
| AVG-UTS-506 | Frontend/Graph | yellow | `map_ready` -> Map flow | 12,000 | `ux-surface-guidance-spec.md` |
| AVG-UTS-507 | Frontend/Product | yellow | `artifact_ready` -> Artifacts flow | 11,000 | `ux-surface-guidance-spec.md` |

Exit criteria:

- user can start in Dialogue and be guided to the right surface;
- Dialogue does not become a long-text dumping ground;
- source, claim and boundary metadata survive surface transitions;
- API errors are normalized and UI-renderable.

## Phase UTS-6: Controlled Advanced Capabilities

Goal: add useful advanced behavior only after core orchestration is stable.

| Task | Owner | Risk | Output | Plan Tokens | Spec |
|---|---|---|---|---:|---|
| AVG-UTS-601 | Frontend | yellow | Typed `Locale = ru/en` and dictionary infrastructure | 18,000 | `ux-surface-guidance-spec.md` |
| AVG-UTS-602 | Frontend | yellow | RU/EN UI toggle with local persistence | 18,000 | `ux-surface-guidance-spec.md` |
| AVG-UTS-603 | Product/QA | yellow | UI-only language tests and limitation docs | 14,000 | `quality-security-rollout-spec.md` |
| AVG-UTS-604 | AI/Architect | red | Adaptive pattern generator as tool assembly only | 34,000 | `solution-library-tool-registry-spec.md` |
| AVG-UTS-605 | Validation/Security | red | Adaptive pattern quality gate and review workflow | 30,000 | `solution-library-tool-registry-spec.md` |
| AVG-UTS-606 | Backend/Admin | yellow | Pattern promotion/deprecation admin flow | 26,000 | `task-run-hitl-spec.md` |

Exit criteria:

- UI language toggle changes only interface labels;
- generated responses remain in Russian unless a future translation layer is explicitly approved;
- adaptive pattern generator cannot invent new tool capabilities;
- generated patterns begin as `project_local_candidate`.

## Phase UTS-7: E2E Hardening, Evals, Docs And Release

Goal: make the Unified Task System safe enough for external testing.

| Task | Owner | Risk | Output | Plan Tokens | Spec |
|---|---|---|---|---:|---|
| AVG-UTS-701 | QA | red | E2E: task -> clarification -> answer -> progress | 24,000 | `quality-security-rollout-spec.md` |
| AVG-UTS-702 | QA/Security | red | E2E: invalid LLM output never shown raw | 22,000 | `quality-security-rollout-spec.md` |
| AVG-UTS-703 | QA/Security | red | E2E: prompt injection in source text | 20,000 | `quality-security-rollout-spec.md` |
| AVG-UTS-704 | QA | yellow | E2E: solution pattern match and guided surface handoff | 18,000 | `quality-security-rollout-spec.md` |
| AVG-UTS-705 | QA/Frontend | yellow | Visual and accessibility smoke for progress/HITL/admin | 16,000 | `quality-security-rollout-spec.md` |
| AVG-UTS-706 | Docs/Product | yellow | User and developer documentation update | 16,000 | `quality-security-rollout-spec.md` |
| AVG-UTS-707 | Product/Release | yellow | Release notes, known limitations and rollback | 14,000 | `quality-security-rollout-spec.md` |

Exit criteria:

- all mandatory quality gates pass;
- AI evals cover prompt or model behavior changes;
- release notes state that AVG is a map-making and map-checking system, not a truth machine;
- rollback plan can disable LLM/adaptive features while preserving deterministic MVP-5 surfaces.

## Spec Coverage Matrix

| Spec | Covers |
|---|---|
| `docs/11-unified-task-system/product-contract.md` | AVG-UTS-101, AVG-UTS-102 |
| `docs/11-unified-task-system/state-graph-orchestrator-spec.md` | AVG-UTS-201, AVG-UTS-202, AVG-UTS-205, AVG-UTS-206 |
| `docs/11-unified-task-system/adaptive-llm-layer-spec.md` | AVG-UTS-203, AVG-UTS-204, LLM parts of AVG-UTS-205 and AVG-UTS-207 |
| `docs/11-unified-task-system/task-run-hitl-spec.md` | AVG-UTS-103, AVG-UTS-301, AVG-UTS-302, AVG-UTS-305, AVG-UTS-606 |
| `docs/11-unified-task-system/solution-library-tool-registry-spec.md` | AVG-UTS-401 through AVG-UTS-407, AVG-UTS-604, AVG-UTS-605 |
| `docs/11-unified-task-system/api-boundary-spec.md` | AVG-UTS-105, AVG-UTS-501, AVG-UTS-502 |
| `docs/11-unified-task-system/ux-surface-guidance-spec.md` | AVG-UTS-303, AVG-UTS-304, AVG-UTS-503 through AVG-UTS-507, AVG-UTS-601, AVG-UTS-602 |
| `docs/11-unified-task-system/quality-security-rollout-spec.md` | UTS-0, AVG-UTS-106, AVG-UTS-207, AVG-UTS-306, AVG-UTS-407, AVG-UTS-603, AVG-UTS-701 through AVG-UTS-707 |

## Required Quality Gates

For docs-only planning tasks:

```powershell
git diff --check
```

For code tasks:

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm test:contract
pnpm test:ai
pnpm build
```

For UI tasks:

```powershell
pnpm test:e2e
pnpm test:visual
pnpm test:a11y
```

For prompt, model or LLM behavior changes:

```powershell
pnpm test:ai
pnpm test:prompt-regression
pnpm test:no-fairy-tale
pnpm test:claim-safety
```

## Rollback Strategy

- LLM can be disabled with `AVG_LLM_ADAPTIVE=false`.
- Unified endpoint can return deterministic MVP-5 structured responses while graph work is paused.
- Task Run UI can show only completed deterministic steps if admin trace is unavailable.
- Solution Library can be restricted to seed patterns only.
- Adaptive pattern generator must be feature-flagged and disabled by default until reviewed.
