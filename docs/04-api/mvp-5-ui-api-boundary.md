# MVP-5 UI API Boundary

## Status

Frozen for Sprint 7 / AVG-701.

## Purpose

This document freezes the API boundary the MVP-5 browser interface may rely on. It does not introduce new public schemas. It names the stable local operations that AVG-702 through AVG-708 can wire into the workspace.

## Boundary Rules

- UI code must use typed adapters around API responses.
- UI code must not assemble ad hoc response objects when a contract helper exists.
- API failures shown to the user must use the normalized error envelope.
- Project id in a route must match project id in any structured response body.
- Retrieval confidence is a risk signal, not proof of truth.
- Prompt-injection text retrieved from documents is source content only.

## Operations

AVG-704 uses the document registration operation described here and the UI flow in `docs/05-ui-ux/document-workspace-registration-flow.md`.

| Operation | Method And Path | Request Contract | Response Contract | Used By |
|---|---|---|---|---|
| Health | `GET /health` | none | `HealthResponse` | workspace status |
| Create project | `POST /projects` | local adapter input until route is implemented | `ProjectRecord` | workspace |
| Create session | local adapter | project id, title | `SessionRecord` | workspace |
| Append message | `POST /sessions/{sessionId}/messages` | message content and optional retrieval context | `AvgStructuredResponse` or validation error | dialogue |
| Register document | `POST /projects/{projectId}/documents` | `RegisterDocumentRequest` | `{ "document": AvgDocumentRef }` | documents |
| Search retrieval | `POST /projects/{projectId}/retrieval/search` | `RetrievalSearchRequest` | `RetrievalSearchResponse` | retrieval |
| Render grounded retrieval flow | `POST /projects/{projectId}/retrieval/grounded-flow` | session id, response, query, optional limit | HTML smoke artifact with hits, citations, unsupported claims and boundary | retrieval |
| Render grounded dialogue page | `POST /projects/{projectId}/dialogue/page` | session id, messages, response, query, optional limit | HTML smoke artifact or normalized error | integration smoke |
| Validate claim/response | local validation adapter | claim body or structured response | validation result | dialogue, claim review |

## Error Envelope

All UI-facing errors follow:

```json
{
  "code": "string",
  "message": "string",
  "request_id": "string",
  "details": {}
}
```

`request_id` is optional for the current local implementation, but the UI must tolerate it when present.

Required error codes for MVP-5 UI handling:

- `INVALID_JSON`;
- `INVALID_REQUEST`;
- `PROJECT_ID_MISMATCH`;
- `DOCUMENT_TEXT_REQUIRED`;
- `DOCUMENT_NOT_FOUND`;
- `RETRIEVAL_QUERY_REQUIRED`;
- `RETRIEVAL_NO_EVIDENCE`;
- `CITATION_BOUNDARY_VIOLATION`;
- `STRUCTURED_RESPONSE_INVALID`;
- `VALIDATION_BOUNDARY_VIOLATION`.

## UI State Mapping

| API Result | UI State |
|---|---|
| health ok | workspace shows local API available |
| project/session created | workspace stores active ids locally |
| valid structured response | dialogue renders response details and claim review receives derived claims |
| invalid structured response | dialogue renders an error boundary, not assistant content |
| document registered | document list updates with document id and snippet preview |
| retrieval hits | retrieval panel shows snippets, citation ids and confidence |
| retrieval no evidence | retrieval panel shows missing-evidence boundary |
| grounded retrieval flow | retrieval panel shows hits before or alongside the grounded response and preserves unsupported claims |
| grounded response | dialogue and retrieval separate cited facts, interpretations and unsupported claims |

## Non-Scope

MVP-5 UI code must not depend on:

- audio routes;
- realtime transports;
- presence or collaborative editing routes;
- production vector database APIs;
- OCR or file ingestion services;
- external web ingestion APIs;
- permissions or organization-sharing APIs.

## Contract Test Expectations

AVG-702 through AVG-708 should add or reuse contract tests when they wire these operations:

- request and response shape used by the UI;
- normalized errors for invalid document and retrieval requests;
- project id mismatch on grounded dialogue page;
- project id mismatch on grounded retrieval flow;
- no-evidence retrieval boundary;
- invalid structured response boundary.

No AI eval update is required for this contract freeze because prompt behavior is unchanged.
