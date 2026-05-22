# Local Development

## Prerequisites

- Node.js 22+;
- pnpm;
- Docker;
- OpenAI API key;
- optional: Codex App / Codex CLI.

## Setup

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm lint
pnpm typecheck
pnpm test
```

## Common Commands

```bash
pnpm dev
pnpm test:ai
pnpm validate:schemas
```
