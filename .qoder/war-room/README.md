# War Room

War Room содержит **активное состояние** текущего спринта.

## Что здесь находится

Это **динамические** документы, которые обновляются ежедневно:

- **[active-epics.md](active-epics.md)** — активные эпики и их статус
- **[sprint-backlog.md](sprint-backlog.md)** — бэклог текущего спринта
- **[daily-agent-brief.md](daily-agent-brief.md)** — ежедневный бриф для агентов
- **[decisions.md](decisions.md)** — принятые решения в текущем спринте
- **[risk-radar.md](risk-radar.md)** — текущие риски
- **[project-backlog-progress.md](project-backlog-progress.md)** — прогресс по всему бэклогу
- **[tasks/](tasks/)** — карточки активных задач

## Чем War Room отличается от других документов

| Тип | Где находится | Частота изменений | Примеры |
|-----|--------------|-------------------|---------|
| **Статические правила** | `../00-fundamentals/`, `../01-operating-model/`, etc. | Редко (недели/месяцы) | protocols, policies, principles |
| **Динамическое состояние** | `war-room/` | Ежедневно | backlog, tasks, decisions |
| **Архив** | `archive/` | При завершении спринта | completed sprints |

## Как использовать

1. **Перед началом работы:** прочитайте `sprint-backlog.md` и `daily-agent-brief.md`
2. **При выборе задачи:** откройте `tasks/AVG-XXX-task-card.md`
3. **При блокировке:** обновите `risk-radar.md` и карточку задачи
4. **При принятии решения:** запишите в `decisions.md`

## Архивация

Завершенные спринты архивируются в `archive/` с датой:

```
archive/
  mvp-0-to-mvp-3-2026-05-20/
  mvp-4-sprint-6-2026-05-20/
```

Архив включает:
- Все карточки задач
- Sprint backlog
- Daily briefs
- Closure summary
