# Retrieval API Contract

## Status

Frozen for Sprint 6 / AVG-601.

## Purpose

This document defines the minimal MVP-4 API boundary for registering local project documents, retrieving snippets and composing source-grounded AVG responses.

The contract is intentionally implementation-light. It does not choose a production vector database or file upload stack.

## Endpoints

### Register Document

```http
POST /projects/{projectId}/documents
```

Request:

```json
{
  "title": "Strategy notes",
  "source_kind": "local_markdown",
  "text": "Document text for local MVP retrieval.",
  "metadata": {
    "origin": "manual"
  }
}
```

Response:

```json
{
  "document": {
    "id": "doc_001",
    "project_id": "project-7",
    "title": "Strategy notes",
    "source_kind": "local_markdown",
    "created_at": "2026-05-20T00:00:00.000Z",
    "metadata": {
      "origin": "manual"
    }
  }
}
```

### Retrieve Snippets

```http
POST /projects/{projectId}/retrieval/search
```

Request:

```json
{
  "query": "What claim does the source support?",
  "limit": 5
}
```

Response:

```json
{
  "hits": [
    {
      "snippet_id": "snip_001",
      "document_id": "doc_001",
      "project_id": "project-7",
      "score": 0.82,
      "confidence": "high",
      "citation_id": "cit_001",
      "matched_text": "Document text for local MVP retrieval.",
      "source_label": "Strategy notes"
    }
  ],
  "retrieval_confidence": "high"
}
```

### Send Grounded Message

The existing dialogue endpoint may accept an optional retrieval context after implementation:

```http
POST /sessions/{sessionId}/messages
```

Optional request extension:

```json
{
  "content": "Answer using registered project documents.",
  "retrieval": {
    "project_id": "project-7",
    "document_ids": ["doc_001"],
    "require_citations": true
  }
}
```

Response extension:

```json
{
  "grounding": {
    "citations": [
      {
        "id": "cit_001",
        "document_id": "doc_001",
        "snippet_id": "snip_001",
        "source_label": "Strategy notes",
        "quoted_text": "Document text for local MVP retrieval.",
        "relevance": "supporting"
      }
    ],
    "grounded_claims": ["The source supports a local MVP retrieval claim."],
    "interpretations": ["AVG interprets the note as implementation context."],
    "unsupported_claims": [],
    "retrieval_confidence": "high",
    "boundary_statement": "This answer is grounded only in the registered project document snippets."
  }
}
```

## Error Model

Use the existing API error shape:

```json
{
  "code": "string",
  "message": "string",
  "request_id": "string",
  "details": {}
}
```

Required MVP-4 error codes:

- `DOCUMENT_TEXT_REQUIRED`
- `DOCUMENT_NOT_FOUND`
- `RETRIEVAL_QUERY_REQUIRED`
- `RETRIEVAL_NO_EVIDENCE`
- `CITATION_BOUNDARY_VIOLATION`

## Contract Rules

- `project_id` must match the route project.
- `snippet_id` must be stable for deterministic tests.
- `citation_id` must identify one retrieval hit or response citation.
- `retrieval_confidence` is a risk signal, not proof of truth.
- Low-confidence answers must include a boundary statement.
- Provider-specific retrieval or model errors must remain normalized.

## Schema Note

`schemas/json-schema/avg-response.schema.json` is not changed by AVG-601. AVG-604 may extend or wrap the structured response after implementation confirms the smallest stable shape.
