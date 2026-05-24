# Spec: Deterministic Dialogue Engine on er-map

## Context

The AVG dialogue pipeline has no real response generation. The frontend (`DialogueSurface.tsx`) fabricates a hardcoded `AvgStructuredResponse` (echo of user input as `summary`, placeholder metadata) and the API passes it through grounding unchanged. The user wants to build a **deterministic dialogue engine** that uses the `er-map/` knowledge base (135 terms, 9 ontology frames, 7 methodology concepts, source fragments) to generate meaningful Russian-language responses with correct AVG discipline metadata — replacing the need for an LLM in the current phase.

**Intended outcome:** When a user asks "Что такое адекватность?" in the dialogue, the system looks up the er-map term, returns its definition as `summary`, derives `claim_status`, `language_mode`, `validation_risk`, `risk_markers`, `scope` from the term's coordinates and policies, and grounds the response with citations — all without any LLM call.

---

## Architecture

```
Frontend (DialogueSurface)
  sends: { query, sessionId, messages }          ← no more fabricated response
  receives: { structuredResponse, grounding, retrievalHits, html }
         │
         ▼  POST /projects/:id/dialogue/page
API Route (routes/index.ts)
  ├─ Dialogue Engine (@avg/knowledge)             ← NEW: generates AvgStructuredResponse
  │   1. matchTerms(query) → scored matches
  │   2. assembleSummary(matches, query) → Russian text from er-map definitions
  │   3. deriveMetadata(matches) → claim_status, language_mode, risk, scope...
  │   → AvgStructuredResponse
  │
  └─ Grounding Pipeline (existing, unchanged)
      searchDocuments → composeGroundedResponse → citations + boundary
```

**Key separation:** The er-map index (for response generation) and the project DocumentRepository (for grounding/citations) are independent systems. er-map data is NOT loaded into the DocumentRepository. er-map provides the "answer"; DocumentRepository provides the "evidence".

---

## New Package: `@avg/knowledge`

Activate the existing placeholder at `packages/avg-knowledge/` (currently has only a "COMING SOON" README and empty `src/` + `tests/`).

### Files to Create

| File | Purpose |
|------|---------|
| `packages/avg-knowledge/package.json` | Package config with deps on `@avg/schemas` |
| `packages/avg-knowledge/tsconfig.json` | TypeScript config |
| `packages/avg-knowledge/src/index.ts` | Barrel exports |
| `packages/avg-knowledge/src/er-map-loader.ts` | Reads er-map JSON files from disk |
| `packages/avg-knowledge/src/er-map-index.ts` | In-memory searchable index |
| `packages/avg-knowledge/src/flatten-text.ts` | Flattens JSON entries to readable Russian text |
| `packages/avg-knowledge/src/term-matching.ts` | Query-to-term matching algorithm |
| `packages/avg-knowledge/src/response-assembly.ts` | Summary text generation |
| `packages/avg-knowledge/src/metadata-derivation.ts` | Deterministic metadata from er-map coordinates |
| `packages/avg-knowledge/src/dialogue-engine.ts` | Orchestration pipeline |
| `packages/avg-knowledge/tests/er-map-loader.test.ts` | Loader tests |
| `packages/avg-knowledge/tests/er-map-index.test.ts` | Index search tests |
| `packages/avg-knowledge/tests/dialogue-engine.test.ts` | End-to-end engine tests |

---

## Component Design

### 1. er-map Loader (`er-map-loader.ts`)

Reads all er-map JSON from disk, returns flat `ErMapEntry[]`.

**Entry types** (discriminated union by `entryType`):

| Type | Source | Count | Key Fields |
|------|--------|-------|------------|
| `term` | `er-map/terms/*.json` | ~135 | `id`, `label`, `aliases[]`, `definition`, `term_role`, `coordinates`, `allowed_language[]`, `forbidden_language[]`, `common_substitutions[]` |
| `ontology` | `er-map/ontology/*.json` | ~9 | `id`, `label.ru`, `definition.text`, `coordinates`, `language_policy`, `claim_policy`, `map_safety` |
| `methodology` | `er-map/methodology/*.json` | ~15 | Same as ontology + `scope_requirements`, `boundaries.does_not_claim[]` |
| `fragment` | `er-map/sources/source_fragments.json` | ~30 | `id`, `text`, `topic`, `source_id` |

