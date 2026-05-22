# Refactoring Audit — 2026-05-22

## Scope

This audit was performed after synchronizing with Git on 2026-05-22.

Current branch state:

- Local branch: `main`
- Tracking branch: `origin/main`
- Latest commit audited: `0920321 docs(sprint): add Sprint Close Rule to execution protocol (AVG-715) (#12)`
- Recent changes included:
  - `46d3032 feat(infra): add PR automation workflow and agent scripts (AVG-705) (#10)`
  - `f2995eb feat(validation): add claim review panel and concept map visualization (AVG-706, AVG-707) (#11)`
  - `0920321 docs(sprint): add Sprint Close Rule to execution protocol (AVG-715) (#12)`

Quality commands run locally:

- `pnpm typecheck` — passed
- `pnpm lint` — passed
- `pnpm test` — failed because `@avg/utils` runs `vitest run` with no test files

## Executive Summary

The repository is moving from blueprint to working MVP UI. The latest PRs added visible product value: claim review, concept map visualization, React Flow integration, PR automation, and stricter sprint closure rules. The main refactoring need has shifted from "missing implementation everywhere" to "separate prototype surfaces into stable product modules and make quality gates honest."

The highest-priority issues are:

1. `pnpm test` fails on `@avg/utils`, so the advertised quality gate is currently broken.
2. `apps/web/src/index.ts` has grown into a 1,800+ line mixed library containing state, storage, rendering, API helpers, document registration, grounded flow rendering, concept map rendering, and claim review rendering.
3. `apps/api/src/index.ts` remains a large in-memory API module with route handling, repositories, config, error responses, logging, and business operations in one file.
4. New UI tests do not render the new UI components; they mostly test duplicated data-shape logic.
5. CI/linting gives a false sense of coverage: root ESLint still ignores TypeScript/React files, while package `lint` scripts are mostly `tsc --noEmit`.
6. Documentation now contains process rules that assume Bash/Make/gh workflows, while the active local development mode is Windows PowerShell.

## Findings

### P0 — Repository quality gate fails

`pnpm test` currently fails because `packages/avg-utils/package.json` defines:

```json
"test": "vitest run"
```

but `packages/avg-utils` has no test files.

Impact:

- CI will fail if it runs the same command cleanly.
- Sprint completion rules require `pnpm test`, so process and repo reality disagree.

Recommended fix:

- Add a small `packages/avg-utils/tests/utils.test.ts` covering `normalizeText`, `dedupe`, `truncate`, `clamp`, and `formatPercentage`.
- Avoid `--passWithNoTests` for this package because `avg-utils` now contains real shared logic.

### P0 — Web package build contract is split incorrectly

`@avg/web` exports library artifacts from `./dist/index.js` and `./dist/index.d.ts`, but the default `build` script runs Vite and emits the app bundle to `dist-app`.

```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "default": "./dist/index.js"
  }
},
"build": "vite build",
"build:lib": "tsc -p tsconfig.json"
```

Impact:

- Consumers such as `@avg/api` depend on `@avg/web` library exports.
- A clean build may not produce the library artifacts unless `build:lib` is run separately.
- Turbo believes `@avg/web#build` satisfies upstream dependencies, but it only builds the browser app.

Recommended fix:

- Split `@avg/web` into two packages:
  - `@avg/web-app` or `apps/web` for Vite/React app output.
  - `@avg/rendering` or `@avg/web-rendering` for server-safe HTML rendering utilities consumed by `@avg/api`.
- Short-term fix: make `apps/web/package.json` build run both library and app outputs, for example `tsc -p tsconfig.json && vite build`, and add `dist-app/**` to Turbo outputs.

### P1 — `apps/web/src/index.ts` is overloaded

Current size: 1,800+ lines.

It contains at least these responsibilities:

- workspace state types and state creation
- local storage persistence
- HTML escaping and string rendering
- project/session shell rendering
- structured dialogue rendering
- grounded retrieval rendering
- concept map shell rendering
- document registration API helpers and HTML rendering
- claim review data and rendering

Impact:

- Small UI changes risk touching a high-conflict file.
- Browser app and server-rendered helper concerns are tangled.
- It is hard to test behavior at the right level.

Recommended module split:

- `apps/web/src/workspace/state.ts`
- `apps/web/src/workspace/storage.ts`
- `apps/web/src/workspace/render-shell.ts`
- `apps/web/src/dialogue/render-dialogue.ts`
- `apps/web/src/retrieval/render-grounded-flow.ts`
- `apps/web/src/documents/document-api-client.ts`
- `apps/web/src/documents/render-document-registration.ts`
- `apps/web/src/maps/render-concept-map.ts`
- `apps/web/src/claims/render-claim-review.ts`
- `apps/web/src/html/escape.ts`

