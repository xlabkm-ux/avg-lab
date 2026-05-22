/**
 * @avg/web - Browser application for AVG Codex Lab.
 *
 * This package contains browser-only code (workspace state, storage, React components)
 * and re-exports server-safe rendering utilities from @avg/html-rendering.
 */

// Re-export workspace module (includes re-exports from @avg/html-rendering)
export {
  // Workspace types
  type WorkspaceSurface,
  type WorkspaceNavigationItem,
  type LocalProjectRecord,
  type LocalSessionRecord,
  type WorkspaceState,
  type WorkspaceShell,
  type WorkspaceStoragePort,
  type WorkspaceLocalProjectInput,
  // Workspace state functions
  workspaceStateStorageKey,
  createLocalProjectRecord,
  createLocalSessionRecord,
  createWorkspaceState,
  createLocalWorkspaceState,
  createWorkspaceStateFromInput,
  openLocalWorkspaceProject,
  selectWorkspaceSurface,
  createWorkspaceShell,
  serializeWorkspaceState,
  parseWorkspaceState,
  saveWorkspaceState,
  loadWorkspaceState,
  resetWorkspaceState,
  createAndSaveWorkspaceState,
  openSavedWorkspaceState,
  renderWorkspaceShell,
  // Re-exported from @avg/html-rendering via workspace/state
  type ProjectSessionShell,
  type DialogueMessage,
  type StructuredResponseDetailsPanel,
  type DialogueSurfaceGrounding,
  type DialogueSurfaceGroundedReport,
  type DialogueMessageSurface,
  type DialogueFlowPage,
  type GroundedResponseBoundary,
  type GroundedResponseDetailsPanel,
  type GroundedRetrievalFlowStatus,
  type GroundedRetrievalFlow,
  renderShellTitle,
  createProjectSessionShell,
  renderProjectSessionPage,
  createDialogueMessageSurface,
  renderDialogueMessageSurface,
  createDialogueMessageSurfaceFromGroundedReport,
  renderDialogueMessageSurfaceFromGroundedReport,
  createDialogueFlowPage,
  renderDialogueFlowPage,
  renderDialogueFlowPageFromGroundedReport,
  createStructuredResponseDetailsPanel,
  renderStructuredResponseDetailsPanel,
  createGroundedResponseDetailsPanel,
  renderGroundedResponseDetailsPanel,
  createGroundedRetrievalFlow,
  renderGroundedRetrievalFlow,
} from "./workspace/state";

// Re-export concept-map module
export {
  type ConceptMapSource,
  type ConceptMapShell,
  materializeConceptMapSnapshot,
  createConceptMapShell,
  renderConceptMapShell,
} from "./concept-map/shell";
export {
  type ConceptMapNodeView,
  type ConceptMapEdgeView,
} from "./concept-map/types";

// Re-export dialogue module
export {
  type StructuredDialogueStatus,
  type StructuredDialogueError,
  type StructuredDialogueSurfaceInput,
  type StructuredDialogueSurface,
  createStructuredDialogueSurface,
  submitRawThoughtToStructuredDialogue,
  renderStructuredDialogueSurface,
} from "./dialogue/surface";

// Re-export documents module
export {
  type AvgDocumentRef,
  type DocumentRegistrationStatus,
  type DocumentRegistrationError,
  type RegisteredDocumentSummary,
  type AvgSourceSnippet,
  type DocumentDetailWithSnippets,
  type DocumentRegistrationSurfaceInput,
  type DocumentRegistrationSurface,
  estimateTokenCount,
  createDocumentRegistrationSurface,
  registerDocumentViaApi,
  listDocumentsViaApi,
  getDocumentDetailWithSnippets,
  renderDocumentRegistrationSurface,
} from "./documents/surface";

// Re-export claims module
export {
  type AvgClaim,
  type ClaimReviewStatus,
  type ClaimReviewSurfaceInput,
  type ClaimReviewSurface,
  createClaimReviewSurface,
  renderClaimReviewSurface,
} from "./claims/surface";
