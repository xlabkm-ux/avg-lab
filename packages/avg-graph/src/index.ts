import type { AvgClaim, AvgMapEdge, AvgMapNode } from "@avg/schemas";

export interface ClaimProjection {
  node: AvgMapNode;
  edges: AvgMapEdge[];
}

export interface GraphSnapshot {
  nodes: AvgMapNode[];
  edges: AvgMapEdge[];
}

export interface GraphDiff {
  addedNodes: AvgMapNode[];
  updatedNodes: AvgMapNode[];
  removedNodeIds: string[];
  addedEdges: AvgMapEdge[];
  updatedEdges: AvgMapEdge[];
  removedEdgeIds: string[];
}

export interface GraphRepository {
  ingestClaim(claim: AvgClaim): ClaimProjection;
  upsertNode(node: AvgMapNode): void;
  upsertEdge(edge: AvgMapEdge): void;
  getNode(id: string): AvgMapNode | undefined;
  getEdge(id: string): AvgMapEdge | undefined;
  listNodes(): AvgMapNode[];
  listEdges(): AvgMapEdge[];
  snapshot(): GraphSnapshot;
  diff(from: GraphSnapshot, to?: GraphSnapshot): GraphDiff;
}

export function createEmptyGraphSnapshot(): GraphSnapshot {
  return {
    nodes: [],
    edges: []
  };
}

function cloneNode(node: AvgMapNode): AvgMapNode {
  return {
    ...node,
    coordinates: { ...node.coordinates },
    map_safety: {
      known_risks: [...(node.map_safety.known_risks ?? [])]
    }
  };
}

function cloneEdge(edge: AvgMapEdge): AvgMapEdge {
  const clone: AvgMapEdge = {
    ...edge
  };

  if (edge.scope !== undefined) {
    clone.scope = edge.scope;
  }

  if (edge.constraints !== undefined) {
    clone.constraints = [...edge.constraints];
  }

  return clone;
}

export function cloneGraphSnapshot(snapshot: GraphSnapshot): GraphSnapshot {
  return {
    nodes: snapshot.nodes.map(cloneNode),
    edges: snapshot.edges.map(cloneEdge)
  };
}

function nodeAccessMode(claim: AvgClaim): AvgMapNode["coordinates"]["access_mode"] {
  if ((claim.source_refs?.length ?? 0) > 0) {
    return "indirectly_accessible";
  }

  return "unknown";
}

export function projectClaimToMapNode(claim: AvgClaim): ClaimProjection {
  const nodeId = `node_${claim.id}`;
  const node: AvgMapNode = {
    id: nodeId,
    type: "claim",
    label: claim.statement,
    definition: claim.repair ?? claim.statement,
    coordinates: {
      access_mode: nodeAccessMode(claim),
      language_mode: claim.language_mode,
      claim_status: claim.claim_status
    },
    map_safety: {
      known_risks: [...claim.risks]
    }
  };

  return {
    node,
    edges: (claim.source_refs ?? []).map((sourceRef) => {
      const edge: AvgMapEdge = {
        id: `edge_${sourceRef}_${claim.id}`,
        type: "cites",
        from: sourceRef,
        to: nodeId,
        claim_status: claim.claim_status,
        constraints: ["source_ref_is_not_full_evidence"]
      };

      if (claim.scope !== undefined) {
        edge.scope = claim.scope;
      }

      return edge;
    })
  };
}

function indexNodes(snapshot: GraphSnapshot): Map<string, AvgMapNode> {
  return new Map(snapshot.nodes.map((node) => [node.id, node]));
}

function indexEdges(snapshot: GraphSnapshot): Map<string, AvgMapEdge> {
  return new Map(snapshot.edges.map((edge) => [edge.id, edge]));
}

function sameGraphRecord(left: AvgMapNode | AvgMapEdge, right: AvgMapNode | AvgMapEdge): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function diffGraphSnapshots(from: GraphSnapshot, to: GraphSnapshot): GraphDiff {
  const fromNodes = indexNodes(from);
  const toNodes = indexNodes(to);
  const fromEdges = indexEdges(from);
  const toEdges = indexEdges(to);

  const addedNodes: AvgMapNode[] = [];
  const updatedNodes: AvgMapNode[] = [];
  const removedNodeIds: string[] = [];
  const addedEdges: AvgMapEdge[] = [];
  const updatedEdges: AvgMapEdge[] = [];
  const removedEdgeIds: string[] = [];

  for (const [id, node] of toNodes) {
    const previous = fromNodes.get(id);
    if (!previous) {
      addedNodes.push(cloneNode(node));
      continue;
    }

    if (!sameGraphRecord(previous, node)) {
      updatedNodes.push(cloneNode(node));
    }
  }

  for (const id of fromNodes.keys()) {
    if (!toNodes.has(id)) {
      removedNodeIds.push(id);
    }
  }

  for (const [id, edge] of toEdges) {
    const previous = fromEdges.get(id);
    if (!previous) {
      addedEdges.push(cloneEdge(edge));
      continue;
    }

    if (!sameGraphRecord(previous, edge)) {
      updatedEdges.push(cloneEdge(edge));
    }
  }

  for (const id of fromEdges.keys()) {
    if (!toEdges.has(id)) {
      removedEdgeIds.push(id);
    }
  }

  return {
    addedNodes,
    updatedNodes,
    removedNodeIds,
    addedEdges,
    updatedEdges,
    removedEdgeIds
  };
}

export function createGraphRepository(initial?: GraphSnapshot): GraphRepository {
  const nodes = new Map<string, AvgMapNode>();
  const edges = new Map<string, AvgMapEdge>();

  for (const node of initial?.nodes ?? []) {
    nodes.set(node.id, cloneNode(node));
  }

  for (const edge of initial?.edges ?? []) {
    edges.set(edge.id, cloneEdge(edge));
  }

  function snapshot(): GraphSnapshot {
    return {
      nodes: Array.from(nodes.values(), cloneNode),
      edges: Array.from(edges.values(), cloneEdge)
    };
  }

  function ingestClaim(claim: AvgClaim): ClaimProjection {
    const projection = projectClaimToMapNode(claim);

    upsertNode(projection.node);
    for (const edge of projection.edges) {
      upsertEdge(edge);
    }

    return {
      node: cloneNode(projection.node),
      edges: projection.edges.map(cloneEdge)
    };
  }

  function upsertNode(node: AvgMapNode): void {
    nodes.set(node.id, cloneNode(node));
  }

  function upsertEdge(edge: AvgMapEdge): void {
    edges.set(edge.id, cloneEdge(edge));
  }

  function getNode(id: string): AvgMapNode | undefined {
    const node = nodes.get(id);
    return node ? cloneNode(node) : undefined;
  }

  function getEdge(id: string): AvgMapEdge | undefined {
    const edge = edges.get(id);
    return edge ? cloneEdge(edge) : undefined;
  }

  function listNodes(): AvgMapNode[] {
    return Array.from(nodes.values(), cloneNode);
  }

  function listEdges(): AvgMapEdge[] {
    return Array.from(edges.values(), cloneEdge);
  }

  function diff(from: GraphSnapshot, to: GraphSnapshot = snapshot()): GraphDiff {
    return diffGraphSnapshots(from, to);
  }

  return {
    ingestClaim,
    upsertNode,
    upsertEdge,
    getNode,
    getEdge,
    listNodes,
    listEdges,
    snapshot,
    diff
  };
}
