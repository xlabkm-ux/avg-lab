import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { createServer, type IncomingMessage, type Server } from "node:http";
import { isAbsolute, join, relative, resolve, sep, win32 } from "node:path";
import { URL } from "node:url";
import {
  cloneGraphSnapshot,
  createEmptyGraphSnapshot,
  diffGraphSnapshots,
  type ClaimProjection,
  type GraphDiff,
  type GraphSnapshot
} from "@avg/graph";
import {
  createDocumentRepository,
  type AvgRetrievalHit,
  type RegisterDocumentInput,
  type SearchDocumentsOptions,
  type SearchDocumentsResult,
  type RegisterDocumentResult
} from "@avg/retrieval";
import { type AvgStructuredResponse } from "@avg/schemas";
import { composeGroundedResponse, type GroundedResponseCompositionReport } from "@avg/validation";
import { validateClaimContract } from "@avg/validation";
import {
  renderDialogueFlowPageFromGroundedReport,
  renderGroundedRetrievalFlow,
  type DialogueMessage
} from "@avg/web";

export interface HealthResponse {
  status: "ok";
  service: "avg-api";
}

export interface ProjectRecord {
  id: string;
  name: string;
}

export interface SessionRecord {
  id: string;
  projectId: string;
  title: string;
}

export interface MessageRecord {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
}

export interface ProjectSessionMessageApi {
  project: ProjectRecord;
  session: SessionRecord;
  message: MessageRecord;
}

export type MapSnapshotLike = GraphSnapshot | ClaimProjection;

export interface MapDiffArtifact {
  kind: "map_diff";
  from: GraphSnapshot;
  to: GraphSnapshot;
  diff: GraphDiff;
}

type IdPrefix = "project" | "session" | "message";

const counters: Record<IdPrefix, number> = {
  project: 0,
  session: 0,
  message: 0
};

const projects = new Map<string, ProjectRecord>();
const sessions = new Map<string, SessionRecord>();
const messages = new Map<string, MessageRecord>();
const documentRepository = createDocumentRepository();

const defaultApiRuntimeConfig: ApiRuntimeConfig = {
  requestTimeoutMs: 15_000,
  requestBodyLimitBytes: 1_000_000,
  logDirectory: ".avg-logs"
};

export type RegisterProjectDocumentBody = Omit<RegisterDocumentInput, "project_id">;
export type SearchProjectDocumentsOptions = SearchDocumentsOptions;

export interface ComposeGroundedProjectResponseInput {
  response: AvgStructuredResponse;
  query: string;
  limit?: number;
}

export interface GroundedProjectRetrievalFlow {
  retrieval: SearchDocumentsResult;
  report: GroundedResponseCompositionReport;
}

export interface RenderGroundedProjectDialoguePageInput extends ComposeGroundedProjectResponseInput {
  sessionId: string;
  messages: DialogueMessage[];
}

export interface ApiRouteResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export interface ApiRuntimeConfig {
  requestTimeoutMs: number;
  requestBodyLimitBytes: number;
  logDirectory: string;
}

export interface CreateApiServerOptions {
  config?: Partial<ApiRuntimeConfig>;
}

export interface ApiErrorEnvelope {
  status: "error";
  code: string;
  message: string;
  details: Record<string, unknown>;
}

export interface SafeLabPathResult {
  rootDir: string;
  requestedPath: string;
  absolutePath: string;
}

export interface RenderGroundedProjectDialoguePageRequest extends RenderGroundedProjectDialoguePageInput {
  query: string;
  limit?: number;
}

export interface SearchProjectDocumentsRequest {
  query: string;
  limit?: number;
}

export interface RenderGroundedProjectRetrievalFlowRequest extends ComposeGroundedProjectResponseInput {
  sessionId: string;
}

function isAbsoluteLabPath(value: string): boolean {
  return isAbsolute(value) || win32.isAbsolute(value);
}

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

  resolveLabRelativePath(process.cwd(), config.logDirectory);

  return config;
}

