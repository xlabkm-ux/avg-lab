# AVG-704 Task Card

```yaml
id: AVG-704
type: feature
owner_agent: Frontend/Backend
sprint: Sprint 7
parallel_safe: true
risk: yellow
touches:
  - apps/web/
  - apps/api/
  - packages/avg-retrieval/
depends_on:
  - AVG-701
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - docs/00-product/mvp-5-working-interface-plan.md
    - docs/04-api/retrieval-api-contract.md
    - packages/avg-retrieval/README.md
    - apps/api/README.md
  max_files_to_open: 16
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
```

## Goal

Build the document workspace and registration flow.

## Expected Behavior

- User can register local text or markdown against the active project.
- User can see document list, document detail and generated snippet preview.
- Invalid document submissions produce clear errors.
- Local-only and project-local boundaries are visible.

## Implementation Notes

- Use the completed MVP-4 document registration boundary.
- Do not add upload dependencies, OCR, production storage or permissions.
- Do not expose documents across project boundaries.

## Tests

- unit: document form validation and rendering
- integration: registration API adapter
- e2e: register document and inspect snippets
- contract: route shape if changed

## Done When

- document workspace is usable from the browser;
- snippets and document ids are inspectable;
- invalid states are clear and recoverable.