Keep `apps/web/src/index.ts` as a barrel export only.

### P1 — API server needs route/repository separation

`apps/api/src/index.ts` is about 850+ lines and combines:

- runtime config parsing
- path safety
- in-memory project/session/message maps
- document repository composition
- route parsing
- HTTP response shaping
- error logging
- server creation
- exported domain operations

Impact:

- Persistence migration will be noisy.
- Route tests must import the entire server module.
- Error behavior is hard to standardize.

Recommended module split:

- `apps/api/src/config.ts`
- `apps/api/src/http/responses.ts`
- `apps/api/src/http/router.ts`
- `apps/api/src/http/server.ts`
- `apps/api/src/projects/project-repository.ts`
- `apps/api/src/documents/document-routes.ts`
- `apps/api/src/retrieval/retrieval-routes.ts`
- `apps/api/src/logging/error-log.ts`

Introduce repository interfaces before adding real persistence:

- `ProjectRepository`
- `SessionRepository`
- `MessageRepository`
- `DocumentRepository`

### P1 — UI tests do not exercise UI

New files:

- `apps/web/tests/claim-review-panel.test.tsx`
- `apps/web/tests/concept-map-panel.test.tsx`

These tests mostly validate local test factories and duplicated logic, not rendered components.

Impact:

- A component can stop rendering badges, buttons, expanded details, React Flow controls, or map boundary text without these tests failing.
- The test names overstate coverage.

Recommended fix:

- Add React Testing Library and render:
  - claim review empty state
  - risky claim status and repair suggestion
  - expand/collapse interaction
  - concept map empty state
  - concept map node/edge count
  - selected node detail behavior
- Move pure mapping logic from `useGraphToReactFlow` into exported pure functions so it can be tested without React.

### P1 — TypeScript linting is not real linting

Root `eslint.config.mjs` only targets JS files:

```js
files: ["*.js", "*.mjs", "*.cjs"]
```

Most package `lint` scripts run TypeScript compilation only.

Impact:

- React hook mistakes, unsafe casts, inconsistent imports, floating promises, and testing anti-patterns are not linted.
- `pnpm lint` passing does not mean the TS/React code is lint-clean.

Recommended fix:

- Add `typescript-eslint` flat config.
- Add React hooks linting for `apps/web`.
- Decide which rules are warnings during migration and errors for new code.

### P1 — Auto-merge policy is too permissive

`.github/workflows/auto-merge.yml` sets:

```yaml
MERGE_REQUIRED_APPROVALS: 0
MERGE_LABELS: ""
```

Impact:

- Any non-draft PR may auto-merge when checks pass, with no human or architect review.
- This conflicts with AGENTS.md principles around schemas, prompts, security controls, and PR review.

Recommended fix:

- Require a label such as `automerge`.
- Require at least one approval for code, schema, prompt, security, and workflow changes.
- Exclude docs-only automation from stricter rules if needed.

### P2 — Windows PowerShell workflow is under-supported in docs/scripts

Project-local instruction says to use PowerShell. Recent docs and scripts emphasize:

- `make pr`
- `make commit-and-pr`
- `bash scripts/dev/create-pr.sh`
- `cmd //c scripts\\dev\\create-pr.bat`

Impact:

- Windows contributors can run into missing `make`, Bash, or command quoting problems.
- Sprint close docs include Bash-only branch cleanup examples.

Recommended fix:

- Add `scripts/dev/create-pr.ps1`.
- Add `scripts/dev/close-sprint.ps1`.
- Update sprint docs with PowerShell-first commands and Bash equivalents second.

### P2 — Empty architecture packages remain ambiguous

Several directories exist as architectural placeholders without `package.json` and only `.gitkeep` files, including:

- `packages/avg-core`
- `packages/avg-config`
- `packages/avg-memory`
- `packages/avg-observability`
- `packages/avg-ui`
- `packages/avg-knowledge`
- `packages/avg-claim-court`
- `packages/avg-concept-forge`

Impact:

- Contributors may assume these packages are installable workspace packages when they are not.
- Architectural intent is documented, but ownership and activation criteria are not clear.

Recommended fix:

- Classify each placeholder as one of:
  - active package now
  - planned package with activation criteria
  - documentation-only concept
- Do not add package.json files until there is executable code and tests.

### P2 — Duplicate domain types and utilities should be retired

Examples:

- `AvgRetrievalHit` exists in both `packages/avg-retrieval/src/index.ts` and `packages/avg-validation/src/index.ts`.
- `deepEqual` uses `JSON.stringify` in both `@avg/utils` and graph comparison logic.
- strong-word marker logic exists in `@avg/utils`, but validation still keeps its own marker classification flow.

