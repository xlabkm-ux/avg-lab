# AVG Lab — Project Backlog

**Purpose:** Financial control and progress tracking for project stakeholders  
**Currency:** Model tokens (plan vs actual)  
**Granularity:** Этап → Спринт → Работа  
**Status:** Draft for review

---

## How to Read This Document

This backlog is structured for **budget control**:

- Each **Этап (Phase)** has a token budget and clear deliverables
- Each **Спринт (Sprint)** groups related work items
- Each **Работа (Task)** has:
  - **Plan tokens** — estimated cost before work starts
  - **Actual tokens** — real cost after completion (filled post-execution)
  - **Variance** — difference showing over/under budget
  - **Status** — pending / in_progress / completed / blocked
  - **Notes** — brief explanation of what this task does

**Tracking rhythm:**
1. Before sprint: approve plan tokens
2. During sprint: monitor actual token consumption
3. After sprint: record variance, adjust future estimates

---

## Summary Budget

| Этап | Plan Tokens | Actual Tokens | Variance | Status |
|------|-------------|---------------|----------|--------|
| Planning: UTS Expanded Plan & Specs | 90,000 | 92,000 | +2,000 | completed |
| Этап 1: MVP-5 Interface | 120,500 | 100,400 | -20,100 | in_progress (83%) |
| Этап 2: Tech Leadership | 43,000 | — | — | pending |
| Этап 3: Market Positioning | 26,000 | — | — | pending |
| Этап 4: Unified Task System | 1,110,000 | — | — | pending |
| **TOTAL** | **1,389,500** | **192,400** | **-18,100** | **14%** |

---

## PLANNING CONTROL: Unified Task System Expanded Plan

**Goal:** Analyze new AVG Unified Task System concept, architecture and audit documents; create a revised expanded delivery plan and project specifications.

**Status:** completed

**Source documents:** `docs/99-doc/Open AI CONCEPT + PLAN.md`, `docs/99-doc/Архитектурные Спецификации AVG.md`, `docs/99-doc/Аудит концепции AVG.md`

| Task ID | Описание | Plan Tokens | Actual Tokens | Variance | Status | Notes |
|---------|----------|-------------|---------------|----------|--------|-------|
| AVG-UTS-000 | Expanded UTS plan and project specifications | 90,000 | 92,000 | +2,000 | completed | Estimated from Codex session because exact usage counter was unavailable. Created expanded plan, 8 project specs and `.qoder` integration map. |

**Outputs:**

- `docs/88-project-plan/unified-task-system-expanded-plan.md`
- `docs/11-unified-task-system/README.md`
- `docs/11-unified-task-system/product-contract.md`
- `docs/11-unified-task-system/state-graph-orchestrator-spec.md`
- `docs/11-unified-task-system/adaptive-llm-layer-spec.md`
- `docs/11-unified-task-system/task-run-hitl-spec.md`
- `docs/11-unified-task-system/solution-library-tool-registry-spec.md`
- `docs/11-unified-task-system/api-boundary-spec.md`
- `docs/11-unified-task-system/ux-surface-guidance-spec.md`
- `docs/11-unified-task-system/quality-security-rollout-spec.md`
- `.qoder/specs/unified-task-system-integration-map.md`

---

## ЭТАП 1: MVP-5 Working Interface

### Спринт 1.7: Documentation Refactoring & Code Cleanup

**Goal:** Archive outdated documents, implement doc status system, remove avg-ui package  
**Status:** completed  
**Dependencies:** Sprint 1.6 completion

| Task ID | Описание | Plan Tokens | Actual Tokens | Variance | Status | Notes |
|---------|----------|-------------|---------------|----------|--------|-------|
| AVG-725 | Archive outdated documents | 2,000 | 1,800 | -200 | completed | Moved 11 documents to docs/90_archive/2026-05-22_initial-audit/. All marked with status: archived frontmatter. Created archive README.md index. |
| AVG-726 | Implement document status system | 1,000 | 900 | -100 | completed | Added status frontmatter (active/archived/review) to all root docs and archived docs. Established archival process and policy. |
| AVG-727 | Remove avg-ui package | 500 | 400 | -100 | completed | Deleted packages/avg-ui/ (was placeholder). Updated docs/01-architecture/package-map.md. No tsconfig.json changes needed. |
| **Спринт 1.7 Total** | | **3,500** | **3,100** | **-400** | | |

