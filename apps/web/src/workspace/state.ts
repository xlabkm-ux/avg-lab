/**
 * Workspace state management for AVG Codex Lab browser application.
 */

import {
  createEmptyGraphSnapshot
} from "@avg/graph";
import {
  createDialogueMessageSurface,
  createDialogueMessageSurfaceFromGroundedReport,
  createDialogueFlowPage,
  createGroundedResponseDetailsPanel,
  createGroundedRetrievalFlow,
  createStructuredResponseDetailsPanel,
  renderDialogueFlowPage,
  renderDialogueFlowPageFromGroundedReport,
  renderDialogueMessageSurface,
  renderDialogueMessageSurfaceFromGroundedReport,
  renderGroundedResponseDetailsPanel,
  renderGroundedRetrievalFlow,
  renderStructuredResponseDetailsPanel,
  type DialogueMessage,
  type DialogueSurfaceGrounding,
  type DialogueSurfaceGroundedReport,
  type DialogueMessageSurface,
  type DialogueFlowPage,
  type StructuredResponseDetailsPanel,
  type GroundedResponseBoundary,
  type GroundedResponseDetailsPanel,
  type GroundedRetrievalFlowStatus,
  type GroundedRetrievalFlow,
} from "@avg/html-rendering";
import { escapeHtml } from "@avg/utils";

import {
  type WorkspaceSurface,
  type WorkspaceNavigationItem,
  type LocalProjectRecord,
  type LocalSessionRecord,
  type WorkspaceState,
  type WorkspaceShell,
  type WorkspaceStoragePort,
  type WorkspaceLocalProjectInput,
} from "./types";

// Re-export rendering utilities
export {
  // Types
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
  // Functions
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
};

// Re-export types
export type {
  WorkspaceSurface,
  WorkspaceNavigationItem,
  LocalProjectRecord,
  LocalSessionRecord,
  WorkspaceState,
  WorkspaceShell,
  WorkspaceStoragePort,
  WorkspaceLocalProjectInput,
};

// Import claim review surface types (forward reference - we'll handle cross-module deps)
import { createClaimReviewSurface, renderClaimReviewSurface } from "../claims/surface";
import { createDocumentRegistrationSurface, renderDocumentRegistrationSurface } from "../documents/surface";
import { renderConceptMapShell } from "../concept-map/shell";

// ============================================================================
// Local Shell Types and Functions (not from @avg/html-rendering)
// ============================================================================

export interface ProjectSessionShell {
  kind: "project-session-shell";
  title: string;
  projectId: string;
  sessionId: string;
  projectLabel: string;
  sessionLabel: string;
  promptLabel: string;
  placeholder: string;
  submitLabel: string;
  emptyStateTitle: string;
  emptyStateBody: string;
}

export function renderShellTitle(): string {
  return "AVG Codex Lab";
}

export function createProjectSessionShell(
  projectId: string,
  sessionId: string,
): ProjectSessionShell {
  return {
    kind: "project-session-shell",
    title: renderShellTitle(),
    projectId,
    sessionId,
    projectLabel: `Project ${projectId}`,
    sessionLabel: `Session ${sessionId}`,
    promptLabel: "Raw idea",
    placeholder: "Enter the thought you want to shape",
    submitLabel: "Submit idea",
    emptyStateTitle: "Start a structured dialogue",
    emptyStateBody:
      "Open a project, choose a session and submit a raw thought to begin the AVG dialogue slice.",
  };
}

export function renderProjectSessionPage(
  projectId: string,
  sessionId: string,
): string {
  const shell = createProjectSessionShell(projectId, sessionId);

  return [
    `<main data-shell="${shell.kind}" data-project-id="${escapeHtml(shell.projectId)}" data-session-id="${escapeHtml(shell.sessionId)}">`,
    `  <header>`,
    `    <p>${escapeHtml(shell.title)}</p>`,
    `    <h1>${escapeHtml(shell.projectLabel)}</h1>`,
    `    <h2>${escapeHtml(shell.sessionLabel)}</h2>`,
    `  </header>`,
    `  <section aria-labelledby="avg-raw-idea">`,
    `    <h3 id="avg-raw-idea">${escapeHtml(shell.promptLabel)}</h3>`,
    `    <textarea placeholder="${escapeHtml(shell.placeholder)}"></textarea>`,
    `    <button type="button">${escapeHtml(shell.submitLabel)}</button>`,
    `  </section>`,
    `  <section aria-label="dialogue-empty-state">`,
    `    <strong>${escapeHtml(shell.emptyStateTitle)}</strong>`,
    `    <p>${escapeHtml(shell.emptyStateBody)}</p>`,
    `  </section>`,
    `</main>`,
  ].join("\n");
}

