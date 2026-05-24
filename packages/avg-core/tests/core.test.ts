import { describe, it, expect } from "vitest";
import {
  ok,
  err,
  fromTry,
  fromTryAsync,
  some,
  none,
  fromNullable,
  optionMap,
  optionFlatMap,
  optionGetOrElse,
  AvgError,
  ValidationError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
  ConfigError,
  isSuccess,
  isFailure,
  isSome,
  isNone,
} from "../src/index";

describe("Result pattern", () => {
  it("ok creates a success result", () => {
    const result = ok(42);
    expect(result.success).toBe(true);
    expect(result.data).toBe(42);
  });

  it("err creates a failure result", () => {
    const result = err("boom");
    expect(result.success).toBe(false);
    expect(result.error).toBe("boom");
  });

  it("fromTry captures sync errors", () => {
    const result = fromTry(
      () => { throw new Error("fail"); },
      (e) => new ValidationError(String(e)),
    );
    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(ValidationError);
  });

  it("fromTry returns ok on success", () => {
    const result = fromTry(() => 42);
    expect(result.success).toBe(true);
    expect(result.data).toBe(42);
  });

  it("fromTryAsync captures async errors", async () => {
    const result = await fromTryAsync(
      async () => { throw new Error("async fail"); },
    );
    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
  });

  it("fromTryAsync returns ok on async success", async () => {
    const result = await fromTryAsync(async () => "done");
    expect(result.success).toBe(true);
    expect(result.data).toBe("done");
  });
});

describe("Option type", () => {
  it("some creates a Some", () => {
    const opt = some(42);
    expect(opt.tag).toBe("some");
    expect(opt.value).toBe(42);
  });

  it("none creates a None", () => {
    const opt = none<number>();
    expect(opt.tag).toBe("none");
  });

  it("fromNullable returns some for non-null", () => {
    expect(isSome(fromNullable(42))).toBe(true);
    expect(isSome(fromNullable("hello"))).toBe(true);
    expect(isSome(fromNullable(0))).toBe(true);
    expect(isSome(fromNullable(""))).toBe(true);
  });

  it("fromNullable returns none for null/undefined", () => {
    expect(isNone(fromNullable(null))).toBe(true);
    expect(isNone(fromNullable(void 0))).toBe(true);
  });

  it("optionMap transforms Some values", () => {
    const result = optionMap(some(5), (x) => x * 2);
    expect(result.tag).toBe("some");
    expect(result.value).toBe(10);
  });

  it("optionMap returns none for None", () => {
    const result = optionMap(none<number>(), (x) => x * 2);
    expect(result.tag).toBe("none");
  });

  it("optionFlatMap chains Options", () => {
    const parse = (s: string) => {
      const n = parseInt(s, 10);
      return isNaN(n) ? none<number>() : some(n);
    };
    const result = optionFlatMap(some("42"), parse);
    expect(result.tag).toBe("some");
    expect(result.value).toBe(42);
  });

  it("optionGetOrElse returns fallback for None", () => {
    expect(optionGetOrElse(some(42), 0)).toBe(42);
    expect(optionGetOrElse(none<number>(), 0)).toBe(0);
  });
});

describe("Domain error classes", () => {
  it("AvgError has code and context", () => {
    const error = new AvgError("test", "TEST_CODE", { key: "value" });
    expect(error.message).toBe("test");
    expect(error.code).toBe("TEST_CODE");
    expect(error.context).toEqual({ key: "value" });
    expect(error.name).toBe("AvgError");
  });

  it("ValidationError has correct code", () => {
    const error = new ValidationError("bad input", { field: "email" });
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.context).toEqual({ field: "email" });
    expect(error.name).toBe("ValidationError");
  });

  it("NotFoundError includes resource and id", () => {
    const error = new NotFoundError("project", "abc-123");
    expect(error.message).toBe("project not found: abc-123");
    expect(error.code).toBe("NOT_FOUND");
    expect(error.context).toEqual({ resource: "project", id: "abc-123" });
  });

  it("AuthenticationError has default message", () => {
    const error = new AuthenticationError();
    expect(error.message).toBe("Authentication required");
    expect(error.code).toBe("AUTHENTICATION_ERROR");
  });

  it("AuthorizationError includes action and resource", () => {
    const error = new AuthorizationError("delete", "user");
    expect(error.message).toBe("Not authorized to delete user");
    expect(error.code).toBe("AUTHORIZATION_ERROR");
  });

  it("ConfigError includes variable", () => {
    const error = new ConfigError("DATABASE_URL", "missing");
    expect(error.message).toBe("Configuration error for DATABASE_URL: missing");
    expect(error.code).toBe("CONFIG_ERROR");
  });
});

describe("Type guards", () => {
  it("isSuccess and isFailure work", () => {
    expect(isSuccess(ok(42))).toBe(true);
    expect(isFailure(ok(42))).toBe(false);
    expect(isSuccess(err("boom"))).toBe(false);
    expect(isFailure(err("boom"))).toBe(true);
  });

  it("isSome and isNone work", () => {
    expect(isSome(some(1))).toBe(true);
    expect(isNone(some(1))).toBe(false);
    expect(isSome(none())).toBe(false);
    expect(isNone(none())).toBe(true);
  });
});
