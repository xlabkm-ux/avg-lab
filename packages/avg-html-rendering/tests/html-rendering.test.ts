import { describe, it, expect } from 'vitest';
import {
  createDialogueMessageSurface,
  renderDialogueMessageSurface,
  createDialogueFlowPage,
  renderDialogueFlowPage,
  renderDialogueFlowPageFromGroundedReport,
  renderProjectSessionPage,
  renderShellTitle,
  createStructuredResponseDetailsPanel,
  renderStructuredResponseDetailsPanel,
  createProjectSessionShell,
  type DialogueMessage,
} from '../src/index';

describe('renderShellTitle', () => {
  it('returns stable app title', () => {
    expect(renderShellTitle()).toBe('AVG Codex Lab');
  });
});

describe('createProjectSessionShell', () => {
  it('creates shell with project and session ids', () => {
    const shell = createProjectSessionShell('proj-1', 'sess-1');

    expect(shell.kind).toBe('project-session-shell');
    expect(shell.projectId).toBe('proj-1');
    expect(shell.sessionId).toBe('sess-1');
    expect(shell.title).toBe('AVG Codex Lab');
  });
});

describe('renderProjectSessionPage', () => {
  it('renders page with project and session labels', () => {
    const html = renderProjectSessionPage('proj-1', 'sess-1');

    expect(html).toContain('data-shell="project-session-shell"');
    expect(html).toContain('data-project-id="proj-1"');
    expect(html).toContain('data-session-id="sess-1"');
  });
});

describe('createDialogueMessageSurface', () => {
  it('creates surface with messages', () => {
    const messages: DialogueMessage[] = [
      { id: 'msg-1', role: 'user', content: 'Hello' },
    ];
    const surface = createDialogueMessageSurface('proj-1', 'sess-1', messages);

    expect(surface.kind).toBe('dialogue-message-surface');
    expect(surface.messages).toHaveLength(1);
    expect(surface.projectId).toBe('proj-1');
  });
});

describe('renderDialogueMessageSurface', () => {
  it('renders empty state when no messages', () => {
    const html = renderDialogueMessageSurface('proj-1', 'sess-1', []);

    expect(html).toContain('No dialogue yet');
  });

  it('renders messages when present', () => {
    const messages: DialogueMessage[] = [
      { id: 'msg-1', role: 'user', content: 'Hello' },
    ];
    const html = renderDialogueMessageSurface('proj-1', 'sess-1', messages);

    expect(html).toContain('data-message-id="msg-1"');
    expect(html).toContain('data-message-role="user"');
    expect(html).toContain('Hello');
  });
});

describe('createDialogueFlowPage', () => {
  it('creates page with project session and message surface', () => {
    const page = createDialogueFlowPage('proj-1', 'sess-1', []);

    expect(page.kind).toBe('dialogue-flow-page');
    expect(page.projectSession.projectId).toBe('proj-1');
    expect(page.messageSurface.projectId).toBe('proj-1');
  });
});

describe('renderDialogueFlowPage', () => {
  it('renders page structure', () => {
    const html = renderDialogueFlowPage('proj-1', 'sess-1', []);

    expect(html).toContain('data-page="dialogue-flow-page"');
    expect(html).toContain('data-project-id="proj-1"');
  });
});

describe('createStructuredResponseDetailsPanel', () => {
  it('creates panel with response', () => {
    const response = {
      id: 'resp-1',
      project_id: 'proj-1',
      session_id: 'sess-1',
      message_id: 'msg-1',
      summary: 'Test summary',
      scope: 'test scope',
      claim_status: 'working_distinction' as const,
      language_mode: 'direct_description' as const,
      validation_risk: 'low' as const,
      risk_markers: [],
      map_territory_boundary: 'preserved' as const,
      next_action: 'continue',
    };
    const panel = createStructuredResponseDetailsPanel(response);

    expect(panel.kind).toBe('structured-response-details-panel');
    expect(panel.response).toBe(response);
  });
});

describe('renderStructuredResponseDetailsPanel', () => {
  it('renders panel with response details', () => {
    const response = {
      id: 'resp-1',
      project_id: 'proj-1',
      session_id: 'sess-1',
      message_id: 'msg-1',
      summary: 'Test summary',
      scope: 'test scope',
      claim_status: 'working_distinction' as const,
      language_mode: 'direct_description' as const,
      validation_risk: 'low' as const,
      risk_markers: ['marker-1'],
      map_territory_boundary: 'preserved' as const,
      next_action: 'continue',
    };
    const html = renderStructuredResponseDetailsPanel(response);

    expect(html).toContain('data-panel="structured-response-details-panel"');
    expect(html).toContain('data-response-id="resp-1"');
    expect(html).toContain('Test summary');
    expect(html).toContain('marker-1');
  });
});

describe('renderDialogueFlowPageFromGroundedReport', () => {
  it('renders page with grounded response when report has one', () => {
    const report = {
      groundedResponse: {
        response: {
          id: 'resp-1',
          project_id: 'proj-1',
          session_id: 'sess-1',
          message_id: 'msg-1',
          summary: 'Grounded response',
          scope: 'test',
          claim_status: 'working_distinction' as const,
          language_mode: 'direct_description' as const,
          validation_risk: 'low' as const,
          risk_markers: [],
          map_territory_boundary: 'preserved' as const,
          next_action: 'continue',
        },
        grounding: {
          citations: [],
          grounded_claims: [],
          interpretations: [],
          unsupported_claims: [],
          boundary_statement: 'Test boundary',
          retrieval_confidence: 'high' as const,
        },
      },
    };
    const html = renderDialogueFlowPageFromGroundedReport('proj-1', 'sess-1', [], report);

    expect(html).toContain('data-page="dialogue-flow-page"');
  });

  it('renders page without grounded response when report has none', () => {
    const report = {};
    const html = renderDialogueFlowPageFromGroundedReport('proj-1', 'sess-1', [], report as any);

    expect(html).toContain('data-page="dialogue-flow-page"');
  });
});