Impact:

- Contract changes can drift across packages.
- Utility package exists, but consumers have not fully migrated to it.

Recommended fix:

- Move cross-package contracts to `@avg/schemas` or import concrete types from the owning package.
- Use `@avg/utils` only for truly generic utilities.
- Keep domain-specific claim discipline logic inside `@avg/validation`.

### P2 — Backlog and status summaries are internally inconsistent

`docs/88-project-plan/project-backlog.md` now records completed sprint work, but top-level tables still show `TBD`, `pending`, or `0%` in several places.

Examples:

- Summary Budget still shows MVP-5 Interface as `TBD` / `pending`.
- Overall Project Budget still shows `Actual Tokens` as blank and `% Complete` as `0%` for Stage 1.
- Sprint 1.2 is marked `in_progress` even though both listed tasks are completed; one exit criterion remains unchecked.
- Sprint 1.3 marks "diff view" complete, but the current concept map component does not appear to implement graph diff view.

Impact:

- The financial-control document is no longer a reliable source of truth.
- Future agents may plan from stale totals.

Recommended fix:

- Run a backlog consistency pass as a docs task before the next sprint.
- Separate "task implementation complete" from "sprint exit criteria complete".
- Add an automated markdown consistency check if backlog enforcement is mandatory.

## Recommended Refactoring Roadmap

### Phase 0 — Repair quality gates

Target: same day.

Tasks:

1. Add tests for `@avg/utils`.
2. Fix `@avg/web` build contract so both `dist/**` and `dist-app/**` are produced or split the package.
3. Update Turbo outputs for Vite app artifacts.
4. Add CI check that fails when a package has a `test` script with no tests unless explicitly marked scaffold-only.

### Phase 1 — Make new UI testable

Target: 1-2 days.

Tasks:

1. Add React Testing Library setup for `apps/web`.
2. Replace data-only component tests with render and interaction tests.
3. Extract graph-to-flow pure mapping functions from `useGraphToReactFlow`.
4. Replace `Date.now()` demo IDs in `App.tsx` with `crypto.randomUUID()` or a local `generateId` wrapper.

### Phase 2 — Split web/server rendering boundaries

Target: 2-4 days.

Tasks:

1. Turn `apps/web/src/index.ts` into a barrel file.
2. Move local workspace state and storage into dedicated modules.
3. Move server-rendered HTML helpers into a rendering package or subfolder.
4. Stop `@avg/api` from depending on the browser app package.

### Phase 3 — Split API into routes and repositories

Target: 3-5 days.

Tasks:

1. Extract config, responses, logging, and route handlers.
2. Introduce repository interfaces around current in-memory maps.
3. Keep in-memory implementations as default for MVP.
4. Prepare PostgreSQL/Neo4j adapters as later implementations, not immediate rewrites.

### Phase 4 — Align documentation with executable reality

Target: 1-2 days.

Tasks:

1. Update backlog totals, statuses, and exit criteria.
2. Add PowerShell-first PR and sprint-close scripts.
3. Tighten auto-merge policy docs and workflow.
4. Update old audit documents to point to this fresh audit or mark them superseded.

## Suggested Tickets

| Ticket | Title | Priority | Area |
|--------|-------|----------|------|
| AVG-716 | Restore `pnpm test` quality gate for `@avg/utils` | P0 | QA/DX |
| AVG-717 | Fix `@avg/web` library/app build contract | P0 | Build |
| AVG-718 | Replace data-only UI tests with rendered component tests | P1 | Frontend QA |
| AVG-719 | Split `apps/web/src/index.ts` into workspace/rendering/document modules | P1 | Frontend |
| AVG-720 | Split API server into config, routes, responses, repositories | P1 | Backend |
| AVG-721 | Add TypeScript/React ESLint coverage | P1 | DX |
| AVG-722 | Harden auto-merge workflow with label/approval policy | P1 | DevOps |
| AVG-723 | Add PowerShell PR and sprint-close scripts | P2 | DevOps |
| AVG-724 | Reconcile backlog summaries and sprint exit criteria | P2 | Docs |

## Notes for Next Agent

- Do not start broad persistence work before route/repository separation. The current in-memory state should first be placed behind interfaces.
- Treat `@avg/web` as two concerns: browser application and server-safe rendering helpers.
- Keep AVG product invariants visible during refactors: claim status, language mode, map/territory boundary, source grounding, and validation risk must not become optional display details.
- Prefer incremental file splits with unchanged public exports over a large rewrite.
