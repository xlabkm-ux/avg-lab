# @avg/knowledge — COMING SOON (MVP-6+)

⚠️ **This package is planned but NOT YET IMPLEMENTED.**  
**Do NOT import from this package.** It will be implemented in MVP-6.

---

## Activation Criteria

This package should be implemented when:

1. **External knowledge base integration is needed** - When connecting to external document stores or databases
2. **Vector search is implemented** - When semantic search over knowledge becomes a requirement
3. **Document embeddings are required** - When AI needs to work with vectorized document representations

## Current State

No external knowledge integration needed for MVP-5. All knowledge is project-local.

## Decision

**Defer indefinitely.** Not needed for MVP-5 or Этап 2. This README documents activation criteria only.

## Ownership

See `.codex/agent-registry.md`.

## Required Quality

- TypeScript strict mode.
- Unit tests for pure logic.
- Contract tests for public schemas.
- README updated when public behavior changes.

## First Implementation Tasks

1. Create `src/index.ts`.
2. Add package-level tests.
3. Export typed public API only.

## Status

**Planned for:** MVP-6  
**Current state:** Empty (only .gitkeep in src/)  
**Blocker:** MVP-5 UI completion must finish first
