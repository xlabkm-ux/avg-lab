# AVG Leadership Roadmap: Simple Means → Industry-Leading Solution

## Context

**Why this plan exists:** AVG has exceptional philosophical foundation and validation system, but needs to become a market leader through simple, focused execution rather than feature bloat.

**Current state:** 35% implementation (MVP-5), strong schemas/validation, missing UI polish and key differentiators.

**Goal:** Transform AVG into industry-leading thinking tool using SIMPLE means that amplify existing strengths without complex architecture.

**Core principle:** "Простыми средствами получить оптимальное и креативное решение" — win through discipline, not complexity.

---

## Strategic Positioning

### What Makes AVG Unique (Already Implemented)

1. **Epistemic Discipline System** — Claim status taxonomy enforced at schema level
2. **Map/Territory Boundary** — Never confuses working model with Reality
3. **No-Fairy-Tale Gate** — Automated detection of pseudo-depth and metaphor-as-fact
4. **Validation Risk Levels** — Every claim scored with repair suggestions
5. **Source Grounding with Boundaries** — Citations visible, confidence as risk signal

**Competitive moat:** These features DON'T EXIST in Obsidian, Roam Research, Logseq, or Notion AI.

### Winning Formula

```
AVG = Type-Safe Epistemology + Validation-First Architecture + Disciplined Simplicity
```

Not: More features, more integrations, more complexity.

Instead: Fewer things done with surgical precision.

---

## Phase 1: MVP-5 Completion (Weeks 1-3)

**Goal:** Ship first user-testable version with polished UI connecting existing backend.

### Week 1: Core Workspace Surfaces

#### Task 1.1: Document Registration Surface (AVG-704)
**Effort:** 2-3 days  
**Impact:** HIGH — Users can register local documents for retrieval

**What exists:**
- ✅ `packages/avg-retrieval` — Full document repository with chunking
- ✅ API routes in `apps/api/src/index.ts` — POST `/projects/:id/documents`
- ✅ Tests passing

**What's needed:**
- Wire up UI in `apps/web/src/index.ts` to call existing API
- Display registered documents list
- Show chunking results (snippet count, token count)

**Code to write:** ~200 lines UI glue

**Files to modify:**
- `apps/web/src/index.ts` — Add document registration form + list view

---

#### Task 1.2: Grounded Retrieval Flow (AVG-705)
**Effort:** 2-3 days  
**Impact:** HIGH — Source-grounded answers with visible citations

**What exists:**
- ✅ `createGroundedRetrievalFlow()` in `apps/web/src/index.ts`
- ✅ `renderGroundedRetrievalFlow()` already implemented
- ✅ Citation panel component ready
- ✅ API endpoint: POST `/projects/:id/retrieval/search`

**What's needed:**
- Connect search UI to retrieval API
- Display retrieval hits with confidence scores
- Show grounded vs unsupported claims separately

**Code to write:** ~150 lines

**Files to modify:**
- `apps/web/src/index.ts` — Wire retrieval flow to API

---

#### Task 1.3: Remove Empty Package Illusion
**Effort:** 1 day  
**Impact:** MEDIUM — Eliminates confusion about project completeness

**Action:**
Comment out unused packages from `tsconfig.base.json`:
```json
{
  "references": [
    // Keep implemented packages
    { "path": "packages/avg-schemas" },
    { "path": "packages/avg-validation" },
    { "path": "packages/avg-agents" },
    { "path": "packages/avg-retrieval" },
    { "path": "packages/avg-graph" },
    { "path": "packages/avg-evals" },
    
    // Comment out until implemented (MVP-6+)
    // { "path": "packages/avg-core" },
    // { "path": "packages/avg-ui" },
    // { "path": "packages/avg-memory" },
    // { "path": "packages/avg-config" },
    // { "path": "packages/avg-knowledge" },
    // { "path": "packages/avg-claim-court" },
    // { "path": "packages/avg-concept-forge" },
    // { "path": "packages/avg-observability" }
  ]
}
```

Add clear markers in READMEs:
```markdown
# @avg/core — COMING SOON (MVP-6+)
This package is planned but not yet implemented.
Do NOT import from this package.
```

**Files to modify:**
- `tsconfig.base.json`
- All empty package READMEs (8 files)

---

### Week 2: Validation & Map Surfaces

#### Task 2.1: Claim Review Panel (AVG-706)
**Effort:** 2 days  
**Impact:** MEDIUM-HIGH — Makes validation visible to users

