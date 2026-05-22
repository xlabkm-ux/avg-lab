import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkspaceShell } from '../../src/components/WorkspaceShell';
import { createEmptyGraphSnapshot } from '@avg/graph';

describe('WorkspaceShell', () => {
  const defaultProps = {
    projectId: 'proj-1',
    sessionId: 'sess-1',
    projectTitle: 'Test Project',
    selectedSurface: 'dialogue' as const,
    onSurfaceChange: () => {},
  };

  it('renders project title and local only badge', () => {
    render(<WorkspaceShell {...defaultProps} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Local only')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<WorkspaceShell {...defaultProps} />);

    expect(screen.getByRole('button', { name: /dialogue/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /documents/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retrieval/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /claim review/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /map/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /artifacts/i })).toBeInTheDocument();
  });

  it('marks active surface with aria-current', () => {
    render(<WorkspaceShell {...defaultProps} selectedSurface="retrieval" />);

    const retrievalButton = screen.getByRole('button', { name: /retrieval/i });
    expect(retrievalButton).toHaveAttribute('aria-current', 'page');
  });

  it('calls onSurfaceChange when navigation button is clicked', async () => {
    const user = userEvent.setup();
    let selectedSurface: string | undefined;
    const handleSurfaceChange = (surface: string) => {
      selectedSurface = surface;
    };

    render(<WorkspaceShell {...defaultProps} onSurfaceChange={handleSurfaceChange} />);

    await user.click(screen.getByRole('button', { name: /map/i }));
    expect(selectedSurface).toBe('map');
  });

  it('renders technical details', () => {
    render(<WorkspaceShell {...defaultProps} />);

    expect(screen.getByText('proj-1')).toBeInTheDocument();
    expect(screen.getByText('sess-1')).toBeInTheDocument();
    expect(screen.getByText('mvp-5')).toBeInTheDocument();
  });

  it('renders claim review panel when claims are provided', () => {
    const claims = [
      {
        id: 'claim-1',
        statement: 'Test claim',
        claim_status: 'definition' as const,
        language_mode: 'direct_description' as const,
        risks: [],
      },
    ];

    render(<WorkspaceShell {...defaultProps} selectedSurface="claim-review" claims={claims} />);

    expect(screen.getByText('Test claim')).toBeInTheDocument();
  });

  it('renders concept map when mapSnapshot is provided', () => {
    const snapshot = createEmptyGraphSnapshot();

    const { container } = render(<WorkspaceShell {...defaultProps} selectedSurface="map" mapSnapshot={snapshot} />);

    // ConceptMapPanel renders ReactFlow, just verify the component renders without errors
    expect(container.querySelector('[data-active-surface="map"]')).toBeInTheDocument();
  });

  it('shows placeholder when mapSnapshot is not provided', () => {
    render(<WorkspaceShell {...defaultProps} selectedSurface="map" />);

    expect(screen.getByText('Concept map surface')).toBeInTheDocument();
  });
});
