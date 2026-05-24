# AVG Lab Test Suite

## Overview

AVG Lab uses a multi-layered testing strategy to ensure correctness across:
- Unit tests (Vitest)
- Integration tests (Vitest)
- E2E tests (Playwright)
- AI evaluation fixtures (YAML)

## Quick Commands

```bash
pnpm test                    # Run all tests across all packages
pnpm test:unit               # Run unit tests only
pnpm test:integration        # Run integration tests only
pnpm test:contract           # Run contract/schema tests
pnpm test:e2e                # Run Playwright E2E tests
pnpm test:coverage           # Run tests with coverage report
pnpm test:ai                 # Run AI evaluation tests
pnpm test:claim-safety       # Run claim safety evals
pnpm test:no-fairy-tale      # Run no-fairy-tale quality gates
pnpm test:prompt-regression  # Run prompt regression tests
```

## Test Architecture

### Layer 1: Unit Tests (Vitest)

Located in `packages/*/tests/` and `apps/*/tests/`.

| Package | Test File | Purpose |
|---------|-----------|---------|
| `@avg/openai` | `packages/avg-openai/tests/model-interaction.test.ts` | OpenAI adapter error handling and normalization |
| `@avg/api` | `apps/api/tests/api.test.ts` | API smoke tests (health, CRUD, routes, security) |
| `@avg/api` | `apps/api/tests/api.contract.test.ts` | API contract/schema validation |
| `@avg/api` | `apps/api/tests/model-interaction.test.ts` | User-model dialogue flow tests |
| `@avg/api` | `apps/api/tests/model-claim-validation.test.ts` | Claim validation and taxonomy tests |
| `@avg/api` | `apps/api/tests/model-interaction-integration.test.ts` | Integration flow tests |
| `@avg/schemas` | `packages/avg-schemas/tests/contract.test.ts` | JSON Schema validation |
| `@avg/validation` | `packages/avg-validation/tests/` | Claim extraction, classification, risk assessment |
| `@avg/graph` | `packages/avg-graph/tests/projection.test.ts` | Graph projection and snapshot tests |
| `@avg/retrieval` | `packages/avg-retrieval/tests/document-repository.test.ts` | Document search and retrieval |
| `@avg/security` | `packages/avg-security/tests/prompt-safety.test.ts` | Prompt injection and safety tests |
| `@avg/html-rendering` | `packages/avg-html-rendering/tests/html-rendering.test.ts` | HTML rendering tests |
| `@avg-agents` | `packages/avg-agents/tests/mode-router.test.ts` | Dialogue mode routing |
| `@avg/evals` | `packages/avg-evals/tests/` | AI evaluation scoring tests |
| `@avg/testkit` | `packages/avg-testkit/tests/` | Integration test utilities |
| `@avg/web` | `apps/web/tests/` | React component and DOM tests |

### Layer 2: E2E Tests (Playwright)

Located in `e2e/tests/`.

| Test File | User Case | Purpose |
|-----------|-----------|---------|
| `project-creation.spec.ts` | UC-001 | Project creation flow |
| `claim-review.spec.ts` | UC-002 | Claim review and validation |
| `grounded-retrieval.spec.ts` | UC-003 | Evidence-grounded retrieval |
| `citation-panel.spec.ts` | UC-004 | Citation display and interaction |
| `concept-mapping.spec.ts` | UC-005 | Concept map generation |
| `accessibility.spec.ts` | - | A11y compliance |
| `visual-regression.spec.ts` | - | Visual regression detection |
| `performance.spec.ts` | `@performance` | Performance benchmarks |
| `user-model-interaction.spec.ts` | UC-007 | Complete user-model interaction flow |

### Layer 3: AI Eval Fixtures (YAML)

Located in `tests/ai-evals/`. These define expected behaviors for AI quality gates.

