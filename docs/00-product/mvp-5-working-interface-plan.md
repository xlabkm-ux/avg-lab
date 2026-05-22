# MVP-5 Working Interface Plan

## Purpose

MVP-5 turns the existing AVG contract slices into a fully usable local product interface.

The frozen Sprint 7 interface contract lives in `docs/05-ui-ux/mvp-5-interface-contract.md`. The matching UI API boundary lives in `docs/04-api/mvp-5-ui-api-boundary.md`.

The goal is not to add voice, collaboration infrastructure, production vector search or other heavy services. The goal is to make the core AVG experience work end to end for a real user in the browser:

1. create or open a project;
2. run a structured dialogue;
3. see claim status, language mode, validation risk and map/territory boundaries;
4. register project documents;
5. ask grounded questions against those documents;
6. inspect citations and unsupported claims;
7. view a working concept map;
8. export or copy useful artifacts from the session.

MVP-5 must prove that AVG is a coherent thinking environment, not a collection of isolated backend helpers.

## Product Boundary

MVP-5 must preserve the AVG non-negotiable principle:

- no important claim is shown without scope, status and risk context;
- no retrieved snippet is treated as Reality;
- no metaphor is presented as fact;
- no map is presented as the territory;
- no generated answer hides unsupported synthesis behind fluent language.

The interface should make these boundaries normal and usable, not bureaucratic. The user should be able to think quickly while still seeing where AVG is certain, uncertain, interpreting, or merely mapping.

## Explicit Non-Scope

The following work is moved to MVP-6 and must not be designed in detail during MVP-5:

- voice capture;
- speech-to-text;
- text-to-speech;
- realtime multi-user collaboration;
- streaming presence;
- external web ingestion;
- production vector database selection;
- OCR for scanned documents;
- long-term multi-tenant document storage;
- permissions and organization-level sharing;
- complex background worker orchestration;
- model routing beyond the current local contract needs.

MVP-5 may leave small extension points for these later capabilities, but it must not introduce dependencies, schemas or UX commitments for them.

## Current Baseline

MVP-0 through MVP-4 already provide:

- repository operating model;
- structured AVG response schema;
- claim validation and risk classification;
- concept map schema and projection helpers;
- document registration boundary;
- deterministic local retrieval;
- grounded response composition;
- citation panel render helpers;
- tests and AI eval fixtures for the core safety rules.

MVP-5 builds on that baseline by creating an integrated web application and API flow around those capabilities.

## User Outcome

At the end of MVP-5, a user can open AVG locally and complete this scenario without touching code:

1. start a project;
2. write a raw idea;
3. receive a structured AVG response;
4. see why the response is a hypothesis, boundary statement, operational marker, metaphor or unsupported claim;
5. register a document as local project evidence;
6. ask a question that uses that document;
7. inspect the exact snippets and citation ids used by the answer;
8. see interpretations and unsupported claims separately;
9. view the evolving concept map as a working map;
10. export the session summary and map snapshot as local artifacts.

## Experience Principles

- The first screen is the working product, not a landing page.
- The interface must be dense enough for repeated thinking work, but calm enough not to feel like an admin console.
- Claims, citations and maps are visible operational objects, not hidden debug output.
- The user should never need to understand internal package names to use the system.
- Error states must explain the boundary: missing evidence, invalid document, unsupported claim, schema violation or low confidence.
- Empty states must invite action without overexplaining the product.

## MVP-5 Functional Scope

### Project Workspace

Build a browser workspace with:

- project title and active session indicator;
- left navigation for Dialogue, Documents, Map and Artifacts;
- persistent local project state for the current browser session;
- visible status for local-only data;
- reset or clear local project action;
- no authentication or production account system.

Acceptance:

- user can create a project from the UI;
- user can return to the active project during the local session;
- project id and session id are visible in a compact technical details area;
- local-only storage boundary is visible.

### Dialogue Surface

Build a real dialogue interface with:

- message composer;
- user and assistant message thread;
- structured response details;
- claim status and language mode display;
- validation risk badge;
- risk markers;
- map/territory boundary;
- next action;
- empty, loading, error and recovered states.

Acceptance:

- user can submit a raw thought;
- UI renders a structured AVG response object;
- invalid structured responses fail visibly instead of rendering as normal answers;
- response details are inspectable without leaving the dialogue;
- the interface never shows a plain unstructured assistant answer as the main product result.

### Claim Review Panel

Build a panel that exposes claim discipline:

- extracted claims from summary, scope and next action;
- claim status;
- language mode;
- validation result;
- risk level;
- repair suggestions;
- boundary notes.

Acceptance:

- user can inspect why a response is safe or risky;
- metaphor-only and map/territory issues are visibly marked;
- unsupported or high-risk statements do not look equivalent to grounded claims;
- repair suggestions are shown as suggestions, not automatic truth.

### Document Workspace

Build a local document panel with:

- document text registration form;
- title, source kind and metadata fields;
- document list;
- document detail view;
- snippet preview;
- validation errors for empty or invalid documents;
- clear local-only boundary.

Acceptance:

- user can register a local text or markdown document;
- registered documents appear in a project-local list;
- user can inspect generated snippet ids;
- invalid document submissions produce actionable errors;
- document state is not exposed as a global cross-project source.

### Grounded Retrieval Flow

Build a grounded question flow that connects documents to dialogue:

