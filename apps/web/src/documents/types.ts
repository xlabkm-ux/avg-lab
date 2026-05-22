/**
 * Document registration types for AVG Codex Lab.
 */

export interface AvgDocumentRef {
  id: string;
  project_id: string;
  title: string;
  source_kind: "local_text" | "local_markdown" | "local_document";
  created_at: string;
  metadata?: Record<string, string>;
}

export type DocumentRegistrationStatus = "empty" | "loading" | "registered" | "error";

export interface DocumentRegistrationError {
  code: "missing_title" | "missing_text" | "invalid_source_kind" | "registration_failed";
  message: string;
  details?: string;
}

export interface RegisteredDocumentSummary {
  document: AvgDocumentRef;
  snippet_count: number;
  token_estimate: number;
}

export interface AvgSourceSnippet {
  id: string;
  document_id: string;
  project_id: string;
  ordinal: number;
  text: string;
  location?: string;
  source_label: string;
}

export interface DocumentDetailWithSnippets {
  document: AvgDocumentRef;
  snippets: AvgSourceSnippet[];
  token_estimate: number;
}

export interface DocumentRegistrationSurfaceInput {
  projectId: string;
  documents?: RegisteredDocumentSummary[];
  selectedDocument?: DocumentDetailWithSnippets | undefined;
  isLoading?: boolean;
  error?: DocumentRegistrationError;
}

export interface DocumentRegistrationSurface {
  kind: "document-registration-surface";
  title: string;
  projectId: string;
  documents: RegisteredDocumentSummary[];
  selectedDocument?: DocumentDetailWithSnippets | undefined;
  status: DocumentRegistrationStatus;
  formLabel: string;
  titleLabel: string;
  titlePlaceholder: string;
  sourceKindLabel: string;
  textLabel: string;
  textPlaceholder: string;
  submitLabel: string;
  registeredListTitle: string;
  emptyStateTitle: string;
  emptyStateBody: string;
  error?: DocumentRegistrationError;
}
