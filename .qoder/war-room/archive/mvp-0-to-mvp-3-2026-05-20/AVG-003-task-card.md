# AVG-003 Task Card

```yaml
id: AVG-003
type: feature
owner_agent: backend
sprint: Sprint 0
parallel_safe: true
risk: medium
touches:
  - packages/avg-openai
depends_on:
  - AVG-001
blocked_by: []
expected_outputs:
  - TypeScript package configs
  - build scripts
  - package-level baseline tests
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
    - .qoder/war-room/sprint-backlog.md
    - .qoder/war-room/daily-agent-brief.md
    - packages/avg-openai/README.md
  max_files_to_open: 12
  context_status: green
  handoff_required_at: yellow
  compact_summary_required: true
model_budget:
  default_tier: standard
  default_model: gpt-5.4
  escalation_allowed: true
  escalation_requires_approval: true
  reason: "single-package TypeScript baseline with tests"
```

## Goal

Make `packages/avg-openai` executable as a TypeScript package for Sprint 0 without implementing Sprint 1 provider behavior.

## Expected Behavior

- Package has `package.json`, `tsconfig.json`, `src/index.ts` and a package-level test.
- Root `turbo` checks include `@avg/openai`.
- Public exports describe the adapter boundary as a skeleton only.

## Tests

- unit: `pnpm --filter @avg/openai test:unit`
- root: `pnpm test:unit`
- typecheck: `pnpm typecheck`
- lint: `pnpm lint`

## Done When

- Package-level and root checks pass.
- No provider calls, model routing policy or normalized error behavior is implemented before Sprint 1 `AVG-103`.
