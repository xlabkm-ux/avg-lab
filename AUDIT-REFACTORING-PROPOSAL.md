# Аудит проекта AVG Codex Lab и предложения по рефакторингу

**Дата:** 21 мая 2026  
**Статус проекта:** MVP-5 (ранняя стадия)  
**Версия аудита:** 1.0

---

## Executive Summary

AVG Codex Lab — это хорошо спроектированная, но неполная система креативных диалогов с AI. Архитектура монорепозитория построена правильно, документация отличная, принципы продукта четкие. Однако проект находится на ранней стадии разработки: **47% пакетов пусты**, отсутствует персистентный слой хранения данных, нет observability инфраструктуры, и есть серьезные проблемы с качеством кода (дублирование, монолитные файлы).

### Ключевые метрики

- **Всего пакетов:** 17 (9 реализовано, 8 пустых)
- **Общий объем кода:** ~3,000+ строк в трех крупнейших файлах
- **Тестовое покрытие:** Хорошее в реализованных пакетах, отсутствует в пустых
- **CI/CD:** Полноценный pipeline с quality gates
- **Документация:** Отличная структура (13 категорий + ADRs)

---

## 1. Обнаруженные проблемы

### 🔴 КРИТИЧЕСКИЕ ПРОБЛЕМЫ (High Priority)

#### 1.1. Восемь пустых пакетов (47% кодовой базы)

**Пакеты без реализации:**
- `packages/avg-core` — Shared types, Result pattern, errors
- `packages/avg-ui` — UI components
- `packages/avg-memory` — Memory management
- `packages/avg-config` — Configuration management
- `packages/avg-knowledge` — Knowledge base access
- `packages/avg-claim-court` — Claim adjudication
- `packages/avg-concept-forge` — Concept generation
- `packages/avg-observability` — Telemetry and monitoring

**Проблема:** Все пакеты имеют только README.md и `.gitkeep` в src/, но включены в tsconfig.json как project references. Это создает иллюзию завершенности и может привести к ошибкам импорта.

**Риск:** Средний  
**Влияние:** Путаница в архитектуре, невозможность использовать заявленные паттерны (Result type)

**Рекомендация:** Либо реализовать минимальную функциональность, либо удалить из tsconfig.json до момента реальной необходимости.

---

#### 1.2. Монолитные файлы (>900 строк каждый)

**Крупнейшие файлы:**

1. **`apps/web/src/index.ts` — 1,458 строк**
   - Содержит весь веб-сервер, маршрутизацию, обработчики, типы, middleware
   - Нарушает принцип единственной ответственности
   - Сложно тестировать и поддерживать

2. **`apps/api/src/index.ts` — 921 строка**
   - Весь HTTP API сервер в одном файле
   - Смешаны маршруты, бизнес-логика, обработка ошибок

3. **`packages/avg-validation/src/index.ts` — 690 строк**
   - Вся логика валидации claims, классификации, оценки рисков, grounding
   - Должна быть разделена на модули

**Проблема:** Большие файлы трудно читать, тестировать, ревьювить и рефакторить. Высокая связность компонентов.

**Риск:** Высокий  
**Влияние:** Снижение скорости разработки, рост числа багов, сложность онбординга новых разработчиков

**Рекомендация:** Разделить на модули по принципу domain-driven design (см. раздел 2.1).

---

#### 1.3. Дублирование кода в пакетах

**Дублирующиеся функции:**

```typescript
// Найдено в 4 пакетах: avg-validation, avg-agents, avg-retrieval, avg-evals
function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}
```

```typescript
// Найдено в 2 пакетах: avg-validation, avg-evals
function collectStrongWordMarkers(text: string): string[] { ... }
function collectStrongWordHits(text: string): string[] { ... }
```

**Проблема:** При изменении логики нужно обновлять код в нескольких местах. Риск рассинхронизации.

**Риск:** Средний  
**Влияние:** Технический долг, инconsistency при изменениях

**Рекомендация:** Вынести в `avg-core` или новый пакет `@avg/utils`.

---

#### 1.4. Дублирование типов данных

**Тип `AvgRetrievalHit` определен дважды:**