// ============================================================================
// Helpers
// ============================================================================

function indentMarkup(markup: string, indent: string): string[] {
  return markup.split("\n").map((line) => `${indent}${line}`);
}

function normalizeLocalTitle(value: string, fallback: string): string {
  const normalized = value.trim();

  return normalized.length > 0 ? normalized : fallback;
}

function stableLocalId(prefix: string, value: string): string {
  return `${prefix}-${normalizeLocalTitle(value, "untitled")
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "")
    .slice(0, 48)}`;
}

const workspaceNavigationSurfaces: Array<Pick<WorkspaceNavigationItem, "surface" | "label">> = [
  { surface: "dialogue", label: "Dialogue" },
  { surface: "documents", label: "Documents" },
  { surface: "retrieval", label: "Retrieval" },
  { surface: "claim-review", label: "Claim Review" },
  { surface: "map", label: "Map" },
  { surface: "artifacts", label: "Artifacts" },
];

const workspaceEmptyStates: WorkspaceShell["emptyStates"] = {
  dialogue: {
    title: "No dialogue yet",
    body: "Start with a raw thought. AVG will keep scope, status, risk and boundary visibility.",
  },
  documents: {
    title: "No local documents",
    body: "Register text or markdown as project-local evidence before using grounded retrieval.",
  },
  retrieval: {
    title: "No retrieval query",
    body: "Ask against registered project evidence; confidence is a risk signal, not proof.",
  },
  "claim-review": {
    title: "No claims to inspect",
    body: "Structured response claims will appear here with status, language mode and validation risk.",
  },
  map: {
    title: "No working map yet",
    body: "The concept map is a projection of session material, not Reality.",
  },
  artifacts: {
    title: "No artifacts generated",
    body: "Exports will preserve project id, session id, scope, risk markers and boundary notes.",
  },
};

export const workspaceStateStorageKey = "avg.mvp5.workspace-state";

// ============================================================================
// Workspace State Management
// ============================================================================

export function createLocalProjectRecord(
  title: string,
  options: { id?: string; createdAt?: string } = {},
): LocalProjectRecord {
  const normalizedTitle = normalizeLocalTitle(title, "Untitled project");

  return {
    id: options.id ?? stableLocalId("project", normalizedTitle),
    title: normalizedTitle,
    accessMode: "browser_local",
    createdAt: options.createdAt ?? "local-session",
  };
}

export function createLocalSessionRecord(
  projectId: string,
  title: string,
  options: { id?: string; createdAt?: string } = {},
): LocalSessionRecord {
  const normalizedTitle = normalizeLocalTitle(title, "Working session");

  return {
    id: options.id ?? stableLocalId("session", `${projectId}-${normalizedTitle}`),
    projectId,
    title: normalizedTitle,
    createdAt: options.createdAt ?? "local-session",
  };
}

export function createWorkspaceState(
  project: LocalProjectRecord,
  session: LocalSessionRecord,
  selectedSurface: WorkspaceSurface = "dialogue",
): WorkspaceState {
  if (session.projectId !== project.id) {
    throw new Error("Session project id must match the active project id.");
  }

  return {
    kind: "workspace-state",
    project,
    session,
    selectedSurface,
    contractVersion: "mvp-5",
    localOnly: true,
  };
}

export function createLocalWorkspaceState(
  projectTitle: string,
  sessionTitle = "Working session",
  options: {
    projectId?: string;
    sessionId?: string;
    createdAt?: string;
    selectedSurface?: WorkspaceSurface;
  } = {},
): WorkspaceState {
  const projectOptions: { id?: string; createdAt?: string } = {};
  const sessionOptions: { id?: string; createdAt?: string } = {};

  if (options.projectId !== undefined) {
    projectOptions.id = options.projectId;
  }

  if (options.sessionId !== undefined) {
    sessionOptions.id = options.sessionId;
  }

  if (options.createdAt !== undefined) {
    projectOptions.createdAt = options.createdAt;
    sessionOptions.createdAt = options.createdAt;
  }

  const project = createLocalProjectRecord(projectTitle, projectOptions);
  const session = createLocalSessionRecord(project.id, sessionTitle, sessionOptions);

  return createWorkspaceState(project, session, options.selectedSurface ?? "dialogue");
}

export function createWorkspaceStateFromInput(
  input: WorkspaceLocalProjectInput,
): WorkspaceState {
  return createLocalWorkspaceState(
    input.projectTitle,
    input.sessionTitle ?? "Working session",
    {
      ...(input.projectId !== undefined ? { projectId: input.projectId } : {}),
      ...(input.sessionId !== undefined ? { sessionId: input.sessionId } : {}),
      ...(input.createdAt !== undefined ? { createdAt: input.createdAt } : {}),
    },
  );
}

