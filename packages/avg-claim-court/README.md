# @avg/claim-court — COMING SOON (MVP-6+)

⚠️ **This package is planned but NOT YET IMPLEMENTED.**  
**Do NOT import from this package.** It will be implemented in MVP-6.

---

## Activation Criteria

This package should be implemented when:

1. **Claim adjudication becomes a separate service** - When claim review logic grows beyond inline validation
2. **Multi-model claim comparison is needed** - When claims need to be evaluated across multiple AI models
3. **Claim conflict resolution is implemented** - When contradictory claims require systematic resolution

## Current State

Claim validation is handled inline by @avg/validation. Sufficient for MVP-5.

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
