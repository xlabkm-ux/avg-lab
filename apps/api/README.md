# apps/api

Fastify API: sessions, projects, messages, tools, OpenAI orchestration.

## Current Surface

- `health()` reports service availability.
- `createProject()`, `createSession()` and `appendMessage()` provide a minimal in-memory project/session/message API.
- `materializeMapSnapshot()` normalizes a graph projection or snapshot into a defensive snapshot copy.
- `createMapDiffArtifact()` emits a deterministic `map_diff` artifact using `@avg/graph`'s `diffGraphSnapshots()`.
- `validateClaimRequest()` forwards claim bodies into the contract validator.
- `registerProjectDocument()` registers local project documents through `@avg/retrieval`.
- `getProjectDocument()`, `getProjectDocumentText()` and `listProjectDocuments()` expose the MVP-4 local document boundary.
- `searchProjectDocuments()` and `composeGroundedProjectResponse()` expose the grounded retrieval boundary.
- `createGroundedProjectRetrievalFlow()` and `renderGroundedProjectRetrievalFlow()` expose the AVG-705 grounded question flow with retrieval hits, citation ids, snippet ids, confidence and the grounded response boundary.
- `renderGroundedProjectDialoguePage()` composes grounded retrieval and renders the full dialogue page through `@avg/web`.
- `handleGroundedProjectDialoguePageRoute()` serves document registration over `POST /projects/{projectId}/documents`.
- `handleGroundedProjectDialoguePageRoute()` serves retrieval search over `POST /projects/{projectId}/retrieval/search`.
- `handleGroundedProjectDialoguePageRoute()` serves the grounded dialogue page over `POST /projects/{projectId}/dialogue/page`.
- `createApiRuntimeConfig()` validates request timeout, body limit and local log directory settings at server startup.
- `resolveLabRelativePath()` rejects absolute paths and `..` traversal outside the AVG lab boundary.
- `writeApiErrorLog()` writes internal API error context to local NDJSON logs.
- `createApiServer()` exposes a minimal Node HTTP server with request body timeout, body-size limit, safe JSON error envelopes and file-backed error logging.

## First Implementation Tasks

- Add package.json.
- Add TypeScript config extending root.
- Add health/smoke test.
- Add README usage examples.

## Usage Notes

The current API surface is intentionally in-memory and deterministic. It is a contract slice, not a production persistence layer.

### Runtime Safety

The Node HTTP server has explicit runtime limits:

- `AVG_API_REQUEST_TIMEOUT_MS` defaults to `15000`.
- `AVG_API_REQUEST_BODY_LIMIT_BYTES` defaults to `1000000`.
- `AVG_API_LOG_DIRECTORY` defaults to `.avg-logs`.

Route project ids reject traversal-like segments before project lookup. User-provided filesystem paths must pass `resolveLabRelativePath(rootDir, requestedPath)` before any file access is added to the API or retrieval layers.

Internal server failures are logged to `api-errors.ndjson` under the configured local log directory. Client responses use a safe envelope:

```json
{
  "status": "error",
  "code": "INTERNAL_ERROR",
  "message": "AVG hit an internal API failure. Try again later.",
  "details": {}
}
```

### Document Registration

```ts
import { createProject, registerProjectDocument } from "@avg/api";

const project = createProject("Retrieval project");
const result = registerProjectDocument(project.id, {
  title: "Strategy notes",
  source_kind: "local_markdown",
  text: "Document text for local MVP retrieval.",
  metadata: {
    origin: "manual"
  }
});
```

The API returns a stable document reference. Source text remains inside the local retrieval repository where it can be chunked and searched deterministically.

### Map Diff Artifact

```ts
import { createEmptyGraphSnapshot, projectClaimToMapNode } from "@avg/graph";
import { createMapDiffArtifact, renderGroundedProjectDialoguePage } from "@avg/api";

const before = createEmptyGraphSnapshot();
const after = projectClaimToMapNode({
  id: "claim_100",
  statement: "Maps must keep claim status visible.",
  claim_status: "boundary_statement",
  language_mode: "operational_description",
  risks: [],
  scope: "Sprint 5"
});

const artifact = createMapDiffArtifact(before, after);
```

The artifact keeps the `from` and `to` snapshots intact and computes the diff through `diffGraphSnapshots()`.

### Grounded Dialogue Page

```ts
import { createProject, registerProjectDocument, renderGroundedProjectDialoguePage } from "@avg/api";

const project = createProject("Dialogue project");
registerProjectDocument(project.id, {
  title: "Strategy notes",
  source_kind: "local_markdown",
  text: "The grounded response should stay visible in the dialogue flow."
});

const page = renderGroundedProjectDialoguePage(project.id, {
  sessionId: "session_001",
  messages: [
    { id: "message_001", role: "user", content: "raw thought" },
    { id: "message_002", role: "assistant", content: "grounded response" }
  ],
  response: {
    id: "response_001",
    project_id: project.id,
    session_id: "session_001",
    message_id: "message_002",
    summary: "Grounded response",
    scope: "dialogue page",
    claim_status: "boundary_statement",
    language_mode: "operational_description",
    validation_risk: "low",
    risk_markers: ["retrieval_grounded"],
    map_territory_boundary: "preserved",
    next_action: "continue the dialogue",
  },
  query: "grounded response"
});
```

This helper bridges retrieval composition and web rendering so the grounded answer can enter the page-level dialogue flow from the API boundary.

### HTTP Route

`handleGroundedProjectDialoguePageRoute()` exposes the minimal MVP-4 HTTP contract:

- `POST /projects/{projectId}/documents` registers local project document text.
- `POST /projects/{projectId}/retrieval/search` returns ranked snippet hits and retrieval confidence.
- `POST /projects/{projectId}/retrieval/grounded-flow` renders the grounded retrieval UI flow and preserves missing evidence as a visible boundary.
- `POST /projects/{projectId}/dialogue/page` accepts `sessionId`, `messages`, `response`, `query` and optional `limit`, then returns the page HTML response.

`createApiServer()` wraps the same handler in a minimal Node HTTP server for local use.
