# Model Strategy

## Model Routing

Use model routing by task type:

| Task | Model class |
|---|---|
| complex architecture | reasoning-heavy model |
| fast UX response | fast general model |
| code generation | Codex model/tooling |
| structured extraction | reliable structured-output model |
| voice | realtime model |

## Reasoning Effort

- Low: short UI answers and classifications.
- Medium: concept generation and editing.
- High: architecture, validation, research synthesis.

## Prompt Caching

Stable AVG instructions should be cache-friendly:

- base system behavior;
- claim policy;
- language modes;
- mode definitions;
- tool policies.

## Provider Boundary

All model calls go through `packages/avg-openai`.
