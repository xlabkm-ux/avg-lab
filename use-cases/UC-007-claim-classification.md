# UC-007: Claim Classification

## Summary

System classifies claims into appropriate status categories based on linguistic signals and content analysis.

## Actor

System (automated) — triggered when processing claims from dialogue or retrieval responses.

## Preconditions

1. User has submitted a thought or query
2. System has generated a structured response
3. Claims have been extracted from the response

## Main Flow

### Step 1: Submit Claim for Classification

**Action**: System receives a claim text for classification

**Input Examples**:
- "Memory is a library" (metaphor)
- "Working memory has a capacity of 7±2 items" (hypothesis)
- "Memory refers to the cognitive process of storing and retrieving information" (definition)

**Expected Result**:
- Claim text is analyzed for linguistic signals
- Classification algorithm evaluates patterns
- Status is assigned based on detected signals

**Verification**:
- [ ] Claim text is received
- [ ] Classification process executes
- [ ] Status is assigned

### Step 2: Classification — Definition

**Input**: "Memory refers to the cognitive process of storing and retrieving information"

**Expected Result**:
- Status: `definition`
- Reason: Factual definition using descriptive language
- Language Mode: `direct_description`

**Verification**:
- [ ] Status is correctly assigned as "definition"
- [ ] Language mode is correct

### Step 3: Classification — Working Distinction

**Input**: "Working memory differs from long-term memory in capacity and duration"

**Expected Result**:
- Status: `working_distinction`
- Reason: Differentiating between concepts
- Language Mode: `direct_description` or `conditional_description`

**Verification**:
- [ ] Status is correctly assigned as "working_distinction"

### Step 4: Classification — Hypothesis

**Input**: "Sleep improves memory consolidation by 40%"

**Expected Result**:
- Status: `hypothesis`
- Reason: Testable claim with measurable outcome
- Language Mode: `conditional_description`

**Verification**:
- [ ] Status is correctly assigned as "hypothesis"

### Step 5: Classification — Metaphor Only

**Input**: "The brain is a neural network"

**Expected Result**:
- Status: `metaphor_only`
- Reason: Metaphorical comparison, not literal fact
- Language Mode: `metaphor`

**Verification**:
- [ ] Status is correctly assigned as "metaphor_only"

### Step 6: Classification — Prohibited Positive Claim

**Input**: "This technique will always improve your memory"

**Expected Result**:
- Status: `prohibited_positive_claim`
- Reason: Unfalsifiable positive claim with absolute language
- Risk: `dogma` or `strong_word_substitution`

**Verification**:
- [ ] Status is correctly assigned as "prohibited_positive_claim"

### Step 7: Classification — Boundary Statement

**Input**: "This model is a simplification, not reality itself"

**Expected Result**:
- Status: `boundary_statement`
- Reason: Acknowledges map/territory distinction
- Language Mode: `direct_description`

**Verification**:
- [ ] Status is correctly assigned as "boundary_statement"

## All Claim Statuses

| Status | Description | Example |
|--------|-------------|---------|
| `definition` | Established definition | "Memory is the process of encoding, storing, and retrieving" |
| `working_distinction` | Working differentiation | "Explicit memory differs from implicit memory" |
| `hypothesis` | Testable claim | "Spaced repetition improves retention by 30%" |
| `metaphor_only` | Metaphorical statement | "Memory is like a muscle — it strengthens with use" |
| `prohibited_positive_claim` | Unfalsifiable positive | "This will guarantee perfect recall" |
| `boundary_statement` | Map/territory note | "This model is a projection, not reality" |
| `structural_constraint` | System limitation | "Working memory capacity is limited to 7±2 chunks" |
| `process_description` | How something works | "Memory consolidation occurs during sleep" |

## All Language Modes

| Mode | Description | Signals |
|------|-------------|---------|
| `direct_description` | Direct statement | Declarative sentences |
| `operational` | Operational definition | Measurable terms |
| `conditional_description` | Conditional statement | "If...then", "may", "might" |
| `metaphor` | Metaphorical language | "is like", "as", analogies |
| `symbolic` | Symbolic representation | Mathematical, formal notation |
| `silence` | Intentional silence | No claim made |

## Alternative Flows

### AF-001: Ambiguous Classification

**Scenario**: Claim contains mixed signals

**Expected Result**:
- System assigns most likely status
- Confidence indicator may be lower
- Risk assessment may flag uncertainty

### AF-002: Empty or Null Input

**Scenario**: Empty claim text submitted

**Expected Result**:
- Classification returns `silence` or error
- No status assigned
- Handled gracefully

## Related Components

### Source Files
- `packages/avg-validation/src/index.ts` — `classifyClaimDiscipline()`
- `packages/avg-schemas/src/index.ts` — Claim type definitions

### Test Files
- `packages/avg-validation/tests/claim-classification.test.ts` — Classification tests (3 tests)
- `packages/avg-validation/tests/claim-validation.test.ts` — Validation tests

## Acceptance Criteria

- [ ] All claim statuses can be correctly assigned
- [ ] Linguistic signals are detected accurately
- [ ] Language modes are identified correctly
- [ ] Ambiguous cases handled gracefully
- [ ] Empty input handled gracefully

## Test Status

| Date | Tester | Result | Notes |
|------|--------|--------|-------|
| | | ⬜ Pass / ⬜ Fail | |
