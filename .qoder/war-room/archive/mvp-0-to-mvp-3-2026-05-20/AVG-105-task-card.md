# AVG-105 Task Card

```yaml
id: AVG-105
type: test
owner_agent: qa
sprint: Sprint 1
parallel_safe: true
risk: medium
touches:
  - apps/api
  - packages/avg-schemas
  - tests/fixtures
depends_on:
  - AVG-101
expected_outputs:
  - API contract and smoke tests
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/project-backlog-progress.md
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
  reason: "package-level contract and smoke tests for the API slice"
```

## Goal

Validate the API contract and smoke path for Sprint 1.

## Expected Behavior

- the API health and lifecycle surface stays stable;
- structured AVG response fixtures satisfy the schema contract;
- invalid structured responses are rejected by the schema validator.

## Tests

- package-level API tests;
- contract validation against the structured response schema;
- typecheck and lint for `apps/api`.

## Done When

- smoke tests cover the API lifecycle and response contract;
- schema validation passes for the approved structured response fixture;
- invalid fixture coverage proves the boundary is enforced.
