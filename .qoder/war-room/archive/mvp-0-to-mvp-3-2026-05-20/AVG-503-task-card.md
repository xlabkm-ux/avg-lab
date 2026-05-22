# AVG-503 Task Card

```yaml
id: AVG-503
type: feature
owner_agent: backend
sprint: Sprint 5
parallel_safe: true
risk: medium
touches:
  - apps/api/src/index.ts
  - apps/api/tests/api.test.ts
  - apps/api/tests/api.contract.test.ts
  - apps/api/README.md
depends_on:
  - AVG-501
  - AVG-502
blocked_by: []
expected_outputs:
  - map diff artifact API and sync helpers
  - unit and contract tests
  - README usage notes
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/project-backlog-progress.md
    - apps/api/README.md
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
  reason: "map diff artifact API and graph sync helpers for the concept map slice"
```

## Goal

Expose a minimal map diff artifact and sync surface for MVP-3.

## Expected Behavior

- the API can accept a graph projection or map snapshot and emit a diff artifact;
- diff output keeps claim status and boundary metadata intact;
- the in-memory slice remains deterministic for tests.

## Tests

- package-level unit tests for diff helpers;
- contract tests for payload shape;
- typecheck and lint for `apps/api`;
- root workspace checks after implementation.

## Done When

- the API exports the map diff artifact surface;
- tests cover the public behavior;
- README reflects the new usage surface.

## Completion Notes

- Completed in Sprint 5.
- `apps/api` now exposes `materializeMapSnapshot()` and `createMapDiffArtifact()` for graph projections and snapshots.
- The artifact surface is backed by `@avg/graph` and the pure `diffGraphSnapshots()` helper.
