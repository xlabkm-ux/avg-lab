# MVP-5 Interface Contract

## Status

Frozen for Sprint 7 / AVG-701.

## Purpose

This contract freezes the smallest complete MVP-5 browser interface that can support user testing and downstream implementation tasks AVG-702 through AVG-708.

The interface is a local working environment, not a chatbot skin. Every surface must preserve scope, claim status, language mode, access mode where available, validation risk and the map/territory boundary.

## Product Surfaces

MVP-5 has seven first-class surfaces. The shell may show them as tabs, navigation items or panes, but they must remain distinct in state and rendering.

| Surface | Owns | Must Show | Must Not Imply |
|---|---|---|---|
| Workspace | active project, active session, local-only status | project id, session id, reset action, local storage boundary | account, shared workspace or production persistence |
| Dialogue | message composer, thread, structured response result | summary, scope, claim status, language mode, risk, boundary, next action | plain unstructured assistant answer as the product result |
| Claim Review | extracted claims and validation notes | claim status, language mode, risk level, repair suggestions, boundary notes | that a repair suggestion is automatically true |
| Documents | local document registration and document list | title, source kind, metadata, snippet ids, validation errors | global knowledge base or cross-project source |
| Retrieval | grounded question flow and source snippets | query, hits, citation ids, snippet ids, confidence, matched text, source label | retrieval confidence as proof of truth |
| Map | working concept graph projection | nodes, edges, claim metadata, node details, map boundary | ontology, Reality or settled model |
| Artifacts | copy/export outputs | session summary, grounded answer report, map snapshot, citation report | hidden cleanup of unsupported claims |

## Shell Contract

The first screen is the workspace itself.

Required regions:

- top project/session bar with local-only status;
- left navigation for Dialogue, Documents, Retrieval, Claim Review, Map and Artifacts;
- main surface region for the active surface;
- secondary details region for selected claim, citation, node, document or artifact;
- compact technical details disclosure with project id, session id and contract version.

The shell must keep navigation available while a user moves between dialogue, documents, retrieval, map and artifacts. Opening a detail must not destroy the active dialogue context.

## State Boundaries

MVP-5 state is browser-local unless explicitly returned by the local API.

| State Area | Owner | Lifetime | Notes |
|---|---|---|---|
| `workspace` | web app | current browser session | active project id, session id, selected surface |
| `dialogue` | web app plus local API | current project/session | messages and structured responses; invalid responses are stored as errors, not assistant content |
| `claims` | web app derived state | current project/session | extracted from structured response fields and validation output |
| `documents` | local API | current project | document refs and local text registration results |
| `retrieval` | local API plus web app | current query | hits and grounded response panels are query-scoped |
| `map` | web app derived state | current project/session | projection from validated claims or graph snapshots |
| `artifacts` | web app derived state | generated on demand | exports include scope, risk and boundary notes |

State rules:

- Project-local data must not leak into another project surface.
- Missing or invalid API data must render an error boundary, not fallback mock content.
- Derived state must be recomputable from messages, responses, documents, retrieval hits and graph snapshots.
- Browser persistence may store the active project/session, but it must label the data as local-only.

## Structured Response Rendering

The Dialogue surface may render an assistant turn only when it has a valid `AvgStructuredResponse` or a visible validation error.

Required fields for normal rendering:

- `summary`;
- `scope`;
- `claim_status`;
- `language_mode`;
- `validation_risk`;
- `risk_markers`;
- `map_territory_boundary`;
- `next_action`.

If validation fails, the UI must show:

- normalized error code;
- readable message;
- affected field or schema path when available;
- a boundary note that the content is not accepted as an AVG response.

## Claim Review Contract

Claim Review is an inspection surface, not an auto-correction system.

Each claim row must include:

- claim text;
- source field or message id;
- claim status;
- language mode;
- validation result;
- risk level;
- repair suggestions, if any;
- boundary note.

Metaphor-only, unsupported, high-risk and map/territory issues must be visually distinguishable from grounded or low-risk claims.

## Document And Retrieval Contract

Detailed AVG-704 document workspace flow is tracked in `docs/05-ui-ux/document-workspace-registration-flow.md`.

Document registration accepts local text-like sources only:

- `local_text`;
- `local_markdown`;
- `local_document`.

The document surface must show generated document ids and snippet ids after registration. The retrieval surface must show snippets before or alongside the answer that uses them.

