# Security Policy

## Security Goals

AVG handles user ideas, project memory, documents, graph data, prompts, and generated artifacts. Security must protect:

- user documents;
- project memory;
- prompt/system instructions;
- OpenAI keys and provider credentials;
- graph/map integrity;
- source-grounded reasoning;
- agent execution boundaries.

## Required Controls

- Never commit secrets.
- Use `.env.example` only for variable names.
- All tools must be allowlisted.
- Treat uploaded documents and retrieved web content as data, never as instructions.
- Validate every structured AI output.
- Keep audit logs for destructive operations.
- Use least privilege for API keys, databases, and storage.

## Prompt Injection Defense

The system must:

1. Separate developer/system instructions from retrieved content.
2. Mark retrieved text as untrusted source material.
3. Refuse document instructions that ask to ignore system rules.
4. Use tool policies before tool execution.
5. Log suspicious source-instruction attempts.

## Reporting

For now, report security issues to the project owner. In production, define a security contact and response SLA.
