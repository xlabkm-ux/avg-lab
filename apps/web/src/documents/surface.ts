/**
 * Document registration surface for AVG Codex Lab.
 */

import { escapeHtml } from "@avg/utils";
import { renderShellTitle } from "@avg/html-rendering";

import {
  type AvgDocumentRef,
  type DocumentRegistrationStatus,
  type DocumentRegistrationError,
  type RegisteredDocumentSummary,
  type AvgSourceSnippet,
  type DocumentDetailWithSnippets,
  type DocumentRegistrationSurfaceInput,
  type DocumentRegistrationSurface,
} from "./types";

// Re-export types
export type {
  AvgDocumentRef,
  DocumentRegistrationStatus,
  DocumentRegistrationError,
  RegisteredDocumentSummary,
  AvgSourceSnippet,
  DocumentDetailWithSnippets,
  DocumentRegistrationSurfaceInput,
  DocumentRegistrationSurface,
};

// ============================================================================
// Helpers
// ============================================================================

// ============================================================================
// Document Registration Surface
// ============================================================================

export function estimateTokenCount(text: string): number {
  // Rough estimate: ~4 characters per token for English text
  const charCount = text.trim().length;
  return Math.ceil(charCount / 4);
}

export function createDocumentRegistrationSurface(
  input: DocumentRegistrationSurfaceInput,
): DocumentRegistrationSurface {
  const baseSurface = {
    kind: "document-registration-surface" as const,
    title: renderShellTitle(),
    projectId: input.projectId,
    documents: input.documents ?? [],
    selectedDocument: input.selectedDocument,
    formLabel: "Register document",
    titleLabel: "Document title",
    titlePlaceholder: "Enter a descriptive title",
    sourceKindLabel: "Source kind",
    textLabel: "Document text",
    textPlaceholder: "Paste or type the document content here...",
    submitLabel: "Register document",
    registeredListTitle: "Registered documents",
    emptyStateTitle: "No local documents",
    emptyStateBody: "Register text or markdown as project-local evidence before using grounded retrieval.",
  };

  if (input.error !== undefined) {
    return {
      ...baseSurface,
      status: "error",
      error: input.error,
    };
  }

  if (input.isLoading === true) {
    return {
      ...baseSurface,
      status: "loading",
    };
  }

  return {
    ...baseSurface,
    status: input.documents && input.documents.length > 0 ? "registered" : "empty",
  };
}

