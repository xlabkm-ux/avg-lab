# Документ 1. Практическая Проектная Концепция AVG Unified Task System

## 1. Суть Концепции
AVG должна стать не “чатом с режимами”, а **единым проводником решения задач**.

Пользователь формулирует задачу обычным языком. Он не обязан знать, что такое validator, LLM fallback, solution pattern, retrieval, map или artifact. Система сама определяет, какой процесс нужен, задаёт уточняющие вопросы, предлагает выбор только там, где выбор реально влияет на результат, и ведёт пользователя к понятному итогу.

Ключевое правило:

> Пользователь управляет смыслом задачи. AVG управляет процессом решения.

## 2. Пользовательский Принцип
Пользователь видит:

- что система поняла;
- какой следующий шаг предлагается;
- где нужно уточнение;
- где не хватает оснований;
- какие есть риски;
- какой результат уже готов;
- как перейти к карте, источникам или артефакту.

Пользователь не видит как обязательное знание:

- внутренние режимы;
- technical fallback logic;
- raw LLM output;
- hidden prompts;
- технические названия пайплайнов;
- необходимость вручную включать LLM.

## 3. Единая Точка Входа: Dialogue
`Dialogue` становится главным пользовательским входом.

Пользователь вводит:

- идею;
- вопрос;
- утверждение;
- задачу;
- сырой текст;
- проблему;
- запрос на план;
- запрос на артефакт;
- просьбу проверить мысль.

AVG выполняет:

1. intake задачи;
2. определение намерения;
3. подбор типового процесса;
4. проверку достаточности данных;
5. уточнение, если данных мало;
6. генерацию ответа;
7. валидацию;
8. предложение следующего шага;
9. при необходимости переход к документам, карте или артефакту.

## 4. Языковая Модель Продукта
На данном этапе:

- **диалог ведётся на русском языке**;
- модельная логика и generated responses остаются русскоязычными;
- интерфейс поддерживает `RU/EN`;
- переключатель языка меняет только UI: навигацию, кнопки, подписи, состояния, labels;
- переключатель не переводит саму мысль пользователя и не переводит generated response.

В будущем возможен отдельный LLM translation layer между пользователем и русскоязычной моделью AVG, но это отдельное расширение.

## 5. Adaptive LLM Layer
LLM используется как внутренняя адаптивная способность системы.

LLM включается автоматически, если локальный ответ:

- неполный;
- неуверенный;
- неадекватный задаче;
- не может дать полезный следующий шаг;
- требует более гибкого понимания контекста.

LLM не является источником истины. Она является генератором черновика до AVG validation.

Правила:

- raw LLM output не показывается как финальный ответ;
- результат LLM преобразуется в `AvgStructuredResponse`;
- ответ проходит `validateAvgResponse`;
- если validation failed, пользователь получает безопасный fallback;
- UI может показать простую пометку: “Ответ усилен адаптивным слоем”, но не требует от пользователя действий.

## 6. Solution Library
AVG получает библиотеку типовых решений и процессов.

`Solution Pattern` — это типовой способ вести задачу:

- развитие идеи;
- проверка утверждения;
- построение карты;
- подготовка стратегии;
- формирование артефакта;
- уточнение критериев;
- запрос источников;
- анализ противоречия;
- генерация вариантов;
- сборка плана.

`Solution Instance` — конкретное применение паттерна к задаче пользователя.

Пользователь не выбирает паттерн вручную. AVG сама подбирает его по задаче.

## 7. Adaptive Solution Generator
Если подходящего паттерна нет, AVG создаёт новый процесс “на лету”.

Новый процесс:

- имеет цель;
- имеет scope;
- имеет шаги;
- имеет expected outputs;
- имеет risks;
- проходит проверку;
- применяется к текущей задаче;
- автоматически сохраняется в проектную библиотеку, если оказался полезным.

## 8. Жизненный Цикл Решений
Статусы solution patterns:

