# Codex Cloud Task Setup

Before launching a Codex Cloud task:

1. Assign one owner agent.
2. Provide one context pack.
3. Provide target files.
4. Specify tests to run.
5. Mark parallel safety level.
6. Ask for PR with risk and rollback notes.

Example prompt:

```text
You are the Validation Agent. Work only on packages/avg-validation and tests/ai-evals/claim-safety. Implement AVG-219. Do not change schemas unless you open an ADR.
```
