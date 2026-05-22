import { describe, expect, it } from "vitest";
import { normalizeOpenAIProviderError, openAIAdapterBoundary } from "../src/index";

describe("OpenAI package baseline", () => {
  it("declares the adapter boundary with normalized error handling", () => {
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

  it("normalizes provider response errors into retryable and non-retryable codes", () => {
    expect(
      normalizeOpenAIProviderError({
        error: {
          message: "Too many requests",
          type: "rate_limit_error",
          status: 429,
          request_id: "req_123"
        }
      })
    ).toEqual({
      provider: "openai",
      code: "rate_limit_error",
      message: "Too many requests",
      status: 429,
      requestId: "req_123",
      rawType: "rate_limit_error",
      retryable: true
    });
  });

  it("normalizes network-like errors when OpenAI response details are missing", () => {
    expect(
      normalizeOpenAIProviderError(
        Object.assign(new Error("socket hang up"), {
          name: "TimeoutError",
          code: "ETIMEDOUT"
        })
      )
    ).toEqual({
      provider: "openai",
      code: "timeout_error",
      message: "socket hang up",
      status: null,
      requestId: null,
      rawType: "TimeoutError",
      retryable: true
    });
  });
});
