export type OpenAIAdapterCapability =
  | "responses_api"
  | "realtime_api"
  | "tool_calling"
  | "structured_outputs"
  | "model_routing"
  | "normalized_provider_errors";

export type OpenAIAdapterImplementationStatus = "boundary";

export interface OpenAIAdapterBoundary {
  packageName: "@avg/openai";
  implementationStatus: OpenAIAdapterImplementationStatus;
  capabilities: readonly OpenAIAdapterCapability[];
  dependsOnAppCode: false;
}

export const openAIAdapterBoundary: OpenAIAdapterBoundary = {
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
};

export type OpenAIProviderErrorCode =
  | "authentication_error"
  | "authorization_error"
  | "bad_request_error"
  | "network_error"
  | "not_found_error"
  | "rate_limit_error"
  | "server_error"
  | "service_unavailable_error"
  | "timeout_error"
  | "unknown_error";

export interface NormalizedOpenAIProviderError {
  provider: "openai";
  code: OpenAIProviderErrorCode;
  message: string;
  status: number | null;
  requestId: string | null;
  rawType: string | null;
  retryable: boolean;
}

interface OpenAIErrorLike extends Record<string, unknown> {
  error?: unknown;
  message?: unknown;
  code?: unknown;
  name?: unknown;
  requestId?: unknown;
  request_id?: unknown;
  status?: unknown;
  type?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toStringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function toNumberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readNestedError(value: unknown): OpenAIErrorLike | null {
  return isRecord(value) ? (value as OpenAIErrorLike) : null;
}

function messageFromUnknown(error: unknown, fallback = "Unknown OpenAI provider error"): string {
  if (typeof error === "string" && error.length > 0) {
    return error;
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  if (isRecord(error)) {
    const directMessage = toStringOrNull(error.message);
    if (directMessage) {
      return directMessage;
    }

    const nestedMessage = toStringOrNull(readNestedError(error.error)?.message);
    if (nestedMessage) {
      return nestedMessage;
    }
  }

  return fallback;
}

function normalizeStatusCode(status: number | null): OpenAIProviderErrorCode | null {
  if (status === null) {
    return null;
  }

  if (status === 401) {
    return "authentication_error";
  }

  if (status === 403) {
    return "authorization_error";
  }

  if (status === 404) {
    return "not_found_error";
  }

  if (status === 408) {
    return "timeout_error";
  }

  if (status === 429) {
    return "rate_limit_error";
  }

  if (status === 503) {
    return "service_unavailable_error";
  }

  if (status >= 500 && status <= 599) {
    return "server_error";
  }

  if (status >= 400 && status <= 499) {
    return "bad_request_error";
  }

  return null;
}

function normalizeCodeFromFields(fields: {
  status: number | null;
  rawType: string | null;
  rawCode: string | null;
  name: string | null;
}): OpenAIProviderErrorCode {
  const { status, rawType, rawCode, name } = fields;

  const statusCode = normalizeStatusCode(status);
  if (statusCode) {
    return statusCode;
  }

  const normalizedType = `${rawType ?? ""} ${rawCode ?? ""} ${name ?? ""}`.toLowerCase();

  if (normalizedType.includes("rate_limit")) {
    return "rate_limit_error";
  }

  if (normalizedType.includes("auth")) {
    return normalizedType.includes("author") ? "authorization_error" : "authentication_error";
  }

  if (normalizedType.includes("timeout") || normalizedType.includes("aborted") || normalizedType === "aborterror") {
    return "timeout_error";
  }

  if (
    normalizedType.includes("network") ||
    normalizedType.includes("fetch") ||
    normalizedType.includes("connect") ||
    normalizedType.includes("econnreset") ||
    normalizedType.includes("econnrefused") ||
    normalizedType.includes("enotfound") ||
    normalizedType.includes("etimedout") ||
    normalizedType.includes("und_err")
  ) {
    return "network_error";
  }

  if (normalizedType.includes("not_found")) {
    return "not_found_error";
  }

  if (normalizedType.includes("service_unavailable")) {
    return "service_unavailable_error";
  }

  if (normalizedType.includes("server")) {
    return "server_error";
  }

  if (normalizedType.includes("bad_request") || normalizedType.includes("invalid_request")) {
    return "bad_request_error";
  }

  return "unknown_error";
}

function isRetryableError(code: OpenAIProviderErrorCode): boolean {
  return (
    code === "network_error" ||
    code === "rate_limit_error" ||
    code === "server_error" ||
    code === "service_unavailable_error" ||
    code === "timeout_error"
  );
}

export function normalizeOpenAIProviderError(error: unknown): NormalizedOpenAIProviderError {
  const source = readNestedError(error);
  const nestedError = readNestedError(source?.error);
  const merged = { ...(nestedError ?? {}), ...(source ?? {}) };

  const status = toNumberOrNull(merged.status);
  const rawType = toStringOrNull(merged.type);
  const rawCode = toStringOrNull(merged.code);
  const name = toStringOrNull(merged.name) ?? (error instanceof Error ? error.name : null);
  const requestId =
    toStringOrNull(merged.request_id) ??
    toStringOrNull(merged.requestId) ??
    toStringOrNull(nestedError?.request_id) ??
    toStringOrNull(nestedError?.requestId);

  const code = normalizeCodeFromFields({ status, rawType, rawCode, name });

  return {
    provider: "openai",
    code,
    message: messageFromUnknown(error),
    status,
    requestId,
    rawType: rawType ?? name ?? rawCode,
    retryable: isRetryableError(code)
  };
}
