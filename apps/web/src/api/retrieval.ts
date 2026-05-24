import type { AvgRetrievalHit } from '@avg/retrieval';
import type { AvgGroundedResponse } from '@avg/validation';
import type { SearchRequest, SearchResponse, GroundedFlowRequest } from '../types/retrieval';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export async function searchDocuments(
  projectId: string,
  request: SearchRequest,
): Promise<SearchResponse> {
  const response = await fetch(`${API_BASE}/projects/${projectId}/retrieval/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Search failed' }));
    if (response.status === 404) {
      throw new Error('No registered snippets matched the retrieval query.');
    }
    throw new Error(error.message || `Search failed with status ${response.status}`);
  }

  return response.json() as Promise<SearchResponse>;
}

export async function groundedRetrievalFlow(
  projectId: string,
  request: GroundedFlowRequest,
): Promise<{
  retrievalHits: AvgRetrievalHit[];
  retrievalConfidence: 'none' | 'low' | 'medium' | 'high';
  boundaryStatement: string;
  groundedResponse?: AvgGroundedResponse;
}> {
  const response = await fetch(`${API_BASE}/projects/${projectId}/retrieval/grounded-flow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Grounded flow failed' }));
    if (response.status === 404) {
      throw new Error('No registered snippets matched the retrieval query.');
    }
    throw new Error(error.message || `Grounded flow failed with status ${response.status}`);
  }

  const data = await response.json();
  return {
    retrievalHits: data.retrieval?.hits || [],
    retrievalConfidence: data.retrieval?.retrieval_confidence || 'none',
    boundaryStatement: data.report?.groundedResponse?.grounding?.boundary_statement || 'No boundary statement available.',
    groundedResponse: data.report?.groundedResponse,
  };
}
