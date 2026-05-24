/**
 * @avg/web - Artifact types for AVG-708: Artifact Workspace and Export
 *
 * Defines the artifact envelope and types for client-side artifact generation.
 */

export type ArtifactKind =
  | "session_summary"
  | "grounded_answer"
  | "map_snapshot"
  | "citation_report";

export type ArtifactFormat = "json" | "markdown";

/**
 * Common envelope for all MVP-5 artifacts.
 * Every export must include: project_id, session_id, scope, risk_markers,
 * citation_ids, snippet_ids, and map_territory_boundary_note.
 */
export interface AvgArtifactEnvelope {
  artifact_kind: ArtifactKind;
  project_id: string;
  session_id: string;
  generated_at: string;
  contract_version: "mvp-5";
  scope: string;
  risk_markers: string[];
  citation_ids: string[];
  snippet_ids: string[];
  map_territory_boundary_note: string;
  uncertainty_preservation_note: string;
  payload: Record<string, unknown>;
}
