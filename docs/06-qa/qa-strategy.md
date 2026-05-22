# QA Strategy

## Quality Philosophy

AVG combines deterministic software and probabilistic AI behavior. Both must be tested.

## Test Pyramid

```text
Manual exploratory testing
AI evals / LLM regression tests
E2E tests / Playwright
Integration tests / API / DB / graph
Contract tests / schema / tool contracts
Unit tests / pure logic
Static checks / types / lint / format
```

## Required Gates

Every PR:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:contract
pnpm build
```

AI behavior PR:

```bash
pnpm test:ai
pnpm test:no-fairy-tale
pnpm test:prompt-regression
```

UI PR:

```bash
pnpm test:visual
pnpm test:a11y
```

## Coverage Targets

| Area | Target |
|---|---:|
| validators | 95% |
| core packages | 90% |
| API | 85% |
| UI | 75% |