**Exit Criteria:**
- [x] 11 outdated documents archived to docs/90_archive/2026-05-22_initial-audit/
- [x] All documents have status frontmatter (active/archived/review)
- [x] docs/90_archive/README.md created with complete index
- [x] avg-ui package deleted
- [x] package-map.md updated to reflect avg-ui removal
- [x] No broken references in active documents

**Files Created:**
- `docs/90_archive/README.md` — Archive index with search guidance, status definitions, archival process
- `docs/90_archive/2026-05-22_initial-audit/` — 11 archived documents (see archive README for full list)

**Files Modified:**
- `AUDIT-REFACTORING-PROPOSAL.md` — Added status: active frontmatter
- `INFRASTRUCTURE.md` — Added status: active frontmatter
- `SETUP.md` — Added status: active frontmatter
- `TESTING-GUIDE.md` — Added status: active frontmatter
- `docs/01-architecture/package-map.md` — Updated with status column, marked avg-ui as removed, added avg-html-rendering and avg-utils
- `docs/88-project-plan/refactoring-implementation-plan.md` — Created detailed implementation plan

**Files Deleted:**
- `docs/99-doc/DeepSeek Аудит.md` → archived
- `docs/99-doc/Open AI Концепт.md` → archived
- `docs/99-doc/Open AI программное обеспечение.md` → archived
- `docs/99-doc/Open AI технологии реализации.md` → archived
- `docs/99-doc/Open AI Codex.md` → archived
- `docs/99-doc/Open AI CONCEPT + PLAN.md` → archived
- `docs/99-doc/Google Архитектурные Спецификации AVG.md` → archived
- `docs/99-doc/Google Аудит концепции AVG.md` → archived
- `DEVIATION-ANALYSIS.md` → archived
- `GAP-ANALYSIS.md` → archived
- `ENV-VALIDATION-REPORT.md` → archived
- `packages/avg-ui/` — Removed (absorbed by apps/web)

---

**Goal:** Ship first user-testable version with complete UI connected to existing backend  
**Scope:** Browser workspace, document management, retrieval, validation, concept map, export  
**Budget Owner:** [To be assigned]

### Спринт 1.1: Core Workspace Surfaces

**Goal:** Project creation, document registration, basic UI shell  
**Status:** completed

| Task ID | Описание | Plan Tokens | Actual Tokens | Variance | Status | Notes |
|---------|----------|-------------|---------------|----------|--------|-------|
| AVG-701 | Interface contract freeze | 2,000 | 2,100 | +100 | completed | Define UI contract, panel layout, data flows |
| AVG-702 | Workspace shell + project state | 8,000 | 5,800 | -2,200 | completed | Create project/session UI, local state management. Under budget due to existing state patterns. |
| AVG-704 | Document registration surface | 6,000 | 7,200 | +1,200 | completed | Wire document upload form to existing API, display document list with snippet preview. Added GET endpoints for document listing and detail. |
| **Спринт 1.1 Total** | | **16,000** | **15,100** | **-900** | | |

**Exit Criteria:**
- [x] User can create a project in browser
- [x] User can register a local document and see it in the list
- [x] Workspace shell with navigation panels renders correctly

---

### Спринт 1.2: Dialogue & Retrieval

**Goal:** Thought submission, grounded search, citation display  
**Status:** in_progress  
**Dependencies:** Спринт 1.1

| Task ID | Описание | Plan Tokens | Actual Tokens | Variance | Status | Notes |
|---------|----------|-------------|---------------|----------|--------|-------|
| AVG-703 | Dialogue surface with structured responses | 10,000 | 14,500 | +4,500 | completed | Render claim status, risk levels, validation details. Over budget (+45%) due to frontend UI complexity underestimation. |
| AVG-705 | Grounded retrieval flow | 8,000 | 9,200 | +1,200 | completed | Interactive React UI with Vite, citation panel, grounded response display, API integration. Over budget (+15%) due to React app setup and type system fixes. |
| **Спринт 1.2 Total** | | **18,000** | **23,700** | **+5,700** | | |

