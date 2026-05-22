import { useState, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  type Node,
} from "reactflow";
import type { GraphSnapshot } from "@avg/graph";
import { useGraphToReactFlow } from "./useGraphToReactFlow";

interface ConceptMapPanelProps {
  snapshot: GraphSnapshot;
  projectId: string;
  sessionId: string;
}

function NodeDetailPanel({ node }: { node: Node }) {
  const data = node.data as Record<string, unknown>;
  const coordinates = data.coordinates as
    | { access_mode: string; language_mode: string; claim_status?: string }
    | undefined;

  return (
    <div className="concept-map-node-detail">
      <h4>{(data.label as string) ?? node.id}</h4>
      <dl>
        <div>
          <dt>Type</dt>
          <dd>{(data.nodeType as string) ?? "unknown"}</dd>
        </div>
        {coordinates !== undefined && (
          <>
            <div>
              <dt>Access Mode</dt>
              <dd>{coordinates.access_mode}</dd>
            </div>
            <div>
              <dt>Language Mode</dt>
              <dd>{coordinates.language_mode}</dd>
            </div>
            {coordinates.claim_status !== undefined && (
              <div>
                <dt>Claim Status</dt>
                <dd>{coordinates.claim_status}</dd>
              </div>
            )}
          </>
        )}
      </dl>
      {(data.definition as string | undefined) !== undefined && (
        <p className="node-detail-definition">{String(data.definition)}</p>
      )}
    </div>
  );
}

export function ConceptMapPanel({ snapshot, projectId, sessionId }: ConceptMapPanelProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { nodes, edges } = useGraphToReactFlow(snapshot);

  const handleNodeClick = useCallback((_event: React.MouseEvent, clickedNode: Node) => {
    setSelectedNode(clickedNode);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  if (snapshot.nodes.length === 0 && snapshot.edges.length === 0) {
    return (
      <section
        className="concept-map-surface"
        data-project-id={projectId}
        data-session-id={sessionId}
        data-node-count="0"
        data-edge-count="0"
      >
        <header>
          <h2>Concept Map</h2>
        </header>
        <div className="concept-map-empty">
          <h3>No working map yet</h3>
          <p>
            The concept map is a projection of session material, not Reality. Claims from structured
            responses will appear here as graph nodes and edges.
          </p>
        </div>
        <aside className="map-territory-boundary">
          <p>The map is a working projection, not Reality.</p>
        </aside>
      </section>
    );
  }

  return (
    <section
      className="concept-map-surface"
      data-project-id={projectId}
      data-session-id={sessionId}
      data-node-count={snapshot.nodes.length}
      data-edge-count={snapshot.edges.length}
    >
      <header>
        <h2>Concept Map</h2>
        <span className="concept-map-stats">
          {snapshot.nodes.length} nodes, {snapshot.edges.length} edges
        </span>
      </header>

      <div className="concept-map-canvas-wrapper">
        <div style={{ width: "100%", height: "500px" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            fitView
          >
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>

      {selectedNode !== null && (
        <aside className="concept-map-detail-panel">
          <h3>Node Details</h3>
          <NodeDetailPanel node={selectedNode} />
          <button
            type="button"
            className="btn-small"
            onClick={() => setSelectedNode(null)}
          >
            Close
          </button>
        </aside>
      )}

      <aside className="map-territory-boundary">
        <p>The map is a working projection, not Reality.</p>
      </aside>
    </section>
  );
}
