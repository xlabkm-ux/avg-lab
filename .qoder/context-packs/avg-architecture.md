# Context Pack: Architecture

AVG architecture:

- Frontend: Next.js + React + Tailwind + React Flow + Tiptap.
- Backend: Node.js + Fastify + TypeScript.
- AI: OpenAI Responses API + Structured Outputs + Function Calling.
- Memory: PostgreSQL + vector store + graph store.
- Graph: Neo4j.
- Jobs: BullMQ first, Temporal later.
- QA: Vitest, Playwright, AI evals, prompt regression.

Never mix OpenAI-specific code into business logic. Use `packages/avg-openai` as an adapter.
