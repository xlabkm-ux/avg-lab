# Active Epics

Approved execution plan: `docs/00-product/mvp-0-2-development-plan.md`.

Sprint backlog: `.qoder/war-room/sprint-backlog.md`.

Agent execution model: `.qoder/agent-execution-matrix.md`.

## Epic AVG-MVP-0: Repository Operating System

Status: completed.

Goal: make the project operable by Codex agents.

Deliverables:

- AGENTS.md;
- `.qoder/` folder;
- docs skeleton;
- package skeleton;
- initial schemas;
- CI skeleton.
- package configs and working root checks;
- first task cards for MVP-1 and MVP-2.

Completion notes:

- Sprint 0 tasks AVG-001 through AVG-005 are done.
- Root checks and schema validation pass.

## Epic AVG-MVP-1: Dialogue Core

Status: approved after MVP-0 exit criteria.

Goal: create minimal text dialogue with mode routing and structured outputs.

Deliverables:

- OpenAI adapter;
- mode router;
- response composer;
- project session storage;
- smoke tests.
- minimal web dialogue surface.

## Epic AVG-MVP-2: Claim Validation

Status: approved after MVP-1 structured response contract.

Goal: validate claims, risks, metaphor boundaries and strong words.

Deliverables:

- claim schema;
- risk classifier;
- validator rules;
- AI eval fixtures;
- validation panel API.
- No Fairy Tale Gate.
- repair suggestions.

## Epic AVG-MVP-3: Concept Map

Status: completed.

Goal: store and visualize terms, claims and relations.

Deliverables:

- graph model;
- Neo4j repository;
- React Flow UI;
- map diff artifact.

Planning notes:

- Sprint 5 backlog and task cards were prepared in `.qoder/war-room/`.
- MVP-3 implementation completed through AVG-505 and the Sprint 5 progress view is closed.
