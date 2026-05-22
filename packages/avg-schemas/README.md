# packages/avg-schemas

Typed access to AVG JSON Schema contracts and AJV validators.

## Ownership

See `.codex/agent-registry.md`.

## Required Quality

- JSON Schema files remain the contract source of truth.
- TypeScript exports must preserve claim status, language mode, scope and map/territory boundaries.
- Contract tests must cover valid and invalid fixtures.

## Current Contract Surface

- `claim.schema.json` validates AVG claims.
- `map-node.schema.json` and `map-edge.schema.json` validate map artifacts.
- `avg-response.schema.json` validates the Sprint 1 structured dialogue response.
- `document.schema.json` validates the MVP-4 local document reference.
- `schemas/openapi/openapi.yaml` exposes the MVP-4 document registration and retrieval search API paths.
