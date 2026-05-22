# AVG Lab — Testing Guide

## Overview

AVG Lab uses a comprehensive testing strategy covering unit, integration, E2E, and AI behavior tests.

## Test Categories

### 1. Unit Tests (Vitest)

**Location**: `packages/*/tests/`, `apps/*/tests/`

**Run**: `pnpm test:unit`

Fast, isolated tests for individual functions and components.

```bash
# Run all unit tests
pnpm test:unit

# Run specific file
pnpm test:unit packages/avg-validation/tests/

# Watch mode
pnpm test:unit -- --watch
```

**Example**:
```typescript
import { describe, it, expect } from 'vitest';
import { validateClaim } from '@avg/validation';

describe('validateClaim', () => {
  it('should reject metaphor marked as fact', () => {
    const result = validateClaim({
      text: 'The mind is a computer',
      status: 'fact'
    });
    expect(result.valid).toBe(false);
  });
});
```

### 2. Integration Tests

**Run**: `pnpm test:integration`

Tests interaction between modules, database queries, and API endpoints.

```bash
pnpm test:integration
```

### 3. Contract Tests

**Run**: `pnpm test:contract`

Validates API contracts against JSON schemas.

```bash
pnpm test:contract
```

**Purpose**:
- Ensure API responses match schemas
- Prevent breaking changes
- Validate request/response formats

### 4. E2E Tests (Playwright)

**Location**: `e2e/tests/`

**Run**: `pnpm test:e2e`

Browser automation testing user workflows.

```bash
# Install browsers (first time)
npx playwright install

# Run all E2E tests
pnpm test:e2e

# Run with UI
npx playwright test --ui

# Run specific test
npx playwright test e2e/tests/user-journey.spec.ts

# Debug test
npx playwright test --debug

# Show report
npx playwright show-report
```

**User Scenarios to Test**:

| Scenario | File | Description |
|----------|------|-------------|
| Idea Generation | `idea-generation.spec.ts` | Create idea through dialogue |
| Concept Mapping | `concept-map.spec.ts` | Build and navigate concept maps |
| Claim Validation | `claim-validation.spec.ts` | Validate and review claims |
| Artifact Export | `artifact-export.spec.ts` | Export structured artifacts |
| Fact vs Hypothesis | `claim-classification.spec.ts` | Distinguish fact/hypothesis |
| Metaphor Detection | `metaphor-detection.spec.ts` | Identify metaphor-only claims |

### 5. AI Evaluation Tests

**Run**: `pnpm test:ai`

Specialized tests for AI behavior and prompt safety.

```bash
# Run all AI evals
pnpm test:ai

# Check claim safety
pnpm test:claim-safety

# Check for fairy tale violations
pnpm test:no-fairy-tale

# Prompt regression tests
pnpm test:prompt-regression
```

**What They Test**:
- Hallucination detection
- Metaphor vs fact classification
- Claim safety validation
- Prompt regression (no behavior drift)

### 6. Visual Tests

**Run**: `pnpm test:visual`

UI regression testing with screenshots.

```bash
pnpm test:visual
```

### 7. Accessibility Tests

**Run**: `pnpm test:a11y`

WCAG compliance checking.

```bash
pnpm test:a11y
```

### 8. Security Tests

**Run**: `pnpm test:security`

Vulnerability scanning and security checks.

```bash
pnpm test:security
```

## Writing Tests

### Unit Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { myFunction } from '../src/my-module';

describe('myFunction', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should handle valid input', () => {
    const result = myFunction('valid');
    expect(result).toBe('expected');
  });

  it('should throw on invalid input', () => {
    expect(() => myFunction('')).toThrow('Invalid input');
  });
});
```

### E2E Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('user can create concept map', async ({ page }) => {
  // Navigate to app
  await page.goto('/');

  // Start new session
  await page.getByRole('button', { name: 'New Session' }).click();

  // Enter idea
  await page.getByRole('textbox').fill('How does memory work?');
  await page.getByRole('button', { name: 'Send' }).click();

  // Verify response appears
  await expect(page.getByTestId('dialogue-response')).toBeVisible();

  // Open concept map
  await page.getByRole('button', { name: 'Concept Map' }).click();

  // Verify map is generated
  await expect(page.getByTestId('concept-map')).toBeVisible();
});
```

