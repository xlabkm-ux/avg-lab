# AVG-711 Task Card

```yaml
id: AVG-711
type: test
owner_agent: Frontend/QA
sprint: Sprint 9
parallel_safe: true
risk: yellow
touches:
  - tests/
  - apps/web/
depends_on:
  - AVG-702
  - AVG-703
  - AVG-705
  - AVG-707
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - docs/00-product/mvp-5-working-interface-plan.md
    - docs/05-ui-ux/design-system.md
    - docs/06-qa/qa-strategy.md
  max_files_to_open: 14
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
```

## Goal

Add visual and accessibility smoke coverage for the MVP-5 workspace.

## Expected Behavior

- Main workspace renders without overlapping text or broken panels.
- Core controls are keyboard reachable.
- Important panels have accessible labels.

## Implementation Notes

- Prioritize high-signal smoke coverage over exhaustive pixel locking.
- Include desktop and mobile viewports if the app layout supports them.

## Tests

- visual: workspace, dialogue, retrieval, map
- a11y: navigation, forms, panels

## Done When

- visual and a11y checks run or documented blockers exist;
- screenshots or artifacts are available for PR review.
