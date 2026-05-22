# AVG-710 Task Card

```yaml
id: AVG-710
type: test
owner_agent: QA/Security
sprint: Sprint 9
parallel_safe: true
risk: red
touches:
  - tests/
  - apps/web/
  - packages/avg-evals/
depends_on:
  - AVG-705
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - docs/00-product/mvp-5-working-interface-plan.md
    - docs/07-security/prompt-injection.md
    - docs/02-ai-system/retrieval-grounding-contract.md
  max_files_to_open: 16
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
```

## Goal

Prove prompt-injection text retrieved from a source is displayed only as source content in the UI.

## Expected Behavior

- Hostile source text can be retrieved and cited.
- UI renders the hostile text as quoted evidence.
- The instruction-like content does not alter interface behavior or answer framing.

## Implementation Notes

- Keep the test source explicit and deterministic.
- Do not add new prompt behavior unless evals are updated.

## Tests

- e2e: hostile source appears only in citation panel
- ai evals: update only if model/prompt behavior changes

## Done When

- prompt-injection-as-source UI proof passes;
- risk notes are documented in release notes.
