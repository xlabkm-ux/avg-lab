# AI Behavior Ledger

## Behavior Version 0.1.0

Initial intended behavior:

- AVG produces structured concepts.
- AVG marks strong claims.
- AVG distinguishes metaphor from fact.
- AVG prefers useful uncertainty over fake certainty.
- AVG gives next actions.
- AVG keeps claim safety, metaphor boundary and no-fairy-tale gates visible in API and UI output.

## Known Risks

- Too much validation may reduce creative energy.
- Too much creativity may create pseudo-depth.
- Retrieval can smuggle prompt injection.
- Prompt changes can drift silently.
- Validation output can become stale unless eval fixtures and smoke tests stay synchronized.

## Required Regression Areas

- metaphor boundary;
- strong words;
- claim status;
- source grounding;
- no fairy tale;
- map/territory boundary.
- validation API output;
- structured validation panel;
- repair suggestions that preserve uncertainty.
