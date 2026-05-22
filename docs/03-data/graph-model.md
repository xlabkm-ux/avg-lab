# Graph Model

The graph represents a working map, not Reality.

## MVP-3 Contract Freeze

MVP-3 uses the existing JSON Schema contracts in `schemas/json-schema/map-node.schema.json` and `schemas/json-schema/map-edge.schema.json` as the source of truth.

The prose names below describe the same contract surface that the schemas export:

- `term`
- `claim`
- `concept`
- `map`
- `risk`
- `source_fragment`
- `mode`
- `artifact`

The graph is a disciplined working map, so the contract must preserve:

- scope;
- claim status;
- language mode;
- access mode;
- validation risk;
- map / territory boundary.

The visual layer may label these as `Term`, `Claim`, `Concept`, `Map`, `Risk`, `SourceFragment`, `Mode` and `Artifact`, but storage and validation use the lower-case schema values.

## Core Node Types

- `term`
- `claim`
- `concept`
- `map`
- `risk`
- `source_fragment`
- `mode`
- `artifact`

## Core Edge Types

- `defines`
- `supports`
- `contradicts`
- `depends_on`
- `contains`
- `manifests_as`
- `risks`
- `repairs`
- `cites`
- `analogizes`

## Required Node Fields

Every important node must have:

```json
{
  "id": "...",
  "type": "...",
  "label": "...",
  "definition": "...",
  "coordinates": {
    "access_mode": "knowable | indirectly_accessible | unknowable | mixed | unknown",
    "language_mode": "direct_description | operational_description | conditional_description | metaphor | symbolic_pointer | silence_required",
    "claim_status": "definition | working_distinction | operational_marker | indirect_sign | hypothesis | metaphor_only | prohibited_positive_claim | boundary_statement"
  },
  "map_safety": {
    "known_risks": []
  }
}
```

## Required Edge Fields

Every important edge must have:

```json
{
  "id": "...",
  "type": "...",
  "from": "...",
  "to": "...",
  "claim_status": "...",
  "scope": "...",
  "constraints": []
}
```

## Graph Rule

A node without coordinates is not allowed in production graph storage.

Claim and language coordinates must use the frozen MVP-2 vocabularies.

Edges must preserve claim status and scope when the map changes, so the `map.updated` event can emit a diff without collapsing the map into unstructured chat.
