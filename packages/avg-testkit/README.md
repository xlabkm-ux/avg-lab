# packages/avg-testkit

Typed test helpers for fixtures, fixture loading and reusable QA utilities.

## Ownership

See `.codex/agent-registry.md`.

## Required Quality

- TypeScript strict mode.
- Unit tests for pure logic.
- Contract tests for public schemas.
- README updated when public behavior changes.

## Current Public API

- `testkitPackageBoundary` declares the package boundary as a skeleton only.
- `resolveFixtureUrl()` resolves package-local fixture URLs.
- `loadJsonFixture()` loads JSON fixtures for tests.
