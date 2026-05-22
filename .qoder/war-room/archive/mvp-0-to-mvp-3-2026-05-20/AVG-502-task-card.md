# AVG-502 Task Card

```yaml
id: AVG-502
type: feature
owner_agent: knowledge-graph
sprint: Sprint 5
parallel_safe: true
risk: medium
touches:
  - packages/avg-graph/src/index.ts
  - packages/avg-graph/tests/projection.test.ts
  - packages/avg-graph/README.md
  - docs/03-data/graph-model.md
depends_on:
  - AVG-501
blocked_by: []
expected_outputs:
  - graph model projections and repository surface
  - unit tests
  - README update
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/project-backlog-progress.md
    - packages/avg-graph/README.md
    - docs/03-data/graph-model.md
  max_files_to_open: 10
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: standard
  default_model: gpt-5.4
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "typed graph projection and repository surface for the concept map slice"
```

## Goal

Implement the graph projection layer that stores disciplined terms and claims as map nodes and edges.

## Expected Behavior

- validated terms and claims can project into typed graph records;
- graph nodes preserve coordinates and boundary metadata;
- repository primitives stay deterministic and testable.

## Tests

- package-level unit tests for graph projection behavior;
- typecheck and lint for `packages/avg-graph`;
- root workspace checks after implementation.

## Done When

- the graph package exposes the projection surface needed by Sprint 5;
- tests cover the public behavior;
- README reflects the current graph package surface.

## Completion Notes

- Completed in Sprint 5.
- `@avg/graph` exposes claim projection, in-memory repository, snapshot cloning and pure diff helpers.
- Package tests, typecheck, build, schema validation and root contract checks passed after implementation.
