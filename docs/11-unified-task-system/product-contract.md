# Product Contract: Unified Task Dialogue

**Status:** Draft
**Related plan:** `docs/88-project-plan/unified-task-system-expanded-plan.md`
**Covers:** AVG-UTS-101, AVG-UTS-102

## Product Thesis

Dialogue is the single user entry point for AVG. The user writes a normal task, idea, question, claim or request. AVG decides the process and exposes only meaningful user states.

The user should not need to know validators, modes, retrieval, graph projections, fallback logic or prompt mechanics.

## Non-Negotiable Boundary

Every important response preserves:

- `scope`;
- `claim_status`;
- `language_mode`;
- `validation_risk`;
- `map_territory_boundary`;
- `next_useful_move`.

AVG must never present:

- metaphor as fact;
- a working map as Reality;
- retrieval confidence as proof;
- raw LLM output as final answer;
- unsupported synthesis as grounded knowledge.

## Dialogue Language

- generated dialogue content is Russian-first;
- UI may support `ru` and `en`;
- UI language toggle changes labels, navigation, buttons and states;
- UI toggle does not translate user input or generated responses;
- a future translation layer requires a separate product and eval spec.

## Intent Taxonomy

| Intent | Meaning | Typical Next Process |
|---|---|---|
| `develop_idea` | User wants to expand, clarify or generate alternatives | creative development pattern |
| `verify_claim` | User asks whether a statement is justified | claim extraction and validation pattern |
| `build_map` | User wants concepts, relations or structure | graph projection pattern |
| `create_artifact` | User wants a plan, document, table, strategy or spec | artifact assembly pattern |
| `request_evidence` | User asks for sources or grounded answer | retrieval and citation pattern |
| `resolve_contradiction` | User presents conflicting claims or tensions | comparison and boundary pattern |
| `clarify_criteria` | User lacks target, scope or success criteria | HITL clarification pattern |
| `smalltalk` | User asks conversational filler unrelated to AVG task | product-boundary response |
| `out_of_scope` | Request does not fit AVG mission | graceful refusal |
| `unknown` | Intent confidence is insufficient | clarification or guided choice |

Intent classification is not a final answer. It is a routing signal that must be recorded in Task Run trace.

## User State Taxonomy

| State | User Meaning | UI Behavior |
|---|---|---|
| `accepted` | Task was received and normalized | show first progress step |
| `needs_clarification` | AVG cannot answer safely without a missing detail | ask 1-3 focused questions |
| `guided_choice` | Several valid solution routes exist | show mutually exclusive options with implications |
| `needs_evidence` | A claim or answer needs sources | guide user to Documents or retrieval |
| `answer_ready` | A validated response is ready | show answer and verification details |
| `map_ready` | Concepts and relations are ready for map surface | offer map handoff |
| `artifact_ready` | Material can be turned into an artifact | offer artifact/editor handoff |
| `requires_action_approval` | A high-risk or commit-like action needs user permission | show approval card |
| `blocked_by_boundary` | AVG cannot proceed because a safety/product boundary was hit | show refusal and safe next move |
| `failed_safe` | Pipeline failed but did not leak unsafe output | show deterministic fallback |

## Response Requirements

The user-facing response must include:

- concise Russian summary;
- explicit scope;
- claim status badge;
- language mode badge;
- validation risk badge;
- map/territory boundary;
- next useful move;
- surface suggestions when relevant.

Hidden/admin-only response metadata may include:

- selected intent;
- selected solution pattern;
- LLM model and token estimate;
- adequacy score;
- retry count;
- raw provider error code;
- tool execution trace.

## Graceful Boundary Responses

Smalltalk:

> Я сфокусирован на аналитических и проектных задачах AVG. Сформулируйте рабочую задачу, например: "проверь это утверждение", "собери план" или "построй карту понятий".

Out of scope:

> Этот запрос выходит за рабочие границы AVG. Я могу помочь с идеями, проверкой утверждений, картами понятий, источниками и структурированными артефактами.

Safety violation:

> Запрос нарушает границы безопасности. Операция остановлена, небезопасный текст не будет использоваться как инструкция.

## Acceptance Criteria

- User can submit a task without choosing an internal mode.
- UI shows process state instead of internal pipeline names.
- Ambiguous tasks produce clarification or guided choice instead of weak answer.
- Evidence gaps produce `needs_evidence`.
- Every ready answer includes AVG boundary metadata.
- Smalltalk and out-of-scope requests do not trigger expensive LLM drafting.

