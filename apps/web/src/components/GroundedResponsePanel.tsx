import type { AvgStructuredResponse } from '@avg/schemas';

interface GroundedResponsePanelProps {
  response: AvgStructuredResponse;
}

export function GroundedResponsePanel({ response }: GroundedResponsePanelProps) {
  return (
    <section className="grounded-response-panel" aria-label="grounded-response-panel">
      <h3>Grounded response</h3>

      <div className="response-summary">
        <p>{response.summary}</p>
      </div>

      <dl className="response-metadata">
        <div>
          <dt>Claim status</dt>
          <dd>
            <span className={`claim-status-badge claim-status-${response.claim_status}`}>
              {formatClaimStatus(response.claim_status)}
            </span>
          </dd>
        </div>

        <div>
          <dt>Language mode</dt>
          <dd>
            <span className="language-mode-badge">
              {formatLanguageMode(response.language_mode)}
            </span>
          </dd>
        </div>

        <div>
          <dt>Validation risk</dt>
          <dd>
            <span className={`risk-badge risk-${response.validation_risk}`}>
              {response.validation_risk.toUpperCase()}
            </span>
          </dd>
        </div>

        <div>
          <dt>Map/Territory boundary</dt>
          <dd>{formatMapTerritoryBoundary(response.map_territory_boundary)}</dd>
        </div>
      </dl>

      {response.risk_markers.length > 0 && (
        <div className="risk-markers">
          <strong>Risk markers:</strong>
          <ul>
            {response.risk_markers.map((marker, index) => (
              <li key={index}>{marker}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="response-next-action">
        <strong>Next action:</strong>
        <p>{response.next_action}</p>
      </div>

      {response.scope && (
        <div className="response-scope">
          <strong>Scope:</strong>
          <p>{response.scope}</p>
        </div>
      )}
    </section>
  );
}

function formatClaimStatus(status: string): string {
  const labels: Record<string, string> = {
    definition: 'Definition',
    working_distinction: 'Working Distinction',
    operational_marker: 'Operational Marker',
    indirect_sign: 'Indirect Sign',
    hypothesis: 'Hypothesis',
    metaphor_only: 'Metaphor Only',
    prohibited_positive_claim: 'Prohibited Positive Claim',
    boundary_statement: 'Boundary Statement',
  };
  return labels[status] || status;
}

function formatLanguageMode(mode: string): string {
  const labels: Record<string, string> = {
    direct_description: 'Direct Description',
    operational_description: 'Operational Description',
    conditional_description: 'Conditional Description',
    metaphor: 'Metaphor',
    symbolic_pointer: 'Symbolic Pointer',
    silence_required: 'Silence Required',
  };
  return labels[mode] || mode;
}

function formatMapTerritoryBoundary(state: string): string {
  const labels: Record<string, string> = {
    preserved: 'Preserved - Map is clearly distinguished from territory',
    unclear: 'Unclear - Boundary between map and territory needs clarification',
    violated: 'Violated - Map is being treated as territory',
  };
  return labels[state] || state;
}
