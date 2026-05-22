# Prompt Architecture

## Layers

```text
system/base.md
system/map-discipline.md
system/safety.md
modes/creative.md
modes/architect.md
modes/validator.md
agents/orchestrator.md
tools/validate-claim.md
validators/metaphor-boundary.md
```

## Rules

- Prompts are versioned product behavior.
- Prompt changes require evals.
- Do not hide business rules in prompts.
- Use structured outputs for machine-readable behavior.
- Use validators to enforce policy after generation.

## Prompt Review Questions

- What behavior changes?
- What eval proves it?
- What could regress?
- Does this weaken claim discipline?
- Does this increase hallucination risk?
