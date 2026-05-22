import {
  cloneGraphSnapshot,
  createEmptyGraphSnapshot,
  diffGraphSnapshots,
  type ClaimProjection,
  type GraphSnapshot
} from "@avg/graph";
import {
  createDocumentRepository,
  type AvgRetrievalHit,
  type RegisterDocumentResult,
  type SearchDocumentsResult
} from "@avg/retrieval";
import { composeGroundedResponse, type GroundedResponseCompositionReport } from "@avg/validation";
import {
  renderDialogueFlowPageFromGroundedReport,
  renderGroundedRetrievalFlow
} from "@avg/html-rendering";
import type {
  ProjectRecord,
  SessionRecord,
  MessageRecord,
  MapSnapshotLike,
  MapDiffArtifact,
  ComposeGroundedProjectResponseInput,
  GroundedProjectRetrievalFlow,
  RegisterProjectDocumentBody,
  RenderGroundedProjectDialoguePageInput,
  RenderGroundedProjectRetrievalFlowRequest
} from "../types";

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

function nextId(prefix: IdPrefix): string {
  counters[prefix] += 1;
  return `${prefix}_${String(counters[prefix]).padStart(3, "0")}`;
}

export function health(): { status: "ok"; service: "avg-api" } {
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
  options: { limit?: number } = {}
): SearchDocumentsResult {
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

export function createProjectSessionMessage(
  projectName: string,
  sessionTitle: string,
  content: string
): { project: ProjectRecord; session: SessionRecord; message: MessageRecord } {
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
