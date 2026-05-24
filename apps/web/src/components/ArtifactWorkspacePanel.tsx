/**
 * @avg/web - Artifact Workspace Panel for AVG-708: Artifact Workspace and Export
 *
 * Main React component for generating, previewing, and exporting session artifacts.
 * Follows existing panel patterns: single file, sub-components in same file, named exports.
 */

import { useState, useCallback } from "react";
import type { AvgClaim, AvgStructuredResponse } from "@avg/schemas";
import type { GraphSnapshot } from "@avg/graph";
import type { DialogueMessage } from "@avg/html-rendering";
import type { AvgRetrievalHit } from "@avg/retrieval";
import type { AvgGroundedResponseBoundary } from "@avg/validation";
import {
  generateSessionSummaryArtifact,
  generateGroundedAnswerArtifact,
  generateMapSnapshotArtifact,
  generateCitationReportArtifact,
  serializeAsJson,
  serializeAsMarkdown,
} from "../artifacts/generators";
import { downloadFile, copyToClipboard, generateFilename, MIME_TYPES } from "../artifacts/export-utils";
import type { ArtifactKind, ArtifactFormat } from "../artifacts/types";

// ============================================================================
// Props
// ============================================================================

interface ArtifactWorkspacePanelProps {
  projectId: string;
  sessionId: string;
  projectTitle: string;
  claims: AvgClaim[];
  mapSnapshot?: GraphSnapshot;
  dialogueMessages: DialogueMessage[];
  retrievalHits?: AvgRetrievalHit[];
  lastGroundedResponse?: AvgStructuredResponse | null;
  lastGrounding?: AvgGroundedResponseBoundary | null;
}

// ============================================================================
// Constants
// ============================================================================

const ARTIFACT_KINDS: { kind: ArtifactKind; label: string; description: string }[] = [
  {
    kind: "session_summary",
    label: "Session Summary",
    description: "Structured overview of dialogue turns, claims, and risks",
  },
  {
    kind: "grounded_answer",
    label: "Grounded Answer",
    description: "Grounded response with citations and unsupported claims",
  },
  {
    kind: "map_snapshot",
    label: "Map Snapshot",
    description: "Concept map nodes and edges at time of export",
  },
  {
    kind: "citation_report",
    label: "Citation Report",
    description: "All retrieval hits with citation and snippet IDs",
  },
];

const FORMATS: { format: ArtifactFormat; label: string }[] = [
  { format: "json", label: "JSON" },
  { format: "markdown", label: "Markdown" },
];

// ============================================================================
// Sub-components
// ============================================================================

function ArtifactKindSelector({
  selectedKind,
  onSelect,
}: {
  selectedKind: ArtifactKind;
  onSelect: (kind: ArtifactKind) => void;
}) {
  return (
    <div className="artifact-kind-selector" role="radiogroup" aria-label="Artifact type">
      {ARTIFACT_KINDS.map(({ kind, label, description }) => (
        <button
          key={kind}
          type="button"
          className={`artifact-kind-btn ${selectedKind === kind ? "active" : ""}`}
          role="radio"
          aria-checked={selectedKind === kind}
          aria-describedby={`artifact-desc-${kind}`}
          onClick={() => onSelect(kind)}
          data-testid={`artifact-kind-${kind}`}
        >
          {label}
          <span
            id={`artifact-desc-${kind}`}
            className="artifact-kind-description"
            aria-hidden="true"
          >
            {description}
          </span>
        </button>
      ))}
    </div>
  );
}

