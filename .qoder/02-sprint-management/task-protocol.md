# Task Protocol

Every Codex task must have a task card.

## Sprint and Agent Plan Rule

Codex agents must execute only work that is already approved in the sprint backlog and agent execution plan.

- Sprint execution order is defined in [sprint-execution-protocol.md](sprint-execution-protocol.md).
- Agents must work the active sprint in backlog order and must not skip ahead to a later sprint.

- If a task is not present in [../war-room/sprint-backlog.md](../war-room/sprint-backlog.md), [../war-room/active-epics.md](../war-room/active-epics.md), or the current daily agent brief, it is not actionable.
- Agents must not self-select unrelated work, even if it appears useful.
- Any deviation from the approved plan requires explicit owner approval and an updated task card or backlog entry before edits continue.
- If the approved task is blocked, the agent must stop, report the blocker, and wait for re-planning.

## Task Card Template

See template: [../templates/task-card.yaml](../templates/task-card.yaml)

```yaml
id: AVG-000
type: feature | bugfix | refactor | test | eval | docs | research | migration
owner_agent: frontend | backend | validator | qa | security | devops | architect | docs
parallel_safe: true
risk: low | medium | high | critical
touches:
  - packages/avg-validation
depends_on: []
blocked_by: []
expected_outputs:
  - implementation
  - tests
  - docs
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
  max_files_to_open: 12
  context_status: green | yellow | red
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: minimal | standard | strong | review
  default_model: gpt-5.4-mini | gpt-5.4 | gpt-5.3-codex | gpt-5.5
  escalation_allowed: true | false
  escalation_requires_approval: true
  reason: "why this tier is enough"
```

## Definition of Ready

- Goal is clear.
- Expected behavior is defined.
- Target files are known.
- Contracts are identified.
- Tests/evals are specified.
- Dependencies and blockers are listed.
- Context budget is declared (see [../04-agent-execution/context-budget.md](../04-agent-execution/context-budget.md)).
- Model budget follows [model-policy.md](model-policy.md).
- The task is mapped to an approved sprint backlog item and owner lane.
- The task appears in the active agent execution plan or daily brief.
- The task is in the currently active sprint, not a future deferred sprint.
- The approved model and selected runtime model are recorded in the active agent plan or daily brief before work starts.

## Definition of Done

See complete checklist: [../03-quality-gates/definition-of-done.md](../03-quality-gates/definition-of-done.md).

**CRITICAL:** No task is complete until the project backlog is updated with Actual Tokens, Variance, and Status. See [backlog-update-regulation.md](backlog-update-regulation.md).

## Non-Completion Rule

If a sprint task is not marked `done`, the task card or progress board must state an objective reason, not just a vague status.

Required forms:

- `blocked`: name the upstream dependency or decision that is missing;
- `in progress`: name the concrete remaining work;
- `ready`: name the owning agent and the next action;
- `deferred`: name the explicit sprint gate that prevents work from starting.

If there is no objective reason and the required checks already pass, the task must be moved to `done` instead of left in a limbo state.

## Context Budget

See complete guide: [../04-agent-execution/context-budget.md](../04-agent-execution/context-budget.md).

Agents must manage context as an explicit task resource.

Use:

- `green` when the task is bounded and only target files are open;
- `yellow` when multiple contracts, many files or unclear ownership are involved;
- `red` when the task must be split before work continues.

A yellow task requires a short handoff summary before more edits. A red task requires replanning.

## Model Budget

See complete policy: [model-policy.md](model-policy.md).

Agents must use the model approved in the task card or sprint model budget.

Agents may request escalation to a stronger tier, but must not silently switch models. Escalation requires a short note explaining task id, current tier, requested tier, reason and risk tradeoff.

## Model Selection Rule

Before a task enters `in progress`, the responsible agent must record the chosen model in the active brief or task handoff.

If the selected model is the same as the approved default model, still record it once so reviewers do not have to infer the choice later.

See [model-policy.md](model-policy.md).
