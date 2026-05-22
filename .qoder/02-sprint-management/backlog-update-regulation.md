# Backlog Update Regulation

**Status:** Mandatory  
**Applies to:** All agents (frontend, backend, validator, qa, security, devops, architect, docs)  
**Enforcement:** Definition of Done gate  
**Source:** [project-backlog.md](../../docs/88-project-plan/project-backlog.md)

---

## Core Principle

**No work is complete until the backlog reflects reality.**

Every agent must update the project backlog immediately after completing any work item. This is not optional. This is not "nice to have." This is a financial control requirement.

The backlog is the **single source of truth** for:
- Budget consumption (tokens spent)
- Progress tracking (what's actually done)
- Financial reporting (plan vs actual variance)
- Stakeholder visibility (what was delivered)

**If the backlog is stale, the project is blind.**

---

## When to Update the Backlog

Agents must update the backlog at **three mandatory checkpoints**:

### Checkpoint 1: After Task Completion (AVG-XXX)

**Trigger:** Individual task reaches Definition of Done

**Required within:** 5 minutes of marking task `done`

**What to update:**

```markdown
| AVG-XXX | Task description | 8,000 | 7,450 | -550 | completed | Brief note if variance >20% |
```

**Fields to fill:**

| Field | What to record | Example |
|-------|----------------|---------|
| **Actual Tokens** | Real token consumption from model usage | `7,450` |
| **Variance** | Calculate: `Actual - Plan` | `-550` (under budget) |
| **Status** | Change from `in_progress` → `completed` | `completed` |
| **Notes** | Required if variance exceeds ±20% of plan | `Lower than expected: reused existing component` |

**Variance explanation rules:**

- **Within ±20%**: No explanation needed, leave Notes as `—`
- **Exceeds +20% (over budget)**: MUST explain why more tokens were consumed
- **Exceeds -20% (under budget)**: MUST explain efficiency or scope reduction
- **Any blocker encountered**: MUST document in Notes

**Example updates:**

```markdown
<!-- GOOD: Clear variance explanation -->
| AVG-705 | Grounded retrieval flow | 8,000 | 11,200 | +3,200 | completed | Over budget: unexpected API response format required additional parsing logic |

<!-- GOOD: Under budget explained -->
| AVG-702 | Workspace shell | 8,000 | 5,800 | -2,200 | completed | Under budget: leveraged existing state management pattern |

<!-- BAD: Missing variance explanation when >20% -->
| AVG-703 | Dialogue surface | 10,000 | 14,500 | +4,500 | completed | — |
```

---

### Checkpoint 2: After Sprint Completion

**Trigger:** All tasks in sprint marked `completed`

**Required within:** 10 minutes of final task completion

**What to update:**

1. **Sprint Total Row** — Calculate actual totals:

```markdown
| **Спринт 1.2 Total** | | **18,000** | **19,350** | **+1,350** | | |
```

2. **Sprint Status** — Change from `in_progress` → `completed`:

```markdown
**Status:** completed
```

3. **Exit Criteria Checkboxes** — Mark all as checked:

```markdown
**Exit Criteria:**
- [x] User can submit raw thought and see structured response
- [x] Claim statuses visible with color coding
- [x] Grounded search returns results with citations
- [x] Unsupported claims displayed separately
```

4. **Этап Budget Summary** — Update phase-level totals:

```markdown
| Спринт | Plan Tokens | Actual Tokens | Variance |
|--------|-------------|---------------|----------|
| Спринт 1.1: Core Workspace | 16,000 | 15,200 | -800 |
| Спринт 1.2: Dialogue & Retrieval | 18,000 | 19,350 | +1,350 |
| Спринт 1.3: Validation & Map | 19,000 | — | — |
```

**Sprint completion validation:**

Before marking sprint complete, verify:
- [ ] All tasks in sprint show `completed` status
- [ ] All task Actual Tokens filled
- [ ] All task Variance calculated
- [ ] Sprint Total row updated with sum of actuals
- [ ] Exit criteria checkboxes all checked
- [ ] Этап summary table updated

---

### Checkpoint 3: After Этап (Phase) Completion

**Trigger:** All sprints in phase marked `completed`

**Required within:** 15 minutes of final sprint completion

**What to update:**

1. **Overall Project Budget Table** — Update phase actuals:

```markdown
| Этап | Description | Plan Tokens | Actual Tokens | Variance | % Complete |
|------|-------------|-------------|---------------|----------|------------|
| Этап 1 | MVP-5 Working Interface | 88,000 | 91,400 | +3,400 | 100% |
| Этап 2 | Technology Leadership | 43,000 | — | — | 0% |
```

2. **Grand Total Row** — Recalculate project totals:

```markdown
| **GRAND TOTAL** | **Full MVP-5 → Launch** | **157,000** | **91,400** | **+3,400** | **58%** |
```

3. **Summary Budget Table (top of document)** — Mirror totals:

```markdown
| Этап | Plan Tokens | Actual Tokens | Variance | Status |
|------|-------------|---------------|----------|--------|
| Этап 1: MVP-5 Interface | 88,000 | 91,400 | +3,400 | completed |
| Этап 2: Tech Leadership | 43,000 | — | — | pending |
```

4. **Change Log Entry** — Document completion:

```markdown
| Date | Change | Author | Approved By |
|------|--------|--------|-------------|
| 2026-05-22 | Initial draft created | Qoder | Pending review |
| 2026-06-15 | Этап 1 completed: 91,400 actual tokens (+3.9% variance) | [Agent Name] | [Budget Owner] |
```

5. **Risk Register Update** — Mark mitigated risks, add new ones discovered:

```markdown
| Risk | Impact | Probability | Mitigation | Owner | Status |
|------|--------|-------------|------------|-------|--------|
| Token consumption exceeds estimates | MEDIUM | MEDIUM | Track actuals weekly, adjust future sprint budgets | Budget Owner | **OBSERVED: +3.9% in Этап 1** |
```

**Этап completion validation:**

Before marking этап complete, verify:
- [ ] All sprints in этап show `completed` status
- [ ] All sprint Total rows filled with actuals
- [ ] Этап Budget Summary updated
- [ ] Overall Project Budget table updated
- [ ] Grand Total recalculated
- [ ] Summary Budget (top) updated
- [ ] Change Log entry added
- [ ] Risk Register reviewed and updated
- [ ] % Complete calculated accurately

---

## Token Tracking Rules

### How to Measure Token Consumption

Agents must track tokens using one of these methods (in priority order):

1. **Model API response** — Use `usage.total_tokens` from API response if available
2. **IDE token counter** — Use built-in token consumption display if available
3. **Estimation** — If exact count unavailable, estimate using:
   - Input tokens: count of context + system prompt + user messages
   - Output tokens: count of generated response
   - Formula: `total = input + output`

**Rounding rule:** Round to nearest 100 tokens for reporting simplicity.

**Example:**
```
Actual usage: 7,432 tokens
Reported: 7,400 tokens
```

### Multi-Model Tasks

If a task uses multiple models (e.g., GPT-5.4 for implementation + GPT-5.5 for review):

**Report combined total:**
```
Implementation: 5,200 tokens (GPT-5.4)
Review: 1,800 tokens (GPT-5.5)
Total: 7,000 tokens
```

**Add to Notes:**
```markdown
Notes: Used GPT-5.4 for implementation (5,200) + GPT-5.5 review (1,800)
```

### Agent Self-Correction Tokens

If agent made errors and required retries, **include all retry tokens** in Actual:

```
First attempt: 4,000 tokens (incorrect approach)
Second attempt: 3,500 tokens (corrected approach)
Total Actual: 7,500 tokens
```

**Add to Notes:**
```markdown
Notes: First attempt failed due to [reason]. Retry consumed additional 4,000 tokens.
```

This transparency enables:
- Accurate cost tracking
- Process improvement identification
- Future estimation calibration

---

## Status Values

Use only these status values. No custom statuses allowed.

| Status | Meaning | When to use |
|--------|---------|-------------|
| `pending` | Not yet started, awaiting sprint activation | Default for all future work |
| `in_progress` | Work has begun, not yet complete | Task actively being worked on |
| `completed` | Work finished, Definition of Done met | After all completion checkpoints pass |
| `blocked` | Cannot proceed due to external dependency | Name blocker in Notes |
| `deferred` | Postponed to future sprint/phase | Explain deferral reason in Notes |

**Forbidden patterns:**
- ❌ `done` (use `completed`)
- ❌ `in progress` (use `in_progress` with underscore)
- ❌ `todo` (use `pending`)
- ❌ `wip` (use `in_progress`)
- ❌ Any custom status not in table above

---

## Variance Analysis Rules

### Acceptable Variance Ranges

| Variance Range | Status | Action Required |
|----------------|--------|-----------------|
| -20% to +20% | **Normal** | No explanation needed |
| -50% to -21% | **Significant under** | Explain efficiency or scope reduction |
| +21% to +50% | **Significant over** | Explain complexity or blocker |
| <-50% or >+50% | **Critical** | Escalate to Budget Owner, re-estimate future tasks |

### Variance Calculation Formula

```
Variance = Actual Tokens - Plan Tokens
Variance % = (Variance / Plan Tokens) × 100
```

**Example:**
```
Plan: 8,000 tokens
Actual: 10,400 tokens
Variance: +2,400 tokens
Variance %: (+2,400 / 8,000) × 100 = +30% → Significant over, explanation required
```

### Pattern Detection

If **three consecutive tasks** in the same sprint show variance >+20%, agent must:

1. Stop and analyze estimation pattern
2. Add note to sprint summary: `Estimation calibration needed: systematic underestimation detected`
3. Flag for Budget Owner review before continuing
4. Adjust future task estimates upward by observed variance factor

**Example note:**
```markdown
Notes: Tasks AVG-702, AVG-703, AVG-704 all exceeded plan by 25-35%. Frontend UI work consistently underestimated. Recommend +30% adjustment for future UI tasks.
```

---

## Enforcement Mechanisms

### Definition of Done Integration

The following item is now **mandatory** in the Definition of Done for ALL tasks:

```markdown
- [ ] Project backlog updated with Actual Tokens, Variance, Status, and Notes (if required)
```

**This checkbox must be checked before:**
- Marking task `done`
- Creating PR
- Requesting review
- Moving to next task

### PR Template Integration

Every PR must include:

```markdown
## Backlog Update

- [ ] Task AVG-XXX updated in project-backlog.md
- [ ] Actual Tokens recorded: [number]
- [ ] Variance: [+/-number or "within ±20%"]
- [ ] Notes added: [yes/no]
```

**PR will be rejected** if:
- Backlog update checkbox unchecked
- Actual Tokens not recorded
- Variance >20% without explanation

### Automated Checks (Future)

When tooling is available:
- Pre-commit hook will verify backlog updates for modified task files
- CI will fail if backlog Actual Tokens remain `—` for completed tasks
- Dashboard will highlight stale backlog entries >1 hour old for in-progress tasks

---

## Agent Responsibilities by Role

### All Agents
- Update task-level Actual Tokens, Variance, Status, Notes
- Verify sprint Total row after completing last task in sprint
- Follow status naming conventions
- Report blockers immediately with Notes

### Architect Agent
- Validate sprint Total calculations
- Review variance patterns across sprint
- Flag systematic estimation issues
- Update Этап summary after sprint completion
- Maintain Change Log

### QA Agent
- Verify backlog updates match Definition of Done
- Cross-reference task completion with backlog status
- Flag discrepancies between code changes and backlog
- Validate exit criteria checkboxes

### Budget Owner (Human)
- Approve sprint token budgets before activation
- Review variance reports after sprint completion
- Adjust future estimates based on patterns
- Escalate critical variances (>+50% or <-50%)
- Sign off on Этап completion

---

## Common Scenarios and How to Handle Them

### Scenario 1: Task completed exactly on budget

```markdown
| AVG-702 | Workspace shell | 8,000 | 8,100 | +100 | completed | — |
```

**Action:** Fill Actual, Variance, change Status to `completed`. No Notes needed (within ±20%).

---

### Scenario 2: Task exceeded budget by 35%

```markdown
| AVG-705 | Grounded retrieval | 8,000 | 10,800 | +2,800 | completed | Over budget: API response format changed mid-implementation, required rework |
```

**Action:** Fill all fields, explain variance in Notes. Variance >20% requires explanation.

---

### Scenario 3: Task blocked by missing dependency

```markdown
| AVG-706 | Claim review panel | 7,000 | 2,100 | -4,900 | blocked | Blocked: waiting for AVG-703 validation pipeline completion. Partial work: scaffolded UI component. |
```

**Action:** Change Status to `blocked`, record partial Actual tokens consumed, explain blocker in Notes. Do NOT mark as completed.

---

### Scenario 4: Task deferred to next sprint

```markdown
| AVG-713 | UI polish pass | 5,000 | 0 | -5,000 | deferred | Deferred: sprint gate AVG-712 not met, prioritized quality gates over polish. Will complete in Sprint 1.4. |
```

**Action:** Change Status to `deferred`, Actual = 0 (no work done), explain deferral reason.

---

### Scenario 5: Sprint completed, all tasks done

**Before:**
```markdown
**Status:** in_progress

| Task ID | Описание | Plan | Actual | Variance | Status | Notes |
|---------|----------|------|--------|----------|--------|-------|
| AVG-701 | Contract freeze | 2,000 | — | — | in_progress | — |
| AVG-702 | Workspace shell | 8,000 | — | — | in_progress | — |
| AVG-704 | Document registration | 6,000 | — | — | in_progress | — |
| **Total** | | **16,000** | **—** | **—** | | |
```

**After (agent updates):**
```markdown
**Status:** completed

| Task ID | Описание | Plan | Actual | Variance | Status | Notes |
|---------|----------|------|--------|----------|--------|-------|
| AVG-701 | Contract freeze | 2,000 | 1,800 | -200 | completed | — |
| AVG-702 | Workspace shell | 8,000 | 7,400 | -600 | completed | — |
| AVG-704 | Document registration | 6,000 | 6,800 | +800 | completed | — |
| **Total** | | **16,000** | **16,000** | **0** | | |

**Exit Criteria:**
- [x] User can create a project in browser
- [x] User can register a local document and see it in the list
- [x] Workspace shell with navigation panels renders correctly
```

**Action:** Update all task rows, calculate Total row, change Status, check exit criteria.

---

## Audit Trail

### What Gets Logged

Every backlog update creates an audit trail via:

1. **Git commit history** — Changes to `project-backlog.md` tracked in version control
2. **Change Log section** — Manual entries in document for major milestones
3. **PR descriptions** — Backlog update checklist items

### Retention

Backlog history is retained for:
- **Active project duration** — Full history in main branch
- **Post-completion** — Archived in release tag
- **Financial audit** — Available for budget review at any time

---

## Non-Compliance Consequences

### First Offense
- **Action:** Warning comment on PR
- **Requirement:** Update backlog before PR can merge
- **Record:** Noted in PR review

### Second Offense
- **Action:** PR rejected, returned to agent
- **Requirement:** Update backlog AND add explanation to PR
- **Record:** Escalated to Architect Agent

### Third Offense
- **Action:** Agent flagged for process violation
- **Requirement:** Remediation training on backlog protocol
- **Record:** Reported to Budget Owner
- **Impact:** May affect agent task assignment priority

### Systemic Non-Compliance
- **Trigger:** >3 agents failing to update backlog in same sprint
- **Action:** Sprint completion blocked until backlog fully updated
- **Escalation:** Budget Owner notified, process review scheduled
- **Remediation:** May require automated enforcement tooling

---

## Quick Reference Card

**Print this and keep visible during work:**

```
┌─────────────────────────────────────────────────────┐
│          BACKLOG UPDATE CHECKLIST                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  AFTER TASK COMPLETION:                             │
│  □ Record Actual Tokens                             │
│  □ Calculate Variance (Actual - Plan)               │
│  □ Change Status → completed                        │
│  □ Add Notes if variance >±20%                      │
│  □ Check Definition of Done checkbox                │
│                                                     │
│  AFTER SPRINT COMPLETION:                           │
│  □ Calculate Sprint Total row                       │
│  □ Change Sprint Status → completed                 │
│  □ Check all Exit Criteria boxes                    │
│  □ Update Этап Budget Summary table                 │
│                                                     │
│  AFTER ЭТАП COMPLETION:                             │
│  □ Update Overall Project Budget table              │
│  □ Recalculate Grand Total                          │
│  □ Update Summary Budget (top of doc)               │
│  □ Add Change Log entry                             │
│  □ Review and update Risk Register                  │
│                                                     │
│  STATUS VALUES:                                     │
│  pending | in_progress | completed | blocked        │
│  | deferred                                         │
│                                                     │
│  VARIANCE RULES:                                    │
│  ±20%: No explanation needed                        │
│  >±20%: MUST explain in Notes                       │
│  >±50%: ESCALATE to Budget Owner                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Change History

| Date | Version | Change | Author | Approved By |
|------|---------|--------|--------|-------------|
| 2026-05-22 | 1.0 | Initial regulation created and approved | Qoder | Budget Owner, Architect Agent, QA Agent |

---

## Approval

This regulation requires approval from:

- [x] Budget Owner: **Approved** (2026-05-22)
- [x] Architect Agent: **Approved** (2026-05-22)
- [x] QA Agent: **Approved** (2026-05-22)

**Effective date:** 2026-05-22

**Review cycle:** Every 2 Этап completions or monthly, whichever comes first

---

## References

- [Project Backlog](../../docs/88-project-plan/project-backlog.md) — Master backlog document
- [Definition of Done](../03-quality-gates/definition-of-done.md) — Completion criteria
- [Task Protocol](task-protocol.md) — Task management rules
- [Sprint Execution Protocol](sprint-execution-protocol.md) — Sprint workflow
- [Parallel Work Policy](parallel-work-policy.md) — Parallel work rules