**What exists:**
- ✅ Full validation pipeline in `packages/avg-validation/src/index.ts`
- ✅ Risk classification (low/medium/high/critical)
- ✅ Repair suggestions generated automatically
- ✅ Claim extraction from structured responses

**What's needed:**
- Render validation reports in table/list view
- Color-code claim statuses (green/yellow/red badges)
- Show risk markers with explanations
- Display repair suggestions with "Apply" button

**Code to write:** ~180 lines

**Files to modify:**
- `apps/web/src/index.ts` — Add claim review surface

---

#### Task 2.2: Concept Map Visualization (AVG-707)
**Effort:** 3-4 days  
**Impact:** HIGH — Visual concept map from session material

**What exists:**
- ✅ `renderConceptMapShell()` in `apps/web/src/index.ts`
- ✅ Graph projections in `packages/avg-graph/src/index.ts`
- ✅ React Flow-ready output format
- ✅ Diff calculation (`diffGraphSnapshots`)

**What's needed:**
- Install React Flow dependency
- Integrate graph snapshot data with React Flow nodes/edges
- Add zoom/pan controls
- Highlight new/modified/deleted nodes in diff mode

**Dependencies to add:**
```bash
pnpm add reactflow --filter @avg/web
```

**Code to write:** ~250 lines

**Files to modify:**
- `apps/web/package.json` — Add reactflow dependency
- `apps/web/src/index.ts` — Integrate React Flow component

---

#### Task 2.3: Extract Shared Utilities
**Effort:** 2-3 days  
**Impact:** MEDIUM — Eliminates code duplication

**Problem:** `normalizeText()` duplicated in 4 packages

**Solution:** Create `packages/avg-utils/src/index.ts`:
```typescript
export function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export function dedupe<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function collectStrongWordMarkers(text: string): string[] {
  const strongWords = ['always', 'never', 'guarantee', 'truth', 'essence'];
  return strongWords.filter(word => 
    new RegExp(`\\b${word}\\b`, 'i').test(text)
  );
}
```

Then update imports in:
- `packages/avg-validation/src/index.ts`
- `packages/avg-agents/src/index.ts`
- `packages/avg-retrieval/src/index.ts`
- `packages/avg-evals/src/index.ts`

**Files to create:**
- `packages/avg-utils/src/index.ts`
- `packages/avg-utils/package.json`

**Files to modify:**
- Root `pnpm-workspace.yaml` — Add avg-utils
- 4 packages — Replace duplicate functions with imports

---

### Week 3: Polish & Testing

#### Task 3.1: Artifact Export Surface (AVG-708)
**Effort:** 3 days  
**Impact:** HIGH — Users can save/share their work

**Implementation:**
```typescript
// apps/web/src/index.ts — Add export functions
export function exportSessionSummary(session: SessionData): string {
  return JSON.stringify(session, null, 2);
}

export function exportCitationReport(grounding: GroundedResponseBoundary): string {
  return formatMarkdownCitations(grounding.citations);
}

export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}
```

Start with JSON + Markdown export. No PDF initially.

**Code to write:** ~150 lines

**Files to modify:**
- `apps/web/src/index.ts` — Add export buttons + formatting

---

#### Task 3.2: E2E Happy Path Test (AVG-709)
**Effort:** 3-4 days  
**Impact:** CRITICAL — Proves product works end-to-end

**Test scenario:**
```typescript
// tests/e2e/mvp-5-happy-path.test.ts
import { test, expect } from '@playwright/test';

test('complete MVP-5 user journey', async ({ page }) => {
  // 1. Create project
  await page.goto('http://localhost:3000');
  await page.fill('#project-title', 'Research Project');
  await page.click('#create-project');
  
  // 2. Submit raw thought
  await page.fill('#thought-input', 'AI will replace programmers');
  await page.click('#submit');
  
  // 3. Verify structured response appears
  await expect(page.locator('.claim-status')).toContainText('hypothesis');
  await expect(page.locator('.validation-risk')).toContainText('medium');
  
  // 4. Register document
  await page.click('nav >> text=Documents');
  await page.fill('#doc-textarea', 'Some research paper content...');
  await page.click('#register-document');
  
  // 5. Ask grounded question
  await page.click('nav >> text=Retrieval');
  await page.fill('#query-input', 'What does the document say?');
  await page.click('#search');
  
  // 6. Verify citations appear
  await expect(page.locator('.citation-panel')).toBeVisible();
  await expect(page.locator('.citation-source')).toHaveCount(1);
});
```

