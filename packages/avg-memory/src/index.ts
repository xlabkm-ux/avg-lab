/**
 * @avg/memory — Repository interfaces for AVG data persistence
 *
 * This package defines interfaces that abstract over the actual storage
 * implementation (in-memory, PostgreSQL, Neo4j, etc.).
 *
 * Current implementation: In-memory (in apps/api/src/core/)
 * Future implementations: PostgreSQL for documents, Neo4j for graph
 */

// ─────────────────────────────────────────────
// Project Repository
// ─────────────────────────────────────────────

export interface ProjectRecord {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface ProjectRepository {
  create(project: Omit<ProjectRecord, "created_at" | "updated_at">): Promise<ProjectRecord>;
  findById(id: string): Promise<ProjectRecord | undefined>;
  findAll(): Promise<ProjectRecord[]>;
  update(id: string, updates: Partial<ProjectRecord>): Promise<ProjectRecord | undefined>;
  delete(id: string): Promise<boolean>;
}

// ─────────────────────────────────────────────
// Session Repository
// ─────────────────────────────────────────────

export interface SessionRecord {
  id: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface SessionRepository {
  create(session: Omit<SessionRecord, "created_at" | "updated_at">): Promise<SessionRecord>;
  findById(id: string): Promise<SessionRecord | undefined>;
  findByProject(projectId: string): Promise<SessionRecord[]>;
  update(id: string, updates: Partial<SessionRecord>): Promise<SessionRecord | undefined>;
  delete(id: string): Promise<boolean>;
}

// ─────────────────────────────────────────────
// Message Repository
// ─────────────────────────────────────────────

export interface MessageRecord {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface MessageRepository {
  create(message: Omit<MessageRecord, "created_at">): Promise<MessageRecord>;
  findById(id: string): Promise<MessageRecord | undefined>;
  findBySession(sessionId: string): Promise<MessageRecord[]>;
  delete(id: string): Promise<boolean>;
}

// ─────────────────────────────────────────────
// Document Repository
// ─────────────────────────────────────────────

export interface DocumentRecord {
  id: string;
  project_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface DocumentRepository {
  create(doc: Omit<DocumentRecord, "created_at" | "updated_at">): Promise<DocumentRecord>;
  findById(id: string): Promise<DocumentRecord | undefined>;
  findByProject(projectId: string): Promise<DocumentRecord[]>;
  search(projectId: string, query: string): Promise<DocumentRecord[]>;
  update(id: string, updates: Partial<DocumentRecord>): Promise<DocumentRecord | undefined>;
  delete(id: string): Promise<boolean>;
}

// ─────────────────────────────────────────────
// Graph Repository
// ─────────────────────────────────────────────

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  properties?: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  properties?: Record<string, unknown>;
}

export interface GraphRepository {
  createNode(node: GraphNode): Promise<GraphNode>;
  findNodeById(id: string): Promise<GraphNode | undefined>;
  findNodesByProject(projectId: string): Promise<GraphNode[]>;
  createEdge(edge: GraphEdge): Promise<GraphEdge>;
  findEdgesByNode(nodeId: string): Promise<GraphEdge[]>;
  findEdgesByProject(projectId: string): Promise<GraphEdge[]>;
  deleteNode(id: string): Promise<boolean>;
  deleteEdge(id: string): Promise<boolean>;
}