- `seed` — базовые системные паттерны AVG;
- `project_local_candidate` — автоматически созданный проектный кандидат;
- `project_approved` — успешно применённый проектный паттерн;
- `deprecated` — не рекомендован к дальнейшему использованию.

Новые решения сохраняются автоматически, но сначала только на уровне проекта. Повышение в общую seed-библиотеку требует отдельного review.

## 9. Task Run: Видимый Ход Решения
Каждая задача пользователя становится `Task Run`.

Для пользователя показывается панель “Ход работы”:

- задача принята;
- уточняю цель;
- выбираю способ решения;
- формирую рабочую карту;
- проверяю утверждения;
- ищу недостающие основания;
- готовлю результат;
- готово.

Каждый шаг имеет статус:

- ожидает;
- в работе;
- нужно действие;
- готово;
- есть риск;
- ошибка.

## 10. Admin Run Console
Администратор видит расширенный trace:

- task id;
- project/session id;
- intent classification;
- selected solution pattern;
- adequacy status;
- LLM fallback attempts;
- validation results;
- warnings;
- errors;
- token estimates;
- generated artifacts;
- сохранённые или отклонённые solution patterns.

Администратор не видит секреты, API keys и небезопасные raw prompts. Raw LLM output хранится только при отдельном debug режиме.

## 11. Пользовательские Состояния
Система должна показывать не технические статусы, а понятные состояния:

- `Нужно уточнение`;
- `Есть несколько путей`;
- `Недостаточно оснований`;
- `Ответ требует проверки`;
- `Можно собрать карту`;
- `Можно подготовить артефакт`;
- `Готово`;
- `Есть риск`.

## 12. Product Boundary
AVG не должна становиться generic chatbot.

Каждый важный ответ сохраняет:

- scope;
- claim status;
- language mode;
- validation risk;
- map/territory boundary;
- next useful move.

LLM, solution library и adaptive generator не обходят эти правила, а усиливают их.

---

# Документ 2. Подробный План Реализации

Оценки токенов предварительные.

`IN` — чтение кода, контекста, документов, анализ, проверка контрактов.  
`OUT` — код, тесты, документация, описания, handoff.

## Phase 1. Product Contract

| Task | Задача | Результат | IN | OUT |
|---|---|---|---:|---:|
| AVG-US-001 | Зафиксировать Unified Task Dialogue contract | Документ единого пользовательского процесса | 18k | 7k |
| AVG-US-002 | Описать user states | `needs_clarification`, `guided_choice`, `needs_evidence`, `answer_ready` | 14k | 5k |
| AVG-US-003 | Описать Task Run contract | User timeline + admin trace | 18k | 7k |
| AVG-US-004 | Описать LLM adaptive policy | LLM как внутренний fallback после adequacy gate | 16k | 6k |
| AVG-US-005 | Описать Solution Library concept | Pattern, instance, lifecycle, storage rules | 20k | 8k |

**Phase total:** IN 86k / OUT 33k

## Phase 2. Interface Language Layer

| Task | Задача | Результат | IN | OUT |
|---|---|---|---:|---:|
| AVG-I18N-101 | Добавить `Locale = ru/en` | Типизированный UI locale | 12k | 4k |
| AVG-I18N-102 | Создать RU/EN словари | Shell, nav, Dialogue, buttons, errors, labels | 18k | 8k |
| AVG-I18N-103 | Добавить RU/EN toggle | Header toggle + localStorage | 16k | 6k |
| AVG-I18N-104 | Перевести shell/nav на словари | UI строки больше не hardcoded | 18k | 7k |
| AVG-I18N-105 | Тесты i18n | Dictionary completeness + toggle behavior | 14k | 5k |

**Phase total:** IN 78k / OUT 30k

## Phase 3. Dialogue MVP

| Task | Задача | Результат | IN | OUT |
|---|---|---|---:|---:|
| AVG-DLG-201 | Заменить Dialogue placeholder | Composer, thread, states | 24k | 10k |
| AVG-DLG-202 | Добавить response details | Scope, status, risk, boundary, next action | 22k | 9k |
| AVG-DLG-203 | Добавить progressive disclosure | “Проверка и границы” без перегруза UI | 18k | 7k |
| AVG-DLG-204 | Добавить deterministic RU adapter | Валидный русский `AvgStructuredResponse` | 22k | 9k |
| AVG-DLG-205 | Добавить Dialogue tests | Empty input, valid response, invalid boundary | 20k | 8k |