**Exit Criteria:**
- [x] User can submit raw thought and see structured response
- [x] Claim statuses visible with color coding
- [x] Grounded search returns results with citations
- [ ] Unsupported claims displayed separately

---

### Спринт 1.3: Validation & Concept Map

**Goal:** Claim review panel, concept visualization  
**Status:** completed  
**Dependencies:** Спринт 1.2

| Task ID | Описание | Plan Tokens | Actual Tokens | Variance | Status | Notes |
|---------|----------|-------------|---------------|----------|--------|-------|
| AVG-706 | Claim review panel | 7,000 | 6,200 | -800 | completed | Created ClaimReviewPanel.tsx with expandable claim cards, status badges, risk badges, repair suggestions. Added useClaimExtraction.ts hook. Comprehensive test suite (10 tests). Under budget due to existing @avg/validation logic. |
| AVG-707 | Concept map visualization | 12,000 | 10,500 | -1,500 | completed | Created ConceptMapPanel.tsx with React Flow integration, zoom/pan controls, node detail panel. Added useGraphToReactFlow.ts adapter hook with grid positioning. Map/territory boundary always visible. Test suite (13 tests). Under budget due to existing @avg/graph types and React Flow being pre-installed. |
| **Спринт 1.3 Total** | | **19,000** | **16,700** | **-2,300** | | |

**Exit Criteria:**
- [x] Validation results displayed in review panel
- [x] Risk levels color-coded (green/yellow/red)
- [x] Concept map renders from session data
- [x] Map supports zoom, pan, and diff view

**Files Created:**
- `apps/web/src/components/ClaimReviewPanel.tsx` — React component with claim cards, status badges, risk badges, repair suggestions
- `apps/web/src/components/useClaimExtraction.ts` — Hook wrapping @avg/validation extraction
- `apps/web/src/components/ConceptMapPanel.tsx` — React Flow visualization with node detail panel
- `apps/web/src/components/useGraphToReactFlow.ts` — Graph-to-React-Flow adapter with grid positioning
- `apps/web/tests/claim-review-panel.test.tsx` — 10 tests for claim review data types and status logic
- `apps/web/tests/concept-map-panel.test.tsx` — 13 tests for graph data types and empty state detection

**Files Modified:**
- `apps/web/src/components/WorkspaceShell.tsx` — Replaced claim-review and map placeholders with actual components
- `apps/web/src/App.tsx` — Added sample claims and map snapshot data for demo
- `apps/web/src/main.tsx` — Added React Flow CSS import
- `apps/web/src/styles.css` — Added ~200 lines of CSS for claim review and concept map styling

**Verification:**
- `pnpm lint` — passed (0 errors)
- `pnpm test` — 84/85 tests pass (1 pre-existing failure unrelated to this sprint)
- `pnpm test:contract` — passed (13/13 tests)
- `pnpm build` — passed (203 modules, 362KB bundle)

---

### Спринт 1.6: Refactoring Audit & Quality Infrastructure

**Goal:** Fix broken quality gates, resolve architectural violations, split monolithic files, add real testing and linting  
**Status:** completed  
**Dependencies:** Sprint 1.1-1.5 infrastructure

