# AVG-605 Task Card

```yaml
id: AVG-605
type: feature
owner_agent: Frontend/QA
sprint: Sprint 6
parallel_safe: true
risk: yellow
touches:
  - apps/web/
  - tests/
  - packages/avg-evals/
depends_on:
  - AVG-601
  - AVG-604
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

Expose citations in the web surface and prove the retrieval path with smoke tests and eval fixtures.

## Expected Behavior

- Users can see which snippets support a grounded answer.
- Unsupported or low-confidence areas are visibly marked.
- Smoke tests cover the first document-to-answer path.

## Implementation Notes

- Keep the panel minimal and contract-shaped.
- Reuse existing structured response surfaces where possible.
- Add eval fixtures for source grounding before changing prompt behavior further.

## Tests

- unit: citation panel rendering
- integration: grounded response fixture rendering
- e2e: first retrieval dialogue smoke path if a runnable UI exists
- ai evals: source-grounding and unsupported-answer cases

## Done When

- citation panel renders stable citation ids;
- retrieval smoke coverage passes;
- eval fixtures exist for critical source-grounding behavior.

## Completion Notes

- Completed in Sprint 6.
- Web grounded response panel renders citation id, snippet id, document id, quoted text, relevance, grounded claims, interpretations, unsupported claims and boundary statement.
- Retrieval eval fixtures now cover source grounding, unsupported claims, citation completeness, low confidence, prompt injection and map/territory boundary preservation.
- API route smoke coverage proves document registration, retrieval search and grounded dialogue page rendering.
- Verified with `pnpm --filter @avg/web test`, `pnpm --filter @avg/evals test`, `pnpm test`, `pnpm typecheck`, `pnpm lint` and `pnpm build`.
