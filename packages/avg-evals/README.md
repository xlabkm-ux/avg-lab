# packages/avg-evals

AI eval runner, datasets, judges and reports.

## Ownership

See `.codex/agent-registry.md`.

## Required Quality

- TypeScript strict mode.
- Unit tests for pure logic.
- Contract tests for public schemas.
- README updated when public behavior changes.

## First Implementation Tasks

## Current Public API

- `fixtureRequiresBoundary` checks whether a static eval fixture declares a boundary requirement.
- `scoreClaimSafetyAnswer` scores an answer for strong-word, metaphor and boundary discipline.
- `scoreNoFairyTaleAnswer` scores an answer against the no-fairy-tale gate and returns failure and reward signals.

## Contract Notes

- claim-safety scoring is deterministic and heuristic;
- no-fairy-tale scoring is deterministic and heuristic;
- strong words, certainty, metaphor and actionability remain visible in the report;
- the package exports typed public API only.
- AI eval commands run as deterministic Node gates in `scripts/evals`.
