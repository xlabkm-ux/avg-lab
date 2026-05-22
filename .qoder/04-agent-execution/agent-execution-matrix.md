# Agent Execution Matrix

This matrix defines how agents execute the active AVG sprint plan.

Sprint order, active sprint selection and task sequencing are defined in [../02-sprint-management/sprint-execution-protocol.md](../02-sprint-management/sprint-execution-protocol.md).

## Operating Rules

- One agent, one task, one branch, one PR.
- Agents must execute only tasks that exist in the approved sprint backlog and active agent plan.
- If no approved task is assigned, the agent must stop and request alignment instead of choosing new work.
- If requested work is outside the current sprint plan, the plan must be updated before implementation starts.
- Contract work is sequential.
- Implementation work is parallel only after contracts are stable.
- Red and black tasks require explicit owner approval before parallel work starts.
- Every task must include context budget and handoff status (see [context-budget.md](context-budget.md) and [handoff-protocol.md](handoff-protocol.md)).
- Every task must follow [../02-sprint-management/model-policy.md](../02-sprint-management/model-policy.md).

## Sequential Lanes

### Contract Lane

Owner: Architect Agent.

Includes:

- package boundaries;
- shared types;
- JSON Schema;
- OpenAPI;
- ADRs;
- dependency changes.

Rule: no implementation agent starts against a changing contract unless the task is marked as exploratory.

### AI Behavior Lane

Owner: Validation Agent with QA review.

Includes:

- prompt changes;
- structured output behavior;
- claim classification behavior;
- metaphor boundary behavior;
- No Fairy Tale Gate behavior.

Rule: prompt changes require evals and behavior ledger updates.

### Release Lane

Owner: QA Agent with DevOps support.

Includes:

- CI quality gates;
- release checklist;
- test reports;
- eval reports;
- rollback notes.

Rule: release gates can block any PR.

## Parallel Lanes

| Lane | Agent | Parallel When | Blocked By |
|---|---|---|---|
| API implementation | Backend | OpenAPI and core types are stable | contract changes |
| UI implementation | Frontend | response/API contract is stable or mocked | API shape changes |
| Validation rules | Validation | claim schema is frozen | schema changes |
| Test infrastructure | QA | target behavior is defined | missing contract |
| Docs/runbooks | Documentation | decision is accepted | unresolved decision |
| Local/CI tooling | DevOps | scripts are defined | package layout changes |

## Handoff Protocol

Before another agent continues a task, the current agent must provide:

- task id;
- sprint id;
- branch name;
- files changed;
- contracts touched;
- tests run;
- context status;
- model tier and model used;
- model escalation or substitution, if any;
- open risks;
- next recommended step.

## Context Status

| Status | Meaning | Required Action |
|---|---|---|
| green | bounded task, limited files | continue |
| yellow | broad context or multiple contracts | write handoff summary before edits continue |
| red | context overloaded or task too broad | stop and split task |

## Phase 4 Agent Allocation

| Milestone | Primary Agents | Review Agents |
|---|---|---|
| MVP-4 Retrieval and Documents | Architect, Backend, Retrieval, QA | Validation, Frontend, Security |
| AVG-601 Retrieval contract | Architect | Backend, Validation, QA |
| AVG-602 Document registration | Backend | Architect, QA |
| AVG-603 Chunking and search | Retrieval | Backend, QA |
| AVG-604 Grounded response composer | Backend, Validation | Architect, QA, Security |
| AVG-605 Citation panel and evals | Frontend, QA | Validation, Backend |

## Practical Resource Rule

If only one active human/Codex lane is available, run tasks in this order:

1. Architect contract task.
2. QA guardrail task.
3. Backend document boundary.
4. Retrieval implementation.
5. Validation behavior.
6. Frontend citation surface.
7. Documentation update.

This keeps the project moving without creating parallel conflict debt.

## Model Resource Rule

Use the lowest approved model tier that can safely complete the task.

Default mapping:

- Documentation Agent: `minimal`;
- DevOps Agent: `minimal` for routine config, `standard` for CI failures;
- Backend Agent: `standard`;
- Frontend Agent: `standard`;
- QA Agent: `standard`, `review` for eval interpretation;
- Architect Agent: `strong` for contracts, `standard` for routine docs;
- Validation Agent: `strong` for behavior and eval logic, `standard` for fixtures;
- Security Agent: `strong`.

Agents cannot escalate themselves. They must request approval before using a stronger model than the task budget.