```typescript
// packages/avg-retrieval/src/index.ts (строка ~20)
export interface AvgRetrievalHit {
  snippet_id: string;
  document_id: string;
  project_id: string;
  score: number;
  confidence: "low" | "medium" | "high";
  citation_id: string;
  matched_text: string;
  source_label: string;
}

// packages/avg-validation/src/index.ts (строка 55)
export interface AvgRetrievalHit { ... } // идентичное определение
```

**Проблема:** Типы могут разойтись при эволюции системы. Нарушается DRY принцип.

**Риск:** Средний  
**Влияние:** Potential type mismatch bugs, confusion about source of truth

**Рекомендация:** Удалить дубликат из avg-validation, импортировать из avg-retrieval.

---

#### 1.5. Отсутствие TypeScript ESLint конфигурации

**Текущая конфигурация (`eslint.config.mjs`):**
```javascript
{
  files: ["*.js", "*.mjs", "*.cjs"],  // ТОЛЬКО JavaScript!
  languageOptions: { ecmaVersion: "latest" },
  rules: { "no-unused-vars": "error", "no-undef": "error" }
}
```

**Проблема:** Проект использует TypeScript 6.0.3 со strict mode, но ESLint не проверяет TS файлы. Нет правил для:
- Null safety (`@typescript-eslint/no-unsafe-assignment`)
- Type assertions
- Interface naming conventions
- Explicit module boundaries

**Риск:** Высокий  
**Влияние:** Пропуск серьезных TS ошибок, несогласованный стиль кода

**Рекомендация:** Добавить `@typescript-eslint/eslint-plugin` с recommended ruleset.

---

#### 1.6. Отсутствие стратегии обработки ошибок

**Текущее состояние:**
- Ошибки выбрасываются как plain `Error` objects
- Нет централизованной обработки
- Нет типизированных error types
- Нет Result/Either pattern (упомянут в avg-core README, но не реализован)

**Пример проблемного кода:**
```typescript
// apps/api/src/index.ts
if (!body) throw new Error("Input is required"); // Generic error
```

**Проблема:** Невозможно программно обработать ошибки, нет контекста для дебаггинга.

**Риск:** Средний  
**Влияние:** Плохой DX, сложно отслеживать root cause в production

**Рекомендация:** Реализовать Result<E, T> pattern в avg-core, создать domain-specific error classes.

---

#### 1.7. Хранение данных только в памяти

**Текущее состояние:**
```typescript
// apps/api/src/index.ts
const projects = new Map<string, ProjectRecord>();
const sessions = new Map<string, SessionRecord>();
const messages = new Map<string, MessageRecord>();
```

**Проблема:** 
- Graph repository полностью in-memory (нет persistence)
- Document repository in-memory
- Данные теряются при перезапуске
- PostgreSQL/Neo4j настроены в docker-compose, но не используются

**Риск:** Критический для production  
**Влияние:** Невозможность использования в реальном продакшене

**Рекомендация:** Реализовать repository pattern с PostgreSQL для документов и Neo4j для графа.

---

### 🟡 ПРОБЛЕМЫ СРЕДНЕГО ПРИОРИТЕТА (Medium Priority)

#### 2.1. Риск циклических зависимостей

**Необычная зависимость:**
```
apps/api → @avg/web  // API не должен зависеть от web!
```

**Проблема:** API сервер импортирует функции рендеринга из web пакета. Это нарушает layer architecture.

**Риск:** Средний  
**Влияние:** Потенциальные circular dependencies при росте проекта

**Рекомендация:** Вынести shared rendering logic в отдельный пакет `@avg/rendering`.

---

#### 2.2. Отсутствие observability инфраструктуры

**Текущее состояние:**
- Пакет `avg-observability` пустой
- Только базовое файловое логирование в API (`writeApiErrorLog`)
- Нет structured logging
- Нет metrics collection
- Нет distributed tracing

**Проблема:** Невозможно мониторить production систему, дебажить performance issues, track business metrics.

**Риск:** Высокий для production  
**Влияние:** Слепая эксплуатация, реактивное вместо проактивного подхода

**Рекомендация:** Внедрить pino/winston для логов, Prometheus для метрик, OpenTelemetry для tracing.

---

#### 2.3. Limited test fixtures и отсутствие property-based testing

**Текущее состояние:**
- Малое количество JSON fixtures в `tests/fixtures/`
- Нет fuzzing для AI inputs
- Нет property-based testing (fast-check)
- Нет coverage reporting

**Проблема:** Тесты покрывают happy path, но miss edge cases и adversarial inputs.

