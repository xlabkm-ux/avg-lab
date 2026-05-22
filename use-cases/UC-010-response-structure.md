# UC-010: Response Structure

## Summary

System generates structured responses with complete validation metadata for every user interaction.

## Actor

System (automated) — triggered after processing user input through agent modes.

## Preconditions

1. User has submitted input to the system
2. System has processed input through mode routing (UC-009)
3. Response is being composed with validation metadata

## Main Flow

### Step 1: Receive Structured Response

**Action**: System returns a structured response object

**Expected Result**:
Response object contains all required fields:

```typescript
{
  summary: string;              // Main response text
  claim_status: string;         // Classification status
  language_mode: string;        // Language mode used
  validation_risk: string;      // Overall risk level
  map_territory_boundary: string; // Boundary statement
  scope: string;                // What the response covers
  risks: RiskMarker[];          // Identified risks (if any)
  next_action: string;          // Suggested next step
  source_references: string[];  // Evidence sources (if any)
}
```

**Verification**:
- [ ] Response object is complete
- [ ] All required fields are present
- [ ] Field values are non-empty (except optional fields)

### Step 2: Verify claim_status Field

**Expected Values**:
- `definition`
- `working_distinction`
- `hypothesis`
- `metaphor_only`
- `prohibited_positive_claim`
- `boundary_statement`
- `structural_constraint`
- `process_description`

**Expected Result**:
- `claim_status` is one of the valid values
- Status matches the content analysis

**Verification**:
- [ ] claim_status is valid
- [ ] Status is appropriate for response content

### Step 3: Verify language_mode Field

**Expected Values**:
- `direct_description`
- `operational`
- `conditional_description`
- `metaphor`
- `symbolic`
- `silence`

**Expected Result**:
- `language_mode` is one of the valid values
- Mode matches the language used in response

**Verification**:
- [ ] language_mode is valid
- [ ] Mode is appropriate for response content

### Step 4: Verify validation_risk Field

**Expected Values**:
- `LOW` — No significant risks detected
- `MEDIUM` — Minor risks present
- `HIGH` — Significant risks detected
- `CRITICAL` — Severe risk violations (e.g., metaphor-as-fact)

**Expected Result**:
- `validation_risk` is one of the valid values
- Risk level matches the risk assessment

**Verification**:
- [ ] validation_risk is valid
- [ ] Risk level is appropriate

### Step 5: Verify map_territory_boundary Field

**Expected Content**:
- Statement acknowledging the model/reality distinction
- Examples:
  - "The map is a working projection, not Reality"
  - "This model describes patterns, not truth itself"
  - "This is a useful simplification, not the complete picture"

**Expected Result**:
- `map_territory_boundary` is present and non-empty
- Statement is contextually appropriate

**Verification**:
- [ ] Boundary statement is present
- [ ] Statement is meaningful

### Step 6: Verify scope Field

**Expected Content**:
- Description of what the response covers
- Examples:
  - "This response addresses general memory concepts"
  - "This analysis covers the specific claim provided"
  - "This exploration is limited to the requested topic"

**Expected Result**:
- `scope` is present and non-empty
- Scope clearly defines response boundaries

**Verification**:
- [ ] Scope is present
- [ ] Scope is clear and appropriate

### Step 7: Verify risks Field (if present)

**Expected Content** (when risks exist):
```typescript
risks: [
  {
    type: string;        // Risk type (e.g., "fairy_tale")
    level: string;       // Risk level (LOW/MEDIUM/HIGH/CRITICAL)
    description: string; // What the risk is
    repair?: string;     // How to fix it
  }
]
```

**Expected Result**:
- `risks` array is present (may be empty)
- Each risk has required fields
- Risk types are valid

**Verification**:
- [ ] risks array is present
- [ ] Each risk has type, level, description
- [ ] Risk types are valid

### Step 8: Verify next_action Field

**Expected Content**:
- Suggested next step for the user
- Examples:
  - "Consider reviewing the identified risks"
  - "Explore this concept further in the Map view"
  - "Register documents to support this claim with evidence"

**Expected Result**:
- `next_action` is present and non-empty
- Suggestion is contextually appropriate

**Verification**:
- [ ] next_action is present
- [ ] Suggestion is helpful

### Step 9: Verify source_references Field (if present)

**Expected Content** (when evidence exists):
```typescript
source_references: [
  "Document: memory-basics.md, section: Working Memory",
  "Research: Baddeley (2012) - Working Memory"
]
```

**Expected Result**:
- `source_references` array is present (may be empty)
- Each reference identifies a source

**Verification**:
- [ ] source_references array is present (if applicable)
- [ ] References are identifiable

## Response Validation Checklist

Every response MUST have:
- [ ] `summary` — Non-empty response text
- [ ] `claim_status` — Valid status value
- [ ] `language_mode` — Valid language mode
- [ ] `validation_risk` — Valid risk level
- [ ] `map_territory_boundary` — Boundary statement
- [ ] `scope` — Response scope
- [ ] `next_action` — Suggested next step

Every response MAY have:
- [ ] `risks` — Risk markers (empty if no risks)
- [ ] `source_references` — Evidence sources (empty if none)

## Alternative Flows

### AF-001: Response with No Risks

**Scenario**: Clean response with no risk patterns

**Expected Result**:
- `risks` array is empty: `[]`
- `validation_risk` is `LOW`
- Risk section may be hidden in UI

### AF-002: Response with Missing Optional Fields

**Scenario**: Response has no source references

**Expected Result**:
- `source_references` is empty array: `[]`
- Response is still valid (optional fields)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Response generation fails | Error response with visible error message |
| Response is empty | Error: "No response generated" |
| Response missing required fields | Validation error, response rejected |
| Response has invalid status value | Validation error |
| Response has unknown risk type | Validation error |

## Related Components

### Source Files
- `packages/avg-agents/src/index.ts` — `composeStructuredResponse()`
- `packages/avg-schemas/src/index.ts` — `AvgStructuredResponse` type
- `packages/avg-validation/src/index.ts` — `composeGroundedResponse()`
- `apps/web/src/components/GroundedResponsePanel.tsx` — Response display

### Test Files
- Contract tests in `packages/avg-schemas/tests/contract.test.ts`
- Integration tests in `apps/web/tests/web.test.ts`
- API contract tests in `apps/api/tests/api.contract.test.ts`

## Acceptance Criteria

- [ ] Every response includes all required fields
- [ ] All field values are valid
- [ ] Response passes schema validation
- [ ] Optional fields handled gracefully when absent
- [ ] Invalid responses are rejected
- [ ] Error responses display visible errors

## Test Status

| Date | Tester | Result | Notes |
|------|--------|--------|-------|
| | | ⬜ Pass / ⬜ Fail | |
