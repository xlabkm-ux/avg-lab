# AVG Unified Task System Specs

This folder contains the project specifications for the expanded AVG Unified Task System plan.

Source plan:

- `docs/88-project-plan/unified-task-system-expanded-plan.md`

Primary source inputs:

- `docs/99-doc/Open AI CONCEPT + PLAN.md`
- `docs/99-doc/Архитектурные Спецификации AVG.md`
- `docs/99-doc/Аудит концепции AVG.md`

## Spec Index

| Spec | Purpose |
|---|---|
| `product-contract.md` | Product contract, intent taxonomy, user states and boundaries |
| `state-graph-orchestrator-spec.md` | TaskState, graph nodes, routing, retries and circuit breaker |
| `adaptive-llm-layer-spec.md` | LLM provider boundary, structured outputs, validation and fallback |
| `task-run-hitl-spec.md` | Task Run model, timeline, admin trace, suspend/resume and action approval |
| `solution-library-tool-registry-spec.md` | Seed patterns, project-local patterns, tool registry and permissions |
| `api-boundary-spec.md` | Unified Dialogue API endpoint, envelopes and error contracts |
| `ux-surface-guidance-spec.md` | Progress UI, HITL cards, next useful move and cross-surface handoff |
| `quality-security-rollout-spec.md` | QA, evals, security gates, rollout and rollback |

## Implementation Rule

These specs do not activate work by themselves. A task becomes actionable only after it is added to the sprint backlog or active execution plan with owner, risk, dependencies, model budget and token budget.

