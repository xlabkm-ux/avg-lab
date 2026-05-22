# План: AVG Unified Task Dialogue

## Summary
Цель: превратить `Dialogue` в единую точку входа AVG, где пользователь просто формулирует задачу, а система сама определяет процесс: уточнить, предложить варианты, построить ответ, проверить утверждения, подключить LLM при неполноте, направить к документам/карте/артефактам.

Пользователь не должен знать внутренние режимы, fallback-и, validators или LLM-механику. Эти механизмы остаются внутри системы и проявляются только как понятные пользовательские состояния: “нужно уточнение”, “есть несколько путей”, “недостаточно оснований”, “ответ требует проверки”, “можно собрать артефакт”.

Оценка токенов предварительная. `IN` = контекст, чтение кода, анализ, инструкции. `OUT` = код, тесты, документация, финальные пояснения.

## Sprint 1: Product Contract And Unified Flow
| Task | Задача | Результат | Tokens IN | Tokens OUT |
|---|---|---|---:|---:|
| AVG-UD-001 | Обновить концепт Unified Task Dialogue | Документирован единый пользовательский процесс без управления режимами | 18k | 6k |
| AVG-UD-002 | Описать intent taxonomy | Типы пользовательских задач: идея, вопрос, проверка, карта, артефакт, источник | 14k | 5k |
| AVG-UD-003 | Описать пользовательские состояния | `needs_clarification`, `guided_choice`, `answer_ready`, `needs_evidence`, `artifact_ready` | 14k | 5k |
| AVG-UD-004 | Зафиксировать LLM adaptive policy | LLM как внутренний усилитель, не пользовательский режим | 16k | 6k |
| AVG-UD-005 | Обновить MVP-5 interface/API contract | Контракт Dialogue как главной точки входа | 20k | 8k |

## Sprint 2: Interface Language Layer
| Task | Задача | Результат | Tokens IN | Tokens OUT |
|---|---|---|---:|---:|
| AVG-UI-101 | Добавить `Locale = ru/en` | Типизированный UI locale без новой зависимости | 12k | 4k |
| AVG-UI-102 | Создать словари интерфейса | RU/EN labels для shell, nav, Dialogue, errors, buttons | 16k | 7k |
| AVG-UI-103 | Добавить переключатель RU/EN | Header toggle + localStorage persistence | 16k | 6k |
| AVG-UI-104 | Перевести shell/navigation на i18n | Все видимые shell-строки берутся из словаря | 18k | 7k |
| AVG-UI-105 | Покрыть i18n тестами | Проверка обязательных ключей и поведения toggle | 14k | 5k |

## Sprint 3: Dialogue MVP Surface
| Task | Задача | Результат | Tokens IN | Tokens OUT |
|---|---|---|---:|---:|
| AVG-DLG-201 | Заменить placeholder Dialogue | Рабочий composer, thread, empty/loading/error states | 24k | 10k |
| AVG-DLG-202 | Добавить structured details panel | Видимые `scope`, `claim_status`, `risk`, `boundary`, `next_action` | 22k | 9k |
| AVG-DLG-203 | Добавить progressive disclosure | Основной ответ простой, детали в блоке “Проверка и границы” | 18k | 7k |
| AVG-DLG-204 | Добавить deterministic RU response adapter | Локальный валидный русский `AvgStructuredResponse` | 20k | 8k |
| AVG-DLG-205 | Добавить Dialogue tests | Empty input, valid response, invalid response boundary | 20k | 8k |

## Sprint 4: Unified Task Orchestrator
| Task | Задача | Результат | Tokens IN | Tokens OUT |
|---|---|---|---:|---:|
| AVG-ORCH-301 | Реализовать intake classifier | Определение типа задачи без участия пользователя | 24k | 10k |
| AVG-ORCH-302 | Реализовать adequacy gate | `adequate`, `incomplete`, `uncertain`, `invalid` | 24k | 9k |
| AVG-ORCH-303 | Реализовать clarification flow | 1-3 наводящих вопроса вместо слабого ответа | 26k | 10k |
| AVG-ORCH-304 | Реализовать guided choice flow | Простые варианты маршрута, когда задача неоднозначна | 26k | 10k |
| AVG-ORCH-305 | Интегрировать orchestrator в Dialogue | Пользователь видит единый процесс, не внутренние режимы | 30k | 12k |
| AVG-ORCH-306 | Покрыть orchestrator тестами | Intent, adequacy, clarification, guided choice scenarios | 26k | 10k |

