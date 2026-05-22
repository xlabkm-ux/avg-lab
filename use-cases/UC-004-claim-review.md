# UC-004: Claim Review

## Summary

User reviews validated claims with status badges, risk markers, and repair suggestions.

## Actor

User reviewing claims generated from dialogue or retrieval responses.

## Preconditions

1. User has created a project (UC-001)
2. User has navigated to Claim Review surface (UC-002)
3. Claim Review Panel is displayed with sample claims

## Main Flow

### Step 1: View Claims List

**Action**: User observes the Claim Review Panel

**Expected Result**:
- List of claims is displayed
- Each claim shows:
  - Claim statement (text)
  - Status badge (color-coded)
  - Language mode badge (color-coded)
  - Expand/collapse button (chevron icon)
- Claims with risks are visually highlighted (CSS class `has-risks`)
- Claims needing repair are highlighted (CSS class `needs-repair`)

**Status Badges**:
| Status | Color | Meaning |
|--------|-------|---------|
| Definition | Blue | Established definition |
| Working Distinction | Light Blue | Working differentiation |
| Hypothesis | Yellow | Testable hypothesis |
| Metaphor Only | Purple | Metaphorical statement |
| Prohibited Positive Claim | Red | Unfalsifiable positive claim |
| Boundary Statement | Gray | Map/territory boundary note |

**Language Mode Badges**:
| Mode | Color | Meaning |
|------|-------|---------|
| Direct Description | Green | Direct statement |
| Operational | Blue | Operational definition |
| Conditional Description | Yellow | Conditional statement |
| Metaphor | Purple | Metaphorical language |
| Symbolic | Pink | Symbolic representation |
| Silence | Gray | Intentional silence |

**Verification**:
- [ ] Claims list is visible
- [ ] Each claim has status and language mode badges
- [ ] Badges are color-coded correctly
- [ ] Claims with risks are visually distinct
- [ ] Expand buttons are visible

### Step 2: Expand Claim Details

**Action**: User clicks the expand button on a claim

**Expected Result**:
- Claim expands to show detailed information:
  - Full claim statement
  - **Risks Section** (if any):
    - List of identified risks
    - Risk descriptions and markers
  - **Repair Suggestions** (if applicable):
    - Suggested rephrasing
    - Reason for repair
  - **Scope**: What the claim covers
  - **Source References**: Where the claim originated

**Verification**:
- [ ] Claim expands smoothly
- [ ] Risks section displays (or hides if none)
- [ ] Repair suggestions display (or hide if none)
- [ ] Scope is visible
- [ ] Source references are visible (or hide if none)

### Step 3: Review Risk Markers

**Action**: User examines risk markers on a claim with risks

**Expected Result**:
- Risk markers are listed with descriptions
- Each risk has a type:
  - `strong_word_substitution`: Uses absolute terms (always, never, guarantee)
  - `map_territory_substitution`: Confuses model with reality (real, truth, essence)
  - `social_confirmation_as_proof`: Appeals to consensus (everyone agrees)
  - `reductionism`: Oversimplifies (simple, only, just + complex topic)
  - `sign_to_entity_substitution`: Word/term is/means confusion
  - `fairy_tale`: Metaphor presented as fact
  - `dogma`: Unfalsifiable positive claim
- Risk level is indicated (LOW/MEDIUM/HIGH/CRITICAL)

**Verification**:
- [ ] Risk markers are clearly displayed
- [ ] Risk types are labeled
- [ ] Risk levels are indicated

### Step 4: Review Repair Suggestions

**Action**: User examines repair suggestions for a risky claim

**Expected Result**:
- Suggested rephrasing is displayed
- Reason for repair is explained
- Suggestion maintains the original intent while reducing risk

**Verification**:
- [ ] Repair suggestion is visible
- [ ] Reason for repair is explained
- [ ] Suggestion is understandable

### Step 5: Collapse Claim

**Action**: User clicks the collapse button on an expanded claim

**Expected Result**:
- Claim collapses to summary view
- Status and language mode badges remain visible
- Risk indicators remain visible (summary form)

**Verification**:
- [ ] Claim collapses smoothly
- [ ] Summary view is correct

## Alternative Flows

### AF-001: Empty Claims List

**Scenario**: No claims to review

**Expected Result**:
- Empty state message: "No claims to review"
- Placeholder or instructional text may be shown

**Verification**:
- [ ] Empty state displays correctly

### AF-002: Claim with Multiple Risks

**Scenario**: A claim has multiple risk markers

**Expected Result**:
- All risks are listed
- Each risk has its own description
- Overall risk level reflects the highest individual risk

**Verification**:
- [ ] Multiple risks display correctly
- [ ] Overall risk level is correct

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Very long claim statement | Text wraps or scrolls within claim card |
| Claim with no metadata | Handles gracefully (shows "Unknown" or omits) |
| Rapid expand/collapse | Transitions work smoothly |
| Claims with special characters | Renders correctly |

## Related Components

### Source Files
- `apps/web/src/components/ClaimReviewPanel.tsx` — Main panel (ClaimCard, ClaimStatusBadge, LanguageModeBadge, RiskBadge)
- `packages/avg-schemas/src/index.ts` — Claim type definitions
- `packages/avg-validation/src/index.ts` — `classifyClaimRisk()`, `validateClaimContract()`

### Test Files
- `apps/web/tests/components/ClaimReviewPanel.test.tsx` — Component tests (5 tests)
- `packages/avg-validation/tests/claim-validation.test.ts` — Validation tests
- `packages/avg-validation/tests/claim-risk.test.ts` — Risk assessment tests
- `packages/avg-validation/tests/claim-classification.test.ts` — Classification tests

### E2E Test
- `e2e/tests/claim-review.spec.ts`

## Acceptance Criteria

- [ ] Claims list displays with status and language mode badges
- [ ] Claims are expandable/collapsible
- [ ] Risk markers display correctly
- [ ] Repair suggestions show when applicable
- [ ] Empty state handles gracefully
- [ ] Visual distinction for risky claims
- [ ] All badge types render with correct colors

## Test Status

| Date | Tester | Result | Notes |
|------|--------|--------|-------|
| | | ⬜ Pass / ⬜ Fail | |