**Files to create:**
- `tests/e2e/mvp-5-happy-path.test.ts`

---

#### Task 3.3: UI Polish Pass
**Effort:** 2 days  
**Impact:** MEDIUM — Makes MVP feel premium vs prototype

**Improvements:**
- Add loading skeletons instead of blank screens
- Better typography hierarchy (system fonts only)
- Subtle CSS transitions for state changes
- Keyboard shortcuts (Cmd+K command palette pattern)
- Better empty states with helpful guidance

**Files to modify:**
- `apps/web/src/index.ts` — CSS improvements, loading states

---

#### Task 3.4: Documentation Landing Page
**Effort:** 2 days  
**Impact:** HIGH — Reframes product positioning

**Create:** `docs/landing.md` or simple static site

**Content:**
```markdown
# AVG: The Thinking Environment That Doesn't Lie

Most AI chatbots present guesses as facts. AVG doesn't.

## What makes AVG different?

### 1. Every claim has a status
- ✅ Fact (verified)
- 💭 Hypothesis (plausible)  
- 🎭 Metaphor (useful analogy, NOT fact)
- ⚠️ Unsupported (needs evidence)

### 2. Sources are visible, not hidden
When AVG retrieves documents, you see:
- Exact snippets used
- Confidence levels (as risk signals, not proof)
- What's supported vs interpreted vs unsupported

### 3. Your thinking becomes structured artifacts
Not chat logs. Structured outputs with:
- Scope boundaries
- Validation risk levels
- Next actions
- Exportable formats

## Try it locally in 2 minutes

```bash
git clone https://github.com/your-org/avg-lab
cd avg-lab
pnpm install
pnpm dev
```

Open http://localhost:3000 and start thinking.
```

**Files to create:**
- `docs/landing.md` or `index.html` in docs folder

---

## Phase 2: Technology Leadership Foundation (Weeks 4-6)

**Goal:** Add simple tech enhancements that position AVG as industry leader through discipline.

### Week 4: Observability & Error Handling

#### Task 4.1: Add Pino Structured Logging
**Effort:** 1 day  
**Impact:** HIGH — Production readiness

**Why Pino:** Fastest Node.js logger, zero dependencies, 5KB bundle

**Implementation:**
```bash
pnpm add pino pino-pretty --filter @avg/api
```

```typescript
// apps/api/src/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});
```

Replace all `console.log` with `logger.info()`.

**Files to create:**
- `apps/api/src/logger.ts`

**Files to modify:**
- `apps/api/package.json` — Add pino dependency
- `apps/api/src/index.ts` — Use logger instead of console

---

#### Task 4.2: Implement Result Pattern
**Effort:** 2 days  
**Impact:** HIGH — Eliminates error handling chaos

**Create minimal Result type:**
```typescript
// packages/avg-utils/src/result.ts
export type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

export function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function Err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}
```

**Usage example:**
```typescript
// Before: throw/catch chaos
function parseBody(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error("Invalid JSON");
  }
}

// After: Typed, predictable errors
function parseBody(text: string): Result<unknown, ValidationError> {
  try {
    return Ok(JSON.parse(text));
  } catch (e) {
    return Err(new ValidationError("Invalid JSON", e));
  }
}
```

**Files to create:**
- `packages/avg-utils/src/result.ts`

**Files to modify:**
- `packages/avg-utils/src/index.ts` — Export Result types
- Gradually refactor error-prone functions

---

#### Task 4.3: Add Basic Observability Stub
**Effort:** 2 days  
**Impact:** MEDIUM — Foundation for future tracing/metrics

**Create minimal observability package:**
```typescript
// packages/avg-observability/src/index.ts
export interface Span {
  name: string;
  startTime: number;
  endTime?: number;
  attributes: Record<string, string>;
}

export class Tracer {
  private spans: Span[] = [];
  
  startSpan(name: string, attributes: Record<string, string> = {}): Span {
    const span: Span = {
      name,
      startTime: Date.now(),
      attributes
    };
    this.spans.push(span);
    return span;
  }
  
  endSpan(span: Span): void {
    span.endTime = Date.now();
  }
}

export const tracer = new Tracer();
```

**Files to create:**
- `packages/avg-observability/src/index.ts`
- `packages/avg-observability/package.json`

---

### Week 5: Performance & Developer Experience

