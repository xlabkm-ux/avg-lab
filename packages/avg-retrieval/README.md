# packages/avg-retrieval

Document ingestion, chunking, retrieval search, citations and source policies.

Sprint 6 starts with a local deterministic retrieval surface. Production vector search is intentionally deferred until the grounding contract is proven.

## Ownership

See `.codex/agent-registry.md`.

## Required Quality

- TypeScript strict mode.
- Unit tests for pure logic.
- Contract tests for public schemas.
- README updated when public behavior changes.

## Current Surface

- `createDocumentRepository()` creates a local in-memory document repository.
- `registerDocument()` stores project-local document text and returns a stable `AvgDocumentRef`.
- `chunkDocumentText()` splits source text into deterministic `AvgSourceSnippet` records.
- `getDocument()`, `getDocumentText()`, `getDocumentSnippets()` and `listDocuments()` expose the local store boundary.
- `listDocumentSnippets()` and `searchDocuments()` provide a deterministic retrieval surface with snippet-level citation ids.

## Contract Baseline

- `docs/02-ai-system/retrieval-grounding-contract.md`
- `docs/04-api/retrieval-api-contract.md`

The package must preserve snippet-level citation ids, retrieval confidence as a risk signal, and the map/territory boundary required by AVG.

## Usage Notes

The repository is intentionally local and deterministic for Sprint 6. It stores source text, chunks it into stable snippets at registration time, and returns ranked snippet hits with retrieval confidence as a risk signal rather than a truth label.
