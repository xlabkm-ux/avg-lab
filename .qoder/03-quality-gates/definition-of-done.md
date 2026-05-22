# Definition of Done

Единый стандарт завершения для всех задач AVG.

## Обязательные критерии

Для **любой** задачи:

- [ ] Реализация завершена
- [ ] Тесты добавлены или обновлены
- [ ] Typecheck проходит (`pnpm typecheck`)
- [ ] Lint проходит (`pnpm lint`)
- [ ] **Project backlog updated**: Actual Tokens, Variance, Status, and Notes recorded in [project-backlog.md](../../docs/88-project-plan/project-backlog.md) per [backlog-update-regulation.md](../02-sprint-management/backlog-update-regulation.md)

Для задач с **изменением AI поведения**:

- [ ] AI evals проходят (`pnpm test:ai`)
- [ ] Behavior ledger обновлен

Для задач с **изменением поведения**:

- [ ] Документация обновлена

Для **всех PR**:

- [ ] PR включает заметки о рисках
- [ ] PR включает план отката
- [ ] Контекст handoff summary создан (если статус yellow/red)
- [ ] Эскалация/замена модели задокументирована (если была)
- [ ] Работа соответствует утвержденному task id и owner lane

## Специфичные проверки по агентам

### Backend Agent
```bash
pnpm typecheck
pnpm test:integration
pnpm test:contract
```

### Frontend Agent
```bash
pnpm lint
pnpm test:visual
pnpm test:a11y
```

### Knowledge Graph Agent
```bash
pnpm validate:schemas
pnpm test:contract
```

## Non-Completion Rule

Если задача спринта не отмечена `done`, карточка задачи или доска прогресса должна указывать **объективную причину**, а не расплывчатый статус.

Требуемые формы:

- `blocked`: назвать отсутствующую зависимость или решение
- `in progress`: назвать конкретную оставшуюся работу
- `ready`: назвать владеющего агента и следующее действие
- `deferred`: назвать явный гейт спринта, предотвращающий работу

**Правило:** Если нет объективной причины и требуемые проверки проходят, задача должна быть переведена в `done`, а не оставлена в состоянии limbo.

## Ссылки

- [Task Protocol](../02-sprint-management/task-protocol.md)
- [Review Protocol](review-protocol.md)
- [Model Policy](../02-sprint-management/model-policy.md)
- [Backlog Update Regulation](../02-sprint-management/backlog-update-regulation.md) — **MANDATORY** backlog updates after task/sprint/phase completion
