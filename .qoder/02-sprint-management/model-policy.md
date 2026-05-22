# Model Policy

This policy controls model usage for AVG Codex agent work.

The project has limited resources, so agents must start with the lowest approved model tier that can safely complete the task. Agents must not silently escalate to a stronger model.

## Core Rule

Model choice is approved before a sprint or task starts.

An agent may request escalation, but must not continue on a stronger model until a human approves the escalation.

## Model Tiers

| Tier | Default Use | Recommended Model |
|---|---|---|
| `minimal` | docs, README updates, task cards, simple config, simple fixtures | `gpt-5.4-mini` |
| `standard` | normal single-package implementation, API handlers, UI components, unit tests | `gpt-5.4` or `gpt-5.3-codex` |
| `strong` | architecture, shared schemas, OpenAPI, validation logic, prompt behavior, security | `gpt-5.5` |
| `review` | final PR review, regression risk review, eval interpretation | `gpt-5.5` |

If a listed model is unavailable in the active environment, use the closest available model in the same tier and record the substitution in the task handoff.

## Task Card Budget

Every task card must include:

```yaml
model_budget:
  default_tier: minimal | standard | strong | review
  default_model: gpt-5.4-mini | gpt-5.4 | gpt-5.3-codex | gpt-5.5
  escalation_allowed: true | false
  escalation_requires_approval: true
  reason: "why this tier is enough"
```

## Escalation Rules

Escalation is allowed only when one of these conditions appears:

- task touches shared contracts unexpectedly;
- context status becomes `red`;
- AI behavior risk is higher than planned;
- security, migration or release risk appears;
- tests or evals reveal a design issue that the current tier cannot resolve confidently.

Escalation note must include:

- task id;
- current model tier;
- requested model tier;
- reason;
- expected cost/risk tradeoff;
- whether work should stop until approval.

## Automatic Downgrade Rule

When a task moves from design to routine documentation, formatting, fixture cleanup or small test updates, the next task should use a lower tier unless the sprint budget says otherwise.

## Prohibited Behavior

Agents must not:

- choose a stronger model silently;
- run broad exploration on `strong` without task approval;
- use `strong` for docs-only tasks;
- change model policy inside a feature PR;
- hide model substitutions from handoff notes.

## Sprint Approval

Each sprint backlog must include a model budget table.

Approving the sprint approves the listed default model for each task. Any stronger model requires an escalation note and human approval.
