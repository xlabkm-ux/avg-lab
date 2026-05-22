/**
 * Concept map shell rendering for AVG Codex Lab.
 */

import {
  cloneGraphSnapshot,
  createEmptyGraphSnapshot,
  type ClaimProjection,
  type GraphSnapshot
} from "@avg/graph";
import { escapeHtml } from "@avg/utils";
import { renderShellTitle } from "@avg/html-rendering";

import {
  type ConceptMapSource,
  type ConceptMapShell,
} from "./types";

// Re-export types
export type {
  ConceptMapSource,
  ConceptMapShell,
};

// ============================================================================
// Helpers
// ============================================================================

function isClaimProjection(value: ConceptMapSource): value is ClaimProjection {
  return "node" in value && !("nodes" in value);
}

function snapshotFromProjection(projection: ClaimProjection): GraphSnapshot {
  return cloneGraphSnapshot({
    nodes: [projection.node],
    edges: projection.edges
  });
}

// ============================================================================
// Concept Map Shell
// ============================================================================

export function materializeConceptMapSnapshot(value: ConceptMapSource): GraphSnapshot {
  if (isClaimProjection(value)) {
    return snapshotFromProjection(value);
  }

  return cloneGraphSnapshot(value);
}

export function createConceptMapShell(source: ConceptMapSource = createEmptyGraphSnapshot()): ConceptMapShell {
  const snapshot = materializeConceptMapSnapshot(source);

  return {
    kind: "concept-map-shell",
    title: renderShellTitle(),
    subtitle: "Concept map shell",
    emptyStateTitle: "No map yet",
    emptyStateBody:
      "Pass a validated graph projection or snapshot to render the first working map.",
    snapshot,
    nodeCount: snapshot.nodes.length,
    edgeCount: snapshot.edges.length
  };
}

export function renderConceptMapShell(source: ConceptMapSource = createEmptyGraphSnapshot()): string {
  const shell = createConceptMapShell(source);
  const nodeItems = shell.snapshot.nodes.map((node) => {
    return [
      `    <li data-node-id="${escapeHtml(node.id)}" data-node-type="${escapeHtml(node.type)}">`,
      `      <strong>${escapeHtml(node.label)}</strong>`,
      `      <p>${escapeHtml(node.definition ?? node.label)}</p>`,
      `      <dl>`,
      `        <div><dt>Claim status</dt><dd>${escapeHtml(node.coordinates.claim_status ?? "unknown")}</dd></div>`,
      `        <div><dt>Language mode</dt><dd>${escapeHtml(node.coordinates.language_mode)}</dd></div>`,
      `        <div><dt>Access mode</dt><dd>${escapeHtml(node.coordinates.access_mode)}</dd></div>`,
      `      </dl>`,
      `    </li>`
    ].join("\n");
  });
  const edgeItems = shell.snapshot.edges.map((edge) => {
    const scopeLine =
      edge.scope !== undefined ? `      <p>${escapeHtml(edge.scope)}</p>\n` : "";

    return [
      `    <li data-edge-id="${escapeHtml(edge.id)}" data-edge-type="${escapeHtml(edge.type)}">`,
      `      <strong>${escapeHtml(edge.from)} → ${escapeHtml(edge.to)}</strong>`,
      `      <p>${escapeHtml(edge.claim_status)}</p>`,
      scopeLine + `    </li>`
    ].join("\n");
  });

  if (shell.nodeCount === 0 && shell.edgeCount === 0) {
    return [
      `<section data-shell="${shell.kind}" data-node-count="0" data-edge-count="0">`,
      `  <header>`,
      `    <p>${escapeHtml(shell.title)}</p>`,
      `    <h1>${escapeHtml(shell.subtitle)}</h1>`,
      `  </header>`,
      `  <section aria-label="concept-map-empty-state">`,
      `    <strong>${escapeHtml(shell.emptyStateTitle)}</strong>`,
      `    <p>${escapeHtml(shell.emptyStateBody)}</p>`,
      `  </section>`,
      `  <aside aria-label="map-territory-boundary">`,
      `    <p>The map is a working projection, not Reality.</p>`,
      `  </aside>`,
      `</section>`
    ].join("\n");
  }

  return [
    `<section data-shell="${shell.kind}" data-node-count="${shell.nodeCount}" data-edge-count="${shell.edgeCount}">`,
    `  <header>`,
    `    <p>${escapeHtml(shell.title)}</p>`,
    `    <h1>${escapeHtml(shell.subtitle)}</h1>`,
    `    <p>${escapeHtml(shell.emptyStateBody)}</p>`,
    `  </header>`,
    `  <section aria-label="concept-map-canvas">`,
    `    <div data-react-flow-ready="true">`,
    `      <p>React Flow-ready boundary</p>`,
    `      <p>${escapeHtml(String(shell.nodeCount))} nodes</p>`,
    `      <p>${escapeHtml(String(shell.edgeCount))} edges</p>`,
    `    </div>`,
    `  </section>`,
    `  <section aria-label="concept-map-nodes">`,
    `    <h2>Nodes</h2>`,
    `    <ul>`,
    ...nodeItems,
    `    </ul>`,
    `  </section>`,
    `  <section aria-label="concept-map-edges">`,
    `    <h2>Edges</h2>`,
    `    <ul>`,
    ...edgeItems,
    `    </ul>`,
    `  </section>`,
    `  <aside aria-label="map-territory-boundary">`,
    `    <p>The map is a working projection, not Reality.</p>`,
    `  </aside>`,
    `</section>`
  ].join("\n");
}
