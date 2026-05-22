# AVG-004 Task Card

```yaml
id: AVG-004
type: test
owner_agent: qa
sprint: Sprint 0
parallel_safe: true
risk: medium
touches:
  - packages/avg-testkit
  - packages/avg-schemas
  - tests/fixtures
depends_on: []
blocked_by: []
expected_outputs:
  - baseline testkit and schema validation command
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/daily-agent-brief.md
  max_files_to_open: 12
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: standard
  default_model: gpt-5.4
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "testkit and schema validation baseline with package-level tests"
```

## Goal

Provide the QA baseline testkit and schema validation command for MVP-0.

## Evidence

- `packages/avg-testkit` now exports a typed fixture loader and package boundary skeleton.
- `pnpm validate:schemas` passes and executes `packages/avg-schemas/tests/contract.test.ts`.
- Root checks include the new `@avg/testkit` package.

## Done When

- Testkit package exists and is executable.
- Schema validation command is part of the root workflow.
- Sprint 0 QA baseline is complete.
