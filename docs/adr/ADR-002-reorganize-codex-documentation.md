# ADR-002: Reorganize .codex Documentation Structure

**Status:** Accepted
**Date:** 2026-05-21
**Deciders:** Architect Agent
**Consulted:** All Agents
**Informed:** Project Team

## Context

The `.codex` directory had grown to contain 15+ documents at a single level with no clear organization. This created several problems:

1. **Duplication of information**: Rules about parallel work appeared in `parallel-work-policy.md`, `agent-execution-matrix.md`, `sprint-execution-protocol.md`, and `task-protocol.md`.

2. **Unclear navigation**: New agents had difficulty finding relevant documents without reading all of them.

3. **Mixed static and dynamic content**: Task cards (dynamic, daily changes) were stored alongside protocols (static, rarely change).

4. **No hierarchy**: All documents at the same level made it hard to understand relationships between concepts.

5. **Fragmented knowledge**: Related concepts like "Definition of Done" and "Context Budget" were embedded in larger documents instead of being standalone references.

## Decision

Reorganize the `.codex` directory into a hierarchical structure with numbered categories:

```
.codex/
├── README.md                          # Main entry point
├── 00-fundamentals/                   # Core principles (rarely change)
│   ├── mission.md
│   ├── product-principles.md
│   └── system-philosophy.md
├── 01-operating-model/                # How agents work
│   ├── index.md
│   ├── modes.md
│   ├── agent-registry.md
│   └── escalation-protocol.md
├── 02-sprint-management/              # Managing sprints
│   ├── sprint-execution-protocol.md
│   ├── task-protocol.md
│   ├── parallel-work-policy.md
│   └── model-policy.md
├── 03-quality-gates/                  # Quality control
│   ├── review-protocol.md
│   ├── conflict-protocol.md
│   └── definition-of-done.md
├── 04-agent-execution/                # Task execution
│   ├── agent-execution-matrix.md
│   ├── handoff-protocol.md
│   └── context-budget.md
├── templates/                         # Static templates
│   ├── task-card.yaml
│   ├── pr-template.md
│   └── task-templates/
├── context-packs/                     # Context packs (unchanged)
├── runbooks/                          # Runbooks (unchanged)
├── skills/                            # Skills (unchanged)
└── war-room/                          # Dynamic state
    ├── README.md
    ├── active-epics.md
    ├── sprint-backlog.md
    ├── daily-agent-brief.md
    ├── decisions.md
    ├── risk-radar.md
    ├── project-backlog-progress.md
    ├── tasks/                         # Task cards
    └── archive/                       # Completed sprints
```

### Key Changes

1. **Numbered directories** indicate reading order and priority
2. **Extracted standalone documents**:
   - `definition-of-done.md` from `task-protocol.md`
   - `handoff-protocol.md` from `agent-execution-matrix.md`
   - `context-budget.md` from `task-protocol.md`
   - `product-principles.md` from `AGENTS.md`
   - `system-philosophy.md` new document
3. **Separated static vs dynamic**: Templates and protocols are separate from war-room state
4. **Created navigation hub**: Main README.md provides quick access to all sections
5. **Task cards organized**: Moved to `war-room/tasks/` subdirectory

## Consequences

### Positive

- **Improved discoverability**: Agents can find relevant documents faster using numbered categories
- **Reduced duplication**: Each principle lives in one place with cross-references
- **Better onboarding**: Clear reading order for new agents
- **Easier maintenance**: Smaller, focused documents are easier to update
- **Clear separation**: Static protocols vs dynamic state is now explicit
- **Modular updates**: Can update one document without affecting others

### Negative

- **Migration overhead**: Existing links and references need updating
- **Learning curve**: Agents familiar with old structure need to adapt
- **More files**: Increased file count may seem overwhelming initially

### Neutral

- **No functional changes**: Only documentation structure changed, not behavior
- **Backward compatible**: Old concepts still exist, just reorganized

## Migration Plan

1. Create new directory structure
2. Copy files to new locations
3. Create new extracted documents
4. Update internal links and references
5. Update AGENTS.md with new navigation
6. Archive old flat structure
7. Communicate changes via daily-agent-brief

## References

- [New .codex README](../../.codex/README.md)
- [War Room README](../../.codex/war-room/README.md)
- [Updated AGENTS.md](../../AGENTS.md)
