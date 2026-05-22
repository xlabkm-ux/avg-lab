# AVG Lab — Use Cases Test Documentation

## Overview

This directory contains use case test documentation for AVG Lab user testing. Each use case describes a specific user interaction with the application, including step-by-step instructions, expected results, and edge cases.

## How to Use This Documentation

### For Testers
1. Start with **UC-001** (Project Creation) and proceed in order
2. Follow the **Main Flow** steps exactly as written
3. Record pass/fail status for each step
4. Test **Alternative Flows** after completing the main flow
5. Report any deviations from expected results

### For Developers
- Each use case links to related components and tests
- E2E test files in `e2e/tests/` correspond to use cases
- Use case status tracks implementation completeness

## Use Cases Index

| ID | Use Case | Status | Type | Priority |
|----|----------|--------|------|----------|
| [UC-001](./UC-001-project-creation.md) | Project Creation | ✅ Implemented | User Action | High |
| [UC-002](./UC-002-workspace-navigation.md) | Workspace Navigation | ✅ Implemented | User Action | High |
| [UC-003](./UC-003-grounded-retrieval.md) | Grounded Retrieval | ✅ Implemented | User Action | High |
| [UC-004](./UC-004-claim-review.md) | Claim Review | ✅ Implemented | User Action | High |
| [UC-005](./UC-005-concept-mapping.md) | Concept Mapping | ✅ Implemented | User Action | High |
| [UC-006](./UC-006-citation-panel.md) | Citation Panel | ✅ Implemented | User Action | Medium |
| [UC-007](./UC-007-claim-classification.md) | Claim Classification | ✅ Implemented | System Logic | High |
| [UC-008](./UC-008-metaphor-detection.md) | Metaphor Detection | ✅ Implemented | System Logic | Critical |
| [UC-009](./UC-009-agent-mode-routing.md) | Agent Mode Routing | ✅ Implemented | System Logic | Medium |
| [UC-010](./UC-010-response-structure.md) | Response Structure | ✅ Implemented | System Logic | High |

### Placeholder Features (Not Yet Implemented)

| ID | Use Case | Status | Notes |
|----|----------|--------|-------|
| UC-011 | Structured Dialogue | 🔶 Placeholder | Planned for MVP-6 |
| UC-012 | Document Registration | 🔶 Placeholder | Planned for MVP-6 |
| UC-013 | Artifact Export | 🔶 Placeholder | Planned for MVP-6 |

## Test Execution Status

| Date | Tester | Use Case | Status | Notes |
|------|--------|----------|--------|-------|
| | | | | |

## Status Legend

- ✅ **Implemented** — Fully functional, ready for testing
- 🔶 **Placeholder** — UI placeholder, not yet functional
- ⚠️ **Partial** — Some features working, others incomplete
- ❌ **Blocked** — Cannot test due to dependency issue

## Related Documentation

- [Testing Guide](../TESTING-GUIDE.md) — Complete testing documentation
- [Infrastructure Overview](../INFRASTRUCTURE.md) — System architecture
- [Setup Guide](../SETUP.md) — Installation instructions
- [E2E Tests](../e2e/tests/) — Playwright test files

## Test Environment Requirements

### Minimum Requirements
- Node.js >= 18 (v26.1.0 recommended)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Application running locally (`pnpm dev`)

### Optional (for full testing)
- PostgreSQL database connection
- OpenAI API key (for AI features)
- Playwright browsers (for E2E automation)

## Reporting Issues

When reporting test failures, include:
1. Use case ID (e.g., UC-003)
2. Step number where failure occurred
3. Expected vs actual result
4. Browser and OS information
5. Screenshots if applicable