**Риск:** Средний  
**Влияние:** Пропуск багов в production, особенно в AI validation logic

**Рекомендация:** Добавить fast-check для property-based testing, увеличить variety fixtures.

---

#### 2.4. Отсутствие performance testing

**Текущее состояние:**
- Нет benchmarks
- Нет load testing
- Graph diff использует `JSON.stringify` comparison (O(n) string comparison instead of structural diff)

**Пример неэффективного кода:**
```typescript
// packages/avg-graph/src/index.ts
const changed = JSON.stringify(a) !== JSON.stringify(b); // Expensive!
```

**Проблема:** Performance деградирует с ростом graph size, нет baseline для сравнения.

**Риск:** Средний  
**Влияние:** Slow response times при большом количестве nodes/edges

**Рекомендация:** Заменить JSON.stringify diff на structural comparison, добавить benchmarks.

---

#### 2.5. Security gaps

**Текущие проблемы:**

1. **Prompt injection detection regex-based:**
   ```typescript
   // packages/avg-security/src/index.ts
   const injectionPatterns = [/ignore.*instructions/i, /system.*prompt/i];
   // Можно обойти с помощью obfuscation
   ```

2. **No rate limiting implementation**
3. **No authentication/authorization**
4. **Environment variables not validated**

**Риск:** Высокий для production  
**Влияние:** Vulnerable to prompt injection attacks, abuse, data leaks

**Рекомендация:** Implement proper input sanitization, add rate limiting, validate env vars on startup.

---

#### 2.6. Inconsistent naming conventions

**Пример:**
```typescript
interface AvgClaim {
  claim_status: string;      // snake_case
  languageMode: string;      // camelCase ❌
  access_mode: string;       // snake_case
}
```

**Проблема:** Смешение snake_case и camelCase в одном объекте путает разработчиков.

**Риск:** Низкий  
**Влияние:** Cognitive load, inconsistency в codebase

**Рекомендация:** Стандартизировать на camelCase для TypeScript (industry standard).

---

### 🟢 НИЗКИЙ ПРИОРИТЕТ (Nice to Have)

#### 3.1. No Internationalization
- Все строки hardcoded на английском
- Нет i18n framework

#### 3.2. No Caching Strategy
- Нет HTTP caching headers
- Нет CDN integration
- Нет query result caching

#### 3.3. Limited Error Messages
```typescript
throw new Error("Input is required"); // Неясно, какой именно input
```

#### 3.4. No Feature Flags
- Нет возможности gradual rollouts
- Нельзя A/B test features

---

## 2. План рефакторинга

### Фаза 1: Foundation (Недели 1-2) ⚡ IMMEDIATE

#### Задача 1.1: Реализовать пакет avg-core

**Цель:** Создать foundation для всего проекта

**Что включить:**
```typescript
// packages/avg-core/src/index.ts

// 1. Result pattern for error handling
export type Result<E, T> = 
  | { success: true; data: T }
  | { success: false; error: E };

export function ok<T>(data: T): Result<never, T> { ... }
export function err<E>(error: E): Result<E, never> { ... }

// 2. Shared utility functions
export function normalizeText(value: string): string { ... }
export function dedupe(values: string[]): string[] { ... }
export function deepEqual(a: any, b: any): boolean { ... }

// 3. Domain-specific error types
export class ValidationError extends Error { ... }
export class NotFoundError extends Error { ... }
export class AuthenticationError extends Error { ... }

// 4. Common patterns
export type Option<T> = Some<T> | None;
export type AsyncResult<E, T> = Promise<Result<E, T>>;
```

**Тесты:**
- Unit tests для всех pure functions
- Property-based tests для edge cases

**Изменения после реализации:**
- Удалить дубликаты `normalizeText()` из 4 пакетов
- Импортировать из `@avg/core` везде
- Обновить обработку ошибок в API/validation

**Оценка усилий:** 2-3 дня

---

#### Задача 1.2: Разделить монолитные файлы

**1.2.1. Refactor apps/web/src/index.ts (1,458 lines)**

