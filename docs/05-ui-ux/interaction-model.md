# Interaction Model

AVG MVP-5 UI has seven main surfaces:

1. Dialogue — the live conversation.
2. Documents — local project evidence registration.
3. Retrieval — grounded questions, snippets and citations.
4. Claim Review — claims, risks, repairs and boundary notes.
5. Map — the structured concept graph.
6. Artifacts — useful exports and reports.
7. Workspace — project/session state and local-only status.

## User Flow

```text
project -> raw idea -> structured response -> claim review -> document -> retrieval -> map -> artifact -> next action
```

## UX Rule

Never make validation feel like punishment. It should feel like sharpening.

## Boundary Rule

Every route through the interface must preserve scope, claim status, language mode, validation risk and the map/territory boundary. Retrieval and map views show working evidence and projections, not Reality.
