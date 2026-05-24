# Package Map

| Package | Responsibility | Status |
|---|---|---|
| `avg-core` | shared types, errors, events, contracts | ✅ Active |
| `avg-openai` | OpenAI API adapter, model routing, tool calling | ✅ Active |
| `avg-agents` | mode router, orchestrator, agent roles | ✅ Active |
| `avg-validation` | claim extraction, validation, risk classification | ✅ Active |
| `avg-graph` | graph repositories and graph sync | ✅ Active |
| `avg-retrieval` | ingestion, chunking, search, citations | ✅ Active |
| `avg-memory` | project/session memory | 🟡 Planned (interfaces only) |
| `avg-ui` | ~~reusable UI components~~ | ❌ Removed (absorbed by apps/web) |
| `avg-evals` | AI eval runner, datasets, judges | ✅ Active |
| `avg-observability` | tracing, metrics, cost tracking | 🟡 Planned |
| `avg-security` | auth, permissions, prompt injection defense | ✅ Active |
| `avg-testkit` | fixtures, mocks, testing helpers | ✅ Active |
| `avg-html-rendering` | server-safe HTML rendering (no React/browser APIs) | ✅ Active |
| `avg-utils` | shared utilities (normalizeText, dedupe, etc.) | ✅ Active |
| `avg-schemas` | JSON schemas + AJV validators | ✅ Active |

**Note:** `avg-ui` was removed on 2026-05-22. UI components are implemented directly in `apps/web/src/components/`. See `docs/90_archive/README.md` for archival policy.

## Dependency Direction

```text
apps -> packages
packages may depend on avg-core
avg-openai must not depend on app code
avg-validation must not depend on UI
avg-ui must not depend on backend packages
```
