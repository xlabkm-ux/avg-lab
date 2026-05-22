# AVG-205 Task Card

```yaml
id: AVG-205
type: docs
owner_agent: docs
sprint: Sprint 2
parallel_safe: true
risk: low
touches:
  - apps/web/README.md
depends_on:
  - AVG-204
blocked_by: []
expected_outputs:
  - MVP-1 usage notes
  - README example
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/project-backlog-progress.md
    - apps/web/README.md
  max_files_to_open: 8
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: minimal
  default_model: gpt-5.4-mini
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "README-only usage example and current surface notes"
```

## Goal

Document the MVP-1 web usage notes for the first dialogue path.

## Expected Behavior

- the README explains the web surface without requiring extra context;
- the usage example reflects the current package functions;
- the docs stay in sync with the implemented smoke path.

## Tests

- README review for current surface and example consistency;
- root workspace checks if the docs update affects package manifests.

## Done When

- the README contains a usable example for the web slice;
- the documented surface matches the implemented functions;
- the sprint can close without undocumented UI behavior.
