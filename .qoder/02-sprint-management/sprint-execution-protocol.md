# Sprint Execution Protocol

This is the single operating protocol for executing any AVG sprint.

## Purpose

Keep sprint work ordered, model-approved and mergeable without requiring a hand-built plan for every future sprint.

## Source of Truth

Sprint execution is driven by, in this order:

1. the approved development plan;
2. the sprint backlog;
3. the current daily agent brief;
4. the task card for the active task;
5. the model policy.

If any lower-level instruction conflicts with a higher-level one, the higher-level source wins.

## Sprint Activation Rule

Only one sprint is active at a time.

- The active sprint is the first sprint whose gate is not fully done.
- Future sprints stay deferred until the current sprint exit criteria are met.
- Agents must not self-activate a later sprint just because its tasks are listed in the backlog.

## Task Ordering Rule

Inside the active sprint, execute tasks in the approved backlog order unless a task is explicitly blocked.

- Contract gates come first.
- Implementation tasks start only after their required contract gate is `done`.
- QA tasks start after the behavior they verify exists or is contractually frozen.
- If a task has `blocked_by`, that blocker must be cleared before work continues.

## Model Assignment Rule

Before a task enters `in progress`, the responsible agent must record:

- task id;
- sprint id;
- approved default model;
- selected runtime model;
- any escalation note if the selected model is stronger than approved.

No silent model substitution is allowed.

## Parallelism Rule

Parallel work is allowed only when all of the following are true:

- the task is already in the approved backlog;
- the task is marked parallel-safe;
- the required contracts are stable;
- the task belongs to the active sprint;
- the task does not depend on an unfinished earlier gate.

If any condition fails, the task is sequential.

## Git Rule

Each task is delivered as:

- one branch;
- one task card;
- one PR;
- one set of tests or evals appropriate to the change.

Merge order follows dependency order, not branch creation order.

## Completion Rule

A sprint is complete only when:

- every task in that sprint is `done`;
- exit criteria are verified;
- progress board and daily brief reflect the final state;
- no task remains deferred because of an unresolved gate inside the active sprint;
- **project backlog updated** with Actual Tokens, Variance, and Status per [backlog-update-regulation.md](backlog-update-regulation.md).

## Stop Rule

If a task is blocked:

- stop on that task;
- do not jump to a later sprint;
- update the progress board with the blocker;
- wait for re-planning or contract approval.