| Fixture | Purpose |
|---------|---------|
| `claim-safety/metaphor-as-fact.yaml` | Ensure metaphors aren't presented as literal facts |
| `retrieval/grounded-response.yaml` | Validate evidence-grounded responses |
| `retrieval/citation-completeness.yaml` | Check citation completeness |
| `retrieval/prompt-injection-source.yaml` | Detect prompt injection in sources |
| `retrieval/unsupported-claim.yaml` | Handle unsupported claims |
| `retrieval/low-confidence-boundary.yaml` | Low-confidence response boundaries |
| `retrieval/map-territory-boundary.yaml` | Map/territory distinction |
| `adequacy/strong-word.yaml` | Detect strong/absolute language |
| `user-interaction/user-input-interpretation.yaml` | User input classification |
| `user-interaction/claim-validation-response.yaml` | Claim validation responses |
| `user-interaction/concept-map-generation.yaml` | Concept map quality |
| `user-interaction/evidence-grounding.yaml` | Evidence citation quality |
| `user-interaction/risk-assessment.yaml` | Risk assessment accuracy |

### Layer 4: Test Fixtures (JSON)

Located in `tests/fixtures/`.

| Fixture | Purpose |
|---------|---------|
| `avg-response/valid.json` | Valid AVG structured response |
| `avg-response/metaphor.json` | Metaphor-only response fixture |
| `avg-response/hypothesis.json` | Hypothesis response fixture |
| `avg-response/definition.json` | Definition response fixture |
| `avg-response/critical-risk.json` | Critical risk response fixture |
| `claims/valid.json` | Valid claim structure |

## Model Interaction Tests

### What We Test

1. **OpenAI Adapter Error Handling** (`packages/avg-openai/tests/model-interaction.test.ts`)
   - Error normalization for all HTTP status codes (401, 403, 404, 408, 429, 500-599)
   - Retryable vs non-retryable error classification
   - Nested error structure handling
   - Network error pattern matching

2. **Dialogue Flow Composition** (`apps/api/tests/model-interaction.test.ts`)
   - Grounded response composition with document citations
   - Claim status preservation (all 8 types: definition, working_distinction, operational_marker, indirect_sign, hypothesis, metaphor_only, prohibited_positive_claim, boundary_statement)
   - Language mode preservation (all 6 types: direct_description, operational_description, conditional_description, metaphor, symbolic_pointer, silence_required)
   - Validation risk level tracking (low, medium, high, critical)
   - Citation limiting
   - Map-territory boundary preservation

3. **Claim Validation** (`apps/api/tests/model-claim-validation.test.ts`)
   - Claim request validation against JSON Schema
   - Metaphor-only claim handling
   - Hypothesis evidence requirements
   - Risk assessment and flagging
   - Language mode / claim status pairing validation
   - Claim metadata preservation through the pipeline

4. **Integration Flow** (`apps/api/tests/model-interaction-integration.test.ts`)
   - Environment configuration validation
   - Model response schema validation
   - Complete processing flow (input -> intent -> mode -> draft -> validate -> assess -> respond)
   - Error handling and retry logic
   - Citation and grounding validation

5. **E2E User Flows** (`e2e/tests/user-model-interaction.spec.ts`)
   - Query submission and response rendering
   - Claim status and risk indicator display
   - Citation panel presentation
   - Loading and error states
   - Map-territory boundary UI indicators
   - Multiple consecutive queries

## Key Testing Patterns

### Vitest Pattern
```typescript
import { describe, expect, it } from "vitest";

describe("feature name", () => {
  it("does something specific", () => {
    expect(result).toBe(true);
  });
});
```

### Playwright Pattern
```typescript
import { test, expect } from '@playwright/test';

test.describe('UC-00X: Feature Name', () => {
  test.beforeEach(async ({ page }) => { ... });
  test('should do something', async ({ page }) => { ... });
});
```

### API Mocking in E2E
```typescript
await page.route('**/api/projects/*/dialogue/page', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'text/html',
    body: generateMockDialoguePage({...})
  });
});
```

## Coverage Thresholds

Configured in `vitest.config.ts`:
- Branches: 70%
- Functions: 75%
- Lines: 75%
- Statements: 75%

## Important Notes

- The adaptive LLM layer (`AVG_LLM_ADAPTIVE`) is **disabled by default** - tests use deterministic fallback paths
- AI eval fixtures are **rule-based scorers**, not live LLM calls
- API tests use direct function imports (no HTTP mocking) since the API is an in-memory Node.js HTTP server
- E2E tests use Playwright's `page.route()` for API mocking
- All model responses must conform to JSON Schema 2020-12 (validated with Ajv)
- Claim validation uses the `validateClaimContract` function which adds risks based on claim properties
- The `accepted` field in validation reports is `true` only when `risks.size === claim.risks.length`
