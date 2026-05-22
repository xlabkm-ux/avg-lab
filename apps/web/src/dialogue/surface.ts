/**
 * Structured dialogue surface for AVG Codex Lab (browser-only).
 */

import { validateAvgResponse, type AvgStructuredResponse, type ValidationResult } from "@avg/schemas";
import { escapeHtml } from "@avg/utils";
import {
  renderShellTitle,
  createStructuredResponseDetailsPanel,
  renderStructuredResponseDetailsPanel,
  type DialogueMessage,
} from "@avg/html-rendering";

import {
  type StructuredDialogueStatus,
  type StructuredDialogueError,
  type StructuredDialogueSurfaceInput,
  type StructuredDialogueSurface,
} from "./types";

// Re-export types
export type {
  StructuredDialogueStatus,
  StructuredDialogueError,
  StructuredDialogueSurfaceInput,
  StructuredDialogueSurface,
};

// ============================================================================
// Helpers
// ============================================================================

function indentMarkup(markup: string, indent: string): string[] {
  return markup.split("\n").map((line) => `${indent}${line}`);
}

function formatResponseSchemaNotes(errors: ValidationResult["errors"]): string[] {
  if (errors.length === 0) {
    return [];
  }

  return errors.map((error) => {
    const location = error.instancePath.length > 0 ? error.instancePath : "/";
    return `AVG structured response schema violation at ${location} (${error.keyword}).`;
  });
}

function normalizeRawThought(value: string | undefined): string {
  return value?.trim() ?? "";
}

function createUserMessageFromRawThought(rawThought: string): DialogueMessage {
  return {
    id: "msg-1",
    role: "user",
    content: rawThought,
  };
}

function createAssistantMessageFromStructuredResponse(
  response: AvgStructuredResponse,
): DialogueMessage {
  return {
    id: response.message_id,
    role: "assistant",
    content: "Structured AVG response",
  };
}

function createInvalidStructuredResponseError(
  validation: ValidationResult,
): StructuredDialogueError {
  return {
    code: "invalid_structured_response",
    message:
      "AVG could not render the assistant output because it is not a valid structured response.",
    validation,
    boundaryNotes: [
      "The dialogue surface must not display invalid structured output as a normal assistant answer.",
      ...formatResponseSchemaNotes(validation.errors),
    ],
  };
}

function createProjectSessionMismatchError(
  response: AvgStructuredResponse,
  projectId: string,
  sessionId: string,
): StructuredDialogueError {
  return {
    code: "response_project_session_mismatch",
    message:
      "AVG could not render this structured response inside the active project/session.",
    boundaryNotes: [
      `Response project/session (${response.project_id}/${response.session_id}) does not match active project/session (${projectId}/${sessionId}).`,
      "Project/session drift must fail visibly so response details cannot cross workspace boundaries.",
    ],
  };
}

// ============================================================================
// Structured Dialogue Surface
// ============================================================================

export function createStructuredDialogueSurface(
  input: StructuredDialogueSurfaceInput,
): StructuredDialogueSurface {
  const rawThought = normalizeRawThought(input.rawThought);
  const baseMessages = input.messages ?? [];
  const baseSurface = {
    kind: "structured-dialogue-surface" as const,
    title: renderShellTitle(),
    projectId: input.projectId,
    sessionId: input.sessionId,
    rawThought,
    emptyStateTitle: "No dialogue yet",
    emptyStateBody:
      "Submit a raw thought. AVG will render only a contract-shaped response with scope, status, risk and boundary details.",
    loadingLabel: "Structuring response",
    composerLabel: "Raw thought",
    composerPlaceholder: "Write the thought you want AVG to shape",
    submitLabel: "Submit thought",
  };

  if (input.error !== undefined) {
    return {
      ...baseSurface,
      messages: baseMessages,
      status: "error",
      error: input.error,
    };
  }

  if (input.isLoading === true) {
    return {
      ...baseSurface,
      messages:
        rawThought.length > 0 && baseMessages.length === 0
          ? [createUserMessageFromRawThought(rawThought)]
          : baseMessages,
      status: "loading",
    };
  }

  if (input.response === undefined) {
    return {
      ...baseSurface,
      messages: baseMessages,
      status: "empty",
    };
  }

  const validation = validateAvgResponse(input.response);

  if (!validation.valid) {
    return {
      ...baseSurface,
      messages:
        rawThought.length > 0 && baseMessages.length === 0
          ? [createUserMessageFromRawThought(rawThought)]
          : baseMessages,
      status: "error",
      error: createInvalidStructuredResponseError(validation),
    };
  }

  const response = input.response as AvgStructuredResponse;

  if (response.project_id !== input.projectId || response.session_id !== input.sessionId) {
    return {
      ...baseSurface,
      messages:
        rawThought.length > 0 && baseMessages.length === 0
          ? [createUserMessageFromRawThought(rawThought)]
          : baseMessages,
      status: "error",
      error: createProjectSessionMismatchError(response, input.projectId, input.sessionId),
    };
  }

  const messages =
    baseMessages.length > 0
      ? baseMessages
      : [
          ...(rawThought.length > 0 ? [createUserMessageFromRawThought(rawThought)] : []),
          createAssistantMessageFromStructuredResponse(response),
        ];

  return {
    ...baseSurface,
    messages,
    status: input.recoveredFrom === undefined ? "ready" : "recovered",
    responseDetails: createStructuredResponseDetailsPanel(response),
    ...(input.recoveredFrom !== undefined ? { recoveredFrom: input.recoveredFrom } : {}),
  };
}