## Sprint 5: Adaptive LLM Layer
| Task | Задача | Результат | Tokens IN | Tokens OUT |
|---|---|---|---:|---:|
| AVG-LLM-401 | Расширить `@avg/openai` adapter | Server-side provider boundary для structured response draft | 30k | 12k |
| AVG-LLM-402 | Добавить LLM config | `AVG_LLM_ADAPTIVE`, `OPENAI_API_KEY`, `OPENAI_MODEL` | 18k | 6k |
| AVG-LLM-403 | Создать русский LLM system prompt | LLM помогает, но не обходит карту/валидацию | 24k | 8k |
| AVG-LLM-404 | Добавить LLM fallback pipeline | Автовызов при `incomplete/uncertain`, deterministic fallback при сбое | 34k | 14k |
| AVG-LLM-405 | Добавить LLM validation boundary | Raw LLM output не показывается, если schema validation failed | 28k | 10k |
| AVG-LLM-406 | Покрыть LLM fallback тестами | No key, disabled flag, invalid output, accepted output | 30k | 12k |

## Sprint 6: API Boundary For Unified Dialogue
| Task | Задача | Результат | Tokens IN | Tokens OUT |
|---|---|---|---:|---:|
| AVG-API-501 | Добавить `POST /dialogue/respond` | Единая точка для Dialogue pipeline | 30k | 12k |
| AVG-API-502 | Нормализовать response envelope | `response`, `source`, `adequacy`, `state`, `warnings` | 24k | 9k |
| AVG-API-503 | Добавить normalized errors | Empty input, invalid response, LLM unavailable, LLM rejected | 24k | 9k |
| AVG-API-504 | Подключить React Dialogue к API | `/api/dialogue/respond` через Vite proxy | 28k | 11k |
| AVG-API-505 | API contract tests | Request/response shape и fallback paths | 26k | 10k |

## Sprint 7: User Guidance Across Surfaces
| Task | Задача | Результат | Tokens IN | Tokens OUT |
|---|---|---|---:|---:|
| AVG-GUIDE-601 | Добавить surface suggestions | AVG предлагает Documents/Map/Artifacts по смыслу задачи | 26k | 10k |
| AVG-GUIDE-602 | Добавить “next useful move” UI | Единая кнопка/действие следующего шага | 22k | 8k |
| AVG-GUIDE-603 | Связать needs_evidence с Documents | Если нужны источники, система предлагает добавить документ | 24k | 9k |
| AVG-GUIDE-604 | Связать map-ready с Map | Если появились понятия/связи, система предлагает карту | 24k | 9k |
| AVG-GUIDE-605 | Связать artifact-ready с Artifacts | Если материал готов, система предлагает экспорт/артефакт | 24k | 9k |

## Sprint 8: E2E And Hardening
| Task | Задача | Результат | Tokens IN | Tokens OUT |
|---|---|---|---:|---:|
| AVG-QA-701 | E2E happy path | Задача → уточнение/выбор → ответ → детали проверки | 30k | 12k |
| AVG-QA-702 | E2E LLM unavailable path | Система мягко падает в deterministic mode | 26k | 10k |
| AVG-QA-703 | E2E invalid LLM output path | Raw LLM не попадает пользователю | 26k | 10k |
| AVG-QA-704 | E2E UI language path | RU/EN меняет интерфейс, диалог остаётся русским | 24k | 9k |
| AVG-QA-705 | Accessibility smoke | Основные controls доступны и имеют имена | 22k | 8k |
| AVG-QA-706 | Visual smoke | Dialogue, details, choices, errors без наложений | 24k | 9k |

## Sprint 9: Documentation And Backlog Control
| Task | Задача | Результат | Tokens IN | Tokens OUT |
|---|---|---|---:|---:|
| AVG-DOC-801 | Обновить user-facing описание AVG | AVG как проводник процесса, не панель режимов | 18k | 7k |
| AVG-DOC-802 | Обновить developer docs | Orchestrator, adequacy, LLM boundary, i18n rules | 24k | 10k |
| AVG-DOC-803 | Обновить `.env.example` | Документированы LLM adaptive vars | 10k | 3k |
| AVG-DOC-804 | Добавить known limitations | Русский диалог, UI-only bilingual, no live translation yet | 14k | 5k |
| AVG-DOC-805 | Обновить backlog по регламенту | Финансовый контроль токенов и фактический статус работ | 16k | 6k |

## Token Budget Summary
| Sprint | Tokens IN | Tokens OUT |
|---|---:|---:|
| Sprint 1 | 82k | 30k |
| Sprint 2 | 76k | 29k |
| Sprint 3 | 104k | 42k |
| Sprint 4 | 156k | 61k |
| Sprint 5 | 164k | 62k |
| Sprint 6 | 132k | 51k |
| Sprint 7 | 120k | 45k |
| Sprint 8 | 152k | 58k |
| Sprint 9 | 82k | 31k |
| **Total** | **1,068k** | **409k** |

## Acceptance Criteria
- Пользователь формулирует задачу без знания режимов AVG.
- Система сама выбирает: ответить, уточнить, предложить маршрут, запросить источник, подготовить карту или артефакт.
- LLM включается автоматически только как внутренний adaptive layer.
- LLM output никогда не обходит `AvgStructuredResponse` validation.
- Диалог остаётся на русском.
- Интерфейс переключается RU/EN.
- Основные проверки проходят: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
- После каждой завершённой задачи backlog обновляется по регламенту проекта.
