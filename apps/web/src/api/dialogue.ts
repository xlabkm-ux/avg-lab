import type { AvgStructuredResponse } from '@avg/schemas';
import type { AvgRetrievalHit } from '@avg/retrieval';
import type { AvgGroundedResponseBoundary } from '@avg/validation';
import type { DialogueMessage } from '@avg/html-rendering';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export interface DialogueRequest {
  sessionId: string;
  messages: DialogueMessage[];
  response?: {
    id: string;
    project_id: string;
    session_id: string;
    message_id: string;
    summary: string;
    scope: string;
    claim_status: string;
    language_mode: string;
    validation_risk: 'low' | 'medium' | 'high' | 'critical';
    risk_markers: string[];
    map_territory_boundary: 'preserved' | 'unclear' | 'violated';
    next_action: string;
  };
  query: string;
  limit?: number;
}

export interface DialogueResponse {
  html: string;
  structuredResponse: AvgStructuredResponse;
  grounding: AvgGroundedResponseBoundary | null;
  retrievalHits: AvgRetrievalHit[];
}

export async function submitDialogueThought(
  projectId: string,
  request: DialogueRequest,
): Promise<DialogueResponse> {
  const response = await fetch(`${API_BASE}/projects/${projectId}/dialogue/page`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Dialogue request failed' }));
    throw new Error(error.message || `Dialogue request failed with status ${response.status}`);
  }

  return response.json() as Promise<DialogueResponse>;
}
