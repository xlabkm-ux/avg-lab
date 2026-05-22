# Decisions Log

## 2026-05-20 — Blueprint created

Decision: Use Codex-native monorepo with AGENTS.md, `.qoder/`, docs, schemas, prompts, tests and package skeleton.

Reason: AVG requires parallel AI-assisted engineering with strict control over contracts and AI behavior.

## 2026-05-20 — MVP-0 to MVP-2 execution plan approved

Decision: Start development with MVP-0 Repository Operating System, then MVP-1 Core Dialogue, then MVP-2 Claim Validation.

Reason: AVG must prove structured dialogue and claim discipline before investing in visual maps, retrieval, voice or production deployment.

Consequence: MVP-3 Concept Map, retrieval and voice are deferred. Contract work is sequential; implementation work may run in parallel only after contracts are stable.

## 2026-05-20 — Model budget policy approved

Decision: Use `.qoder/model-policy.md` to assign the lowest safe model tier per sprint task. Agents must start with the approved model and must not silently escalate to a stronger model.

Reason: Project resources are limited, while architecture, shared contracts and AVG validation behavior still require stronger review when risk is high.

Consequence: Sprint backlog includes a model budget table. Escalation to a stronger model requires a human-approved escalation note.

## 2026-05-20 — Phase 4 war-room activated

Decision: Archive completed MVP-0 through MVP-3 working documents and activate Phase 4: Retrieval and Documents.

Reason: Completed sprint materials should remain available as history, while active agent work needs a clean backlog focused on retrieval, documents and citation discipline.

Consequence: Current war-room files now point to Sprint 6 and MVP-4. Completed work lives in `.qoder/war-room/archive/mvp-0-to-mvp-3-2026-05-20/`.

## 2026-05-20 — AVG-601 retrieval grounding contract frozen

Decision: Freeze the MVP-4 retrieval and grounding contract in `docs/02-ai-system/retrieval-grounding-contract.md` and `docs/04-api/retrieval-api-contract.md`.

Reason: Backend, retrieval, validation and UI work need a stable citation boundary before implementation starts.

Consequence: AVG-602 may start against a local deterministic document store boundary. Public response schema changes are deferred until AVG-604 confirms the smallest stable grounded response extension.

## 2026-05-20 — Sprint 6 MVP-4 closed

Decision: Close Sprint 6 as completed for MVP-4 Retrieval and Documents.

Reason: The sprint delivered the contract-first local retrieval vertical slice: document registration, deterministic chunking/search, snippet-level citation ids, grounded response composition, citation panel rendering and critical retrieval eval fixtures.

Consequence: MVP-4 remains local and deterministic. Production vector database selection, OCR, external web ingestion, long-term document storage and document permission policy stay deferred to later approved milestones.

## 2026-05-20 — Phase 5 working interface activated

Decision: Activate MVP-5 as a working product interface milestone and archive completed MVP-4 task cards.

Reason: MVP-4 proved the retrieval and grounding contracts, but the product now needs a complete browser interface that exposes the main AVG functions to a user without developer mediation.

Consequence: Current war-room files now point to Sprint 7 through Sprint 9. MVP-5 focuses on workspace, dialogue, claim review, documents, grounded retrieval, concept map and artifacts.

## 2026-05-20 — Voice and advanced services deferred to MVP-6

Decision: Move voice, realtime collaboration, production vector search, OCR, external web ingestion, production document storage and other complex services into MVP-6.

Reason: The next product risk is interface completeness and usability, not advanced infrastructure. Designing audio or complex services before the core interface works would blur scope and weaken delivery focus.

Consequence: MVP-5 may leave reversible extension points, but must not implement or deeply design MVP-6 capabilities without human approval.

## 2026-05-20 — AVG-701 MVP-5 interface contract frozen

Decision: Freeze the MVP-5 interface contract and UI API boundary for Sprint 7.

Reason: AVG-702 through AVG-704 need stable workspace, state, rendering and API boundaries before implementation starts.

Consequence: Sprint 7 implementation can proceed with workspace shell, structured dialogue surface and document workspace. Voice, realtime collaboration, production vector storage, OCR and external ingestion remain deferred to MVP-6.
