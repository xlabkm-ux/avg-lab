# Threat Model

## Assets

- user documents;
- project memory;
- graph data;
- prompts;
- OpenAI keys;
- generated artifacts;
- audit logs.

## Threats

- prompt injection through uploaded documents;
- malicious tool calls;
- data leakage through logs;
- overbroad project access;
- unvalidated structured output;
- dependency compromise;
- agent writing unsafe code.

## Mitigations

- separate source content from instructions;
- typed tool calls;
- allowlisted tools;
- schema validation;
- audit logs;
- secret scanning;
- role-based access;
- sandboxed agent execution.
