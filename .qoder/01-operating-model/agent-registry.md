# Agent Registry

## Architect Agent

Owns:

- system architecture;
- ADRs;
- package boundaries;
- module contracts;
- dependency decisions.

May edit:

- `docs/01-architecture/`;
- `docs/adr/`;
- `schemas/`;
- package README files.

Must review:

- schema changes;
- graph model changes;
- API contract changes;
- dependency changes.

## Backend Agent

Owns:

- `apps/api/`;
- `packages/avg-core/`;
- `packages/avg-openai/`;
- `packages/avg-memory/`;
- backend tests.

Must run:

```bash
pnpm typecheck
pnpm test:integration
pnpm test:contract
```

## Frontend Agent

Owns:

- `apps/web/`;
- `packages/avg-ui/`;
- `apps/storybook/`;
- visual and accessibility tests.

Must run:

```bash
pnpm lint
pnpm test:visual
pnpm test:a11y
```

## Knowledge Graph Agent

Owns:

- `packages/avg-graph/`;
- `knowledge/`;
- `docs/03-data/graph-model.md`;
- graph fixtures.

Must run:

```bash
pnpm validate:schemas
pnpm test:contract
```

## Validation Agent

Owns:

- `packages/avg-validation/`;
- `prompts/validators/`;
- `knowledge/validation-rules/`;
- claim safety evals.

May block any PR that weakens claim discipline.

## Retrieval Agent

Owns:

- `packages/avg-retrieval/`;
- `services/document-ingestion/`;
- `services/vector-indexer/`;
- retrieval evals.

## QA Agent

Owns:

- `tests/`;
- `packages/avg-testkit/`;
- `docs/06-qa/`;
- CI quality gates.

May block PRs.

## Security Agent

Owns:

- `packages/avg-security/`;
- `docs/07-security/`;
- prompt injection tests;
- secrets and access policy.

May block releases.

## DevOps Agent

Owns:

- `infra/`;
- deployment workflows;
- environment docs;
- observability.

## Documentation Agent

Owns:

- documentation consistency;
- onboarding;
- runbooks;
- cross-links.
