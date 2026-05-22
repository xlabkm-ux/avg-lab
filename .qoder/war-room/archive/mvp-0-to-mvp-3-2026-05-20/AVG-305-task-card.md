# AVG-305 Task Card

```yaml
id: AVG-305
type: qa
owner_agent: qa
sprint: Sprint 3
parallel_safe: true
risk: yellow
touches:
  - packages/avg-validation/package.json
  - packages/avg-validation/tests/contract.test.ts
  - packages/avg-validation/src/index.ts
  - .qoder/war-room/project-backlog-progress.md
  - .qoder/war-room/daily-agent-brief.md
depends_on:
  - AVG-301
  - AVG-302
  - AVG-303
  - AVG-304
blocked_by: []
expected_outputs:
  - unit and contract tests
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/project-backlog-progress.md
    - packages/avg-validation/README.md
  max_files_to_open: 10
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: standard
  default_model: gpt-5.4
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "QA coverage for the validation contract, extraction, classification and risk layers"
```

## Goal

Provide unit and contract coverage for the validation package public surface.

## Expected Behavior

- claim validation, extraction, classification and risk reports stay stable under fixtures;
- public API shape is verified via contract tests;
- package scripts and root contract runner include the validation package.

## Tests

- `pnpm --filter @avg/validation test`
- `pnpm --filter @avg/validation test:contract`
- `pnpm --filter @avg/validation typecheck`
- `pnpm --filter @avg/validation build`
- `pnpm test:contract`

## Done When

- validation package unit and contract tests pass;
- package and root checks pass;
- Sprint 3 is complete and Sprint 4 can start.
