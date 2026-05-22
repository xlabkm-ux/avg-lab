# AVG-005 Task Card

```yaml
id: AVG-005
type: docs
owner_agent: docs
sprint: Sprint 0
parallel_safe: true
risk: low
touches:
  - .qoder/war-room
depends_on: []
blocked_by: []
expected_outputs:
  - onboarding and first-task docs updated
  - visible project backlog progress view
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/daily-agent-brief.md
  max_files_to_open: 12
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: minimal
  default_model: gpt-5.4-mini
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "documentation and war-room progress tracking"
```

## Goal

Make the approved backlog visible as a project progress board for humans and Codex agents.

## Expected Behavior

- Project backlog progress is visible in `.qoder/war-room/project-backlog-progress.md`.
- The progress board does not replace the approved sprint backlog.
- Progress status is updated when task state changes.

## Tests

- docs: manual review

## Done When

- The project backlog can be read with task status, progress and next step.
- Daily agent brief points active agents to the progress board.
