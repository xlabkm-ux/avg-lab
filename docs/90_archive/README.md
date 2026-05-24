# Документация Архива AVG Codex Lab

**Назначение:** Историческая документация для справки и аудита  
**Статус:** READ-ONLY — документы в архиве не изменяются  
**Дата создания:** 2026-05-22

---

## Как использовать этот архив

### Поиск

Для поиска по архивным документам используйте:

```bash
# PowerShell
Select-String -Path "docs/90_archive/**/*.md" -Pattern "search term"

# VS Code / Qoder
Use "Find in Files" (Ctrl+Shift+F) with scope: docs/90_archive/
```

### Структура

Документы организованы по дате архивации:

```
docs/90_archive/
├── README.md                          # Этот файл — индекс архива
└── 2026-05-22_initial-audit/          # Первая волна архивации
    ├── deepseek-audit.md              # Аудит от DeepSeek AI
    ├── openai-concept.md              # Концепт креативной диалоговой системы
    ├── openai-software.md             # Технологии и ПО для AVG
    ├── openai-implementation-tech.md  # Технологическая реализация
    ├── openai-codex.md                # Project structure for Codex
    ├── openai-concept-plan.md         # Concept + Plan for UTS
    ├── google-architecture-spec.md    # Архитектурные спецификации UTS
    ├── google-concept-audit.md        # Аудит концепции UTS
    ├── deviation-analysis.md          # Анализ отклонений от концепции
    ├── gap-analysis.md                # Gap Analysis для тестирования
    └── env-validation-report.md       # Environment Validation Report
```

---

## Индекс Архивных Документов

### 2026-05-22_initial-audit

| # | Файл | Оригинальное расположение | Заменён на | Краткое описание |
|---|------|--------------------------|------------|------------------|
| 1 | deepseek-audit.md | docs/99-doc/DeepSeek Аудит.md | refactoring-audit-2026-05-22.md | Аудит quality gates, пакетов, монолитных файлов. Все issues resolved в Sprint 1.6 |
| 2 | openai-concept.md | docs/99-doc/Open AI Концепт.md | docs/11-unified-task-system/product-contract.md | Концепт креативной диалоговой системы с 7 режимами. Идея поглощена UTS specs |
| 3 | openai-software.md | docs/99-doc/Open AI программное обеспечение.md | docs/01-architecture/system-overview.md | Список технологий и ПО (OpenAI stack, PostgreSQL, etc.) |
| 4 | openai-implementation-tech.md | docs/99-doc/Open AI технологии реализации.md | docs/01-architecture/system-overview.md | Технологическая реализация на стеке OpenAI |
| 5 | openai-codex.md | docs/99-doc/Open AI Codex.md | AGENTS.md | Project structure оптимизированный под Codex workflow |
| 6 | openai-concept-plan.md | docs/99-doc/Open AI CONCEPT + PLAN.md | unified-task-system-expanded-plan.md | Практическая концепция и план Unified Task System |
| 7 | google-architecture-spec.md | docs/99-doc/Google Архитектурные Спецификации AVG.md | docs/11-unified-task-system/ | Детальные architectural blueprints для UTS (State Graph, HITL, Tools) |
| 8 | google-concept-audit.md | docs/99-doc/Google Аудит концепции AVG.md | refactoring-audit-2026-05-22.md | Аудиторский отчет по концепции UTS с рекомендациями |
| 9 | deviation-analysis.md | DEVIATION-ANALYSIS.md (root) | refactoring-audit-2026-05-22.md | Анализ отклонений проекта от исходной концепции (30-40% реализации) |
| 10 | gap-analysis.md | GAP-ANALYSIS.md (root) | project-backlog.md | Gap Analysis для full testing — что работает, что нет |
| 11 | env-validation-report.md | ENV-VALIDATION-REPORT.md (root) | project-backlog.md | Environment validation report (PostgreSQL, OpenAI, Node.js) |

---

## Статусы Документов

Все документы в проекте имеют один из трёх статусов:

| Статус | Значение | Можно редактировать | Ссылается в AGENTS.md |
|--------|----------|---------------------|----------------------|
| `active` | Текущий источник истины | ДА | ДА |
| `archived` | Историческая справка | НЕТ | НЕТ |
| `review` | Статус не определён | НЕТ (до решения) | НЕТ |

---

## Правила Архивации

### Когда документ подлежит архивации:

1. **Выполнен** — все задачи из документа выполнены (аудиты, анализы)
2. **Заменён** — существует более новая версия или спецификация
3. **Не соответствует концепции** — идея устарела или изменена
4. **Snapshot состояния** — информация о состоянии на конкретную дату

### Процесс архивации:

1. Добавить `status: archived` frontmatter к документу
2. Заполнить поля `superseded_by`, `archive_date`, `archive_reason`
3. Переместить файл в `docs/90_archive/YYYY-MM-DD_<category>/`
4. Обновить этот индекс (README.md)
5. Commit: `docs(archive): archive <document-name> (superseded by <new-doc>)`

### Frontmatter Schema

```yaml
---
title: Document Title
status: archived
created_date: YYYY-MM-DD
last_updated: YYYY-MM-DD
author: Author/Agent
superseded_by: path/to/replacement/document.md
archive_date: YYYY-MM-DD
archive_reason: Why this document was archived
tags: [tag1, tag2, tag3]
---
```

---

## Активные Документы — Быстрые Ссылки

Для актуальной документации см.:

- **Продукт:** `docs/00-product/`
- **Архитектура:** `docs/01-architecture/`
- **AI система:** `docs/02-ai-system/`
- **Данные:** `docs/03-data/`
- **API:** `docs/04-api/`
- **UI/UX:** `docs/05-ui-ux/`
- **QA:** `docs/06-qa/`
- **Security:** `docs/07-security/`
- **DevOps:** `docs/08-devops/`
- **Agent Operations:** `docs/09-agent-operations/`
- **Unified Task System:** `docs/11-unified-task-system/`
- **Project Plan:** `docs/88-project-plan/`
- **ADRs:** `docs/adr/`
- **Operating Model:** `.qoder/`

---

## История Архивации

| Дата | Документов | Категория | Причина |
|------|------------|-----------|---------|
| 2026-05-22 | 11 | Initial audit wave | Sprint 1.6 completed all audit findings; concept docs superseded by UTS specs |

---

**Поддержание:** При каждой архивации обновляйте этот файл  
**Владелец:** Product Owner / Architect  
**Последнее обновление:** 2026-05-22
