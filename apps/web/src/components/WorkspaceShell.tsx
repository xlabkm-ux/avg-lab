import { GroundedRetrievalFlow } from './GroundedRetrievalFlow';
import { DialogueSurface } from './DialogueSurface';
import { ClaimReviewPanel } from './ClaimReviewPanel';
import { ConceptMapPanel } from './ConceptMapPanel';
import { DocumentRegistrationPanel } from './DocumentRegistrationPanel';
import { ArtifactWorkspacePanel } from './ArtifactWorkspacePanel';
import type { WorkspaceSurface } from '../index';
import type { AvgClaim } from '@avg/schemas';
import type { GraphSnapshot } from '@avg/graph';
import type { DialogueMessage } from '@avg/html-rendering';
import type { AvgRetrievalHit } from '@avg/retrieval';
import type { AvgStructuredResponse } from '@avg/schemas';
import type { AvgGroundedResponseBoundary } from '@avg/validation';

interface WorkspaceShellProps {
  projectId: string;
  sessionId: string;
  projectTitle: string;
  selectedSurface: WorkspaceSurface;
  onSurfaceChange: (surface: WorkspaceSurface) => void;
  claims?: AvgClaim[];
  mapSnapshot?: GraphSnapshot;
  onClaimsUpdate?: (claims: AvgClaim[]) => void;
  dialogueMessages?: DialogueMessage[];
  onMessagesChange?: (messages: DialogueMessage[]) => void;
  retrievalHits?: AvgRetrievalHit[];
  lastGroundedResponse?: AvgStructuredResponse | null;
  lastGrounding?: AvgGroundedResponseBoundary | null;
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
  onClaimsUpdate,
  dialogueMessages = [],
  onMessagesChange,
  retrievalHits = [],
  lastGroundedResponse,
  lastGrounding,
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
          <DialogueSurface
            projectId={projectId}
            sessionId={sessionId}
            onResponseReceived={(_response, newClaims) => {
              if (onClaimsUpdate) {
                onClaimsUpdate([...claims, ...newClaims]);
              }
            }}
            {...(onMessagesChange && { onMessagesChange })}
          />
        )}

        {selectedSurface === 'documents' && (
          <DocumentRegistrationPanel projectId={projectId} />
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
          <ArtifactWorkspacePanel
            projectId={projectId}
            sessionId={sessionId}
            projectTitle={projectTitle}
            claims={claims}
            {...(mapSnapshot && { mapSnapshot })}
            dialogueMessages={dialogueMessages}
            {...(retrievalHits && { retrievalHits })}
            lastGroundedResponse={lastGroundedResponse ?? null}
            lastGrounding={lastGrounding ?? null}
          />
        )}
      </section>
    </main>
  );
}
