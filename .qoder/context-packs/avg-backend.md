# Context Pack: Backend

Backend owns:

- sessions;
- projects;
- messages;
- artifacts;
- tool execution;
- OpenAI adapter;
- graph/retrieval/memory integration;
- observability events.

Every external provider call must go through an adapter with typed inputs and outputs.
