import { describe, expect, it } from "vitest";
import { normalizeOpenAIProviderError, openAIAdapterBoundary } from "../src/index";

describe("OpenAI model interaction", () => {
  it("declares the adapter boundary with all model capabilities", () => {
    expect(openAIAdapterBoundary).toEqual({
      packageName: "@avg/openai",
      implementationStatus: "boundary",
      capabilities: [
        "responses_api",
        "realtime_api",
        "tool_calling",
        "structured_outputs",
        "model_routing",
        "normalized_provider_errors"
      ],
      dependsOnAppCode: false
    });
  });

  describe("error normalization for model interaction", () => {
    it("normalizes rate limit errors as retryable", () => {
      const error = normalizeOpenAIProviderError({
        error: {
          message: "Too many requests",
          type: "rate_limit_error",
          status: 429,
          request_id: "req_123"
        }
      });

      expect(error).toEqual({
        provider: "openai",
        code: "rate_limit_error",
        message: "Too many requests",
        status: 429,
        requestId: "req_123",
        rawType: "rate_limit_error",
        retryable: true
      });
    });

    it("normalizes authentication errors as non-retryable", () => {
      const error = normalizeOpenAIProviderError({
        error: {
          message: "Invalid API key",
          type: "authentication_error",
          status: 401,
          request_id: "req_456"
        }
      });

      expect(error.code).toBe("authentication_error");
      expect(error.retryable).toBe(false);
      expect(error.status).toBe(401);
    });

    it("normalizes timeout errors as retryable", () => {
      const error = normalizeOpenAIProviderError(
        Object.assign(new Error("Request timed out"), {
          name: "TimeoutError",
          code: "ETIMEDOUT"
        })
      );

      expect(error.code).toBe("timeout_error");
      expect(error.retryable).toBe(true);
    });

    it("normalizes server errors as retryable", () => {
      const error = normalizeOpenAIProviderError({
        error: {
          message: "Internal server error",
          type: "server_error",
          status: 500
        }
      });

      expect(error.code).toBe("server_error");
      expect(error.retryable).toBe(true);
    });

    it("normalizes network errors as retryable", () => {
      const error = normalizeOpenAIProviderError(
        Object.assign(new Error("socket hang up"), {
          name: "FetchError",
          code: "ECONNRESET"
        })
      );

      expect(error.code).toBe("network_error");
      expect(error.retryable).toBe(true);
    });

    it("normalizes bad request errors as non-retryable", () => {
      const error = normalizeOpenAIProviderError({
        error: {
          message: "Invalid request",
          type: "invalid_request_error",
          status: 400
        }
      });

      expect(error.code).toBe("bad_request_error");
      expect(error.retryable).toBe(false);
    });

    it("normalizes not found errors as non-retryable", () => {
      const error = normalizeOpenAIProviderError({
        error: {
          message: "Model not found",
          type: "not_found_error",
          status: 404
        }
      });

      expect(error.code).toBe("not_found_error");
      expect(error.retryable).toBe(false);
    });

    it("normalizes service unavailable errors as retryable", () => {
      const error = normalizeOpenAIProviderError({
        error: {
          message: "Service temporarily unavailable",
          type: "service_unavailable_error",
          status: 503
        }
      });

      expect(error.code).toBe("service_unavailable_error");
      expect(error.retryable).toBe(true);
    });

    it("handles nested error structures from OpenAI SDK", () => {
      const error = normalizeOpenAIProviderError({
        error: {
          message: "Nested error message",
          error: {
            message: "Deep nested error",
            type: "server_error"
          },
          status: 502,
          request_id: "req_nested_789"
        }
      });

      expect(error.code).toBe("server_error");
      expect(error.retryable).toBe(true);
      expect(error.requestId).toBe("req_nested_789");
      expect(error.status).toBe(502);
    });

    it("handles string error messages", () => {
      const error = normalizeOpenAIProviderError("Simple string error");

      expect(error.message).toBe("Simple string error");
      expect(error.code).toBe("unknown_error");
      expect(error.retryable).toBe(false);
    });

    it("handles Error objects with no additional context", () => {
      const error = normalizeOpenAIProviderError(new Error("Native error object"));

      expect(error.message).toBe("Native error object");
      expect(error.rawType).toBe("Error");
    });
  });

  describe("model routing error patterns", () => {
    it("identifies rate limiting from type field", () => {
      const error = normalizeOpenAIProviderError({
        error: {
          type: "rate_limit_error",
          message: "Rate limit exceeded"
        }
      });

      expect(error.retryable).toBe(true);
    });

    it("identifies authentication from authorization type", () => {
      const error = normalizeOpenAIProviderError({
        error: {
          type: "authorization_error",
          status: 403
        }
      });

      expect(error.code).toBe("authorization_error");
      expect(error.retryable).toBe(false);
    });

    it("identifies unstandardized error codes appropriately", () => {
      const error = normalizeOpenAIProviderError(
        Object.assign(new Error("Request aborted"), {
          name: "AbortError",
          code: "ABORTERROR"
        })
      );

      // Non-standard error codes may not match specific patterns
      // but should still be normalized
      expect(error.provider).toBe("openai");
      expect(error.message).toBe("Request aborted");
    });

    it("identifies connection failures as network errors", () => {
      const connectionErrors = ["ECONNREFUSED", "ENOTFOUND", "ETIMEDOUT"];

      connectionErrors.forEach((code) => {
        const error = normalizeOpenAIProviderError(
          Object.assign(new Error(`Connection failed: ${code}`), {
            name: "FetchError",
            code
          })
        );

        expect(error.code).toBe("network_error");
        expect(error.retryable).toBe(true);
      });
    });
  });
});
