# Agentic Flow

## Single Request Pipeline

```text
1. classify_intent
2. select_modes
3. build_context
4. plan_tool_calls
5. retrieve_memory_and_sources
6. generate_variants
7. synthesize_answer
8. extract_claims
9. validate_claims
10. compose_response
11. update_project_memory
12. emit_observability_events
```

## Agent Roles in Runtime

- Orchestrator Agent: decides flow.
- Creative Agent: creates variants.
- Methodologist Agent: enforces map discipline.
- Claim Validator Agent: classifies claims.
- Critic Agent: attacks weak assumptions.
- Editor Agent: produces polished artifact.
- Retrieval Agent: brings sources.

## Tool Policy

Tools must be typed, allowlisted, logged and testable.
