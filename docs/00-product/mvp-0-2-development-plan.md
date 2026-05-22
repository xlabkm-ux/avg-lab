# MVP-0 to MVP-2 Development Plan

## Purpose

This document is the agreed development plan for the first pragmatic AVG implementation cycle.

The goal is to turn the current blueprint repository into a working vertical product slice:

```text
repository operating system -> structured dialogue -> claim validation
```

The plan intentionally postpones visual maps, retrieval, voice, complex deployment and multi-user collaboration until the core AVG behavior is real and testable.

## Product Principle

AVG must not become a simple chatbot wrapper.

Every important generated answer must preserve:

- scope;
- claim status;
- language mode;
- validation risk;
- map/territory boundary.

Prompts may guide behavior, but schemas, validators, tests and evals must enforce the contract.

## Scope

The approved scope covers:

- MVP-0: repository operating system;
- MVP-1: core text dialogue;
- MVP-2: claim validation engine;
- minimal UI needed to verify the flow;
- minimal local developer setup;
- tests, contracts and evals required for the changed behavior.

## Non-Scope

The following are explicitly deferred:

- visual concept map UI;
- Neo4j production graph integration;
- document upload and retrieval;
- source-grounded RAG answers;
- voice and realtime collaboration;
- production authentication;
- complex deployment automation;
- broad observability dashboards.

These areas may receive interface placeholders only when they reduce rework for MVP-0 to MVP-2.

## Milestone Plan

### MVP-0: Repository Operating System

Goal: Codex agents and human developers can work safely in the monorepo.

Deliverables:

- package-level TypeScript setup;
- root workspace scripts that run successfully;
- baseline CI;
- schema validation command;
- test runner setup;
- package ownership docs;
- first task cards for MVP-1 and MVP-2.

Definition of Done:

- `pnpm install` succeeds;
- `pnpm lint` succeeds;
- `pnpm typecheck` succeeds;
- `pnpm test` succeeds;
- CI runs the same core checks;
- no package depends against the documented dependency direction.

### MVP-1: Core Dialogue

Goal: a user can create a project, start a session and receive a structured AVG response.

Deliverables:

- project/session/message API;
- minimal local persistence;
- OpenAI adapter boundary;
- mode router;
- response composer;
- structured response schema;
- minimal web dialogue surface;
- smoke tests for the dialogue path.

Definition of Done:

- user can submit a raw thought through UI or API;
- AVG returns a structured response with scope, claim status, language mode and risk markers;
- provider errors are normalized by the API;
- no business rule is hidden only in prompt text;
- contract tests cover the response shape.

### MVP-2: Claim Validation

Goal: AVG can extract claims, classify risk and repair weak statements against a frozen claim contract.

Deliverables:

- claim validation contract freeze;
- claim extraction pipeline;
- claim status classifier;
- metaphor boundary classifier;
- strong-word and overclaiming detector;
- repair suggestions;
- No Fairy Tale Gate;
- validation API;
- minimal validation panel or structured response section;
- AI eval fixtures and thresholds for critical behavior.

Definition of Done:

- claim validation contract is frozen and documented;
- extracted claims conform to `schemas/json-schema/claim.schema.json`;
- validation risks are visible in API/UI output;
- repair suggestions preserve uncertainty instead of flattening creativity;
- claim safety, metaphor boundary and no-fairy-tale evals pass release thresholds;
- behavior ledger is updated for prompt or validation behavior changes.

## Sprint Plan

The pragmatic default is a one-week sprint cadence while the project is small. If implementation velocity is lower, each sprint can be stretched to two weeks without changing scope.

| Sprint | Milestone | Focus | Exit Criteria |
|---|---|---|---|
| Sprint 0 | MVP-0 | Monorepo, CI, package configs, schema/test commands | root checks pass locally and in CI |
| Sprint 1 | MVP-1 | API, OpenAI adapter, structured response contract | API returns structured AVG response |
| Sprint 2 | MVP-1 | Minimal web dialogue and smoke tests | user can complete first dialogue path |
| Sprint 3 | MVP-2 | Claim extraction, status, risks, unit/contract tests | claim contract is frozen and claims validate against schema |
| Sprint 4 | MVP-2 | No Fairy Tale Gate, evals, repair suggestions, validator UI/API | critical eval thresholds pass |

## Agent Work Model

Contract changes are sequential. Implementation tasks inside stable contracts may run in parallel.

Model usage is controlled by `.codex/model-policy.md`. Sprint approval includes a model budget for each task. Agents must not silently switch to a stronger model; escalation requires human approval.

Sequential path:

```text
Architect contract decision
  -> schema and type updates
  -> API contract updates
  -> backend implementation
  -> frontend integration
  -> QA/eval gates
```

Parallel-safe work:

- package README updates;
- isolated package implementation after contracts are approved;
- tests that do not change shared fixtures;
- UI components against mocked stable contracts;
- documentation and runbook updates.

Not parallel-safe without owner approval:

- JSON Schema changes;
- OpenAPI changes;
- prompt behavior changes;
- ClaimStatus or language mode enum changes;
- database migrations;
- security controls.

## Dependency Map

MVP-1 depends on MVP-0 package and CI readiness.

MVP-2 depends on MVP-1 structured response contracts and `avg-core` types.

The concept map milestone depends on MVP-2 because the map must store disciplined terms and claims, not plain chat fragments.

## Context Management

Codex agents must treat context as a managed resource.

Each task card must declare:

```yaml
context_budget:
  target_docs:
    - AGENTS.md
    - .codex/mission.md
  max_files_to_open: 12
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
```

Context status:

- `green`: task is bounded, required files are known, no summary required yet;
- `yellow`: many files or contracts are in play, agent must write a short handoff summary before continuing;
- `red`: scope is too broad, task must be split or escalated.

Because Codex context percentage is not a stable project API, the project tracks context operationally through file count, touched contexts, task risk and required handoff summaries.

## Model Budget Management

The project uses model tiers to control cost:

- `minimal` for docs, task cards, simple configs and simple fixtures;
- `standard` for normal single-package implementation and tests;
- `strong` for architecture, shared schemas, OpenAPI, validation logic, prompt behavior and security;
- `review` for final PR review and eval interpretation.

Each sprint backlog declares the default model per task. Escalation to a stronger model requires a human-approved escalation note.

## Quality Gates

Every PR must report:

- tests run;
- contract checks run;
- AI evals run, if AI behavior changed;
- affected contracts;
- risks;
- rollback plan.

Release is blocked by:

- failing critical tests;
- failing schema validation;
- AI eval threshold below gate;
- prompt behavior change without eval and behavior ledger update;
- unreviewed shared contract change.

## Decision Points

Human approval is required before:

- changing public schemas or API contracts;
- adding production dependencies;
- changing prompt behavior that affects claim discipline;
- introducing persistent database migrations;
- moving from local/simple storage to production data services;
- starting MVP-3 visual concept map work.

## Rollback and Replan Rules

Rollback a PR when it weakens claim discipline, breaks contracts, or cannot explain its behavior with tests/evals.

Replan a sprint when a task touches more than three bounded contexts or requires more than one PR.

Defer features that require retrieval, graph visualization, voice or production auth before MVP-2 is complete.