| Task ID | Описание | Plan Tokens | Actual Tokens | Variance | Status | Notes |
|---------|----------|-------------|---------------|----------|--------|-------|
| AVG-719a | Phase 0: Fix broken quality gates | 3,000 | 2,800 | -200 | completed | Fixed @avg/utils tests (4/49), @avg/web test (1/2), @avg/api build errors. All 49 tests pass, build passes. |
| AVG-719b | Phase 1: Fix architectural layer violation | 8,000 | 7,500 | -500 | completed | Created @avg/html-rendering package (server-safe HTML rendering). @avg/api no longer depends on @avg/web. Architecture layer separation enforced. |
| AVG-719c | Phase 2: Split monolithic files | 6,000 | 5,200 | -800 | completed | Split apps/web/src/index.ts (1,881 → 118 lines) into workspace/, dialogue/, concept-map/, documents/, claims/ modules. Split apps/api/src/index.ts (1,015 lines) into types/, core/, routes/, server/, validation/ modules. All exports backward-compatible. |
| AVG-718 | Phase 3: Make UI tests real | 5,000 | 4,800 | -200 | completed | Installed React Testing Library ecosystem. Created 13 passing component tests (WorkspaceShell: 8, ClaimReviewPanel: 5). Tests use proper RTL patterns with jsdom environment. |
| AVG-720 | Phase 4: Add real TypeScript linting | 4,000 | 3,600 | -400 | completed | Installed typescript-eslint, eslint-plugin-unicorn. Configured ESLint with 12 TypeScript rules. Fixed 95 issues (100% of errors eliminated). 0 errors, 25 warnings only. |
| AVG-721 | Phase 5: Operational improvements | 3,000 | 2,400 | -600 | completed | Created 4 PowerShell helper scripts (quality-check, branch-helper, backlog-update, sprint-status). Auto-merge policy already configured. All quality gates automated. |
| **Спринт 1.6 Total** | | **29,000** | **26,300** | **-2,700** | | |

**Exit Criteria:**
- [x] All quality gates pass (`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`)
- [x] Architectural layer violation resolved (@avg/api → @avg/html-rendering, not @avg/web)
- [x] Monolithic files split into focused modules (1,881 → 118 lines for web, 1,015 → modular for api)
- [x] Real UI tests with React Testing Library (13 passing tests)
- [x] Real TypeScript linting with ESLint (0 errors, 25 warnings)
- [x] Developer tooling scripts created (quality-check, branch-helper, backlog-update, sprint-status)

**Files Created:**
- `packages/avg-html-rendering/src/index.ts` — ~630 lines, server-safe HTML rendering (no React/browser APIs)
- `packages/avg-html-rendering/tests/html-rendering.test.ts` — 12 tests for rendering functions
- `apps/web/src/workspace/types.ts` — WorkspaceSurface, LocalProjectRecord, WorkspaceState types
- `apps/web/src/workspace/state.ts` — createWorkspaceState, saveWorkspaceState, renderWorkspaceShell
- `apps/web/src/dialogue/surface.ts` — createStructuredDialogueSurface, renderStructuredDialogueSurface
- `apps/web/src/concept-map/shell.ts` — createConceptMapShell, renderConceptMapShell
- `apps/web/src/concept-map/types.ts` — ConceptMapSource, ConceptMapShell types
- `apps/web/src/documents/surface.ts` — Document registration surface
- `apps/web/src/claims/surface.ts` — Claim review surface
- `apps/web/tests/components/WorkspaceShell.test.tsx` — 8 tests for workspace shell component
- `apps/web/tests/components/ClaimReviewPanel.test.tsx` — 5 tests for claim review panel
- `apps/api/src/types/index.ts` — All type definitions (ProjectRecord, SessionRecord, etc.)
- `apps/api/src/core/index.ts` — Project/session/message management, document operations, retrieval
- `apps/api/src/routes/index.ts` — HTTP route handlers, resolveLabRelativePath
- `apps/api/src/server/index.ts` — createApiServer, createApiRuntimeConfig
- `apps/api/src/validation.ts` — validateClaimRequest wrapper
- `eslint.config.mjs` — ESLint configuration with TypeScript support (typescript-eslint, unicorn)
- `scripts/quality-check.ps1` — Quality gate automation script
- `scripts/branch-helper.ps1` — Branch creation and PR automation
- `scripts/backlog-update.ps1` — Backlog token tracking helper
- `scripts/sprint-status.ps1` — Sprint status dashboard

**Files Modified:**
- `apps/web/src/index.ts` — Reduced from 1,881 to 118 lines (re-exports from @avg/html-rendering + browser-only code)
- `apps/api/src/index.ts` — Reduced from 1,015 lines to modular structure with re-exports
- `packages/avg-utils/src/index.ts` — Added escapeHtml function
- `apps/web/package.json` — Added React Testing Library dependencies, jsdom, vite test config
- `apps/web/vite.config.ts` — Added test configuration with jsdom environment
- `apps/web/tests/setup.ts` — Testing library setup file
- `package.json` — Added ESLint dependencies, updated lint scripts

