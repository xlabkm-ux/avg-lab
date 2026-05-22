

# Аудит проекта AVG Codex Lab — Свежий срез

**Дата:** 21 мая 2026  
**Версия:** 0.1.0  
**Статус:** MVP-5 / Sprint 7 (Interface Foundation) — in progress

---

## 1. Quality Gates — Состояние на сейчас

| Gate | Команда | Результат |
|---|---|---|
| Typecheck | `pnpm typecheck` | ✅ 19/19 pass |
| Lint | `pnpm lint` | ❌ `@avg/utils` — ESLint игнорирует `**/*.ts` |
| Tests | `pnpm test` | ❌ `@avg/utils` — нет test-файлов |
| Contract Tests | `pnpm test:contract` | ✅ 13/13 pass |
| Schema Validate | `pnpm validate:schemas` | ✅ 9/9 pass |
| Build | `pnpm build` | ✅ 13/13 pass |

**Вывод:** Формально CI сломается на `lint` и `test`. Два быстрых фикса решат проблему.

---

## 2. Реализовано vs Пусто — Пакетная структура

| # | Пакет | Статус | Размер (src) |
|---|---|---|---|
| 1 | `avg-agents` | ✅ Реализован | mode routing, 4 режима |
| 2 | `avg-evals` | ✅ Реализован | claim-safety + no-fairy-tale scorers |
| 3 | `avg-graph` | ✅ Реализован | snapshot/diff, projection |
| 4 | `avg-openai` | ✅ Реализован | adapter boundary definition |
| 5 | `avg-retrieval` | ✅ Реализован | chunking, scoring, search |
| 6 | `avg-schemas` | ✅ Реализован | 5 JSON-schemas + AJV validators |
| 7 | `avg-security` | ✅ Реализован | regex-based injection detection |
| 8 | `avg-testkit` | ✅ Реализован | fixture resolution helpers |
| 9 | `avg-utils` | ✅ Реализован | `normalizeText`, word markers |
| 10 | `avg-validation` | ✅ Реализован | validation, classification, risk, grounding |
| 11 | `avg-claim-court` | ❌ Пуст | только README |
| 12 | `avg-concept-forge` | ❌ Пуст | только README |
| 13 | `avg-config` | ❌ Пуст | только README |
| 14 | `avg-core` | ❌ Пуст | только README |
| 15 | `avg-knowledge` | ❌ Пуст | только README |
| 16 | `avg-memory` | ❌ Пуст | только README |
| 17 | `avg-observability` | ❌ Пуст | только README |

**10/17 пакетов реализовано (59%), 8/17 пустых (41%).** Хорошая новость: пустые пакеты **не включены** в `tsconfig.json` как project references, так что они не создают ошибок импорта (вопреки более раннему утверждению аудита).

В проекте также 17-й пакет `avg-ui` (пустой), не включённый в workspace на данный момент.

---

## 3. Монолитные файлы

| Файл | Строк | Проблема |
|---|---|---|
| `apps/web/src/index.ts` | **1,960** | Весь web-сервер, роутинг, handlers, middleware, types в одном файле |
| `apps/api/src/index.ts` | **927** | Весь HTTP API в одном файле |
| `packages/avg-validation/src/index.ts` | **688** | Вся логика валидации, классификации, risk assessment, grounding |

**Итого 3,575 строк в трёх файлах.** Файл `apps/web/src/index.ts` вырос с 1,458 до 1,960 строк со времени предыдущего аудита.

---

## 4. Дублирование кода

### Исправлено:
- `normalizeText()` — вынесен в `avg-utils`, больше не дублируется ✅
- `collectStrongWordMarkers()` / `collectStrongWordHits()` — вынесены в `avg-utils` ✅

### Осталось:
- **`AvgRetrievalHit`** — определён дважды:
  - `packages/avg-retrieval/src/index.ts:32`
  - `packages/avg-validation/src/index.ts:57`
  
---

## 5. Инфраструктурные зазоры

