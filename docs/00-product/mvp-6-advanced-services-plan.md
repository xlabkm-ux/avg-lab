# MVP-6 Advanced Services Plan

## Purpose

MVP-6 is the future milestone for voice, realtime collaboration and heavier production services.

This document is intentionally a boundary document, not a detailed design. MVP-5 must not spend design or implementation effort on these capabilities beyond leaving small, reversible extension points.

## Deferred From MVP-5

MVP-6 owns:

- voice capture;
- speech-to-text;
- text-to-speech;
- realtime multi-user sessions;
- live presence;
- collaborative editing;
- production vector database selection;
- production document storage;
- document permission policy;
- OCR;
- external web ingestion;
- background ingestion/indexing workers;
- advanced model routing;
- monitoring dashboards for production retrieval and realtime sessions.

## Future Product Direction

The likely MVP-6 outcome is:

1. a user can speak raw thoughts into AVG;
2. AVG can turn spoken material into structured dialogue records;
3. collaborators can join a live thinking session;
4. documents and maps remain source-aware and boundary-aware;
5. production storage and retrieval services can support longer-lived projects.

This direction is not approved as an implementation contract yet.

## Non-Negotiable Boundary

MVP-6 must still preserve:

- claim status;
- language mode;
- scope;
- validation risk;
- access mode;
- map/territory boundary;
- source citation boundaries.

Voice and collaboration must not make AVG behave like a generic realtime chatbot.

## What MVP-5 May Do

MVP-5 may:

- keep UI layout flexible enough for future panels;
- keep API adapters typed;
- avoid blocking future streaming or audio additions;
- document deferred extension points.

MVP-5 must not:

- add audio dependencies;
- add realtime transport dependencies;
- add production vector database dependencies;
- design permission systems;
- implement background ingestion;
- commit to external web ingestion behavior.

## Future Planning Gate

Before MVP-6 starts, create a full MVP-6 plan that answers:

- which single advanced capability comes first;
- what contracts are affected;
- what new privacy and security risks appear;
- how voice transcripts preserve claim status and uncertainty;
- how collaborative edits preserve map provenance;
- what storage and deletion policy applies;
- what observability is required.

Until that plan is approved, MVP-6 remains deferred.
