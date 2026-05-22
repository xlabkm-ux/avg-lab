# UC-001: Project Creation

## Summary

User creates a new AVG Lab project to begin structured thinking sessions.

## Actor

New user opening the application for the first time.

## Preconditions

1. Application is running (`pnpm dev`)
2. User has opened the application in a web browser
3. Application displays the welcome screen

## Main Flow

### Step 1: Open Application

**Action**: User opens the application URL (typically `http://localhost:5173`)

**Expected Result**:
- Welcome screen is displayed
- "Create Project" button is visible
- Screen shows introductory text about AVG Lab

**Verification**:
- [ ] Page loads without errors
- [ ] Welcome screen is visible
- [ ] "Create Project" button is present and clickable

### Step 2: Create Project

**Action**: User clicks the "Create Project" button

**Expected Result**:
- Application generates a unique Project ID (timestamp-based)
- Application generates a unique Session ID (timestamp-based)
- User is transitioned to the Workspace Shell interface

**Verification**:
- [ ] Project ID is generated (format: timestamp string)
- [ ] Session ID is generated (format: timestamp string)
- [ ] Welcome screen is replaced by Workspace Shell
- [ ] Navigation bar is visible with 6 surface options

### Step 3: Verify Workspace Shell

**Action**: User observes the Workspace Shell interface

**Expected Result**:
- Navigation bar shows 6 items:
  - Dialogue
  - Documents
  - Retrieval
  - Claim Review
  - Map
  - Artifacts
- Default surface is displayed (first item or placeholder)
- Project context is active

**Verification**:
- [ ] All 6 navigation items are visible
- [ ] Navigation items are clickable
- [ ] Default surface content is displayed
- [ ] No errors in browser console

## Alternative Flows

### AF-001: Refresh Page After Project Creation

**Scenario**: User refreshes the browser after creating a project

**Expected Result**:
- Application returns to welcome screen (browser-local only, no persistence)
- User must create a new project

**Verification**:
- [ ] Page refresh clears project state
- [ ] Welcome screen reappears
- [ ] No errors on refresh

### AF-002: Multiple Projects

**Scenario**: User creates multiple projects in sequence

**Expected Result**:
- Each project receives unique IDs
- Previous project data is lost (browser-local only)

**Verification**:
- [ ] New project IDs differ from previous
- [ ] No data leakage between projects

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Rapid clicking of "Create Project" | Only one project created |
| Browser back/forward navigation | State may be lost |
| Private/incognito mode | Works normally |
| Slow network | Button remains responsive |

## Related Components

### Source Files
- `apps/web/src/App.tsx` (lines 118-124) — Project creation logic
- `apps/web/src/components/WorkspaceShell.tsx` — Workspace Shell component

### Test Files
- `apps/web/tests/components/WorkspaceShell.test.tsx` — Component tests
- `apps/web/tests/web.test.ts` — Integration tests

### E2E Test
- `e2e/tests/project-creation.spec.ts`

## Acceptance Criteria

All main flow steps must pass without errors:
- [ ] Welcome screen displays correctly
- [ ] "Create Project" button is functional
- [ ] Project and Session IDs are generated
- [ ] Workspace Shell renders successfully
- [ ] Navigation bar with 6 items is visible
- [ ] No console errors during creation

## Test Status

| Date | Tester | Result | Notes |
|------|--------|--------|-------|
| | | ⬜ Pass / ⬜ Fail | |
