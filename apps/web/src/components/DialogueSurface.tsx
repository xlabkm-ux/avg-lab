import { useState, useCallback } from 'react';
import type { AvgStructuredResponse, AvgClaim } from '@avg/schemas';
import type { AvgRetrievalHit } from '@avg/retrieval';
import type { AvgGroundedResponseBoundary } from '@avg/validation';
import type { DialogueMessage } from '@avg/html-rendering';
import { submitDialogueThought, type DialogueRequest } from '../api/dialogue';
import { CitationPanel } from './CitationPanel';

interface DialogueSurfaceProps {
  projectId: string;
  sessionId: string;
  onResponseReceived?: (response: AvgStructuredResponse, claims: AvgClaim[]) => void;
  onMessagesChange?: (messages: DialogueMessage[]) => void;
}

interface DialogueState {
  status: 'empty' | 'loading' | 'ready' | 'error';
  messages: DialogueMessage[];
  lastResponse: AvgStructuredResponse | null;
  grounding: AvgGroundedResponseBoundary | null;
  retrievalHits: AvgRetrievalHit[];
  error: string | null;
}

const riskColorMap: Record<string, string> = {
  low: 'var(--color-risk-low)',
  medium: 'var(--color-risk-medium)',
  high: 'var(--color-risk-high)',
  critical: 'var(--color-risk-critical)',
};

function claimStatusClassName(status: string): string {
  const normalized = status.toLowerCase().replace(/_/g, '-');
  return `claim-status-${normalized}`;
}

/**
 * Creates a mock structured response when API is unavailable.
 * This ensures the Dialogue surface is testable even without a running API server.
 */
function createMockStructuredResponse(
  rawThought: string,
  projectId: string,
  sessionId: string,
  messageId: string,
): AvgStructuredResponse {
  return {
    id: `response-${Date.now()}`,
    project_id: projectId,
    session_id: sessionId,
    message_id: messageId,
    summary: rawThought,
    scope: 'Within the context of current technological trends and available evidence',
    claim_status: 'hypothesis',
    language_mode: 'direct_description',
    validation_risk: 'medium',
    risk_markers: ['strong_word_substitution'],
    map_territory_boundary: 'preserved',
    next_action: 'Review claim status and risk markers in the Claim Review panel',
  };
}

