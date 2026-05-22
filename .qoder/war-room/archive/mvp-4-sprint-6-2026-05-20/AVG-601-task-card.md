# AVG-601 Task Card

```yaml
id: AVG-601
type: feature
owner_agent: Architect
sprint: Sprint 6
parallel_safe: false
risk: red
touches:
  - docs/00-product/mvp-4-retrieval-and-documents-plan.md
  - docs/02-ai-system/
  - docs/04-api/
  - schemas/
depends_on: []
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

Freeze the MVP-4 retrieval and grounding contract before implementation starts.

## Expected Behavior

- Retrieval outputs document ids, snippet ids, source metadata and confidence signals.
- Source-grounded answers distinguish cited facts, interpretation and unsupported uncertainty.
- Missing evidence produces an explicit boundary statement instead of confident prose.

## Implementation Notes

- Keep the contract minimal and local-development friendly.
- Do not add production vector database commitments in this task.
- Update ADR or API docs if the contract creates a durable public boundary.

## Tests

- unit: contract helpers if introduced
- integration: not required unless schemas are changed
- e2e: not required
- ai evals: define required fixtures for later tasks

## Done When

- retrieval contract is documented;
- citation shape is approved;
- downstream task blockers are removed;
- risks and rollback are documented.

## Completion Notes

- Completed in Sprint 6.
- Retrieval grounding contract: `docs/02-ai-system/retrieval-grounding-contract.md`.
- API contract outline: `docs/04-api/retrieval-api-contract.md`.
- Public response schema remains unchanged until AVG-604 confirms the smallest stable response extension.
