# MVP-4 Retrieval and Documents Plan

## Purpose

MVP-4 adds source-aware retrieval to AVG without weakening the product principle that AVG is a map-making and map-checking system, not a truth machine.

The goal is to let a user register project documents, retrieve relevant source snippets, and receive answers that clearly separate:

- cited source content;
- AVG interpretation;
- hypothesis or uncertainty;
- unsupported claims;
- map/territory boundaries.

## Product Boundary

MVP-4 must not turn AVG into a generic RAG chatbot. Documents are evidence inputs inside a project scope, not direct access to Reality.

Every grounded response must preserve:

- specific source snippets, not vague source names;
- claim status and language mode from the structured AVG response;
- retrieval confidence as a risk signal, not a truth label;
- visible unsupported or low-confidence areas;
- a boundary statement when evidence is missing or weak.

## Scope

Approved MVP-4 scope:

- retrieval and source-grounding contract;
- minimal document registration and text extraction boundary;
- local document store and deterministic retrieval index;
- snippet-level citation ids;
- citation-aware answer composition;
- source/citation panel in the web surface;
- retrieval smoke tests and AI eval fixtures.

## Non-Scope

Deferred until later phases:

- production vector database selection;
- document collaboration permissions;
- OCR for scanned documents;
- broad RAG over external web sources;
- automatic source trust scoring;
- voice-driven document workflows;
- long-term document retention and tenant storage policy.

## Contract Baseline

Sprint 6 freezes these contract documents before broader implementation work:

- `docs/02-ai-system/retrieval-grounding-contract.md`
- `docs/04-api/retrieval-api-contract.md`
- `schemas/json-schema/document.schema.json`
- `packages/avg-retrieval/README.md`
- `packages/avg-validation/README.md`

The current public schema strategy keeps `schemas/json-schema/avg-response.schema.json` unchanged until the smallest stable grounded response shape is proven.

## Architecture Slice

MVP-4 uses a local deterministic vertical slice:

1. Register document text against a project.
2. Store a typed `AvgDocumentRef`.
3. Split text into stable `AvgSourceSnippet` records.
4. Search snippets by deterministic local scoring.
5. Return `AvgRetrievalHit` records with citation ids.
6. Compose a grounded response boundary.
7. Render citations, grounded claims, interpretations, unsupported claims and boundary statement in the web surface.

This intentionally avoids a production vector database until the source-grounding contract proves useful and safe.

## Sprint Plan

### Sprint 6: Retrieval Contract and Vertical Slice

Goal: prove a minimal source-grounded answer path end to end.

Deliverables:

- retrieval contract freeze;
- document registration API boundary;
- local text chunk and retrieval surface;
- grounded response composer with citations;
- minimal citation panel;
- retrieval smoke and eval checks.

Definition of Done:

- a document can be registered in local development;
- a query returns source snippets with stable citation ids;
- AVG response marks cited facts, interpretations and uncertainty;
- uncited claims are either avoided or explicitly marked as unsupported;
- low or missing retrieval confidence creates a boundary statement;
- prompt-injection text inside retrieved sources is treated as source content, not instructions;
- tests cover citation shape, retrieval behavior and no-fairy-tale risk;
- docs explain risks and rollback.

## Task Breakdown

### AVG-601: Retrieval Contract Freeze

Owner: Architect.

Status: completed.

Outputs:

- retrieval grounding contract;
- API contract outline;
- document and citation shape;
- deferred decision list for vector database and public response schema changes.

Acceptance:

- source snippets and citations are snippet-level;
- confidence is documented as risk, not truth;
- rollback path is documented.

### AVG-602: Document Registration and Local Store

Owner: Backend.

Status: completed.

Outputs:

- document schema;
- `AvgDocumentRef` validation boundary;
- local in-memory document repository;
- project-local document registration helpers.

Acceptance:

- empty text and invalid metadata are rejected;
- document ids are stable enough for deterministic tests;
- stored state is not exposed for caller mutation.

### AVG-603: Chunking and Retrieval Search

Owner: Retrieval.

Status: completed.

Outputs:

- deterministic chunking;
- stable snippet ids;
- ranked local snippet search;
- retrieval confidence calculation;
- citation ids derived from document and snippet ordinal.

Acceptance:

- search is project-isolated;
- ranking is deterministic;
- retrieval results include snippet id, document id, score, confidence, citation id, matched text and source label.
- root `pnpm test`, `pnpm typecheck`, `pnpm lint` and `pnpm build` pass.

### AVG-604: Grounded Response Composition

Owner: Backend/Validation.

Status: completed.

Outputs:

- citation creation from retrieval hits;
- grounded response boundary;
- separation between grounded claims, interpretations and unsupported claims;
- boundary notes for missing or low-confidence evidence.

Acceptance:

- invalid structured responses stop composition;
- unsupported claims remain visible;
- accepted grounded responses require at least one citation and grounded claim;
- no prompt behavior was changed;
- source-grounding, unsupported, low-confidence and prompt-injection cases are covered by tests or eval fixtures.

### AVG-605: Citation Panel and QA Proof

Owner: Frontend/QA.

Status: completed.

Outputs:

- grounded response details panel;
- citation list with stable ids;
- visible boundary statement;
- retrieval AI eval fixtures.

Acceptance:

- citation panel renders citation id, snippet id, document id, quoted text and relevance;
- unsupported claims and interpretations are visible separately;
- smoke tests prove the document-to-answer path.
- retrieval eval fixtures cover citation completeness, source grounding, unsupported claims, low confidence, prompt injection and map/territory preservation.

## Required Quality Gates

Run the standard project gates before closing MVP-4:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:contract
pnpm test:ai
pnpm build
```

Focused checks should cover:

- `packages/avg-retrieval`;
- `packages/avg-validation`;
- `apps/api`;
- `apps/web`;
- `packages/avg-evals`.

## AI Eval Requirements

MVP-4 requires eval fixtures for:

- source-grounding correctness;
- unsupported-answer boundaries;
- citation completeness;
- prompt injection inside retrieved source text;
- map/territory boundary preservation;
- low-confidence retrieval behavior.

No prompt behavior should be changed without corresponding eval coverage.

## Decision Points

Human approval is required before:

- adding a production vector database;
- changing public response schemas;
- adding document upload dependencies;
- changing prompt behavior for source-grounded answers;
- ingesting external web content;
- storing documents outside the local development boundary.

## Risks

- Retrieval may create false confidence if high-ranking snippets are treated as proof.
- A fluent grounded answer may hide unsupported synthesis.
- Source text may include prompt-injection instructions.
- Citation ids may drift if chunking changes without migration policy.
- UI may imply source trust when it only shows source relevance.

Mitigations:

- keep retrieval confidence visibly labeled as risk;
- require boundary statements for missing or weak evidence;
- keep cited facts separate from interpretations;
- test prompt-injection fixtures;
- avoid production storage and vector commitments in MVP-4.

## Rollback

MVP-4 can be rolled back by disabling:

- document registration routes;
- retrieval search calls;
- grounded response composition;
- citation panel rendering.

Existing dialogue, validation and concept map behavior must continue to work without retrieval. Registered local document data may remain as development-only state, but should not be required for core AVG flows.

## PR Notes

Every MVP-4 PR should include:

- purpose;
- changed areas;
- tests run;
- AI evals run if prompt or model behavior changed;
- source-grounding risks;
- rollback plan;
- affected agents;
- migration notes if schemas or ids change.
