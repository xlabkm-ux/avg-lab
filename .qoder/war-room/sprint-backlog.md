# Sprint Backlog

This backlog covers Phase 5: Working Product Interface.

**Strategic source:** [`.qoder/specs/avg-leadership-roadmap.md`](../../.qoder/specs/avg-leadership-roadmap.md) — Phase 1: MVP-5 Completion

Source of truth:

- `docs/00-product/mvp-5-working-interface-plan.md`
- `docs/00-product/mvp-6-advanced-services-plan.md`
- `.qoder/specs/integration-map.md` — Roadmap-to-sprint mapping

## Sprint 7: Interface Foundation

Goal: create the integrated web workspace and connect it to existing deterministic local flows.

Status: **completed**.

| Task | Owner | Parallel | Risk | Output | Status |
|---|---|---:|---|---|---|
| AVG-701 | Architect/Product | no | red | MVP-5 interface contract freeze | ✅ |
| AVG-702 | Frontend | yes, after AVG-701 | yellow | workspace shell and local project/session state | ✅ |
| AVG-703 | Frontend/Validation | yes, after AVG-701 | red | dialogue surface with structured response details | ✅ |
| AVG-704 | Frontend/Backend | yes, after AVG-701 | yellow | document workspace and registration flow | ✅ |

Exit criteria:

- [x] user can create a project, submit a thought, register a document and see core panels in one browser interface;
- [x] no voice, realtime collaboration or production services are introduced.

Gate note:

- All Sprint 7 tasks complete. Ready for Sprint 8.

## Sprint 8: Core Product Functions

Goal: make the planned AVG functions usable in the browser.

Status: **in progress** (AVG-706, AVG-707 completed via Sprint 1.3).

| Task | Owner | Parallel | Risk | Output | Status |
|---|---|---:|---|---|---|
| AVG-705 | Frontend/Retrieval | yes | red | grounded retrieval flow with citation panel | ✅ (Sprint 1.2) |
| AVG-706 | Frontend/Validation | yes | red | claim review panel with risk and repair suggestions | ✅ (Sprint 1.3) |
| AVG-707 | Frontend/Graph | yes | yellow | concept map surface from session material | ✅ (Sprint 1.3) |
| AVG-708 | Frontend/Product | yes | yellow | artifact workspace and export | pending |

Exit criteria:

- [x] grounded retrieval flow with citation panel (AVG-705, Sprint 1.2);
- [x] claim review panel with validation risk and repair suggestions (AVG-706, Sprint 1.3);
- [x] concept map surface from session material (AVG-707, Sprint 1.3);
- [ ] artifact workspace and export (AVG-708, Sprint 1.4);
- [ ] user can complete the full MVP-5 scenario from dialogue through artifacts;
- [ ] grounded answers, claim review, map and exports share one project state.

## Sprint 9: Product Hardening

Goal: prove the interface is complete enough for user testing.

Status: planned.

| Task | Owner | Parallel | Risk | Output |
|---|---|---:|---|---|
| AVG-709 | QA | yes | red | E2E happy path and missing evidence path |
| AVG-710 | QA/Security | yes | red | prompt-injection-as-source UI proof |
| AVG-711 | Frontend/QA | yes | yellow | visual and accessibility smoke |
| AVG-712 | Product/Release | no | yellow | release notes, risk review and rollback plan |

Exit criteria:

- MVP-5 can be tested by a user without developer mediation;
- release quality gates pass;
- known limitations are documented.

## Sprint 10: Refactoring Audit & Quality Infrastructure

Goal: fix broken quality gates, resolve architectural violations, establish real testing and linting, create developer tooling.

Status: **completed**.

| Task | Owner | Parallel | Risk | Output | Status |
|---|---|---:|---|---|---|
| AVG-719a | Backend/QA | no | red | Phase 0: Fix broken quality gates | ✅ |
| AVG-719b | Architect/Backend | no | red | Phase 1: Fix architectural layer violation | ✅ |
| AVG-719c | Backend | yes, after AVG-719b | yellow | Phase 2: Split monolithic files | ✅ |
| AVG-718 | Frontend/QA | yes | yellow | Phase 3: Make UI tests real | ✅ |
| AVG-720 | Backend/QA | yes | red | Phase 4: Add real TypeScript linting | ✅ |
| AVG-721 | DevOps | yes | green | Phase 5: Operational improvements | ✅ |

Exit criteria:

