# Database Model

PostgreSQL stores product data.

## Core Tables

- users;
- workspaces;
- projects;
- sessions;
- messages;
- artifacts;
- tool_calls;
- eval_runs;
- audit_logs;
- source_documents;
- project_memory_items.

## Data Rule

PostgreSQL stores records. Neo4j stores semantic structure. Vector store stores retrieval chunks. Do not collapse all three into one database unless the project intentionally changes architecture through ADR.
