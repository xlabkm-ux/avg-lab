# UC-002: Workspace Navigation

## Summary

User navigates between different workspace surfaces within an active project.

## Actor

User with an active project in the Workspace Shell.

## Preconditions

1. User has created a project (see UC-001)
2. Workspace Shell is displayed with navigation bar
3. All 6 navigation items are visible

## Main Flow

### Step 1: View Navigation Bar

**Action**: User observes the navigation bar at the top of the Workspace Shell

**Expected Result**:
- Navigation bar displays 6 surface options in order:
  1. **Dialogue** — Structured dialogue interface
  2. **Documents** — Document management
  3. **Retrieval** — Grounded retrieval with evidence
  4. **Claim Review** — Claim validation review
  5. **Map** — Concept map visualization
  6. **Artifacts** — Session artifact export

**Verification**:
- [ ] All 6 navigation items are visible
- [ ] Items are displayed in correct order
- [ ] Current active surface is highlighted

### Step 2: Navigate to Dialogue Surface

**Action**: User clicks on "Dialogue" navigation item

**Expected Result**:
- Dialogue surface is displayed
- Surface shows placeholder text: "Structured dialogue with claim status, risk, and boundary display"
- Navigation highlights "Dialogue" as active

**Verification**:
- [ ] Dialogue surface content is displayed
- [ ] Placeholder text is visible
- [ ] Navigation highlights correct item

### Step 3: Navigate to Documents Surface

**Action**: User clicks on "Documents" navigation item

**Expected Result**:
- Documents surface is displayed
- Surface shows placeholder text: "Register and manage project-local evidence documents"
- Navigation highlights "Documents" as active

**Verification**:
- [ ] Documents surface content is displayed
- [ ] Placeholder text is visible
- [ ] Navigation highlights correct item

### Step 4: Navigate to Retrieval Surface

**Action**: User clicks on "Retrieval" navigation item

**Expected Result**:
- Grounded Retrieval Flow interface is displayed
- Text area for entering questions is visible
- "Ask with evidence" button is present
- Citation panel and response panel areas are available

**Verification**:
- [ ] Retrieval interface is displayed
- [ ] Question input area is visible
- [ ] Submit button is present and enabled
- [ ] Citation panel area is visible (may be empty)
- [ ] Response panel area is visible (may be empty)

### Step 5: Navigate to Claim Review Surface

**Action**: User clicks on "Claim Review" navigation item

**Expected Result**:
- Claim Review Panel is displayed
- List of claims is visible (sample claims from App.tsx)
- Each claim shows:
  - Claim statement (collapsed by default)
  - Status badge (Definition, Hypothesis, Metaphor Only, etc.)
  - Language mode badge (Direct, Conditional, Metaphor, etc.)
- Claims with risks are highlighted
- Expand button (chevron) is visible for each claim

**Verification**:
- [ ] Claim Review Panel is displayed
- [ ] Claims are listed with status badges
- [ ] Language mode badges are visible
- [ ] Claims are expandable
- [ ] Claims with risks are visually distinct

### Step 6: Navigate to Map Surface

**Action**: User clicks on "Map" navigation item

**Expected Result**:
- Concept Map Panel is displayed
- Interactive graph visualization using ReactFlow
- Sample graph nodes and edges are rendered
- Nodes are color-coded by type:
  - term: blue
  - claim: orange
  - concept: purple
  - map: green
  - risk: red
  - source_fragment: pink
  - artifact: cyan
  - mode: light green
- Edges are styled by relationship type
- Node/edge count is displayed
- Map/territory boundary reminder is visible

**Verification**:
- [ ] Graph visualization is rendered
- [ ] Nodes are color-coded correctly
- [ ] Edges have correct styles
- [ ] Node/edge count is displayed
- [ ] Boundary reminder is visible
- [ ] Graph is interactive (pan, zoom)

### Step 7: Navigate to Artifacts Surface

**Action**: User clicks on "Artifacts" navigation item

**Expected Result**:
- Artifacts surface is displayed
- Surface shows placeholder text: "Export session summaries, citations, and map snapshots"
- Navigation highlights "Artifacts" as active

**Verification**:
- [ ] Artifacts surface content is displayed
- [ ] Placeholder text is visible
- [ ] Navigation highlights correct item

## Alternative Flows

### AF-001: Rapid Navigation

**Scenario**: User rapidly clicks between surfaces

**Expected Result**:
- Each surface renders correctly
- No rendering artifacts or stale content
- Navigation highlights update correctly

**Verification**:
- [ ] No visual glitches during rapid switching
- [ ] Each surface displays correct content

### AF-002: Return to Previous Surface

**Scenario**: User navigates away and back to a surface

**Expected Result**:
- Surface state is preserved (if applicable)
- Surface renders correctly on return

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| First load after project creation | Default surface displays |
| Very wide/narrow browser window | Navigation remains accessible |
| Mobile viewport | Navigation adapts (if responsive) |
| Browser zoom (150%) | Navigation remains functional |

## Related Components

### Source Files
- `apps/web/src/components/WorkspaceShell.tsx` — Navigation hub (lines 81-123)
- `apps/web/src/components/GroundedRetrievalFlow.tsx` — Retrieval surface
- `apps/web/src/components/ClaimReviewPanel.tsx` — Claim Review surface
- `apps/web/src/components/ConceptMapPanel.tsx` — Map surface

### Test Files
- `apps/web/tests/components/WorkspaceShell.test.tsx` — Navigation tests (8 tests)
- `apps/web/tests/web.test.ts` — Integration tests

### E2E Test
- `e2e/tests/workspace-navigation.spec.ts`

## Acceptance Criteria

All navigation steps must work correctly:
- [ ] All 6 navigation items are visible and clickable
- [ ] Each surface displays correct content
- [ ] Navigation highlights update on surface change
- [ ] Implemented surfaces (Retrieval, Claim Review, Map) work correctly
- [ ] Placeholder surfaces (Dialogue, Documents, Artifacts) show placeholder text
- [ ] No errors during navigation

## Test Status

| Date | Tester | Result | Notes |
|------|--------|--------|-------|
| | | ⬜ Pass / ⬜ Fail | |