```
loadErMap(erMapRoot: string) → ErMapEntry[]
```

### 2. Text Flattening (`flatten-text.ts`)

Each entry flattened to readable Russian text for matching:

- **Term:** `"Реальность: Предельная рамка ЭР: всё, что есть... Синонимы: предельная рамка"`
- **Ontology:** `"Реальность — Предельная рамка ЭР... Допустимый язык: working_distinction, boundary_statement"`
- **Fragment:** Raw text as-is

```
flattenEntry(entry: ErMapEntry) → string
```

### 3. er-map Index (`er-map-index.ts`)

In-memory searchable index:

- `entries: Map<string, ErMapEntry>` — by ID
- `labelMap: Map<string, string>` — lowercase labels/aliases → entry ID (exact matching)
- `tokenIndex: Map<string, Set<string>>` — inverted token index (token-overlap matching)

```
createErMapIndex(entries: ErMapEntry[]) → ErMapIndex
index.search(query: string, limit?: number) → ScoredEntry[]
index.getEntry(id: string) → ErMapEntry | undefined
```

Tokenization: same Unicode pattern as `@avg/retrieval` (`/[\p{L}\p{N}]+/gu`).

### 4. Term Matching (`term-matching.ts`)

Three-signal scoring per entry:

| Signal | Max Score | Method |
|--------|-----------|--------|
| Exact label/alias match | 1.0 | `query.toLowerCase()` contains label or alias as substring |
| Token overlap | 0.8 | Token-overlap ratio against flattened text |
| Context boost | 0.2 | Level keyword in query matches entry's `nesting_level` |

Selection heuristic:
- **Primary term**: highest-scored `term` entry (threshold ≥ 0.15)
- **Secondary terms**: next 1-2 terms with score ≥ 0.3
- **Ontology frame**: highest-scored ontology entry (if score ≥ 0.2)
- **Methodology concept**: highest-scored methodology entry (if score ≥ 0.2)

### 5. Response Assembly (`response-assembly.ts`)

Generates the `summary` field (Russian text) based on match results:

| Case | Output Pattern |
|------|---------------|
| **No matches** | `"Запрос не сопоставляется с известными терминами карты ЭР. Это рабочая граница: ответ остаётся неподкреплённой рабочей гипотезой."` |
| **Single strong match (≥0.6)** | Term's definition, optionally prefixed `"В рамках карты ЭР: "` for question queries. Append substitution warnings if `common_substitutions` exist. |
| **Multiple matches (2-3)** | Primary definition + `"Связанный концепт: "` + secondary definition. Append level/access info from ontology frame. |
| **Raw thought (no question, weak match)** | `"Ваш запрос затрагивает область: [primary label]. [definition]. В рамках карты ЭР это требует указания области определения и статуса утверждения."` |

Templates are static strings with placeholder substitution. No neural generation.

### 6. Metadata Derivation (`metadata-derivation.ts`)

Every `AvgStructuredResponse` field derived deterministically:

| Field | Source | Rule |
|-------|--------|------|
| `claim_status` | Term's `claim_policy.default_claim_status` or ontology frame's `claim_policy` | Direct mapping. If `positive_claims_allowed: false` → force `"working_distinction"`. Default: `"working_distinction"` |
| `language_mode` | Term's `allowed_language[0]` | First allowed mode. If empty or `silence_required` → `"operational_description"` |
| `validation_risk` | Count of risk signals: `common_substitutions`, `known_risks`, `forbidden_language` | 0 → `"low"`, 1-2 → `"medium"`, 3+ → `"high"`. If `prohibited_positive_claim` → `"critical"` |
| `risk_markers` | Union of `common_substitutions[].risk` + `known_risks` | Deduplicated risk IDs |
| `scope` | Term's `coordinates.nesting_level` + `access_mode` | `"В рамках [nesting_level], доступ: [access_mode]"` |
| `map_territory_boundary` | From `claim_status` + `validation_risk` | `critical` → `"violated"`, `high` → `"unclear"`, else → `"preserved"` |
| `next_action` | From `term_role` + risk markers | `boundary_marker` → boundary respect. Has risks → review markers. Default → clarify scope. |

