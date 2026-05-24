# @avg/concept-forge — COMING SOON (MVP-6+)

⚠️ **This package is planned but NOT YET IMPLEMENTED.**  
**Do NOT import from this package.** It will be implemented in MVP-6.

---

## Activation Criteria

This package should be implemented when:

1. **Concept generation becomes a standalone feature** - When creative assistance separates from dialogue
2. **Frame collision operators are implemented** - When systematic concept manipulation is needed
3. **Creative assistance is separated from dialogue** - When concept work becomes its own service

## Current State

Concept generation happens within the dialogue flow. Sufficient for MVP-5.

## Decision

**Defer until UTS phase.** This README documents activation criteria only. No implementation needed yet.

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
