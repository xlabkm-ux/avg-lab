import { useState, useCallback, useEffect } from 'react';
import { WorkspaceShell } from './components/WorkspaceShell';
import { LandingPage } from './components/LandingPage';
import { ProjectCreationForm } from './components/ProjectCreationForm';
import type { WorkspaceSurface } from './index';
import type { AvgClaim } from '@avg/schemas';
import type { GraphSnapshot } from '@avg/graph';
import type { DialogueMessage } from '@avg/html-rendering';

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
  const [showCreationForm, setShowCreationForm] = useState(false);
  const [claims, setClaims] = useState<AvgClaim[]>(sampleClaims);
  const [dialogueMessages, setDialogueMessages] = useState<DialogueMessage[]>([]);

  // Load workspace from localStorage on mount
  useEffect(() => {
    try {
      const savedWorkspace = localStorage.getItem('avg.workspace');
      if (savedWorkspace) {
        const workspace = JSON.parse(savedWorkspace);
        if (workspace.projectId && workspace.sessionId && workspace.projectTitle) {
          setProjectId(workspace.projectId);
          setSessionId(workspace.sessionId);
          setProjectTitle(workspace.projectTitle);
        }
      }
    } catch {
      // Ignore parse errors, start fresh
    }
  }, []);

  // Save workspace to localStorage when changed
  useEffect(() => {
    if (projectId && sessionId && projectTitle) {
      try {
        localStorage.setItem('avg.workspace', JSON.stringify({
          projectId,
          sessionId,
          projectTitle,
        }));
      } catch {
        // Ignore storage errors
      }
    }
  }, [projectId, sessionId, projectTitle]);

  const handleRequestProjectCreation = useCallback(() => {
    setShowCreationForm(true);
  }, []);

  const handleCreateProject = useCallback((title: string) => {
    const newProjectId = `project-${Date.now()}`;
    const newSessionId = `session-${Date.now()}`;
    setProjectId(newProjectId);
    setSessionId(newSessionId);
    setProjectTitle(title);
    setShowCreationForm(false);
  }, []);

  const handleSurfaceChange = useCallback((surface: WorkspaceSurface) => {
    setSelectedSurface(surface);
  }, []);

  const handleClaimsUpdate = useCallback((newClaims: AvgClaim[]) => {
    setClaims((prevClaims) => {
      // Merge new claims with existing ones, avoiding duplicates by ID
      const existingIds = new Set(prevClaims.map((c) => c.id));
      const uniqueNewClaims = newClaims.filter((c) => !existingIds.has(c.id));
      return [...prevClaims, ...uniqueNewClaims];
    });
  }, []);

  const handleMessagesChange = useCallback((messages: DialogueMessage[]) => {
    setDialogueMessages(messages);
  }, []);

  // Show project creation form
  if (showCreationForm) {
    return <ProjectCreationForm onCreateProject={handleCreateProject} />;
  }

  // Show landing page if no project
  if (!projectId || !sessionId) {
    return <LandingPage onCreateProject={handleRequestProjectCreation} />;
  }

  return (
    <WorkspaceShell
      projectId={projectId}
      sessionId={sessionId}
      projectTitle={projectTitle}
      selectedSurface={selectedSurface}
      onSurfaceChange={handleSurfaceChange}
      claims={claims}
      onClaimsUpdate={handleClaimsUpdate}
      mapSnapshot={sampleMapSnapshot}
      dialogueMessages={dialogueMessages}
      onMessagesChange={handleMessagesChange}
    />
  );
}
