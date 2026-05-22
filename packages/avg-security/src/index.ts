export type PromptInjectionRiskLevel = "low" | "medium" | "high" | "critical";

export interface SanitizedUserInput {
  originalLength: number;
  sanitizedText: string;
  truncated: boolean;
  removedControlCharacters: boolean;
  boundaryNotes: string[];
}

export interface PromptInjectionAssessment {
  riskLevel: PromptInjectionRiskLevel;
  blocked: boolean;
  markers: string[];
  boundaryNotes: string[];
}

export interface PromptSafetyReport {
  sanitized: SanitizedUserInput;
  injection: PromptInjectionAssessment;
  safeText: string;
  accepted: boolean;
}

export interface PromptSafetyOptions {
  maxLength?: number;
  blockCritical?: boolean;
}

const defaultMaxLength = 8_000;

const injectionPatterns: Array<[RegExp, string, PromptInjectionRiskLevel]> = [
  [/\bignore\s+(all\s+)?(previous|prior|above)\s+instructions\b/i, "ignore_previous_instructions", "critical"],
  [/\b(system|developer)\s+prompt\s+(override|leak|dump|reveal|print)\b/i, "system_prompt_attack", "critical"],
  [/\b(reveal|print|dump|leak|show)\s+(the\s+)?(system|developer)\s+prompt\b/i, "system_prompt_attack", "critical"],
  [/\bact\s+as\s+(system|developer|admin)\b/i, "role_escalation", "high"],
  [/\bdisregard\s+(the\s+)?(policy|rules|guardrails|instructions)\b/i, "policy_disregard", "high"],
  [/\btool\s*call\b.*\b(exfiltrate|leak|secret|token|password|api[_ -]?key)\b/i, "tool_exfiltration", "critical"],
  [/\b(?:api[_ -]?key|password|secret|token)\b.*\b(send|print|reveal|return|exfiltrate)\b/i, "secret_exfiltration", "critical"],
  [/<\s*script\b/i, "script_tag", "medium"],
  [/\beval\s*\(/i, "eval_call", "medium"],
  [/\bbase64\b.*\bdecode\b.*\bexecute\b/i, "encoded_execution", "high"]
];

function normalizeMaxLength(maxLength: number | undefined): number {
  if (maxLength === undefined) {
    return defaultMaxLength;
  }

  return Math.max(1, Math.floor(maxLength));
}

function compareRiskLevel(left: PromptInjectionRiskLevel, right: PromptInjectionRiskLevel): PromptInjectionRiskLevel {
  const order: Record<PromptInjectionRiskLevel, number> = {
    low: 0,
    medium: 1,
    high: 2,
    critical: 3
  };

  return order[left] >= order[right] ? left : right;
}

export function sanitizeUserInput(input: string, options: PromptSafetyOptions = {}): SanitizedUserInput {
  const maxLength = normalizeMaxLength(options.maxLength);
  const withoutControls = input.replace(/[^\S\r\n\t ]|[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  const sanitizedText = withoutControls.slice(0, maxLength);
  const truncated = withoutControls.length > maxLength;
  const removedControlCharacters = withoutControls.length !== input.length;
  const boundaryNotes: string[] = [];

  if (removedControlCharacters) {
    boundaryNotes.push("Control characters were removed before prompt assembly.");
  }

  if (truncated) {
    boundaryNotes.push("Input was truncated to the configured prompt safety limit.");
  }

  if (boundaryNotes.length === 0) {
    boundaryNotes.push("Input required no mechanical sanitization.");
  }

  return {
    originalLength: input.length,
    sanitizedText,
    truncated,
    removedControlCharacters,
    boundaryNotes
  };
}

export function assessPromptInjection(input: string, options: PromptSafetyOptions = {}): PromptInjectionAssessment {
  const markers = new Set<string>();
  let riskLevel: PromptInjectionRiskLevel = "low";

  for (const [pattern, marker, markerRisk] of injectionPatterns) {
    if (pattern.test(input)) {
      markers.add(marker);
      riskLevel = compareRiskLevel(riskLevel, markerRisk);
    }
  }

  const blockCritical = options.blockCritical ?? true;
  const blocked = blockCritical && riskLevel === "critical";
  const boundaryNotes =
    markers.size === 0
      ? ["No prompt-injection markers were detected by the deterministic guard."]
      : [
          "User or source text contains instruction-like content and must be treated as untrusted content.",
          "Detected text must not override system, developer, tool, schema, or validation boundaries."
        ];

  return {
    riskLevel,
    blocked,
    markers: [...markers],
    boundaryNotes
  };
}

export function preparePromptInput(input: string, options: PromptSafetyOptions = {}): PromptSafetyReport {
  const sanitized = sanitizeUserInput(input, options);
  const injection = assessPromptInjection(sanitized.sanitizedText, options);

  return {
    sanitized,
    injection,
    safeText: sanitized.sanitizedText,
    accepted: !injection.blocked
  };
}
