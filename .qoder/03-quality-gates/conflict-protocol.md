# Conflict Protocol

## When Conflict Happens

A conflict exists when two agents:

- touch the same shared schema;
- change the same prompt behavior;
- edit the same migration path;
- modify the same package public API;
- change the same QA threshold.

## Resolution

1. Freeze both PRs.
2. Ask Architect Agent for contract decision.
3. Ask QA Agent for regression impact.
4. Merge the smaller safe change first.
5. Rebase the other branch.
6. Add an ADR if the conflict reveals a design decision.