**Language policy enforcement** (post-derivation):
- If ontology `positive_claims_allowed: false` → force `claim_status` to `"working_distinction"`
- If `requires_scope_boundary: true` → ensure `scope` is non-empty
- If generated text uses forbidden language mode → downgrade + prepend disclaimer

### 7. Dialogue Engine (`dialogue-engine.ts`)

```typescript
generateDialogueResponse(input: {
  query: string;
  projectId: string;
  sessionId: string;
  messageId: string;
}, index: ErMapIndex) → AvgStructuredResponse
```

Pipeline: matchTerms → selectTerms → assembleSummary → deriveMetadata → validateAvgResponse → return.

If `validateAvgResponse()` fails on the generated output → fall back to a known-good boundary response.

---

## Existing Files to Modify

### `apps/api/src/core/index.ts`
- Load er-map at module scope: `loadErMap(resolve(process.cwd(), "er-map"))`
- Create index: `createErMapIndex(entries)`
- Add `generateProjectDialogueResponse(projectId, sessionId, query)` that calls `generateDialogueResponse()`

### `apps/api/src/routes/index.ts`
- Make `response` optional in dialogue page request validation
- If no `response` provided → call `generateProjectDialogueResponse()` to generate one
- If `response` IS provided → use it (backward compatibility, existing tests pass)

### `apps/api/src/types/index.ts`
- Make `response` field optional in `RenderGroundedProjectDialoguePageRequest`

### `apps/api/package.json`
- Add `"@avg/knowledge": "workspace:*"` dependency

### `apps/web/src/api/dialogue.ts`
- Remove `response` field from `DialogueRequest` (frontend no longer fabricates it)

### `apps/web/src/components/DialogueSurface.tsx`
- Remove hardcoded response construction in `handleSubmit` (lines 99-118)
- Send only `{ sessionId, messages, query, limit }`
- Keep mock fallback for offline mode

---

## Implementation Status

### Completed
- [x] `packages/avg-knowledge/package.json` — package scaffold with `@avg/schemas` dep
- [x] `packages/avg-knowledge/tsconfig.json` — extends `../../tsconfig.base.json`
- [x] `packages/avg-knowledge/src/er-map-loader.ts` — ~350 lines, all entry types, loads terms/ontology/methodology/fragments

### Remaining

#### Phase 1: Foundation (er-map Loading)
1. Implement `flatten-text.ts` — flatten entries to readable Russian text
2. Implement `er-map-index.ts` — build searchable index (labelMap + tokenIndex)
3. Tests for loader + index in `tests/er-map-loader.test.ts` and `tests/er-map-index.test.ts`

#### Phase 2: Engine Core
4. Implement `term-matching.ts` — three-signal scoring (exact label, token overlap, context boost)
5. Implement `response-assembly.ts` — summary text from er-map definitions (4 templates)
6. Implement `metadata-derivation.ts` — deterministic claim_status, language_mode, risk, scope, etc.
7. Implement `dialogue-engine.ts` — orchestration: match -> select -> assemble -> derive -> validate
8. Implement `src/index.ts` — barrel exports
9. Tests in `tests/dialogue-engine.test.ts`

#### Phase 3: API Wiring
10. Add `"@avg/knowledge": "workspace:*"` to `apps/api/package.json`
11. Modify `apps/api/src/core/index.ts` — load er-map at module scope, add `generateProjectDialogueResponse()`
12. Modify `apps/api/src/types/index.ts` — make `response` optional in `RenderGroundedProjectDialoguePageRequest`
13. Modify `apps/api/src/routes/index.ts` — if no `response` in body, call engine; update `isRenderGroundedProjectDialoguePageRequest` to not require `response`
14. Run `pnpm install` to link workspace dep

