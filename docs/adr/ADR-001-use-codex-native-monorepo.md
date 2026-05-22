# ADR-001: Use Codex-Native Monorepo

## Status

Accepted

## Context

AVG requires coordinated work across frontend, backend, AI prompts, validation, graph data, retrieval, QA and documentation. Codex agents must be able to work in parallel without losing project discipline.

## Decision

Use a TypeScript-first monorepo with:

- root `AGENTS.md`;
- `.codex/` operating layer;
- package boundaries;
- strict schemas;
- AI evals;
- ADRs;
- quality gates.

## Alternatives

- Single app repository: simpler but poor boundaries.
- Multiple repositories: stronger isolation but too heavy for MVP.

## Consequences

Positive:

- Codex can navigate the entire system.
- Shared types and schemas are easy to coordinate.
- Agent work can be scoped by package.

Negative:

- Requires discipline around package dependencies.
- CI can become heavy if not optimized.

## QA Impact

Need package-level tests and root quality gates.

## Agent Impact

All agents must respect package ownership and parallel work policy.

## Rollback

Split packages into separate repos later if team size or compliance requires it.
