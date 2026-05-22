import type { AvgRetrievalHit, AvgGroundedResponse } from '@avg/validation';

export interface RetrievalState {
  query: string;
  status: 'idle' | 'loading' | 'ready' | 'missing_evidence' | 'error';
  retrievalHits: AvgRetrievalHit[];
  retrievalConfidence: 'none' | 'low' | 'medium' | 'high';
  boundaryStatement: string;
  groundedResponse?: AvgGroundedResponse;
  error?: string;
}

export interface CitationPanelProps {
  hits: AvgRetrievalHit[];
  onSelectHit?: (hit: AvgRetrievalHit) => void;
}

export interface GroundedRetrievalFlowProps {
  projectId: string;
  sessionId: string;
  onResult?: (result: RetrievalState) => void;
}

export interface SearchRequest {
  query: string;
  limit?: number;
}

export interface SearchResponse {
  hits: AvgRetrievalHit[];
  retrieval_confidence: 'none' | 'low' | 'medium' | 'high';
}

export interface GroundedFlowRequest {
  sessionId: string;
  query: string;
  response: {
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
  limit?: number;
}
