# Active Epics

Approved execution plan: `docs/00-product/mvp-5-working-interface-plan.md`.

Deferred advanced-services boundary: `docs/00-product/mvp-6-advanced-services-plan.md`.

Archived completed work:

- `.qoder/war-room/archive/mvp-0-to-mvp-3-2026-05-20/`
- `.qoder/war-room/archive/mvp-4-sprint-6-2026-05-20/`

Sprint backlog: `.qoder/war-room/sprint-backlog.md`.

## Epic AVG-MVP-5: Working Product Interface

Status: active.

Goal: turn the existing AVG contract slices into a complete, user-testable browser interface for the main planned system functions.

Deliverables:

- integrated project workspace;
- structured dialogue surface;
- claim review panel;
- local document workspace;
- grounded retrieval flow with citations;
- concept map surface;
- artifact workspace and export;
- E2E, visual and accessibility smoke coverage.

Planning notes:

- MVP-5 must produce a fully usable interface, not another backend-only vertical slice.
- MVP-5 must preserve claim status, language mode, scope, validation risk and map/territory boundaries in the UI.
- Voice, realtime collaboration, production vector search, OCR, external ingestion and other complex services are moved to MVP-6.
- MVP-6 is not in active design during MVP-5.

## Epic AVG-MVP-6: Advanced Services

Status: deferred.

Goal: later design voice, realtime collaboration and production-grade services after the core interface is working.

Deferred areas:

- voice capture and speech processing;
- realtime collaboration and presence;
- production vector database;
- production document storage and permissions;
- OCR and external web ingestion;
- background indexing workers.

Rule: do not implement or deeply design MVP-6 capabilities during MVP-5 without human approval.