export function openLocalWorkspaceProject(
  project: LocalProjectRecord,
  session: LocalSessionRecord,
  selectedSurface: WorkspaceSurface = "dialogue",
): WorkspaceState {
  return createWorkspaceState(project, session, selectedSurface);
}

export function selectWorkspaceSurface(
  state: WorkspaceState,
  selectedSurface: WorkspaceSurface,
): WorkspaceState {
  return {
    ...state,
    selectedSurface,
  };
}

export function createWorkspaceShell(state: WorkspaceState): WorkspaceShell {
  return {
    kind: "workspace-shell",
    title: renderShellTitle(),
    project: state.project,
    session: state.session,
    selectedSurface: state.selectedSurface,
    navigation: workspaceNavigationSurfaces.map((item) => ({
      ...item,
      active: item.surface === state.selectedSurface,
    })),
    localOnlyLabel: "Local only",
    localOnlyBoundary:
      "This workspace is browser-local for MVP-5. It does not imply an account, shared workspace or production persistence.",
    resetLabel: "Reset local project",
    createProjectLabel: "New local project",
    openProjectLabel: "Open local project",
    technicalDetails: {
      projectId: state.project.id,
      sessionId: state.session.id,
      contractVersion: state.contractVersion,
    },
    emptyStates: workspaceEmptyStates,
  };
}

export function serializeWorkspaceState(state: WorkspaceState): string {
  return JSON.stringify(state);
}

function isLocalProjectRecord(value: unknown): value is LocalProjectRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const project = value as Partial<LocalProjectRecord>;

  return (
    typeof project.id === "string" &&
    typeof project.title === "string" &&
    project.accessMode === "browser_local" &&
    typeof project.createdAt === "string"
  );
}

function isLocalSessionRecord(value: unknown): value is LocalSessionRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const session = value as Partial<LocalSessionRecord>;

  return (
    typeof session.id === "string" &&
    typeof session.projectId === "string" &&
    typeof session.title === "string" &&
    typeof session.createdAt === "string"
  );
}

function isWorkspaceSurface(value: unknown): value is WorkspaceSurface {
  return workspaceNavigationSurfaces.some((item) => item.surface === value);
}

function isSerializedWorkspaceState(value: unknown): value is WorkspaceState {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const state = value as Partial<WorkspaceState>;

  return (
    state.kind === "workspace-state" &&
    isLocalProjectRecord(state.project) &&
    isLocalSessionRecord(state.session) &&
    isWorkspaceSurface(state.selectedSurface) &&
    state.contractVersion === "mvp-5" &&
    state.localOnly === true
  );
}

export function parseWorkspaceState(serialized: string): WorkspaceState {
  const value = JSON.parse(serialized) as unknown;

  if (!isSerializedWorkspaceState(value)) {
    throw new Error("Serialized workspace state does not match the MVP-5 local contract.");
  }

  return createWorkspaceState(value.project, value.session, value.selectedSurface);
}

export function saveWorkspaceState(
  storage: WorkspaceStoragePort,
  state: WorkspaceState,
  key = workspaceStateStorageKey,
): WorkspaceState {
  storage.setItem(key, serializeWorkspaceState(state));

  return state;
}

export function loadWorkspaceState(
  storage: WorkspaceStoragePort,
  key = workspaceStateStorageKey,
): WorkspaceState | undefined {
  const serialized = storage.getItem(key);

  if (serialized === null) {
    return undefined;
  }

  try {
    return parseWorkspaceState(serialized);
  } catch {
    storage.removeItem(key);

    return undefined;
  }
}

export function resetWorkspaceState(
  storage: WorkspaceStoragePort,
  key = workspaceStateStorageKey,
): void {
  storage.removeItem(key);
}

export function createAndSaveWorkspaceState(
  storage: WorkspaceStoragePort,
  input: WorkspaceLocalProjectInput,
  key = workspaceStateStorageKey,
): WorkspaceState {
  return saveWorkspaceState(storage, createWorkspaceStateFromInput(input), key);
}

export function openSavedWorkspaceState(
  storage: WorkspaceStoragePort,
  fallback: WorkspaceState,
  key = workspaceStateStorageKey,
): WorkspaceState {
  return loadWorkspaceState(storage, key) ?? saveWorkspaceState(storage, fallback, key);
}