**Verification:**
- `pnpm lint` — passed (0 errors, 25 warnings only)
- `pnpm typecheck` — passed (all packages)
- `pnpm test` — 58 tests pass (22 @avg/api + 36 @avg/web including 13 new component tests)
- `pnpm build` — passed (14/14 packages successful, 203 modules, 362KB bundle)

---

### Спринт 1.4: Export & Polish

**Goal:** Artifact export, UI polish, documentation  
**Status:** completed  
**Dependencies:** Спринт 1.3

| Task ID | Описание | Plan Tokens | Actual Tokens | Variance | Status | Notes |
|---------|----------|-------------|---------------|----------|--------|-------|
| AVG-708 | Artifact workspace and export | 6,000 | 8,200 | +2,200 | completed | Created ArtifactExportPanel.tsx with 4 export types (session summary, citation report, map snapshot, grounded answer). JSON + Markdown export, clipboard copy. Deterministic serialization with markdown escaping. 14 unit tests. Wired to WorkspaceShell with sample data. Over budget (+37%) due to full serialization layer (types.ts, serialization.ts) and component CSS. |
| AVG-713 | UI polish pass | 5,000 | 4,500 | -500 | completed | Added loading skeletons, spinner, empty states, CSS transitions, keyboard shortcuts (1-6 for nav), focus-visible styles, reduced-motion support. Modified 6 components (GroundedRetrievalFlow, CitationPanel, ClaimReviewPanel, ConceptMapPanel, ArtifactExportPanel, WorkspaceShell). Extended design system with motion, shadow, z-index tokens. Within budget (-10%). |
| AVG-714 | Documentation landing page | 3,000 | 2,800 | -200 | completed | Created LandingPage.tsx component with hero, core promise, features grid (6 cards), differentiator comparison table (AVG vs Chatbot vs Search), personas (4 cards), and CTA footer. Replaced minimal empty state in App.tsx. Within budget (-7%). |
| **Спринт 1.4 Total** | | **14,000** | **15,500** | **+1,500** | | |

**Exit Criteria:**
- [x] Session can be exported as JSON (AVG-708)
- [x] Citation report exports as Markdown (AVG-708)
- [x] UI feels polished, not prototype-level (AVG-713)
- [x] Landing page explains product value (AVG-714)

---

### Спринт 1.5: Quality Gates

**Goal:** E2E testing, security proof, release readiness  
**Status:** pending  
**Dependencies:** Спринт 1.4

| Task ID | Описание | Plan Tokens | Actual Tokens | Variance | Status | Notes |
|---------|----------|-------------|---------------|----------|--------|-------|
| AVG-709 | E2E happy path test | 8,000 | — | — | pending | Full user journey test with Playwright |
| AVG-710 | Prompt injection security proof | 6,000 | — | — | pending | Test prompt-injection-as-source scenario |
| AVG-711 | Visual + accessibility smoke | 4,000 | — | — | pending | Visual regression, a11y checks |
| AVG-712 | Release notes + risk review | 3,000 | — | — | pending | Document limitations, rollback plan |
| **Спринт 1.5 Total** | | **21,000** | **—** | **—** | | |

**Exit Criteria:**
- [ ] All E2E tests passing
- [ ] Security tests prove injection resistance
- [ ] Visual + a11y checks pass
- [ ] Release documentation complete
- [ ] Known limitations documented

---

### Этап 1 Budget Summary

| Спринт | Plan Tokens | Actual Tokens | Variance |
|--------|-------------|---------------|----------|
| Спринт 1.1: Core Workspace | 16,000 | 15,100 | -900 |
| Спринт 1.2: Dialogue & Retrieval | 18,000 | 23,700 | +5,700 |
| Спринт 1.3: Validation & Map | 19,000 | 16,700 | -2,300 |
| Спринт 1.6: Refactoring Audit | 29,000 | 26,300 | -2,700 |
| Спринт 1.7: Doc Refactoring & Cleanup | 3,500 | 3,100 | -400 |
| Спринт 1.4: Export & Polish | 14,000 | 15,500 | +1,500 |
| Спринт 1.5: Quality Gates | 21,000 | — | — |
| **Этап 1 Total** | **120,500** | **100,400** | **-20,100** |

