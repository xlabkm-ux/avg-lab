# @avg/observability — COMING SOON (Phase 2, Week 4)

⚠️ **This package is planned but NOT YET IMPLEMENTED.**  
**Do NOT import from this package.** Basic observability will be implemented in Phase 2, Week 4.

---

## Activation Criteria

This package should be implemented when:

1. **Production deployment is planned** - When moving beyond local development
2. **Structured logging is required for debugging** - When basic console logs become insufficient for tracing
3. **Metrics collection is needed for capacity planning** - When performance monitoring and scaling decisions require data

## Current State

Basic file-based error logging exists in API. Sufficient for MVP-5 and development.

## Decision

**Defer until Этап 2.** This README documents activation criteria only. No implementation needed yet.

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

**Planned for:** Phase 2, Week 4  
**Current state:** Empty (only .gitkeep in src/)  
**Blocker:** MVP-5 UI completion must finish first