| Категория | Состояние | Критичность |
|---|---|---|
| **Persistent storage** | Всё in-memory (`Map`). PostgreSQL/Neo4j/Redis в docker-compose, но не подключены | 🔴 HIGH для production |
| **Observability** | Пакет пуст. Только файловое логирование в API | 🔴 HIGH для production |
| **Error handling** | Plain `throw new Error(...)`, нет Result/Either | 🟡 MEDIUM |
| **Rate limiting** | Отсутствует | 🟡 MEDIUM для публичного доступа |
| **Authentication** | Отсутствует (local-only MVP-5) | 🟢 LOW для MVP |
| **ESLint for TS** | ESLint проверяет только `.js/.mjs`, не `.ts` | 🟡 MEDIUM |
| **E2E tests** | Playwright установлен, но тестов нет | 🟡 MEDIUM |

---

## 6. Сильные стороны

1. **Schema contracts** — `packages/avg-schemas` реализован на отлично. 5 JSON-schemas с AJV-валидацией, все тесты проходят
2. **Validation pipeline** — `packages/avg-validation` полностью реализован: claim validation, classification, risk assessment, grounded response composition
3. **No Fairy Tale Gate** — `packages/avg-evals` отлично реализован, детектирует сильные слова без определений, метафоры, псевдоглубину
4. **Documentation** — `.codex/` (6 разделов операционной модели) + `docs/` (13 категорий) + ADRs — отличная структура
5. **Product principles** — строго preserved в коде (claim_status, language_mode, access_mode принудительны в схемах)
6. **Security basics** — prompt injection detection реализован, хоть и regex-based
7. **Monorepo tooling** — pnpm + turbo настроены корректно, build pipeline работает
8. **CI/CD** — полный pipeline с 13 шагами проверки качества

---

## 7. Рекомендации (приоритет)

### 🔴 Immediate (сейчас)

1. **Починить `pnpm lint`** — настроить ESLint на TypeScript (`@typescript-eslint`)
2. **Починить `pnpm test`** — добавить хотя бы один тест в `@avg/utils` или убрать test-скрипт
3. **Убрать дубликат `AvgRetrievalHit`** из avg-validation

### 🟡 Short-term (Sprint 7-8)

4. Расщепить `apps/web/src/index.ts` (1,960 строк) на модули
5. Расщепить `apps/api/src/index.ts` (927 строк) на модули
6. Реализовать `avg-core` (Result pattern, shared utilities)
7. Начать persistence layer (PostgreSQL adapter)

### 🟢 Medium-term (MVP-6)

8. Observability (structured logging, metrics)
9. E2E тесты (Playwright)
10. Concept Forge, Claim Court
11. Оставшиеся dialogue modes

---

## 8. Заключение

Проект находится на **~40% от финальной концепции** — базовая инфраструктура, схемы и валидация реализованы хорошо, но отсутствуют persistence, UI surfaces, observability и creative engine.

Качество кода на уровне MVP приемлемое: typecheck и build проходят чисто, contract tests покрывают критические контракты. Основные проблемы — монолитные файлы и отсутствие TS ESLint — механические и решаемые.

**Ключевой риск:** если монолитные файлы продолжат расти (apps/web с 1,458 до 1,960 строк), рефакторинг станет всё дороже.Аудит завершён. Ключевые выводы:

1. **Quality gates на данный момент:** typecheck и build проходят, но `lint` и `test` сломаны (из-за `@avg/utils`) — CI в текущем состоянии бы упал
2. **Реализация:** 10/17 пакетов работают (59%), пустые пакеты корректно исключены из tsconfig
3. **Монолиты:** 3,575 строк в трёх файлах, и `apps/web/src/index.ts` продолжает расти (уже 1,960 строк)
4. **Дублирование:** `normalizeText` исправлен, но `AvgRetrievalHit` всё ещё определён дважды
5. **Предыдущие аудиты** (`AUDIT-REFACTORING-PROPOSAL.md`, `DEVIATION-ANALYSIS.md`) остаются релевантными и содержат детальные планы рефакторинга

Три immediate fix'а для восстановления quality gates:
- Настроить `@typescript-eslint` для `eslint.config.mjs`
- Добавить тест в `@avg/utils` или убрать test-скрипт
- Удалить дубликат `AvgRetrievalHit` из `avg-validation`

Хотите, чтобы я реализовал эти исправления?