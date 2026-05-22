# Risk Radar

| Risk | Severity | Owner | Mitigation |
|---|---:|---|---|
| Prompt drift | high | Validation Agent | AI behavior ledger + prompt regression evals |
| Shared schema conflict | high | Architect Agent | schema freeze windows |
| Metaphor as fact | high | Validation Agent | No Fairy Tale Gate |
| Over-complex MVP | medium | Product/Architect | enforce MVP milestones |
| Retrieval hallucination | high | Retrieval/QA | source-grounding evals |
| Agent branch sprawl | medium | Architect | branches live < 48h |
| Weak observability | medium | DevOps | Langfuse + OpenTelemetry from MVP |
| Context overload | medium | Architect/QA | context budget in every task card, yellow/red handoff summaries |
| Premature graph/UI complexity | medium | Product/Architect | defer MVP-3 until MVP-2 exits |
| Contract-first bottleneck | medium | Architect | keep contracts minimal and freeze in small batches |
