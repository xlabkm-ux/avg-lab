# Эзоагностика Реальности - JSON Модель

## Обзор

Это репозиторий содержит JSON-модель для хранения онтологии, методологии, терминологии и карт **Эзоагностики Реальности (ЭР)**.

**Ключевой принцип:** Каждый термин, связь и утверждение хранят область определения, режим доступности, уровень вложенности, допустимый язык и границы права на утверждение. Это следует из базовой логики ЭР: карта нужна, но обязана помнить, что она карта; иначе она превращается в догму и начинает производить невежество вместо адекватности.

## Источники

Модель основана на следующих документах:
- **Том 1: Реальность** - Онтология Реальности, методология ЭР, карта уровней, режимы доступности, причинность
- **Том 2: Человек** - Модель человека: тело, психика, субъективная реальность, МОМ, субмодель, сущностное пространство
- **Модель AVG** - Рабочая JSON-структура для хранения модели ЭР

## Структура проекта

```
er-map/
├── manifest.json              # Метаданные проекта и структура
├── schema.json                # JSON Schema для валидации всех файлов
├── README.md                  # Этот файл
├── sprint_0_summary.json      # Отчёт о выполнении Спринта 0
│
├── vocabularies/              # Контролируемые словари (справочники)
│   ├── nesting_levels.json    # Уровни вложенности
│   ├── access_modes.json      # Режимы доступности
│   ├── objectivity_modes.json # Режимы объектности
│   ├── hardness_modes.json    # Режимы твёрдости
│   ├── language_modes.json    # Режимы языка
│   ├── claim_statuses.json    # Статусы утверждений
│   ├── causality_types.json   # Типы причинности
│   ├── adequacy_risks.json    # Риски адекватности
│   ├── node_types.json        # Типы узлов
│   └── relation_types.json    # Типы связей
│
├── sources/                   # Источники и ссылки
│   ├── sources.json           # Реестр источников
│   ├── vol_1_reality.json     # Детали Тома 1
│   ├── vol_2_human.json       # Детали Тома 2
│   └── source_fragments.json  # Ключевые цитаты и фрагменты
│
├── ontology/                  # Онтологические фреймы
│   ├── reality.json           # Предельная рамка Реальности
│   ├── universe.json          # Материальная Вселенная
│   ├── world.json             # Мир (твёрдое + нетвёрдое)
│   ├── metareality.json       # МетаРеальность
│   ├── global_definition_areas.json  # Глобальные области определения
│   ├── accessibility_zones.json      # Зоны доступности
│   ├── hard_nonhard_map.json         # Карта твёрдого/нетвёрдого
│   ├── objective_subjective_map.json # Карта объективного/субъективного
│   └── causality_layers.json         # Слои причинности
│
├── methodology/               # Методологические концепции
│   ├── adequacy.json          # Адекватность как минимизация искажений
│   ├── definition_area.json   # Область определения
│   ├── ignorance.json         # Невежество и его типы
│   ├── map_and_territory.json # Карта и территория
│   ├── language_limit.json    # Границы языка
│   ├── valid_claim_structure.json   # Структура допустимого утверждения
│   └── substitution_errors.json     # Ошибки подстановки
│
├── terms/                     # Терминология по категориям
│   ├── terms_index.json       # Главный индекс всех терминов
│   ├── reality_terms.json     # Термины Реальности (~20)
│   ├── methodology_terms.json # Термины методологии (~15)
│   ├── world_terms.json       # Термины Мира (~15)
│   ├── being_terms.json       # Термины Бытия (~15)
│   ├── human_terms.json       # Термины Человека (~25)
│   ├── psychology_terms.json  # Термины психологии (~20)
│   ├── social_terms.json      # Социальные термины (~10)
│   └── prohibited_or_risky_terms.json  # Запрещённые/рискованные термины (~15)
│
├── nodes/                     # Узлы карты (термины, феномены, процессы)
├── edges/                     # Связи между узлами
├── maps/                      # Схемы, матрицы, лестницы
├── validation/                # Отчёты валидации
└── scripts/                   # Вспомогательные скрипты
```

## Как добавить новый файл

### 1. Выберите тип файла и директорию

Определите, к какой категории относится ваш файл:
- **Справочник** → `vocabularies/`
- **Источник** → `sources/`
- **Онтология** → `ontology/`
- **Методология** → `methodology/`
- **Терминология** → `terms/`

### 2. Создайте JSON файл со структурой

Каждый файл должен следовать схеме из `schema.json`. Основные требования:

#### Для онтологических фреймов:
```json
{
  "file_type": "ontology",
  "items": [
    {
      "id": "unique_id",
      "type": "ontological_frame",
      "label": {"ru": "Название", "short": "Кратко"},
      "definition": {
        "text": "Определение...",
        "definition_type": "working_boundary_definition",
        "source_refs": ["vol_1_reality"]
      },
      "coordinates": {
        "nesting_level": "reality",
        "objectivity_mode": "not_applicable",
        "hardness_mode": "not_applicable",
        "access_mode": "mixed"
      },
      "language_policy": {
        "allowed_modes": ["working_distinction", "boundary_statement"],
        "forbidden_modes": ["total_explanation"]
      },
      "claim_policy": {
        "default_claim_status": "working_distinction",
        "positive_claims_allowed": false
      },
      "map_safety": {
        "known_risks": ["map_territory_substitution", "dogma"],
        "anti_substitution_rule": "Правило..."
      }
    }
  ]
}
```

#### Для терминов:
```json
{
  "file_type": "term",
  "items": [
    {
      "id": "term_example",
      "label": "пример",
      "aliases": ["альтернатива"],
      "definition": "Определение термина...",
      "term_role": "distinction_node",
      "coordinates": {
        "nesting_level": "world",
        "access_mode": "indirectly_accessible"
      },
      "allowed_language": ["operational_description"],
      "forbidden_language": ["direct_object_description"],
      "common_substitutions": [
        {
          "error": "Типичная ошибка...",
          "risk": "term_reification"
        }
      ]
    }
  ]
}
```

#### Для справочников:
```json
{
  "vocabulary_id": "nesting_levels",
  "vocabulary_name": "Уровни вложенности",
  "values": [
    {
      "id": "universe",
      "label": "Вселенная",
      "description": "Материальная вселенная..."
    }
  ]
}
```

### 3. Валидируйте файл

Используйте скрипт валидации:
```bash
python scripts/validate.py path/to/your/file.json
```

## Запрещённые ошибки

При работе с моделью **категорически запрещено**:

1. **Подстановка карты территорией** - Термин не является самим объектом, это узел различения
2. **Реификация терминов** - Не превращать абстрактные понятия в конкретные объекты
3. **Абсолютизация схемы** - Схема рабочая, не абсолютная истина
4. **Смешение уровней** - Не смешивать утверждения разных уровней вложенности
5. **Смешение режимов доступности** - Косвенная доступность ≠ прямое знание
6. **Редукционизм** - Не сводить сложные явления к простым объяснениям
7. **Догматизация** - Любое утверждение имеет статус рабочей гипотезы, не догмы

## Контролируемые словари

Все файлы должны использовать значения из контролируемых словарей в `vocabularies/`:

- **Уровни вложенности:** `universe`, `world`, `metareality`, `reality`
- **Режимы доступности:** `knowable`, `indirectly_accessible`, `unknowable`
- **Режимы объектности:** `objective`, `subjective`, `mixed`, `not_applicable`, `unknown`
- **Режимы твёрдости:** `hard`, `nonhard`, `mixed`, `not_applicable`, `unknown`
- **Режимы языка:** `direct_description`, `operational_description`, `conditional_description`, `metaphor`, `symbolic_pointer`, `silence_required`
- **Статусы утверждений:** `definition`, `working_distinction`, `operational_marker`, `indirect_sign`, `hypothesis`, `metaphor_only`, `prohibited_positive_claim`
- **Риски адекватности:** `term_reification`, `scheme_absolutization`, `map_territory_substitution`, `sign_to_entity_substitution`, `level_mixing`, `access_mode_mixing`, `strong_word_substitution`, `reductionism`, `fairy_tale`, `dogma`, `social_confirmation_as_proof`

## Python окружение

Для работы с моделью требуется Python 3.12+ и зависимости из `requirements.txt`:

```bash
pip install -r requirements.txt
```

Основные библиотеки:
- `python-docx` - работа с .docx файлами
- `jsonschema` - валидация JSON файлов
- `tiktoken` - подсчёт токенов для мониторинга контекста
- `pydantic` - дополнительная валидация данных

## Статус проекта

- **Версия модели:** 1.0.0
- **Ожидаемое количество файлов:** 107
- **Текущий спринт:** 1 (корневые файлы)

---

*Документ создан: 2026-05-20*
*На основе: Модель AVG.docx, Том_1_ЭР_Реальность.docx, Том_2_ЭР_Человек.docx*
