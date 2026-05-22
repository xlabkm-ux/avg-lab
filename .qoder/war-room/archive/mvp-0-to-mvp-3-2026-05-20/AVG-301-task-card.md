# AVG-301 Task Card

```yaml
id: AVG-301
type: feature
owner_agent: architect
sprint: Sprint 3
parallel_safe: false
risk: high
touches:
  - docs/00-product/mvp-0-2-development-plan.md
  - .qoder/war-room/sprint-backlog.md
  - .qoder/war-room/project-backlog-progress.md
  - .qoder/war-room/daily-agent-brief.md
depends_on:
  - AVG-203
  - AVG-204
  - AVG-205
blocked_by: []
expected_outputs:
  - claim validation contract freeze
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/project-backlog-progress.md
    - docs/00-product/mvp-0-2-development-plan.md
  max_files_to_open: 8
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: strong
  default_model: gpt-5.5
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "shared validation contract freeze for MVP-2"
```

## Goal

Freeze the claim validation contract that unlocks Sprint 3 implementation.

## Expected Behavior

- claim validation boundaries stay explicit before implementation starts;
- downstream validation work can depend on a stable contract;
- the freeze records the scope and risks for the MVP-2 validation core.

## Tests

- contract review against the MVP-2 validation scope;
- backlog and brief consistency review.

## Done When

- the validation contract is approved;
- the backlog and brief point downstream tasks to the approved gate;
- Sprint 3 implementation tasks can start in order.