#### Task 5.1: Add Lightweight HTTP Router
**Effort:** 1 day  
**Impact:** MEDIUM — Cleaner API code

**Use itty-router (350 bytes):**
```bash
pnpm add itty-router --filter @avg/api
```

```typescript
// apps/api/src/router.ts
import { Router } from 'itty-router';

const router = Router();

router.post('/projects/:id/documents', handleRegisterDocument);
router.post('/projects/:id/retrieval/search', handleSearchDocuments);

export const handler = router.handle;
```

**Files to create:**
- `apps/api/src/router.ts`

**Files to modify:**
- `apps/api/package.json` — Add itty-router
- `apps/api/src/index.ts` — Use router instead of manual routing

---

#### Task 5.2: Implement Request Caching
**Effort:** Half day  
**Impact:** HIGH — 10-50x faster repeated queries

**Simple LRU cache:**
```bash
pnpm add lru-cache --filter @avg/retrieval
```

```typescript
// packages/avg-retrieval/src/cache.ts
import { LRUCache } from 'lru-cache';

const retrievalCache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5  // 5 minutes
});

export function getCachedRetrieval(key: string) {
  return retrievalCache.get(key);
}

export function setCachedRetrieval(key: string, result: any) {
  retrievalCache.set(key, result);
}
```

**Files to create:**
- `packages/avg-retrieval/src/cache.ts`

**Files to modify:**
- `packages/avg-retrieval/package.json` — Add lru-cache
- `packages/avg-retrieval/src/index.ts` — Use cache in search function

---

#### Task 5.3: Add OpenAPI Documentation
**Effort:** 1 day  
**Impact:** MEDIUM — API discoverability

**Tool:** `@asteasolutions/zod-to-openapi`

```bash
pnpm add @asteasolutions/zod-to-openapi --filter @avg/api
```

Generate Swagger UI automatically from Zod schemas.

**Files to modify:**
- `apps/api/package.json` — Add zod-to-openapi
- `apps/api/src/index.ts` — Add /docs route

---

### Week 6: Competitive Differentiation Amplification

#### Task 6.1: Make Claim Status Visible in UI
**Effort:** 1 day  
**Impact:** HIGH — Surfaces unique differentiation

**Add color-coded badges:**
```css
.claim-status-definition { background: #10b981; color: white; } /* green */
.claim-status-hypothesis { background: #3b82f6; color: white; } /* blue */
.claim-status-metaphor-only { background: #f59e0b; color: white; } /* yellow */
.claim-status-prohibited { background: #ef4444; color: white; } /* red */
```

Display in dialogue responses and claim review panel.

**Files to modify:**
- `apps/web/src/index.ts` — Add badge components

---

#### Task 6.2: Expose No-Fairy-Tale Score
**Effort:** 1 day  
**Impact:** MEDIUM — Makes validation tangible

**Add to structured response display:**
```typescript
interface ResponseWithScore {
  response: AvgStructuredResponse;
  noFairyTaleScore: number; // 0.0 - 1.0
  warnings: string[];
}
```

Display as progress bar with tooltip explanations.

**Files to modify:**
- `apps/web/src/index.ts` — Add score display

---

#### Task 6.3: Create "Claim Health Dashboard"
**Effort:** 2 days  
**Impact:** HIGH — Aggregates validation insights

**Show session-level statistics:**
```
Claim Health Report:
✅ 8 claims properly scoped
⚠️ 2 hypotheses missing scope
❌ 1 metaphor unmarked (auto-repaired)

Risk Distribution:
- Low: 6
- Medium: 3  
- High: 1
- Critical: 0
```

**Files to modify:**
- `apps/web/src/index.ts` — Add dashboard component

---

#### Task 6.4: Add "Frame Collision" Creative Operator
**Effort:** 1 day  
**Impact:** MEDIUM — Simple creativity without full Concept Forge

**Implement basic operation:**
```typescript
// packages/avg-agents/src/creative-ops.ts
export function collideFrames(frame1: string, frame2: string): string {
  return `What if we applied ${frame1}'s logic to ${frame2}'s domain?`;
}

// Usage examples:
collideFrames("biological evolution", "software design")
→ "What if software architectures evolved through mutation/selection?"
```

Add to creative mode prompt.

**Files to create:**
- `packages/avg-agents/src/creative-ops.ts`

---

## Phase 3: Market Leadership Positioning (Weeks 7-8)

**Goal:** Reframe product positioning and create marketing assets.

