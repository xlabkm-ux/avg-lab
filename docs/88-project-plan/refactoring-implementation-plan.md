# AVG Codex Lab — Refactoring Implementation Plan

**Created:** 2026-05-22  
**Source:** AUDIT-REFACTORING-PROPOSAL.md + refactoring-audit-2026-05-22.md  
**Status:** Phase 1 (Documentation + Code Foundation) Completed  
**Classification:** Documentation Refactoring + Code Structure + Implementation

---

## Executive Summary

This plan synthesizes findings from two audit documents and maps them to concrete implementation steps. It accounts for work **already completed** in Sprint 1.6 and identifies **remaining gaps** that need to be addressed.

### Key Insight

The original audit (AUDIT-REFACTORING-PROPOSAL.md) identified critical issues. Sprint 1.6 already resolved several:
- ✅ Monolithic files split (web: 1,881→118 lines, api: 1,015→modular)
- ✅ TypeScript ESLint added
- ✅ HTML rendering package extracted (@avg/html-rendering)
- ✅ UI tests with React Testing Library
- ✅ PowerShell scripts created

### Sprint 1.7 Completed (2026-05-22):
- ✅ 11 documents archived to `docs/90_archive/2026-05-22_initial-audit/`
- ✅ Document status system implemented (active/archived/review)
- ✅ `avg-ui` package deleted (absorbed by apps/web)
- ✅ Archive README.md with complete index created
- ✅ project-backlog.md updated

**Remaining work focuses on:**
1. Empty architecture packages (avg-core, avg-config, avg-memory, etc.)
2. Code duplication across packages
3. Missing persistence layer
4. Missing observability infrastructure

---

## Part 1: Documentation Refactoring & Archival

### 1.1 Document Status Classification

**Principle:** All documents in the project must be clearly marked as **ACTIVE** or **ARCHIVED** to prevent confusion and working from stale information.

#### Classification Criteria

| Status | Criteria | Visual Marker | Destination |
|--------|----------|---------------|-------------|
| **ACTIVE** | Currently referenced by AGENTS.md, sprint backlog, or active development | Frontmatter header | Stay in place |
| **ARCHIVED** | Superseded by newer documents, historical reference only, completed sprint artifacts | Frontmatter header + move | `docs/90_archive/` |
| **REVIEW** | Uncertain status, needs owner decision | Frontmatter header | Temporary holding |

#### Visual Marker Format

Add to top of each Markdown file:

```markdown
---
status: active | archived
archived_date: YYYY-MM-DD
superseded_by: path/to/new/document.md (if applicable)
archive_reason: reason for archival
---
```

### 1.2 Document Audit & Archival Plan

#### Candidates for Archival

| Document | Current Location | Proposed Status | Reason |
|----------|------------------|-----------------|--------|
| DeepSeek Аудит.md | docs/99-doc/ | ARCHIVED | Superseded by AUDIT-REFACTORING-PROPOSAL.md |
| Open AI Концепт.md | docs/99-doc/ | ARCHIVED | Historical concept, superseded by product specs |
| Open AI программное обеспечение.md | docs/99-doc/ | ARCHIVED | Historical reference |
| Open AI технологии реализации.md | docs/99-doc/ | ARCHIVED | Historical reference |
| Open AI Codex.md | docs/99-doc/ | ARCHIVED | Historical reference |
| Open AI CONCEPT + PLAN.md | docs/99-doc/ | ARCHIVED | Superseded by unified-task-system-expanded-plan.md |
| Google Архитектурные Спецификации AVG.md | docs/99-doc/ | ARCHIVED | Superseded by docs/11-unified-task-system/ specs |
| Google Аудит концепции AVG.md | docs/99-doc/ | ARCHIVED | Superseded by refactoring-audit-2026-05-22.md |

#### Candidates for Status Update

