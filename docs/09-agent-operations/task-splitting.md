# Task Splitting

Good Codex tasks are small, testable and bounded.

## Bad Task

"Build the whole validation system."

## Good Tasks

1. Add ClaimStatus schema.
2. Add claim validator unit tests.
3. Add metaphor boundary eval fixtures.
4. Add risk badge UI.
5. Add API endpoint for claim validation.

## Splitting Heuristic

A task is too large if it changes more than three bounded contexts or requires more than one PR.
