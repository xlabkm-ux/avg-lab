# Handoff Protocol

Протокол передачи задачи между агентами.

## Обязательная информация при передаче

Перед тем как другой агент продолжит задачу, текущий агент должен предоставить:

1. **task id** — идентификатор задачи
2. **sprint id** — идентификатор спринта
3. **branch name** — имя ветки
4. **files changed** — список измененных файлов
5. **contracts touched** — затронутые контракты
6. **tests run** — запущенные тесты
7. **context status** — green/yellow/red
8. **model tier and model used** — использованная модель
9. **model escalation or substitution** — если была
10. **open risks** — открытые риски
11. **next recommended step** — следующий рекомендуемый шаг

## Статусы контекста

| Статус | Значение | Требуемое действие |
|--------|----------|-------------------|
| green | ограниченная задача, мало файлов | продолжить |
| yellow | широкий контекст или несколько контрактов | написать handoff summary перед продолжением |
| red | контекст перегружен или задача слишком широкая | остановить и разделить задачу |

Подробнее: [Context Budget](context-budget.md)

## Шаблон handoff summary

```yaml
task_id: AVG-XXX
from_agent: backend
to_agent: frontend
branch: agent/backend/AVG-XXX-api-endpoint
files_changed:
  - apps/api/src/routes/thoughts.ts
  - packages/avg-core/src/types.ts
contracts_touched:
  - OpenAPI spec v2
  - ThoughtResponse schema
tests_run:
  - pnpm test:integration
  - pnpm test:contract
context_status: yellow
model_used: gpt-5.4 (standard)
escalation: none
risks:
  - "Schema change may break existing clients"
next_step: "Update frontend types to match new API response"
```

## Ссылки

- [Agent Execution Matrix](agent-execution-matrix.md)
- [Context Budget](context-budget.md)
- [Task Protocol](../02-sprint-management/task-protocol.md)