**Новая структура:**
```
apps/web/src/
├── index.ts              # Entry point (50 lines)
├── routes/
│   ├── dialogue.ts       # Dialogue endpoints
│   ├── projects.ts       # Project management
│   ├── sessions.ts       # Session management
│   └── maps.ts           # Map visualization
├── handlers/
│   ├── dialogue.handler.ts
│   ├── project.handler.ts
│   └── session.handler.ts
├── middleware/
│   ├── cors.ts
│   ├── logging.ts
│   └── error-handler.ts
├── services/
│   ├── workspace.service.ts
│   ├── storage.service.ts
│   └── navigation.service.ts
├── types/
│   ├── workspace.types.ts
│   └── navigation.types.ts
└── utils/
    └── render.helpers.ts
```

**Оценка усилий:** 1-2 дня

---

**1.2.2. Refactor apps/api/src/index.ts (921 line)**

**Новая структура:**
```
apps/api/src/
├── index.ts              # Server bootstrap (50 lines)
├── routes/
│   ├── health.ts         # GET /health
│   ├── projects.ts       # Project CRUD
│   ├── sessions.ts       # Session management
│   ├── documents.ts      # Document upload/search
│   └── maps.ts           # Map snapshots/diffs
├── handlers/
│   ├── project.handler.ts
│   ├── session.handler.ts
│   ├── document.handler.ts
│   └── map.handler.ts
├── services/
│   ├── project.service.ts
│   ├── session.service.ts
│   ├── document.service.ts
│   └── grounding.service.ts
├── middleware/
│   ├── request-logger.ts
│   ├── body-parser.ts
│   ├── timeout.ts
│   └── error-handler.ts
├── repositories/
│   ├── in-memory/        # Temporary until DB implemented
│   │   ├── project.repo.ts
│   │   └── session.repo.ts
│   └── interfaces/
│       ├── ProjectRepository.ts
│       └── SessionRepository.ts
└── types/
    ├── api.types.ts
    └── response.types.ts
```

**Оценка усилий:** 1-2 дня

---

**1.2.3. Refactor packages/avg-validation/src/index.ts (690 lines)**

**Новая структура:**
```
packages/avg-validation/src/
├── index.ts              # Public API exports (30 lines)
├── claim/
│   ├── validator.ts      # validateClaimContract
│   ├── extractor.ts      # extractClaimsFromResponse
│   └── types.ts          # ClaimValidationReport, etc.
├── classification/
│   ├── classifier.ts     # classifyClaimDiscipline
│   ├── signals.ts        # Signal detection logic
│   └── types.ts          # ClaimClassificationReport
├── risk/
│   ├── assessor.ts       # assessClaimRisk
│   ├── markers.ts        # Strong word markers, uncertainty
│   └── types.ts          # ClaimRiskAssessmentReport
├── grounding/
│   ├── composer.ts       # composeGroundedResponse
│   ├── citation.ts       # Citation management
│   └── types.ts          # AvgGroundedResponse, etc.
└── utils/
    ├── text.utils.ts     # normalizeText, dedupe
    └── validation.utils.ts
```

**Оценка усилий:** 1 день

---

#### Задача 1.3: Устранить дублирование типов

**Действия:**
1. Удалить `AvgRetrievalHit` из `packages/avg-validation/src/index.ts`
2. Импортировать из `@avg/retrieval`:
   ```typescript
   import { type AvgRetrievalHit } from "@avg/retrieval";
   ```
3. Проверить все uses и убедиться в совместимости
4. Обновить тесты

**Оценка усилий:** 2-3 часа

---

#### Задача 1.4: Добавить TypeScript ESLint

**Установка:**
```bash
pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

**Конфигурация (`eslint.config.mjs`):**
```javascript
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ["node_modules/**", ".turbo/**", "dist/**", "coverage/**"]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.base.json",
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error'
    }
  },
  {
    files: ["*.js", "*.mjs"],
    languageOptions: { ecmaVersion: "latest" },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error"
    }
  }
];
```

**Оценка усилий:** 4-6 часов (включая fix существующих violations)

---

### Фаза 2: Infrastructure (Месяц 1) 🏗️ SHORT-TERM

#### Задача 2.1: Реализовать persistence layer

**Архитектура:**
```
packages/avg-memory/src/
├── index.ts
├── repositories/
│   ├── DocumentRepository.ts    # Interface
│   ├── GraphRepository.ts       # Interface
│   ├── postgres/
│   │   ├── PgDocumentRepo.ts    # PostgreSQL implementation
│   │   └── migrations/
│   │       ├── 001_create_documents.sql
│   │       └── 002_create_snippets.sql
│   └── neo4j/
│       ├── Neo4jGraphRepo.ts    # Neo4j implementation
│       └── queries/
│           ├── create_node.cypher
│           └── find_edges.cypher
├── services/
│   ├── document.service.ts
│   └── graph.service.ts
└── types/
    └── repository.types.ts
