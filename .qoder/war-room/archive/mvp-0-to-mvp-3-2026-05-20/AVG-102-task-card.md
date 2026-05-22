# AVG-102 Task Card

```yaml
id: AVG-102
type: feature
owner_agent: backend
sprint: Sprint 1
parallel_safe: false
risk: medium
touches:
  - apps/api
depends_on:
  - AVG-101
blocked_by: []
expected_outputs:
  - project/session/message API
  - unit tests
  - README usage notes
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/daily-agent-brief.md
    - apps/api/README.md
  max_files_to_open: 8
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: standard
  default_model: gpt-5.4
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "single-package backend API slice with in-memory lifecycle"
```

## Goal

Provide the minimal project/session/message API for Sprint 1.

## Expected Behavior

- projects can be created in memory;
- sessions belong to projects;
- messages belong to sessions;
- health and claim validation helpers remain available;
- the API surface is deterministic and testable.

## Tests

- package-level unit tests for lifecycle behavior;
- typecheck and lint for `apps/api`;
- root workspace checks after implementation.

## Done When

- the API exports project/session/message lifecycle functions;
- tests cover the minimal flow;
- README reflects the new usage surface.
