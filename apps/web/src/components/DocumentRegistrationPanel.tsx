import { useState, useCallback, useEffect } from 'react';
import {
  registerDocumentViaApi,
  listDocumentsViaApi,
  getDocumentDetailWithSnippets,
} from '../documents/surface';
import type {
  RegisteredDocumentSummary,
  DocumentDetailWithSnippets,
  DocumentRegistrationError,
} from '../documents/types';

interface DocumentRegistrationPanelProps {
  projectId: string;
}

type DocumentSourceKind = "local_text" | "local_markdown" | "local_document";

export function DocumentRegistrationPanel({ projectId }: DocumentRegistrationPanelProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [sourceKind, setSourceKind] = useState<DocumentSourceKind>('local_text');

  // UI state
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [documents, setDocuments] = useState<RegisteredDocumentSummary[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentDetailWithSnippets | undefined>();
  const [formError, setFormError] = useState<DocumentRegistrationError | undefined>();

  // Load existing documents on mount
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docs = await listDocumentsViaApi(projectId);
        setDocuments(docs);
        setStatus('ready');
      } catch {
        setStatus('error');
        setFormError({
          code: 'registration_failed',
          message: 'Failed to load documents',
        });
      }
    };

    loadDocuments();
  }, [projectId]);

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(undefined);

    // Client-side validation
    if (!title.trim()) {
      setFormError({
        code: 'missing_title',
        message: 'Document title is required',
        details: 'Please enter a descriptive title for the document.',
      });
      return;
    }

    if (!text.trim()) {
      setFormError({
        code: 'missing_text',
        message: 'Document text is required',
        details: 'Please paste or type the document content.',
      });
      return;
    }

    if (title.trim().length > 200) {
      setFormError({
        code: 'missing_title',
        message: 'Title is too long',
        details: 'Title must be 200 characters or less.',
      });
      return;
    }

    if (text.trim().length > 50000) {
      setFormError({
        code: 'registration_failed',
        message: 'Document text is too large',
        details: 'Maximum document size is 50,000 characters.',
      });
      return;
    }

    setStatus('loading');

    try {
      const result = await registerDocumentViaApi(
        projectId,
        title.trim(),
        sourceKind,
        text.trim()
      );

      setDocuments(prev => [result, ...prev]);
      setTitle('');
      setText('');
      setSourceKind('local_text');
      setStatus('ready');

      // Auto-select the newly registered document
      const detail = await getDocumentDetailWithSnippets(projectId, result.document.id);
      setSelectedDocument(detail);
    } catch (error) {
      setStatus('error');
      setFormError({
        code: 'registration_failed',
        message: error instanceof Error ? error.message : 'Document registration failed',
      });
    }
  }, [title, text, sourceKind, projectId]);

  const handleSelectDocument = useCallback(async (documentId: string) => {
    try {
      const detail = await getDocumentDetailWithSnippets(projectId, documentId);
      setSelectedDocument(detail);
    } catch {
      setFormError({
        code: 'registration_failed',
        message: 'Failed to load document details',
      });
    }
  }, [projectId]);

  const sourceKindOptions: { value: DocumentSourceKind; label: string }[] = [
    { value: 'local_text', label: 'Plain text' },
    { value: 'local_markdown', label: 'Markdown' },
    { value: 'local_document', label: 'Document' },
  ];

  return (
    <section className="document-registration-panel" data-status={status} data-testid="document-registration">
      <header className="document-header">
        <h2>Document Registration</h2>
        <p className="document-description">
          Register text or markdown as project-local evidence for grounded retrieval.
        </p>
        <span className="local-only-badge" data-testid="local-only-badge">Local only</span>
      </header>

      {/* Error display */}
      {formError && (
        <aside className="document-error" data-error-code={formError.code} data-testid="form-error">
          <strong>{formError.message}</strong>
          {formError.details && <p>{formError.details}</p>}
        </aside>
      )}

      {/* Registration form */}
      <form className="document-form" onSubmit={handleRegister} data-testid="registration-form">
        <div className="form-field">
          <label htmlFor="doc-title">Document title</label>
          <input
            id="doc-title"
            type="text"
            data-testid="title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title"
            required
            disabled={status === 'loading'}
            maxLength={200}
          />
        </div>

        <div className="form-field">
          <label htmlFor="doc-source-kind">Source kind</label>
          <select
            id="doc-source-kind"
            data-testid="source-kind-select"
            value={sourceKind}
            onChange={(e) => setSourceKind(e.target.value as DocumentSourceKind)}
            required
            disabled={status === 'loading'}
          >
            {sourceKindOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="doc-text">Document text</label>
          <textarea
            id="doc-text"
            data-testid="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type the document content here..."
            rows={10}
            required
            disabled={status === 'loading'}
            maxLength={50000}
          />
          <div className="char-count" data-testid="char-count">
            {text.length} / 50,000 characters
          </div>
        </div>

        <button
          type="submit"
          data-testid="register-btn"
          disabled={status === 'loading' || !title.trim() || !text.trim()}
          className="btn-primary"
        >
          {status === 'loading' ? 'Registering...' : 'Register document'}
        </button>
      </form>

      {/* Document detail view */}
      {selectedDocument && (
        <section className="document-detail" data-testid="document-detail" data-document-id={selectedDocument.document.id}>
          <h3>Document Detail</h3>
          <dl className="document-meta">
            <div>
              <dt>ID</dt>
              <dd><code>{selectedDocument.document.id}</code></dd>
            </div>
            <div>
              <dt>Title</dt>
              <dd>{selectedDocument.document.title}</dd>
            </div>
            <div>
              <dt>Project ID</dt>
              <dd><code>{selectedDocument.document.project_id}</code></dd>
            </div>
            <div>
              <dt>Source kind</dt>
              <dd>{selectedDocument.document.source_kind}</dd>
            </div>
            <div>
              <dt>Created at</dt>
              <dd>{selectedDocument.document.created_at}</dd>
            </div>
            <div>
              <dt>Estimated tokens</dt>
              <dd>{selectedDocument.token_estimate}</dd>
            </div>
          </dl>

          {selectedDocument.document.metadata && Object.keys(selectedDocument.document.metadata).length > 0 && (
            <details className="document-metadata">
              <summary>Metadata</summary>
              <dl>
                {Object.entries(selectedDocument.document.metadata).map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </details>
          )}

          <h4>Generated Snippets ({selectedDocument.snippets.length})</h4>
          <ul className="snippet-list" data-testid="snippet-list">
            {selectedDocument.snippets.map((snippet) => (
              <li key={snippet.id} data-snippet-id={snippet.id} data-testid="snippet-item">
                <strong>{snippet.id}</strong>
                <dl className="snippet-meta">
                  <div>
                    <dt>Ordinal</dt>
                    <dd>{snippet.ordinal}</dd>
                  </div>
                  {snippet.location && (
                    <div>
                      <dt>Location</dt>
                      <dd>{snippet.location}</dd>
                    </div>
                  )}
                </dl>
                <blockquote className="snippet-text">{snippet.text}</blockquote>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Document list */}
      <section className="document-list-section" data-testid="document-list-section">
        <h3>Registered documents</h3>
        {documents.length === 0 ? (
          <div className="empty-state" data-testid="empty-state">
            <p><em>No local documents</em></p>
            <p>Register text or markdown as project-local evidence before using grounded retrieval.</p>
          </div>
        ) : (
          <ul className="document-list" data-testid="document-list">
            {documents.map((doc) => (
              <li
                key={doc.document.id}
                data-document-id={doc.document.id}
                data-testid="document-item"
                className={selectedDocument?.document.id === doc.document.id ? 'selected' : ''}
              >
                <button
                  type="button"
                  className="document-item-button"
                  onClick={() => handleSelectDocument(doc.document.id)}
                >
                  <strong>{doc.document.title}</strong>
                  <dl className="document-item-meta">
                    <div>
                      <dt>ID</dt>
                      <dd><code>{doc.document.id}</code></dd>
                    </div>
                    <div>
                      <dt>Source kind</dt>
                      <dd>{doc.document.source_kind}</dd>
                    </div>
                    <div>
                      <dt>Snippets</dt>
                      <dd>{doc.snippet_count}</dd>
                    </div>
                    <div>
                      <dt>Estimated tokens</dt>
                      <dd>{doc.token_estimate}</dd>
                    </div>
                  </dl>
                  {doc.document.created_at && (
                    <p className="document-timestamp">
                      <small>Registered: {doc.document.created_at}</small>
                    </p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