export function renderWorkspaceShell(state: WorkspaceState): string {
  const shell = createWorkspaceShell(state);
  const activeEmptyState = shell.emptyStates[shell.selectedSurface];
  const navItems = shell.navigation.map(
    (item) =>
      `      <button type="button" data-surface="${escapeHtml(item.surface)}" aria-current="${item.active ? "page" : "false"}">${escapeHtml(item.label)}</button>`,
  );

  // Render active surface content based on selected surface
  let activeSurfaceContent: string[];
  if (shell.selectedSurface === "documents") {
    const docSurface = createDocumentRegistrationSurface({
      projectId: shell.project.id,
      documents: [],
    });
    activeSurfaceContent = indentMarkup(renderDocumentRegistrationSurface(docSurface), "    ");
  } else if (shell.selectedSurface === "retrieval") {
    const emptyResponse = {
      id: "response-retrieval-empty",
      project_id: shell.project.id,
      session_id: shell.session.id,
      message_id: "msg-retrieval-empty",
      summary: "No query submitted yet",
      scope: "AVG-705 grounded retrieval",
      claim_status: "boundary_statement" as const,
      language_mode: "operational_description" as const,
      validation_risk: "high" as const,
      risk_markers: ["no_query"],
      map_territory_boundary: "preserved" as const,
      next_action: "enter a question to search registered documents",
    };

    const retrievalReport = {
      responseSchema: { valid: true, errors: [] },
      groundedResponse: {
        response: emptyResponse,
        grounding: {
          citations: [],
          grounded_claims: [],
          interpretations: [],
          unsupported_claims: [],
          boundary_statement: "Ask against registered project evidence; confidence is a risk signal, not proof.",
          retrieval_confidence: "none" as const,
        },
      },
      accepted: false,
      boundaryNotes: ["No query submitted for grounded retrieval"],
    };

    activeSurfaceContent = indentMarkup(renderGroundedRetrievalFlow(
      shell.project.id,
      shell.session.id,
      "",
      [],
      retrievalReport,
    ), "    ");
  } else if (shell.selectedSurface === "claim-review") {
    const claimSurface = createClaimReviewSurface({
      projectId: shell.project.id,
      sessionId: shell.session.id,
      claims: [],
    });
    activeSurfaceContent = indentMarkup(renderClaimReviewSurface(claimSurface), "    ");
  } else if (shell.selectedSurface === "map") {
    const emptySnapshot = createEmptyGraphSnapshot();
    activeSurfaceContent = indentMarkup(renderConceptMapShell(emptySnapshot), "    ");
  } else {
    activeSurfaceContent = [
      `    <h2>${escapeHtml(activeEmptyState.title)}</h2>`,
      `    <p>${escapeHtml(activeEmptyState.body)}</p>`,
    ];
  }

  return [
    `<main data-shell="${shell.kind}" data-project-id="${escapeHtml(shell.project.id)}" data-session-id="${escapeHtml(shell.session.id)}" data-local-only="true">`,
    `  <header aria-label="workspace-status">`,
    `    <p>${escapeHtml(shell.title)}</p>`,
    `    <h1>${escapeHtml(shell.project.title)}</h1>`,
    `    <p>${escapeHtml(shell.session.title)}</p>`,
    `    <strong>${escapeHtml(shell.localOnlyLabel)}</strong>`,
    `    <p>${escapeHtml(shell.localOnlyBoundary)}</p>`,
    `    <button type="button" data-action="create-project">${escapeHtml(shell.createProjectLabel)}</button>`,
    `    <button type="button" data-action="open-project">${escapeHtml(shell.openProjectLabel)}</button>`,
    `    <button type="button" data-action="reset-project">${escapeHtml(shell.resetLabel)}</button>`,
    `  </header>`,
    `  <nav aria-label="workspace-surfaces">`,
    ...navItems,
    `  </nav>`,
    `  <section aria-label="active-workspace-surface" data-active-surface="${escapeHtml(shell.selectedSurface)}">`,
    ...activeSurfaceContent,
    `  </section>`,
    `  <aside aria-label="workspace-detail">`,
    `    <h2>Details</h2>`,
    `    <p>Selected records, claims, citations, nodes, documents and artifacts will open here without clearing the active dialogue context.</p>`,
    `  </aside>`,
    `  <details>`,
    `    <summary>Technical details</summary>`,
    `    <dl>`,
    `      <div><dt>Project id</dt><dd>${escapeHtml(shell.technicalDetails.projectId)}</dd></div>`,
    `      <div><dt>Session id</dt><dd>${escapeHtml(shell.technicalDetails.sessionId)}</dd></div>`,
    `      <div><dt>Contract version</dt><dd>${escapeHtml(shell.technicalDetails.contractVersion)}</dd></div>`,
    `    </dl>`,
    `  </details>`,
    `</main>`,
  ].join("\n");
}
