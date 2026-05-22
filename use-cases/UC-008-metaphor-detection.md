# UC-008: Metaphor Detection

## Summary

System detects when metaphors are presented as facts and flags them as risks with repair suggestions.

## Actor

System (automated) — triggered during claim validation and risk assessment.

## Preconditions

1. User has submitted a thought or query
2. System has generated claims from the response
3. Claims are being validated and assessed for risks

## Main Flow

### Step 1: Submit Metaphor as Fact

**Input**: "The mind is a computer"

**Context**: Claim has status `fact` or is presented as literal truth

**Expected Result**:
- Risk detector identifies metaphor-as-fact pattern
- Risk type: `fairy_tale`
- Risk level: `HIGH` or `CRITICAL`
- Repair suggestion provided
- Claim status may be reclassified to `metaphor_only`

**Verification**:
- [ ] `fairy_tale` risk is flagged
- [ ] Risk level is HIGH or CRITICAL
- [ ] Repair suggestion is generated

### Step 2: Risk Detection — Strong Word Substitution

**Input**: "This technique will **always** improve your memory"

**Expected Result**:
- Risk type: `strong_word_substitution`
- Trigger words: always, never, guarantee, absolutely, definitely
- Risk level: `MEDIUM` or `HIGH`
- Repair suggestion: "This technique may improve memory" or "Studies show this technique improved memory in X% of cases"

**Verification**:
- [ ] Risk type is correctly identified
- [ ] Trigger words are flagged
- [ ] Repair suggestion removes absolute language

### Step 3: Risk Detection — Map/Territory Substitution

**Input**: "This model **is** the truth about how memory works"

**Expected Result**:
- Risk type: `map_territory_substitution`
- Trigger words: real, truth, reality, essence, actual, literally
- Risk level: `HIGH`
- Repair suggestion: "This model describes patterns in how memory works" or "This model is a useful projection, not reality itself"

**Verification**:
- [ ] Risk type is correctly identified
- [ ] Boundary violation flagged
- [ ] Repair suggestion restores map/territory distinction

### Step 4: Risk Detection — Social Confirmation as Proof

**Input**: "**Everyone agrees** that spaced repetition works"

**Expected Result**:
- Risk type: `social_confirmation_as_proof`
- Trigger patterns: everyone agrees, consensus, widely accepted, studies prove
- Risk level: `MEDIUM`
- Repair suggestion: "Research suggests spaced repetition is effective" or cite specific studies

**Verification**:
- [ ] Risk type is correctly identified
- [ ] Social proof pattern detected
- [ ] Repair suggestion requests evidence

### Step 5: Risk Detection — Reductionism

**Input**: "Memory is **simply** a matter of neural connections"

**Expected Result**:
- Risk type: `reductionism`
- Trigger patterns: simply, only, just, merely + complex topic
- Risk level: `MEDIUM`
- Repair suggestion: "Memory involves neural connections among other factors"

**Verification**:
- [ ] Risk type is correctly identified
- [ ] Reductionist language flagged
- [ ] Repair suggestion acknowledges complexity

### Step 6: Risk Detection — Sign to Entity Substitution

**Input**: "The word 'memory' **means** the cognitive process"

**Expected Result**:
- Risk type: `sign_to_entity_substitution`
- Trigger patterns: word/term is/means, defines as entity
- Risk level: `LOW` or `MEDIUM`
- Repair suggestion: "The term 'memory' refers to..." or "We use 'memory' to describe..."

**Verification**:
- [ ] Risk type is correctly identified
- [ ] Confusion of word with entity flagged
- [ ] Repair suggestion clarifies distinction

### Step 7: Risk Detection — Dogma

**Input**: "This approach will positively transform your thinking"

**Expected Result**:
- Risk type: `dogma`
- Pattern: Unfalsifiable positive claim
- Risk level: `HIGH`
- Claim status: `prohibited_positive_claim`
- Repair suggestion: Specific, testable claim or remove

**Verification**:
- [ ] Risk type is correctly identified
- [ ] Dogma pattern detected
- [ ] Claim status updated

### Step 8: View Risk Report

**Action**: User views the risk report for a claim

**Expected Result**:
- All detected risks are listed
- Each risk shows:
  - Risk type
  - Risk level
  - Description of the pattern
  - Repair suggestion
- Overall risk level reflects the highest individual risk

**Verification**:
- [ ] All risks display correctly
- [ ] Risk levels are accurate
- [ ] Repair suggestions are helpful

## All Risk Types

| Risk Type | Description | Example Trigger | Severity |
|-----------|-------------|-----------------|----------|
| `fairy_tale` | Metaphor presented as fact | "The mind is a computer" (as fact) | CRITICAL |
| `dogma` | Unfalsifiable positive claim | "This will transform you" | HIGH |
| `strong_word_substitution` | Absolute language | always, never, guarantee | MEDIUM-HIGH |
| `map_territory_substitution` | Confusing model with reality | truth, reality, essence | HIGH |
| `social_confirmation_as_proof` | Appeal to consensus | everyone agrees, consensus | MEDIUM |
| `reductionism` | Oversimplification | simply, only, just + complexity | MEDIUM |
| `sign_to_entity_substitution` | Word/entity confusion | word means, term is | LOW-MEDIUM |

## Alternative Flows

### AF-001: Multiple Risks in One Claim

**Scenario**: A claim triggers multiple risk patterns

**Expected Result**:
- All risks are detected and listed
- Overall risk level is the highest individual risk
- Each risk has its own repair suggestion

### AF-002: No Risks Detected

**Scenario**: Claim is clean of risk patterns

**Expected Result**:
- No risk markers displayed
- Claim passes validation
- Risk section is hidden or shows "No risks detected"

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Metaphor explicitly marked as metaphor | No `fairy_tale` risk (correct usage) |
| Conditional language mitigates risk | Lower risk level ("may be like") |
| Quoted metaphor (attributed) | Lower risk or no risk |
| Technical metaphor (established) | May be acceptable in context |

## Related Components

### Source Files
- `packages/avg-validation/src/index.ts` — `classifyClaimRisk()`
- `packages/avg-schemas/src/index.ts` — Risk type definitions
- `packages/avg-evals/tests/no-fairy-tale.test.ts` — Metaphor detection evals

### Test Files
- `packages/avg-validation/tests/claim-risk.test.ts` — Risk assessment tests (2 tests)
- `packages/avg-evals/tests/no-fairy-tale.test.ts` — AI eval tests
- `packages/avg-evals/tests/fixtures.test.ts` — Eval fixtures

## Acceptance Criteria

- [ ] All 7 risk types are correctly detected
- [ ] Risk levels are assigned appropriately
- [ ] Repair suggestions are helpful and actionable
- [ ] Metaphor-as-fact is flagged as CRITICAL
- [ ] Multiple risks in one claim are all detected
- [ ] Clean claims pass without false positives

## Test Status

| Date | Tester | Result | Notes |
|------|--------|--------|-------|
| | | ⬜ Pass / ⬜ Fail | |