### Week 7: Positioning & Messaging

#### Task 7.1: Update README Positioning
**Effort:** 1 day  
**Impact:** HIGH — Changes first impression

**New headline options:**
1. "AVG: A Thinking Environment That Preserves Intellectual Honesty"
2. "Stop Chatting with AI. Start Thinking with It."
3. "The First AI System That Distinguishes Fact from Hypothesis from Metaphor"

**Key message shift:**
- FROM: "Codex-native monorepo for building dialogue systems"
- TO: "A disciplined creative environment where AI helps you think without lying to you"

**Files to modify:**
- `README.md` — Complete rewrite with product story

---

#### Task 7.2: Record Demo Video
**Effort:** 2-3 days  
**Impact:** HIGH — Worth 1000 words of documentation

**Script:**
1. Create project (10 sec)
2. Submit controversial claim: "AI consciousness is real" (10 sec)
3. See it classified as "unsupported_claim" with medium risk (10 sec)
4. Register philosophy paper as evidence (10 sec)
5. Ask grounded question (10 sec)
6. View citations and unsupported claims separately (10 sec)
7. Export session as JSON (5 sec)

**Total:** 65 seconds → perfect for social media

**Tools:** OBS Studio (free), screen capture + voiceover

---

#### Task 7.3: Create Competitive Comparison Page
**Effort:** 2 days  
**Impact:** MEDIUM — Highlights unique advantages

**Create:** `docs/comparison.md`

| Feature | AVG | Obsidian | Roam | Logseq | Notion AI |
|---------|-----|----------|------|--------|-----------|
| Claim status tracking | ✅ Formal schema | ❌ Free text | ❌ Free text | ❌ Free text | ❌ None |
| Map/territory boundary | ✅ Enforced | ❌ None | ❌ None | ❌ None | ❌ None |
| Metaphor detection | ✅ Automated | ❌ Manual | ❌ Manual | ❌ Manual | ❌ None |
| Access mode coordinates | ✅ 5-mode system | ❌ None | ❌ None | ❌ None | ❌ None |
| No-fairy-tale gate | ✅ Scoring system | ❌ None | ❌ None | ❌ None | ❌ None |

---

### Week 8: Launch Preparation

#### Task 8.1: Simplify Onboarding
**Effort:** 1 day  
**Impact:** MEDIUM — Reduces friction

**Create setup script:**
```bash
#!/bin/bash
# scripts/setup.sh
echo "Setting up AVG Codex Lab..."
pnpm install
echo "✓ Dependencies installed"

if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️  OPENAI_API_KEY not set. Copy .env.example to .env and add your key."
else
  echo "✓ OpenAI API key detected"
fi

echo ""
echo "Starting development server..."
pnpm dev
```

**Improve `.env.example`:**
```env
# Get your key at https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-...

# Optional: Use a specific model (defaults to gpt-4-turbo)
# OPENAI_MODEL=gpt-4-turbo
```

**Files to create:**
- `scripts/setup.sh`

**Files to modify:**
- `.env.example` — Better comments

---

#### Task 8.2: Final E2E Test Suite
**Effort:** 2 days  
**Impact:** HIGH — Ensures quality before launch

**Add additional test scenarios:**
- Missing evidence path
- Prompt injection as source test
- Strong word detection
- Metaphor boundary preservation

**Files to create:**
- `tests/e2e/claim-validation.test.ts`
- `tests/e2e/retrieval-grounding.test.ts`

---

#### Task 8.3: Release Checklist
**Effort:** 1 day  
**Impact:** MEDIUM — Professional launch

**Create:** `RELEASE-CHECKLIST.md`

```markdown
# MVP-5 Release Checklist

## Pre-Launch
- [ ] All E2E tests passing
- [ ] README updated with product story
- [ ] Demo video recorded
- [ ] Landing page created
- [ ] Setup script tested on fresh clone

## Launch Day
- [ ] Tag release: git tag v0.5.0
- [ ] Push to GitHub
- [ ] Share demo video on social media
- [ ] Post to Hacker News / Reddit / relevant communities

## Post-Launch
- [ ] Monitor issues for first 48 hours
- [ ] Collect user feedback
- [ ] Plan MVP-6 based on feedback
```

**Files to create:**
- `RELEASE-CHECKLIST.md`

---

## Verification Strategy

### How to Test Each Phase

