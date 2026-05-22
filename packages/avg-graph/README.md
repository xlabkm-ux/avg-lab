# packages/avg-graph

Graph projections, in-memory repository helpers and future Neo4j sync surfaces.

## Ownership

See `.codex/agent-registry.md`.

## Required Quality

- TypeScript strict mode.
- Unit tests for pure logic.
- Contract tests for public schemas.
- README updated when public behavior changes.

## Current Surface

- `projectClaimToMapNode(claim)` projects a validated claim into a map node plus cite edges.
- `createGraphRepository()` provides an in-memory repository for nodes, edges, snapshots and diffs.
- `createEmptyGraphSnapshot()` creates a stable empty baseline for map diff APIs.
- `cloneGraphSnapshot(snapshot)` returns a defensive copy of nodes and edges.
- `diffGraphSnapshots(from, to)` computes added, updated and removed map records without requiring a repository instance.
- `GraphSnapshot` and `GraphDiff` describe the repository read surface.

## Notes

- The repository is intentionally in-memory for the Sprint 5 slice.
- JSON Schema remains the source of truth for node and edge validation.
- Future Neo4j integration should layer on top of this projection boundary instead of replacing it.

## First Implementation Tasks

1. Keep the projection helpers typed and deterministic.
2. Preserve the claim status, language mode and map safety contract.
3. Add package-level tests whenever public behavior changes.
