# packages/avg-security

Auth, access control, prompt injection defense and tool policies.

## Ownership

See `.codex/agent-registry.md`.

## Required Quality

- TypeScript strict mode.
- Unit tests for pure logic.
- Contract tests for public schemas.
- README updated when public behavior changes.

## Current Public API

- `sanitizeUserInput` removes unsafe control characters and applies a deterministic length limit before prompt assembly.
- `assessPromptInjection` detects instruction override, role escalation, tool exfiltration and executable-content markers.
- `preparePromptInput` combines sanitization and injection assessment into one typed safety report.

## Contract Notes

- user and retrieved text remain untrusted content;
- critical instruction-override attempts are blocked by default;
- non-critical risks remain visible as markers and boundary notes instead of being silently rewritten;
- this package is deterministic and does not call an LLM.