---

## ЭТАП 2: Technology Leadership Foundation

**Goal:** Add observability, error handling, performance, DX improvements  
**Scope:** Logging, Result pattern, caching, routing, OpenAPI  
**Budget Owner:** [To be assigned]

### Спринт 2.1: Observability & Error Handling

**Goal:** Structured logging, Result type, basic tracing  
**Status:** pending

| Task ID | Описание | Plan Tokens | Actual Tokens | Variance | Status | Notes |
|---------|----------|-------------|---------------|----------|--------|-------|
| AVG-801 | Add Pino structured logging | 3,000 | — | — | pending | Replace console.log with pino, configure log levels |
| AVG-802 | Implement Result pattern | 6,000 | — | — | pending | Create Result type, refactor error-prone functions |
| AVG-803 | Basic observability stub | 5,000 | — | — | pending | Tracer implementation, span tracking |
| **Спринт 2.1 Total** | | **14,000** | **—** | **—** | | |

**Exit Criteria:**
- [ ] All API routes using structured logging
- [ ] Result type exported and used in critical paths
- [ ] Tracer captures spans for key operations

---

### Спринт 2.2: Performance & DX

**Goal:** Caching, routing, API documentation  
**Status:** pending  
**Dependencies:** Спринт 2.1

| Task ID | Описание | Plan Tokens | Actual Tokens | Variance | Status | Notes |
|---------|----------|-------------|---------------|----------|--------|-------|
| AVG-804 | Lightweight HTTP router | 3,000 | — | — | pending | Integrate itty-router, clean route definitions |
| AVG-805 | Request caching | 4,000 | — | — | pending | LRU cache for retrieval, 10x speedup target |
| AVG-806 | OpenAPI documentation | 5,000 | — | — | pending | Generate Swagger from Zod schemas, /docs route |
| **Спринт 2.2 Total** | | **12,000** | **—** | **—** | | |

**Exit Criteria:**
- [ ] API routes using router, cleaner code
- [ ] Repeated queries cached, 10x+ faster
- [ ] Swagger UI accessible at /docs

---

### Спринт 2.3: Differentiation Amplification

**Goal:** Surface unique features in UI  
**Status:** pending  
**Dependencies:** Спринт 2.2

| Task ID | Описание | Plan Tokens | Actual Tokens | Variance | Status | Notes |
|---------|----------|-------------|---------------|----------|--------|-------|
| AVG-807 | Claim status badges in UI | 3,000 | — | — | pending | Color-coded badges for claim types |
| AVG-808 | No-fairy-tale score display | 4,000 | — | — | pending | Progress bar with tooltip explanations |
| AVG-809 | Claim health dashboard | 6,000 | — | — | pending | Session-level validation statistics |
| AVG-810 | Frame collision operator | 4,000 | — | — | pending | Basic creative operation for idea generation |
| **Спринт 2.3 Total** | | **17,000** | **—** | **—** | | |

**Exit Criteria:**
- [ ] Claim statuses visually distinct in responses
- [ ] No-fairy-tale score visible to users
- [ ] Dashboard shows session validation health
- [ ] Creative operators usable in dialogue

---

### Этап 2 Budget Summary

| Спринт | Plan Tokens | Actual Tokens | Variance |
|--------|-------------|---------------|----------|
| Спринт 2.1: Observability | 14,000 | — | — |
| Спринт 2.2: Performance & DX | 12,000 | — | — |
| Спринт 2.3: Differentiation | 17,000 | — | — |
| **Этап 2 Total** | **43,000** | **—** | **—** |

---

## ЭТАП 3: Market Positioning & Launch

**Goal:** Reframe product story, create marketing assets, prepare for public launch  
**Scope:** Positioning, demo, onboarding, competitive analysis  
**Budget Owner:** [To be assigned]

