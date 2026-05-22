# Daily Agent Brief

## Important Notice: Documentation Reorganization

The `.codex` directory has been reorganized for better navigation and maintainability.

**What changed:**
- Documents are now organized in numbered categories (00-fundamentals, 01-operating-model, etc.)
- Task cards moved to `war-room/tasks/` subdirectory
- New extracted documents: `definition-of-done.md`, `handoff-protocol.md`, `context-budget.md`
- Main entry point: [.qoder/README.md](../README.md)

**See details:** [docs/adr/ADR-002-reorganize-codex-documentation.md](../../docs/adr/ADR-002-reorganize-codex-documentation.md)

**Updated paths:**
- Sprint backlog: [sprint-backlog.md](sprint-backlog.md) (unchanged location)
- Model policy: [../02-sprint-management/model-policy.md](../02-sprint-management/model-policy.md)
- Task protocols: [../02-sprint-management/task-protocol.md](../02-sprint-management/task-protocol.md)
- Agent execution: [../04-agent-execution/agent-execution-matrix.md](../04-agent-execution/agent-execution-matrix.md)

---

## Current Mission

Phase 5 is active: build a fully usable AVG browser interface from the completed MVP-0 through MVP-4 contract slices.

Approved plan:

- `docs/00-product/mvp-5-working-interface-plan.md`
- [sprint-backlog.md](sprint-backlog.md)
- [project-backlog-progress.md](project-backlog-progress.md)
- [../02-sprint-management/model-policy.md](../02-sprint-management/model-policy.md)

Deferred boundary:

- `docs/00-product/mvp-6-advanced-services-plan.md`

Completed prior work is archived at:

- `.qoder/war-room/archive/mvp-0-to-mvp-3-2026-05-20/`
- `.qoder/war-room/archive/mvp-4-sprint-6-2026-05-20/`

## Current Sprint

Active sprint: `Sprint 7`.

Current gate:

- `AVG-701` is complete: the MVP-5 interface contract and UI API boundary are frozen.
- `AVG-702`, `AVG-703` and `AVG-704` are ready to proceed against the frozen workspace, state and API boundaries.

Execution rule:

- MVP-5 must deliver a working interface, not isolated helper functions.
- UI must preserve claim status, language mode, validation risk, source citations and map/territory boundaries.
- Do not add voice, realtime collaboration, production vector storage, OCR, external ingestion or heavy background services.
- MVP-6 is deferred and must not be deeply designed during MVP-5.

## Active Branches

| Agent | Branch | Task | Approved Model | Risk | Status |
|---|---|---|---|---|---|
| Architect/Product | agent/architect/AVG-701-interface-contract | MVP-5 interface contract | gpt-5.5 | red | done |
| Frontend | agent/frontend/AVG-702-workspace-shell | workspace shell and local state | gpt-5.4 | yellow | ready |
| Frontend/Validation | agent/frontend/AVG-703-dialogue-surface | structured dialogue surface | gpt-5.4 | red | ready |
| Frontend/Backend | agent/frontend/AVG-704-document-workspace | document workspace | gpt-5.4 | yellow | ready |

## Shared Contracts Under Freeze

- Structured AVG response schema.
- Claim validation schema.
- Retrieval grounding contract.
- Concept map schema.
- MVP-5 interface contract until AVG-701 completes.

## Red Zones

Do not edit without owner:

- `schemas/json-schema/claim.schema.json`;
- `schemas/json-schema/avg-response.schema.json`;
- `schemas/openapi/openapi.yaml`;
- `prompts/system/base.md`;
- production database or vector index configuration;
- any audio, speech or realtime collaboration dependency.

## Open Decisions

- MVP-5 frontend architecture and state boundary.
- Whether project/session state remains memory-only or uses browser local storage for MVP-5.
- Exact artifact export formats for MVP-5.
- Production vector database selection remains deferred to MVP-6 or later.
- Voice and realtime collaboration remain deferred to MVP-6.

## Context Watch

| Task | Agent | Context | Risk | Action |
|---|---|---|---|---|
| AVG-701 | Architect/Product | green | interface contract sprawl | done |
| AVG-702 | Frontend | green | UI shell without product behavior | wait for AVG-701 boundaries |
| AVG-703 | Frontend/Validation | green | chatbot-wrapper regression | render structured response and claim discipline |
| AVG-704 | Frontend/Backend | green | document scope leakage | keep project-local document boundary visible |

## Model Watch

| Task | Agent | Approved Model | Escalation |
|---|---|---|---|
| AVG-701 | Architect/Product | `gpt-5.5` | human approval |
| AVG-702 | Frontend | `gpt-5.4` | only if interface contract blocks |
| AVG-703 | Frontend/Validation | `gpt-5.4` | only if schema or validation contracts change |
| AVG-704 | Frontend/Backend | `gpt-5.4` | only if API contracts change |
