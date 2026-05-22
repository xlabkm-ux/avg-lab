# AVG-701 Task Card

```yaml
id: AVG-701
type: feature
owner_agent: Architect/Product
sprint: Sprint 7
parallel_safe: false
risk: red
touches:
  - docs/00-product/mvp-5-working-interface-plan.md
  - docs/05-ui-ux/
  - docs/04-api/
  - apps/web/
  - apps/api/
depends_on: []
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - docs/00-product/mvp-5-working-interface-plan.md
    - docs/00-product/mvp-6-advanced-services-plan.md
    - docs/05-ui-ux/design-system.md
    - docs/05-ui-ux/interaction-model.md
  max_files_to_open: 16
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
```

## Goal

Freeze the MVP-5 interface contract before implementation starts.

## Expected Behavior

- The working interface has clear surfaces for workspace, dialogue, claim review, documents, retrieval, map and artifacts.
- Frontend state boundaries are documented.
- API boundaries used by the UI are documented.
- Voice, realtime collaboration and complex services remain explicitly deferred to MVP-6.

## Implementation Notes

- Prefer the smallest complete product surface that supports user testing.
- Do not change public schemas unless the need is proven and approved.
- Do not design audio, realtime collaboration, production vector storage, OCR or external ingestion.

## Tests

- unit: not required unless helpers are introduced
- integration: not required unless API contracts change
- e2e: define required MVP-5 scenarios
- ai evals: update only if prompt behavior changes

## Done When

- interface contract is documented;
- state and API boundaries are clear enough for AVG-702 through AVG-704;
- MVP-6 deferred boundary remains intact;
- risks and rollback are documented.

## Completion Notes

- Completed for Sprint 7.
- Interface contract: `docs/05-ui-ux/mvp-5-interface-contract.md`.
- UI API boundary: `docs/04-api/mvp-5-ui-api-boundary.md`.
- MVP-6 deferrals remain explicit in `docs/00-product/mvp-6-advanced-services-plan.md`.
