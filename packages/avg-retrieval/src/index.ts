import { type AvgDocumentRef, type DocumentSourceKind, validateDocumentRef } from "@avg/schemas";

export interface RegisterDocumentInput {
  project_id: string;
  title: string;
  source_kind: DocumentSourceKind;
  text: string;
  created_at?: string;
  metadata?: Record<string, string>;
}

export interface StoredDocument {
  document: AvgDocumentRef;
  text: string;
  snippets: AvgSourceSnippet[];
}

export interface RegisterDocumentResult {
  document: AvgDocumentRef;
}

export interface AvgSourceSnippet {
  id: string;
  document_id: string;
  project_id: string;
  ordinal: number;
  text: string;
  location?: string;
  source_label: string;
}

export interface AvgRetrievalHit {
  snippet_id: string;
  document_id: string;
  project_id: string;
  score: number;
  confidence: "low" | "medium" | "high";
  citation_id: string;
  matched_text: string;
  source_label: string;
}

export interface SearchDocumentsResult {
  hits: AvgRetrievalHit[];
  retrieval_confidence: "none" | "low" | "medium" | "high";
}

export interface SearchDocumentsOptions {
  limit?: number;
}

export interface ChunkDocumentTextInput {
  document_id: string;
  project_id: string;
  source_label: string;
  text: string;
}

export interface DocumentRepository {
  registerDocument(input: RegisterDocumentInput): RegisterDocumentResult;
  getDocument(documentId: string): AvgDocumentRef | undefined;
  getDocumentText(documentId: string): string | undefined;
  getDocumentSnippets(documentId: string): AvgSourceSnippet[] | undefined;
  listDocuments(projectId?: string): AvgDocumentRef[];
  listDocumentSnippets(projectId?: string): AvgSourceSnippet[];
  searchDocuments(projectId: string, query: string, options?: SearchDocumentsOptions): SearchDocumentsResult;
}

export interface DocumentRepositoryOptions {
  now?: () => string;
}

const documentSourceKinds: readonly DocumentSourceKind[] = ["local_text", "local_markdown", "local_document"];
const maxSnippetLength = 240;

function assertNonEmpty(value: string, field: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }
}

