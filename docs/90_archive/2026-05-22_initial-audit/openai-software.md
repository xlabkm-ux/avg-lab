---
title: Open AI программное обеспечение - Технологии и ПО для AVG
status: archived
created_date: 2026-05-22
last_updated: 2026-05-22
author: OpenAI
superseded_by: docs/01-architecture/system-overview.md
archive_date: 2026-05-22
archive_reason: Technology stack decisions incorporated into system-overview.md and package implementations
tags: [technology, software, stack, historical]
---

Ниже — практический список технологий и конкретного ПО для реализации **AVG — креативной диалоговой системы с картой, валидатором утверждений и агентным контуром OpenAI**.

Главное архитектурное требование остаётся прежним: AVG должна хранить не “истину”, а **валидируемую карту** — с терминами, связями, утверждениями, режимами языка, статусами утверждений и рисками подмены карты Реальностью. Это напрямую следует из загруженной модели: каждый элемент карты должен иметь область определения, режим доступности, допустимый язык и границы права на утверждение. 

# 1. OpenAI-слой

| Технология                | Конкретное ПО / сервис                    | Для чего в AVG                                                                                                                                                                                                                                                     |
| ------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Главный LLM-интерфейс     | **OpenAI Responses API**                  | Центральный API для диалога, инструментов, stateful-взаимодействия и agentic workflows. Responses API поддерживает текстовые и image-входы, stateful interactions, built-in tools, file search, web search и function calling. ([platform.openai.com][1])          |
| Основная reasoning-модель | **GPT-5.5**                               | Сложные концепты, архитектура, методология, исследование, проектирование, работа с инструментами. OpenAI описывает GPT-5.5 как модель для сложных задач вроде coding, research, data analysis и tool-heavy workflows. ([OpenAI][2])                                |
| Быстрая модель для UX     | **GPT-5.1 / GPT-5.1 Instant**             | Быстрые ответы, уточнения, интерактивный чат, режим “Разгон”. GPT-5.1 ориентирован на adaptive reasoning, snappier product experiences и improved tool calling. ([OpenAI][3])                                                                                      |
| Reasoning control         | **reasoning.effort: low / medium / high** | Управление глубиной мышления: low для быстрых реплик, high для архитектуры и валидации. OpenAI рекомендует настраивать reasoning effort для баланса скорости и качества. ([developers.openai.com][4])                                                              |
| Строгий JSON-вывод        | **Structured Outputs + JSON Schema**      | Чтобы AVG возвращала валидируемые структуры: claims, terms, risks, modes, concept maps. Structured Outputs доступны через function calling и через `json_schema` response format. ([platform.openai.com][5])                                                       |
| Подключение инструментов  | **Function Calling**                      | Вызовы собственных функций: `validate_claim`, `save_term`, `build_concept_map`, `detect_substitution`, `export_document`.                                                                                                                                          |
| Поиск по документам       | **OpenAI Vector Stores + File Search**    | RAG по книгам, заметкам, проектным документам, прошлым сессиям. Vector stores используются для semantic search и `file_search` в Responses/Assistants API. ([platform.openai.com][6])                                                                              |
| Актуальный поиск          | **OpenAI Web Search tool**                | Проверка современных технологий, конкурентов, источников, документации.                                                                                                                                                                                            |
| Голосовой режим           | **OpenAI Realtime API**                   | Голосовой AVG: пользователь думает вслух, система фиксирует карту и задаёт вопросы. Realtime API предназначен для voice agents и speech-to-speech interactions; для браузера OpenAI рекомендует Agents SDK for TypeScript через WebRTC. ([platform.openai.com][7]) |
| Агентное программирование | **Codex / Codex models / Codex CLI**      | Генерация кода, рефакторинг, тесты, патчи, работа с репозиторием.                                                                                                                                                                                                  |
| Безопасность              | **OpenAI Moderation API**                 | Проверка опасного, вредного или недопустимого контента.                                                                                                                                                                                                            |
| Изображения               | **OpenAI Image Generation**               | Генерация визуальных карт, концепт-иллюстраций, мудбордов, схем.                                                                                                                                                                                                   |

