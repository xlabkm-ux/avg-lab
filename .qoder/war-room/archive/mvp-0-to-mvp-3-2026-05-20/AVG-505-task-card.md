# AVG-505 Task Card

```yaml
id: AVG-505
type: qa
owner_agent: qa
sprint: Sprint 5
parallel_safe: true
risk: medium
touches:
  - tests
  - .qoder/war-room/project-backlog-progress.md
  - .qoder/war-room/daily-agent-brief.md
depends_on:
  - AVG-501
  - AVG-502
  - AVG-503
  - AVG-504
blocked_by: []
expected_outputs:
  - graph, API and UI contract smoke tests
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/project-backlog-progress.md
    - docs/03-data/graph-model.md
  max_files_to_open: 8
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: standard
  default_model: gpt-5.4
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "graph, API and UI smoke coverage for the concept map slice"
```

## Goal

Provide test coverage for the Sprint 5 concept map slice.

## Expected Behavior

- graph projection behavior stays stable under fixtures;
- map diff artifact shape stays contractually frozen;
- concept map UI smoke coverage stays deterministic.

## Tests

- package-level unit and contract tests for graph, API and web surfaces;
- root `pnpm test:contract`;
- root `pnpm test` after the implementation slices land.

## Done When

- the Sprint 5 public behavior is covered by tests;
- the progress board reflects the verified state;
- Sprint 5 can advance only after the active planning gate is complete.

## Completion Notes

- Completed in Sprint 5.
- `packages/avg-graph`, `apps/api` and `apps/web` each have package-level coverage for the Sprint 5 concept map surface.
- Root `pnpm test:contract`, `pnpm typecheck` and `pnpm test` all passed after the graph, API and UI slices landed.
