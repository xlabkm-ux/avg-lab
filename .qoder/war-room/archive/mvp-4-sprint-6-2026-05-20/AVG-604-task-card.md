# AVG-604 Task Card

```yaml
id: AVG-604
type: feature
owner_agent: Backend/Validation
sprint: Sprint 6
parallel_safe: true
risk: red
touches:
  - apps/api/
  - packages/avg-validation/
  - packages/avg-evals/
  - prompts/
depends_on:
  - AVG-601
  - AVG-603
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - docs/02-ai-system/behavior-ledger.md
  max_files_to_open: 12
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
```

## Goal

Compose source-grounded AVG responses with explicit citation and uncertainty boundaries.

## Expected Behavior

- Cited statements link to snippet ids.
- Interpretations are labeled separately from cited facts.
- Unsupported claims are avoided or marked as unsupported.
- Map/territory boundary remains visible.

## Implementation Notes

- Prompt changes require eval fixtures and behavior ledger updates.
- Keep validation logic outside prompt text where practical.
- Normalize low-retrieval-confidence cases into boundary statements.

## Tests

- unit: grounded response classification helpers
- integration: API response composition
- e2e: optional after UI is available
- ai evals: source-grounding and unsupported-claim fixtures

## Done When

- grounded response composer is implemented;
- citation boundaries are covered by tests;
- behavior ledger is updated if prompt behavior changes.

## Completion Notes

- Completed in Sprint 6.
- `composeGroundedResponse()` wraps structured AVG responses with citations, grounded claims, interpretations, unsupported claims, retrieval confidence and boundary statement.
- Low-confidence retrieval remains visible as a boundary risk.
- Prompt-injection text inside retrieved snippets is preserved as quoted source content, not treated as instructions.
- No prompt behavior changed, so behavior ledger update was not required.
- Verified with `pnpm --filter @avg/validation test`, `pnpm --filter @avg/api test`, `pnpm test`, `pnpm typecheck`, `pnpm lint` and `pnpm build`.