# 2. Backend

| Технология                | Конкретное ПО                                          | Назначение                                                                                        |
| ------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Основной backend          | **Node.js + TypeScript**                               | Главная серверная логика AVG. Хорошо подходит для OpenAI SDK, Realtime API, WebRTC, web-продукта. |
| Backend framework         | **Fastify** или **NestJS**                             | API, middleware, auth, routing, rate limits.                                                      |
| Альтернатива / ML-сервисы | **Python + FastAPI**                                   | Валидация, обработка файлов, batch jobs, eval pipeline, аналитика.                                |
| Очереди задач             | **BullMQ + Redis**                                     | Асинхронная обработка документов, построение индексов, генерация отчётов.                         |
| Надёжные workflow         | **Temporal**                                           | Длинные процессы: импорт корпуса, пересчёт карты, evals, генерация артефактов.                    |
| API gateway               | **Kong**, **Traefik** или **NGINX**                    | Проксирование, лимиты, безопасность, маршрутизация.                                               |
| WebSocket gateway         | **Socket.IO**, **uWebSockets.js** или native WebSocket | Реалтайм-чат, стриминг ответов, статусы инструментов.                                             |

Рекомендация: для MVP бери **Node.js + TypeScript + Fastify**. NestJS мощнее, но тяжелее. Fastify проще и быстрее для старта.

# 3. Frontend

| Технология          | Конкретное ПО                  | Назначение                                                     |
| ------------------- | ------------------------------ | -------------------------------------------------------------- |
| Web-приложение      | **Next.js**                    | Основной frontend, SSR, routing, API routes при необходимости. |
| UI                  | **React**                      | Интерфейс чата, карты, редактора, панелей режимов.             |
| Типизация           | **TypeScript**                 | Единые типы для frontend/backend/schemas.                      |
| Стили               | **Tailwind CSS**               | Быстрая сборка аккуратного интерфейса.                         |
| UI-компоненты       | **shadcn/ui**                  | Карточки, формы, модалки, панели, таблицы.                     |
| Карты / графы       | **React Flow**                 | Визуализация карты терминов, утверждений, связей.              |
| Редактор документов | **Tiptap** или **ProseMirror** | Артефакты: концепты, манифесты, ТЗ, карты, сценарии.           |
| State management    | **Zustand**                    | Локальное состояние интерфейса.                                |
| Server state        | **TanStack Query**             | Загрузка проектов, сообщений, артефактов, карт.                |
| Голосовой интерфейс | **WebRTC**                     | Подключение к Realtime API в браузере.                         |
| Диаграммы           | **Recharts** или **ECharts**   | Метрики качества, графики evals, активность проекта.           |

# 4. Хранилища данных

| Тип данных               | Конкретное ПО                                        | Что хранить                                                            |
| ------------------------ | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| Основная БД              | **PostgreSQL**                                       | Пользователи, проекты, сессии, сообщения, артефакты, настройки.        |
| Векторный поиск          | **OpenAI Vector Stores**                             | Документы, заметки, прошлые концепты, фрагменты источников.            |
| Альтернативный vector DB | **pgvector**, **Qdrant**, **Pinecone**, **Weaviate** | Если нужен полный контроль над embeddings и retrieval.                 |
| Граф знаний              | **Neo4j**                                            | Термины, связи, утверждения, риски, области определения, уровни карты. |
| Кэш                      | **Redis**                                            | Сессии, rate limits, быстрый контекст, временные результаты.           |
| Файлы                    | **S3**, **Cloudflare R2**, **Google Cloud Storage**  | Загруженные документы, изображения, аудио, экспорты.                   |
| Полнотекстовый поиск     | **OpenSearch** или **Meilisearch**                   | Поиск по названиям, артефактам, заметкам, проектам.                    |
| Логи событий             | **ClickHouse**                                       | Аналитика, usage events, latency, cost tracking, eval history.         |

Для AVG я бы выбрал так:

```text
PostgreSQL — продуктовые данные
Neo4j — карта различений
OpenAI Vector Stores — поиск по документам
Redis — кэш и очереди
S3/R2 — файлы
ClickHouse — аналитика
```

