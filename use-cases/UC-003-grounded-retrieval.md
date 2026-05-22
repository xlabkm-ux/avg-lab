# UC-003: Grounded Retrieval

## Summary

User asks questions against registered documents and receives evidence-backed answers with citations.

## Actor

User with an active project who wants to query document evidence.

## Preconditions

1. User has created a project (UC-001)
2. User has navigated to Retrieval surface (UC-002)
3. Grounded Retrieval Flow interface is displayed
4. Documents may be registered (optional — sample data used if none registered)

## Main Flow

### Step 1: Enter Question

**Action**: User types a question in the text area

**Example Questions**:
- "How does memory work?"
- "What evidence supports this claim?"
- "What are the key concepts in this project?"

**Expected Result**:
- Text area accepts input
- "Ask with evidence" button becomes enabled (if text is present)
- Character count may be visible

**Verification**:
- [ ] Text area accepts input
- [ ] Submit button enables when text is entered
- [ ] Input is visible and editable

### Step 2: Submit Question

**Action**: User clicks "Ask with evidence" button

**Expected Result**:
- Interface transitions to **loading** state
- Submit button is disabled during loading
- Loading indicator is visible
- System sends query to `/api/projects/{projectId}/retrieval/grounded-flow`

**Verification**:
- [ ] Loading state is displayed
- [ ] Submit button is disabled
- [ ] Loading indicator is visible

### Step 3: View Retrieval Results

**Action**: System returns retrieval results

**Expected Result**:
- Interface transitions to **ready** state
- Results are displayed in two panels:
  - **Citation Panel** (left/top): List of retrieval hits with confidence
  - **Response Panel** (right/bottom): Grounded answer with metadata

**Citation Panel Shows**:
- List of retrieval hits
- Each hit displays:
  - Source label
  - Confidence score (0-1)
  - Confidence badge (none/low/medium/high)
  - Snippet text (truncated to 150 chars when collapsed)

**Response Panel Shows**:
- Response summary text
- Claim status badge (Definition/Hypothesis/Metaphor Only/etc.)
- Language mode badge (Direct/Conditional/Metaphor/etc.)
- Validation risk badge (LOW/MEDIUM/HIGH/CRITICAL)
- Map/territory boundary statement
- Risk markers list (if any risks detected)
- Scope indicator
- Next action suggestion

**Verification**:
- [ ] Citation panel displays retrieval hits
- [ ] Confidence badges show correct levels
- [ ] Response panel displays answer
- [ ] All metadata badges are visible
- [ ] Boundary statement is present
- [ ] Risk markers display if applicable

### Step 4: Review Evidence

**Action**: User reviews the evidence and response

**Expected Result**:
- User can scroll through citations
- User can expand/collapse individual citations
- Response is clearly separated from evidence
- Validation metadata is prominent

**Verification**:
- [ ] Citations are scrollable
- [ ] Response is readable
- [ ] Metadata is visible and understandable

## Alternative Flows

### AF-001: Empty Question

**Scenario**: User clicks submit with empty text area

**Expected Result**:
- Submit button is disabled (cannot submit empty query)
- OR error message: "Please enter a question"

**Verification**:
- [ ] Empty submission is prevented

### AF-002: No Evidence Found

**Scenario**: Query returns no matching documents

**Expected Result**:
- Interface shows **missing_evidence** state
- Message: "No evidence found for this query"
- Citation panel shows empty state
- Response panel may show boundary warning

**Verification**:
- [ ] Missing evidence state is displayed
- [ ] User receives clear feedback

### AF-003: API Error

**Scenario**: Retrieval API fails (network error, server down)

**Expected Result**:
- Interface transitions to **error** state
- Error message is displayed: "Failed to retrieve evidence"
- User can retry the query
- Error is logged visibly (not silently failing)

**Verification**:
- [ ] Error state is displayed
- [ ] Error message is clear
- [ ] Retry option is available

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Very long question | Text area expands or scrolls |
| Special characters in query | Query handles correctly |
| Rapid multiple submissions | Only one query processes at a time |
| Network timeout | Error state after timeout period |
| API returns malformed response | Error handled gracefully |

## Related Components

### Source Files
- `apps/web/src/components/GroundedRetrievalFlow.tsx` — Main retrieval interface
- `apps/web/src/components/CitationPanel.tsx` — Citation display
- `apps/web/src/components/GroundedResponsePanel.tsx` — Response with metadata
- `packages/avg-validation/src/index.ts` — `composeGroundedResponse()`

### Test Files
- Unit tests in related packages
- Component tests for panels

### E2E Test
- `e2e/tests/grounded-retrieval.spec.ts`

## Acceptance Criteria

- [ ] Question input accepts text
- [ ] Submit button enables/disables correctly
- [ ] Loading state displays during query
- [ ] Retrieval hits show with confidence badges
- [ ] Grounded response displays with all metadata
- [ ] Error states handle gracefully
- [ ] No silent failures — all errors visible

## Test Status

| Date | Tester | Result | Notes |
|------|--------|--------|-------|
| | | ⬜ Pass / ⬜ Fail | |
