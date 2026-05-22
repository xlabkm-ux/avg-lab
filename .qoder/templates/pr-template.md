# Pull Request Template

Каждый PR должен включать следующие разделы:

## Purpose

Краткое описание цели изменений (1-2 предложения).

## Changed Areas

Список измененных областей:

- [ ] Package/module names
- [ ] API endpoints
- [ ] UI components
- [ ] Schemas/contracts
- [ ] Prompts/AI behavior

## Screenshots

Если UI изменился, приложите скриншоты:

- Before/after для визуальных изменений
- Диаграммы потоков для логики

## Tests Run

Отметьте выполненные проверки:

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm test:contract`
- [ ] `pnpm test:ai` (если AI поведение изменилось)
- [ ] `pnpm build`
- [ ] `pnpm test:e2e` (если применимо)
- [ ] `pnpm test:visual` (если UI изменился)
- [ ] `pnpm test:a11y` (если UI изменился)

## AI Evals

Если промпты или поведение модели изменились:

- [ ] AI evals запущены
- [ ] Результаты evals соответствуют ожиданиям
- [ ] Behavior ledger обновлен

## Risks

Опишите известные риски:

- Потенциальные регрессии
- Breaking changes
- Performance impact
- Security concerns

## Rollback Plan

Как откатить изменения:

1. Шаг 1
2. Шаг 2
3. Шаг 3

## Affected Agents

Какие агенты должны ревьюить:

- [ ] Architect Agent (schemas, contracts)
- [ ] Backend Agent (API, migrations)
- [ ] Frontend Agent (UI components)
- [ ] Validation Agent (prompts, AI behavior)
- [ ] QA Agent (tests, thresholds)
- [ ] Security Agent (security changes)
- [ ] DevOps Agent (infrastructure)

## Migration Notes

Если требуется миграция:

- [ ] DB migration script included
- [ ] Backward compatibility maintained
- [ ] Rollforward plan documented

## Backlog Update

**MANDATORY:** No PR merges until project backlog is updated per [backlog-update-regulation.md](../02-sprint-management/backlog-update-regulation.md).

- [ ] Task AVG-XXX updated in [project-backlog.md](../../docs/88-project-plan/project-backlog.md)
- [ ] Actual Tokens recorded: [number]
- [ ] Variance calculated: [+/-number or "within ±20%"]
- [ ] Notes added if variance >±20%: [yes/no]
- [ ] If this completes a sprint: Sprint Total row updated, exit criteria checked
- [ ] If this completes an этап: Phase summary, Grand Total, and Change Log updated
