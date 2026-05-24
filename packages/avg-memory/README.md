# @avg/memory — Repository Interfaces

**Status:** Interfaces defined (2026-05-22), Implementation pending  
**Version:** 0.1.0

## Purpose

Defines repository interfaces for AVG data persistence, abstracting over storage implementations (in-memory, PostgreSQL, Neo4j).

## Interfaces

| Interface | Purpose | Current Impl | Future Impl |
|-----------|---------|-------------|-------------|
| `ProjectRepository` | Project CRUD | In-memory (apps/api) | PostgreSQL |
| `SessionRepository` | Session CRUD | In-memory (apps/api) | PostgreSQL |
| `MessageRepository` | Message CRUD | In-memory (apps/api) | PostgreSQL |
| `DocumentRepository` | Document storage + search | In-memory (apps/api) | PostgreSQL + pgvector |
| `GraphRepository` | Node/edge operations | In-memory (apps/api) | Neo4j |

## Current State

All interfaces are defined but not yet used. The current implementation in `apps/api/src/core/` uses raw `Map` objects. The next step is to refactor the API to use these interfaces.

## Activation Criteria

1. When PostgreSQL/Neo4j persistence is required
2. When multiple storage backends need to be swapped
3. When data migration scripts are needed

## Usage (Future)

```typescript
import { ProjectRepository, ProjectRecord } from "@avg/memory";

// In-memory implementation (current)
import { createInMemoryProjectRepo } from "@avg/memory/in-memory";

// PostgreSQL implementation (future)
import { createPgProjectRepo } from "@avg/memory/postgres";

const repo = createInMemoryProjectRepo();
const project = await repo.create({ id: "1", name: "My Project" });
```
