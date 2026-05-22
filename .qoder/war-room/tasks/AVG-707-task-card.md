# AVG-707 Task Card

```yaml
id: AVG-707
type: feature
owner_agent: Frontend/Graph
sprint: Sprint 8
parallel_safe: true
risk: yellow
touches:
  - apps/web/
  - packages/avg-graph/
  - packages/avg-schemas/
depends_on:
  - AVG-702
  - AVG-703
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - docs/00-product/mvp-5-working-interface-plan.md
    - docs/03-data/graph-model.md
    - packages/avg-graph/README.md
    - apps/web/README.md
  max_files_to_open: 16
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
```

## Goal

Build the concept map surface from session material.

## Expected Behavior

- User can view an empty or populated concept map.
- Nodes preserve claim status, language mode, access mode and scope where available.
- User can inspect node details.
- Map/territory boundary is always visible.

## Implementation Notes

- The map is a working projection, not Reality.
- Use existing graph projection helpers before adding new graph behavior.
- Avoid heavy graph editing or collaboration features in MVP-5.

## Tests

- unit: map rendering from projection and snapshot
- integration: session material to map state
- e2e: view map after dialogue
- visual: smoke for map surface when available

## Done When

- concept map is reachable from the workspace;
- node details preserve AVG metadata;
- map export can consume the same snapshot shape.