# 5. Карта знаний и валидатор

| Технология              | Конкретное ПО                              | Назначение                                                                                                 |
| ----------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Схемы данных            | **JSON Schema**                            | Формальные схемы для node, edge, term, assertion, map.                                                     |
| Runtime validation в TS | **Zod**                                    | Валидация входов/выходов в приложении.                                                                     |
| JSON Schema validator   | **Ajv**                                    | Быстрая проверка больших JSON-карт.                                                                        |
| Python validation       | **Pydantic v2**                            | Если часть валидаторов пишется на Python.                                                                  |
| Graph queries           | **Cypher**                                 | Запросы к Neo4j.                                                                                           |
| Graph ORM / client      | **neo4j-driver**                           | Подключение backend к Neo4j.                                                                               |
| Rule engine             | **json-rules-engine** или кастомный engine | Правила: “метафора не факт”, “нетвёрдое нельзя описывать как объект”, “сильное слово требует определения”. |
| Дифф версий             | **jsondiffpatch**                          | Сравнение версий карты и артефактов.                                                                       |

Ключевые программные модули:

```text
ClaimExtractor
ClaimValidator
LanguageModeValidator
MapTerritoryGuard
MetaphorDetector
RiskClassifier
TermRegistry
ConceptMapBuilder
GraphSyncService
```

# 6. Агентная оркестрация

| Технология                 | Конкретное ПО                                             | Назначение                                                                                                                                                                               |
| -------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Главный оркестратор        | **Custom TypeScript Orchestrator**                        | Лучше писать свой, потому что логика AVG специфическая.                                                                                                                                  |
| OpenAI Agents              | **OpenAI Agents SDK for TypeScript**                      | Особенно полезно для Realtime/voice agents. OpenAI указывает Agents SDK for TypeScript как рекомендуемый старт для браузерных voice-agent сценариев с WebRTC. ([platform.openai.com][7]) |
| Tool registry              | **Собственный registry**                                  | Регистрация инструментов AVG: поиск, карта, валидация, экспорт.                                                                                                                          |
| Workflow engine            | **Temporal**                                              | Длинные агентные процессы.                                                                                                                                                               |
| LLM framework, опционально | **LangChain** или **LlamaIndex**                          | Можно использовать для RAG/agents, но для AVG я бы не делал их ядром.                                                                                                                    |
| Prompt registry            | **Langfuse Prompts** или собственная таблица в PostgreSQL | Версионирование системных инструкций и режимов.                                                                                                                                          |

Я бы не начинал с LangChain как основы. Для AVG важнее контролируемость, поэтому лучше:

```text
OpenAI Responses API
+ собственный orchestrator
+ собственный tool registry
+ строгие schemas
+ eval pipeline
```

# 7. Набор внутренних инструментов AVG

Вот конкретный список функций, которые нужно реализовать как tools через function calling.

| Tool                    | Что делает                                                           |
| ----------------------- | -------------------------------------------------------------------- |
| `search_project_memory` | Ищет по проектной памяти.                                            |
| `search_documents`      | Ищет по vector store / file search.                                  |
| `get_graph_context`     | Достаёт связанные термины и утверждения из Neo4j.                    |
| `save_concept_node`     | Сохраняет новый узел карты.                                          |
| `save_claim`            | Сохраняет утверждение со статусом.                                   |
| `validate_claim`        | Проверяет утверждение на риски.                                      |
| `detect_substitution`   | Ищет подмену карты территорией, метафоры фактом, признака сущностью. |
| `build_concept_map`     | Создаёт граф концепта.                                               |
| `compare_concepts`      | Сравнивает несколько вариантов идеи.                                 |
| `score_creativity`      | Оценивает новизну и силу идеи.                                       |
| `score_adequacy`        | Оценивает точность, границы и риски.                                 |
| `export_artifact`       | Экспортирует Markdown/PDF/DOCX.                                      |
| `create_visual_map`     | Создаёт визуальную карту для frontend.                               |
| `update_project_memory` | Запоминает решения проекта.                                          |

# 8. Observability, evals и контроль качества