- [x] All quality gates pass (`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`)
- [x] Architectural layer violation resolved (@avg/api no longer imports @avg/web)
- [x] Monolithic files split into focused modules (1,881 → 118 lines for web)
- [x] Real UI tests with React Testing Library (13 passing tests)
- [x] Real TypeScript linting with ESLint (0 errors, 25 warnings)
- [x] Developer tooling scripts created (4 PowerShell scripts)

Gate note:

- All Sprint 10 tasks complete. Quality infrastructure established.
- Token budget: 29,000 plan, 26,300 actual, -2,700 variance (under budget by 9%)
- 95 ESLint issues fixed (100% of errors eliminated)
- 36 tests passing (22 @avg/api + 13 new @avg/web component tests + 1 smoke test)

## Sprint 1.5: Quality Gates

Goal: implement comprehensive quality gates including visual regression, accessibility testing, code coverage, integration tests, Storybook, and CI/CD improvements.

Status: **completed**.

| Task | Owner | Parallel | Risk | Output | Status |
|---|---|---:|---|---|---|
| AVG-722 | QA/Frontend | yes | red | Visual regression testing with Playwright screenshot comparison | ✅ |
| AVG-723 | QA/Frontend | yes | red | Accessibility testing with axe-core integration | ✅ |
| AVG-724 | QA/Backend | yes | yellow | Code coverage reporting with Vitest and Codecov | ✅ |
| AVG-725 | QA/Backend | yes | yellow | Integration test framework infrastructure | ✅ |
| AVG-726 | Frontend | yes | green | Storybook setup with initial component stories | ✅ |
| AVG-727 | DevOps | yes | red | CI/CD pipeline updates for all quality gates | ✅ |
| AVG-728 | DevOps | yes | red | Fix auto-merge approval requirements | ✅ |
| AVG-729 | DevOps | yes | yellow | Branch protection documentation | ✅ |
| AVG-730 | QA/Performance | yes | yellow | Performance testing baseline | ✅ |

Exit criteria:

- [x] Visual regression tests pass on key UI components (`pnpm test:visual`)
- [x] Accessibility tests pass with axe-core (`pnpm test:a11y`)
- [x] Code coverage thresholds defined and met (`pnpm test:coverage`)
- [x] Integration test framework operational (`pnpm test:integration`)
- [x] Storybook running with core component stories
- [x] CI pipeline enforces all quality gates
- [x] Auto-merge requires at least 1 approval
- [x] Branch protection rules documented
- [x] Performance baseline established for key user flows

Gate note:

- ✅ All Sprint 1.5 tasks complete. PR #13 created and pushed to GitHub.
- 9 quality gates now operational (lint, typecheck, build, test, integration, visual, a11y, coverage, performance)
- 10 integration tests passing
- Code coverage infrastructure with thresholds (75% lines, 70% branches)
- Storybook set up with ProjectShell stories
- Auto-merge now requires 1 approval (was 0)
- Branch protection rules documented in `.qoder/branch-protection-rules.md`
- Token budget: estimated 15,000 tokens for sprint implementation

## Model Budget

| Task | Tier | Model | Approval |
|---|---|---|---|
| AVG-701 | strong | `gpt-5.5` | sprint approval required |
| AVG-702 | standard | `gpt-5.4` | automatic after AVG-701 |
| AVG-703 | standard | `gpt-5.4` | automatic after AVG-701 |
| AVG-704 | standard | `gpt-5.4` | automatic after AVG-701 |
| AVG-705 | standard | `gpt-5.4` | automatic after Sprint 8 approval |
| AVG-706 | standard | `gpt-5.4` | automatic after Sprint 8 approval |
| AVG-707 | standard | `gpt-5.4` | automatic after Sprint 8 approval |
| AVG-708 | standard | `gpt-5.4` | automatic after Sprint 8 approval |
| AVG-709 | standard | `gpt-5.4` | automatic after Sprint 9 approval |
| AVG-710 | strong | `gpt-5.5` | sprint approval required |
| AVG-711 | standard | `gpt-5.4` | automatic after Sprint 9 approval |
| AVG-712 | standard | `gpt-5.4` | automatic after Sprint 9 approval |

## Required Verification

Before closing MVP-5:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:contract`
- `pnpm test:ai`
- `pnpm build`
- `pnpm test:e2e`

Run visual and accessibility checks when implemented:

- `pnpm test:visual`
- `pnpm test:a11y`
