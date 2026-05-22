# Codex Operating Model

Codex is used as an engineering teammate, not as an uncontrolled code generator.

## Use Codex For

- implementing isolated tasks;
- writing tests;
- generating docs;
- explaining codebase areas;
- refactoring with contracts;
- running eval repair loops.

## Do Not Use Codex For

- unsupervised security-sensitive changes;
- silent prompt rewrites;
- broad rewrites without ADR;
- production secrets;
- irreversible migrations without human review.

## Rule

Codex may draft. The repo decides through tests, contracts and review.
