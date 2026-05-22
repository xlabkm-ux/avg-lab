/**
 * @avg/api - API server for AVG Codex Lab.
 *
 * This package provides HTTP endpoints for project management, document registration,
 * retrieval, and grounded dialogue with HTML rendering from @avg/html-rendering.
 */

// Re-export all types
export type {
  HealthResponse,
  ProjectRecord,
  SessionRecord,
  MessageRecord,
  ProjectSessionMessageApi,
  MapSnapshotLike,
  MapDiffArtifact,
  RegisterProjectDocumentBody,
  SearchProjectDocumentsOptions,
  ComposeGroundedProjectResponseInput,
  GroundedProjectRetrievalFlow,
  RenderGroundedProjectDialoguePageInput,
  RenderGroundedProjectRetrievalFlowRequest,
  RenderGroundedProjectDialoguePageRequest,
  SearchProjectDocumentsRequest,
  ApiRouteResponse,
  ApiRuntimeConfig,
  CreateApiServerOptions,
  ApiErrorEnvelope,
  SafeLabPathResult,
} from "./types";

// Re-export core functions
export {
  health,
  createProject,
  createSession,
  appendMessage,
  getProject,
  getSession,
  getMessage,
  materializeMapSnapshot,
  registerProjectDocument,
  getProjectDocument,
  getProjectDocumentSnippets,
  getProjectDocumentText,
  listProjectDocuments,
  searchProjectDocuments,
  composeGroundedProjectResponse,
  createGroundedProjectRetrievalFlow,
  renderGroundedProjectRetrievalFlow,
  renderGroundedProjectDialoguePage,
  createProjectSessionMessage,
  createMapDiffArtifact,
  createEmptyMapDiffArtifact,
} from "./core";

// Re-export route handler
export {
  handleGroundedProjectDialoguePageRoute,
  writeApiErrorLog,
  resolveLabRelativePath,
} from "./routes";

// Re-export server functions
export {
  createApiRuntimeConfig,
  createApiServer,
} from "./server";

// Re-export validation
export { validateClaimRequest } from "./validation";
