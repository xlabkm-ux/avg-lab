# packages/avg-agents

Runtime agent orchestration: mode router, task planner, agent roles.

## Ownership

See `.codex/agent-registry.md`.

## Required Quality

- TypeScript strict mode.
- Unit tests for pure logic.
- Contract tests for public schemas.
- README updated when public behavior changes.

## Current Public API

- `routeDialogueMode()` selects the runtime mode for an instruction.
- `composeStructuredResponse()` builds a contract-valid AVG response object.

## Sprint Task

Current implementation is aligned to Sprint 1 `AVG-104`: mode router and response composer.

The package stays pure and does not call providers or depend on app code.