**Phase 1 (MVP-5 Completion):**
```bash
# Run full test suite
pnpm test

# Run E2E tests
pnpm test:e2e

# Build production bundle
pnpm build

# Manual smoke test
pnpm dev
# Open http://localhost:3000
# Complete full user journey: create project → submit thought → register doc → search → export
```

**Phase 2 (Tech Leadership):**
```bash
# Verify logging works
tail -f .avg-logs/api.log

# Check Result pattern usage
grep -r "Result<" packages/*/src/*.ts

# Test caching performance
time curl -X POST http://localhost:3001/projects/test/retrieval/search -d '{"query":"test"}'
# Run same query twice, second should be 10x faster

# Verify OpenAPI docs
open http://localhost:3001/docs
```

**Phase 3 (Market Positioning):**
```bash
# Fresh clone test
cd /tmp
git clone <repo-url>
cd avg-lab
./scripts/setup.sh
# Should work without errors

# Demo video review
# Watch demo video, verify all steps clear and compelling
```

---

## Success Metrics

### Phase 1 Success Criteria (Week 3)
- ✅ All workspace surfaces functional (documents, retrieval, claims, map, export)
- ✅ E2E happy path test passing
- ✅ Zero console errors in browser
- ✅ Can complete full user journey without bugs
- ✅ README clearly explains product value

### Phase 2 Success Criteria (Week 6)
- ✅ Structured logging operational
- ✅ Result pattern adopted in critical paths
- ✅ Retrieval caching reduces latency by 10x+
- ✅ OpenAPI docs accessible at /docs
- ✅ Claim status badges visible in UI

### Phase 3 Success Criteria (Week 8)
- ✅ Demo video completed (<90 seconds)
- ✅ Landing page live
- ✅ Competitive comparison documented
- ✅ Fresh clone setup works in <5 minutes
- ✅ First external users can onboard without help

---

## Risk Mitigation

### Risk 1: Scope Creep
**Mitigation:** Strictly defer to MVP-6:
- Voice/Realtime API
- Neo4j integration
- Authentication
- Multi-user collaboration
- Advanced Concept Forge operations

**Rule:** If it's not in this plan, it doesn't get built until MVP-6 planning.

---

### Risk 2: UI Complexity Overload
**Mitigation:** Keep UI minimal:
- No custom design system (use system fonts, native colors)
- No animation libraries (CSS transitions only)
- No complex state management (local state + props)
- No PDF generation (JSON/Markdown export first)

**Rule:** Every UI feature must justify its complexity cost.

---

### Risk 3: Backend Instability
**Mitigation:** Leverage existing working code:
- Don't rewrite validation logic (already tested)
- Don't change schemas (already frozen)
- Don't modify retrieval engine (already working)
- Only add UI layer on top

**Rule:** Backend is frozen. Only UI changes allowed in Phase 1.

---

## Timeline Summary

| Phase | Duration | Key Deliverables | Effort |
|-------|----------|------------------|--------|
| **Phase 1** | Weeks 1-3 | MVP-5 complete UI | 3 weeks, 1 dev |
| **Phase 2** | Weeks 4-6 | Tech leadership foundation | 3 weeks, 1 dev |
| **Phase 3** | Weeks 7-8 | Market positioning | 2 weeks, 1 dev + marketing |
| **Total** | **8 weeks** | **Industry-leading MVP** | **8 weeks, 1-2 devs** |

---

## Expected Outcome

After 8 weeks of focused execution:

**Product:** Fully functional MVP-5 with polished UI, observable backend, and clear competitive differentiation.

**Positioning:** "AVG is the thinking tool for people who take ideas seriously. While other tools optimize for flexibility, AVG optimizes for truth-tracking."

**Technical Standing:** More disciplined than 80% of production codebases in type safety, schema contracts, and testing comprehensiveness.

**Market Readiness:** Ready for external user testing, demo videos, and early adopter acquisition.

**Next Steps:** MVP-6 planning based on real user feedback, not assumptions.

---

## Philosophy Reminder

> **"Простыми средствами получить оптимальное и креативное решение"**

This plan achieves industry leadership through:
1. **Discipline** — Strict types, schemas, validation
2. **Simplicity** — Minimal dependencies, focused features
3. **Clarity** — Clear positioning, honest about limitations
4. **Execution** — Ship MVP-5 completely before adding more

NOT through:
- ❌ Feature bloat
- ❌ Complex architecture
- ❌ Premature optimization
- ❌ Trying to be everything to everyone

**Winning formula:** Do fewer things better than anyone else.