function FormatSelector({
  selectedFormat,
  onSelect,
}: {
  selectedFormat: ArtifactFormat;
  onSelect: (format: ArtifactFormat) => void;
}) {
  return (
    <div className="artifact-format-selector" role="radiogroup" aria-label="Export format">
      {FORMATS.map(({ format, label }) => (
        <button
          key={format}
          type="button"
          className={`artifact-format-btn ${selectedFormat === format ? "active" : ""}`}
          role="radio"
          aria-checked={selectedFormat === format}
          onClick={() => onSelect(format)}
          data-testid={`artifact-format-${format}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function GenerateButton({
  onClick,
  isGenerating,
}: {
  onClick: () => void;
  isGenerating: boolean;
}) {
  return (
    <button
      type="button"
      className="artifact-generate-btn"
      onClick={onClick}
      disabled={isGenerating}
      data-testid="artifact-generate-btn"
    >
      {isGenerating ? "Generating..." : "Generate"}
    </button>
  );
}

function ArtifactPreview({
  content,
  selectedKind,
}: {
  content: string | null;
  selectedKind: ArtifactKind;
}) {
  if (!content) {
    return null;
  }

  const kindLabel = ARTIFACT_KINDS.find((k) => k.kind === selectedKind)?.label || selectedKind;

  return (
    <div className="artifact-preview" data-testid="artifact-preview">
      <header className="artifact-preview-header">
        <h3>Preview: {kindLabel}</h3>
        <span className="artifact-boundary-note" data-testid="artifact-boundary-note">
          Map is a projection, not Reality
        </span>
      </header>
      <pre className="artifact-preview-content" data-testid="artifact-preview-content">
        {content}
      </pre>
    </div>
  );
}

function ExportActions({
  content,
  projectId,
  selectedKind,
  selectedFormat,
}: {
  content: string | null;
  projectId: string;
  selectedKind: ArtifactKind;
  selectedFormat: ArtifactFormat;
}) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!content) return;
    const success = await copyToClipboard(content);
    setCopySuccess(success);
    if (success) {
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }, [content]);

  const handleDownload = useCallback(() => {
    if (!content) return;
    const filename = generateFilename(projectId, selectedKind, selectedFormat);
    const mimeType = selectedFormat === "json" ? MIME_TYPES.json : MIME_TYPES.markdown;
    downloadFile(content, filename, mimeType);
  }, [content, projectId, selectedKind, selectedFormat]);

  if (!content) {
    return null;
  }

  return (
    <div className="artifact-actions" data-testid="artifact-actions">
      <button
        type="button"
        className={`artifact-btn-copy ${copySuccess ? "copy-success" : ""}`}
        onClick={handleCopy}
        data-testid="artifact-copy-btn"
        aria-label={copySuccess ? "Copied to clipboard" : "Copy to clipboard"}
      >
        {copySuccess ? "Copied!" : "Copy"}
      </button>
      <button
        type="button"
        className="artifact-btn-download"
        onClick={handleDownload}
        data-testid="artifact-download-btn"
        aria-label="Download artifact file"
      >
        Download
      </button>
    </div>
  );
}

function EmptyState({ hasData }: { hasData: boolean }) {
  if (hasData) {
    return null;
  }

  return (
    <div className="artifact-empty" data-testid="artifact-empty-state">
      <h3>No session data to export yet</h3>
      <p>
        Start a dialogue or register documents to create artifacts. Artifacts preserve
        uncertainty — unsupported claims and risk markers are included, not hidden.
      </p>
    </div>
  );
}

function StaleIndicator({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="artifact-stale-indicator" data-testid="artifact-stale-indicator">
      <p>Session data has changed. Generate a fresh artifact to reflect the latest state.</p>
      <button
        type="button"
        className="artifact-refresh-btn"
        onClick={onRefresh}
        data-testid="artifact-refresh-btn"
      >
        Refresh
      </button>
    </div>
  );
}

// ============================================================================
// Main component
// ============================================================================

export function ArtifactWorkspacePanel({
  projectId,
  sessionId,
  projectTitle,
  claims,
  mapSnapshot,
  dialogueMessages,
  retrievalHits = [],
  lastGroundedResponse,
  lastGrounding,
}: ArtifactWorkspacePanelProps) {
  const [selectedKind, setSelectedKind] = useState<ArtifactKind>("session_summary");
  const [selectedFormat, setSelectedFormat] = useState<ArtifactFormat>("json");
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationTimestamp, setGenerationTimestamp] = useState<number | null>(null);

  // Detect stale state: if props changed after generation
  const hasStaleState =
    generationTimestamp !== null &&
    (dialogueMessages.length > 0 || claims.length > 0 || retrievalHits.length > 0);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);

    try {
      let envelope;

      switch (selectedKind) {
        case "session_summary":
          envelope = generateSessionSummaryArtifact(
            projectId,
            sessionId,
            projectTitle,
            dialogueMessages,
            claims,
            mapSnapshot,
            retrievalHits
          );
          break;

        case "grounded_answer":
          envelope = generateGroundedAnswerArtifact(
            projectId,
            sessionId,
            lastGroundedResponse || null,
            lastGrounding || null,
            retrievalHits,
            claims
          );
          break;

        case "map_snapshot":
          envelope = generateMapSnapshotArtifact(
            projectId,
            sessionId,
            mapSnapshot,
            claims,
            retrievalHits
          );
          break;

        case "citation_report":
          envelope = generateCitationReportArtifact(
            projectId,
            sessionId,
            retrievalHits,
            claims
          );
          break;
      }

      const content =
        selectedFormat === "json" ? serializeAsJson(envelope) : serializeAsMarkdown(envelope);

      setPreviewContent(content);
      setGenerationTimestamp(Date.now());
    } finally {
      setIsGenerating(false);
    }
  }, [
    projectId,
    sessionId,
    projectTitle,
    dialogueMessages,
    claims,
    mapSnapshot,
    retrievalHits,
    selectedKind,
    selectedFormat,
    lastGroundedResponse,
    lastGrounding,
  ]);

  const handleRefresh = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  // Check if there's any data to export
  const hasData =
    dialogueMessages.length > 0 ||
    claims.length > 0 ||
    (mapSnapshot && mapSnapshot.nodes.length > 0) ||
    retrievalHits.length > 0;

  return (
    <section className="artifact-workspace" data-testid="artifact-workspace-panel">
      <header>
        <h2>Artifacts</h2>
        <p className="artifact-uncertainty-note">
          This artifact preserves uncertainty — unsupported claims and risk markers are included, not hidden.
        </p>
      </header>

      <EmptyState hasData={hasData} />

      {hasData && (
        <>
          <ArtifactKindSelector selectedKind={selectedKind} onSelect={setSelectedKind} />

          <FormatSelector selectedFormat={selectedFormat} onSelect={setSelectedFormat} />

          <GenerateButton onClick={handleGenerate} isGenerating={isGenerating} />

          {hasStaleState && previewContent && <StaleIndicator onRefresh={handleRefresh} />}

          <ArtifactPreview content={previewContent} selectedKind={selectedKind} />

          <ExportActions
            content={previewContent}
            projectId={projectId}
            selectedKind={selectedKind}
            selectedFormat={selectedFormat}
          />
        </>
      )}
    </section>
  );
}
