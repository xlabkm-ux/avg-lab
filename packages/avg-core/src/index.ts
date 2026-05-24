/**
 * @avg/core — Foundation types, Result pattern, and domain errors
 *
 * This package provides:
 * - Result<E, T> pattern for explicit error handling
 * - Option<T> type for nullable values
 * - Domain-specific error classes
 * - Shared type aliases used across all AVG packages
 */

// ─────────────────────────────────────────────
// Result Pattern
// ─────────────────────────────────────────────

export type Result<E, T> =
  | { success: true; data: T }
  | { success: false; error: E };

export function ok<T>(data: T): Result<never, T> {
  return { success: true, data };
}

export function err<E>(error: E): Result<E, never> {
  return { success: false, error };
}

export function fromTry<E, T>(
  fn: () => T,
  errorFactory: (e: unknown) => E = (e) => new Error(String(e)) as E,
): Result<E, T> {
  try {
    return ok(fn());
  } catch (e) {
    return err(errorFactory(e));
  }
}

export async function fromTryAsync<E, T>(
  fn: () => Promise<T>,
  errorFactory: (e: unknown) => E = (e) => new Error(String(e)) as E,
): Promise<Result<E, T>> {
  try {
    return ok(await fn());
  } catch (e) {
    return err(errorFactory(e));
  }
}

// ─────────────────────────────────────────────
// Option Type
// ─────────────────────────────────────────────

export type Option<T> = Some<T> | None;

export interface Some<T> {
  readonly tag: "some";
  readonly value: T;
}

export interface None {
  readonly tag: "none";
}

export function some<T>(value: T): Some<T> {
  return { tag: "some", value };
}

export function none<_T>(): None {
  return { tag: "none" };
}

export function fromNullable<T>(value: T | null | undefined): Option<T> {
  return value != null ? some(value) : none();
}

export function optionMap<T, U>(opt: Option<T>, fn: (value: T) => U): Option<U> {
  return opt.tag === "some" ? some(fn(opt.value)) : none();
}

export function optionFlatMap<T, U>(opt: Option<T>, fn: (value: T) => Option<U>): Option<U> {
  return opt.tag === "some" ? fn(opt.value) : none();
}

export function optionGetOrElse<T>(opt: Option<T>, fallback: T): T {
  return opt.tag === "some" ? opt.value : fallback;
}

// ─────────────────────────────────────────────
// Domain Error Classes
// ─────────────────────────────────────────────

export class AvgError extends Error {
  public readonly code: string;
  public readonly context: Record<string, unknown> | undefined;

  constructor(message: string, code: string, context?: Record<string, unknown>) {
    super(message);
    this.name = "AvgError";
    this.code = code;
    this.context = context;
  }
}

export class ValidationError extends AvgError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", context);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AvgError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`, "NOT_FOUND", { resource, id });
    this.name = "NotFoundError";
  }
}

export class AuthenticationError extends AvgError {
  constructor(message = "Authentication required") {
    super(message, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AvgError {
  constructor(action: string, resource: string) {
    super(`Not authorized to ${action} ${resource}`, "AUTHORIZATION_ERROR", { action, resource });
    this.name = "AuthorizationError";
  }
}

export class ConfigError extends AvgError {
  constructor(variable: string, message: string) {
    super(`Configuration error for ${variable}: ${message}`, "CONFIG_ERROR", { variable });
    this.name = "ConfigError";
  }
}

// ─────────────────────────────────────────────
// Shared Type Aliases
// ─────────────────────────────────────────────

export type AsyncResult<E, T> = Promise<Result<E, T>>;
export type Nullable<T> = T | null;
export type MaybePromise<T> = T | Promise<T>;
export type AsyncOptional<T> = Promise<T | undefined>;

// ─────────────────────────────────────────────
// Type Guards
// ─────────────────────────────────────────────

export function isSuccess<E, T>(result: Result<E, T>): result is { success: true; data: T } {
  return result.success === true;
}

export function isFailure<E, T>(result: Result<E, T>): result is { success: false; error: E } {
  return result.success === false;
}

export function isSome<T>(opt: Option<T>): opt is Some<T> {
  return opt.tag === "some";
}

export function isNone<T>(opt: Option<T>): opt is None {
  return opt.tag === "none";
}
