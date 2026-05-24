import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { join, isAbsolute, relative, resolve, sep, win32 } from "node:path";
import type {
  ApiRouteResponse,
  RegisterProjectDocumentBody,
  SearchProjectDocumentsRequest,
  RenderGroundedProjectRetrievalFlowRequest,
  RenderGroundedProjectDialoguePageRequest
} from "../types";
import {
  health,
  listProjectDocuments,
  getProjectDocument,
  getProjectDocumentSnippets,
  registerProjectDocument,
  searchProjectDocuments,
  createGroundedProjectRetrievalFlow,
  composeGroundedProjectResponse,
  getProject,
  ensureProjectExists,
  generateProjectDialogueResponse
} from "../core";
import {
  renderDialogueFlowPageFromGroundedReport
} from "@avg/html-rendering";

function jsonResponse(statusCode: number, body: unknown): ApiRouteResponse {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  };
}

function errorResponse(
  statusCode: number,
  code: string,
  message: string,
  details: Record<string, unknown> = {}
): ApiRouteResponse {
  return jsonResponse(statusCode, {
    status: "error",
    code,
    message,
    details
  });
}

function _htmlResponse(body: string): ApiRouteResponse {
  return {
    statusCode: 200,
    headers: {
      "content-type": "text/html; charset=utf-8"
    },
    body
  };
}

function isSafeRouteId(value: string): boolean {
  if (value.trim().length === 0) {
    return false;
  }

  let decoded: string;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return false;
  }

  return (
    decoded === value &&
    /^[A-Za-z0-9_-]+$/.test(decoded) &&
    !decoded.includes("..") &&
    !decoded.includes("/") &&
    !decoded.includes("\\")
  );
}

function isRegisterProjectDocumentBody(value: unknown): value is RegisterProjectDocumentBody {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const metadata = record.metadata;

  return (
    typeof record.title === "string" &&
    typeof record.source_kind === "string" &&
    typeof record.text === "string" &&
    (record.created_at === undefined || typeof record.created_at === "string") &&
    (metadata === undefined ||
      (typeof metadata === "object" &&
        metadata !== null &&
        Object.values(metadata).every((value) => typeof value === "string")))
  );
}

function isSearchProjectDocumentsRequest(value: unknown): value is SearchProjectDocumentsRequest {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.query === "string" &&
    (record.limit === undefined || typeof record.limit === "number")
  );
}

function isRenderGroundedProjectRetrievalFlowRequest(
  value: unknown
): value is RenderGroundedProjectRetrievalFlowRequest {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const response = record.response;
  return (
    typeof record.query === "string" &&
    typeof record.sessionId === "string" &&
    typeof response === "object" &&
    response !== null &&
    typeof (response as Record<string, unknown>).project_id === "string" &&
    (record.limit === undefined || typeof record.limit === "number")
  );
}

function isRenderGroundedProjectDialoguePageRequest(
  value: unknown
): value is RenderGroundedProjectDialoguePageRequest {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.query === "string" &&
    typeof record.sessionId === "string" &&
    Array.isArray(record.messages) &&
    (record.response === undefined || (typeof record.response === "object" && record.response !== null)) &&
    (typeof record.limit === "number" || record.limit === undefined)
  );
}

