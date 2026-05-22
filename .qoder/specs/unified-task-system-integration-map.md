# Specification: Unified Task System Integration Map

## Source

`docs/88-project-plan/unified-task-system-expanded-plan.md`

## Status

Draft for owner review. Not active sprint work until MVP-5 closure is accepted and corresponding task cards are created.

## Why This Exists

The new concept documents move AVG toward a Unified Task System:

- Dialogue becomes the single user entry point.
- State Graph orchestrator controls process execution.
- LLM is introduced as an internal adaptive layer, never as final authority.
- Task Run records user timeline and admin trace.
- Solution Library provides reviewed patterns and controlled tool assembly.

## Activation Gate

Before activating UTS work:

- AVG-708 artifact workspace is complete;
- AVG-709 through AVG-712 hardening tasks are complete;
- MVP-5 release notes and known limitations are accepted;
- owner approves moving from MVP-5 closure into UTS-1 contracts.

## Roadmap Mapping

| UTS Phase | Planned Codex Sprint Range | Activation |
|---|---|---|
| UTS-0: MVP-5 Closure | current Sprint 8/9 completion | active after owner confirms remaining MVP-5 work |
| UTS-1: Product Contracts | future Sprint 11 | after MVP-5 closure |
| UTS-2: State Graph + LLM Core | future Sprint 12-13 | after contracts freeze |
| UTS-3: Task Run + HITL UI | future Sprint 14 | after graph core passes tests |
| UTS-4: Seed Solution Library | future Sprint 15-16 | after Task Run trace is stable |
| UTS-5: Unified API + Guidance | future Sprint 17 | after seed patterns exist |
| UTS-6: Controlled Advanced Capabilities | future Sprint 18+ | after unified API E2E passes |
| UTS-7: E2E, Docs, Release | final release sprint | after feature completion |

## Task Card Requirement

Each `AVG-UTS-*` work item must receive a task card before implementation. Task cards must include:

- owner lane;
- target files;
- risk;
- dependencies;
- tests/evals;
- model budget;
- backlog token plan;
- rollback notes.

## Spec Mapping

| Project Spec | Agent Use |
|---|---|
| `docs/11-unified-task-system/product-contract.md` | Product, Architect, Validation |
| `docs/11-unified-task-system/state-graph-orchestrator-spec.md` | Backend, Architect |
| `docs/11-unified-task-system/adaptive-llm-layer-spec.md` | AI, Backend, Validation |
| `docs/11-unified-task-system/task-run-hitl-spec.md` | Backend, Frontend, Admin |
| `docs/11-unified-task-system/solution-library-tool-registry-spec.md` | Architect, Security, Backend |
| `docs/11-unified-task-system/api-boundary-spec.md` | Backend/API, Frontend |
| `docs/11-unified-task-system/ux-surface-guidance-spec.md` | Frontend/Product |
| `docs/11-unified-task-system/quality-security-rollout-spec.md` | QA, Security, Release |

## Non-Actionable Until Approved

Agents must not implement State Graph, LLM routing, HITL persistence, tool execution permissions or adaptive pattern generation solely because this map exists. This document is strategic planning until reflected in `.qoder/war-room/sprint-backlog.md` and task cards.