| Технология              | Конкретное ПО                              | Назначение                                                      |
| ----------------------- | ------------------------------------------ | --------------------------------------------------------------- |
| LLM tracing             | **Langfuse**                               | Трассировка промптов, tool calls, стоимости, latency, качества. |
| Альтернатива            | **Helicone**                               | Логирование LLM-запросов и стоимости.                           |
| OpenTelemetry           | **OpenTelemetry SDK**                      | Стандартная трассировка backend-сервисов.                       |
| Метрики                 | **Prometheus + Grafana**                   | Дашборды latency, ошибок, очередей, нагрузки.                   |
| Ошибки frontend/backend | **Sentry**                                 | Ошибки приложения.                                              |
| Product analytics       | **PostHog**                                | Поведение пользователей, retention, funnels.                    |
| LLM evals               | **OpenAI Evals**, **promptfoo**, **Ragas** | Проверка качества ответов и retrieval.                          |
| Data quality            | **Great Expectations**                     | Проверка импортируемых данных и датасетов.                      |

Метрики AVG:

```text
Creativity Score
Adequacy Score
Clarity Score
Actionability Score
Claim Safety Score
Map Consistency Score
Retrieval Precision
User Correction Rate
Tool Failure Rate
Cost per Session
Latency per Mode
```

# 9. Безопасность, доступы, compliance

| Технология      | Конкретное ПО                                             | Назначение                                    |
| --------------- | --------------------------------------------------------- | --------------------------------------------- |
| Auth            | **Clerk**, **Auth0**, **Supabase Auth**                   | Регистрация, логин, workspace accounts.       |
| Permissions     | **Casbin**, **Oso**, **OpenFGA**                          | Роли, доступы к проектам, документам, картам. |
| Secrets         | **HashiCorp Vault**, **AWS Secrets Manager**, **Doppler** | Хранение ключей.                              |
| API security    | **Cloudflare WAF**, **rate limiting**, **bot protection** | Защита публичного API.                        |
| Data encryption | **PostgreSQL encryption + S3 encryption**                 | Шифрование данных.                            |
| Audit logs      | **PostgreSQL + ClickHouse**                               | Кто что открыл, изменил, экспортировал.       |
| Billing         | **Stripe**                                                | Подписки, лимиты, usage-based billing.        |

# 10. DevOps и деплой

| Технология       | Конкретное ПО                                          | Назначение                        |
| ---------------- | ------------------------------------------------------ | --------------------------------- |
| Контейнеризация  | **Docker**                                             | Единая среда разработки и деплоя. |
| Оркестрация      | **Kubernetes** или **Docker Compose для MVP**          | Production / local development.   |
| IaC              | **Terraform**                                          | Управление инфраструктурой.       |
| CI/CD            | **GitHub Actions**                                     | Тесты, сборка, деплой.            |
| Frontend hosting | **Vercel**                                             | Быстрый деплой Next.js.           |
| Backend hosting  | **Fly.io**, **Render**, **AWS ECS**, **GCP Cloud Run** | API и workers.                    |
| Database hosting | **Neon**, **Supabase**, **AWS RDS**                    | PostgreSQL.                       |
| Neo4j hosting    | **Neo4j AuraDB**                                       | Managed graph database.           |
| Redis hosting    | **Upstash Redis**, **AWS ElastiCache**                 | Кэш и очереди.                    |
| Object storage   | **Cloudflare R2** или **AWS S3**                       | Файлы.                            |

# 11. Минимальный стек MVP

Для первой рабочей версии не надо брать всё. Достаточно:

```text
Frontend:
  Next.js
  React
  TypeScript
  Tailwind
  shadcn/ui
  React Flow
  Tiptap

Backend:
  Node.js
  Fastify
  OpenAI SDK
  Responses API
  Structured Outputs
  Function Calling

AI:
  GPT-5.5 для сложных задач
  GPT-5.1 для быстрых UX-сценариев
  OpenAI Vector Stores / File Search
  OpenAI Web Search
  OpenAI Realtime API позже, не в первом спринте

Data:
  PostgreSQL
  Redis
  Neo4j
  S3 / Cloudflare R2

Validation:
  Zod
  Ajv
  JSON Schema

Observability:
  Langfuse
  Sentry
  PostHog
```

