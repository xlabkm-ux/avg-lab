/**
 * Dialogue surface types for AVG Codex Lab.
 */

import type { ValidationResult } from "@avg/schemas";
import type { DialogueMessage } from "@avg/html-rendering";
import type { StructuredResponseDetailsPanel } from "@avg/html-rendering";

export type StructuredDialogueStatus =
  | "empty"
  | "loading"
  | "ready"
  | "error"
  | "recovered";

export interface StructuredDialogueError {
  code:
    | "empty_raw_thought"
    | "invalid_structured_response"
    | "response_project_session_mismatch"
    | "dialogue_runtime_error";
  message: string;
  boundaryNotes: string[];
  validation?: ValidationResult;
}

export interface StructuredDialogueSurfaceInput {
  projectId: string;
  sessionId: string;
  rawThought?: string;
  messages?: DialogueMessage[];
  response?: unknown;
  isLoading?: boolean;
  error?: StructuredDialogueError;
  recoveredFrom?: StructuredDialogueError;
}

export interface StructuredDialogueSurface {
  kind: "structured-dialogue-surface";
  title: string;
  projectId: string;
  sessionId: string;
  rawThought: string;
  messages: DialogueMessage[];
  status: StructuredDialogueStatus;
  emptyStateTitle: string;
  emptyStateBody: string;
  loadingLabel: string;
  composerLabel: string;
  composerPlaceholder: string;
  submitLabel: string;
  responseDetails?: StructuredResponseDetailsPanel;
  error?: StructuredDialogueError;
  recoveredFrom?: StructuredDialogueError;
}
