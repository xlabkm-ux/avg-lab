# Specification: AVG Leadership Roadmap Integration

## Source

`.qoder/specs/avg-leadership-roadmap.md`

## Mapping to Codex Sprints

### Phase 1: MVP-5 Completion → Sprint 7-9

| Roadmap Task | Codex Task | Status | Sprint |
|--------------|------------|--------|--------|
| Document Registration Surface (AVG-704) | `.qoder/war-room/tasks/AVG-704-task-card.md` | Planned | Sprint 7 |
| Grounded Retrieval Flow (AVG-705) | `.qoder/war-room/tasks/AVG-705-task-card.md` | Planned | Sprint 8 |
| Remove Empty Package Illusion | Infrastructure task | Deferred | Sprint 7 |
| Claim Review Panel (AVG-706) | `.qoder/war-room/tasks/AVG-706-task-card.md` | Planned | Sprint 8 |
| Concept Map Visualization (AVG-707) | `.qoder/war-room/tasks/AVG-707-task-card.md` | Planned | Sprint 8 |
| Extract Shared Utilities | `packages/avg-utils` | In Progress | Sprint 7 |
| Artifact Export Surface (AVG-708) | `.qoder/war-room/tasks/AVG-708-task-card.md` | Planned | Sprint 8 |
| E2E Happy Path Test (AVG-709) | `.qoder/war-room/tasks/AVG-709-task-card.md` | Planned | Sprint 9 |
| UI Polish Pass | Frontend polish task | Deferred | Sprint 9 |
| Documentation Landing Page | Documentation task | Deferred | Sprint 9 |

### Phase 2: Technology Leadership → Future Sprints

| Roadmap Task | Planned Sprint | Dependencies |
|--------------|----------------|--------------|
| Add Pino Structured Logging | Sprint 10 | MVP-5 complete |
| Implement Result Pattern | Sprint 10 | avg-utils stable |
| Add Observability Stub | Sprint 10 | Logging in place |
| Add Lightweight HTTP Router | Sprint 11 | API stable |
| Implement Request Caching | Sprint 11 | Retrieval stable |
| Add OpenAPI Documentation | Sprint 11 | API contracts stable |
| Make Claim Status Visible | Sprint 12 | Claim review panel complete |
| Expose No-Fairy-Tale Score | Sprint 12 | Validation stable |
| Create Claim Health Dashboard | Sprint 12 | Claim review complete |
| Add Frame Collision Operator | Sprint 12 | Agents package stable |

### Phase 3: Market Positioning → Future Sprints

| Roadmap Task | Planned Sprint | Dependencies |
|--------------|----------------|--------------|
| Update README Positioning | Sprint 13 | Product functional |
| Record Demo Video | Sprint 13 | UI complete |
| Create Competitive Comparison | Sprint 13 | Product positioned |
| Simplify Onboarding | Sprint 14 | Product stable |
| Final E2E Test Suite | Sprint 14 | All features complete |
| Release Checklist | Sprint 14 | Pre-launch complete |

## Success Metrics Tracking

### Phase 1 (MVP-5 Completion)
- [ ] All workspace surfaces functional
- [ ] E2E happy path test passing
- [ ] Zero console errors in browser
- [ ] Full user journey without bugs
- [ ] README clearly explains product value

### Phase 2 (Tech Leadership)
- [ ] Structured logging operational
- [ ] Result pattern adopted in critical paths
- [ ] Retrieval caching reduces latency by 10x+
- [ ] OpenAPI docs accessible at /docs
- [ ] Claim status badges visible in UI

### Phase 3 (Market Positioning)
- [ ] Demo video completed (<90 seconds)
- [ ] Landing page live
- [ ] Competitive comparison documented
- [ ] Fresh clone setup works in <5 minutes
- [ ] First external users can onboard without help

## Competitive Moat Features

These features are already implemented and differentiate AVG from competitors:

1. **Epistemic Discipline System** - Claim status taxonomy enforced at schema level
2. **Map/Territory Boundary** - Never confuses working model with Reality
3. **No-Fairy-Tale Gate** - Automated detection of pseudo-depth and metaphor-as-fact
4. **Validation Risk Levels** - Every claim scored with repair suggestions
5. **Source Grounding with Boundaries** - Citations visible, confidence as risk signal

## Core Principle

> "Простыми средствами получить оптимальное и креативное решение"

Win through discipline, not complexity.
