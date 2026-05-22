# AVG-202 Task Card

```yaml
id: AVG-202
type: feature
owner_agent: frontend
sprint: Sprint 2
parallel_safe: true
risk: medium
touches:
  - apps/web
depends_on:
  - AVG-201
blocked_by: []
expected_outputs:
  - dialogue message surface
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
  reason: "single-package HTML surface and smoke tests for dialogue messages"
```

## Goal

Provide the minimal dialogue message surface for Sprint 2.

## Expected Behavior

- the web package exposes a stable dialogue message surface;
- the surface can render a deterministic message thread for a project and session;
- empty and populated states remain explicit for later API wiring.

## Tests

- package-level smoke tests for the message surface;
- typecheck and lint for `apps/web`;
- root workspace checks after implementation.

## Done When

- the dialogue message surface renders deterministically;
- smoke tests cover the rendered thread and empty state;
- README reflects the current web package surface.
