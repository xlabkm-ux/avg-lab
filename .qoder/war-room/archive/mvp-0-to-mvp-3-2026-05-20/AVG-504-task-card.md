# AVG-504 Task Card

```yaml
id: AVG-504
type: feature
owner_agent: frontend
sprint: Sprint 5
parallel_safe: true
risk: medium
touches:
  - apps/web/src/index.ts
  - apps/web/tests/web.test.ts
  - apps/web/README.md
depends_on:
  - AVG-501
  - AVG-502
  - AVG-503
blocked_by: []
expected_outputs:
  - concept map canvas and React Flow-ready shell
  - package-level smoke tests
  - README update
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/project-backlog-progress.md
    - apps/web/README.md
  max_files_to_open: 8
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: standard
  default_model: gpt-5.4
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "concept map canvas shell and interaction boundary for the visual map slice"
```

## Goal

Provide the first disciplined concept map surface in the web app.

## Expected Behavior

- the map shell can render a validated graph projection;
- empty and populated states keep the map/territory boundary explicit;
- the UI boundary stays deterministic for smoke tests and later React Flow wiring.

## Tests

- package-level smoke tests for the concept map surface;
- typecheck and lint for `apps/web`;
- root workspace checks after implementation.

## Done When

- the concept map shell renders deterministically;
- smoke tests cover the new surface;
- README reflects the current web package surface.

## Completion Notes

- Completed in Sprint 5.
- `apps/web` now exposes `createConceptMapShell()` and `renderConceptMapShell()` for empty and populated graph states.
- The shell is backed by `@avg/graph` projection materialization and remains framework-free for the first visual slice.
