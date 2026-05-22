# AVG Lab — Setup Guide

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment
cp .env.template .env
# Edit .env and add your OPENAI_API_KEY

# 3. Start database (optional, if using local PostgreSQL)
docker compose up -d postgres

# 4. Run the application
pnpm dev
```

## Prerequisites

| Tool | Version | Required |
|------|---------|----------|
| Node.js | >= 18 (v26.1.0 recommended) | Yes |
| pnpm | >= 9.12 | Yes |
| Docker | Latest | Optional (for local DB) |
| Git | Latest | Yes |

### Verify Prerequisites

```bash
node -v       # Should show v26.1.0 or higher
pnpm -v       # Should show 9.12.0 or higher
docker --version  # Should be installed if using local DB
```

## Step-by-Step Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd avg-lab
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs all workspace dependencies for the monorepo including:
- Core packages (@avg/core, @avg/utils, etc.)
- Applications (api, web, worker)
- Development tools (typescript, vitest, playwright)

### 3. Configure Environment

```bash
cp .env.template .env
```

Edit `.env` file and configure:

**Required:**
- `OPENAI_API_KEY` — Your OpenAI API key

**Database (already configured for your environment):**
- PostgreSQL: 83.166.253.250:5432
- Database: avg_dev
- User: avg
- Password: avg2026

**Optional:**
- Redis URL (for caching)
- Neo4j credentials (for graph database)
- Sentry DSN (for error monitoring)
- Langfuse keys (for AI observability)

### 4. Start Infrastructure (Optional)

If you want to run local services:

```bash
# Start PostgreSQL, Redis, and Neo4j locally
docker compose up -d

# Check services are running
docker compose ps

# View logs
docker compose logs -f postgres
```

### 5. Verify Setup

```bash
# Run type checking
pnpm typecheck

# Run linter
pnpm lint

# Run tests
pnpm test
```

### 6. Start Application

```bash
# Start all services in development mode
pnpm dev

# Or start specific app
cd apps/web && pnpm dev     # Frontend
cd apps/api && pnpm dev     # Backend API
cd apps/worker && pnpm dev  # Background worker
```

## Project Structure

```
avg-lab/
├── apps/                    # Applications
│   ├── api/                # Backend API server
│   ├── web/                # Frontend React application
│   └── worker/             # Background workers
├── packages/               # Shared packages
│   ├── avg-core/           # Core functionality
│   ├── avg-schemas/        # Database & API schemas
│   ├── avg-utils/          # Utilities
│   ├── avg-validation/     # Validation helpers
│   └── ...                 # Other packages
├── tests/                  # Test fixtures and evals
├── e2e/                    # End-to-end tests
├── prompts/                # AI prompts
├── schemas/                # JSON schemas
└── docs/                   # Documentation
```

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all packages |
| `pnpm lint` | Run ESLint on all packages |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run all unit and integration tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm test:ai` | Run AI evaluation tests |
| `pnpm clean` | Remove build artifacts |

## Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
cd packages/avg-validation && pnpm test

# Run tests in watch mode
pnpm test:unit
```

### E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
pnpm test:e2e

# Run with UI
npx playwright test --ui

# Run specific test
npx playwright test e2e/tests/
```

### AI Evaluations

```bash
# Run AI evals
pnpm test:ai

# Check claim safety
pnpm test:claim-safety

# Check for hallucination
pnpm test:no-fairy-tale
```

## Troubleshooting

### Build Fails with JSX Error

If you see `TSX/JSX` errors in `@avg/web`:

1. Check `apps/web/tsconfig.json` has:
   ```json
   {
     "compilerOptions": {
       "jsx": "react-jsx"
     }
   }
   ```

### Database Connection Error

```
Error: connect ECONNREFUSED 83.166.253.250:5432
```

- Check network connection to PostgreSQL server
- Verify credentials in `.env`
- Ensure PostgreSQL is running

### Module Not Found

```bash
# Reinstall dependencies
pnpm install

# Clean and rebuild
pnpm clean && pnpm build
```

### Playwright Browsers Not Installed

```bash
npx playwright install
npx playwright install-deps
```

## Next Steps

1. Read [AGENTS.md](./AGENTS.md) for development guidelines
2. Check [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution workflow
3. Review [SECURITY.md](./SECURITY.md) for security practices
4. See project documentation in `.qoder/` directory