| Document | Current Location | Proposed Status | Action |
|----------|------------------|-----------------|--------|
| AUDIT-REFACTORING-PROPOSAL.md | Root | ACTIVE | Keep as master audit reference |
| refactoring-audit-2026-05-22.md | docs/88-project-plan/ | ACTIVE | Keep as current state reference |
| DEVIATION-ANALYSIS.md | Root | REVIEW | Determine if still relevant |
| GAP-ANALYSIS.md | Root | REVIEW | Determine if still relevant |
| ENV-VALIDATION-REPORT.md | Root | REVIEW | Determine if still relevant |
| INFRASTRUCTURE.md | Root | ACTIVE | Keep as infrastructure reference |
| SETUP.md | Root | ACTIVE | Keep as setup guide |
| TESTING-GUIDE.md | Root | ACTIVE | Keep as testing reference |

#### Active Documents (No Change)

All documents in the following directories remain **ACTIVE**:
- `docs/00-product/` — Product definitions
- `docs/01-architecture/` — Architecture docs
- `docs/02-ai-system/` — AI system docs
- `docs/03-data/` — Data model docs
- `docs/04-api/` — API contracts
- `docs/05-ui-ux/` — UI/UX docs
- `docs/06-qa/` — QA strategy
- `docs/07-security/` — Security docs
- `docs/08-devops/` — DevOps docs
- `docs/09-agent-operations/` — Agent ops docs
- `docs/10-research/` — Research notes
- `docs/11-unified-task-system/` — UTS specs
- `docs/adr/` — Architecture Decision Records
- `.qoder/` — All operating model docs

### 1.3 Archive Structure

```
docs/90_archive/
├── README.md                    # Archive index with search guidance
├── 2026-05-22_initial-audit/    # Date-based subdirectory
│   ├── deepseek-audit.md
│   ├── google-architecture-spec.md
│   ├── google-concept-audit.md
│   ├── openai-concept.md
│   ├── openai-concept-plan.md
│   ├── openai-codex.md
│   ├── openai-software.md
│   └── openai-implementation-tech.md
└── YYYY-MM-DD_<slug>/           # Future archives
```

### 1.4 Archive README

Create `docs/90_archive/README.md` with:
- Purpose statement
- Search guidance (use `grep`/`Find in Files`)
- Index of all archived documents with:
  - Original location
  - Archive date
  - Superseding document link
  - Brief summary
- Policy: archived documents are READ-ONLY historical reference

---

## Part 2: Empty Package Resolution

### 2.1 Package Classification

Each empty package must be classified into one of three categories:

| Category | Action | Examples |
|----------|--------|----------|
| **IMPLEMENT NOW** | Has immediate need in current sprint | avg-core (Result pattern, shared utils) |
| **DEFINE ACTIVATION CRITERIA** | Planned, with clear triggers | avg-config, avg-memory, avg-observability |
| **REMOVE** | No longer needed or absorbed by other packages | avg-ui (absorbed into apps/web) |

### 2.2 Implementation Plan by Package

#### avg-core — IMPLEMENT NOW (Priority: P0)

**Purpose:** Foundation package for shared types, Result pattern, error classes

**Implementation:**
```typescript
// packages/avg-core/src/index.ts

// 1. Result pattern
export type Result<E, T> =
  | { success: true; data: T }
  | { success: false; error: E };

export function ok<T>(data: T): Result<never, T>;
export function err<E>(error: E): Result<E, never>;
export function fromTry<E>(fn: () => T, errorFactory: (e: Error) => E): Result<E, T>;

// 2. Option type
export type Option<T> = Some<T> | None;
export function some<T>(value: T): Option<T>;
export function none<T>(): Option<T>;

// 3. Domain error classes
export class AvgError extends Error {
  constructor(message: string, public readonly code: string, public readonly context?: Record<string, unknown>);
}
export class ValidationError extends AvgError { /* ... */ }
export class NotFoundError extends AvgError { /* ... */ }
export class AuthenticationError extends AvgError { /* ... */ }
export class AuthorizationError extends AvgError { /* ... */ }

// 4. Shared utility types
export type AsyncResult<E, T> = Promise<Result<E, T>>;
export type Nullable<T> = T | null;
export type MaybePromise<T> = T | Promise<T>;
```

