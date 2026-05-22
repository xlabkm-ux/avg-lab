# AVG-201 Task Card

```yaml
id: AVG-201
type: feature
owner_agent: frontend
sprint: Sprint 2
parallel_safe: true
risk: medium
touches:
  - apps/web
depends_on:
  - AVG-102
blocked_by: []
expected_outputs:
  - minimal project/session UI
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
  reason: "single-package UI shell and smoke tests for the web slice"
```

## Goal

Provide the minimal project/session shell for Sprint 2.

## Expected Behavior

- the web package exposes a stable project/session shell surface;
- the shell reflects project and session identity without inventing extra state;
- the rendered surface stays deterministic for smoke tests and later UI wiring.

## Tests

- package-level smoke tests for the shell surface;
- typecheck and lint for `apps/web`;
- root workspace checks after implementation.

## Done When

- the project/session shell renders deterministically;
- smoke tests cover the shell surface;
- README reflects the current web package surface.
