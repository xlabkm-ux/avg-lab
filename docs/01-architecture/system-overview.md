# System Overview

## Logical Architecture

```text
User
  -> Web / Voice UI
  -> API Gateway
  -> AVG Orchestrator
  -> OpenAI Adapter
  -> Tools
      -> Claim Validator
      -> Retrieval
      -> Graph Store
      -> Project Memory
  -> Response Composer
  -> UI Artifacts
```

## Runtime Components

- `apps/web`: user interface.
- `apps/api`: HTTP API and OpenAI orchestration endpoints.
- `apps/worker`: async jobs and indexing.
- `apps/realtime-gateway`: voice session gateway.
- `packages/avg-openai`: OpenAI integration boundary.
- `packages/avg-validation`: claim safety.
- `packages/avg-graph`: Neo4j integration.
- `packages/avg-retrieval`: document retrieval.
- `packages/avg-evals`: AI behavior tests.

## Architectural Rule

Business logic must not be hidden inside prompts. Prompts guide model behavior; schemas and validators enforce contracts.
