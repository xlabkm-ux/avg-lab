# Specification: UX Surface Guidance

**Status:** Draft
**Covers:** AVG-UTS-303, AVG-UTS-304, AVG-UTS-503 through AVG-UTS-507, AVG-UTS-601, AVG-UTS-602

## Purpose

Dialogue coordinates task solving. Documents, Map, Claim Review and Artifacts remain real work surfaces. The UI should guide users between them without exposing internal mechanics.

## Progress Center

Shown inside Dialogue near the active thread.

Visible event labels:

- "Задача принята";
- "Уточняю цель";
- "Выбираю способ решения";
- "Проверяю утверждения";
- "Ищу основания";
- "Готовлю результат";
- "Нужно действие";
- "Готово";
- "Есть риск".

Do not show:

- node class names;
- raw JSON;
- raw LLM attempts;
- provider stack traces;
- prompt names.

## HITL Cards

### Clarification

Fields:

- question;
- optional context snippet;
- text input;
- submit action.

### Guided Choice

Fields:

- question;
- 2-3 options;
- implication per option;
- selected option;
- submit action.

### Needs Evidence

Fields:

- entity or claim needing support;
- why evidence is needed;
- action to open Documents or Retrieval.

### Action Approval

Fields:

- action name;
- risk level;
- summarized payload;
- approve/reject controls.

Action approval is present in contract but disabled for destructive tools until security review.

## Next Useful Move

Every ready answer should show one primary next move:

- add evidence;
- inspect claim review;
- open concept map;
- create artifact;
- refine scope;
- split task.

Secondary suggestions may be shown as compact actions.

## Cross-Surface Rules

Documents:

- used when evidence is missing or retrieval is requested;
- source text is always untrusted content;
- snippets retain citation IDs.

Map:

- offered when enough entities or claims exist;
- map boundary is always visible;
- map nodes preserve claim status and language mode.

Artifacts:

- used for long-form outputs;
- Dialogue shows summary and opens artifact surface;
- exports include scope, risk and unsupported claims.

Claim Review:

- offered when validation risk is medium/high/critical;
- repair suggestions remain suggestions, not truth.

## UI Language Layer

Deferred until Phase UTS-6.

Requirements:

- `Locale = "ru" | "en"`;
- dictionary keys for shell, navigation, dialogue controls, errors and states;
- localStorage persistence;
- generated responses remain Russian;
- no automatic translation of user input.

## Accessibility And Visual Rules

- every HITL card has named controls;
- keyboard submit works for forms;
- focus moves to the new action card when one appears;
- progress updates are perceivable without layout jumps;
- text must not overlap in compact viewports;
- admin console is visually distinct from user-facing timeline.

## Tests

- progress states render from user timeline events;
- clarification card submit creates resume payload;
- guided choice options are mutually exclusive;
- needs evidence opens Documents suggestion;
- `map_ready` opens Map suggestion;
- UI locale toggle changes labels only;
- generated Russian response remains unchanged after locale toggle.