- query input;
- retrieval results;
- citation ids;
- snippet ids;
- matched text;
- source label;
- retrieval confidence;
- grounded response panel;
- unsupported claims section;
- boundary statement.

Acceptance:

- user can ask a question against registered documents;
- UI shows the snippets used before or alongside the answer;
- cited facts, AVG interpretations and unsupported claims are separate;
- low or missing evidence produces a visible boundary;
- prompt-injection text inside a retrieved source is displayed only as source content.

### Concept Map Surface

Build a usable concept map view based on existing graph contracts:

- empty map state;
- nodes from validated claims or response projections;
- edges where available;
- node detail panel;
- claim status and language mode on nodes;
- map/territory boundary always visible;
- deterministic map snapshot export.

Acceptance:

- user can view a map generated from current session material;
- map nodes preserve claim metadata;
- map display does not imply the map is Reality;
- user can inspect node details without losing dialogue context.

### Artifact Workspace

Build an artifact panel for useful outputs:

- structured session summary;
- grounded answer report;
- concept map snapshot;
- document citation report;
- copy/export as JSON or Markdown.

Acceptance:

- user can generate a session artifact from the current state;
- exported artifact includes scope, risks and boundary notes;
- citations include snippet-level ids;
- unsupported claims remain visible in exports.

### Local API Integration

Replace isolated render helper usage with a coherent API-backed UI flow:

- project/session endpoints or local API adapter;
- document registration route;
- retrieval search route;
- grounded dialogue page/response route;
- validation route;
- predictable error envelope.

Acceptance:

- frontend uses stable typed boundaries rather than ad hoc mock objects;
- API errors are visible in the UI;
- contract tests cover request and response shapes used by the UI.

### Quality and Observability

Add product-level checks:

- E2E happy path for project -> dialogue -> document -> grounded answer -> map -> artifact;
- E2E missing evidence path;
- E2E prompt-injection-as-source path;
- visual smoke for the main workspace;
- accessibility smoke for core controls;
- AI evals unchanged unless prompt behavior changes.

Acceptance:

- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:contract`, `pnpm test:ai`, `pnpm build` pass;
- MVP-5 E2E smoke passes;
- UI changed areas include screenshots or screenshot artifacts in PR notes;
- no prompt behavior changes without eval updates.

## Sprint Plan

### Sprint 7: Interface Foundation

Goal: create the integrated web workspace and connect it to existing deterministic local flows.

Tasks:

- AVG-701: MVP-5 interface contract freeze.
- AVG-702: workspace shell and local project/session state.
- AVG-703: dialogue surface with structured response details.
- AVG-704: document workspace and registration flow.

Exit criteria:

- user can create a project, submit a thought, register a document and see core panels in one browser interface;
- AVG-702 through AVG-704 follow the frozen interface contract and UI API boundary;
- no voice, realtime collaboration or production services are introduced.

### Sprint 8: Core Product Functions

Goal: make the planned AVG functions usable in the browser.

Tasks:

- AVG-705: grounded retrieval flow with citation panel.
- AVG-706: claim review panel with validation risk and repair suggestions.
- AVG-707: concept map surface from session material.
- AVG-708: artifact workspace and export.

Exit criteria:

- user can complete the full MVP-5 outcome scenario;
- grounded answers, claim review, map and artifacts are connected through one project state.

### Sprint 9: Product Hardening

Goal: prove the interface is complete enough for user testing.

Tasks:

- AVG-709: E2E happy path and missing evidence path.
- AVG-710: prompt-injection-as-source UI proof.
- AVG-711: visual and accessibility smoke.
- AVG-712: release notes, risk review and rollback plan.

Exit criteria:

- MVP-5 can be tested by a user without developer mediation;
- release quality gates pass;
- known limitations are documented without weakening the product boundary.

## Required Quality Gates

Run before closing MVP-5:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:contract
pnpm test:ai
pnpm build
pnpm test:e2e
```

If UI visual or accessibility scripts are implemented in the repo, also run:

```bash
pnpm test:visual
pnpm test:a11y
```

## Decision Points

Human approval is required before:

- changing public schemas;
- changing prompt behavior;
- adding frontend framework dependencies beyond the chosen app baseline;
- adding production storage;
- adding vector database dependencies;
- introducing audio or realtime collaboration code;
- adding authentication or permissions.

## Risks

| Risk | Severity | Mitigation |
|---|---:|---|
| Interface becomes a chatbot wrapper | high | structured response, claim review, citations and map are first-class surfaces |
| UI hides uncertainty | high | risk badges, unsupported claims and boundary statements stay visible |
| MVP-5 expands into voice/realtime work | high | all audio and complex services are explicitly moved to MVP-6 |
| Mock data diverges from contracts | medium | frontend must use typed API boundaries and contract tests |
| Concept map looks ontological | high | map/territory boundary is always visible |
| Retrieval confidence looks like truth | high | confidence is labeled as retrieval risk signal |

## Rollback

MVP-5 should be rollback-friendly:

- interface routes can be disabled without removing core packages;
- document and retrieval UI can be hidden while keeping dialogue available;
- map and artifact panels can be feature-flagged locally;
- existing MVP-4 API and package tests must continue to pass.

## PR Notes

Every MVP-5 PR should include:

- purpose;
- changed areas;
- screenshots if UI changed;
- tests run;
- AI evals run if prompt or model behavior changed;
- risks;
- rollback plan;
- affected agents;
- migration notes if schemas or ids change.
