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
| Этап 1: MVP-5 Interface | TBD | — | — | pending |
| Этап 2: Tech Leadership | TBD | — | — | pending |
| Этап 3: Market Positioning | TBD | — | — | pending |
| **TOTAL** | **TBD** | **—** | **—** | **pending** |

---

## ЭТАП 1: MVP-5 Working Interface

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
**Status:** pending  
**Dependencies:** Спринт 1.2

| Task ID | Описание | Plan Tokens | Actual Tokens | Variance | Status | Notes |
|---------|----------|-------------|---------------|----------|--------|-------|
| AVG-706 | Claim review panel | 7,000 | — | — | pending | Display validation reports, risk badges, repair suggestions |
| AVG-707 | Concept map visualization | 12,000 | — | — | pending | Integrate React Flow, render graph snapshots, zoom/pan controls |
| **Спринт 1.3 Total** | | **19,000** | **—** | **—** | | |

**Exit Criteria:**
- [ ] Validation results displayed in review panel
- [ ] Risk levels color-coded (green/yellow/red)
- [ ] Concept map renders from session data
- [ ] Map supports zoom, pan, and diff view

---

### Спринт 1.4: Export & Polish

**Goal:** Artifact export, UI polish, documentation  
**Status:** pending  
**Dependencies:** Спринт 1.3

| Task ID | Описание | Plan Tokens | Actual Tokens | Variance | Status | Notes |
|---------|----------|-------------|---------------|----------|--------|-------|
| AVG-708 | Artifact workspace and export | 6,000 | — | — | pending | JSON/Markdown export buttons, clipboard copy |
| AVG-713 | UI polish pass | 5,000 | — | — | pending | Loading skeletons, empty states, CSS transitions, keyboard shortcuts |
| AVG-714 | Documentation landing page | 3,000 | — | — | pending | Create product landing page with positioning |
| **Спринт 1.4 Total** | | **14,000** | **—** | **—** | | |

**Exit Criteria:**
- [ ] Session can be exported as JSON
- [ ] Citation report exports as Markdown
- [ ] UI feels polished, not prototype-level
- [ ] Landing page explains product value

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
| Спринт 1.1: Core Workspace | 16,000 | — | — |
| Спринт 1.2: Dialogue & Retrieval | 18,000 | — | — |
| Спринт 1.3: Validation & Map | 19,000 | — | — |
| Спринт 1.4: Export & Polish | 14,000 | — | — |
| Спринт 1.5: Quality Gates | 21,000 | — | — |
| **Этап 1 Total** | **88,000** | **—** | **—** |

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
| Этап 1 | MVP-5 Working Interface | 88,000 | — | — | 0% |
| Этап 2 | Technology Leadership | 43,000 | — | — | 0% |
| Этап 3 | Market Positioning | 26,000 | — | — | 0% |
| **GRAND TOTAL** | **Full MVP-5 → Launch** | **157,000** | **—** | **—** | **0%** |

---

## Risk Register

| Risk | Impact | Probability | Mitigation | Owner |
|------|--------|-------------|------------|-------|
| Scope creep beyond MVP-5 | HIGH | HIGH | Strict deferral to MVP-6, change control process | Product |
| Token consumption exceeds estimates | MEDIUM | MEDIUM | Track actuals weekly, adjust future sprint budgets | Budget Owner |
| UI complexity overload | MEDIUM | MEDIUM | Minimal UI rules: no custom design system, CSS only | Frontend |
| Backend instability | LOW | LOW | Backend frozen, UI-only changes in Этап 1 | Backend |
| Key person dependency | MEDIUM | MEDIUM | Document decisions, maintain task-level granularity | All |

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

---

## Next Steps

1. **Calibrate estimates** — run 1-2 tasks to validate token consumption rates
2. **Approve Этап 1, Спринт 1.1** — begin execution with tracking enabled
3. **Set up tracking tool** — configure token usage monitoring per task ID
4. **Mandatory compliance** — all agents must follow [backlog-update-regulation.md](../../.qoder/02-sprint-management/backlog-update-regulation.md)

**Backlog update regulation is now ENFORCED.** All agents must update this document after completing tasks, sprints, and phases per the approved regulation.
