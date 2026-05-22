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

## PR Automation Rule

**MANDATORY:** After completing a task and updating the backlog, agents MUST create a PR using the automation script:

### Script Usage

```bash
# Option 1: Commit and create PR in one command
make commit-and-pr MSG="feat(scope): description (AVG-XXX)"

# Option 2: Manual commit, then PR
git add -A && git commit -m "feat(scope): description (AVG-XXX)"
make pr
```

### Script Behavior

The script (`scripts/dev/create-pr.sh` or `scripts/dev/create-pr.bat`) automatically:
1. Extracts ticket ID from branch name (`agent/<role>/AVG-XXX-slug`)
2. Checks if PR already exists (skips if found)
3. Pushes branch to remote if not pushed
4. Creates PR with commit message as title and body
5. Outputs PR URL

### Auto-Merge

GitHub Actions workflow (`.github/workflows/auto-merge.yml`) automatically merges PRs when:
- PR is not a draft
- No failing checks
- Branch name matches `agent/*` pattern

Agents do NOT need to manually merge. The workflow handles it.

### Cross-Platform Support

- **Linux/macOS**: `scripts/dev/create-pr.sh` (bash)
- **Windows**: `scripts/dev/create-pr.bat` (cmd)
- **Makefile**: `make pr` auto-detects platform

## Completion Rule

A sprint is complete only when:

- every task in that sprint is `done`;
- exit criteria are verified;
- progress board and daily brief reflect the final state;
- no task remains deferred because of an unresolved gate inside the active sprint;
- **project backlog updated** with Actual Tokens, Variance, and Status per [backlog-update-regulation.md](backlog-update-regulation.md);
- **PRs created** for all tasks using `make pr` or `make commit-and-pr`;
- **auto-merge workflow enabled** and passing on all PRs.

### Task Completion Checklist

After completing each task:

1. [ ] Run quality gates (`pnpm lint && pnpm typecheck && pnpm test && pnpm build`)
2. [ ] Update backlog with Actual Tokens, Variance, Status
3. [ ] Commit changes with conventional commit message
4. [ ] Create PR using `make commit-and-pr MSG="..."` or `make pr`
5. [ ] Verify PR created and auto-merge enabled
6. [ ] Record PR number in task card notes

## Stop Rule

If a task is blocked:

- stop on that task;
- do not jump to a later sprint;
- update the progress board with the blocker;
- wait for re-planning or contract approval.

## Sprint Close Rule

When the project owner issues a **"close sprint"** command, the agent must perform an atomic sprint closure: commit, push, PR, merge, and clean up all intermediate branches. This is a single automated procedure — no manual steps required.

### Trigger

The sprint close procedure activates when the owner explicitly requests:

- "close sprint"
- "закрыть спринт"
- any equivalent unambiguous instruction

### Pre-Close Verification

Before performing closure, the agent must verify:

1. **Quality gates pass**: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`
2. **Backlog is updated**: all tasks have Actual Tokens, Variance, Status, and Notes in `project-backlog.md`
3. **Sprint backlog is updated**: exit criteria checked, status set to `completed` in `sprint-backlog.md`
4. **Working tree is clean**: no uncommitted changes from sprint work

If any check fails, the agent reports the specific failure and **does not** proceed with closure.

### Closure Procedure

The agent must execute these steps in order:

#### Step 1: Commit all remaining sprint work

```bash
git checkout -b agent/<role>/AVG-XXX-<sprint-slug>
git add -A
git commit -m "<conventional-commit-message> (AVG-XXX)"
```

If work is already committed to a task branch, skip branch creation and use the existing branch.

#### Step 2: Push branch to remote

```bash
git push -u origin <branch-name>
```

#### Step 3: Create Pull Request

Create a PR with:
- title: conventional commit message
- body: purpose, changed areas, tests run, risks, rollback plan, affected agents, migration notes
- base: `main`

```bash
gh pr create --base main --head <branch-name> --title "..." --body "..."
```

#### Step 4: Merge PR (squash merge)

```bash
gh pr merge <pr-number> --squash --delete-branch
```

#### Step 5: Switch to main and pull merged changes

```bash
git checkout main
git pull origin main
```

#### Step 6: Clean up all intermediate branches

Delete all local and remote branches created during the sprint that follow the `agent/*` pattern:

```bash
# Delete local branches
git branch --merged main | grep 'agent/' | xargs git branch -d

# Prune stale remote tracking branches
git remote prune origin

# Delete any remaining remote branches that were merged
git branch -r --merged origin/main | grep 'agent/' | sed 's|origin/||' | xargs -I{} git push origin --delete {}
```

#### Step 7: Verify clean state

```bash
git status
git branch -a
```

Confirm:
- on `main` branch
- working tree clean
- no `agent/*` branches remain (local or remote)

### Post-Close Report

After closure, the agent must output a summary:

- sprint id and title
- tasks completed (with ticket IDs)
- token budget vs actual
- PR numbers created and merged
- confirmation that all intermediate branches are deleted
