# Contributing

## Development Flow

1. Pick a task card from `.qoder/task-templates/` or the project tracker.
2. Create a branch using `agent/<role>/<ticket>-<slug>`.
3. Read relevant context pack from `.qoder/context-packs/`.
4. Implement the smallest coherent change.
5. Add or update tests.
6. Run quality gates.
7. Open a PR with the provided template.

## Definition of Ready

A task is ready when:

- goal is clear;
- expected behavior is defined;
- target files are known;
- public contracts are identified;
- tests/evals are specified;
- dependencies and blockers are listed.

## Definition of Done

A task is done when:

- implementation is complete;
- tests are meaningful and pass;
- typecheck passes;
- relevant AI evals pass;
- docs are updated;
- risks and rollback are described;
- reviewers are assigned.

## Review Principles

Review for:

- correctness;
- simplicity;
- boundaries;
- test coverage;
- AI behavior drift;
- prompt injection risk;
- observability;
- rollback safety.