function assertPositiveInteger(value: number, field: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${field} must be a positive integer`);
  }
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function tokenize(value: string): string[] {
  const matches = normalizeWhitespace(value).toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  return Array.from(new Set(matches));
}

function normalizeLineEndings(value: string): string {
  return value.replace(/\r\n?/g, "\n");
}

function splitParagraphs(text: string): string[] {
  return normalizeLineEndings(text)
    .trim()
    .split(/\n\s*\n/g)
    .map((paragraph) => normalizeWhitespace(paragraph))
    .filter((paragraph) => paragraph.length > 0);
}

function splitParagraphIntoChunks(paragraph: string, limit = maxSnippetLength): string[] {
  const chunks: string[] = [];
  let remaining = paragraph.trim();

  while (remaining.length > limit) {
    let cutIndex = remaining.lastIndexOf(" ", limit);

    if (cutIndex < Math.floor(limit * 0.6)) {
      cutIndex = limit;
    }

    const chunk = remaining.slice(0, cutIndex).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    remaining = remaining.slice(cutIndex).trimStart();
  }

  if (remaining.length > 0) {
    chunks.push(remaining);
  }

  return chunks;
}

function chunkId(documentId: string, ordinal: number): string {
  return `snip_${documentId}_${String(ordinal).padStart(3, "0")}`;
}

function citationId(documentId: string, ordinal: number): string {
  return `cit_${documentId}_${String(ordinal).padStart(3, "0")}`;
}

function confidenceFromScore(score: number): "low" | "medium" | "high" {
  if (score >= 0.8) {
    return "high";
  }

  if (score >= 0.4) {
    return "medium";
  }

  return "low";
}

function retrievalConfidenceFromHits(hits: AvgRetrievalHit[]): "none" | "low" | "medium" | "high" {
  if (hits.length === 0) {
    return "none";
  }

  return hits[0]!.confidence;
}

function cloneSnippet(snippet: AvgSourceSnippet): AvgSourceSnippet {
  const clone: AvgSourceSnippet = {
    id: snippet.id,
    document_id: snippet.document_id,
    project_id: snippet.project_id,
    ordinal: snippet.ordinal,
    text: snippet.text,
    source_label: snippet.source_label
  };

  if (snippet.location !== undefined) {
    clone.location = snippet.location;
  }

  return clone;
}

function scoreSnippet(queryTokens: string[], snippetText: string, queryText: string): number {
  if (queryTokens.length === 0) {
    return 0;
  }

  const snippetTokens = new Set(tokenize(snippetText));
  let matchCount = 0;

  for (const token of queryTokens) {
    if (snippetTokens.has(token)) {
      matchCount += 1;
    }
  }

  const overlapScore = matchCount / queryTokens.length;
  const phraseBoost = normalizeWhitespace(snippetText).toLowerCase().includes(normalizeWhitespace(queryText).toLowerCase())
    ? 0.2
    : 0;

  return Math.min(1, Number((overlapScore + phraseBoost).toFixed(3)));
}

export function chunkDocumentText(input: ChunkDocumentTextInput): AvgSourceSnippet[] {
  assertNonEmpty(input.document_id, "document_id");
  assertNonEmpty(input.project_id, "project_id");
  assertNonEmpty(input.source_label, "source_label");
  assertNonEmpty(input.text, "text");

  const snippets: AvgSourceSnippet[] = [];
  const paragraphs = splitParagraphs(input.text);
  let ordinal = 0;

  paragraphs.forEach((paragraph, paragraphIndex) => {
    const paragraphChunks = splitParagraphIntoChunks(paragraph);

    paragraphChunks.forEach((text, chunkIndex) => {
      ordinal += 1;
      snippets.push({
        id: chunkId(input.document_id, ordinal),
        document_id: input.document_id,
        project_id: input.project_id,
        ordinal,
        text,
        source_label: input.source_label
      });

      const snippet = snippets[snippets.length - 1]!;
      snippet.location =
        paragraphChunks.length > 1
          ? `paragraph ${paragraphIndex + 1} segment ${chunkIndex + 1}`
          : `paragraph ${paragraphIndex + 1}`;
    });
  });

  return snippets;
}

function cloneDocument(document: AvgDocumentRef): AvgDocumentRef {
  const clone: AvgDocumentRef = {
    id: document.id,
    project_id: document.project_id,
    title: document.title,
    source_kind: document.source_kind,
    created_at: document.created_at
  };

  if (document.metadata !== undefined) {
    clone.metadata = { ...document.metadata };
  }

  return clone;
}

function cloneStoredDocument(record: StoredDocument): StoredDocument {
  return {
    document: cloneDocument(record.document),
    text: record.text,
    snippets: record.snippets.map(cloneSnippet)
  };
}

function validateRegisterDocumentInput(input: RegisterDocumentInput): void {
  assertNonEmpty(input.project_id, "project_id");
  assertNonEmpty(input.title, "title");
  assertNonEmpty(input.text, "text");

  if (!documentSourceKinds.includes(input.source_kind)) {
    throw new Error(`Unsupported source_kind: ${input.source_kind}`);
  }

  if (input.created_at !== undefined) {
    assertNonEmpty(input.created_at, "created_at");
  }

  for (const [key, value] of Object.entries(input.metadata ?? {})) {
    assertNonEmpty(key, "metadata key");
    if (typeof value !== "string") {
      throw new Error(`metadata.${key} must be a string`);
    }
  }
}

export function createDocumentRepository(options: DocumentRepositoryOptions = {}): DocumentRepository {
  const documents = new Map<string, StoredDocument>();
  const now = options.now ?? (() => new Date().toISOString());
  let documentCounter = 0;

  function nextDocumentId(): string {
    documentCounter += 1;
    return `doc_${String(documentCounter).padStart(3, "0")}`;
  }

  function registerDocument(input: RegisterDocumentInput): RegisterDocumentResult {
    validateRegisterDocumentInput(input);

    const document: AvgDocumentRef = {
      id: nextDocumentId(),
      project_id: input.project_id,
      title: input.title.trim(),
      source_kind: input.source_kind,
      created_at: input.created_at ?? now()
    };

    if (input.metadata !== undefined) {
      document.metadata = { ...input.metadata };
    }

    const validation = validateDocumentRef(document);
    if (!validation.valid) {
      throw new Error("Document metadata violates the AVG document contract");
    }

    documents.set(document.id, {
      document: cloneDocument(document),
      text: input.text,
      snippets: chunkDocumentText({
        document_id: document.id,
        project_id: document.project_id,
        source_label: document.title,
        text: input.text
      })
    });

    return {
      document: cloneDocument(document)
    };
  }

  function getDocument(documentId: string): AvgDocumentRef | undefined {
    const record = documents.get(documentId);
    return record ? cloneDocument(record.document) : undefined;
  }

  function getDocumentText(documentId: string): string | undefined {
    return documents.get(documentId)?.text;
  }

  function getDocumentSnippets(documentId: string): AvgSourceSnippet[] | undefined {
    const record = documents.get(documentId);
    return record ? record.snippets.map(cloneSnippet) : undefined;
  }

  function listDocuments(projectId?: string): AvgDocumentRef[] {
    return Array.from(documents.values())
      .filter((record) => projectId === undefined || record.document.project_id === projectId)
      .map(cloneStoredDocument)
      .map((record) => record.document);
  }

  function listDocumentSnippets(projectId?: string): AvgSourceSnippet[] {
    return Array.from(documents.values())
      .filter((record) => projectId === undefined || record.document.project_id === projectId)
      .flatMap((record) => record.snippets.map(cloneSnippet));
  }

  function searchDocuments(projectId: string, query: string, options: SearchDocumentsOptions = {}): SearchDocumentsResult {
    assertNonEmpty(projectId, "project_id");
    assertNonEmpty(query, "query");

    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) {
      throw new Error("query is required");
    }

    const limit = options.limit ?? 5;
    assertPositiveInteger(limit, "limit");

    const snippets = listDocumentSnippets(projectId);
    const hits = snippets
      .map((snippet) => {
        const score = scoreSnippet(queryTokens, snippet.text, query);

        if (score <= 0) {
          return undefined;
        }

        return {
          snippet_id: snippet.id,
          document_id: snippet.document_id,
          project_id: snippet.project_id,
          score,
          confidence: confidenceFromScore(score),
          citation_id: citationId(snippet.document_id, snippet.ordinal),
          matched_text: snippet.text,
          source_label: snippet.source_label
        } satisfies AvgRetrievalHit;
      })
      .filter((hit): hit is AvgRetrievalHit => hit !== undefined)
      .sort((left, right) => {
        if (right.score !== left.score) {
          return right.score - left.score;
        }

        if (left.document_id !== right.document_id) {
          return left.document_id.localeCompare(right.document_id);
        }

        if (left.snippet_id !== right.snippet_id) {
          return left.snippet_id.localeCompare(right.snippet_id);
        }

        return left.citation_id.localeCompare(right.citation_id);
      })
      .slice(0, limit)
      .map((hit) => ({ ...hit }));

    return {
      hits,
      retrieval_confidence: retrievalConfidenceFromHits(hits)
    };
  }

  return {
    registerDocument,
    getDocument,
    getDocumentText,
    getDocumentSnippets,
    listDocuments,
    listDocumentSnippets,
    searchDocuments
  };
}
