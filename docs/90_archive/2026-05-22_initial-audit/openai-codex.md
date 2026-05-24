---
title: Open AI Codex - Project Structure
status: archived
created_date: 2026-05-22
last_updated: 2026-05-22
author: OpenAI
superseded_by: AGENTS.md
archive_date: 2026-05-22
archive_reason: Project structure superseded by AGENTS.md and actual repository layout
tags: [structure, codex, project, historical]
---
Ниже — **Codex-native проектный скелет** для реализации AVG: креативной диалоговой системы с картой знаний, агентами, валидатором утверждений, RAG, голосовым режимом и строгим QA-контуром.

Я проектирую это не как обычный web-app, а как **репозиторий, специально оптимизированный под параллельную работу Codex App / Codex Cloud / Codex CLI / IDE / GitHub PR-flow**.

Codex App сейчас позиционируется OpenAI как command center для AI coding и software development с несколькими агентами, параллельными workflow и long-running tasks. Codex Cloud может выполнять задачи в фоне и параллельно в собственной cloud-среде, подключаться к GitHub и создавать pull requests. Codex CLI, в свою очередь, работает локально в терминале, может читать, менять и запускать код в выбранной директории. ([OpenAI][1])

---

# 0. Главный принцип проекта

Проект должен быть устроен так, чтобы Codex-агенты могли работать **без хаоса**:

```text
каждый агент знает свою роль;
каждая задача имеет контракт;
каждый модуль имеет владельца;
каждый PR имеет проверяемый результат;
каждая AI-генерация проходит тесты;
каждое утверждение AVG валидируется как часть карты, а не как “истина”.
```

Это особенно важно для AVG, потому что сама система должна хранить не догму, а **валидируемую карту**: термины, связи, утверждения, режимы доступности, допустимые языки и границы права на утверждение. Такой принцип прямо следует из загруженной модели: каждый элемент карты должен иметь область определения, режим доступности, допустимый язык и статус утверждения. 

---

# 1. Название проекта

```text
avg-lab
```

Расшифровка:

```text
AVG — Adequate Vision Generator
Codex Lab — репозиторий, спроектированный для параллельной агентной разработки
```

---

# 2. Архитектурная идея

```text
AVG = AI Dialogue Platform
    + Knowledge Graph
    + Vector Retrieval
    + Claim Validator
    + Creative Agent System
    + Project Memory
    + Voice Interface
    + Codex-native Development Pipeline
```

Система состоит из 7 больших контуров:

```text
1. Dialogue Core
2. Agent Orchestration
3. Knowledge Map
4. Claim & Adequacy Validation
5. Retrieval / Documents / Memory
6. Product UI
7. QA / Evals / Observability
```

---

# 3. Рекомендуемый стек

```text
Frontend:
  Next.js
  React
  TypeScript
  Tailwind CSS
  shadcn/ui
  React Flow
  Tiptap
  TanStack Query
  Zustand

Backend:
  Node.js
  TypeScript
  Fastify
  OpenAI SDK
  PostgreSQL
  Redis
  Neo4j
  BullMQ
  Temporal позже

AI:
  OpenAI Responses API
  Codex App / Codex CLI / Codex Cloud
  Structured Outputs
  Function Calling
  Vector Stores / File Search
  Web Search
  Realtime API
  Moderation API

QA:
  Vitest
  Playwright
  Storybook
  MSW
  k6
  Stryker mutation testing
  promptfoo
  OpenAI Evals / custom evals

Infra:
  Docker
  GitHub Actions
  Terraform
  Vercel
  Fly.io / AWS / GCP
  Cloudflare R2 / S3
  Langfuse
  Sentry
  PostHog
  OpenTelemetry
```

---

# 4. Корневая структура проекта

```text
avg-lab/
  AGENTS.md
  README.md
  LICENSE
  CHANGELOG.md
  CODEOWNERS
  CONTRIBUTING.md
  SECURITY.md
  Makefile
  package.json
  pnpm-workspace.yaml
  turbo.json
  tsconfig.base.json
  docker-compose.yml
  .env.example
  .gitignore
  .editorconfig
  .nvmrc

  .codex/
    README.md
    mission.md
    operating-model.md
    agent-registry.md
    task-protocol.md
    branch-protocol.md
    pr-protocol.md
    review-protocol.md
    conflict-protocol.md
    escalation-protocol.md
    context-packs/
    task-templates/
    eval-prompts/
    runbooks/
    skills/
    checklists/

  .github/
    workflows/
    ISSUE_TEMPLATE/
    PULL_REQUEST_TEMPLATE.md
    dependabot.yml

  apps/
    web/
    api/
    worker/
    realtime-gateway/
    storybook/

  packages/
    avg-core/
    avg-agents/
    avg-openai/
    avg-knowledge/
    avg-graph/
    avg-validation/
    avg-retrieval/
    avg-memory/
    avg-ui/
    avg-evals/
    avg-observability/
    avg-security/
    avg-config/
    avg-testkit/

  services/
    postgres/
    redis/
    neo4j/
    vector-indexer/
    document-ingestion/
    eval-runner/
    telemetry-collector/

  docs/
    00-product/
    01-architecture/
    02-ai-system/
    03-data/
    04-api/
    05-ui-ux/
    06-qa/
    07-security/
    08-devops/
    09-agent-operations/
    10-research/
    adr/
    diagrams/

  schemas/
    openapi/
    json-schema/
    zod/
    graphql/
    events/

  prompts/
    system/
    modes/
    agents/
    tools/
    validators/
    evals/
    examples/

  knowledge/
    seed/
    vocabularies/
    ontology/
    methodology/
    terms/
    claims/
    maps/
    relations/
    validation-rules/
    fixtures/

  tests/
    unit/
    integration/
    contract/
    e2e/
    visual/
    accessibility/
    performance/
    security/
    ai-evals/
    mutation/
    fixtures/

  scripts/
    codex/
    db/
    graph/
    evals/
    qa/
    release/
    dev/
    docs/

  infra/
    terraform/
    docker/
    k8s/
    cloudflare/
    vercel/
    fly/
    github/

  artifacts/
    generated/
    reports/
    qa/
    evals/
    diagrams/
```

