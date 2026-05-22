# AGENTS.md

## Mission

You are working inside **AVG Codex Lab**.

AVG is a creative dialogue system that helps users generate ideas, build concept maps, validate claims, distinguish fact from hypothesis, distinguish metaphor from model, and transform raw thinking into structured artifacts.

This repository is designed for Codex App, Codex CLI, Codex Cloud, IDE usage, and parallel subagent workflows.

## Quick Navigation

Before editing code or documentation:

1. **Read the fundamentals:** [.qoder/00-fundamentals/](.qoder/00-fundamentals/)
2. **Understand operating model:** [.qoder/01-operating-model/](.qoder/01-operating-model/)
3. **Check active sprint:** [.qoder/war-room/sprint-backlog.md](.qoder/war-room/sprint-backlog.md)
4. **Review strategic roadmap:** [.qoder/specs/avg-leadership-roadmap.md](.qoder/specs/avg-leadership-roadmap.md)
5. **Read relevant protocols:** [.qoder/02-sprint-management/](.qoder/02-sprint-management/)
6. **MANDATORY: Update project backlog** after completing any task per [backlog-update-regulation.md](.qoder/02-sprint-management/backlog-update-regulation.md)
7. **Inspect related tests and schemas**
8. **Make the smallest coherent change**
9. **Add or update tests/evals**
10. **Document risks and rollback in the PR** (see [PR template](.qoder/templates/pr-template.md))

## Core Principles

See complete product principles: [.qoder/00-fundamentals/product-principles.md](.qoder/00-fundamentals/product-principles.md)

**Summary:**
- AVG must never behave like a simple chatbot wrapper
- Preserve scope, claim status, language mode, access mode, validation risk, map/territory boundary
- Never present metaphor as fact
- Never hide uncertainty behind impressive language

## Standard Commands

Use these commands unless a task says otherwise:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm test:contract
pnpm test:ai
pnpm build
```

## Branch Naming

```text
agent/<role>/<ticket-id>-<short-slug>
```

Examples:

```text
agent/frontend/AVG-142-map-panel
agent/validator/AVG-219-claim-risk-engine
agent/evals/AVG-301-regression-suite
```

## Commit Style

Use Conventional Commits:

```text
feat(validator): add metaphor-only claim status
fix(api): prevent empty project memory update
test(evals): add hallucination regression case
docs(adr): record graph database decision
```

## Pull Request Requirements

Every PR must follow the template: [.qoder/templates/pr-template.md](.qoder/templates/pr-template.md)

Required sections:
- purpose
- changed areas
- screenshots if UI changed
- tests run
- AI evals run if prompt or model behavior changed
- risks
- rollback plan
- affected agents
- migration notes if any

## Parallel Work Rules

See complete policy: [.qoder/02-sprint-management/parallel-work-policy.md](.qoder/02-sprint-management/parallel-work-policy.md)

**Summary:**
- One agent, one task, one branch, one PR
- Do not allow multiple agents to change shared schemas, migrations, prompts, or security controls without an Architect/QA/Security owner

## Forbidden

Do not:
- rewrite unrelated code
- silently change public contracts
- introduce untyped JSON
- add prompt text without evals
- bypass validators
- create new dependencies without justification
- merge generated code without review
- hide business logic inside prompts when it belongs in schemas or validators

## Quality Philosophy

See complete guidelines: [.qoder/03-quality-gates/definition-of-done.md](.qoder/03-quality-gates/definition-of-done.md)

**Summary:**
- Prompt changes are production changes
- AI behavior must be tested
- Schemas are contracts
- Docs are part of the product
- **Backlog updates are mandatory** — no work is complete until [project-backlog.md](docs/88-project-plan/project-backlog.md) reflects actual token consumption

## Financial Control

All project work is tracked in [project-backlog.md](docs/88-project-plan/project-backlog.md) with token-based budgeting.

**Mandatory:** After completing any task, sprint, or phase, agents MUST update the backlog per [backlog-update-regulation.md](.qoder/02-sprint-management/backlog-update-regulation.md).

This is a financial control requirement enforced by Definition of Done gates and PR review.
