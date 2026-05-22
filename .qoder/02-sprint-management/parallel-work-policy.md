# Parallel Work Policy

## Main Rule

One agent, one approved sprint task, one branch, one PR.

Agents may only work on items already approved in the sprint backlog and agent plan.
If a task is not in the plan, it is not parallel-safe, even if it looks independent.

## Parallel Safety Levels

### GREEN

Independent task. Safe to run in parallel only when it is already present in the approved sprint plan.

Examples:

- UI component in isolated folder;
- documentation update;
- test addition for isolated feature;
- package README update.

### YELLOW

Possible conflict. Requires owner check.

Examples:

- prompt wording;
- shared test fixtures;
- API handler using existing schema;
- UI state shared across features.

### RED

Shared contract. Do not parallelize without Architect approval.

Examples:

- JSON Schema changes;
- ClaimStatus enum;
- database migrations;
- graph model;
- public API.

### BLACK

Release/security/data-sensitive. Single owner only.

Examples:

- production secrets;
- deployment config;
- auth and permissions;
- destructive migrations;
- release branch.

## Conflict Procedure

1. Stop lower-priority task.
2. Identify files and contracts in conflict.
3. Architect Agent decides split/merge.
4. One agent becomes owner.
5. Other agents rebase after merge.

## Priority Order

1. Security hotfix.
2. Production bug.
3. Schema/contract migration.
4. Feature.
5. Refactor.
6. Docs.
