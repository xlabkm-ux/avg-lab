# AVG-302 Task Card

```yaml
id: AVG-302
type: feature
owner_agent: validation
sprint: Sprint 3
parallel_safe: false
risk: red
touches:
  - packages/avg-validation/src/index.ts
  - packages/avg-validation/tests/claim-extraction.test.ts
  - packages/avg-validation/README.md
  - .qoder/war-room/project-backlog-progress.md
  - .qoder/war-room/daily-agent-brief.md
depends_on:
  - AVG-301
blocked_by: []
expected_outputs:
  - claim extraction and schema validation
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/project-backlog-progress.md
    - docs/02-ai-system/claim-validation-contract.md
    - packages/avg-validation/README.md
  max_files_to_open: 10
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: strong
  default_model: gpt-5.5
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "claim extraction and schema validation baseline for MVP-2"
```

## Goal

Implement deterministic claim extraction from validated AVG structured responses and keep the claim schema gate explicit.

## Expected Behavior

- validated AVG responses can be decomposed into schema-bound claim candidates;
- extraction stops when the response schema is invalid;
- extracted claims preserve scope, risks, claim status, language mode and source refs;
- downstream validation can depend on a stable extraction report.

## Tests

- package unit tests for extraction and schema gate behavior;
- package typecheck and build;
- response fixture review against the frozen contract.

## Done When

- claim extraction and schema validation are implemented in `avg-validation`;
- package tests, typecheck and build pass;
- backlog and brief point to `AVG-303` as the next gate.
