# AVG-702 Task Card

```yaml
id: AVG-702
type: feature
owner_agent: Frontend
sprint: Sprint 7
parallel_safe: true
risk: yellow
touches:
  - apps/web/
  - packages/avg-ui/
depends_on:
  - AVG-701
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - docs/00-product/mvp-5-working-interface-plan.md
    - docs/05-ui-ux/design-system.md
    - apps/web/README.md
  max_files_to_open: 14
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
```

## Goal

Build the MVP-5 workspace shell and local project/session state.

## Expected Behavior

- User can create or open a local project.
- User can see the active session.
- Navigation exposes Dialogue, Documents, Map and Artifacts.
- Local-only state boundary is visible.

## Implementation Notes

- Build the actual product workspace as the first screen.
- Do not make a marketing landing page.
- Keep the design dense, calm and suitable for repeated thinking work.

## Tests

- unit: workspace state helpers
- integration: project/session state wiring if introduced
- e2e: workspace loads and project can be created
- visual/a11y: smoke for shell once available

## Done When

- workspace shell renders in the browser;
- project and session identifiers are available;
- empty states are useful and compact;
- no MVP-6 dependencies are introduced.
