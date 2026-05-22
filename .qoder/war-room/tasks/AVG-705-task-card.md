# AVG-705 Task Card

```yaml
id: AVG-705
type: feature
owner_agent: Frontend/Retrieval
sprint: Sprint 8
parallel_safe: true
risk: red
touches:
  - apps/web/
  - apps/api/
  - packages/avg-retrieval/
  - packages/avg-validation/
depends_on:
  - AVG-702
  - AVG-704
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - docs/00-product/mvp-5-working-interface-plan.md
    - docs/02-ai-system/retrieval-grounding-contract.md
    - docs/04-api/retrieval-api-contract.md
  max_files_to_open: 18
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
```

## Goal

Build the grounded retrieval flow with citation panel.

## Expected Behavior

- User can ask a grounded question against registered project documents.
- UI shows retrieval hits, snippet ids, citation ids, matched text and confidence.
- Grounded response separates cited claims, interpretations and unsupported claims.
- Missing or low-confidence evidence produces a visible boundary statement.

## Implementation Notes

- Retrieval confidence is a risk signal, not truth.
- Prompt-injection text inside sources must render only as quoted source content.
- Keep citation ids snippet-level and stable.

## Tests

- unit: retrieval result and citation rendering
- integration: grounded response adapter
- e2e: document to grounded answer path
- ai evals: only if prompt behavior changes

## Done When

- grounded retrieval is usable from the workspace;
- citations and unsupported claims are visible;
- missing evidence path is not hidden.