```

**Schema для PostgreSQL:**
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  token_count INTEGER,
  embedding VECTOR(1536),  -- For future vector search
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_snippets_document ON snippets(document_id);
CREATE INDEX idx_snippets_embedding ON snippets USING ivfflat (embedding vector_cosine_ops);
```

**Оценка усилий:** 5-7 дней

---

#### Задача 2.2: Extract common regex patterns

**Создать модуль patterns:**
```typescript
// packages/avg-core/src/patterns.ts

export const STRONG_WORD_PATTERNS = {
  absolute: /\b(always|never|every|all|none)\b/gi,
  certainty: /\b(definitely|certainly|undoubtedly|absolutely)\b/gi,
  universality: /\b(everyone|nobody|everything|nothing)\b/gi
};

export const UNCERTAINTY_MARKERS = [
  'возможно', 'может быть', 'вероятно', 'предположительно',
  'might', 'could', 'perhaps', 'possibly'
];

export const METAPHOR_INDICATORS = [
  'как будто', 'подобно', 'напоминает', 'аналогично',
  'like', 'as if', 'similar to', 'metaphor'
];

export function matchStrongWords(text: string): string[] {
  const matches: string[] = [];
  for (const [category, pattern] of Object.entries(STRONG_WORD_PATTERNS)) {
    const found = text.match(pattern);
    if (found) matches.push(...found.map(m => `${category}:${m}`));
  }
  return matches;
}
```

**Оценка усилий:** 1 день

---

#### Задача 2.3: Добавить proper error handling

**Implement Result pattern usage:**
```typescript
// Before:
function validateClaim(claim: AvgClaim): ValidationResult {
  if (!claim.text) throw new Error("Claim text is required");
  // ...
}

// After:
function validateClaim(claim: AvgClaim): Result<ValidationError, ValidationResult> {
  if (!claim.text) {
    return err(new ValidationError("Claim text is required", { field: "text" }));
  }
  
  try {
    const result = performValidation(claim);
    return ok(result);
  } catch (error) {
    return err(new ValidationError("Validation failed", { cause: error }));
  }
}

// Usage:
const result = validateClaim(claim);
if (!result.success) {
  logger.error("Validation error", { error: result.error });
  return res.status(400).json({ error: result.error.message });
}
// result.data is guaranteed to be valid here
```

**Оценка усилий:** 2-3 дня

---

#### Задача 2.4: Реализовать missing пакеты (минимум)

**Приоритет 1: avg-config**
```typescript
// packages/avg-config/src/index.ts
export interface AppConfig {
  nodeEnv: "development" | "production" | "test";
  port: number;
  databaseUrl: string;
  openaiApiKey: string;
  maxRequestBodyBytes: number;
  requestTimeoutMs: number;
}

export function loadConfig(): AppConfig {
  const config = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "3000", 10),
    databaseUrl: process.env.DATABASE_URL,
    openaiApiKey: process.env.OPENAI_API_KEY,
    maxRequestBodyBytes: 1_000_000,
    requestTimeoutMs: 15_000
  };
  
  // Validate required vars
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  if (!config.openaiApiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }
  
  return config;
}
```

**Приоритет 2: avg-observability**
```typescript
// packages/avg-observability/src/index.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

export function metric(name: string, value: number, labels?: Record<string, string>) {
  // Send to Prometheus
}

export function trace(name: string, fn: () => Promise<void>) {
  // OpenTelemetry integration
}
```

**Оценка усилий:** 2-3 дня

---

### Фаза 3: Hardening (Квартал 1) 🛡️ MEDIUM-TERM

#### Задача 3.1: Добавить observability stack

**Компоненты:**
1. **Structured Logging:** Pino с JSON output
2. **Metrics:** Prometheus client с custom metrics
3. **Tracing:** OpenTelemetry для distributed tracing
4. **Alerting:** Basic alerting rules

