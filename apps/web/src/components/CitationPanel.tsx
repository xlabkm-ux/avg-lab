import { useState } from 'react';
import type { AvgRetrievalHit } from '@avg/validation';

interface CitationPanelProps {
  hits: AvgRetrievalHit[];
  onSelectHit?: (hit: AvgRetrievalHit) => void;
}

export function CitationPanel({ hits, onSelectHit }: CitationPanelProps) {
  const [expandedHit, setExpandedHit] = useState<string | null>(null);
  const [filterConfidence, setFilterConfidence] = useState<string>('all');

  const filteredHits = filterConfidence === 'all'
    ? hits
    : hits.filter((hit) => hit.confidence === filterConfidence);

  const confidenceCounts = {
    high: hits.filter((h) => h.confidence === 'high').length,
    medium: hits.filter((h) => h.confidence === 'medium').length,
    low: hits.filter((h) => h.confidence === 'low').length,
  };

  const handleHitClick = (hit: AvgRetrievalHit) => {
    setExpandedHit(expandedHit === hit.snippet_id ? null : hit.snippet_id);
    onSelectHit?.(hit);
  };

  return (
    <section className="citation-panel" data-hit-count={hits.length}>
      <header className="citation-header">
        <h3>Retrieval hits ({hits.length})</h3>
        <div className="citation-filters">
          <label>Filter by confidence:</label>
          <select
            value={filterConfidence}
            onChange={(e) => setFilterConfidence(e.target.value)}
          >
            <option value="all">All ({hits.length})</option>
            <option value="high">High ({confidenceCounts.high})</option>
            <option value="medium">Medium ({confidenceCounts.medium})</option>
            <option value="low">Low ({confidenceCounts.low})</option>
          </select>
        </div>
      </header>

      <ul className="citation-list">
        {filteredHits.map((hit) => (
          <li
            key={hit.snippet_id}
            className={`citation-item ${expandedHit === hit.snippet_id ? 'expanded' : ''}`}
            data-snippet-id={hit.snippet_id}
            data-citation-id={hit.citation_id}
            data-document-id={hit.document_id}
            data-confidence={hit.confidence}
            onClick={() => handleHitClick(hit)}
          >
            <div className="citation-header-row">
              <strong className="citation-source">{hit.source_label}</strong>
              <span className={`confidence-badge confidence-${hit.confidence}`}>
                {hit.confidence}
              </span>
              <span className="score-badge">Score: {hit.score.toFixed(2)}</span>
            </div>

            <div className="citation-meta">
              <dl>
                <div>
                  <dt>Snippet ID</dt>
                  <dd><code>{hit.snippet_id}</code></dd>
                </div>
                <div>
                  <dt>Citation ID</dt>
                  <dd><code>{hit.citation_id}</code></dd>
                </div>
                <div>
                  <dt>Document ID</dt>
                  <dd><code>{hit.document_id}</code></dd>
                </div>
              </dl>
            </div>

            <blockquote className="citation-text">
              {expandedHit === hit.snippet_id ? (
                hit.matched_text
              ) : (
                <>
                  {hit.matched_text.slice(0, 150)}
                  {hit.matched_text.length > 150 && '...'}
                </>
              )}
            </blockquote>

            {expandedHit === hit.snippet_id && (
              <button
                className="btn-small"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(hit.matched_text);
                }}
              >
                Copy snippet
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