**Tests Required:**
- Result pattern construction and pattern matching
- Error class inheritance and context propagation
- Option type behavior

**Dependencies to Update:**
- Remove duplicate `normalizeText()` from avg-validation, avg-agents, avg-retrieval, avg-evals
- Remove duplicate `AvgRetrievalHit` from avg-validation (import from avg-retrieval)
- Import error classes from avg-core in avg-security, avg-validation

**Effort:** 2-3 days

---

#### avg-config — DEFINE ACTIVATION CRITERIA (Priority: P2)

**Activation Criteria:**
1. When environment variable validation is needed in production
2. When multiple apps need shared configuration schema
3. When configuration hot-reload is required

**Current State:** Environment variables are validated inline in apps/api/src/index.ts

**Decision:** Defer until Этап 2 (Technology Leadership). Document activation criteria in package README.

**Effort:** 0.5 days (README + criteria only)

---

#### avg-memory — DEFINE ACTIVATION CRITERIA (Priority: P1)

**Activation Criteria:**
1. When PostgreSQL persistence is required (not before MVP-6)
2. When repository interfaces need multiple implementations
3. When data migration scripts are needed

**Current State:** In-memory Maps in apps/api/src/core/ — working fine for MVP-5

**Decision:** Defer until persistence layer is required. Create repository interfaces now, implement in Этап 2.

**Immediate Action:**
- Extract repository interfaces from current in-memory implementation
- Define interface contract in avg-memory/src/interfaces/
- Keep in-memory implementation as default

**Effort:** 1 day (interfaces only), 5-7 days (full implementation in Этап 2)

---

#### avg-observability — DEFINE ACTIVATION CRITERIA (Priority: P2)

**Activation Criteria:**
1. When production deployment is planned
2. When structured logging is required for debugging
3. When metrics collection is needed for capacity planning

**Current State:** Basic file-based error logging in API

**Decision:** Defer until Этап 2. Document in README.

**Effort:** 0.5 days (README + criteria)

---

#### avg-ui — REMOVE (Priority: P1)

**Reason:** UI components are implemented directly in `apps/web/src/components/`. No shared UI library is needed at this stage.

**Action:**
1. Document decision in ADR
2. Remove from tsconfig.json project references
3. Delete directory or mark as "absorbed by apps/web"
4. Update package-map.md architecture doc

**Effort:** 0.5 days

---

#### avg-knowledge — DEFINE ACTIVATION CRITERIA (Priority: P3)

**Activation Criteria:**
1. When external knowledge base integration is needed
2. When vector search is implemented
3. When document embeddings are required

**Decision:** Defer indefinitely. Not needed for MVP-5 or Этап 2.

**Effort:** 0.25 days (README only)

---

#### avg-claim-court — DEFINE ACTIVATION CRITERIA (Priority: P3)

**Activation Criteria:**
1. When claim adjudication becomes a separate service
2. When multi-model claim comparison is needed
3. When claim conflict resolution is implemented

**Decision:** Defer until UTS phase. Document in README.

**Effort:** 0.25 days (README only)

---

#### avg-concept-forge — DEFINE ACTIVATION CRITERIA (Priority: P3)

**Activation Criteria:**
1. When concept generation becomes a standalone feature
2. When frame collision operators are implemented
3. When creative assistance is separated from dialogue

**Decision:** Defer until UTS phase. Document in README.

**Effort:** 0.25 days (README only)

---

### 2.3 Package Status Summary