export function resolveLabRelativePath(rootDir: string, requestedPath: string): SafeLabPathResult {
  if (requestedPath.trim().length === 0) {
    throw new Error("requestedPath is required.");
  }

  if (isAbsoluteLabPath(requestedPath)) {
    throw new Error("Absolute paths are not allowed inside the AVG lab boundary.");
  }

  const absoluteRoot = resolve(rootDir);
  const absolutePath = resolve(absoluteRoot, requestedPath);
  const relativePath = relative(absoluteRoot, absolutePath);

  // Normalize paths for cross-platform comparison (handle Windows backslashes)
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

function isClaimProjection(value: MapSnapshotLike): value is ClaimProjection {
  return "node" in value && !("nodes" in value);
}

function snapshotFromProjection(projection: ClaimProjection): GraphSnapshot {
  return cloneGraphSnapshot({
    nodes: [projection.node],
    edges: projection.edges
  });
}

export function materializeMapSnapshot(value: MapSnapshotLike): GraphSnapshot {
  if (isClaimProjection(value)) {
    return snapshotFromProjection(value);
  }

  return cloneGraphSnapshot(value);
}

function nextId(prefix: IdPrefix): string {
  counters[prefix] += 1;
  return `${prefix}_${String(counters[prefix]).padStart(3, "0")}`;
}

export function health(): HealthResponse {
  return {
    status: "ok",
    service: "avg-api"
  };
}

export function createProject(name = "Untitled project"): ProjectRecord {
  const project: ProjectRecord = {
    id: nextId("project"),
    name
  };

  projects.set(project.id, project);
  return project;
}

export function createSession(projectId: string, title = "Conversation session"): SessionRecord {
  if (!projects.has(projectId)) {
    throw new Error(`Unknown project: ${projectId}`);
  }

  const session: SessionRecord = {
    id: nextId("session"),
    projectId,
    title
  };

  sessions.set(session.id, session);
  return session;
}

export function appendMessage(
  sessionId: string,
  content: string,
  role: MessageRecord["role"] = "user"
): MessageRecord {
  if (!sessions.has(sessionId)) {
    throw new Error(`Unknown session: ${sessionId}`);
  }

  const message: MessageRecord = {
    id: nextId("message"),
    sessionId,
    role,
    content
  };

  messages.set(message.id, message);
  return message;
}

export function getProject(projectId: string): ProjectRecord | undefined {
  return projects.get(projectId);
}

export function getSession(sessionId: string): SessionRecord | undefined {
  return sessions.get(sessionId);
}

export function getMessage(messageId: string): MessageRecord | undefined {
  return messages.get(messageId);
}

export function registerProjectDocument(
  projectId: string,
  body: RegisterProjectDocumentBody
): RegisterDocumentResult {
  if (!projects.has(projectId)) {
    throw new Error(`Unknown project: ${projectId}`);
  }

  return documentRepository.registerDocument({
    ...body,
    project_id: projectId
  });
}

export function getProjectDocument(documentId: string) {
  return documentRepository.getDocument(documentId);
}

export function getProjectDocumentSnippets(documentId: string) {
  return documentRepository.getDocumentSnippets(documentId);
}

export function getProjectDocumentText(documentId: string) {
  return documentRepository.getDocumentText(documentId);
}

export function listProjectDocuments(projectId: string) {
  if (!projects.has(projectId)) {
    throw new Error(`Unknown project: ${projectId}`);
  }

  return documentRepository.listDocuments(projectId);
}

export function searchProjectDocuments(
  projectId: string,
  query: string,
  options: SearchProjectDocumentsOptions = {}
) {
  if (!projects.has(projectId)) {
    throw new Error(`Unknown project: ${projectId}`);
  }

  return documentRepository.searchDocuments(projectId, query, options);
}

export function composeGroundedProjectResponse(
  projectId: string,
  input: ComposeGroundedProjectResponseInput
): GroundedResponseCompositionReport {
  if (!projects.has(projectId)) {
    throw new Error(`Unknown project: ${projectId}`);
  }

  const retrieval = documentRepository.searchDocuments(projectId, input.query, {
    ...(input.limit !== undefined ? { limit: input.limit } : {})
  });

  return composeGroundedResponse(input.response, retrieval.hits as AvgRetrievalHit[]);
}

export function createGroundedProjectRetrievalFlow(
  projectId: string,
  input: ComposeGroundedProjectResponseInput
): GroundedProjectRetrievalFlow {
  if (!projects.has(projectId)) {
    throw new Error(`Unknown project: ${projectId}`);
  }

  const retrieval = documentRepository.searchDocuments(projectId, input.query, {
    ...(input.limit !== undefined ? { limit: input.limit } : {})
  });

  return {
    retrieval,
    report: composeGroundedResponse(input.response, retrieval.hits as AvgRetrievalHit[])
  };
}

export function renderGroundedProjectRetrievalFlow(
  projectId: string,
  input: RenderGroundedProjectRetrievalFlowRequest
): string {
  const flow = createGroundedProjectRetrievalFlow(projectId, input);

  return renderGroundedRetrievalFlow(
    projectId,
    input.sessionId,
    input.query,
    flow.retrieval.hits as AvgRetrievalHit[],
    flow.report
  );
}

export function renderGroundedProjectDialoguePage(
  projectId: string,
  input: RenderGroundedProjectDialoguePageInput
): string {
  const report = composeGroundedProjectResponse(projectId, input);

  return renderDialogueFlowPageFromGroundedReport(
    projectId,
    input.sessionId,
    input.messages,
    report
  );
}

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
  } satisfies ApiErrorEnvelope);
}

