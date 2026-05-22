# AVG-708 Task Card

```yaml
id: AVG-708
type: feature
owner_agent: Frontend/Product
sprint: Sprint 8
parallel_safe: true
risk: yellow
touches:
  - apps/web/
  - apps/api/
  - packages/avg-schemas/
depends_on:
  - AVG-703
  - AVG-705
  - AVG-707
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - docs/00-product/mvp-5-working-interface-plan.md
    - docs/05-ui-ux/interaction-model.md
  max_files_to_open: 14
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
```

## Goal

Build the artifact workspace and export flow.

## Expected Behavior

- User can inspect session summary, grounded answer report, concept map snapshot and citation report.
- User can export or copy artifacts as JSON or Markdown.
- Artifacts preserve scope, risk, boundary notes, citations and unsupported claims.

## Implementation Notes

- Keep exports deterministic for tests.
- Do not hide unsupported claims in polished summaries.
- Avoid production storage or document retention policy work.

## Tests

- unit: artifact serialization
- integration: current project state to artifact
- e2e: export artifact after grounded dialogue
- contract: artifact shape if public

## Done When

- artifact workspace is usable;
- exports include AVG boundary metadata;
- copied/exported outputs remain source-aware.
