# AVG Lab

**AVG Codex Lab** — готовый шаблон репозитория для разработки креативной диалоговой системы AVG в Codex App / Codex CLI / Codex Cloud.

AVG расшифровывается как **Adequate Vision Generator**: система совместного мышления, которая помогает пользователю генерировать идеи, строить карты, валидировать утверждения, отличать факт от гипотезы и метафору от модели.

## Что находится в проекте

Репозиторий содержит не только структуру папок, но и заполненные проектные документы:

- `AGENTS.md` — главный файл инструкций для Codex-агентов.
- `.qoder/` — operating model, agent roles, task templates, runbooks, context packs, specs, strategic roadmap.
- `docs/` — продуктовая, архитектурная, AI, QA, security, DevOps и agent-operations документация.
- `schemas/` — JSON Schema, OpenAPI, event schemas.
- `prompts/` — системные промпты, режимы AVG, агенты, validators, eval prompts.
- `knowledge/` — стартовая карта терминов, утверждений, рисков и правил валидации.
- `packages/` — каркас пакетов monorepo.
- `apps/` — web, api, worker, realtime-gateway.
- `tests/` — структура тестов, AI evals и quality gates.
- `scripts/` — команды для Codex, QA, graph, evals, release.

## Быстрый старт в Codex App

1. Распакуйте ZIP в рабочую папку.
2. Откройте эту папку как проект в Codex App.
3. Попросите Codex: `Summarize the current project instructions and propose the first implementation milestone.`
4. Проверьте, что Codex прочитал `AGENTS.md` и `.qoder/00-fundamentals/mission.md`.
5. Начните с milestone `MVP-0`: настройка monorepo, схем, тестов и минимального OpenAI adapter.

## Быстрый старт в терминале

```bash
cd avg-lab
pnpm install
pnpm lint
pnpm typecheck
pnpm test
```

Пока проект является blueprint-репозиторием: кодовые пакеты имеют README и стартовые контракты, а реализацию должны постепенно наполнять Codex-агенты по регламенту из `.qoder/`.

## Главный принцип AVG

AVG не должна быть обычной оболочкой над LLM. Уникальная часть системы — слой карты и валидации:

```text
модель генерирует;
граф удерживает карту;
валидатор защищает от сказочки;
QA/evals защищают поведение;
Codex-агенты строят систему параллельно, но через контракты.
```

## Первый рекомендуемый milestone

**MVP-0: Repository Operating System**

Результат:

- monorepo собирается;
- AGENTS.md читается Codex;
- есть CI skeleton;
- есть JSON Schema для claim/node/edge;
- есть первые AI eval fixtures;
- есть документация и ADR-001;
- есть task board для Codex-агентов.
