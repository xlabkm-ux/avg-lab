# AVG-703 Task Card

```yaml
id: AVG-703
type: feature
owner_agent: Frontend/Validation
sprint: Sprint 7
parallel_safe: true
risk: red
touches:
  - apps/web/
  - packages/avg-validation/
  - packages/avg-schemas/
depends_on:
  - AVG-701
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - docs/00-product/mvp-5-working-interface-plan.md
    - docs/02-ai-system/claim-validation-contract.md
    - packages/avg-validation/README.md
    - apps/web/README.md
  max_files_to_open: 16
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
```

## Goal

Build the structured dialogue surface.

## Expected Behavior

- User can submit a raw thought.
- Assistant output is rendered as a structured AVG response, not plain chatbot prose.
- Claim status, language mode, validation risk, risk markers and map/territory boundary are visible.
- Loading, empty and error states are handled.

## Implementation Notes

- Use existing schema and validation boundaries.
- Invalid structured responses must fail visibly.
- Keep response details inspectable without leaving the dialogue.

## Tests

- unit: rendering structured response states
- integration: dialogue state and validation wiring
- e2e: submit thought and inspect structured response
- ai evals: only if prompt behavior changes

## Done When

- dialogue surface is usable from the workspace;
- structured response details are first-class;
- no plain chatbot wrapper behavior is introduced.