export function registerDocumentViaApi(
  projectId: string,
  title: string,
  sourceKind: "local_text" | "local_markdown" | "local_document",
  text: string,
): Promise<RegisteredDocumentSummary> {
  return fetch(`/projects/${encodeURIComponent(projectId)}/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      source_kind: sourceKind,
      text,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.message || "Document registration failed");
        });
      }
      return response.json();
    })
    .then((data) => {
      const docRef: AvgDocumentRef = data.document;
      const snippetCount = Math.max(1, Math.ceil(text.split(/\n\s*\n/).length / 3));
      const tokenEstimate = estimateTokenCount(text);

      return {
        document: docRef,
        snippet_count: snippetCount,
        token_estimate: tokenEstimate,
      } as RegisteredDocumentSummary;
    });
}

export function listDocumentsViaApi(projectId: string): Promise<RegisteredDocumentSummary[]> {
  return fetch(`/projects/${encodeURIComponent(projectId)}/documents`)
    .then((response) => {
      if (!response.ok) {
        return [];
      }
      return response.json();
    })
    .then((documents: AvgDocumentRef[]) => {
      return Promise.all(
        documents.map(async (doc) => {
          try {
            const snippetsResponse = await fetch(
              `/projects/${encodeURIComponent(projectId)}/documents/${encodeURIComponent(doc.id)}/snippets`
            );
            const snippets = snippetsResponse.ok ? await snippetsResponse.json() : [];
            const snippetCount = snippets.length;
            const tokenEstimate = snippets.reduce(
              (sum: number, snip: { text: string }) => sum + estimateTokenCount(snip.text),
              0
            );

            return {
              document: doc,
              snippet_count: snippetCount,
              token_estimate: tokenEstimate,
            };
          } catch {
            return {
              document: doc,
              snippet_count: 0,
              token_estimate: 0,
            };
          }
        })
      );
    })
    .catch(() => {
      return [];
    });
}

export function getDocumentDetailWithSnippets(
  projectId: string,
  documentId: string,
): Promise<DocumentDetailWithSnippets> {
  return Promise.all([
    fetch(`/projects/${encodeURIComponent(projectId)}/documents/${encodeURIComponent(documentId)}`).then((r) => r.json()),
    fetch(`/projects/${encodeURIComponent(projectId)}/documents/${encodeURIComponent(documentId)}/snippets`).then((r) => r.json()),
  ]).then(([document, snippets]) => {
    const tokenEstimate = snippets.reduce(
      (sum: number, snip: AvgSourceSnippet) => sum + estimateTokenCount(snip.text),
      0
    );

    return {
      document,
      snippets,
      token_estimate: tokenEstimate,
    };
  });
}

export function renderDocumentRegistrationSurface(
  input: DocumentRegistrationSurfaceInput | DocumentRegistrationSurface,
): string {
  const surface =
    "kind" in input && input.kind === "document-registration-surface"
      ? input
      : createDocumentRegistrationSurface(input);

  const errorPanel =
    surface.error === undefined
      ? []
      : [
          `  <section aria-label="document-registration-error" data-error-code="${escapeHtml(surface.error.code)}">`,
          `    <h3>${escapeHtml(surface.error.message)}</h3>`,
          ...(surface.error.details ? [`    <p>${escapeHtml(surface.error.details)}</p>`] : []),
          `  </section>`,
        ];

  const documentItems = surface.documents.map((doc) => {
    const createdAt = doc.document.created_at
      ? `<p><small>Registered: ${escapeHtml(doc.document.created_at)}</small></p>`
      : "";
    const metadata = doc.document.metadata
      ? `<details><summary>Metadata</summary><dl>${Object.entries(doc.document.metadata)
          .map(([key, value]) => `<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>`)
          .join("")}</dl></details>`
      : "";
    const isSelected = surface.selectedDocument?.document.id === doc.document.id;

    return [
      `    <li data-document-id="${escapeHtml(doc.document.id)}" ${isSelected ? 'data-selected="true"' : ""}>`,
      `      <strong>${escapeHtml(doc.document.title)}</strong>`,
      `      <dl>`,
      `        <div><dt>ID</dt><dd>${escapeHtml(doc.document.id)}</dd></div>`,
      `        <div><dt>Source kind</dt><dd>${escapeHtml(doc.document.source_kind)}</dd></div>`,
      `        <div><dt>Snippets</dt><dd>${doc.snippet_count}</dd></div>`,
      `        <div><dt>Estimated tokens</dt><dd>${doc.token_estimate}</dd></div>`,
      `      </dl>`,
      createdAt,
      metadata,
      `    </li>`,
    ].join("\n");
  });

  const loadingIndicator =
    surface.status === "loading"
      ? [
          `  <section aria-label="document-registration-loading">`,
          `    <p>Registering document...</p>`,
          `  </section>`,
        ]
      : [];

  return [
    `<section data-surface="${surface.kind}" data-project-id="${escapeHtml(surface.projectId)}" data-status="${surface.status}">`,
    `  <header>`,
    `    <p>${escapeHtml(surface.title)}</p>`,
    `    <h2>${escapeHtml(surface.formLabel)}</h2>`,
    `  </header>`,
    ...errorPanel,
    ...loadingIndicator,
    `  <form data-action="register-document" method="post">`,
    `    <div>`,
    `      <label for="doc-title">${escapeHtml(surface.titleLabel)}</label>`,
    `      <input type="text" id="doc-title" name="title" placeholder="${escapeHtml(surface.titlePlaceholder)}" required />`,
    `    </div>`,
    `    <div>`,
    `      <label for="doc-source-kind">${escapeHtml(surface.sourceKindLabel)}</label>`,
    `      <select id="doc-source-kind" name="source_kind" required>`,
    `        <option value="local_text">Plain text</option>`,
    `        <option value="local_markdown">Markdown</option>`,
    `        <option value="local_document">Document</option>`,
    `      </select>`,
    `    </div>`,
    `    <div>`,
    `      <label for="doc-text">${escapeHtml(surface.textLabel)}</label>`,
    `      <textarea id="doc-text" name="text" placeholder="${escapeHtml(surface.textPlaceholder)}" rows="10" required></textarea>`,
    `    </div>`,
    `    <button type="submit">${escapeHtml(surface.submitLabel)}</button>`,
    `  </form>`,
    ...(surface.selectedDocument !== undefined
      ? [
          `  <section aria-label="document-detail" data-selected-document="${escapeHtml(surface.selectedDocument.document.id)}">`,
          `    <h3>Document Detail</h3>`,
          `    <dl>`,
          `      <div><dt>ID</dt><dd>${escapeHtml(surface.selectedDocument.document.id)}</dd></div>`,
          `      <div><dt>Title</dt><dd>${escapeHtml(surface.selectedDocument.document.title)}</dd></div>`,
          `      <div><dt>Project ID</dt><dd>${escapeHtml(surface.selectedDocument.document.project_id)}</dd></div>`,
          `      <div><dt>Source kind</dt><dd>${escapeHtml(surface.selectedDocument.document.source_kind)}</dd></div>`,
          `      <div><dt>Created at</dt><dd>${escapeHtml(surface.selectedDocument.document.created_at)}</dd></div>`,
          `      <div><dt>Estimated tokens</dt><dd>${surface.selectedDocument.token_estimate}</dd></div>`,
          `    </dl>`,
          ...(surface.selectedDocument.document.metadata !== undefined
            ? [
                `    <details>`,
                `      <summary>Metadata</summary>`,
                `      <dl>`,
                ...Object.entries(surface.selectedDocument.document.metadata).map(
                  ([key, value]) => `<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>`
                ),
                `      </dl>`,
                `    </details>`,
              ]
            : []),
          `    <h4>Generated Snippets (${surface.selectedDocument.snippets.length})</h4>`,
          `    <ul>`,
          ...surface.selectedDocument.snippets.map(
            (snippet) =>
              `      <li data-snippet-id="${escapeHtml(snippet.id)}">` +
              `        <strong>${escapeHtml(snippet.id)}</strong>` +
              `        <dl>` +
              `          <div><dt>Ordinal</dt><dd>${snippet.ordinal}</dd></div>` +
              (snippet.location !== undefined ? `          <div><dt>Location</dt><dd>${escapeHtml(snippet.location)}</dd></div>` : "") +
              `        </dl>` +
              `        <blockquote>${escapeHtml(snippet.text)}</blockquote>` +
              `      </li>`
          ),
          `    </ul>`,
          `  </section>`,
        ]
      : []),
    `  <section aria-label="registered-documents-list">`,
    `    <h3>${escapeHtml(surface.registeredListTitle)}</h3>`,
    ...(documentItems.length > 0
      ? [`    <ul>`, ...documentItems, `    </ul>`]
      : [
          `    <p><em>${escapeHtml(surface.emptyStateTitle)}</em></p>`,
          `    <p>${escapeHtml(surface.emptyStateBody)}</p>`,
        ]),
    `  </section>`,
    `</section>`,
  ].join("\n");
}
