# AVG Lab — Infrastructure Overview

## Architecture

AVG Lab is a monorepo built with **pnpm workspaces** and **Turborepo** for efficient builds and task orchestration.

```
┌─────────────────────────────────────────────────┐
│                   AVG Lab                        │
│                                                  │
│  ┌─────────────┐  ┌──────────┐  ┌────────────┐ │
│  │   @avg/web   │  │ @avg/api │  │ @avg/worker│ │
│  │  (React UI)  │  │(Express) │  │(Background)│ │
│  └──────┬───────┘  └────┬─────┘  └─────┬──────┘ │
│         │               │              │         │
│         └───────────────┼──────────────┘         │
│                         │                        │
│              ┌──────────┴──────────┐            │
│              │   @avg/core         │            │
│              │  (Business Logic)   │            │
│              └──────────┬──────────┘            │
│                         │                        │
│    ┌────────────────────┼────────────────────┐  │
│    │                    │                    │  │
│ ┌──┴──┐          ┌──────┴─────┐       ┌─────┴────┐
│ │@avg/graph│    │@avg/memory │     │@avg/retrieval│
│ └──────┘          └───────────┘       └──────────┘
└─────────────────────────────────────────────────┘
```

## Technology Stack

### Core

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 26.1.0 |
| Package Manager | pnpm | 9.15.0 |
| Build System | Turborepo | 2.9.14 |
| Language | TypeScript | 6.0.3 |
| Linting | ESLint | 10.4.0 |
| Formatting | Prettier | 3.8.3 |

### Frontend

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 19.0.0 |
| Build Tool | Vite | 6.0.5 |
| Visualization | ReactFlow | 11.11.4 |
| Testing | Vitest + Testing Library | 4.1.7 |

### Backend

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Express/Fastify | - |
| Database | PostgreSQL | 16 |
| Cache | Redis | 7 |
| Graph DB | Neo4j | 5 |
| ORM/Query | Drizzle/Prisma | - |

### Testing & QA

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Unit Testing | Vitest | Fast unit tests |
| E2E Testing | Playwright | Browser automation |
| AI Evals | Custom scripts | AI behavior validation |
| Contract Testing | JSON Schema | API contract validation |
| Visual Testing | Playwright | UI regression |
| Accessibility | axe-core | A11y checks |

### Observability

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Error Tracking | Sentry | Production errors |
| AI Observability | Langfuse | LLM tracing |
| Analytics | PostHog | Product analytics |
| Logging | Winston/Pino | Structured logs |

## Infrastructure Services

### 1. PostgreSQL (Primary Database)

- **Purpose**: Relational data storage
- **Version**: 16
- **Connection**: `postgresql://avg:avg@localhost:5432/avg`
- **Health Check**: `pg_isready -U avg -d avg`
- **Volume**: `postgres-data`

**Used For:**
- User accounts and sessions
- Project data and artifacts
- Claims and validation results
- Conversation history

### 2. Redis (Cache & Session Store)

- **Purpose**: Caching, rate limiting, sessions
- **Version**: 7
- **Connection**: `redis://localhost:6379`
- **Health Check**: `redis-cli ping`

**Used For:**
- API response caching
- Session storage
- Rate limiting counters
- Real-time pub/sub

### 3. Neo4j (Graph Database)

- **Purpose**: Knowledge graph and concept maps
- **Version**: 5
- **Connection**: `bolt://localhost:7687`
- **HTTP**: `http://localhost:7474` (Browser UI)
- **Health Check**: `cypher-shell -u neo4j -p password 'RETURN 1'`

**Used For:**
- Concept relationships
- Knowledge graphs
- Citation networks
- Semantic connections

## Package Structure

### Applications (`apps/`)

| Package | Port | Description |
|---------|------|-------------|
| `@avg/api` | 3000 | REST/GraphQL API |
| `@avg/web` | 5173 | React frontend |
| `@avg/worker` | - | Background jobs |
| `@avg/realtime-gateway` | - | WebSocket gateway |
| `@avg/storybook` | 6006 | Component library docs |

### Core Packages (`packages/`)

