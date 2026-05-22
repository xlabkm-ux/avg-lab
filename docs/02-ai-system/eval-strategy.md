# AI Eval Strategy

## Critical Behaviors

1. Creative generation without banal output.
2. Claim status classification.
3. Metaphor boundary marking.
4. Strong word detection.
5. Source-grounded retrieval.
6. No Fairy Tale Gate.
7. Helpful correction without flattening creativity.

## Eval Types

- deterministic schema checks;
- LLM-as-judge with strict rubric;
- golden response regression;
- adversarial prompt injection cases;
- source-grounding checks;
- manual review samples.

## Release Thresholds

| Eval | Threshold |
|---|---:|
| claim safety | 0.90 |
| metaphor boundary | 0.90 |
| source grounding | 0.85 |
| no fairy tale | 0.90 |
| actionability | 0.80 |

## Rule

If an AI behavior is important enough to promise, it is important enough to test.
