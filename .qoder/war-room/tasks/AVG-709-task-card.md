# AVG-709 Task Card

```yaml
id: AVG-709
type: test
owner_agent: QA
sprint: Sprint 9
parallel_safe: true
risk: red
touches:
  - tests/
  - apps/web/
depends_on:
  - AVG-702
  - AVG-703
  - AVG-704
  - AVG-705
  - AVG-706
  - AVG-707
  - AVG-708
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - docs/00-product/mvp-5-working-interface-plan.md
    - docs/06-qa/qa-strategy.md
  max_files_to_open: 16
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
```

## Goal

Add E2E coverage for the full MVP-5 happy path and missing evidence path.

## Expected Behavior

- A browser test can complete project, dialogue, document, grounded answer, map and artifact steps.
- Missing evidence produces a visible boundary, not confident output.

## Implementation Notes

- Use the local deterministic system.
- Keep the test focused on user-observable behavior.
- Do not require external services.

## Tests

- e2e: full MVP-5 happy path
- e2e: missing evidence path

## Done When

- E2E tests run locally;
- failures are actionable;
- tests do not rely on voice or production services.
