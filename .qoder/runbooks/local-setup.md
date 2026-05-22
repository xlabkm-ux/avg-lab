# Local Setup Runbook

1. Install Node.js 22+.
2. Install pnpm.
3. Copy `.env.example` to `.env`.
4. Start databases:

```bash
docker compose up -d
```

5. Install dependencies:

```bash
pnpm install
```

6. Run checks:

```bash
pnpm lint
pnpm typecheck
pnpm test
```