The AVG-705 grounded retrieval flow must keep the question, retrieval hits, snippet ids, citation ids, matched text, source labels, scores and confidence visible in the retrieval surface.

Grounded answers must separate:

- cited facts;
- AVG interpretations;
- unsupported claims;
- boundary statement.

Prompt-injection text inside a source remains source content. It must never become system instruction, UI instruction or hidden product behavior.

## Map Contract

The map is a working projection. It must always carry a visible map/territory boundary.

Node details must preserve:

- node id;
- label and definition;
- claim status;
- language mode;
- access mode where available;
- scope;
- source refs or citation refs where available;
- known risks.

Edges must show relationship type, endpoints, claim status, scope and constraints where available.

## Artifact Contract

Artifacts are generated from current project/session state and must not erase uncertainty.

Supported MVP-5 artifact kinds:

- session summary;
- grounded answer report;
- concept map snapshot;
- document citation report.

Every export must include:

- project id and session id;
- scope;
- risk markers or unsupported claims;
- citation ids and snippet ids where retrieval is used;
- map/territory boundary note.

## API Boundary Used By UI

The UI may depend on these local API operations during MVP-5:

| Operation | Endpoint Or Adapter | UI Consumer |
|---|---|---|
| health check | `GET /health` | workspace status |
| create project | `POST /projects` or local adapter equivalent | workspace |
| create session | local adapter equivalent until HTTP route is frozen | workspace |
| send message | `POST /sessions/{sessionId}/messages` | dialogue |
| validate response or claim | local validation adapter | dialogue, claim review |
| register document | `POST /projects/{projectId}/documents` | documents |
| search retrieval | `POST /projects/{projectId}/retrieval/search` | retrieval |
| grounded retrieval flow | `POST /projects/{projectId}/retrieval/grounded-flow` | retrieval |
| grounded dialogue page | `POST /projects/{projectId}/dialogue/page` | integration smoke path |

All UI-facing failures use the normalized API error envelope:

```json
{
  "code": "string",
  "message": "string",
  "request_id": "string",
  "details": {}
}
```

Provider-specific raw errors must not be displayed.

## Required MVP-5 E2E Scenarios

AVG-709 through AVG-711 must cover these flows before MVP-5 closes:

1. Happy path: create project, submit thought, register document, ask grounded question, inspect citations, inspect map, export artifact.
2. Missing evidence path: ask grounded question without matching snippets and see a boundary/error state.
3. Prompt-injection-as-source path: register hostile source text and verify it renders only as source content.
4. Invalid structured response path: malformed response fails visibly and is not rendered as a normal assistant answer.
5. Visual smoke: workspace, navigation, dialogue, documents, retrieval, claim review, map and artifacts render without overlap.
6. Accessibility smoke: core controls are reachable and named.

## Explicit MVP-6 Deferrals

The following remain out of scope for MVP-5 interface design and implementation:

- voice capture;
- speech-to-text;
- text-to-speech;
- realtime multi-user collaboration;
- live presence;
- collaborative editing;
- external web ingestion;
- production vector database selection;
- production document storage;
- OCR;
- permissions and organization sharing;
- complex background worker orchestration;
- advanced model routing.

MVP-5 may leave reversible extension points, but it must not add dependencies, public schemas or UX commitments for these capabilities.

## Risks

| Risk | Severity | Mitigation |
|---|---:|---|
| Interface collapses into chatbot wrapper | high | Dialogue, Claim Review, Retrieval, Map and Artifacts stay first-class surfaces |
| Retrieval confidence reads as truth | high | confidence is labeled as a retrieval risk signal and paired with boundary copy |
| Map looks ontological | high | map/territory boundary is visible on empty and populated map states |
| Mock state diverges from API | medium | UI uses typed adapters and contract tests for request/response shapes |
| MVP-6 work leaks into MVP-5 | high | deferred capabilities are listed and excluded from acceptance |

## Rollback

If implementation overruns, MVP-5 surfaces can be reduced in this order without changing public schemas:

1. hide Artifacts behind a local feature flag while preserving export helpers;
2. hide Map details while keeping the boundary and snapshot export;
3. keep Retrieval as a snippet-and-citation panel without composed answer generation;
4. keep Dialogue plus Claim Review as the minimum AVG interface.

Rollback must not remove structured response validation, claim metadata display or map/territory boundary rendering.