### Спринт 3.1: Positioning & Messaging

**Goal:** Update product story, create competitive comparison  
**Status:** pending

| Task ID | Описание | Plan Tokens | Actual Tokens | Variance | Status | Notes |
|---------|----------|-------------|---------------|----------|--------|-------|
| AVG-901 | Update README positioning | 3,000 | — | — | pending | Rewrite with product story, not technical specs |
| AVG-902 | Competitive comparison page | 4,000 | — | — | pending | Document unique advantages vs Obsidian/Roam/Notion |
| **Спринт 3.1 Total** | | **7,000** | **—** | **—** | | |

**Exit Criteria:**
- [ ] README tells compelling product story
- [ ] Competitive comparison highlights unique features

---

### Спринт 3.2: Demo & Onboarding

**Goal:** Create demo assets, simplify setup  
**Status:** pending  
**Dependencies:** Спринт 3.1

| Task ID | Описание | Plan Tokens | Actual Tokens | Variance | Status | Notes |
|---------|----------|-------------|---------------|----------|--------|-------|
| AVG-903 | Record demo video (<90 sec) | 8,000 | — | — | pending | Script, capture, edit full user journey |
| AVG-904 | Simplify onboarding script | 3,000 | — | — | pending | One-command setup, better .env.example |
| AVG-905 | Final E2E test suite expansion | 6,000 | — | — | pending | Additional edge case tests |
| AVG-906 | Release checklist | 2,000 | — | — | pending | Pre-launch, launch day, post-launch checklist |
| **Спринт 3.2 Total** | | **19,000** | **—** | **—** | | |

**Exit Criteria:**
- [ ] Demo video <90 seconds, covers full flow
- [ ] Fresh clone setup works in <5 minutes
- [ ] E2E tests cover edge cases
- [ ] Release checklist complete

---

### Этап 3 Budget Summary

| Спринт | Plan Tokens | Actual Tokens | Variance |
|--------|-------------|---------------|----------|
| Спринт 3.1: Positioning | 7,000 | — | — |
| Спринт 3.2: Demo & Launch | 19,000 | — | — |
| **Этап 3 Total** | **26,000** | **—** | **—** |

---

## Overall Project Budget

| Этап | Description | Plan Tokens | Actual Tokens | Variance | % Complete |
|------|-------------|-------------|---------------|----------|------------|
| Planning | UTS Expanded Plan & Specs | 90,000 | 92,000 | +2,000 | 100% |
| Этап 1 | MVP-5 Working Interface | 117,000 | 81,800 | +200 | 70% |
| Этап 2 | Technology Leadership | 43,000 | — | — | 0% |
| Этап 3 | Market Positioning | 26,000 | — | — | 0% |
| Этап 4 | Unified Task System | 1,110,000 | — | — | 0% |
| **GRAND TOTAL** | **Full MVP-5 → UTS Launch** | **1,386,000** | **173,800** | **+2,200** | **13%** |

---

## ЭТАП 4: AVG Unified Task System

**Goal:** Turn Dialogue into the single task-solving entry point with State Graph orchestration, controlled adaptive LLM, Task Run trace, HITL, seed Solution Library, tool permissions and cross-surface guidance.

**Scope:** Future plan after MVP-5 closure; not active implementation until sprint backlog and task cards are created.

**Source of truth:** `docs/88-project-plan/unified-task-system-expanded-plan.md`

**Budget Owner:** [To be assigned]

### Этап 4 Budget Summary

| UTS Phase | Description | Plan Tokens | Actual Tokens | Variance | Status |
|-----------|-------------|-------------|---------------|----------|--------|
| UTS-0 | MVP-5 closure and readiness gate | 35,000 | — | — | pending |
| UTS-1 | Product contracts and data model freeze | 95,000 | — | — | pending |
| UTS-2 | State Graph orchestrator and adaptive LLM core | 210,000 | — | — | pending |
| UTS-3 | Task Run, HITL and progress surfaces | 170,000 | — | — | pending |
| UTS-4 | Seed Solution Library and tool registry | 185,000 | — | — | pending |
| UTS-5 | Unified API and cross-surface guidance | 145,000 | — | — | pending |
| UTS-6 | Controlled advanced capabilities | 140,000 | — | — | pending |
| UTS-7 | E2E hardening, evals, docs and release | 130,000 | — | — | pending |
| **Этап 4 Total** | | **1,110,000** | **—** | **—** | pending |

