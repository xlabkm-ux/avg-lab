# UC-009: Agent Mode Routing

## Summary

System routes user input to appropriate specialist mode based on keyword signals in the input text.

## Actor

System (automated) — triggered when user submits input to the dialogue surface.

## Preconditions

1. User has created a project (UC-001)
2. User has input text to submit
3. System processes input through mode router

## Main Flow

### Step 1: Submit Input

**Action**: User submits text input

**Input**: Any text entered by the user

**Expected Result**:
- Input text is analyzed for keyword signals
- Mode router evaluates patterns
- Appropriate specialist mode is selected

**Verification**:
- [ ] Input text is received
- [ ] Mode routing executes
- [ ] Mode is selected

### Step 2: Routing — Validator Mode

**Keywords**: validate, claim, risk, metaphor, check, verify, assess

**Input Example**: "Validate this claim: Memory is like a computer"

**Expected Result**:
- Mode: `validator`
- Purpose: Analyze claim structure, detect risks, validate status
- Response includes:
  - Claim status classification
  - Risk assessment
  - Repair suggestions if needed

**Verification**:
- [ ] Validator mode is selected
- [ ] Response includes validation metadata

### Step 3: Routing — Architect Mode

**Keywords**: architect, system, module, contract, structure, design, framework

**Input Example**: "Design a system architecture for memory management"

**Expected Result**:
- Mode: `architect`
- Purpose: Structural thinking, system design, modular analysis
- Response includes:
  - System components
  - Relationships and dependencies
  - Structural constraints

**Verification**:
- [ ] Architect mode is selected
- [ ] Response includes structural analysis

### Step 4: Routing — Creative Mode

**Keywords**: creative, brainstorm, variants, explore, imagine, what if, generate

**Input Example**: "Brainstorm creative ways to visualize memory concepts"

**Expected Result**:
- Mode: `creative`
- Purpose: Ideation, variant generation, creative exploration
- Response includes:
  - Multiple perspectives
  - Creative variants
  - Exploration suggestions

**Verification**:
- [ ] Creative mode is selected
- [ ] Response includes creative content

### Step 5: Routing — Orchestrator Mode (Default)

**Keywords**: None of the above patterns match

**Input Example**: "How does memory work?"

**Expected Result**:
- Mode: `orchestrator`
- Purpose: General coordination, default processing
- Response includes:
  - Structured response
  - Appropriate metadata
  - May delegate to other modes as needed

**Verification**:
- [ ] Orchestrator mode is selected (default)
- [ ] Response is structured correctly

## All Routing Patterns

| Mode | Keywords | Purpose |
|------|----------|---------|
| `validator` | validate, claim, risk, metaphor, check, verify, assess | Claim validation and risk detection |
| `architect` | architect, system, module, contract, structure, design, framework | Structural thinking and system design |
| `creative` | creative, brainstorm, variants, explore, imagine, what if, generate | Ideation and creative exploration |
| `orchestrator` | (default) | General coordination and processing |

## Routing Logic

```
Input text
  ↓
Contains validator keywords? → YES → validator mode
  ↓ NO
Contains architect keywords? → YES → architect mode
  ↓ NO
Contains creative keywords? → YES → creative mode
  ↓ NO
Default → orchestrator mode
```

## Alternative Flows

### AF-001: Multiple Keyword Matches

**Scenario**: Input contains keywords from multiple modes

**Expected Result**:
- First matching mode in priority order is selected
- Priority: validator > architect > creative > orchestrator
- System logs all detected keywords for analysis

### AF-002: Empty Input

**Scenario**: User submits empty input

**Expected Result**:
- Orchestrator mode selected (default)
- Or error: "Please enter some text"
- Handled gracefully

### AF-003: Case Sensitivity

**Scenario**: Keywords in different cases (Validate, VALIDATE, validate)

**Expected Result**:
- Routing is case-insensitive
- All variations match correctly

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Keyword as part of larger word | Matches correctly (e.g., "validation" matches "validate") |
| Negated keyword ("don't validate") | May still match (limitation) |
| Very short input | Routes to orchestrator (default) |
| Non-English input | No keyword match → orchestrator |
| Mixed language input | English keywords still detected |

## Related Components

### Source Files
- `packages/avg-agents/src/index.ts` — `routeDialogueMode()`
- `apps/web/src/dialogue/surface.ts` — Dialogue surface logic

### Test Files
- Agent mode routing tests in related packages
- Integration tests in `apps/web/tests/web.test.ts`

## Acceptance Criteria

- [ ] All 4 modes can be triggered by appropriate keywords
- [ ] Validator mode triggers on validation keywords
- [ ] Architect mode triggers on structural keywords
- [ ] Creative mode triggers on creative keywords
- [ ] Orchestrator mode is default when no keywords match
- [ ] Routing is case-insensitive
- [ ] Multiple keyword matches resolve by priority

## Test Status

| Date | Tester | Result | Notes |
|------|--------|--------|-------|
| | | ⬜ Pass / ⬜ Fail | |
