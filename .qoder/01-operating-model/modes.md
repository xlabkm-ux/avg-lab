# Codex Operating Model

## Modes of Work

### Local Mode

Use for:

- precise fixes;
- running tests locally;
- debugging small failures;
- reviewing diffs;
- editing prompts carefully.

### Cloud Mode

Use for:

- isolated feature tasks;
- writing tests;
- documentation expansion;
- refactoring a single package;
- preparing PRs.

### Subagent Mode

Use for explicit parallel work only.

Subagents are allowed when:

- tasks are independent;
- file ownership is clear;
- contracts are already frozen;
- each agent has a separate branch or task boundary.

## Core Rule

Do not optimize for agent count. Optimize for boundaries.

A small number of well-scoped agents is better than many agents editing shared code.
