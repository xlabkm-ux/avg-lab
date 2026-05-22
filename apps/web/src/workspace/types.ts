/**
 * Workspace types for AVG Codex Lab browser application.
 */

export type WorkspaceSurface =
  | "dialogue"
  | "documents"
  | "retrieval"
  | "claim-review"
  | "map"
  | "artifacts";

export interface WorkspaceNavigationItem {
  surface: WorkspaceSurface;
  label: string;
  active: boolean;
}

export interface LocalProjectRecord {
  id: string;
  title: string;
  accessMode: "browser_local";
  createdAt: string;
}

export interface LocalSessionRecord {
  id: string;
  projectId: string;
  title: string;
  createdAt: string;
}

export interface WorkspaceState {
  kind: "workspace-state";
  project: LocalProjectRecord;
  session: LocalSessionRecord;
  selectedSurface: WorkspaceSurface;
  contractVersion: "mvp-5";
  localOnly: true;
}

export interface WorkspaceShell {
  kind: "workspace-shell";
  title: string;
  project: LocalProjectRecord;
  session: LocalSessionRecord;
  selectedSurface: WorkspaceSurface;
  navigation: WorkspaceNavigationItem[];
  localOnlyLabel: string;
  localOnlyBoundary: string;
  resetLabel: string;
  createProjectLabel: string;
  openProjectLabel: string;
  technicalDetails: {
    projectId: string;
    sessionId: string;
    contractVersion: "mvp-5";
  };
  emptyStates: Record<WorkspaceSurface, { title: string; body: string }>;
}

export type WorkspaceStoragePort = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem"
>;

export interface WorkspaceLocalProjectInput {
  projectTitle: string;
  sessionTitle?: string;
  projectId?: string;
  sessionId?: string;
  createdAt?: string;
}
