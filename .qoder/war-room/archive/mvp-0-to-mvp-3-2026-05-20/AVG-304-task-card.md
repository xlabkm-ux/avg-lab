# AVG-304 Task Card

```yaml
id: AVG-304
type: feature
owner_agent: validation
sprint: Sprint 3
parallel_safe: true
risk: yellow
touches:
  - packages/avg-validation/src/index.ts
  - packages/avg-validation/tests/claim-risk.test.ts
  - packages/avg-validation/README.md
  - .qoder/war-room/project-backlog-progress.md
  - .qoder/war-room/daily-agent-brief.md
depends_on:
  - AVG-301
  - AVG-302
  - AVG-303
blocked_by: []
expected_outputs:
  - risk classifier and repair suggestions
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/project-backlog-progress.md
    - docs/02-ai-system/claim-validation-contract.md
    - packages/avg-validation/README.md
  max_files_to_open: 10
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: strong
  default_model: gpt-5.5
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "deterministic risk classifier and repair suggestion layer for MVP-2"
```

## Goal

Detect strong-word, dogma and map/territory risks and return repair suggestions that preserve uncertainty.

## Expected Behavior

- risk markers are derived deterministically from claim text and claim discipline;
- repair suggestions point to the missing boundary, scope or evidence condition;
- metaphor can be repairable without being flattened into a fact claim;
- critical risk is reserved for contract-breaking or prohibited-positive-claim cases.

## Tests

- package unit tests for risk classifier and repair suggestions;
- package typecheck and build;
- contract review against the frozen claim validation vocabulary.

## Done When

- risk classifier and repair suggestions are implemented in `avg-validation`;
- package tests, typecheck and build pass;
- Sprint 3 advances to `AVG-305`.