**Implementation:**
```typescript
// apps/api/src/middleware/observability.ts
import { logger, metric, trace } from '@avg/observability';

export async function observabilityMiddleware(req, res, next) {
  const requestId = crypto.randomUUID();
  req.id = requestId;
  
  logger.info({ requestId, method: req.method, path: req.path }, 'Request started');
  
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    metric('http_request_duration_ms', duration, {
      method: req.method,
      path: req.path,
      status: res.statusCode.toString()
    });
    
    logger.info({ 
      requestId, 
      duration, 
      status: res.statusCode 
    }, 'Request completed');
  });
  
  next();
}
```

**Оценка усилий:** 3-4 дня

---

#### Задача 3.2: Performance optimization

**3.2.1. Replace JSON.stringify diff with structural comparison**
```typescript
// packages/avg-graph/src/diff.ts

// Before (slow):
const changed = JSON.stringify(snapshotA) !== JSON.stringify(snapshotB);

// After (fast):
export function structuralDiff(a: GraphSnapshot, b: GraphSnapshot): GraphDiff {
  const addedNodes = b.nodes.filter(nb => !a.nodes.some(na => na.id === nb.id));
  const removedNodes = a.nodes.filter(na => !b.nodes.some(nb => nb.id === na.id));
  const modifiedNodes = b.nodes.filter(nb => {
    const na = a.nodes.find(n => n.id === nb.id);
    return na && !deepEqual(na, nb);
  });
  
  return { addedNodes, removedNodes, modifiedNodes };
}
```

**3.2.2. Add caching layer**
```typescript
// packages/avg-retrieval/src/cache.ts
import { LRUCache } from 'lru-cache';

const retrievalCache = new LRUCache({
  max: 1000,
  ttl: 5 * 60 * 1000 // 5 minutes
});

export async function searchDocumentsWithCache(query: string, projectId: string) {
  const cacheKey = `${projectId}:${query}`;
  const cached = retrievalCache.get(cacheKey);
  if (cached) return cached;
  
  const result = await performSearch(query, projectId);
  retrievalCache.set(cacheKey, result);
  return result;
}
```

**Оценка усилий:** 2-3 дня

---

#### Задача 3.3: Security hardening

**3.3.1. Improve prompt injection detection**
```typescript
// packages/avg-security/src/injection-detector.ts
import { MLModel } from '@huggingface/transformers'; // Use lightweight ML model

export class InjectionDetector {
  private model: MLModel;
  
  async detect(input: string): Promise<{ isInjection: boolean; confidence: number }> {
    // Combine regex + ML model for better detection
    const regexMatch = this.regexCheck(input);
    if (regexMatch.confidence > 0.9) return regexMatch;
    
    // Fallback to ML model for ambiguous cases
    return await this.mlCheck(input);
  }
}
```

**3.3.2. Add rate limiting**
```typescript
// apps/api/src/middleware/rate-limiter.ts
import { RateLimiterMemory } from 'rate-limiter-flexible';

const limiter = new RateLimiterMemory({
  points: 100, // 100 requests
  duration: 60  // per minute
});

export async function rateLimitMiddleware(req, res, next) {
  try {
    await limiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({ error: 'Too many requests' });
  }
}
```

**Оценка усилий:** 3-4 дня

---

#### Задача 3.4: Improve testing strategy

**3.4.1. Add property-based testing**
```bash
pnpm add -D fast-check
```

```typescript
// packages/avg-validation/tests/claim.property.test.ts
import fc from 'fast-check';
import { validateClaim } from '../src/claim/validator';

describe('Claim validation properties', () => {
  test('any valid claim should pass validation', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string(),
          text: fc.string({ minLength: 1 }),
          claim_status: fc.constantFrom('fact', 'hypothesis', 'metaphor')
        }),
        (claim) => {
          const result = validateClaim(claim);
          expect(result.accepted).toBe(true);
        }
      )
    );
  });
});
```

**3.4.2. Add mutation testing**
```bash
pnpm add -D stryker-runner
```

**3.4.3. Add coverage reporting**
```json
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80
      }
    }
  }
});
```

**Оценка усилий:** 3-4 дня

---

## 3. Приоритизация и Roadmap

### Immediate (Недели 1-2) — Foundation
- ✅ Реализовать avg-core (2-3 дня)
- ✅ Разделить монолитные файлы (3-5 дней)
- ✅ Устранить дублирование типов (2-3 часа)
- ✅ Добавить TypeScript ESLint (4-6 часов)

