# Context Budget Management

Агенты должны управлять контекстом как явным ресурсом задачи.

## Уровни контекста

### Green ✅
**Когда:** задача ограничена, открыты только целевые файлы

**Действие:** продолжать работу

**Примеры:**
- Исправление бага в одном файле
- Добавление теста к существующей функции
- Обновление одного README

### Yellow ⚠️
**Когда:** множественные контракты, много файлов или неясное владение

**Действие:** написать handoff summary перед продолжением редактирования

**Примеры:**
- Изменение shared schema
- Рефакторинг across packages
- Обновление API contract

### Red 🛑
**Когда:** контекст перегружен или задача слишком широкая

**Действие:** остановить и разделить задачу

**Примеры:**
- Переписывание core architecture
- Migration across multiple packages
- Major refactoring without clear boundaries

## Управление контекстом в карточке задачи

```yaml
context_budget:
  target_docs:
    - AGENTS.md
    - .qoder/mission.md
  max_files_to_open: 12
  context_status: green | yellow | red
  handoff_required_at: yellow
  compact_summary_required: true
```

## Правила

1. **Заявите бюджет контекста** в Definition of Ready
2. **Мониторьте статус** во время работы
3. **Эскалируйте** при переходе в yellow/red
4. **Документируйте** в handoff при передаче

## Ссылки

- [Handoff Protocol](handoff-protocol.md)
- [Task Protocol](../02-sprint-management/task-protocol.md)
- [Agent Execution Matrix](agent-execution-matrix.md)
