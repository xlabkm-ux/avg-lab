# AVG-602 Task Card

```yaml
id: AVG-602
type: feature
owner_agent: Backend
sprint: Sprint 6
parallel_safe: false
risk: yellow
touches:
  - apps/api/
  - packages/
  - tests/
depends_on:
  - AVG-601
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - docs/00-product/mvp-4-retrieval-and-documents-plan.md
  max_files_to_open: 12
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
```

## Goal

Add the minimal document registration and local store boundary for MVP-4.

## Expected Behavior

- A project-local document can be registered with stable metadata.
- The API returns a stable document id.
- Document content remains local and testable.

## Implementation Notes

- Prefer simple local storage or in-memory boundaries until the contract is proven.
- Avoid production upload dependencies.
- Keep document metadata typed and schema-backed.

## Tests

- unit: document metadata creation
- integration: API registration boundary
- e2e: not required
- ai evals: not required

## Done When

- document registration is implemented;
- invalid document metadata is rejected;
- package and root checks pass.

## Completion Notes

- Completed in Sprint 6.
- Added `schemas/json-schema/document.schema.json` and `AvgDocumentRef` validation exports.
- Added `@avg/retrieval` with local in-memory document registration.
- Added `registerProjectDocument()` and document lookup helpers in `@avg/api`.
- Verified with focused schema, retrieval and API checks.
