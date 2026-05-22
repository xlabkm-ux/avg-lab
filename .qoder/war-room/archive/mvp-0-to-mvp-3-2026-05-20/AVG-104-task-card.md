# AVG-104 Task Card

```yaml
id: AVG-104
type: feature
owner_agent: backend
sprint: Sprint 1
parallel_safe: true
risk: medium
touches:
  - packages/avg-agents
depends_on:
  - AVG-101
blocked_by: []
expected_outputs:
  - mode router
  - response composer
  - package-level tests
  - README update
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/project-backlog-progress.md
    - packages/avg-agents/README.md
  max_files_to_open: 8
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: standard
  default_model: gpt-5.4
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "single-package pure routing and composition logic"
```

## Goal

Provide the minimal mode router and structured response composer for Sprint 1.

## Expected Behavior

- instructions route to creative, architect, validator or orchestrator modes;
- structured AVG responses can be composed as contract-valid payloads;
- the package remains pure and independent from providers and apps.

## Tests

- package-level unit tests for routing and composition;
- typecheck and lint for `packages/avg-agents`;
- root workspace checks after implementation.

## Done When

- mode router returns deterministic runtime modes;
- response composer builds schema-valid AVG responses;
- README reflects the public API.