**Phase total:** IN 106k / OUT 43k

## Phase 4. Task Orchestrator

| Task | Задача | Результат | IN | OUT |
|---|---|---|---:|---:|
| AVG-ORCH-301 | Intent classifier | Тип задачи определяется автоматически | 26k | 10k |
| AVG-ORCH-302 | Adequacy gate | `adequate`, `incomplete`, `uncertain`, `invalid` | 26k | 10k |
| AVG-ORCH-303 | Clarification flow | 1-3 вопроса вместо слабого ответа | 28k | 11k |
| AVG-ORCH-304 | Guided choice flow | Понятный выбор пути, если задача неоднозначна | 28k | 11k |
| AVG-ORCH-305 | Интеграция в Dialogue | Пользователь видит единый процесс | 32k | 13k |
| AVG-ORCH-306 | Orchestrator tests | Intent, adequacy, clarification, guided choice | 28k | 11k |

**Phase total:** IN 168k / OUT 66k

## Phase 5. Adaptive LLM Layer

| Task | Задача | Результат | IN | OUT |
|---|---|---|---:|---:|
| AVG-LLM-401 | Расширить `@avg/openai` | Server-side provider adapter | 32k | 13k |
| AVG-LLM-402 | Добавить LLM config | `AVG_LLM_ADAPTIVE`, `OPENAI_API_KEY`, `OPENAI_MODEL` | 18k | 6k |
| AVG-LLM-403 | Создать русский LLM prompt | Генерация без обхода AVG discipline | 24k | 8k |
| AVG-LLM-404 | Реализовать fallback pipeline | Автовызов при неполноте/неуверенности | 36k | 15k |
| AVG-LLM-405 | Validation boundary | Raw LLM output не показывается | 30k | 11k |
| AVG-LLM-406 | LLM tests | Disabled, no key, invalid output, accepted output | 32k | 13k |

**Phase total:** IN 172k / OUT 66k

## Phase 6. Solution Library

| Task | Задача | Результат | IN | OUT |
|---|---|---|---:|---:|
| AVG-SOL-501 | Описать `SolutionPattern` types | Pattern, step, status, signals, risks | 24k | 9k |
| AVG-SOL-502 | Seed patterns | Идея, проверка, карта, артефакт, источники, уточнение | 26k | 11k |
| AVG-SOL-503 | Pattern matcher | Подбор паттерна по intent/signals | 28k | 11k |
| AVG-SOL-504 | Adaptive generator | Создание нового процесса, если seed не подходит | 34k | 14k |
| AVG-SOL-505 | Pattern quality gate | Scope, risks, expected outputs, boundary check | 30k | 12k |
| AVG-SOL-506 | Project-local store | Автосохранение candidate patterns | 30k | 12k |
| AVG-SOL-507 | Library tests | Match, generate, save, reject, deprecate | 30k | 12k |

**Phase total:** IN 202k / OUT 81k

## Phase 7. Task Run And Progress UI

| Task | Задача | Результат | IN | OUT |
|---|---|---|---:|---:|
| AVG-RUN-601 | Добавить TaskRun model | Run, step, event, status, warning | 26k | 10k |
| AVG-RUN-602 | In-memory TaskRunStore | Create, append event, update, complete/fail | 26k | 10k |
| AVG-RUN-603 | Интеграция с Orchestrator | Все шаги пишутся в run timeline | 30k | 12k |
| AVG-RUN-604 | User Progress Center | “Ход работы” + current step + action card | 34k | 14k |
| AVG-RUN-605 | Admin Run Console | Runs list + trace detail + warnings + token estimate | 38k | 16k |
| AVG-RUN-606 | TaskRun tests | Timeline, waiting user, LLM trace, validation failure | 30k | 12k |

