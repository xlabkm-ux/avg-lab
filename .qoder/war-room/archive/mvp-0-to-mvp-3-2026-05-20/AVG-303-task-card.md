# AVG-303 Task Card

```yaml
id: AVG-303
type: feature
owner_agent: validation
sprint: Sprint 3
parallel_safe: true
risk: yellow
touches:
  - packages/avg-validation/src/index.ts
  - packages/avg-validation/tests/claim-classification.test.ts
  - packages/avg-validation/README.md
  - .qoder/war-room/project-backlog-progress.md
  - .qoder/war-room/daily-agent-brief.md
depends_on:
  - AVG-301
  - AVG-302
blocked_by: []
expected_outputs:
  - claim status and language mode classifier
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
  reason: "deterministic classifier for claim status and language mode"
```

## Goal

Classify claim status and language mode from claim text while preserving boundary notes about mismatches.

## Expected Behavior

- claim text maps to a frozen claim status and language mode;
- metaphorical wording is marked as metaphor_only and metaphor;
- hedged text is classified as hypothesis and conditional_description;
- operational action text is classified as operational_marker and operational_description;
- mismatch notes preserve the distinction between input claim and classifier preference.

## Tests

- package unit tests for classifier heuristics and mismatch notes;
- package typecheck and build;
- contract review against the frozen claim validation vocabulary.

## Done When

- classifier API is implemented in `avg-validation`;
- package tests, typecheck and build pass;
- Sprint 3 advances to `AVG-304`.
