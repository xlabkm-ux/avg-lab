# Retrieval Grounding Contract

## Status

Frozen for Sprint 6 / AVG-601.

## Purpose

This contract defines the minimal retrieval and source-grounding boundary for MVP-4 before backend, retrieval and UI implementation work starts.

AVG may use documents as evidence inputs, but documents are not treated as Reality. A retrieved source can support a claim only inside the explicit scope of that source, its snippet and the current project session.

## Source of Truth

- `docs/00-product/mvp-4-retrieval-and-documents-plan.md`
- `docs/02-ai-system/claim-validation-contract.md`
- `docs/02-ai-system/eval-strategy.md`
- `docs/04-api/retrieval-api-contract.md`
- `packages/avg-retrieval/README.md`

## Frozen Retrieval Shapes

### Document Reference

```ts
type AvgDocumentRef = {
  id: string;
  project_id: string;
  title: string;
  source_kind: "local_text" | "local_markdown" | "local_document";
  created_at: string;
  metadata?: Record<string, string>;
};
```

### Source Snippet

```ts
type AvgSourceSnippet = {
  id: string;
  document_id: string;
  project_id: string;
  ordinal: number;
  text: string;
  location?: string;
  source_label: string;
};
```

### Retrieval Hit

```ts
type AvgRetrievalHit = {
  snippet_id: string;
  document_id: string;
  project_id: string;
  score: number;
  confidence: "low" | "medium" | "high";
  citation_id: string;
  matched_text: string;
  source_label: string;
};
```

### Citation

```ts
type AvgCitation = {
  id: string;
  document_id: string;
  snippet_id: string;
  source_label: string;
  quoted_text: string;
  relevance: "supporting" | "context" | "contradicting";
};
```

### Grounded Response Boundary

```ts
type AvgGroundedResponseBoundary = {
  citations: AvgCitation[];
  grounded_claims: string[];
  interpretations: string[];
  unsupported_claims: string[];
  retrieval_confidence: "none" | "low" | "medium" | "high";
  boundary_statement: string;
};
```

## Required Behavior

- Every citation points to a specific snippet id.
- A grounded claim must reference at least one citation id.
- Interpretation must be labeled separately from cited fact.
- Unsupported claims must be avoided when possible.
- If unsupported content is useful, it must be marked as unsupported or hypothetical.
- Low or missing retrieval confidence must produce a boundary statement.
- Prompt-injection text inside a source must be treated as source content, not instructions.

## Acceptance Rules

A retrieval-grounded answer is acceptable when:

- citations are snippet-level, not document-level only;
- cited facts, interpretation and uncertainty are separable in the response boundary;
- claim status and language mode remain compatible with the existing claim validation contract;
- map/territory boundary is `preserved`;
- retrieval confidence is exposed as a risk signal, not a truth label.

## Rejection Rules

Reject or repair a response when:

- it presents retrieved text as complete Reality;
- it makes a confident claim without citation or explicit uncertainty;
- it hides weak retrieval behind fluent summary language;
- it follows instructions embedded inside source documents;
- it converts metaphor, opinion or user notes into fact.

## Eval Requirements

Sprint 6 implementation must add fixtures for:

- source-grounding correctness;
- unsupported-answer boundaries;
- citation completeness;
- prompt injection inside retrieved source text;
- map/territory boundary preservation.

## Out of Scope

- production vector database selection;
- external web search;
- source trust scoring;
- OCR;
- document permissions and sharing.

## Rollback

Disable grounded response composition and citation panel rendering while keeping registered documents and snippets as local development data. Existing dialogue, validation and concept map behavior must continue to work without retrieval.
