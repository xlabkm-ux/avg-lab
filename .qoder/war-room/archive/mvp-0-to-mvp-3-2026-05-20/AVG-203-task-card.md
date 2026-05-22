# AVG-203 Task Card

```yaml
id: AVG-203
type: feature
owner_agent: frontend
sprint: Sprint 2
parallel_safe: true
risk: medium
touches:
  - apps/web
  - packages/avg-schemas
depends_on:
  - AVG-202
blocked_by: []
expected_outputs:
  - structured response details panel
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
  reason: "single-package contract-shaped details panel and smoke tests"
```

## Goal

Provide the minimal structured response details panel for Sprint 2.

## Expected Behavior

- the web package renders structured AVG response details without inventing extra fields;
- the panel reflects the published response contract;
- the surface stays deterministic for smoke tests and later UI wiring.

## Tests

- package-level smoke tests for the details panel;
- typecheck and lint for `apps/web`;
- root workspace checks after implementation.

## Done When

- the structured response details panel renders deterministically;
- smoke tests cover the panel against a contract-shaped response;
- README reflects the current web package surface.