**Phase total:** IN 184k / OUT 74k

## Phase 8. API Boundary

| Task | Задача | Результат | IN | OUT |
|---|---|---|---:|---:|
| AVG-API-701 | Добавить `POST /dialogue/respond` | Единый endpoint Dialogue pipeline | 32k | 13k |
| AVG-API-702 | Response envelope | `response`, `state`, `source`, `run`, `warnings` | 26k | 10k |
| AVG-API-703 | Normalized errors | Empty input, LLM unavailable, invalid output | 24k | 9k |
| AVG-API-704 | Подключить React к API | `/api/dialogue/respond` через Vite proxy | 30k | 12k |
| AVG-API-705 | API contract tests | Request/response/fallback shapes | 28k | 11k |

**Phase total:** IN 140k / OUT 55k

## Phase 9. Cross-Surface Guidance

| Task | Задача | Результат | IN | OUT |
|---|---|---|---:|---:|
| AVG-GUIDE-801 | Surface suggestions | AVG предлагает Documents/Map/Artifacts по задаче | 28k | 11k |
| AVG-GUIDE-802 | Next useful move UI | Единое действие следующего шага | 24k | 9k |
| AVG-GUIDE-803 | Needs evidence → Documents | Если нужны источники, система ведёт к документам | 26k | 10k |
| AVG-GUIDE-804 | Map ready → Map | Если появились понятия/связи, предлагает карту | 26k | 10k |
| AVG-GUIDE-805 | Artifact ready → Artifacts | Если материал созрел, предлагает артефакт | 26k | 10k |

**Phase total:** IN 130k / OUT 50k

## Phase 10. E2E, Docs, Backlog

| Task | Задача | Результат | IN | OUT |
|---|---|---|---:|---:|
| AVG-QA-901 | E2E happy path | Задача → уточнение/выбор → ответ → progress | 32k | 13k |
| AVG-QA-902 | E2E LLM unavailable | Мягкий fallback в deterministic mode | 28k | 11k |
| AVG-QA-903 | E2E invalid LLM output | Raw LLM не попадает пользователю | 28k | 11k |
| AVG-QA-904 | E2E solution pattern | Подбор/генерация/сохранение project pattern | 30k | 12k |
| AVG-QA-905 | E2E progress/admin | User timeline и admin trace расходятся по детализации | 30k | 12k |
| AVG-DOC-906 | Обновить docs | Concept, developer notes, limitations, env | 26k | 10k |
| AVG-DOC-907 | Обновить backlog | Финансовый контроль токенов и статусы | 16k | 6k |

**Phase total:** IN 190k / OUT 75k

## Общая Оценка Токенов

| Phase | IN | OUT |
|---|---:|---:|
| Product Contract | 86k | 33k |
| Interface Language Layer | 78k | 30k |
| Dialogue MVP | 106k | 43k |
| Task Orchestrator | 168k | 66k |
| Adaptive LLM Layer | 172k | 66k |
| Solution Library | 202k | 81k |
| Task Run And Progress UI | 184k | 74k |
| API Boundary | 140k | 55k |
| Cross-Surface Guidance | 130k | 50k |
| E2E, Docs, Backlog | 190k | 75k |
| **Total** | **1,456k** | **573k** |

## Acceptance Criteria
- Пользователь формулирует задачу без знания внутренних режимов.
- AVG сама выбирает процесс, уточняет, предлагает выбор или ведёт дальше.
- Диалог остаётся на русском.
- Интерфейс переключается RU/EN.
- LLM включается автоматически только при неполноте/неуверенности.
- LLM output не обходит validation.
- Solution Library подбирает или генерирует типовой процесс.
- Новые удачные решения автоматически сохраняются на уровне проекта.
- Пользователь видит “Ход работы”.
- Администратор видит Run Console и trace.
- Все ответы сохраняют scope, claim status, language mode, validation risk и map/territory boundary.
- После каждой завершённой задачи обновляется backlog по регламенту проекта.
