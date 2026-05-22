# Package Map

| Package | Responsibility |
|---|---|
| `avg-core` | shared types, errors, events, contracts |
| `avg-openai` | OpenAI API adapter, model routing, tool calling |
| `avg-agents` | mode router, orchestrator, agent roles |
| `avg-validation` | claim extraction, validation, risk classification |
| `avg-graph` | graph repositories and graph sync |
| `avg-retrieval` | ingestion, chunking, search, citations |
| `avg-memory` | project/session memory |
| `avg-ui` | reusable UI components |
| `avg-evals` | AI eval runner, datasets, judges |
| `avg-observability` | tracing, metrics, cost tracking |
| `avg-security` | auth, permissions, prompt injection defense |
| `avg-testkit` | fixtures, mocks, testing helpers |

## Dependency Direction

```text
apps -> packages
packages may depend on avg-core
avg-openai must not depend on app code
avg-validation must not depend on UI
avg-ui must not depend on backend packages
```
