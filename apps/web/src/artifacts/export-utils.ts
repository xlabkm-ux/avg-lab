/**
 * @avg/web - Export utilities for AVG-708: Artifact Workspace and Export
 *
 * Client-side utilities for downloading files and copying to clipboard.
 * No React, no side effects — fully testable.
 */

import type { ArtifactKind, ArtifactFormat } from "./types";

// ============================================================================
// File naming
// ============================================================================

/**
 * Generate a descriptive filename for artifact export.
 * Pattern: {projectId}-{artifactKind}-{YYYY-MM-DD}.{ext}
 */
export function generateFilename(
  projectId: string,
  kind: ArtifactKind,
  format: ArtifactFormat
): string {
  const sanitizedProjectId = projectId.replace(/[^a-zA-Z0-9_-]/g, "");
  const date = new Date().toISOString().slice(0, 10);
  const ext = format === "json" ? "json" : "md";
  return `${sanitizedProjectId}-${kind}-${date}.${ext}`;
}

// ============================================================================
// Download
// ============================================================================

/**
 * Download a file with the given content, filename, and MIME type.
 * Creates a Blob, object URL, temporary <a> element, triggers download, then cleans up.
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================================
// Clipboard
// ============================================================================

/**
 * Copy text to clipboard using navigator.clipboard API.
 * Returns true on success, false on failure.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ============================================================================
// MIME types
// ============================================================================

export const MIME_TYPES = {
  json: "application/json",
  markdown: "text/markdown",
} as const;