function htmlResponse(body: string): ApiRouteResponse {
  return {
    statusCode: 200,
    headers: {
      "content-type": "text/html; charset=utf-8"
    },
    body
  };
}

async function readRequestBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
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

export function writeApiErrorLog(error: unknown, config: ApiRuntimeConfig): void {
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

function safeWriteApiErrorLog(error: unknown, config = createApiRuntimeConfig()): void {
  try {
    writeApiErrorLog(error, config);
  } catch {
    // Logging must never turn a handled API failure into another runtime failure.
  }
}

function internalErrorResponse(error: unknown): ApiRouteResponse {
  safeWriteApiErrorLog(error);
  return errorResponse(500, "INTERNAL_ERROR", "AVG hit an internal API failure. Try again later.");
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
    "response" in record &&
    (typeof record.limit === "number" || record.limit === undefined)
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
        return errorResponse(
          404,
          "RETRIEVAL_NO_EVIDENCE",
          "No registered snippets matched the retrieval query.",
          { ...result }
        );
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

      const body = renderGroundedProjectRetrievalFlow(projectId, parsedBody);

      return htmlResponse(body);
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

      const body = renderGroundedProjectDialoguePage(projectId, {
        sessionId: parsedBody.sessionId,
        messages: parsedBody.messages,
        response: parsedBody.response,
        query: parsedBody.query,
        ...(parsedBody.limit !== undefined ? { limit: parsedBody.limit } : {})
      });

      return htmlResponse(body);
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
      routeResponse = errorResponse(
        error instanceof Error && error.message.includes("too large") ? 413 : 500,
        error instanceof Error && error.message.includes("too large")
          ? "REQUEST_BODY_TOO_LARGE"
          : error instanceof Error && error.message.includes("timeout")
            ? "REQUEST_TIMEOUT"
            : "INTERNAL_ERROR",
        error instanceof Error && error.message.includes("too large")
          ? "The request body exceeds the configured API limit."
          : error instanceof Error && error.message.includes("timeout")
            ? "The request timed out before AVG could process it."
            : "AVG hit an internal API failure. Try again later."
      );
    }

    response.writeHead(routeResponse.statusCode, routeResponse.headers);

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    response.end(routeResponse.body);
  });
}

export function createProjectSessionMessage(
  projectName: string,
  sessionTitle: string,
  content: string
): ProjectSessionMessageApi {
  const project = createProject(projectName);
  const session = createSession(project.id, sessionTitle);
  const message = appendMessage(session.id, content);

  return { project, session, message };
}

export function createMapDiffArtifact(from: MapSnapshotLike, to: MapSnapshotLike): MapDiffArtifact {
  const fromSnapshot = materializeMapSnapshot(from);
  const toSnapshot = materializeMapSnapshot(to);

  return {
    kind: "map_diff",
    from: fromSnapshot,
    to: toSnapshot,
    diff: diffGraphSnapshots(fromSnapshot, toSnapshot)
  };
}

export function createEmptyMapDiffArtifact(): MapDiffArtifact {
  const snapshot = createEmptyGraphSnapshot();

  return createMapDiffArtifact(snapshot, snapshot);
}

export function validateClaimRequest(body: unknown) {
  return validateClaimContract(body);
}