**Total effort:** ~2 weeks  
**Expected outcome:** Cleaner codebase, better DX, eliminated duplication

---

### Short-term (Месяц 1) — Infrastructure
- ✅ Реализовать persistence layer (5-7 дней)
- ✅ Extract regex patterns (1 день)
- ✅ Добавить proper error handling (2-3 дня)
- ✅ Реализовать avg-config и avg-observability (2-3 дня)

**Total effort:** ~3 weeks  
**Expected outcome:** Data persistence, better error handling, configuration management

---

### Medium-term (Квартал 1) — Hardening
- ✅ Добавить observability stack (3-4 дня)
- ✅ Performance optimization (2-3 дня)
- ✅ Security hardening (3-4 дня)
- ✅ Improve testing strategy (3-4 дня)

**Total effort:** ~4 weeks (spread over quarter)  
**Expected outcome:** Production-ready system with monitoring, security, and performance

---

## 4. Риски и mitigation

### Риск 1: Breaking changes при рефакторинге
**Mitigation:**
- Использовать feature flags для gradual rollout
- Maintain backward compatibility during transition
- Comprehensive regression testing before merge
- Blue-green deployment strategy

### Риск 2: Scope creep
**Mitigation:**
- Stick to defined phases
- Defer nice-to-have features
- Regular check-ins with stakeholders
- Track progress against milestones

### Риск 3: Performance regression
**Mitigation:**
- Benchmark before and after changes
- Load test critical paths
- Monitor key metrics in staging
- Rollback plan ready

### Риск 4: Team capacity
**Mitigation:**
- Prioritize high-impact changes first
- Parallelize independent tasks
- Consider hiring contractors for specialized work (DB, security)
- Automate repetitive tasks

---

## 5. Success Metrics

### Code Quality Metrics
- [ ] Reduce largest file from 1,458 to <300 lines
- [ ] Eliminate all code duplication (0 duplicate functions)
- [ ] Achieve 90%+ ESLint compliance
- [ ] Implement Result pattern in 100% of error-prone code

### Infrastructure Metrics
- [ ] 100% data persistence (zero data loss on restart)
- [ ] Structured logging in 100% of requests
- [ ] <100ms p95 latency for API endpoints
- [ ] 99.9% uptime in staging environment

### Testing Metrics
- [ ] 80%+ code coverage across all packages
- [ ] 100+ property-based test cases
- [ ] Zero critical security vulnerabilities
- [ ] <5% flaky test rate

---

## 6. Conclusion

AVG Codex Lab имеет отличный фундамент, но требует значительной работы для достижения production readiness. Предложенный план рефакторинга фокусируется на:

1. **Устранении технического долга** (дублирование, монолиты)
2. **Построении infrastructure** (persistence, observability, config)
3. **Hardening для production** (security, performance, testing)

Рекомендуемый подход — incremental improvements с регулярными checkpoints, чтобы maintain velocity while improving quality.

**Next steps:**
1. Review proposal с team
2. Prioritize Phase 1 tasks
3. Create detailed tickets для каждой задачи
4. Start with avg-core implementation

---

## Appendix A: Quick Wins (<1 day each)

Эти изменения можно сделать быстро с высоким impact:

1. **Удалить дубликат AvgRetrievalHit** (2 часа)
2. **Добавить .env.example файл** (1 час)
3. **Настроить Prettier для consistency** (2 часа)
4. **Добавить commit hooks для linting** (3 часа)
5. **Создать CONTRIBUTING.md** (4 часа)

---

## Appendix B: Tools Recommendation

| Category | Tool | Purpose |
|----------|------|---------|
| Linting | @typescript-eslint/eslint-plugin | TS-specific linting rules |
| Testing | vitest + fast-check | Unit + property-based testing |
| Mutation Testing | stryker-runner | Test quality assessment |
| Logging | pino + pino-pretty | Structured JSON logging |
| Metrics | prom-client | Prometheus metrics |
| Tracing | @opentelemetry/node | Distributed tracing |
| Rate Limiting | rate-limiter-flexible | API protection |
| Caching | lru-cache | In-memory caching |
| Database ORM | drizzle-orm | Type-safe SQL |
| Validation | zod | Runtime type checking |

---

**Автор:** AI Audit Assistant  
**Для вопросов:** Обратитесь к `.qoder/war-room/backlog.md` для tracking этого initiative
