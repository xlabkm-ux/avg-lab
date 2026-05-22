# AVG-712 Task Card

```yaml
id: AVG-712
type: release
owner_agent: Product/Release
sprint: Sprint 9
parallel_safe: false
risk: yellow
touches:
  - CHANGELOG.md
  - docs/00-product/
  - .qoder/war-room/
depends_on:
  - AVG-709
  - AVG-710
  - AVG-711
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - docs/00-product/mvp-5-working-interface-plan.md
    - docs/06-qa/release-quality-gates.md
    - .qoder/war-room/project-backlog-progress.md
  max_files_to_open: 14
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
```

## Goal

Prepare MVP-5 release notes, risk review and rollback plan.

## Expected Behavior

- Completed functionality is documented.
- Tests and evals run are recorded.
- Known limitations are explicit.
- Rollback plan keeps MVP-4 contracts available.

## Implementation Notes

- Do not claim MVP-6 capabilities.
- Do not describe retrieval as truth.
- Include UI screenshots if the release changes visible surfaces.

## Tests

- full MVP-5 release gate from sprint backlog

## Done When

- release notes are ready;
- risk review is complete;
- rollback plan is documented;
- MVP-5 is ready for user testing.