export function handleGroundedProjectDialoguePageRoute(
  method: string,
  pathname: string,
  bodyText: string
): ApiRouteResponse {
  if (method === "GET" && pathname === "/health") {
    return jsonResponse(200, health());
  }

  const documentRouteMatch = /^\/projects\/([^/]+)\/documents$/.exec(pathname);
  if (method === "GET" && documentRouteMatch !== null) {
    const projectId = documentRouteMatch[1]!;
    if (!isSafeRouteId(projectId)) {
      return errorResponse(
        400,
        "INVALID_ROUTE_ID",
        "Project route ids may contain only letters, numbers, underscores and hyphens."
      );
    }

    try {
      ensureProjectExists(projectId);
      const documents = listProjectDocuments(projectId);
      return jsonResponse(200, documents);
    } catch (error) {
      return errorResponse(
        400,
        "LIST_DOCUMENTS_FAILED",
        error instanceof Error ? error.message : "Failed to list documents."
      );
    }
  }

  const singleDocumentRouteMatch = /^\/projects\/([^/]+)\/documents\/([^/]+)$/.exec(pathname);
  if (method === "GET" && singleDocumentRouteMatch !== null) {
    const projectId = singleDocumentRouteMatch[1]!;
    const documentId = singleDocumentRouteMatch[2]!;
    
    if (!isSafeRouteId(projectId) || !isSafeRouteId(documentId)) {
      return errorResponse(
        400,
        "INVALID_ROUTE_ID",
        "Project and document route ids may contain only letters, numbers, underscores and hyphens."
      );
    }

    try {
      const document = getProjectDocument(documentId);
      if (!document) {
        return errorResponse(404, "DOCUMENT_NOT_FOUND", "Document not found.");
      }
      if (document.project_id !== projectId) {
        return errorResponse(
          403,
          "DOCUMENT_PROJECT_MISMATCH",
          "Document does not belong to the specified project."
        );
      }
      return jsonResponse(200, document);
    } catch (error) {
      return errorResponse(
        400,
        "GET_DOCUMENT_FAILED",
        error instanceof Error ? error.message : "Failed to get document."
      );
    }
  }
  if (method === "POST" && documentRouteMatch !== null) {
    const projectId = documentRouteMatch[1]!;
    if (!isSafeRouteId(projectId)) {
      return errorResponse(
        400,
        "INVALID_ROUTE_ID",
        "Project route ids may contain only letters, numbers, underscores and hyphens."
      );
    }

    try {
      ensureProjectExists(projectId);
      const parsedBody = JSON.parse(bodyText) as unknown;
      if (!isRegisterProjectDocumentBody(parsedBody)) {
        return errorResponse(
          400,
          "DOCUMENT_TEXT_REQUIRED",
          "Document registration requires title, source_kind and text."
        );
      }

      const result = registerProjectDocument(projectId, parsedBody);
      return jsonResponse(201, result);
    } catch (error) {
      if (error instanceof SyntaxError) {
        return errorResponse(
          400,
          "INVALID_JSON",
          "The document registration request body must be valid JSON."
        );
      }

      return errorResponse(
        400,
        "DOCUMENT_TEXT_REQUIRED",
        error instanceof Error ? error.message : "Document registration failed."
      );
    }
  }

  const documentSnippetsRouteMatch = /^\/projects\/([^/]+)\/documents\/([^/]+)\/snippets$/.exec(pathname);
  if (method === "GET" && documentSnippetsRouteMatch !== null) {
    const projectId = documentSnippetsRouteMatch[1]!;
    const documentId = documentSnippetsRouteMatch[2]!;
    
    if (!isSafeRouteId(projectId) || !isSafeRouteId(documentId)) {
      return errorResponse(
        400,
        "INVALID_ROUTE_ID",
        "Project and document route ids may contain only letters, numbers, underscores and hyphens."
      );
    }

    try {
      const snippets = getProjectDocumentSnippets(documentId);
      if (!snippets) {
        return errorResponse(404, "DOCUMENT_NOT_FOUND", "Document not found.");
      }
      return jsonResponse(200, snippets);
    } catch (error) {
      return errorResponse(
        400,
        "GET_SNIPPETS_FAILED",
        error instanceof Error ? error.message : "Failed to get snippets."
      );
    }
  }

  const retrievalRouteMatch = /^\/projects\/([^/]+)\/retrieval\/search$/.exec(pathname);
  if (method === "POST" && retrievalRouteMatch !== null) {
    const projectId = retrievalRouteMatch[1]!;
    if (!isSafeRouteId(projectId)) {
      return errorResponse(
        400,
        "INVALID_ROUTE_ID",
        "Project route ids may contain only letters, numbers, underscores and hyphens."
      );
    }

    try {
      ensureProjectExists(projectId);
      const parsedBody = JSON.parse(bodyText) as unknown;
      if (!isSearchProjectDocumentsRequest(parsedBody)) {
        return errorResponse(
          400,
          "RETRIEVAL_QUERY_REQUIRED",
          "Retrieval search requires a query string."
        );
      }

      const result = searchProjectDocuments(projectId, parsedBody.query, {
        ...(parsedBody.limit !== undefined ? { limit: parsedBody.limit } : {})
      });

      if (result.hits.length === 0) {
        return jsonResponse(200, { ...result, retrieval_confidence: result.retrieval_confidence ?? "none" });
      }

      return jsonResponse(200, result);
    } catch (error) {
      if (error instanceof SyntaxError) {
        return errorResponse(
          400,
          "INVALID_JSON",
          "The retrieval search request body must be valid JSON."
        );
      }

      return errorResponse(
        400,
        "RETRIEVAL_QUERY_REQUIRED",
        error instanceof Error ? error.message : "Retrieval search failed."
      );
    }
  }

  const groundedRetrievalFlowRouteMatch = /^\/projects\/([^/]+)\/retrieval\/grounded-flow$/.exec(pathname);
  if (method === "POST" && groundedRetrievalFlowRouteMatch !== null) {
    const projectId = groundedRetrievalFlowRouteMatch[1]!;
    if (!isSafeRouteId(projectId)) {
      return errorResponse(
        400,
        "INVALID_ROUTE_ID",
        "Project route ids may contain only letters, numbers, underscores and hyphens."
      );
    }

    try {
      ensureProjectExists(projectId);
      const parsedBody = JSON.parse(bodyText) as unknown;
      if (!isRenderGroundedProjectRetrievalFlowRequest(parsedBody)) {
        return errorResponse(
          400,
          "INVALID_REQUEST",
          "The grounded retrieval flow request is missing required fields."
        );
      }

      if (parsedBody.response.project_id !== projectId) {
        return errorResponse(
          400,
          "PROJECT_ID_MISMATCH",
          "The grounded retrieval flow response must match the route project id.",
          {
            projectId,
            responseProjectId: parsedBody.response.project_id
          }
        );
      }

      const flow = createGroundedProjectRetrievalFlow(projectId, parsedBody);

      return jsonResponse(200, {
        retrieval: flow.retrieval,
        report: flow.report,
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        return errorResponse(
          400,
          "INVALID_JSON",
          "The grounded retrieval flow request body must be valid JSON."
        );
      }

      return internalErrorResponse(error);
    }
  }

  const pageRouteMatch = /^\/projects\/([^/]+)\/dialogue\/page$/.exec(pathname);
  if (method === "POST" && pageRouteMatch !== null) {
    const projectId = pageRouteMatch[1]!;
    if (!isSafeRouteId(projectId)) {
      return errorResponse(
        400,
        "INVALID_ROUTE_ID",
        "Project route ids may contain only letters, numbers, underscores and hyphens."
      );
    }

    try {
      const parsedBody = JSON.parse(bodyText) as unknown;
      if (!isRenderGroundedProjectDialoguePageRequest(parsedBody)) {
        return errorResponse(
          400,
          "INVALID_REQUEST",
          "The grounded dialogue page request is missing required fields."
        );
      }

      // Auto-register project if it doesn't exist (frontend creates projects independently)
      if (!getProject(projectId)) {
        ensureProjectExists(projectId);
      }

      // Determine the structured response: use provided or generate from er-map
      let response: import("@avg/schemas").AvgStructuredResponse;
      if (parsedBody.response) {
        if (parsedBody.response.project_id !== projectId) {
          return errorResponse(
            400,
            "PROJECT_ID_MISMATCH",
            "The grounded dialogue page response must match the route project id.",
            {
              projectId,
              responseProjectId: parsedBody.response.project_id
            }
          );
        }
        response = parsedBody.response;
      } else {
        // Generate response from er-map knowledge base
        const messageId = `msg-${Date.now()}`;
        response = generateProjectDialogueResponse(
          projectId,
          parsedBody.sessionId,
          parsedBody.query,
          messageId
        );
      }

      const report = composeGroundedProjectResponse(projectId, {
        response,
        query: parsedBody.query,
        ...(parsedBody.limit !== undefined ? { limit: parsedBody.limit } : {})
      });

      const retrieval = searchProjectDocuments(projectId, parsedBody.query, {
        ...(parsedBody.limit !== undefined ? { limit: parsedBody.limit } : {})
      });

      const body = renderDialogueFlowPageFromGroundedReport(
        projectId,
        parsedBody.sessionId,
        parsedBody.messages,
        report
      );

      // Return JSON with HTML, structured response, grounding, and retrieval hits
      return jsonResponse(200, {
        html: body,
        structuredResponse: report.groundedResponse?.response ?? response,
        grounding: report.groundedResponse?.grounding ?? null,
        retrievalHits: retrieval.hits ?? []
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        return errorResponse(
          400,
          "INVALID_JSON",
          "The grounded dialogue page request body must be valid JSON."
        );
      }

      return internalErrorResponse(error);
    }
  }

  return errorResponse(404, "NOT_FOUND", "The requested route is not available.", {
    method,
    pathname
  });
}

function internalErrorResponse(error: unknown): ApiRouteResponse {
  safeWriteApiErrorLog(error);
  return errorResponse(500, "INTERNAL_ERROR", "AVG hit an internal API failure. Try again later.");
}

export function writeApiErrorLog(error: unknown, config: { logDirectory: string }): void {
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
}

function safeWriteApiErrorLog(error: unknown, config = { logDirectory: ".avg-logs" }): void {
  try {
    writeApiErrorLog(error, config);
  } catch {
    // Logging must never turn a handled API failure into another runtime failure.
  }
}

function isAbsoluteLabPath(value: string): boolean {
  return isAbsolute(value) || win32.isAbsolute(value);
}

export function resolveLabRelativePath(rootDir: string, requestedPath: string): { rootDir: string; requestedPath: string; absolutePath: string } {
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
