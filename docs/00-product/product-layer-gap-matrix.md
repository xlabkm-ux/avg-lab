# Product Layer Gap Matrix

## Purpose

This matrix translates the AVG product roadmap into a layer-by-layer execution view.
It does not replace the sprint backlog. It answers a different question:

> Which product layers already have working assets, where is the gap between code and user value, and which task closes that gap next?

Use this file when planning agent work, reviewing roadmap claims, or checking whether a task advances the product instead of only expanding the blueprint.

## Reading Rules

- `Current asset` means implemented code, frozen contract, or active documentation that can be built on now.
- `Product gap` means the missing user-visible capability or safety boundary.
- `Next task` should point to the smallest coherent task already in the backlog when possible.
- `Acceptance criteria` must preserve scope, claim status, language mode, validation risk, access mode, and map/territory boundaries.

## MVP-5 Layer Matrix

| Layer | Current asset | Product gap | Next task | Acceptance criteria |
|---|---|---|---|---|
| Core domain | JSON Schemas in `schemas/json-schema`; runtime AJV validators and shared types in `packages/avg-schemas`; structured response, claim, node, edge and document contracts | No explicit claim status transition history or versioned domain evolution policy in the user flow | Keep current contracts stable during MVP-5; defer state-machine expansion unless required by UI contract | Structured responses and claims render only after schema validation; no public schema changes happen without contract tests and migration notes |
| Graph / knowledge | `packages/avg-graph` supports claim projection, in-memory repository snapshots and graph diffs | Graph output is not yet connected into a user-visible evolving map workspace | `AVG-707` concept map surface from session material | User can inspect map nodes and edges from session material; node metadata preserves claim status, language mode and risks; UI states clearly that the map is a working projection, not Reality |
| Validation / epistemic layer | `packages/avg-validation` supports claim extraction, contract validation, risk classification, repair suggestions and grounded response composition | Claim review is not yet a first-class user surface across the workspace | `AVG-706` claim review panel with validation risk and repair suggestions | User can inspect extracted claims, status, language mode, validation result, risk level, repair suggestions and boundary notes; high-risk or unsupported claims do not look equivalent to grounded claims |
| Generation / dialogue | `packages/avg-agents` provides mode routing and structured response composition; `apps/web` renders structured dialogue surfaces; `apps/api` has local route boundaries | The browser flow still needs to feel like one coherent AVG dialogue instead of isolated render helpers | Continue `AVG-703` hardening through `AVG-704` and `AVG-705`; keep model integration inside existing structured boundaries | User can submit a raw thought and see a structured AVG response with scope, claim status, language mode, validation risk, map/territory boundary and next action; invalid structured output fails visibly |
| Retrieval / documents | `packages/avg-retrieval` supports local document registration, chunking, snippet ids, deterministic search and citation ids; `apps/api` exposes document and retrieval routes | Document registration and grounded retrieval need to be exposed as product surfaces in the workspace | `AVG-704` document workspace, then `AVG-705` grounded retrieval flow and citation panel | User can register local text or markdown, inspect snippets, ask against project-local evidence, see retrieval confidence as a risk signal, and inspect snippet-level citations |
| Visualization / UI | `apps/web` has workspace shell, browser-local project/session state, structured dialogue rendering and concept-map render helpers | MVP-5 still lacks the complete browser workspace across documents, retrieval, claim review, map and artifacts | `AVG-704` through `AVG-708` | User can move through Dialogue, Documents, Retrieval, Claim Review, Map and Artifacts in one local workspace without needing internal package knowledge |
| Evaluation / quality | `packages/avg-evals`, `scripts/evals`, package tests and contract tests cover core no-fairy-tale and claim-safety behavior | Product-level E2E, missing-evidence and prompt-injection-as-source proofs are not complete | `AVG-709`, `AVG-710`, `AVG-711` | Happy path, missing evidence path and prompt-injection-as-source path are covered; visual and accessibility smoke exist for the main workspace; prompt behavior changes require eval updates |
| Infrastructure / production readiness | pnpm/turbo workspace, CI-oriented scripts, API error envelopes, request limits and local log boundary exist | MVP-5 must remain local-product ready without drifting into production storage, realtime collaboration or advanced services | `AVG-712` release notes, risk review and rollback plan | Standard gates pass; limitations and rollback are documented; MVP-6 work remains deferred unless a new approved planning gate changes the boundary |

## Product Slice Target

MVP-5 is complete when these layers support one local user journey:

```text
project
-> raw thought
-> structured response
-> claim review
-> local document
-> grounded retrieval
-> citations and unsupported claims
-> concept map
-> artifact export
```

The journey may use deterministic local services. It does not require production vector search, realtime collaboration, voice, or multi-tenant storage.

## Deferred Layer Decisions

The following decisions are intentionally not blockers for MVP-5:

- production graph database selection;
- production vector database selection;
- CRDT or realtime transport;
- voice capture, speech-to-text, or text-to-speech;
- authentication, permissions, or organization sharing;
- OCR and external web ingestion;
- multi-provider model routing beyond the current local contract needs.

These belong to the MVP-6 planning gate unless a human owner explicitly reopens scope.

## Update Rules

- Update this matrix when a layer gains a new completed asset or when the next task changes.
- Do not mark a product gap closed unless the user-visible acceptance criteria are met.
- Keep backlog status in `.codex/war-room/project-backlog-progress.md`; keep layer reasoning here.
