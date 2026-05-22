# AVG-706 Task Card

```yaml
id: AVG-706
type: feature
owner_agent: Frontend/Validation
sprint: Sprint 8
parallel_safe: true
risk: red
touches:
  - apps/web/
  - packages/avg-validation/
depends_on:
  - AVG-703
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - docs/00-product/mvp-5-working-interface-plan.md
    - docs/02-ai-system/claim-validation-contract.md
    - packages/avg-validation/README.md
  max_files_to_open: 16
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
```

## Goal

Build the claim review panel with validation risk and repair suggestions.

## Expected Behavior

- User can inspect extracted claims from summary, scope and next action.
- Claim status, language mode, risk level, risk markers and boundary notes are visible.
- Repair suggestions are shown as scoped suggestions, not automatic truth.
- Metaphor-only and map/territory issues are clearly marked.

## Implementation Notes

- Use existing validation behavior where possible.
- Do not move validation business logic into prompts.
- Keep unsupported and high-risk claims visually distinct from accepted claims.

## Tests

- unit: claim review rendering states
- integration: validation report wiring
- e2e: inspect risky claim and repair suggestions
- ai evals: only if prompt behavior changes

## Done When

- claim review is available from dialogue;
- risk and boundary notes are visible;
- no metaphor-as-fact regression is introduced.