# 12. Продвинутая production-комплектация

```text
AI:
  OpenAI Responses API
  GPT-5.5
  GPT-5.1
  OpenAI Realtime API
  Structured Outputs
  Function Calling
  Vector Stores
  Web Search
  Moderation API
  Image Generation
  Codex models

Frontend:
  Next.js
  React
  TypeScript
  Tailwind
  shadcn/ui
  React Flow
  Tiptap
  TanStack Query
  Zustand
  WebRTC

Backend:
  Node.js
  Fastify
  Python FastAPI workers
  Temporal
  BullMQ
  Redis
  WebSocket gateway

Data:
  PostgreSQL
  Neo4j
  OpenAI Vector Stores
  S3 / R2
  ClickHouse
  Meilisearch or OpenSearch

Validation:
  JSON Schema
  Zod
  Ajv
  Pydantic
  Custom rule engine

Monitoring:
  Langfuse
  OpenTelemetry
  Prometheus
  Grafana
  Sentry
  PostHog

Security:
  Clerk/Auth0
  OpenFGA/Casbin
  Vault/Doppler
  Cloudflare WAF
  Stripe

DevOps:
  Docker
  Kubernetes
  Terraform
  GitHub Actions
  Vercel
  AWS/GCP/Fly.io
```

# 13. Рекомендуемая финальная сборка

Если выбирать без лишней экзотики, я бы сделал так:

| Слой           | Выбор                                      |
| -------------- | ------------------------------------------ |
| Главная модель | **GPT-5.5**                                |
| Быстрая модель | **GPT-5.1**                                |
| API            | **OpenAI Responses API**                   |
| Голос          | **OpenAI Realtime API**                    |
| Строгие ответы | **Structured Outputs**                     |
| Инструменты    | **Function Calling**                       |
| Документы      | **OpenAI Vector Stores / File Search**     |
| Backend        | **Node.js + TypeScript + Fastify**         |
| Frontend       | **Next.js + React + Tailwind + shadcn/ui** |
| Карты          | **React Flow + Neo4j**                     |
| Основная БД    | **PostgreSQL**                             |
| Кэш            | **Redis**                                  |
| Файлы          | **Cloudflare R2 или S3**                   |
| Валидация      | **Zod + Ajv + JSON Schema**                |
| Очереди        | **BullMQ**, позже **Temporal**             |
| Observability  | **Langfuse + Sentry + PostHog**            |
| Деплой         | **Vercel + Fly.io/AWS/GCP**                |

# 14. Самая короткая техническая формула

**AVG = GPT-5.5 + Responses API + Structured Outputs + Function Calling + Vector Stores + Neo4j + PostgreSQL + React Flow + собственный валидатор карты.**

И самое важное: **OpenAI даёт интеллект и инструментальность, но уникальность AVG создаёт не модель, а слой карты, правил утверждений и валидатора адекватности.**

[1]: https://platform.openai.com/docs/api-reference/responses/public.tar.gz?utm_source=chatgpt.com "Responses | OpenAI API Reference"
[2]: https://openai.com/index/introducing-gpt-5-5/?utm_source=chatgpt.com "Introducing GPT‑5.5 - OpenAI"
[3]: https://openai.com/index/gpt-5-1-for-developers/?utm_source=chatgpt.com "Introducing GPT‑5.1 for developers - OpenAI"
[4]: https://developers.openai.com/api/docs/guides/latest-model?utm_source=chatgpt.com "Using GPT-5.5 | OpenAI API - developers.openai.com"
[5]: https://platform.openai.com/docs/guides/structured-outputs/introduction%29.avif?utm_source=chatgpt.com "Structured model outputs - OpenAI API"
[6]: https://platform.openai.com/docs/api-reference/vector-stores/modify?_clear=true&ref=canvas&utm_source=chatgpt.com "Vector stores | OpenAI API Reference"
[7]: https://platform.openai.com/docs/guides/realtime/continuing-conversations%3B.zst?utm_source=chatgpt.com "Realtime API - OpenAI API"
