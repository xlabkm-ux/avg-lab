# UC-005: Concept Mapping

## Summary

User visualizes and explores concept maps as interactive graphs showing relationships between ideas.

## Actor

User exploring the conceptual structure of session material.

## Preconditions

1. User has created a project (UC-001)
2. User has navigated to Map surface (UC-002)
3. Concept Map Panel is displayed with sample graph data

## Main Flow

### Step 1: View Graph Visualization

**Action**: User observes the concept map

**Expected Result**:
- Interactive graph visualization using ReactFlow
- Sample graph nodes and edges are rendered
- Graph displays in center of panel
- Controls for zoom and pan are available
- Node and edge counts are displayed (e.g., "8 nodes, 10 edges")
- Map/territory boundary reminder is visible: "The map is a working projection, not Reality"

**Node Color Coding**:
| Node Type | Color | Meaning |
|-----------|-------|---------|
| term | Blue | Defined term |
| claim | Orange | Validated claim |
| concept | Purple | Abstract concept |
| map | Green | Map/container |
| risk | Red | Identified risk |
| source_fragment | Pink | Evidence fragment |
| artifact | Cyan | Session artifact |
| mode | Light Green | Operational mode |

**Edge Styling**:
| Edge Type | Style | Meaning |
|-----------|-------|---------|
| defines | Blue solid | Definition relationship |
| supports | Green solid | Supporting evidence |
| contradicts | Red dashed | Contradictory relationship |
| depends_on | Orange solid | Dependency |
| contains | Purple solid | Containment |
| manifests_as | Teal solid | Manifestation |
| risks | Red dotted | Risk association |
| repairs | Green dashed | Repair suggestion |
| cites | Gray solid | Citation |
| analogizes | Purple dashed | Analogy |

**Verification**:
- [ ] Graph visualization is rendered
- [ ] Nodes are color-coded correctly
- [ ] Edges have correct styles
- [ ] Node/edge count is displayed
- [ ] Boundary reminder is visible
- [ ] Zoom/pan controls are accessible

### Step 2: Pan and Zoom

**Action**: User interacts with the graph canvas

**Expected Result**:
- **Pan**: Click and drag to move around the graph
- **Zoom In**: Scroll up or use zoom controls
- **Zoom Out**: Scroll down or use zoom controls
- **Fit View**: Use fit view button to see all nodes

**Verification**:
- [ ] Pan works smoothly
- [ ] Zoom in/out works
- [ ] Fit view shows all nodes
- [ ] Graph remains readable at all zoom levels

### Step 3: Click Node to View Details

**Action**: User clicks on a node in the graph

**Expected Result**:
- Node is highlighted/selected
- Node detail panel appears showing:
  - **Node Type**: (term, claim, concept, etc.)
  - **Access Mode**: How the node is accessed
  - **Language Mode**: (Direct, Metaphor, Conditional, etc.)
  - **Claim Status**: (Definition, Hypothesis, Metaphor Only, etc.)
  - **Definition/Label**: Node content or description
  - **Coordinates**: Position in the graph

**Verification**:
- [ ] Node selection is visible
- [ ] Detail panel appears
- [ ] All node metadata is displayed
- [ ] Coordinates are shown

### Step 4: Click Pane to Deselect

**Action**: User clicks on empty area of the graph canvas

**Expected Result**:
- Node selection is cleared
- Detail panel closes or resets
- Graph returns to unselected state

**Verification**:
- [ ] Clicking pane deselects node
- [ ] Detail panel updates correctly

### Step 5: Examine Graph Layout

**Action**: User observes the automatic layout

**Expected Result**:
- Nodes are positioned using grid layout algorithm
- Layout uses sqrt-based column calculation
- Nodes are spaced to minimize overlap
- Edges route between nodes clearly

**Verification**:
- [ ] Layout is readable
- [ ] Nodes don't overlap excessively
- [ ] Edges are distinguishable

## Alternative Flows

### AF-001: Empty Graph

**Scenario**: No nodes or edges in the graph

**Expected Result**:
- Empty state is displayed
- Map/territory boundary reminder is prominent
- Message may indicate no concepts mapped yet

**Verification**:
- [ ] Empty state displays correctly
- [ ] Boundary reminder is visible

### AF-002: Large Graph

**Scenario**: Graph has many nodes (50+)

**Expected Result**:
- Graph renders with all nodes
- Layout algorithm positions nodes appropriately
- Performance remains acceptable
- Zoom/pan remains smooth

**Verification**:
- [ ] Large graph renders
- [ ] Performance is acceptable
- [ ] Navigation remains smooth

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Node with very long label | Text truncates or wraps |
| Node with no metadata | Shows available fields, omits missing |
| Disconnected nodes (no edges) | Displays as isolated nodes |
| Circular dependencies in edges | Renders without errors |
| Very dense graph | Zoom/pan handles gracefully |

## Related Components

### Source Files
- `apps/web/src/components/ConceptMapPanel.tsx` — Main panel (NodeDetailPanel)
- `apps/web/src/components/useGraphToReactFlow.ts` — Graph to ReactFlow conversion
- `packages/avg-graph/src/index.ts` — `projectClaimToMapNode()`, `diffGraphSnapshots()`

### Test Files
- `apps/web/tests/concept-map-panel.test.tsx` — Component tests (13 tests)
- Graph snapshot tests in related packages

### E2E Test
- `e2e/tests/concept-mapping.spec.ts`

## Acceptance Criteria

- [ ] Graph visualization renders correctly
- [ ] Nodes are color-coded by type
- [ ] Edges are styled by relationship type
- [ ] Pan and zoom work smoothly
- [ ] Node click shows detail panel with all metadata
- [ ] Pane click deselects node
- [ ] Empty state handles gracefully
- [ ] Node/edge count is displayed
- [ ] Map/territory boundary reminder is visible

## Test Status

| Date | Tester | Result | Notes |
|------|--------|--------|-------|
| | | ⬜ Pass / ⬜ Fail | |
