import { GroundedRetrievalFlow } from './GroundedRetrievalFlow';
import { ClaimReviewPanel } from './ClaimReviewPanel';
import { ConceptMapPanel } from './ConceptMapPanel';
import type { WorkspaceSurface } from '../index';
import type { AvgClaim } from '@avg/schemas';
import type { GraphSnapshot } from '@avg/graph';

interface WorkspaceShellProps {
  projectId: string;
  sessionId: string;
  projectTitle: string;
  selectedSurface: WorkspaceSurface;
  onSurfaceChange: (surface: WorkspaceSurface) => void;
  claims?: AvgClaim[];
  mapSnapshot?: GraphSnapshot;
}

const navigationItems: { surface: WorkspaceSurface; label: string }[] = [
  { surface: 'dialogue', label: 'Dialogue' },
  { surface: 'documents', label: 'Documents' },
  { surface: 'retrieval', label: 'Retrieval' },
  { surface: 'claim-review', label: 'Claim Review' },
  { surface: 'map', label: 'Map' },
  { surface: 'artifacts', label: 'Artifacts' },
];

export function WorkspaceShell({
  projectId,
  sessionId,
  projectTitle,
  selectedSurface,
  onSurfaceChange,
  claims = [],
  mapSnapshot,
}: WorkspaceShellProps) {
  return (
    <main className="workspace-shell" data-project-id={projectId} data-session-id={sessionId}>
      <header className="workspace-header">
        <h1>{projectTitle}</h1>
        <div className="workspace-meta">
          <span className="local-only-badge">Local only</span>
          <details className="technical-details">
            <summary>Technical details</summary>
            <dl>
              <div>
                <dt>Project ID</dt>
                <dd><code>{projectId}</code></dd>
              </div>
              <div>
                <dt>Session ID</dt>
                <dd><code>{sessionId}</code></dd>
              </div>
              <div>
                <dt>Contract version</dt>
                <dd><code>mvp-5</code></dd>
              </div>
            </dl>
          </details>
        </div>
      </header>

      <nav className="workspace-nav" aria-label="workspace-surfaces">
        {navigationItems.map((item) => (
          <button
            key={item.surface}
            type="button"
            className={`nav-item ${selectedSurface === item.surface ? 'active' : ''}`}
            onClick={() => onSurfaceChange(item.surface)}
            aria-current={selectedSurface === item.surface ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <section className="active-surface" data-active-surface={selectedSurface}>
        {selectedSurface === 'retrieval' && (
          <GroundedRetrievalFlow projectId={projectId} sessionId={sessionId} />
        )}

        {selectedSurface === 'dialogue' && (
          <div className="surface-placeholder">
            <h2>Dialogue surface</h2>
            <p>Structured dialogue with claim status, risk, and boundary display.</p>
          </div>
        )}

        {selectedSurface === 'documents' && (
          <div className="surface-placeholder">
            <h2>Documents surface</h2>
            <p>Register and manage project-local evidence documents.</p>
          </div>
        )}

        {selectedSurface === 'claim-review' && (
          <ClaimReviewPanel
            claims={claims}
            projectId={projectId}
            sessionId={sessionId}
          />
        )}

        {selectedSurface === 'map' && mapSnapshot !== undefined && (
          <ConceptMapPanel
            snapshot={mapSnapshot}
            projectId={projectId}
            sessionId={sessionId}
          />
        )}

        {selectedSurface === 'map' && mapSnapshot === undefined && (
          <div className="surface-placeholder">
            <h2>Concept map surface</h2>
            <p>Visualize working claims as graph nodes and edges.</p>
          </div>
        )}

        {selectedSurface === 'artifacts' && (
          <div className="surface-placeholder">
            <h2>Artifacts surface</h2>
            <p>Export session summaries, citations, and map snapshots.</p>
          </div>
        )}
      </section>
    </main>
  );
}
