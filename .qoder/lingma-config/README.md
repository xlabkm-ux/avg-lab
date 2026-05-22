# Configuration: Spec Execution

## Purpose

Defines how agents consume `.qoder/specs/` during sprint execution.

## Agent Roles for Spec Execution

### Architect Agent
- **Primary responsibility**: Convert specs into sprint backlogs
- **Input**: Roadmap phases, success metrics, competitive analysis
- **Output**: `.qoder/war-room/sprint-backlog.md`, task cards, ADRs
- **Model tier**: `strong`

### Product Agent (Documentation Agent)
- **Primary responsibility**: Track roadmap progress and success metrics
- **Input**: Sprint completion status, feature delivery
- **Output**: Progress reports, competitive comparison, positioning docs
- **Model tier**: `standard`

### QA Agent
- **Primary responsibility**: Validate success criteria from roadmap
- **Input**: Phase completion goals, metric targets
- **Output**: Test reports, E2E validation, quality gates
- **Model tier**: `standard`

## Spec Consumption Flow

```
.qoder/specs/*.md
       ↓ (Architect reads)
Sprint backlog created in .qoder/war-room/
       ↓ (Agents execute)
Tasks completed → quality gates passed
       ↓ (QA validates)
Success metrics updated in specs/integration-map.md
       ↓ (Product Agent reports)
Roadmap progress tracked and reported
```

## Configuration Rules

1. **Spec Priority**: Active spec is the one referenced in current sprint backlog
2. **Spec Updates**: Roadmap changes require Architect Agent approval
3. **Metric Tracking**: Success metrics are checkboxes in `specs/integration-map.md`
4. **Phase Transitions**: New phase starts when previous phase success criteria met
5. **Conflict Resolution**: If spec conflicts with sprint backlog, stop and replan

## File Ownership

| File | Owner | Editable By |
|------|-------|-------------|
| `.qoder/specs/*.md` | Architect/Product | Architect (approval required) |
| `.qoder/specs/integration-map.md` | Product | Architect, Product, QA |
| `.qoder/specs/README.md` | Architect | All agents (read-only except config updates) |
| `.qoder/lingma-config/*.md` | Architect | All agents (read-only except config updates) |
