# AVG-103 Task Card

```yaml
id: AVG-103
type: feature
owner_agent: backend
parallel_safe: true
risk: medium
touches:
  - packages/avg-openai
depends_on:
  - AVG-101
blocked_by: []
expected_outputs:
  - OpenAI adapter boundary
  - normalized provider error helper
  - package-level tests
  - README update
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/project-backlog-progress.md
    - packages/avg-openai/README.md
  max_files_to_open: 8
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: standard
  default_model: gpt-5.4
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "single-package adapter boundary with deterministic error normalization"
```

## Goal

Turn `packages/avg-openai` from a skeleton into the Sprint 1 adapter boundary for OpenAI provider failures.

## Expected Behavior

- package exports declare a boundary status instead of a skeleton;
- heterogeneous provider errors normalize into stable AVG codes;
- retryable vs non-retryable failures are visible at the package boundary;
- tests lock the boundary shape and representative error mappings.

## Tests

- `pnpm --filter @avg/openai test:unit`
- `pnpm --filter @avg/openai typecheck`
- `pnpm --filter @avg/openai lint`

## Done When

- boundary export matches the Sprint 1 package contract;
- normalized error helper passes package tests;
- README reflects the new public API.
