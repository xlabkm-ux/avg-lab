# @avg/core — Foundation Types, Result Pattern, Domain Errors

**Status:** ✅ Implemented (2026-05-22)  
**Version:** 0.1.0

## Purpose

Core types, Result pattern for explicit error handling, Option type for nullable values, and domain-specific error classes used across all AVG packages.

## Exports

### Result Pattern

```typescript
import { ok, err, fromTry, fromTryAsync, isSuccess, isFailure } from "@avg/core";

// Explicit error handling without try/catch
function validate(input: string): Result<string, number> {
  const parsed = parseInt(input, 10);
  return isNaN(parsed) ? err("Invalid number") : ok(parsed);
}

// Usage with type guards
const result = validate("42");
if (isSuccess(result)) {
  console.log(result.data); // TypeScript knows data is number
}

// fromTry for sync functions
const result = fromTry(
  () => JSON.parse(maybeInvalidJson),
  (e) => new ValidationError(`Parse failed: ${e}`),
);

// fromTryAsync for async functions
const result = await fromTryAsync(
  async () => await fetchApi(),
  (e) => new NotFoundError("resource", id),
);
```

### Option Type

```typescript
import { some, none, fromNullable, optionMap, optionGetOrElse, isSome } from "@avg/core";

const maybeUser = fromNullable(userOrNull);

if (isSome(maybeUser)) {
  console.log(maybeUser.value.name);
}

const name = optionGetOrElse(
  optionMap(maybeUser, (u) => u.name),
  "Anonymous",
);
```

### Error Classes

| Class | Code | When to Use |
|-------|------|-------------|
| `AvgError` | Base class | Custom domain errors |
| `ValidationError` | `VALIDATION_ERROR` | Input validation failures |
| `NotFoundError` | `NOT_FOUND` | Resource not found |
| `AuthenticationError` | `AUTHENTICATION_ERROR` | Auth required |
| `AuthorizationError` | `AUTHORIZATION_ERROR` | Permission denied |
| `ConfigError` | `CONFIG_ERROR` | Missing/invalid config |

```typescript
import { ValidationError, NotFoundError, AvgError } from "@avg/core";

throw new ValidationError("Invalid email", { field: "email" });
throw new NotFoundError("project", "abc-123");
throw new AuthorizationError("delete", "user");
```

### Type Aliases

- `AsyncResult<E, T>` — `Promise<Result<E, T>>`
- `Nullable<T>` — `T | null`
- `MaybePromise<T>` — `T | Promise<T>`

## API Reference

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `ok` | `<T>(data: T) => Result<never, T>` | Create success result |
| `err` | `<E>(error: E) => Result<E, never>` | Create failure result |
| `fromTry` | `<E, T>(fn, errorFactory) => Result<E, T>` | Wrap sync function |
| `fromTryAsync` | `<E, T>(fn, errorFactory) => Promise<Result<E, T>>` | Wrap async function |
| `some` | `<T>(value: T) => Some<T>` | Create Some option |
| `none` | `<T>() => None` | Create None option |
| `fromNullable` | `<T>(value) => Option<T>` | Convert nullable to Option |
| `optionMap` | `<T, U>(opt, fn) => Option<U>` | Transform Option value |
| `optionFlatMap` | `<T, U>(opt, fn) => Option<U>` | Chain Option operations |
| `optionGetOrElse` | `<T>(opt, fallback) => T` | Extract with fallback |
| `isSuccess` | `<E, T>(result) => boolean` | Type guard for success |
| `isFailure` | `<E, T>(result) => boolean` | Type guard for failure |
| `isSome` | `<T>(opt) => boolean` | Type guard for Some |
| `isNone` | `<T>(opt) => boolean` | Type guard for None |

## Tests

```bash
pnpm test --filter @avg/core
```

Coverage: Result pattern, Option type, Error classes, Type guards
