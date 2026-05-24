---
title: AVG Lab — Gap Analysis for Full Testing
status: archived
created_date: 2026-05-22
last_updated: 2026-05-22
author: AI Audit Assistant
superseded_by: docs/88-project-plan/project-backlog.md
archive_date: 2026-05-22
archive_reason: Snapshot of environment status on 2026-05-22, no longer current. Tracking moved to project-backlog.md
tags: [gap-analysis, environment, testing, historical]
---

# AVG Lab — Gap Analysis for Full Testing

**Date**: 2026-05-22
**Status**: Current project readiness assessment

---

## Summary

| Category | Status | Details |
|----------|--------|---------|
| ✅ Ready | Working | Build, PostgreSQL, OpenAI, Unit Tests (90%) |
| ⚠️ Partial | Blocked | E2E Tests (browsers missing), 2 failing tests |
| ❌ Missing | Not Available | Docker (Redis, Neo4j), AI backend API |

---

## What is WORKING ✅

| Component | Status | Notes |
|-----------|--------|-------|
| **Node.js** | ✅ v26.1.0 | Meets requirements |
| **pnpm** | ✅ v9.12.3 | All dependencies installed |
| **Build** | ✅ 14/14 tasks | All packages compile successfully |
| **PostgreSQL** | ✅ Connected | 83.166.253.250:5432, avg_dev |
| **OpenAI API** | ✅ Working | Key validated, models accessible |
| **Unit Tests** | ✅ 90% pass | ~95 tests pass, 2 pre-existing failures |
| **Use Cases** | ✅ Complete | 10 use case documents created |
| **E2E Framework** | ✅ Installed | Playwright 1.60.0, config ready |
| **Infrastructure** | ✅ Complete | All docs, templates, scripts |

---

## What is PARTIALLY WORKING ⚠️

### 1. E2E Tests (Playwright)

**Status**: Framework installed, browsers missing

**Current**:
- ✅ Playwright 1.60.0 installed
- ✅ playwright.config.ts created
- ✅ 5 E2E test spec files created
- ❌ Browsers not installed

**Missing**:
```bash
# Need to run:
npx playwright install
```

**Impact**:
- E2E tests cannot run without browsers
- Chromium, Firefox, WebKit need to be downloaded
- ~400MB download

**To Fix**:
```bash
npx playwright install
```

### 2. Failing Tests (2 tests)

**Status**: Pre-existing schema path error

**Error**:
```
ENOENT: no such file or directory, open 'avg-schemas/dist/undefined'
```

**Files**:
- `tests/dialogue-smoke.test.ts`
- `tests/web.test.ts`

**Root Cause**: `loadSchema()` function receives `undefined` parameter

**Impact**:
- 2 test suites fail (36 tests still pass)
- Not related to infrastructure setup
- Pre-existing bug in avg-schemas package

**To Fix** (separate task):
- Investigate `packages/avg-schemas/src/index.ts` line 27
- Fix schema path construction

---

## What is MISSING ❌

### 1. Docker (Redis & Neo4j)

**Status**: Not installed on system

**Impact**:
- ❌ Redis unavailable (caching, sessions, rate limiting)
- ❌ Neo4j unavailable (graph database, concept maps use fallback)

**Optional Services Affected**:
| Service | Purpose | Alternative |
|---------|---------|-------------|
| Redis | Caching, sessions | In-memory fallback (slower) |
| Neo4j | Graph database | In-memory graph (MVP-5) |

**To Enable** (optional):
```bash
# Option 1: Install Docker Desktop for Windows
# Download: https://www.docker.com/products/docker-desktop/

# Option 2: Use remote services
# Update .env with remote Redis and Neo4j URLs

# Option 3: Skip for now
# App works with in-memory fallbacks
```

**Note**: For MVP-5 testing, these are **optional**. The app uses in-memory fallbacks.

### 2. Backend API Server

**Status**: No running backend connected to frontend

**Impact**:
- ❌ Grounded Retrieval API calls will fail (no backend)
- ❌ Document registration won't persist
- ⚠️ Sample data used instead of real API responses

**Current Workaround**:
- `App.tsx` uses hardcoded sample claims and graph data
- Frontend works standalone for UI testing
- API endpoints documented but server not running

**To Enable** (if backend exists):
```bash
# Start API server
cd apps/api && pnpm dev

# Or deploy backend and update API base URL in frontend
```

### 3. S3 Storage Endpoint

**Status**: Bucket configured, endpoint not set

**Impact**:
- ❌ File uploads won't work
- ⚠️ Artifact export will use local storage

**To Enable** (optional):
```bash
# Add to .env:
S3_ENDPOINT=http://localhost:9000  # For MinIO local
# Or production S3 endpoint
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret
```

### 4. Monitoring & Observability

**Status**: Not configured (all optional)

| Service | Status | Impact |
|---------|--------|--------|
| Sentry | Not configured | No error tracking |
| Langfuse | Not configured | No AI observability |
| PostHog | Not configured | No product analytics |

**Note**: These are **production services**, not required for testing.

---

## Priority Recommendations

### 🔴 Critical (Required for E2E Testing)

| Task | Command | Time |
|------|---------|------|
| Install Playwright browsers | `npx playwright install` | 5 min |

### 🟡 Important (For Full Functionality)

| Task | Details | Priority |
|------|---------|----------|
| Fix schema path error | `avg-schemas/dist/undefined` bug | Medium |
| Backend API | Run `apps/api` server | Medium |
| Docker Desktop | For Redis & Neo4j | Low (optional for MVP-5) |

### 🟢 Optional (For Production)

| Task | Purpose | Priority |
|------|---------|----------|
| S3 endpoint | File uploads | Low |
| Sentry | Error tracking | Low |
| Langfuse | AI observability | Low |
| PostHog | Product analytics | Low |

---

## Quick Fix Checklist

### For E2E Testing NOW:
```bash
# 1. Install Playwright browsers (5 min)
npx playwright install

# 2. Run E2E tests
pnpm test:e2e
```

### For Full Testing (Optional):
```bash
# 1. Install Docker Desktop
# https://www.docker.com/products/docker-desktop/

# 2. Start services
docker compose up -d postgres redis neo4j

# 3. Run all tests
pnpm test
pnpm test:e2e
pnpm test:ai
```

---

## What You CAN Test RIGHT NOW

| Test Type | Status | Command |
|-----------|--------|---------|
| **Manual UI Testing** | ✅ Ready | `pnpm dev` then open browser |
| **Unit Tests** | ✅ 90% pass | `pnpm test` |
| **Component Tests** | ✅ Working | `pnpm test` |
| **AI Evals** | ✅ Ready (with OpenAI key) | `pnpm test:ai` |
| **Contract Tests** | ✅ Working | `pnpm test:contract` |
| **Type Checking** | ✅ Working | `pnpm typecheck` |
| **Linting** | ✅ Working | `pnpm lint` |
| **Build** | ✅ Working | `pnpm build` |

---

## Conclusion

**For user testing of implemented features:**
- ✅ Frontend works with sample data
- ✅ PostgreSQL connected
- ✅ OpenAI API working
- ✅ All UI components functional (Claim Review, Concept Map, Retrieval, Citations)
- ⚠️ Install Playwright browsers for E2E automation

**Minimum needed to start testing:**
1. Run `npx playwright install` (5 min)
2. Run `pnpm dev` to start app
3. Open browser and follow Use Cases documentation

**Everything else is optional for MVP-5 testing.**