#### Phase 4: Frontend Simplification
15. Modify `apps/web/src/api/dialogue.ts` — remove `response` from `DialogueRequest`
16. Modify `apps/web/src/components/DialogueSurface.tsx` — remove fabricated response (lines 99-118), send only `{ sessionId, messages, query, limit }`

#### Phase 5: Verification
17. `pnpm build` — all packages compile
18. `pnpm test` — all 72+ existing tests pass + new engine tests pass
19. `pnpm typecheck` — no type errors
20. `pnpm lint` — no new lint errors
21. Browser test: ask "Что такое Реальность?" → see er-map definition + correct metadata + citations

---

## Implementation Notes

### Tokenization
Reuse same pattern as `@avg/retrieval` (line 92-95):
```typescript
function tokenize(value: string): string[] {
  const matches = normalizeWhitespace(value).toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  return Array.from(new Set(matches));
}
```

### Vitest
No `vitest.config.ts` needed — packages use default vitest config (matches existing pattern in `@avg/retrieval`, `@avg/validation`).

### API Route Backward Compatibility
Current route validation (routes/index.ts:132-147) requires `"response" in record`. Must change to make `response` optional:
- If `response` present → use existing flow (backward compat, existing tests pass)
- If `response` absent → call `generateProjectDialogueResponse()` to generate one

### Validation Guard
Generated `AvgStructuredResponse` must pass `validateAvgResponse()` from `@avg/schemas` before returning. If validation fails → fall back to a known-good boundary response.

### Key Type Constraints
- `ClaimStatus`: 8 values (definition, working_distinction, operational_marker, indirect_sign, hypothesis, metaphor_only, prohibited_positive_claim, boundary_statement)
- `LanguageMode`: 6 values (direct_description, operational_description, conditional_description, metaphor, symbolic_pointer, silence_required)
- `DialogueValidationRisk`: 4 values (low, medium, high, critical)
- `MapTerritoryBoundaryState`: 3 values (preserved, unclear, violated)

---

## Verification

### Unit Tests (`packages/avg-knowledge/tests/`)

- **Loader**: Loads all er-map files, correct entry counts, handles missing dirs
- **Index**: `search("реальность")` returns `term_reality` as top hit; alias matching works
- **Engine**: 
  - "Что такое Реальность?" → summary contains definition, `claim_status: "working_distinction"`
  - "душа" (risky term) → `validation_risk: "high"`, risk_markers include `"term_reification"`
  - No match → boundary response with `"preserved"` boundary state
  - Generated responses always pass `validateAvgResponse()`

### Integration Tests (`apps/api/tests/`)

- POST dialogue page WITHOUT `response` → API generates one with valid schema
- POST dialogue page WITH `response` → backward compatibility (existing tests pass)
- er-map terms appear in generated response summary

### Manual Browser Test

1. Open dialogue surface
2. Type "Что такое Реальность?"
3. Verify: summary contains er-map definition text, badges show correct `claim_status` / `language_mode`, grounding summary appears, no citations from DocumentRepository (unless documents registered)

---

## What This Does NOT Do

- **No LLM calls** — this IS the LLM replacement
- **No vector embeddings** — token-overlap + substring matching
- **No conversation memory** — each query matched independently (future work)
- **No er-map mutation** — knowledge base is read-only
- **No merging with DocumentRepository** — er-map index and project documents are separate

---

## Critical Files

| File | Role |
|------|------|
| `packages/avg-knowledge/src/dialogue-engine.ts` | Core pipeline: matching → assembly → metadata |
| `packages/avg-knowledge/src/er-map-loader.ts` | Loads er-map corpus from disk |
| `packages/avg-knowledge/src/term-matching.ts` | Query-to-term scoring |
| `packages/avg-knowledge/src/metadata-derivation.ts` | Deterministic metadata rules |
| `apps/api/src/routes/index.ts` | Integration: invoke engine when no response provided |
| `apps/api/src/core/index.ts` | Wiring: load er-map at startup |
| `apps/web/src/components/DialogueSurface.tsx` | Frontend: stop fabricating response |
| `apps/web/src/api/dialogue.ts` | Simplify request type |
