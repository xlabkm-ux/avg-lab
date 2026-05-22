import { useMemo } from "react";
import type { Node, Edge } from "reactflow";
import type { GraphSnapshot } from "@avg/graph";
import type { AvgMapNode, AvgMapEdge } from "@avg/schemas";

const NODE_SPACING_X = 250;
const NODE_SPACING_Y = 150;
const START_X = 50;
const START_Y = 50;

const nodeTypeColors: Record<string, { bg: string; border: string }> = {
  term: { bg: "#e3f2fd", border: "#1976d2" },
  claim: { bg: "#fff3e0", border: "#f57c00" },
  concept: { bg: "#f3e5f5", border: "#7b1fa2" },
  map: { bg: "#e8f5e9", border: "#388e3c" },
  risk: { bg: "#ffebee", border: "#d32f2f" },
  source_fragment: { bg: "#fce4ec", border: "#c2185b" },
  artifact: { bg: "#e0f7fa", border: "#00838f" },
  mode: { bg: "#f1f8e9", border: "#689f38" },
};

const edgeTypeStyles: Record<string, { color: string; style?: "dashed" | "dotted" }> = {
  defines: { color: "#1976d2" },
  supports: { color: "#388e3c" },
  contradicts: { color: "#d32f2f", style: "dashed" },
  depends_on: { color: "#f57c00" },
  contains: { color: "#7b1fa2" },
  manifests_as: { color: "#00838f" },
  risks: { color: "#d32f2f", style: "dotted" },
  repairs: { color: "#388e3c", style: "dashed" },
  cites: { color: "#607d8b" },
  analogizes: { color: "#9c27b0", style: "dashed" },
};

function computeNodePositions(nodes: AvgMapNode[]): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const cols = Math.max(2, Math.ceil(Math.sqrt(nodes.length)));

  nodes.forEach((node, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    positions.set(node.id, {
      x: START_X + col * NODE_SPACING_X,
      y: START_Y + row * NODE_SPACING_Y,
    });
  });

  return positions;
}

function avgNodeToReactFlowNode(
  node: AvgMapNode,
  position: { x: number; y: number },
): Node {
  const colors = nodeTypeColors[node.type] ?? { bg: "#f3e5f5", border: "#7b1fa2" };

  return {
    id: node.id,
    type: "default",
    position,
    data: {
      label: node.label,
      nodeType: node.type,
      definition: node.definition,
      coordinates: node.coordinates,
      mapSafety: node.map_safety,
      style: {
        background: colors.bg,
        borderColor: colors.border,
      },
    },
    style: {
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      borderRadius: "4px",
      padding: "8px",
      fontSize: "12px",
      minWidth: "150px",
      maxWidth: "250px",
    },
  };
}

function avgEdgeToReactFlowEdge(edge: AvgMapEdge): Edge {
  const style = edgeTypeStyles[edge.type] ?? { color: "#607d8b" };

  return {
    id: edge.id,
    source: edge.from,
    target: edge.to,
    label: edge.type.replace(/_/g, " "),
    animated: style.style === "dashed" || style.style === "dotted",
    style: {
      stroke: style.color,
      strokeWidth: 2,
      strokeDasharray: style.style === "dotted" ? "2 4" : style.style === "dashed" ? "5 5" : undefined,
    },
    data: {
      edgeType: edge.type,
      claimStatus: edge.claim_status,
      scope: edge.scope,
      constraints: edge.constraints,
    },
  };
}

export function useGraphToReactFlow(snapshot: GraphSnapshot): {
  nodes: Node[];
  edges: Edge[];
} {
  return useMemo(() => {
    const positions = computeNodePositions(snapshot.nodes);

    const nodes = snapshot.nodes.map((node) =>
      avgNodeToReactFlowNode(node, positions.get(node.id) ?? { x: START_X, y: START_Y }),
    );

    const edges = snapshot.edges.map(avgEdgeToReactFlowEdge);

    return { nodes, edges };
  }, [snapshot]);
}