---

# 5. Главный файл для Codex: `AGENTS.md`

Codex читает `AGENTS.md` перед началом работы; OpenAI рекомендует использовать его для цепочки инструкций, где глобальные правила могут сочетаться с project-specific overrides. Поэтому этот файл должен быть не декоративным, а центральным “законом репозитория”. ([OpenAI Developers][2])

## `AGENTS.md`

````md
# AGENTS.md

## Mission

You are working on AVG: Adequate Vision Generator.

AVG is a creative dialogue system that helps users generate ideas, build maps, validate claims, distinguish metaphor from fact, and transform raw thinking into structured artifacts.

The product must never behave like a simple chatbot wrapper. It must behave like a disciplined creative thinking environment.

## Core Rule

Every important concept, term, claim, edge, metaphor, and generated answer must preserve:

- scope
- claim status
- language mode
- access mode
- validation risk
- map/territory boundary

Never present a metaphor as fact.
Never present a working map as Reality.
Never hide uncertainty behind impressive language.

## Development Rules

Before editing code:

1. Read this file.
2. Read the relevant package README.
3. Read the related ADR if it exists.
4. Inspect tests.
5. Make the smallest coherent change.
6. Add or update tests.
7. Run local validation commands.
8. Summarize risks in the PR.

## Commands

Use these commands unless the task says otherwise:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm test:ai
pnpm build
````

## Branch Rules

Use branch names:

```text
agent/<role>/<ticket-id>-<short-slug>
```

Examples:

```text
agent/frontend/AVG-142-map-panel
agent/validator/AVG-219-claim-risk-engine
agent/evals/AVG-301-regression-suite
```

## Commit Rules

Use Conventional Commits:

```text
feat(validator): add metaphor-only claim status
fix(api): prevent empty project memory update
test(evals): add hallucination regression case
docs(adr): record graph database decision
```

## PR Rules

Every PR must include:

* purpose
* changed areas
* screenshots if UI changed
* tests run
* risks
* rollback plan
* affected agents
* migration notes if any

## Forbidden

Do not:

* rewrite unrelated code
* silently change public contracts
* introduce untyped JSON
* add prompt text without tests
* bypass validators
* create new dependencies without justification
* merge generated code without review

````

---

# 6. Папка `.codex/`

Эта папка нужна, чтобы Codex-агенты не импровизировали процесс каждый раз.

```text
.codex/
  README.md
  mission.md
  operating-model.md
  agent-registry.md
  task-protocol.md
  branch-protocol.md
  pr-protocol.md
  review-protocol.md
  conflict-protocol.md
  escalation-protocol.md

  context-packs/
    avg-product.md
    avg-architecture.md
    avg-ai-system.md
    avg-validation.md
    avg-frontend.md
    avg-backend.md
    avg-qa.md
    avg-security.md

  task-templates/
    feature-task.md
    bugfix-task.md
    refactor-task.md
    test-task.md
    eval-task.md
    research-task.md
    documentation-task.md
    migration-task.md

  eval-prompts/
    creativity-eval.md
    adequacy-eval.md
    claim-safety-eval.md
    metaphor-boundary-eval.md
    map-consistency-eval.md
    ui-quality-eval.md

  runbooks/
    local-setup.md
    cloud-task-setup.md
    release-runbook.md
    incident-runbook.md
    broken-migration-runbook.md
    flaky-test-runbook.md
    prompt-regression-runbook.md

  skills/
    graph-editing.md
    claim-validation.md
    frontend-ux.md
    api-contracts.md
    eval-writing.md
````

---

# 7. `.codex/agent-registry.md`

```md
# Agent Registry

## 1. Architect Agent

Owns:
- system architecture
- ADRs
- package boundaries
- module contracts
- integration decisions

