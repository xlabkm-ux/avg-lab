# packages/avg-validation

Claim extraction and schema validation for AVG structured responses.

## Ownership

See `.qoder/agent-registry.md`.

## Required Quality

- TypeScript strict mode.
- Unit tests for pure logic.
- Contract tests for public schemas.
- README updated when public behavior changes.

## Current Public API

- `validateClaimContract` validates claim-level discipline and boundary notes.
- `extractClaimsFromAvgResponse` extracts schema-bound claim candidates from a validated AVG structured response.
- `classifyClaimDiscipline` classifies claim status and language mode from claim text.
- `classifyClaimRisk` detects strong-word, dogma and map/territory risks and returns repair suggestions.
- `composeGroundedResponse` wraps a structured response with citations, grounded claims, interpretations and unsupported claims.
- `isAvgClaim` and `isAvgStructuredResponse` expose type guards for downstream packages.

## Contract Notes

- claim extraction is deterministic and response-shaped;
- claim candidates preserve `claim_status`, `language_mode`, `scope`, `risks` and `source_refs`;
- classifier output preserves the gap between an input claim and the preferred map discipline;
- repair suggestions preserve uncertainty and avoid collapsing metaphor into fact;
- schema violations stop extraction before downstream validation begins.
