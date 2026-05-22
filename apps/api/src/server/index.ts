import { createServer, type IncomingMessage, type Server } from "node:http";
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { join, isAbsolute, resolve, relative, sep, win32 } from "node:path";
import { URL } from "node:url";
import type { ApiRouteResponse, ApiRuntimeConfig, CreateApiServerOptions } from "../types";
import { handleGroundedProjectDialoguePageRoute } from "../routes";

function parsePositiveIntegerConfig(
  value: string | undefined,
  fallback: number,
  field: string
): number {
  if (value === undefined || value.trim().length === 0) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${field} must be a positive integer.`);
  }

  return parsed;
}

const defaultApiRuntimeConfig: ApiRuntimeConfig = {
  requestTimeoutMs: 15_000,
  requestBodyLimitBytes: 1_000_000,
  logDirectory: ".avg-logs"
};

export function createApiRuntimeConfig(
  overrides: Partial<ApiRuntimeConfig> = {},
  env: Record<string, string | undefined> = process.env
): ApiRuntimeConfig {
  const config = {
    requestTimeoutMs:
      overrides.requestTimeoutMs ??
      parsePositiveIntegerConfig(
        env.AVG_API_REQUEST_TIMEOUT_MS,
        defaultApiRuntimeConfig.requestTimeoutMs,
        "AVG_API_REQUEST_TIMEOUT_MS"
      ),
    requestBodyLimitBytes:
      overrides.requestBodyLimitBytes ??
      parsePositiveIntegerConfig(
        env.AVG_API_REQUEST_BODY_LIMIT_BYTES,
        defaultApiRuntimeConfig.requestBodyLimitBytes,
        "AVG_API_REQUEST_BODY_LIMIT_BYTES"
      ),
    logDirectory:
      overrides.logDirectory ?? env.AVG_API_LOG_DIRECTORY ?? defaultApiRuntimeConfig.logDirectory
  };

  if (!Number.isInteger(config.requestTimeoutMs) || config.requestTimeoutMs <= 0) {
    throw new Error("requestTimeoutMs must be a positive integer.");
  }

  if (!Number.isInteger(config.requestBodyLimitBytes) || config.requestBodyLimitBytes <= 0) {
    throw new Error("requestBodyLimitBytes must be a positive integer.");
  }

  return config;
}

async function readRequestBodyWithLimits(
  request: IncomingMessage,
  config: ApiRuntimeConfig
): Promise<string> {
  const chunks: Buffer[] = [];
  let totalBytes = 0;
  let timeout: NodeJS.Timeout | undefined;

  try {
    return await new Promise<string>((resolvePromise, rejectPromise) => {
      timeout = setTimeout(() => {
        request.destroy(new Error("Request body timeout."));
        rejectPromise(new Error("Request body timeout."));
      }, config.requestTimeoutMs);

      request.on("data", (chunk: Buffer | string) => {
        const buffer = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
        totalBytes += buffer.byteLength;

        if (totalBytes > config.requestBodyLimitBytes) {
          request.pause();
          rejectPromise(new Error("Request body too large."));
          return;
        }

        chunks.push(buffer);
      });

      request.on("end", () => {
        resolvePromise(Buffer.concat(chunks).toString("utf8"));
      });

      request.on("error", rejectPromise);
    });
  } finally {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
  }
}

function safeWriteApiErrorLog(error: unknown, config: ApiRuntimeConfig): void {
  try {
    const logRoot = resolveLabRelativePath(process.cwd(), config.logDirectory);
    if (!existsSync(logRoot.absolutePath)) {
      mkdirSync(logRoot.absolutePath, { recursive: true });
    }

    const logFilePath = join(config.logDirectory, "api-errors.ndjson");
    const logFile = resolveLabRelativePath(process.cwd(), logFilePath);
    const entry = {
      timestamp: new Date().toISOString(),
      code: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Unknown API error",
      stack: error instanceof Error ? error.stack : undefined
    };

    appendFileSync(logFile.absolutePath, `${JSON.stringify(entry)}\n`, "utf8");
  } catch {
    // Logging must never turn a handled API failure into another runtime failure.
  }
}

function isAbsoluteLabPath(value: string): boolean {
  return isAbsolute(value) || win32.isAbsolute(value);
}

function resolveLabRelativePath(rootDir: string, requestedPath: string): { rootDir: string; requestedPath: string; absolutePath: string } {
  if (requestedPath.trim().length === 0) {
    throw new Error("requestedPath is required.");
  }

  if (isAbsoluteLabPath(requestedPath)) {
    throw new Error("Absolute paths are not allowed inside the AVG lab boundary.");
  }

  const absoluteRoot = resolve(rootDir);
  const absolutePath = resolve(absoluteRoot, requestedPath);
  const relativePath = relative(absoluteRoot, absolutePath);

  const normalizedRoot = absoluteRoot.replace(/\\/g, "/").toLowerCase();
  const normalizedPath = absolutePath.replace(/\\/g, "/").toLowerCase();

  if (
    relativePath === "" ||
    relativePath.startsWith("..") ||
    relativePath.includes(`..${sep}`) ||
    isAbsoluteLabPath(relativePath) ||
    !normalizedPath.startsWith(normalizedRoot + "/")
  ) {
    throw new Error("Path traversal outside the AVG lab boundary is not allowed.");
  }

  return {
    rootDir: absoluteRoot,
    requestedPath,
    absolutePath
  };
}

export function createApiServer(options: CreateApiServerOptions = {}): Server {
  const config = createApiRuntimeConfig(options.config);

  return createServer(async (request, response) => {
    let routeResponse: ApiRouteResponse;

    try {
      request.setTimeout(config.requestTimeoutMs);
      const requestUrl = new URL(request.url ?? "/", "http://localhost");
      const bodyText =
        request.method === "GET" || request.method === "HEAD"
          ? ""
          : await readRequestBodyWithLimits(request, config);

      routeResponse = handleGroundedProjectDialoguePageRoute(
        request.method ?? "GET",
        requestUrl.pathname,
        bodyText
      );
    } catch (error) {
      safeWriteApiErrorLog(error, config);
      routeResponse = {
        statusCode: error instanceof Error && error.message.includes("too large") ? 413 : 500,
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          status: "error",
          code: error instanceof Error && error.message.includes("too large")
            ? "REQUEST_BODY_TOO_LARGE"
            : error instanceof Error && error.message.includes("timeout")
              ? "REQUEST_TIMEOUT"
              : "INTERNAL_ERROR",
          message: error instanceof Error && error.message.includes("too large")
            ? "The request body exceeds the configured API limit."
            : error instanceof Error && error.message.includes("timeout")
              ? "The request timed out before AVG could process it."
              : "AVG hit an internal API failure. Try again later.",
          details: {}
        })
      };
    }

    response.writeHead(routeResponse.statusCode, routeResponse.headers);

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    response.end(routeResponse.body);
  });
}