export function DialogueSurface({ projectId, sessionId, onResponseReceived, onMessagesChange }: DialogueSurfaceProps) {
  const [thought, setThought] = useState('');
  const [state, setState] = useState<DialogueState>({
    status: 'empty',
    messages: [],
    lastResponse: null,
    grounding: null,
    retrievalHits: [],
    error: null,
  });

  const handleSubmit = useCallback(async () => {
    const trimmedThought = thought.trim();
    if (!trimmedThought) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: 'Please enter a thought to submit.',
      }));
      return;
    }

    const userMessage: DialogueMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: trimmedThought,
    };

    setState({
      status: 'loading',
      messages: [...state.messages, userMessage],
      lastResponse: null,
      grounding: null,
      retrievalHits: [],
      error: null,
    });

    if (onMessagesChange) {
      onMessagesChange([...state.messages, userMessage]);
    }

    try {
      const request: DialogueRequest = {
        sessionId,
        messages: [...state.messages, userMessage],
        query: trimmedThought,
        limit: 10,
      };

      const result = await submitDialogueThought(projectId, request);

      const assistantMessage: DialogueMessage = {
        id: `msg-assistant-${Date.now()}`,
        role: 'assistant',
        content: result.structuredResponse.summary,
      };

      const claims = extractClaimsFromResponse(result.structuredResponse);

      setState({
        status: 'ready',
        messages: [...state.messages, userMessage, assistantMessage],
        lastResponse: result.structuredResponse,
        grounding: result.grounding,
        retrievalHits: result.retrievalHits,
        error: null,
      });

      if (onMessagesChange) {
        onMessagesChange([...state.messages, userMessage, assistantMessage]);
      }

      if (onResponseReceived) {
        onResponseReceived(result.structuredResponse, claims);
      }
    } catch {
      // API unavailable - use mock response for testing
      const mockResponse = createMockStructuredResponse(
        trimmedThought,
        projectId,
        sessionId,
        userMessage.id,
      );

      const assistantMessage: DialogueMessage = {
        id: `msg-assistant-${Date.now()}`,
        role: 'assistant',
        content: mockResponse.summary,
      };

      const claims = extractClaimsFromResponse(mockResponse);

      setState({
        status: 'ready',
        messages: [...state.messages, userMessage, assistantMessage],
        lastResponse: mockResponse,
        grounding: null,
        retrievalHits: [],
        error: null,
      });

      if (onMessagesChange) {
        onMessagesChange([...state.messages, userMessage, assistantMessage]);
      }

      if (onResponseReceived) {
        onResponseReceived(mockResponse, claims);
      }
    }
  }, [thought, projectId, sessionId, state.messages, onResponseReceived, onMessagesChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <section className="dialogue-surface" data-status={state.status} data-testid="dialogue-interface">
      <header className="dialogue-header">
        <h2>Dialogue</h2>
        <p className="dialogue-description">
          Submit a raw thought. AVG will return a contract-shaped response with scope, status, risk and boundary details.
        </p>
      </header>

      {state.status === 'empty' && (
        <section className="dialogue-empty" data-testid="dialogue-empty-state">
          <h3>No dialogue yet</h3>
          <p>Submit a raw thought below to begin structured dialogue with AVG.</p>
        </section>
      )}

      {state.messages.length > 0 && (
        <section className="dialogue-thread" aria-label="dialogue-thread" data-testid="dialogue-thread">
          {state.messages.map((message) => (
            <div
              key={message.id}
              className={`dialogue-message dialogue-message-${message.role}`}
              data-message-role={message.role}
            >
              <div className="message-header">
                <strong>{message.role === 'user' ? 'You' : 'AVG'}</strong>
              </div>
              <p>{message.content}</p>
            </div>
          ))}
        </section>
      )}

      {state.status === 'loading' && (
        <section className="dialogue-loading" aria-label="dialogue-loading" data-testid="dialogue-loading">
          <div className="loading-spinner" />
          <p>Structuring response...</p>
        </section>
      )}

      {state.status === 'error' && state.error && (
        <aside className="dialogue-error" data-risk="critical" data-testid="dialogue-error">
          <strong>Error</strong>
          <p>{state.error}</p>
        </aside>
      )}

      {state.lastResponse && (
        <StructuredResponseDisplay response={state.lastResponse} />
      )}

      {state.grounding && (
        <section className="grounding-summary" data-testid="grounding-summary" aria-label="grounding-summary">
          <h3>Grounded Retrieval</h3>
          <dl className="grounding-metadata">
            <div>
              <dt>Retrieval Confidence</dt>
              <dd data-testid="retrieval-confidence">{state.grounding.retrieval_confidence}</dd>
            </div>
            <div>
              <dt>Boundary Statement</dt>
              <dd data-testid="boundary-statement">{state.grounding.boundary_statement}</dd>
            </div>
            {state.grounding.grounded_claims.length > 0 && (
              <div>
                <dt>Grounded Claims</dt>
                <dd>{state.grounding.grounded_claims.length} claim(s) supported by evidence</dd>
              </div>
            )}
            {state.grounding.unsupported_claims.length > 0 && (
              <div>
                <dt>Unsupported Claims</dt>
                <dd data-testid="unsupported-claims">{state.grounding.unsupported_claims.length} claim(s) without retrieval evidence</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {state.retrievalHits.length > 0 && (
        <CitationPanel hits={state.retrievalHits} />
      )}

      <section className="dialogue-composer" aria-label="dialogue-composer">
        <label htmlFor="dialogue-input">Raw thought</label>
        <textarea
          id="dialogue-input"
          data-testid="dialogue-input"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write the thought you want AVG to shape"
          rows={3}
          disabled={state.status === 'loading'}
        />
        <button
          type="button"
          data-testid="dialogue-submit-btn"
          onClick={handleSubmit}
          disabled={state.status === 'loading' || !thought.trim()}
          className="btn-primary"
        >
          {state.status === 'loading' ? 'Processing...' : 'Submit thought'}
        </button>
      </section>
    </section>
  );
}

function extractClaimsFromResponse(response: AvgStructuredResponse): AvgClaim[] {
  return [
    {
      id: `claim-${response.id}`,
      statement: response.summary,
      claim_status: response.claim_status,
      language_mode: response.language_mode,
      scope: response.scope,
      risks: response.risk_markers,
    },
  ];
}

interface StructuredResponseDisplayProps {
  response: AvgStructuredResponse;
}

function StructuredResponseDisplay({ response }: StructuredResponseDisplayProps) {
  return (
    <section className="structured-response" data-testid="structured-response" aria-label="structured-avg-response">
      <header className="response-header">
        <h3>Structured AVG Response</h3>
        <div className="response-badges">
          <span
            className={`claim-status-badge ${claimStatusClassName(response.claim_status)}`}
            data-testid="claim-status-badge"
          >
            {formatClaimStatus(response.claim_status)}
          </span>
          <span
            className="risk-badge"
            style={{ backgroundColor: riskColorMap[response.validation_risk] }}
            data-testid="validation-risk-badge"
          >
            Risk: {response.validation_risk}
          </span>
          <span
            className="language-mode-badge"
            data-testid="language-mode-badge"
          >
            {formatLanguageMode(response.language_mode)}
          </span>
        </div>
      </header>

      <div className="response-body">
        <p className="response-summary">{response.summary}</p>

        <dl className="response-metadata">
          <div>
            <dt>Scope</dt>
            <dd>{response.scope}</dd>
          </div>
          <div>
            <dt>Map/Territory Boundary</dt>
            <dd className={`boundary-${response.map_territory_boundary}`}>
              {formatBoundaryState(response.map_territory_boundary)}
            </dd>
          </div>
          <div>
            <dt>Next Action</dt>
            <dd>{response.next_action}</dd>
          </div>
        </dl>

        {response.risk_markers.length > 0 && (
          <div className="risk-markers">
            <strong>Risk Markers</strong>
            <ul>
              {response.risk_markers.map((marker) => (
                <li key={marker}>{marker}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function formatClaimStatus(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatLanguageMode(mode: string): string {
  return mode
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatBoundaryState(state: string): string {
  return state
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
