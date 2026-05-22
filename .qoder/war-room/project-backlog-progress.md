# Project Backlog Progress

This file is the live progress view for Phase 5.

Source of truth:

- `docs/00-product/mvp-5-working-interface-plan.md`
- `docs/00-product/product-layer-gap-matrix.md`
- `docs/00-product/mvp-6-advanced-services-plan.md`
- `.qoder/war-room/sprint-backlog.md`
- `.qoder/war-room/daily-agent-brief.md`

Status legend:

- `ready`: approved and not started;
- `in progress`: active work exists in the current war-room state;
- `blocked`: cannot continue without decision or upstream work;
- `done`: completed and verified against the task definition of done;
- `deferred`: planned for a later approved milestone.

## Snapshot

Layer-level product gaps are tracked in `docs/00-product/product-layer-gap-matrix.md`.

| Area | Progress | Current State |
|---|---:|---|
| Sprint 7: Interface Foundation | 3 / 4 done | interface contract, workspace shell/local state and structured dialogue surface are implemented |
| Sprint 8: Core Product Functions | 0 / 4 done | planned |
| Sprint 9: Product Hardening | 0 / 4 done | planned |
| MVP-6: Advanced Services | 0 / 1 planning gate | deferred |

## Sprint 7: Interface Foundation

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-701 | Architect/Product | done | 100% | interface contract frozen in `docs/05-ui-ux/mvp-5-interface-contract.md` and UI API boundary frozen in `docs/04-api/mvp-5-ui-api-boundary.md` |
| AVG-702 | Frontend | done | 100% | workspace shell and browser-local project/session state helpers implemented in `apps/web`; verified with `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` |
| AVG-703 | Frontend/Validation | done | 100% | structured dialogue surface, visible response details and invalid-response error states implemented in `apps/web`; API runtime safety hardened in `apps/api` |
| AVG-704 | Frontend/Backend | ready | 0% | build document workspace against the frozen interface contract |

## Sprint 8: Core Product Functions

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-705 | Frontend/Retrieval | ready | 0% | grounded retrieval flow and citation panel |
| AVG-706 | Frontend/Validation | ready | 0% | claim review panel |
| AVG-707 | Frontend/Graph | ready | 0% | concept map surface |
| AVG-708 | Frontend/Product | ready | 0% | artifact workspace and export |

## Sprint 9: Product Hardening

| Task | Owner | Status | Progress | Evidence / Next Step |
|---|---|---|---:|---|
| AVG-709 | QA | ready | 0% | E2E happy path and missing evidence path |
| AVG-710 | QA/Security | ready | 0% | prompt-injection-as-source UI proof |
| AVG-711 | Frontend/QA | ready | 0% | visual and accessibility smoke |
| AVG-712 | Product/Release | ready | 0% | release notes, risk review and rollback plan |

## MVP-6 Deferred

| Area | Status | Boundary |
|---|---|---|
| Voice and speech services | deferred | do not design during MVP-5 |
| Realtime collaboration | deferred | do not design during MVP-5 |
| Production vector/storage services | deferred | do not select dependencies during MVP-5 |
| OCR and external ingestion | deferred | do not design during MVP-5 |

## Verification

MVP-5 implementation verification has started. AVG-702 and AVG-703 were checked with:

- `pnpm --filter @avg/web test`
- `pnpm --filter @avg/web typecheck`
- `pnpm --filter @avg/web lint`
- `pnpm --filter @avg/web build`
- `pnpm --filter @avg/api test`
- `pnpm --filter @avg/api typecheck`
- `pnpm --filter @avg/api lint`
- `pnpm --filter @avg/api build`

Broader Sprint 7 and MVP-5 changes should still be checked with at least:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`

Before closing MVP-5, run the full gate listed in `sprint-backlog.md`.

## Update Rules

- Update this file when a task moves between `ready`, `in progress`, `blocked`, `done` or `deferred`.
- Every `done` task must list the checks or review evidence that closed it.
- Every non-`done` task must state the objective blocker, missing dependency or concrete remaining work.
