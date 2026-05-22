# AVG-501 Task Card

```yaml
id: AVG-501
type: feature
owner_agent: architect
sprint: Sprint 5
parallel_safe: false
risk: high
touches:
  - docs/03-data/graph-model.md
  - .qoder/war-room/sprint-backlog.md
  - .qoder/war-room/project-backlog-progress.md
  - .qoder/war-room/daily-agent-brief.md
depends_on:
  - AVG-405
blocked_by: []
expected_outputs:
  - MVP-3 concept map contract freeze
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/project-backlog-progress.md
    - docs/03-data/graph-model.md
  max_files_to_open: 8
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: strong
  default_model: gpt-5.5
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "MVP-3 concept map contract freeze and graph boundary decisions"
```

## Goal

Freeze the MVP-3 concept map contract before implementation starts.

## Expected Behavior

- term, claim, concept, risk and map nodes have explicit boundaries;
- coordinates and claim status reuse the frozen MVP-2 vocabulary;
- map diff artifact scope is named before implementation.

## Tests

- contract review against the graph model and roadmap;
- backlog and brief consistency review.

## Done When

- the concept map contract is approved;
- downstream graph, backend and UI tasks can depend on it;
- the sprint backlog and progress board reflect the approved freeze.

## Completion Notes

- Completed in Sprint 5.
- The graph model contract now points to `map-node.schema.json` and `map-edge.schema.json` as source of truth.
- Storage uses lower-case schema values while UI labels may use presentation names.
