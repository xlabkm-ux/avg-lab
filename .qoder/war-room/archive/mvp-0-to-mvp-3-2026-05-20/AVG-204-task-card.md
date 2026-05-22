# AVG-204 Task Card

```yaml
id: AVG-204
type: test
owner_agent: qa
sprint: Sprint 2
parallel_safe: true
risk: medium
touches:
  - apps/web
depends_on:
  - AVG-201
  - AVG-202
  - AVG-203
blocked_by: []
expected_outputs:
  - first dialogue smoke test
  - package-level verification
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
  reason: "single-package smoke coverage for the first dialogue path"
```

## Goal

Verify the first dialogue path through the web surface.

## Expected Behavior

- the shell, message surface and response details panel compose into a coherent flow;
- the smoke path remains deterministic for future UI work;
- contract-shaped structured responses are used in the smoke scenario.

## Tests

- package-level smoke test for the first dialogue path;
- typecheck and lint for `apps/web`;
- root workspace checks after implementation.

## Done When

- the first dialogue smoke path renders deterministically;
- the smoke test covers shell, message surface and response details;
- the package and workspace checks pass.
