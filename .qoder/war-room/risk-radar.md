# Risk Radar

| Risk | Severity | Owner | Mitigation |
|---|---:|---|---|
| Interface becomes a chatbot wrapper | high | Product/Frontend | structured response, claim review, citations and map are first-class surfaces |
| UI hides uncertainty | high | Frontend/Validation | show risk badges, unsupported claims and boundary statements |
| MVP-5 drifts into voice or realtime work | high | Architect/Product | keep MVP-6 deferred boundary explicit |
| Mock UI diverges from contracts | high | Frontend/Backend | use typed API adapters and contract tests |
| Retrieval confidence appears as truth | high | Retrieval/QA | label confidence as retrieval risk signal |
| Concept map appears ontological | high | Graph/Frontend | always show map/territory boundary |
| Prompt-injection source text influences UI behavior | high | Security/QA | render hostile source text only as quoted source content |
| Local document scope leaks across projects | medium | Backend/Frontend | project-local state and visible local-only boundary |
| UI lacks user-test completeness | medium | Product/QA | E2E happy path covers the full MVP-5 scenario |

## Sprint 7 Risk Notes

- AVG-701 must prevent scope sprawl by freezing only the interface contracts needed for MVP-5.
- AVG-702 must create a working product shell, not a marketing page.
- AVG-703 must keep structured AVG responses visible and avoid plain chatbot behavior.
- AVG-704 must keep document registration local and project-scoped.

## Deferred MVP-6 Risk Notes

- Voice capture may introduce privacy and transcript-boundary risks.
- Realtime collaboration may introduce provenance and edit-conflict risks.
- Production vector storage may create false confidence and retention risks.
- OCR and external ingestion may introduce source trust and permission risks.

These risks are acknowledged but not designed during MVP-5.