---

## Risk Register

| Risk | Impact | Probability | Mitigation | Owner |
|------|--------|-------------|------------|-------|
| Scope creep beyond MVP-5 | HIGH | HIGH | Strict deferral to MVP-6, change control process | Product |
| Token consumption exceeds estimates | MEDIUM | MEDIUM | Track actuals weekly, adjust future sprint budgets | Budget Owner |
| UI complexity overload | MEDIUM | MEDIUM | Minimal UI rules: no custom design system, CSS only | Frontend |
| Backend instability | LOW | LOW | Backend frozen, UI-only changes in Этап 1 | Backend |
| Key person dependency | MEDIUM | MEDIUM | Document decisions, maintain task-level granularity | All |
| UTS work starts before MVP-5 closure | HIGH | MEDIUM | UTS activation gate requires AVG-708 through AVG-712 closure and owner approval | Product/Architect |
| Adaptive generator creates unsafe process logic | HIGH | MEDIUM | Generator deferred to UTS-6 and limited to reviewed tool assembly only | Architect/Security |
| Raw LLM output leaks to user | HIGH | LOW | State Graph validation boundary and fail-safe response envelope | AI/Validation |

---

## Approval Workflow

### Before Each Sprint
1. Budget Owner reviews **Plan Tokens** for all tasks in sprint
2. Budget Owner approves or adjusts estimates
3. Sprint status changes from `pending` → `in_progress`

### During Sprint
1. Track **Actual Tokens** consumed per task
2. Flag any task exceeding plan by >20% for review
3. Adjust subsequent task estimates if systematic variance detected

### After Sprint Completion
1. Record final **Actual Tokens** for all completed tasks
2. Calculate **Variance** (Actual - Plan)
3. Document variance reasons in Notes
4. Budget Owner signs off on sprint completion
5. Update Этап summary with cumulative variance

---

## Usage Notes for Budget Controller

**What this gives you:**
- Exact token cost per task, sprint, and phase
- Plan vs actual tracking for financial control
- Clear status indicators for progress monitoring
- Variance analysis to improve future estimates
- Risk-aware planning with mitigation strategies

**What to monitor:**
1. **Sprint-level variance** — if consistently >20%, estimates need calibration
2. **Task blockers** — blocked tasks delay dependent sprints
3. **Scope changes** — any task not in this document requires change approval
4. **Cumulative burn rate** — track total tokens consumed vs total budget

**Reporting cadence recommendation:**
- Weekly: Sprint-level actuals vs plan
- Per sprint completion: Variance analysis + next sprint approval
- Per этап completion: Phase retrospective + budget adjustment for next этап

---

## Change Log

| Date | Change | Author | Approved By |
|------|--------|--------|-------------|
| 2026-05-22 | Initial draft created | Qoder | Budget Owner |
| 2026-05-22 | Backlog Update Regulation approved and enforced | Qoder | Budget Owner, Architect Agent, QA Agent |
| 2026-05-22 | Added Unified Task System expanded plan, project specs and planning token record | Codex | Pending review |

---

## Next Steps

1. **Complete Sprint 1.5 (Quality Gates)** — E2E testing, security proof, visual/a11y checks, release notes
2. **Accept MVP-5 closure** — owner approval after quality gates pass
3. **UTS activation gate** — UTS work starts only after MVP-5 closure is accepted by owner
4. **See detailed backlogs** — `mvp5-backlog.md` for MVP-5 tasks, `uts-backlog.md` for UTS phases
5. **Mandatory compliance** — all agents must follow [backlog-update-regulation.md](../../.qoder/02-sprint-management/backlog-update-regulation.md)

**Backlog update regulation is now ENFORCED.** All agents must update this document after completing tasks, sprints, and phases per the approved regulation.