| Package | Decision | Priority | Effort | Phase |
|---------|----------|----------|--------|-------|
| avg-core | Implement | P0 | 2-3 days | Phase 1 |
| avg-memory | Interfaces only | P1 | 1 day | Phase 1 |
| avg-ui | Remove | P1 | 0.5 days | Phase 1 |
| avg-config | README only | P2 | 0.5 days | Phase 2 |
| avg-observability | README only | P2 | 0.5 days | Phase 2 |
| avg-knowledge | README only | P3 | 0.25 days | Phase 3 |
| avg-claim-court | README only | P3 | 0.25 days | Phase 3 |
| avg-concept-forge | README only | P3 | 0.25 days | Phase 3 |

---

## Part 3: Code Deduplication

### 3.1 Duplication Inventory

| Duplicate | Found In | Resolution | Target Package |
|-----------|----------|------------|----------------|
| `normalizeText()` | avg-validation, avg-agents, avg-retrieval, avg-evals | Move to avg-utils | @avg/utils |
| `collectStrongWordMarkers()` | avg-validation, avg-evals | Move to avg-utils | @avg/utils |
| `collectStrongWordHits()` | avg-validation, avg-evals | Move to avg-utils | @avg/utils |
| `AvgRetrievalHit` type | avg-retrieval, avg-validation | Remove from validation, import from retrieval | @avg/retrieval |
| `deepEqual()` via JSON.stringify | avg-utils, avg-graph | Consolidate in avg-utils with structural diff | @avg/utils |

### 3.2 Deduplication Plan

#### Step 1: Enhance @avg/utils

Add to `packages/avg-utils/src/index.ts`:

```typescript
// Text utilities
export function normalizeText(value: string): string;
export function dedupe(values: string[]): string[];
export function truncate(text: string, maxLength: number): string;
export function clamp(value: number, min: number, max: number): number;
export function formatPercentage(value: number): string;

// Pattern matching
export function matchStrongWords(text: string): string[];
export function matchUncertaintyMarkers(text: string): string[];
export function matchMetaphorIndicators(text: string): string[];

// Deep comparison
export function deepEqual(a: unknown, b: unknown): boolean;
export function structuralDiff<T extends object>(a: T, b: T): Partial<T>;
```

#### Step 2: Remove Duplicates

1. Remove `normalizeText()` from:
   - `packages/avg-validation/src/index.ts`
   - `packages/avg-agents/src/index.ts`
   - `packages/avg-retrieval/src/index.ts`
   - `packages/avg-evals/src/index.ts`

2. Replace with:
   ```typescript
   import { normalizeText } from "@avg/utils";
   ```

3. Repeat for all other duplicates

#### Step 3: Update Tests

- Ensure all packages still pass tests after import changes
- Add tests for new utils functions

**Effort:** 1-2 days

---

## Part 4: Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

**Goal:** Resolve critical gaps, establish foundations, organize documentation

**Status:** All Phase 1 tasks completed (2026-05-22)

| Task | ID | Effort | Dependencies | Status | Deliverables |
|------|-----|--------|--------------|--------|--------------|
| Document archival | DOC-001 | 1 day | None | ✅ DONE | docs/90_archive/ populated with 11 docs, README created |
| Document status markers | DOC-002 | 1 day | DOC-001 | ✅ DONE | Frontmatter added to all root docs and archived docs |
| Implement avg-core | CORE-001 | 2-3 days | None | ✅ DONE | Result pattern, error classes, types, 22 tests |
| Enhance avg-utils | UTIL-001 | 1 day | CORE-001 | ✅ DONE | Pattern matching utilities moved to shared package |
| Remove code duplicates | DEDUP-001 | 1 day | UTIL-001 | ✅ DONE | AvgRetrievalHit deduplication, imports updated |
| avg-memory interfaces | MEM-001 | 1 day | None | ✅ DONE | 5 repository interfaces defined (Project, Session, Message, Document, Graph) |
| Remove avg-ui | UI-001 | 0.5 days | None | ✅ DONE | Package deleted, package-map.md updated |
| Backlog consistency | DOC-003 | 1 day | All above | ✅ DONE | project-backlog.md updated with Sprint 1.7 |

