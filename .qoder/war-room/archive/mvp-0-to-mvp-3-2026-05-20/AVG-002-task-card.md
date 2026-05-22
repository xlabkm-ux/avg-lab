# AVG-002 Task Card

```yaml
id: AVG-002
type: feature
owner_agent: devops
sprint: Sprint 0
parallel_safe: true
risk: medium
touches:
  - .github/workflows/ci.yml
depends_on: []
blocked_by: []
expected_outputs:
  - root CI runs install, lint, typecheck and test
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .github/workflows/ci.yml
  max_files_to_open: 12
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: minimal
  default_model: gpt-5.4-mini
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "routine CI baseline and workflow verification"
```

## Goal

Verify that CI mirrors the root quality checks for MVP-0.

## Evidence

- `.github/workflows/ci.yml` runs `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.
- Root checks pass locally.
- CI command list matches the approved sprint backlog output.

## Done When

- CI baseline mirrors local checks.
- Workflow is present and executable.
- Sprint 0 exit criteria stay green.