| Package | Purpose |
|---------|---------|
| `@avg/core` | Core business logic |
| `@avg/schemas` | JSON & database schemas |
| `@avg/validation` | Zod validators |
| `@avg/utils` | Shared utilities |
| `@avg/openai` | OpenAI client wrapper |
| `@avg/memory` | Conversation memory |
| `@avg/retrieval` | RAG pipeline |
| `@avg/graph` | Neo4j operations |
| `@avg/agents` | AI agent definitions |
| `@avg/claim-court` | Claim validation |
| `@avg/concept-forge` | Concept map generation |
| `@avg/evals` | Evaluation framework |
| `@avg/html-rendering` | Artifact rendering |
| `@avg/observability` | Monitoring & tracing |
| `@avg/security` | Security middleware |
| `@avg/testkit` | Testing utilities |
| `@avg/ui` | Shared UI components |
| `@avg/knowledge` | Knowledge base |

## Environment Configuration

### Required Variables

```bash
OPENAI_API_KEY=sk-proj-...       # OpenAI API key
DATABASE_URL=postgresql://...     # PostgreSQL connection
```

### Optional Variables

```bash
REDIS_URL=redis://...             # Redis connection
NEO4J_URI=bolt://...             # Neo4j connection
S3_ENDPOINT=...                  # S3-compatible storage
SENTRY_DSN=...                   # Error tracking
LANGFUSE_PUBLIC_KEY=...          # AI observability
LANGFUSE_SECRET_KEY=...
POSTHOG_KEY=...                  # Product analytics
```

See `.env.template` for full configuration reference.

## CI/CD Pipeline

### GitHub Actions Workflows

1. **PR Gate**
   - Lint
   - Typecheck
   - Unit tests
   - Build
   - Backlog update check

2. **Auto-Merge** (agent branches)
   - All checks pass
   - Branch name starts with `agent/`
   - Automatic merge and branch cleanup

3. **E2E Tests**
   - Runs on PR to main
   - Playwright test suite
   - Visual regression checks

### Local Development Workflow

```bash
# 1. Create feature branch
git checkout -b agent/frontend/AVG-123-new-feature

# 2. Make changes and test
pnpm test
pnpm lint
pnpm typecheck

# 3. Commit and push
git commit -m "feat(web): add new feature"
git push origin agent/frontend/AVG-123-new-feature

# 4. Create PR
gh pr create --fill

# 5. Auto-merge when checks pass
```

## Testing Infrastructure

### Test Pyramid

```
        ┌─────────────┐
        │   E2E Tests │   ← Playwright (few, slow, high-value)
        ├─────────────┤
        │Integration  │   ← API contracts, DB tests
        ├─────────────┤
        │  Unit Tests │   ← Vitest (many, fast, isolated)
        └─────────────┘
```

### Test Locations

| Location | Type |
|----------|------|
| `packages/*/tests/` | Unit tests |
| `apps/*/tests/` | App-specific tests |
| `tests/ai-evals/` | AI evaluation tests |
| `tests/fixtures/` | Test fixtures |
| `e2e/tests/` | E2E tests (Playwright) |

### Running Tests

```bash
# All tests
pnpm test

# Specific type
pnpm test:unit          # Unit only
pnpm test:integration   # Integration
pnpm test:contract      # Contract tests
pnpm test:e2e           # E2E (Playwright)
pnpm test:ai            # AI evals

# Specific package
cd packages/avg-validation && pnpm test
```

## Security

### Data Protection

- Environment variables stored in `.env` (gitignored)
- `.env.template` contains no secrets
- S3 credentials for production only
- API keys rotated regularly

### Application Security

- Input validation with Zod schemas
- SQL injection prevention (parameterized queries)
- XSS protection (React escapes by default)
- Rate limiting via Redis
- CORS configuration in API
- Helmet.js security headers

### See Also

- [SECURITY.md](./SECURITY.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [AGENTS.md](./AGENTS.md)

## Monitoring & Observability

### Development

- Console logging with structured format
- Turbo build cache visualization
- Test output in CI

### Production

- **Sentry**: Error tracking and stack traces
- **Langfuse**: LLM call tracing, token usage, latency
- **PostHog**: User behavior, feature flags, funnels
- **Health Checks**: `/health` endpoints for all services

## Backup & Recovery

### Database Backups

```bash
# PostgreSQL backup
pg_dump -U avg -h 83.166.253.250 avg_dev > backup_$(date +%Y%m%d).sql

# PostgreSQL restore
psql -U avg -h 83.166.253.250 avg_dev < backup_20260522.sql

# Neo4j backup (docker volume)
docker run --rm -v neo4j-data:/data -v $(pwd):/backup neo4j:5 neo4j-admin dump
```

### Important Data

- User accounts and projects (PostgreSQL)
- Knowledge graphs (Neo4j)
- Cached responses (Redis - can be cleared)
- Uploaded artifacts (S3)