export function submitRawThoughtToStructuredDialogue(
  projectId: string,
  sessionId: string,
  rawThought: string,
  response?: unknown,
): StructuredDialogueSurface {
  const normalizedThought = normalizeRawThought(rawThought);

  if (normalizedThought.length === 0) {
    return createStructuredDialogueSurface({
      projectId,
      sessionId,
      rawThought,
      error: {
        code: "empty_raw_thought",
        message: "AVG needs a raw thought before it can build a structured response.",
        boundaryNotes: [
          "Empty input is not a claim, concept, metaphor or model and should not enter the dialogue map.",
        ],
      },
    });
  }

  return createStructuredDialogueSurface({
    projectId,
    sessionId,
    rawThought: normalizedThought,
    response,
  });
}

export function renderStructuredDialogueSurface(
  input: StructuredDialogueSurfaceInput | StructuredDialogueSurface,
): string {
  const surface =
    "kind" in input && input.kind === "structured-dialogue-surface"
      ? input
      : createStructuredDialogueSurface(input);
  const messageItems = surface.messages.map(
    (message) =>
      `    <li data-message-id="${escapeHtml(message.id)}" data-message-role="${escapeHtml(message.role)}"><strong>${escapeHtml(message.role)}</strong><p>${escapeHtml(message.content)}</p></li>`,
  );
  const errorPanel =
    surface.error === undefined
      ? []
      : [
          `  <section aria-label="dialogue-error" data-error-code="${escapeHtml(surface.error.code)}">`,
          `    <h3>${escapeHtml(surface.error.message)}</h3>`,
          `    <ul>`,
          ...surface.error.boundaryNotes.map((note) => `      <li>${escapeHtml(note)}</li>`),
          `    </ul>`,
          `  </section>`,
        ];
  const recoveredPanel =
    surface.recoveredFrom === undefined
      ? []
      : [
          `  <aside aria-label="dialogue-recovered-state" data-recovered-from="${escapeHtml(surface.recoveredFrom.code)}">`,
          `    <strong>Recovered structured response</strong>`,
          `    <p>${escapeHtml(surface.recoveredFrom.message)}</p>`,
          `  </aside>`,
        ];
  const detailsPanel =
    surface.responseDetails === undefined
      ? []
      : [
          `  <section aria-label="structured-response-details">`,
          ...indentMarkup(
            renderStructuredResponseDetailsPanel(surface.responseDetails.response),
            "    ",
          ),
          `  </section>`,
        ];

  return [
    `<section data-surface="${surface.kind}" data-project-id="${escapeHtml(surface.projectId)}" data-session-id="${escapeHtml(surface.sessionId)}" data-dialogue-status="${escapeHtml(surface.status)}">`,
    `  <header>`,
    `    <p>${escapeHtml(surface.title)}</p>`,
    `    <h2>Dialogue</h2>`,
    `  </header>`,
    `  <section aria-label="dialogue-thread">`,
    ...(messageItems.length > 0
      ? [`    <ol>`, ...messageItems, `    </ol>`]
      : [
          `    <strong>${escapeHtml(surface.emptyStateTitle)}</strong>`,
          `    <p>${escapeHtml(surface.emptyStateBody)}</p>`,
        ]),
    `  </section>`,
    ...(surface.status === "loading"
      ? [
          `  <section aria-label="dialogue-loading">`,
          `    <p>${escapeHtml(surface.loadingLabel)}</p>`,
          `  </section>`,
        ]
      : []),
    ...errorPanel,
    ...recoveredPanel,
    ...detailsPanel,
    `  <section aria-label="dialogue-composer">`,
    `    <label>${escapeHtml(surface.composerLabel)}</label>`,
    `    <textarea placeholder="${escapeHtml(surface.composerPlaceholder)}">${escapeHtml(surface.rawThought)}</textarea>`,
    `    <button type="button" data-action="submit-raw-thought">${escapeHtml(surface.submitLabel)}</button>`,
    `  </section>`,
    `</section>`,
  ].join("\n");
}
