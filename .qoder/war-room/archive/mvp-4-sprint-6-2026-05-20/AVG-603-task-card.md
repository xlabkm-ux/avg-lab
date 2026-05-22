# AVG-603 Task Card

```yaml
id: AVG-603
type: feature
owner_agent: Retrieval
sprint: Sprint 6
parallel_safe: true
risk: yellow
touches:
  - packages/
  - tests/
depends_on:
  - AVG-601
  - AVG-602
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

Implement the minimal chunking and search surface for registered documents.

## Expected Behavior

- Document text is split into stable snippets.
- Queries return ranked snippets with citation ids.
- Retrieval confidence is exposed as a risk signal, not a truth label.

## Implementation Notes

- Start with deterministic local retrieval.
- Keep chunk ids stable for tests.
- Do not introduce vector database dependencies in this task.

## Tests

- unit: chunk creation and ranking behavior
- integration: retrieval from registered document content
- e2e: not required
- ai evals: fixture candidates for AVG-605

## Done When

- retrieval returns snippet-level citations;
- ranking behavior is deterministic;
- package and root checks pass.

## Completion Notes

- Completed in Sprint 6.
- `@avg/retrieval` now chunks documents into stable snippets and returns deterministic ranked retrieval hits.
- Retrieval hits include snippet id, document id, project id, score, confidence, citation id, matched text and source label.
- Project isolation and ranking behavior are covered in `packages/avg-retrieval/tests/document-repository.test.ts`.
- Verified with `pnpm test`, `pnpm typecheck`, `pnpm lint` and `pnpm build`.
