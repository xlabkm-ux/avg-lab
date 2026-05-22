# packages/avg-openai

OpenAI adapter: Responses API, Realtime API, tools, structured outputs, model routing.

## Ownership

See `.codex/agent-registry.md`.

## Required Quality

- TypeScript strict mode.
- Unit tests for pure logic.
- Contract tests for public schemas.
- README updated when public behavior changes.

## Sprint Task

Current implementation is aligned to Sprint 1 `AVG-103`: OpenAI adapter boundary and normalized provider errors.

The package stays provider-boundary only; it does not depend on app code.

## Current Public API

- `openAIAdapterBoundary` declares package ownership, supported capabilities and boundary status.
- `normalizeOpenAIProviderError()` converts heterogeneous provider failures into stable AVG error codes.
