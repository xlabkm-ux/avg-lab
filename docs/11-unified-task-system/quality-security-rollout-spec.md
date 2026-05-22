# Specification: Quality, Security And Rollout

**Status:** Draft
**Covers:** UTS-0, AVG-UTS-106, AVG-UTS-207, AVG-UTS-306, AVG-UTS-407, AVG-UTS-603, AVG-UTS-701 through AVG-UTS-707

## Purpose

Make the Unified Task System safe, testable and rollback-friendly.

## Mandatory Gates

For code:

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm test:contract
pnpm build
```

For AI behavior changes:

```powershell
pnpm test:ai
pnpm test:prompt-regression
pnpm test:no-fairy-tale
pnpm test:claim-safety
```

For UI:

```powershell
pnpm test:e2e
pnpm test:visual
pnpm test:a11y
```

## E2E Scenarios

Required:

- MVP-5 closure: project -> dialogue -> document -> retrieval -> map -> artifact;
- task -> clarification -> resume -> answer;
- task -> guided choice -> selected pattern -> answer;
- missing evidence -> Documents suggestion;
- map ready -> Map suggestion;
- artifact ready -> Artifact suggestion;
- LLM unavailable -> deterministic fallback;
- invalid LLM output -> fail safe, no raw output;
- prompt injection in user input -> blocked or safely bounded;
- prompt injection in retrieved source -> treated as source text only;
- admin trace visible without secrets.

## Security Requirements

- Prompt injection guard runs before LLM prompt assembly.
- Retrieved source snippets are untrusted content.
- Tool permissions are enforced outside the LLM.
- Red-zone tools require action approval and are disabled in MVP.
- Admin trace redacts secrets and raw prompts by default.
- Raw LLM debug capture requires explicit debug mode.

## Eval Requirements

Add or update evals when:

- prompt text changes;
- model routing changes;
- intent taxonomy changes;
- adequacy criteria change;
- claim status generation changes;
- metaphor/model boundary behavior changes.

Minimum eval sets:

- intent classification;
- no-fairy-tale;
- metaphor-only boundary;
- unsupported claim handling;
- source-grounding separation;
- refusal/product-boundary handling.

## Rollout Plan

Recommended sequence:

1. Finish MVP-5 closure.
2. Add contracts and schema fixtures.
3. Add graph engine behind feature flag.
4. Add LLM provider disabled by default.
5. Enable deterministic graph path.
6. Enable LLM intent classifier in local/dev only.
7. Add Task Run UI and admin trace.
8. Add seed patterns.
9. Enable unified endpoint for Dialogue.
10. Run E2E, evals and release review.

## Feature Flags

```env
AVG_UNIFIED_DIALOGUE=false
AVG_STATE_GRAPH=false
AVG_LLM_ADAPTIVE=false
AVG_ADMIN_RUN_CONSOLE=false
AVG_ADAPTIVE_PATTERN_GENERATOR=false
```

Defaults:

- all new UTS capabilities disabled until phase acceptance;
- deterministic MVP-5 surfaces remain available.

## Rollback

- Disable `AVG_UNIFIED_DIALOGUE` to return to MVP-5 surfaces.
- Disable `AVG_LLM_ADAPTIVE` to stop provider calls.
- Disable `AVG_STATE_GRAPH` to route through deterministic legacy handlers.
- Hide Admin Run Console if trace output fails safety review.
- Keep Solution Library seed-only if adaptive generator fails quality gates.

## Documentation Requirements

Before release:

- user docs explain task-oriented workflow;
- developer docs explain graph, LLM boundary and Task Run;
- `.env.example` documents feature flags;
- known limitations include Russian-first dialogue and UI-only i18n;
- PR includes risks, rollback, tests and AI evals.

