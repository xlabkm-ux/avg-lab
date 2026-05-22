# AVG-001 Task Card

```yaml
id: AVG-001
type: feature
owner_agent: architect
sprint: Sprint 0
parallel_safe: false
risk: high
touches:
  - docs/01-architecture/package-map.md
  - .qoder/agent-registry.md
  - docs/00-product/mvp-0-2-development-plan.md
depends_on: []
blocked_by: []
expected_outputs:
  - package contracts and dependency direction confirmed
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/agent-execution-matrix.md
  max_files_to_open: 12
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: strong
  default_model: gpt-5.5
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "shared contract and dependency direction confirmation"
```

## Goal

Confirm the package contract boundaries and dependency direction for MVP-0.

## Evidence

- `docs/01-architecture/package-map.md` documents dependency direction.
- Root checks pass: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm validate:schemas`.
- No package depends against the documented direction.

## Done When

- Package contracts are confirmed.
- Dependency direction is documented.
- Sprint 0 exit criteria are unblocked.
