# Sprint 6 Closure Summary

## Sprint

MVP-4 Retrieval and Documents.

Closed: 2026-05-20.

## Outcome

Sprint 6 is complete. AVG now has a local deterministic retrieval vertical slice that lets project documents support source-grounded answers without collapsing documents into Reality.

## Completed Tasks

- AVG-601: retrieval grounding contract freeze.
- AVG-602: document registration and local store boundary.
- AVG-603: deterministic chunking and search surface.
- AVG-604: source-grounded response composer with citation boundaries.
- AVG-605: citation panel, smoke tests and retrieval eval fixtures.

## Delivered Capabilities

- Project-local document registration.
- Stable document references validated by schema.
- Deterministic text chunking with stable snippet ids.
- Retrieval search with snippet-level citation ids.
- Grounded response composition with citations, grounded claims, interpretations, unsupported claims, retrieval confidence and boundary statement.
- Web citation panel with visible source snippets and unsupported areas.
- OpenAPI paths for document registration and retrieval search.
- Retrieval eval fixtures for source grounding, unsupported claims, citation completeness, low confidence, prompt injection and map/territory boundary preservation.

## Verification

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test:contract`
- `pnpm test:ai`

## Deferred

- Production vector database selection.
- OCR for scanned documents.
- External web retrieval.
- Source trust scoring.
- Long-term document storage policy.
- Document permissions and collaboration.

## Rollback

Disable document registration routes, retrieval search calls, grounded response composition and citation panel rendering. Existing dialogue, validation and concept map behavior continue without retrieval.
