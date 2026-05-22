import { useState, useCallback } from 'react';
import { WorkspaceShell } from './components/WorkspaceShell';
import { LandingPage } from './components/LandingPage';
import type { WorkspaceSurface } from './index';
import type { AvgClaim } from '@avg/schemas';
import type { GraphSnapshot } from '@avg/graph';

const sampleClaims: AvgClaim[] = [
  {
    id: 'claim-1',
    statement: 'AVG is a creative dialogue system with validation and mapping layers.',
    claim_status: 'definition',
    language_mode: 'direct_description',
    risks: [],
    source_refs: ['avg-system-map'],
  },
  {
    id: 'claim-2',
    statement: 'The claim validator ensures metaphor is never presented as fact.',
    claim_status: 'hypothesis',
    language_mode: 'conditional_description',
    scope: 'Within the AVG system architecture',
    risks: ['reductionism'],
    repair: 'Restore the missing conditions, exceptions, or scope before reusing the claim.',
    source_refs: ['avg-system-map'],
  },
  {
    id: 'claim-3',
    statement: 'The concept map is the territory it describes.',
    claim_status: 'metaphor_only',
    language_mode: 'metaphor',
    risks: ['map_territory_substitution', 'dogma'],
    repair: 'Mark the passage as metaphor_only or rewrite it as an explicit model with scope.',
  },
];

const sampleMapSnapshot: GraphSnapshot = {
  nodes: [
    {
      id: 'avg',
      type: 'concept',
      label: 'AVG',
      definition: 'Creative dialogue system with map and validation layers.',
      coordinates: {
        access_mode: 'knowable',
        language_mode: 'direct_description',
        claim_status: 'definition',
      },
      map_safety: { known_risks: [] },
    },
    {
      id: 'creative_engine',
      type: 'concept',
      label: 'Creative Engine',
      definition: 'Generates ideas through frame operations.',
      coordinates: {
        access_mode: 'indirectly_accessible',
        language_mode: 'operational_description',
        claim_status: 'working_distinction',
      },
      map_safety: { known_risks: [] },
    },
    {
      id: 'claim_validator',
      type: 'concept',
      label: 'Claim Validator',
      definition: 'Validates claims against schema and business rules.',
      coordinates: {
        access_mode: 'knowable',
        language_mode: 'direct_description',
        claim_status: 'definition',
      },
      map_safety: { known_risks: [] },
    },
    {
      id: 'concept_map',
      type: 'map',
      label: 'Concept Map',
      definition: 'Working projection of session material into a graph.',
      coordinates: {
        access_mode: 'knowable',
        language_mode: 'direct_description',
        claim_status: 'boundary_statement',
      },
      map_safety: { known_risks: ['map_territory_boundary'] },
    },
  ],
  edges: [
    {
      id: 'e1',
      type: 'contains',
      from: 'avg',
      to: 'creative_engine',
      claim_status: 'working_distinction',
    },
    {
      id: 'e2',
      type: 'contains',
      from: 'avg',
      to: 'claim_validator',
      claim_status: 'working_distinction',
    },
    {
      id: 'e3',
      type: 'contains',
      from: 'avg',
      to: 'concept_map',
      claim_status: 'working_distinction',
    },
  ],
};

export function App() {
  const [projectId, setProjectId] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [selectedSurface, setSelectedSurface] = useState<WorkspaceSurface>('dialogue');

  const handleCreateProject = useCallback(() => {
    const newProjectId = `project-${Date.now()}`;
    const newSessionId = `session-${Date.now()}`;
    setProjectId(newProjectId);
    setSessionId(newSessionId);
    setProjectTitle('My AVG Project');
  }, []);

  const handleSurfaceChange = useCallback((surface: WorkspaceSurface) => {
    setSelectedSurface(surface);
  }, []);

  if (!projectId || !sessionId) {
    return <LandingPage onCreateProject={handleCreateProject} />;
  }

  return (
    <WorkspaceShell
      projectId={projectId}
      sessionId={sessionId}
      projectTitle={projectTitle}
      selectedSurface={selectedSurface}
      onSurfaceChange={handleSurfaceChange}
      claims={sampleClaims}
      mapSnapshot={sampleMapSnapshot}
    />
  );
}
