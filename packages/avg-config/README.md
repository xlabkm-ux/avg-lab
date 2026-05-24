# @avg/config — COMING SOON (MVP-6+)

⚠️ **This package is planned but NOT YET IMPLEMENTED.**  
**Do NOT import from this package.** It will be implemented in MVP-6.

---

## Activation Criteria

This package should be implemented when:

1. **Environment variable validation is needed in production** - Current inline validation in apps/api/src/index.ts becomes insufficient
2. **Multiple apps need shared configuration schema** - When apps/api, apps/web, apps/worker all need consistent config
3. **Configuration hot-reload is required** - When runtime config updates without restart become necessary

## Current State

Environment variables are validated inline in `apps/api/src/index.ts`. This works fine for MVP-5 and development.

## Decision

**Defer until Этап 2 (Technology Leadership).** This README documents activation criteria only. No implementation needed yet.

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
