# Claim Validation Contract

## Status

Frozen for Sprint 3 / MVP-2 Validation Core.

## Purpose

This contract defines the stable baseline for claim extraction and schema validation before Sprint 3 implementation work continues.

## Source of Truth

- `schemas/json-schema/claim.schema.json`
- `knowledge/vocabularies/claim-statuses.json`
- `knowledge/vocabularies/language-modes.json`
- `knowledge/vocabularies/adequacy-risks.json`
- `knowledge/validation-rules/map-territory-rules.json`

## Frozen Claim Shape

The validated claim object has these fields:

- `id`
- `statement`
- `claim_status`
- `language_mode`
- `scope` optional
- `risks`
- `repair` optional
- `source_refs` optional

## Frozen Enum Baseline

### Claim Status

- `definition`
- `working_distinction`
- `operational_marker`
- `indirect_sign`
- `hypothesis`
- `metaphor_only`
- `prohibited_positive_claim`
- `boundary_statement`

### Language Mode

- `direct_description`
- `operational_description`
- `conditional_description`
- `metaphor`
- `symbolic_pointer`
- `silence_required`

## Acceptance Rule

A claim is in contract when:

- it passes `claim.schema.json`;
- its scope is explicit when needed for the claim type;
- its language mode does not hide metaphor as fact;
- its risks keep the map/territory boundary visible.

## Validation Boundary

The frozen contract allows validators to:

- report schema violations;
- report boundary risks;
- add repair notes that preserve uncertainty;
- classify claims only within the frozen enum set.

The frozen contract does not allow validators to:

- invent new public claim statuses;
- invent new public language modes;
- remove claim scope or repair information from the validated shape;
- blur map/territory boundaries in the name of cleanup.

## Out of Scope For This Freeze

- ranking or scoring systems for claim quality;
- new enum values for claim status or language mode;
- public repair taxonomy expansion;
- visual validation UX changes.

## Sprint 3 Dependency

This freeze unblocks `AVG-302` and the later Sprint 3 validation tasks.
