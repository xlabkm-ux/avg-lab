/**
 * Concept map types for AVG Codex Lab.
 */

import { type ClaimProjection, type GraphSnapshot } from "@avg/graph";
import { type AvgMapNode, type AvgMapEdge } from "@avg/schemas";

export type ConceptMapSource = GraphSnapshot | ClaimProjection;

export interface ConceptMapShell {
  kind: "concept-map-shell";
  title: string;
  subtitle: string;
  emptyStateTitle: string;
  emptyStateBody: string;
  snapshot: GraphSnapshot;
  nodeCount: number;
  edgeCount: number;
}

export type ConceptMapNodeView = Pick<
  AvgMapNode,
  "id" | "type" | "label" | "definition" | "coordinates" | "map_safety"
>;

export type ConceptMapEdgeView = Pick<
  AvgMapEdge,
  "id" | "type" | "from" | "to" | "claim_status" | "scope" | "constraints"
>;
