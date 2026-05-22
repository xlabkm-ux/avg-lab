import { useState, useCallback } from 'react';
import type { AvgRetrievalHit } from '@avg/validation';
import type { AvgStructuredResponse } from '@avg/schemas';
import { groundedRetrievalFlow } from '../api/retrieval';
import type { GroundedFlowRequest } from '../types/retrieval';
import { CitationPanel } from './CitationPanel';
import { GroundedResponsePanel } from './GroundedResponsePanel';

interface GroundedRetrievalFlowProps {
  projectId: string;
  sessionId: string;
}

export function GroundedRetrievalFlow({ projectId, sessionId }: GroundedRetrievalFlowProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'missing_evidence' | 'error'>('idle');
  const [retrievalHits, setRetrievalHits] = useState<AvgRetrievalHit[]>([]);
  const [retrievalConfidence, setRetrievalConfidence] = useState<'none' | 'low' | 'medium' | 'high'>('none');
  const [boundaryStatement, setBoundaryStatement] = useState('');
  const [groundedResponse, setGroundedResponse] = useState<AvgStructuredResponse | undefined>();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = useCallback(async () => {
    if (!query.trim()) {
      setStatus('error');
      setErrorMessage('Please enter a query to search.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const request: GroundedFlowRequest = {
        sessionId,
        query: query.trim(),
        response: {
          id: `response-${Date.now()}`,
          project_id: projectId,
          session_id: sessionId,
          message_id: `msg-${Date.now()}`,
          summary: query.trim(),
          scope: 'Grounded retrieval query',
          claim_status: 'hypothesis' as const,
          language_mode: 'conditional_description' as const,
          validation_risk: 'medium' as const,
          risk_markers: [],
          map_territory_boundary: 'preserved' as const,
          next_action: 'Review retrieved evidence',
        },
        limit: 10,
      };

      const result = await groundedRetrievalFlow(projectId, request);

      setRetrievalHits(result.retrievalHits);
      setRetrievalConfidence(result.retrievalConfidence);
      setBoundaryStatement(result.boundaryStatement);
      setGroundedResponse(result.groundedResponse?.response);

      if (result.retrievalHits.length === 0 || result.retrievalConfidence === 'none') {
        setStatus('missing_evidence');
      } else {
        setStatus('ready');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred during retrieval.');
      setRetrievalHits([]);
      setRetrievalConfidence('none');
    }
  }, [query, projectId, sessionId]);

  const confidenceColor = {
    none: 'var(--color-risk-critical)',
    low: 'var(--color-risk-high)',
    medium: 'var(--color-risk-medium)',
    high: 'var(--color-risk-low)',
  }[retrievalConfidence];

  return (
    <section className="grounded-retrieval-flow" data-status={status} data-testid="retrieval-interface">
      <header className="retrieval-header">
        <h2>Grounded Retrieval</h2>
        <p className="retrieval-description">
          Ask questions against registered project documents. AVG will show evidence before answers.
        </p>
      </header>

      <section className="retrieval-query-section">
        <label htmlFor="grounded-query">Grounded question</label>
        <textarea
          id="grounded-query"
          data-testid="query-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask against registered project documents"
          rows={3}
          disabled={status === 'loading'}
        />
        <button
          type="button"
          data-testid="submit-query-btn"
          onClick={handleSubmit}
          disabled={status === 'loading' || !query.trim()}
          className="btn-primary"
        >
          {status === 'loading' ? 'Searching...' : 'Ask with evidence'}
        </button>
      </section>

      {status === 'error' && errorMessage && (
        <aside className="retrieval-error" data-risk="critical" data-testid="retrieval-error">
          <strong>Error</strong>
          <p>{errorMessage}</p>
        </aside>
      )}

      {status !== 'idle' && status !== 'error' && (
        <aside
          className="retrieval-boundary"
          data-retrieval-confidence={retrievalConfidence}
        >
          <strong>Retrieval confidence is a risk signal, not proof.</strong>
          <p>{boundaryStatement}</p>
          {retrievalConfidence !== 'none' && (
            <span
              className="confidence-badge"
              data-testid="retrieval-confidence-badge"
              style={{ backgroundColor: confidenceColor }}
            >
              Confidence: {retrievalConfidence}
            </span>
          )}
        </aside>
      )}

      {retrievalHits.length > 0 && (
        <CitationPanel hits={retrievalHits} />
      )}

      {groundedResponse && (
        <GroundedResponsePanel response={groundedResponse} />
      )}

      {status === 'missing_evidence' && retrievalHits.length === 0 && (
        <section className="empty-evidence" data-testid="no-evidence-state">
          <h3>No matching evidence</h3>
          <p>No registered snippets matched this question. Try:</p>
          <ul>
            <li>Registering more project documents</li>
            <li>Using different search terms</li>
            <li>Checking document content for relevant text</li>
          </ul>
        </section>
      )}
    </section>
  );
}
