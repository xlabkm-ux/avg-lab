import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClaimReviewPanel } from '../../src/components/ClaimReviewPanel';
import type { AvgClaim } from '@avg/schemas';

describe('ClaimReviewPanel', () => {
  const sampleClaim: AvgClaim = {
    id: 'claim-1',
    statement: 'Test claim statement',
    claim_status: 'definition',
    language_mode: 'direct_description',
    risks: ['high_uncertainty'],
    scope: 'test scope',
    repair: 'Consider adding uncertainty markers',
  };

  it('renders claim statement', () => {
    render(<ClaimReviewPanel claims={[sampleClaim]} projectId="proj-1" sessionId="sess-1" />);

    expect(screen.getByText('Test claim statement')).toBeInTheDocument();
  });

  it('renders claim status label', () => {
    render(<ClaimReviewPanel claims={[sampleClaim]} projectId="proj-1" sessionId="sess-1" />);

    expect(screen.getByText('Definition')).toBeInTheDocument();
  });

  it('renders language mode label', () => {
    render(<ClaimReviewPanel claims={[sampleClaim]} projectId="proj-1" sessionId="sess-1" />);

    expect(screen.getByText('Direct')).toBeInTheDocument();
  });

  it('shows empty state when no claims', () => {
    render(<ClaimReviewPanel claims={[]} projectId="proj-1" sessionId="sess-1" />);

    expect(screen.getByText('No claims to inspect')).toBeInTheDocument();
  });

  it('renders multiple claims', () => {
    const claims: AvgClaim[] = [
      {
        id: 'claim-1',
        statement: 'First claim',
        claim_status: 'definition',
        language_mode: 'direct_description',
        risks: [],
      },
      {
        id: 'claim-2',
        statement: 'Second claim',
        claim_status: 'hypothesis',
        language_mode: 'conditional_description',
        risks: ['metaphor_risk'],
      },
    ];

    render(<ClaimReviewPanel claims={claims} projectId="proj-1" sessionId="sess-1" />);

    expect(screen.getByText('First claim')).toBeInTheDocument();
    expect(screen.getByText('Second claim')).toBeInTheDocument();
  });
});