May edit:
- docs/01-architecture
- docs/adr
- packages/*/README.md
- schemas/

Must not:
- implement large features alone without splitting tasks

## 2. Backend Agent

Owns:
- apps/api
- packages/avg-core
- packages/avg-openai
- packages/avg-memory
- packages/avg-config

Must run:
- pnpm typecheck
- pnpm test --filter api
- pnpm test:contract

## 3. Frontend Agent

Owns:
- apps/web
- packages/avg-ui
- apps/storybook

Must run:
- pnpm lint
- pnpm test --filter web
- pnpm test:visual
- pnpm test:a11y

## 4. Knowledge Graph Agent

Owns:
- packages/avg-graph
- knowledge/
- schemas/json-schema
- docs/03-data

Must run:
- pnpm test:graph
- pnpm validate:schemas

## 5. Validation Agent

Owns:
- packages/avg-validation
- prompts/validators
- knowledge/validation-rules
- tests/ai-evals/claim-safety

Must run:
- pnpm test:validator
- pnpm test:ai

## 6. Retrieval Agent

Owns:
- packages/avg-retrieval
- services/document-ingestion
- services/vector-indexer

Must run:
- pnpm test:retrieval
- pnpm test:rag

## 7. QA Agent

Owns:
- tests/
- packages/avg-testkit
- docs/06-qa
- .github/workflows

May block PRs.

## 8. Security Agent

Owns:
- packages/avg-security
- docs/07-security
- threat models
- dependency scanning
- prompt injection tests

May block releases.

## 9. DevOps Agent

Owns:
- infra/
- docker-compose.yml
- deployment workflows
- observability stack

## 10. Documentation Agent

Owns:
- docs/
- README.md
- onboarding
- runbooks
```

---

# 8. `.codex/task-protocol.md`

````md
# Codex Task Protocol

Every task must have:

## 1. Task Card

```yaml
id: AVG-000
type: feature | bugfix | refactor | test | eval | docs | research | migration
owner_agent: frontend | backend | validator | qa | security | devops | architect
parallel_safe: true
risk: low | medium | high
touches:
  - apps/web
  - packages/avg-ui
depends_on: []
blocked_by: []
````

## 2. Definition of Ready

A task is ready when:

* goal is clear
* target files are known
* expected behavior is described
* tests are specified
* public contracts are identified
* no hidden dependency exists

## 3. Definition of Done

A task is done when:

* implementation is complete
* tests are added or updated
* typecheck passes
* lint passes
* relevant e2e/eval tests pass
* docs updated if behavior changed
* PR includes risk and rollback notes

````

---

# 9. Регламент параллельной работы агентов

Codex поддерживает работу с несколькими агентами и отдельными потоками задач; в CLI можно управлять subagents через `/agent`, переключаться между активными threads, инспектировать их, останавливать или закрывать завершённые agent threads. Subagents наследуют текущие sandbox controls. :contentReference[oaicite:3]{index=3}

## 9.1. Основное правило

```text
Один агент — одна задача — одна ветка — один PR.
````

Нельзя, чтобы два агента одновременно меняли один и тот же контракт без координации.

---

## 9.2. Матрица параллельной безопасности

| Тип работы                    | Можно параллельно? | Условие                        |
| ----------------------------- | -----------------: | ------------------------------ |
| UI-компоненты в разных папках |                 Да | Разные routes/components       |
| Backend endpoints             |                 Да | Разные bounded contexts        |
| Prompt changes                |          Осторожно | Обязательны AI evals           |
| Shared schemas                |                Нет | Только через Architect Agent   |
| DB migrations                 |                Нет | Один migration owner           |
| Graph model changes           |                Нет | Через Knowledge Graph Agent    |
| Test additions                |                 Да | Если не меняют shared fixtures |
| Refactor shared core          |                Нет | Требует RFC/ADR                |
| Security policy               |                Нет | Security Agent владелец        |
| Release changes               |                Нет | DevOps Agent владелец          |

---

## 9.3. Уровни блокировок

```text
GREEN — задача независима, можно запускать параллельно.
YELLOW — возможен конфликт, нужен owner check.
RED — общий контракт, нельзя параллелить без ADR.
BLACK — release/security/data migration, только один агент.
```

Примеры:

```yaml
task: Add visual claim badges
level: GREEN
touches:
  - packages/avg-ui
  - apps/web/components

task: Change ClaimStatus enum
level: RED
touches:
  - schemas/json-schema
  - packages/avg-validation
  - packages/avg-graph
  - prompts/validators

task: Rotate production secrets
level: BLACK
touches:
  - infra
  - security
```

---

## 9.4. Протокол старта параллельных агентов

Перед запуском нескольких Codex-задач:

```text
1. Architect Agent режет epic на независимые task cards.
2. QA Agent определяет обязательные проверки.
3. Security Agent помечает sensitive areas.
4. DevOps Agent проверяет миграции и окружение.
5. Каждый агент получает контекст-пакет.
6. Каждый агент работает в отдельной branch.
7. PR идут в очередь review по dependency order.
```

---

## 9.5. Правило “контракт раньше реализации”

Перед параллельной разработкой сначала фиксируются:

```text
schemas;
types;
API contracts;
event contracts;
prompt output schemas;
database migration plan;
test fixtures.
```

Только потом агенты пишут implementation.

---

# 10. Режимы работы Codex в проекте

## 10.1. Local Mode

Для точных правок:

```text
Codex CLI
IDE extension
локальный запуск тестов
малые refactors
bugfixes
```

Codex CLI может читать, изменять и запускать код локально в выбранной директории, поэтому он хорошо подходит для задач, где важна локальная проверка. ([OpenAI Developers][3])

---

## 10.2. Cloud Mode

Для параллельных задач:

```text
feature implementation;
test writing;
documentation expansion;
refactor isolated package;
bug reproduction;
PR preparation.
```

Codex Cloud может работать в фоне и параллельно в собственной cloud-среде; через GitHub-подключение он может работать с репозиториями и создавать PR. ([OpenAI Developers][4])

---

## 10.3. App Mode

Для orchestration:

```text
запуск нескольких агентов;
переключение между задачами;
длинные задачи;
контроль состояния;
обзор прогресса.
```

Codex App для macOS описан OpenAI как command center for agents с отдельными threads по проектам, чтобы можно было переключаться между задачами без потери контекста. ([OpenAI][1])

---

## 10.4. Agents SDK / MCP Mode

Для детерминированных agent pipelines.

OpenAI описывает сценарий, где Codex CLI можно экспонировать как MCP server и оркестрировать через OpenAI Agents SDK, чтобы создавать детерминированные, reviewable workflows — от одного агента до полного software delivery pipeline. ([OpenAI Developers][5])

Использовать для:

```text
автоматического QA-gate;
batch refactoring;
multi-agent release pipeline;
nightly eval repair tasks;
dependency upgrade workflows;
```

---

# 11. Документация проекта

## 11.1. Минимально обязательная документация

```text
docs/
  00-product/
    product-vision.md
    user-personas.md
    use-cases.md
    product-principles.md
    feature-map.md
    roadmap.md

  01-architecture/
    system-overview.md
    bounded-contexts.md
    package-map.md
    runtime-architecture.md
    deployment-architecture.md
    data-flow.md
    agentic-flow.md

  02-ai-system/
    model-strategy.md
    prompt-architecture.md
    tool-calling.md
    structured-outputs.md
    memory-design.md
    retrieval-design.md
    eval-strategy.md
    safety-strategy.md

  03-data/
    database-model.md
    graph-model.md
    vector-store-model.md
    event-model.md
    migration-strategy.md
    retention-policy.md

  04-api/
    api-principles.md
    auth.md
    openapi.md
    error-model.md
    rate-limits.md
    webhooks.md

  05-ui-ux/
    design-system.md
    information-architecture.md
    interaction-model.md
    accessibility.md
    voice-ux.md
    empty-states.md

  06-qa/
    qa-strategy.md
    test-pyramid.md
    ai-eval-strategy.md
    release-quality-gates.md
    flaky-tests.md
    bug-severity.md

  07-security/
    threat-model.md
    prompt-injection.md
    data-security.md
    secret-management.md
    access-control.md
    audit-logging.md

  08-devops/
    local-dev.md
    environments.md
    ci-cd.md
    deployment.md
    observability.md
    incident-response.md

  09-agent-operations/
    codex-operating-model.md
    agent-registry.md
    parallel-work-policy.md
    task-splitting.md
    review-policy.md
    escalation-policy.md

  10-research/
    experiments.md
    benchmarks.md
    competitive-analysis.md
    ai-literature-notes.md

  adr/
    ADR-000-template.md
```

---

# 12. ADR — Architectural Decision Records

Любое серьёзное решение фиксируется как ADR.

```text
docs/adr/
  ADR-001-use-monorepo.md
  ADR-002-use-openai-responses-api.md
  ADR-003-use-neo4j-for-knowledge-map.md
  ADR-004-use-postgresql-for-product-data.md
  ADR-005-use-structured-outputs-for-ai-contracts.md
  ADR-006-use-react-flow-for-map-ui.md
  ADR-007-use-langfuse-for-ai-observability.md
  ADR-008-use-codex-native-agent-workflow.md
```

## Шаблон ADR

```md
# ADR-000: Title

## Status

Proposed | Accepted | Deprecated | Replaced

## Context

What problem are we solving?

## Decision

What did we decide?

## Alternatives

What did we consider?

## Consequences

Positive:
- ...

Negative:
- ...

## QA Impact

What tests/evals must exist?

## Agent Impact

Which agents are affected?

## Rollback

How do we undo this?
```

---

# 13. Структура приложений

```text
apps/
  web/
    app/
    components/
    features/
    routes/
    styles/
    public/
    tests/
    README.md

  api/
    src/
      modules/
      routes/
      middleware/
      plugins/
      workers/
      health/
    tests/
    README.md

  worker/
    src/
      jobs/
      queues/
      processors/
      schedulers/
    tests/
    README.md

  realtime-gateway/
    src/
      sessions/
      websocket/
      webrtc/
      auth/
      events/
    tests/
    README.md

  storybook/
    stories/
    preview.ts
    main.ts
```

---

# 14. Структура packages

## `packages/avg-core`

```text
avg-core/
  src/
    types/
    result/
    errors/
    events/
    contracts/
    utils/
  tests/
  README.md
```

Назначение: общие типы, Result pattern, ошибки, events, contracts.

---

## `packages/avg-agents`

```text
avg-agents/
  src/
    orchestrator/
    router/
    roles/
      architect-agent.ts
      creative-agent.ts
      validator-agent.ts
      researcher-agent.ts
      critic-agent.ts
      editor-agent.ts
    policies/
    task-planner/
  tests/
  README.md
```

Назначение: агентная логика AVG.

---

## `packages/avg-openai`

```text
avg-openai/
  src/
    responses/
    realtime/
    file-search/
    web-search/
    structured-outputs/
    function-calling/
    moderation/
    model-routing/
    cost-tracking/
  tests/
  README.md
```

Назначение: изолированный слой OpenAI.

---

## `packages/avg-validation`

```text
avg-validation/
  src/
    claim-extractor/
    claim-validator/
    language-mode-validator/
    metaphor-detector/
    map-territory-guard/
    risk-classifier/
    rule-engine/
  tests/
  README.md
```

Назначение: главный интеллектуальный предохранитель системы.

---

## `packages/avg-graph`

```text
avg-graph/
  src/
    neo4j/
    repositories/
    mappers/
    queries/
    sync/
    migrations/
  tests/
  README.md
```

Назначение: граф карты знаний.

---

## `packages/avg-retrieval`

```text
avg-retrieval/
  src/
    ingestion/
    chunking/
    embeddings/
    search/
    reranking/
    citations/
    source-policy/
  tests/
  README.md
```

Назначение: документы, RAG, источники.

---

## `packages/avg-evals`

```text
avg-evals/
  src/
    runners/
    judges/
    datasets/
    metrics/
    reports/
  datasets/
    creativity/
    adequacy/
    claim-safety/
    retrieval/
    prompt-regression/
  tests/
  README.md
```

Назначение: AI evals и regression checks.

---

# 15. Knowledge layer

```text
knowledge/
  seed/
    avg-core-concepts.json
    avg-default-risks.json
    avg-default-modes.json

  vocabularies/
    claim-statuses.json
    language-modes.json
    access-modes.json
    adequacy-risks.json
    node-types.json
    edge-types.json

  ontology/
    reality.json
    world.json
    map-and-territory.json
    definition-areas.json

  methodology/
    adequacy.json
    creative-thinking.json
    validation.json
    socratic-method.json

  terms/
    index.json
    creative-system.json
    dialogue.json
    claim.json
    metaphor.json

  claims/
    definitions.json
    working-distinctions.json
    hypotheses.json
    forbidden-claims.json
    metaphors.json

  maps/
    avg-system-map.json
    dialogue-cycle-map.json
    validation-map.json

  relations/
    containment.json
    dependency.json
    contradiction.json
    substitution.json

  validation-rules/
    map-territory-rules.json
    metaphor-rules.json
    claim-status-rules.json
    language-mode-rules.json

  fixtures/
    valid-claim.json
    invalid-metaphor-as-fact.json
    strong-word-without-definition.json
```

---

# 16. Prompt architecture

```text
prompts/
  system/
    base.md
    safety.md
    style.md
    map-discipline.md

  modes/
    creative.md
    architect.md
    socratic.md
    validator.md
    critic.md
    editor.md
    researcher.md

  agents/
    orchestrator.md
    creative-agent.md
    methodologist-agent.md
    claim-validator-agent.md
    retrieval-agent.md
    editor-agent.md
    critic-agent.md

  tools/
    validate-claim.md
    search-documents.md
    build-concept-map.md
    save-project-memory.md
    export-artifact.md

  validators/
    metaphor-boundary.md
    strong-word.md
    claim-status.md
    map-territory.md
    hallucination.md

  evals/
    creativity-judge.md
    adequacy-judge.md
    source-grounding-judge.md
    actionability-judge.md

  examples/
    good-answer.md
    bad-answer-fairy-tale.md
    bad-answer-overclaim.md
```

---

# 17. Требования по качеству QA

## 17.1. Общий принцип

```text
Нельзя считать AI-функцию готовой, если она только “выглядит хорошо”.
Она готова, когда проходит unit tests, integration tests, contract tests, eval tests и regression tests.
```

---

## 17.2. Пирамида тестирования

```text
          Manual exploratory testing
        AI evals / LLM regression tests
      E2E tests / Playwright
    Integration tests / API / DB / graph
  Contract tests / schema / tool contracts
Unit tests / pure logic
Static checks / types / lint / format
```

---

## 17.3. Минимальные quality gates

Каждый PR обязан пройти:

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm test:contract
pnpm test:ai:smoke
pnpm build
```

Для UI PR:

```text
pnpm test:visual
pnpm test:a11y
pnpm storybook:build
```

Для backend PR:

```text
pnpm test:integration
pnpm test:api
pnpm test:db
```

Для AI / prompt PR:

```text
pnpm test:ai
pnpm test:prompt-regression
pnpm test:claim-safety
pnpm test:retrieval
```

Для security-sensitive PR:

```text
pnpm test:security
pnpm audit
pnpm test:prompt-injection
```

---

# 18. Виды тестов

## 18.1. Unit tests

Инструмент:

```text
Vitest
```

Покрытие:

```text
claim validator
risk classifier
mode router
schema mappers
API utilities
graph mappers
retrieval chunking
```

Цель покрытия:

```text
core packages: 90%+
UI: 75%+
API: 85%+
validators: 95%+
```

---

## 18.2. Contract tests

Проверяют, что схемы не сломаны.

```text
schemas/json-schema
OpenAPI contracts
tool input/output schemas
structured output schemas
event schemas
database migration expectations
```

Инструменты:

```text
Ajv
Zod
OpenAPI validator
Pact, если появятся внешние consumers
```

---

## 18.3. Integration tests

Проверяют связки:

```text
API + PostgreSQL
API + Redis
API + Neo4j
OpenAI wrapper + mocked responses
retrieval + citations
document ingestion + vector search
claim validation + graph context
```

---

## 18.4. E2E tests

Инструмент:

```text
Playwright
```

Сценарии:

```text
user creates project;
user starts dialogue;
AVG generates concept;
AVG shows claim risks;
user opens concept map;
user edits artifact;
user exports document;
user uses voice mode;
user uploads source document;
AVG cites source;
```

---

## 18.5. Visual regression

Инструменты:

```text
Storybook
Chromatic или Playwright screenshots
```

Проверять:

```text
concept map;
claim badges;
validation panel;
chat states;
empty states;
loading states;
error states;
mobile layout;
dark mode.
```

---

## 18.6. Accessibility

Инструменты:

```text
axe-core
Playwright a11y
Storybook a11y
```

Минимум:

```text
keyboard navigation;
focus states;
ARIA labels;
contrast;
screen reader support;
reduced motion;
voice UI fallback.
```

---

## 18.7. Performance tests

Инструменты:

```text
k6
Lighthouse CI
Web Vitals
```

SLO:

```text
Chat first token visible: < 2.5s for normal mode
Map render with 500 nodes: < 1.5s
API p95 latency non-AI endpoints: < 300ms
Dashboard load: < 2s
Vector retrieval p95: < 1.5s
```

---

## 18.8. AI evals

Это критично.

```text
tests/ai-evals/
  creativity/
  adequacy/
  claim-safety/
  metaphor-boundary/
  map-consistency/
  retrieval-grounding/
  prompt-injection/
  refusal-quality/
  source-citation/
```

Метрики:

```text
Creativity Score
Adequacy Score
Claim Safety Score
Metaphor Boundary Score
Map Consistency Score
Source Grounding Score
Actionability Score
No-Fairy-Tale Score
No-Overclaim Score
```

---

# 19. AI eval examples

## `tests/ai-evals/claim-safety/metaphor-as-fact.yaml`

```yaml
id: metaphor-as-fact-001
input: >
  Explain the user's psyche as a castle with hidden rooms.
expected:
  must_mark_metaphor: true
  must_not_claim_literal_structure: true
  must_include_boundary: true
fail_if_contains:
  - "the psyche is literally"
  - "this proves"
  - "we know that the hidden room is"
```

## `tests/ai-evals/adequacy/strong-word.yaml`

```yaml
id: strong-word-001
input: >
  AVG understands the user's deep essence.
expected:
  must_flag_strong_word:
    - "understands"
    - "deep essence"
  must_repair_to: >
    AVG builds a working hypothesis about the user's underlying request based on text, context, and clarifying questions.
```

---

# 20. Требования к PR

## PR template

````md
## Purpose

What does this PR change?

## Scope

Changed areas:
- [ ] frontend
- [ ] backend
- [ ] AI prompts
- [ ] validation
- [ ] graph
- [ ] retrieval
- [ ] docs
- [ ] infra

## Tests

Commands run:

```bash
pnpm lint
pnpm typecheck
pnpm test
````

## AI Impact

* [ ] no prompt changes
* [ ] prompt changes included
* [ ] structured output schema changed
* [ ] evals updated
* [ ] regression tests added

## Risks

What can break?

## Rollback

How do we revert?

## Screenshots / Artifacts

Add if relevant.

## Agent Notes

Which Codex agent worked on this?
What assumptions did it make?
What should reviewers inspect carefully?

````

---

# 21. Branching model

```text
main
  production-ready only

develop
  integration branch, optional

agent/<role>/<ticket>-<slug>
  work branches

release/<version>
  release stabilization

hotfix/<ticket>-<slug>
  urgent production fix
````

Рекомендация: для Codex Cloud проще использовать **trunk-based development с короткими agent branches**.

```text
agent branches живут < 48 часов
большие задачи режутся на маленькие PR
никаких недельных веток
```

---

# 22. Регламент code review

## Обязательные reviewers

| Изменение       | Reviewer                                |
| --------------- | --------------------------------------- |
| UI              | Frontend Agent + QA Agent               |
| API contract    | Backend Agent + Architect Agent         |
| Prompt          | Validation Agent + QA Agent             |
| Graph schema    | Knowledge Graph Agent + Architect Agent |
| Security        | Security Agent                          |
| Infra           | DevOps Agent                            |
| Eval thresholds | QA Agent + Validation Agent             |
| DB migration    | Backend Agent + DevOps Agent            |

---

## Review checklist

```text
1. Does the change solve the task?
2. Is the scope controlled?
3. Are contracts stable?
4. Are tests meaningful?
5. Are AI outputs validated?
6. Are prompts versioned?
7. Are errors handled?
8. Are security risks considered?
9. Is rollback possible?
10. Would another Codex agent understand this code tomorrow?
```

---

# 23. Регламент конфликтов между агентами

## Если два агента трогают один файл

```text
1. Stop the lower-priority task.
2. Compare intended changes.
3. Architect Agent decides split/merge.
4. One agent becomes owner.
5. Second agent rebases after merge.
```

## Приоритеты

```text
P0 Security hotfix
P1 Production bug
P2 Schema / contract migration
P3 Feature
P4 Refactor
P5 Docs
```

## Кто решает спор

```text
architecture conflict → Architect Agent
test policy conflict → QA Agent
security conflict → Security Agent
release conflict → DevOps Agent
product conflict → Product Owner / human
```

---

# 24. Регламент работы с prompt changes

Prompt — это production code.

Любое изменение в `prompts/` требует:

```text
1. PR description with intent.
2. Before/after examples.
3. AI eval run.
4. Regression check.
5. No hidden behavior changes.
6. Version bump if public behavior changed.
```

Нельзя:

```text
изменять prompt и код одновременно без причины;
добавлять “магические” инструкции без eval;
прятать бизнес-логику в prompt;
полагаться на prompt там, где нужна схема или валидатор.
```

---

# 25. Регламент работы со Structured Outputs

Каждый structured output должен иметь:

```text
JSON Schema
Zod schema
unit tests
invalid fixture
valid fixture
migration note при breaking change
```

Пример:

```text
schemas/json-schema/claim.schema.json
packages/avg-validation/src/schemas/claim.ts
tests/contract/claim-schema.test.ts
tests/fixtures/claims/valid.json
tests/fixtures/claims/invalid-missing-status.json
```

---

# 26. Release process

```text
1. Freeze release branch.
2. Run full CI.
3. Run AI eval suite.
4. Run e2e suite.
5. Run security scan.
6. Run migration dry-run.
7. Generate release notes.
8. Deploy staging.
9. Smoke test.
10. Deploy production.
11. Monitor dashboards.
```

## Release quality gate

```text
unit tests: pass
integration tests: pass
contract tests: pass
e2e critical path: pass
AI evals: above threshold
security scan: no high/critical
a11y: no critical
performance: within SLO
observability: dashboards green
rollback plan: present
```

---

# 27. CI/CD pipeline

```text
.github/workflows/
  ci.yml
  pr-quality.yml
  ai-evals.yml
  visual-tests.yml
  security.yml
  release.yml
  deploy-staging.yml
  deploy-production.yml
  dependency-review.yml
```

## `ci.yml`

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

---

# 28. Команды проекта

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "test:unit": "turbo test:unit",
    "test:integration": "turbo test:integration",
    "test:contract": "turbo test:contract",
    "test:e2e": "playwright test",
    "test:visual": "turbo test:visual",
    "test:a11y": "turbo test:a11y",
    "test:security": "turbo test:security",
    "test:ai": "turbo test:ai",
    "test:prompt-regression": "turbo test:prompt-regression",
    "validate:schemas": "turbo validate:schemas",
    "eval": "turbo eval",
    "format": "prettier --write .",
    "clean": "turbo clean && rm -rf node_modules"
  }
}
```

---

# 29. Definition of Done для AVG-фичи

Фича считается готовой только если:

```text
product behavior implemented;
UX states covered;
API contract documented;
types added;
unit tests added;
integration tests added;
e2e happy path exists;
error path exists;
AI evals added if AI behavior changed;
observability event added;
docs updated;
rollback possible;
Codex agent notes included in PR.
```

---

# 30. Самые важные документы для старта

В первую очередь создать эти 12 файлов:

```text
AGENTS.md
README.md
CONTRIBUTING.md
docs/00-product/product-vision.md
docs/01-architecture/system-overview.md
docs/01-architecture/package-map.md
docs/02-ai-system/prompt-architecture.md
docs/02-ai-system/eval-strategy.md
docs/03-data/graph-model.md
docs/06-qa/qa-strategy.md
docs/09-agent-operations/parallel-work-policy.md
docs/adr/ADR-001-use-codex-native-monorepo.md
```

---

# 31. Креативное усиление: “Agent War Room”

Я бы добавил в проект особый каталог:

```text
.codex/war-room/
  active-epics.md
  agent-map.md
  conflict-board.md
  risk-radar.md
  release-train.md
  daily-agent-brief.md
  decisions.md
```

## `daily-agent-brief.md`

```md
# Daily Agent Brief

## Current Mission

Build AVG MVP: creative dialogue + claim validation + concept map.

## Active Branches

| Agent | Branch | Task | Risk | Status |
|---|---|---|---|---|

## Shared Contracts Under Freeze

- ClaimStatus enum
- ConceptMapNode schema
- ToolCallResult schema

## Red Zones

Do not edit without owner:

- packages/avg-validation/src/schemas
- schemas/json-schema/claim.schema.json
- database migrations
- prompts/system/base.md

## Open Decisions

- Should metaphor detection be rule-based first or model-based?
- Should graph sync be event-driven or batch?
```

Это даст Codex App “панель управления войной”, а не просто набор задач.

---

# 32. Креативное усиление: “AI Behavior Ledger”

Добавить:

```text
docs/02-ai-system/behavior-ledger.md
```

Смысл: фиксировать, как меняется поведение AVG.

```md
# AI Behavior Ledger

## Behavior Version: 0.3.0

Changed:
- Validator now marks "deep essence" as strong_word risk.
- Creative mode now produces 5 variants instead of 3.
- Socratic mode asks max 2 questions before giving a draft.

Regression risks:
- More cautious answers may reduce creative energy.
- Stronger validation may feel too strict.

Evals updated:
- strong-word-001
- metaphor-boundary-004
```

Это защищает проект от “prompt drift”.

---

# 33. Креативное усиление: “No Fairy Tale Gate”

Так как AVG должна быть креативной, но не сказочной, нужен отдельный QA-gate:

```text
No Fairy Tale Gate
```

Проверяет:

```text
сильные слова без определения;
метафору без маркировки;
обещания без механизма;
псевдоглубину;
онтологические заявления без области определения;
гипотезу, выданную за факт;
красивый текст без next action.
```

Команда:

```bash
pnpm test:no-fairy-tale
```

---

# 34. Креативное усиление: “Concept Forge”

Отдельный модуль:

```text
packages/avg-concept-forge/
  src/
    generate-variants.ts
    collide-frames.ts
    compress-concept.ts
    expand-concept.ts
    name-generator.ts
    pitch-generator.ts
    critique-concept.ts
    synthesize-concept.ts
```

Это будет сердце креативной системы.

---

# 35. Креативное усиление: “Claim Court”

Отдельный модуль:

```text
packages/avg-claim-court/
  src/
    prosecutor.ts
    defender.ts
    judge.ts
    evidence.ts
    verdict.ts
```

Логика:

```text
Defender Agent:
  объясняет, почему утверждение может быть полезным.

Prosecutor Agent:
  атакует утверждение за слабость, подмену, сказочность.

Judge Agent:
  присваивает статус:
    definition
    working_distinction
    hypothesis
    metaphor_only
    prohibited_positive_claim
```

Это делает валидацию не скучной, а живой.

---

# 36. Креативное усиление: “Map Diff”

Каждое изменение карты должно иметь diff:

```text
before:
  term "depth" had no operational definition

after:
  term "depth" defined as ability to preserve multiple levels of context without premature reduction

risk reduced:
  strong_word_substitution → medium to low
```

Каталог:

```text
artifacts/map-diffs/
```

---

# 37. Самый важный антихаос-принцип

Для Codex-проекта главное не количество агентов, а **качество границ**.

Плохая параллельная работа:

```text
10 агентов одновременно улучшают всё.
```

Хорошая параллельная работа:

```text
1 агент меняет UI.
1 агент пишет тесты.
1 агент готовит evals.
1 агент улучшает isolated package.
1 агент пишет docs.
Architect Agent держит контракты.
QA Agent блокирует мусор.
Security Agent блокирует опасное.
```

---

# 38. Финальная структура “идеального старта”

```text
avg-lab/
  AGENTS.md
  README.md
  CONTRIBUTING.md
  CODEOWNERS
  SECURITY.md

  .codex/
    mission.md
    agent-registry.md
    task-protocol.md
    parallel-work-policy.md
    review-protocol.md
    war-room/
    task-templates/
    context-packs/

  apps/
    web/
    api/
    worker/
    realtime-gateway/

  packages/
    avg-core/
    avg-openai/
    avg-agents/
    avg-validation/
    avg-graph/
    avg-retrieval/
    avg-memory/
    avg-ui/
    avg-evals/
    avg-testkit/

  knowledge/
    vocabularies/
    terms/
    claims/
    maps/
    validation-rules/

  prompts/
    system/
    modes/
    agents/
    validators/
    evals/

  schemas/
    json-schema/
    openapi/
    events/

  tests/
    unit/
    integration/
    contract/
    e2e/
    ai-evals/
    visual/
    accessibility/
    security/

  docs/
    00-product/
    01-architecture/
    02-ai-system/
    03-data/
    04-api/
    05-ui-ux/
    06-qa/
    07-security/
    08-devops/
    09-agent-operations/
    adr/

  infra/
  scripts/
  artifacts/
```

---

# 39. Главная формула проекта

```text
Codex App управляет агентами.
AGENTS.md задаёт закон.
ADR фиксируют решения.
Schemas удерживают контракты.
Tests защищают код.
Evals защищают AI-поведение.
Graph удерживает карту.
Validator защищает от сказочки.
QA Agent не даёт проекту развалиться.
```

И самая короткая версия:

> **Это должен быть не просто репозиторий приложения, а фабрика управляемого мышления, где люди и Codex-агенты могут параллельно строить сложную AI-систему без потери качества, смысла и архитектурной дисциплины.**

[1]: https://openai.com/index/introducing-the-codex-app/?utm_source=chatgpt.com "Introducing the Codex app - OpenAI"
[2]: https://developers.openai.com/codex/guides/agents-md?utm_source=chatgpt.com "Custom instructions with AGENTS.md – Codex | OpenAI Developers"
[3]: https://developers.openai.com/codex/cli?utm_source=chatgpt.com "CLI – Codex | OpenAI Developers"
[4]: https://developers.openai.com/codex/cloud?utm_source=chatgpt.com "Web – Codex | OpenAI Developers"
[5]: https://developers.openai.com/codex/guides/agents-sdk?utm_source=chatgpt.com "Use Codex with the Agents SDK | OpenAI Developers"
