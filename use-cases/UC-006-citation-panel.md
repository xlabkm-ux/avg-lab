# UC-006: Citation Panel

## Summary

User reviews, filters, and interacts with citations from grounded retrieval results.

## Actor

User reviewing evidence citations after submitting a retrieval query.

## Preconditions

1. User has created a project (UC-001)
2. User has submitted a query via Grounded Retrieval (UC-003)
3. Retrieval results are displayed with citation panel visible

## Main Flow

### Step 1: View Citations List

**Action**: User observes the citation panel after retrieval

**Expected Result**:
- List of retrieval hits is displayed
- Each citation shows:
  - **Source Label**: Identifies the document/section
  - **Confidence Score**: Numeric value (0-1)
  - **Confidence Badge**: Color-coded (none/low/medium/high)
  - **Snippet Text**: Preview of matched content (truncated to 150 chars when collapsed)
  - **Expand Button**: Chevron icon to expand/collapse

**Confidence Badge Colors**:
| Confidence | Color | Score Range |
|------------|-------|-------------|
| None | Gray | 0 |
| Low | Red | 0.1 - 0.3 |
| Medium | Yellow/Orange | 0.4 - 0.7 |
| High | Green | 0.8 - 1.0 |

**Verification**:
- [ ] Citations list is visible
- [ ] Each citation shows source label
- [ ] Confidence badges display correctly
- [ ] Snippet text is truncated (150 chars)
- [ ] Expand buttons are visible

### Step 2: Filter by Confidence Level

**Action**: User selects a confidence filter from dropdown

**Expected Result**:
- Dropdown shows options:
  - All
  - High
  - Medium
  - Low
- Selecting a filter updates the citation list
- Only citations matching the selected confidence level are shown
- Citation count updates (e.g., "3 of 8 citations")

**Verification**:
- [ ] Filter dropdown is accessible
- [ ] All filter options are available
- [ ] Filtering updates the list correctly
- [ ] Citation count updates

### Step 3: Expand Citation

**Action**: User clicks on a collapsed citation to expand it

**Expected Result**:
- Citation expands to show full text
- Full text is displayed (not truncated)
- "Copy snippet" button becomes visible
- Citation remains expanded until collapsed

**Verification**:
- [ ] Citation expands smoothly
- [ ] Full text is visible
- [ ] Copy button appears

### Step 4: Copy Snippet to Clipboard

**Action**: User clicks the "Copy snippet" button on an expanded citation

**Expected Result**:
- Snippet text is copied to clipboard
- Visual feedback confirms copy (button text changes or toast notification)
- Copied text can be pasted elsewhere

**Verification**:
- [ ] Copy button is functional
- [ ] Visual feedback is provided
- [ ] Text is actually copied (test by pasting)

### Step 5: Collapse Citation

**Action**: User clicks on an expanded citation to collapse it

**Expected Result**:
- Citation collapses back to truncated view (150 chars)
- Copy button is hidden
- Citation returns to summary state

**Verification**:
- [ ] Citation collapses smoothly
- [ ] Truncated text displays correctly

## Alternative Flows

### AF-001: No Citations

**Scenario**: Retrieval returns no citations

**Expected Result**:
- Empty state message: "No citations found"
- Citation panel shows placeholder or empty state

**Verification**:
- [ ] Empty state displays correctly

### AF-002: Mixed Confidence Levels

**Scenario**: Citations have varying confidence levels

**Expected Result**:
- All citations display with appropriate badges
- Filter works correctly for each level
- Citations are sorted by confidence (highest first by default)

**Verification**:
- [ ] Mixed confidence displays correctly
- [ ] Sorting is correct (if applicable)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Very long citation text | Expanded view scrolls or wraps |
| Citation with special characters | Renders correctly |
| Rapid expand/collapse | Transitions work smoothly |
| Clipboard API unavailable | Copy fails gracefully with message |
| Filter with no matching citations | Shows "No citations match filter" |

## Related Components

### Source Files
- `apps/web/src/components/CitationPanel.tsx` — Citation display component
- `apps/web/src/components/GroundedRetrievalFlow.tsx` — Parent component

### Test Files
- Component tests in related test files

### E2E Test
- `e2e/tests/citation-panel.spec.ts`

## Acceptance Criteria

- [ ] Citations display with source labels and confidence badges
- [ ] Confidence filtering works correctly
- [ ] Citations expand/collapse smoothly
- [ ] Snippet text truncates at 150 chars when collapsed
- [ ] Copy to clipboard works
- [ ] Empty state handles gracefully
- [ ] Citation count updates with filtering

## Test Status

| Date | Tester | Result | Notes |
|------|--------|--------|-------|
| | | ⬜ Pass / ⬜ Fail | |
