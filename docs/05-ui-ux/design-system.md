# Design System

## Visual Mood

- calm;
- precise;
- intelligent;
- low-noise;
- spacious;
- map-oriented.

## Core Components

- ChatPanel;
- ModeSwitcher;
- ConceptMap;
- ClaimInspector;
- RiskBadge;
- ArtifactEditor;
- SourcePanel;
- EvaluationBadge;
- MapDiffViewer.

## MVP-5 Component Boundary

MVP-5 uses:

- WorkspaceShell;
- DialoguePanel;
- ClaimReviewPanel;
- DocumentPanel;
- RetrievalPanel;
- ConceptMap;
- ArtifactPanel;
- RiskBadge;
- SourcePanel.

VoiceSessionPanel is deferred to MVP-6 and must not be implemented or designed as part of the MVP-5 interface contract.

## Risk Badges

Risk badges should be visible but not alarming.

Examples:

- Strong word;
- Metaphor only;
- Hypothesis;
- Needs source;
- Level mixing;
- Map/territory risk.
