import type { GraphSnapshot, ClaimProjection, GraphDiff } from "@avg/graph";
import type { AvgStructuredResponse } from "@avg/schemas";
import type { GroundedResponseCompositionReport } from "@avg/validation";
import type { DialogueMessage } from "@avg/html-rendering";
import type {
  RegisterDocumentInput,
  SearchDocumentsOptions,
  SearchDocumentsResult
} from "@avg/retrieval";

export type { SearchDocumentsResult } from "@avg/retrieval";

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

export interface RenderGroundedProjectRetrievalFlowRequest extends ComposeGroundedProjectResponseInput {
  sessionId: string;
}

export interface RenderGroundedProjectDialoguePageRequest extends RenderGroundedProjectDialoguePageInput {
  query: string;
  limit?: number;
}

export interface SearchProjectDocumentsRequest {
  query: string;
  limit?: number;
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