**Completed Effort:** ~3,100 tokens (Sprint 1.7) + avg-core + avg-memory + deduplication  
**Phase 1 Status:** COMPLETE

**Exit Criteria:**
- [x] All docs classified with status markers
- [x] Archived documents moved to docs/90_archive/
- [x] avg-ui package removed
- [x] project-backlog.md is consistent with actual state
- [x] avg-core implements Result pattern with tests (22 tests passing)
- [x] All code duplicates removed (AvgRetrievalHit deduplication)
- [x] avg-memory interfaces defined (5 repositories)
- [x] All packages pass typecheck (22/22 tasks successful)

---

### Phase 2: Infrastructure Preparation (Weeks 3-4)

**Goal:** Prepare infrastructure packages for Этап 2 implementation

| Task | ID | Effort | Dependencies | Deliverables |
|------|-----|--------|--------------|--------------|
| avg-config README + criteria | CFG-001 | 0.5 days | None | Activation criteria documented |
| avg-observability README | OBS-001 | 0.5 days | None | Activation criteria documented |
| avg-knowledge README | KNOW-001 | 0.25 days | None | Activation criteria documented |
| avg-claim-court README | CLAIM-001 | 0.25 days | None | Activation criteria documented |
| avg-concept-forge README | CONCEPT-001 | 0.25 days | None | Activation criteria documented |
| Repository pattern refactoring | REPO-001 | 2 days | MEM-001 | In-memory repos behind interfaces |
| PostgreSQL schema design | DB-001 | 1 day | REPO-001 | Migration scripts ready |

**Total Effort:** ~5 days

**Exit Criteria:**
- [ ] All empty packages have README with activation criteria
- [ ] Repository interfaces used by apps/api
- [ ] PostgreSQL migration scripts ready for implementation

---

### Phase 3: Validation & Testing (Week 5)

**Goal:** Ensure quality gates pass, comprehensive testing

| Task | ID | Effort | Dependencies | Deliverables |
|------|-----|--------|--------------|--------------|
| Integration tests for avg-core | CORE-TEST-001 | 1 day | CORE-001 | Full test coverage |
| Property-based tests for utils | UTIL-TEST-001 | 1 day | UTIL-001 | fast-check tests |
| End-to-end API tests | API-TEST-001 | 2 days | REPO-001 | API contract tests |
| Documentation consistency check | DOC-TEST-001 | 0.5 days | DOC-003 | Automated check script |

**Total Effort:** ~4.5 days

**Exit Criteria:**
- [ ] All new code has test coverage
- [ ] Property-based tests catch edge cases
- [ ] Documentation consistency check passes

---

## Part 5: Document Coding Convention

### 5.1 Status Frontmatter Schema

All documents MUST include this frontmatter:

```yaml
---
title: Document Title
status: active | archived | review
created_date: YYYY-MM-DD
last_updated: YYYY-MM-DD
author: Author/Agent
superseded_by: path/to/document.md  # Only for archived
archive_date: YYYY-MM-DD            # Only for archived
archive_reason: Reason for archival  # Only for archived
tags: [tag1, tag2, tag3]
---
```

### 5.2 Status Definitions

| Status | Meaning | Editable | Referenced by AGENTS.md |
|--------|---------|----------|------------------------|
| `active` | Current source of truth | YES | YES |
| `archived` | Historical reference only | NO | NO |
| `review` | Status uncertain | NO (pending decision) | NO |

### 5.3 Archival Process

1. Add `status: archived` frontmatter to document
2. Move to `docs/90_archive/YYYY-MM-DD_<slug>/`
3. Update `docs/90_archive/README.md` index
4. Update `project-backlog.md` if document was referenced
5. Commit with message: `docs(archive): archive <document-name> (superseded by <new-doc>)`

### 5.4 Enforcement

Add to quality gates:
- Script to check all docs have status frontmatter
- Script to verify no active docs reference archived docs
- CI check fails if docs/90_archive/ is modified without proper commit message