### AI Eval Structure

```typescript
import { describe, it, expect } from 'vitest';
import { evaluateClaimSafety } from '@avg/evals';

describe('Claim Safety Evals', () => {
  it('should flag metaphor presented as fact', async () => {
    const result = await evaluateClaimSafety({
      claim: 'The brain is a neural network',
      context: 'casual discussion',
      status: 'fact'
    });

    expect(result.risk).toBe('high');
    expect(result.flags).toContain('metaphor-as-fact');
  });
});
```

## Test Coverage

### View Coverage

```bash
# Run tests with coverage
pnpm test -- --coverage

# View coverage report
open coverage/index.html
```

### Coverage Requirements

See `.qoder/03-quality-gates/definition-of-done.md` for coverage thresholds.

## CI/CD Testing

### PR Gate

Every pull request must pass:

1. ✅ Lint
2. ✅ Typecheck
3. ✅ Unit tests
4. ✅ Build
5. ✅ Contract tests
6. ✅ Backlog update check

### Agent Branches

For branches starting with `agent/`:

- Auto-merge when all checks pass
- Cannot merge if backlog not updated
- Tests run on every commit

## Common Scenarios

### Testing AI Prompts

1. Add test case to `tests/ai-evals/`
2. Run `pnpm test:ai`
3. Update prompt if needed
4. Re-run evals to verify fix

### Testing New API Endpoint

1. Write contract test in `apps/api/tests/`
2. Add unit tests for business logic
3. Add integration test if using DB
4. Run `pnpm test:contract`

### Testing UI Component

1. Add component test in `apps/web/tests/components/`
2. Add E2E test for user workflow
3. Add visual test if UI changed
4. Run `pnpm test` and `pnpm test:visual`

### Testing Prompt Changes

**MANDATORY**: Prompt changes are production changes.

1. Update or add eval cases
2. Run `pnpm test:ai`
3. Run `pnpm test:no-fairy-tale`
4. Run `pnpm test:claim-safety`
5. Document expected behavior change in PR

## Troubleshooting

### Tests Fail Locally but Pass in CI

```bash
# Clear cache
pnpm clean
pnpm install

# Run tests fresh
pnpm test --no-cache
```

### Playwright Browsers Missing

```bash
npx playwright install
npx playwright install-deps
```

### Database Tests Failing

```bash
# Ensure database is running
docker compose up -d postgres

# Check connection
psql -U avg -h localhost -d avg -c 'SELECT 1'

# Run migrations if needed
cd apps/api && pnpm db:migrate
```

### AI Evals Failing

```bash
# Check OPENAI_API_KEY is set
cat .env | grep OPENAI_API_KEY

# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Test Data & Fixtures

### Location

- `tests/fixtures/` — Shared test data
- `tests/ai-evals/` — AI evaluation fixtures
- `e2e/fixtures/` — Playwright test helpers

### Creating Fixtures

```typescript
// tests/fixtures/sample-claim.ts
export const sampleClaim = {
  id: 'claim-001',
  text: 'Memory works like a library',
  status: 'metaphor',
  risk: 'low',
  sources: []
};
```

### Using Fixtures

```typescript
import { sampleClaim } from '../../../tests/fixtures/sample-claim';

it('should validate claim', () => {
  const result = validateClaim(sampleClaim);
  expect(result.valid).toBe(true);
});
```

## Performance Testing

### Run Benchmarks

```bash
pnpm test:bench
```

### Load Testing

```bash
# Install k6 or similar
# See scripts/load-test/ for configuration
```

## Best Practices

1. **Test behavior, not implementation** — Tests should survive refactoring
2. **One assertion per test** — Clear failure messages
3. **Use descriptive test names** — What should happen, not what code does
4. **Keep tests fast** — Unit tests < 100ms each
5. **Avoid flaky tests** — No timing dependencies, mock external services
6. **Test edge cases** — Empty input, max size, invalid data
7. **AI tests must include negative cases** — What should NOT happen
8. **Never test against production** — Use test databases and mock services

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [AVG Product Principles](.qoder/00-fundamentals/product-principles.md)
- [Definition of Done](.qoder/03-quality-gates/definition-of-done.md)