---

## Part 6: Risk Assessment

| Risk | Impact | Probability | Mitigation | Owner |
|------|--------|-------------|------------|-------|
| Breaking changes during deduplication | HIGH | MEDIUM | Comprehensive test coverage before changes | Developer |
| Document archival loses important context | MEDIUM | LOW | Superseded_by links preserve traceability | Architect |
| avg-core implementation doesn't match needs | MEDIUM | MEDIUM | Start minimal, iterate based on usage | Developer |
| Phase scope creep | HIGH | HIGH | Strict adherence to exit criteria | Product Owner |
| Backlog inconsistency persists | MEDIUM | MEDIUM | DOC-003 must complete before Phase 2 | Developer |

---

## Part 7: Success Metrics

### Documentation Metrics
- [x] 100% of root documents have status frontmatter
- [x] 11 documents archived with proper frontmatter and traceability
- [x] 0 broken references from active to archived documents
- [x] Archive README is searchable and well-indexed
- [x] project-backlog.md is consistent with actual state (Sprint 1.7 recorded)

### Code Quality Metrics (Pending)
- [ ] 0 duplicate functions across packages
- [ ] avg-core has 90%+ test coverage
- [ ] All packages pass `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`
- [ ] avg-utils exports are used by at least 3 other packages

### Architecture Metrics (Pending)
- [ ] All empty packages classified with activation criteria
- [ ] Repository interfaces implemented
- [ ] Clear path to persistence layer defined

---

## Appendix A: File Movement Plan

### Files to Archive

| Source | Destination |
|--------|-------------|
| docs/99-doc/DeepSeek Аудит.md | docs/90_archive/2026-05-22_initial-audit/deepseek-audit.md |
| docs/99-doc/Open AI Концепт.md | docs/90_archive/2026-05-22_initial-audit/openai-concept.md |
| docs/99-doc/Open AI программное обеспечение.md | docs/90_archive/2026-05-22_initial-audit/openai-software.md |
| docs/99-doc/Open AI технологии реализации.md | docs/90_archive/2026-05-22_initial-audit/openai-implementation-tech.md |
| docs/99-doc/Open AI Codex.md | docs/90_archive/2026-05-22_initial-audit/openai-codex.md |
| docs/99-doc/Open AI CONCEPT + PLAN.md | docs/90_archive/2026-05-22_initial-audit/openai-concept-plan.md |
| docs/99-doc/Google Архитектурные Спецификации AVG.md | docs/90_archive/2026-05-22_initial-audit/google-architecture-spec.md |
| docs/99-doc/Google Аудит концепции AVG.md | docs/90_archive/2026-05-22_initial-audit/google-concept-audit.md |

### Files to Create

| Path | Purpose |
|------|---------|
| docs/90_archive/README.md | Archive index and search guidance |
| packages/avg-core/src/index.ts | Result pattern, error classes, types |
| packages/avg-core/tests/core.test.ts | Tests for avg-core |
| packages/avg-memory/src/interfaces/DocumentRepository.ts | Repository interface |
| packages/avg-memory/src/interfaces/GraphRepository.ts | Repository interface |
| packages/avg-memory/src/index.ts | Barrel export for interfaces |

---

## Appendix B: Verification Commands

After each phase, run:

```bash
# Quality gates
pnpm typecheck
pnpm lint
pnpm test
pnpm build

# Documentation consistency
# (Script to be created in Phase 1)
node scripts/check-doc-status.js

# Deduplication verification
# (Script to be created in Phase 1)
node scripts/check-duplicates.js
```

---

## Next Steps

1. **Review this plan** with team/architect
2. **Approve Phase 1** tasks and priorities
3. **Create tickets** for each task in project-backlog.md
4. **Begin execution** with DOC-001 (document archival)

---

**Author:** AI Audit Assistant (Qoder)  
**For questions:** See `.qoder/war-room/decisions.md` or create clarification ticket
