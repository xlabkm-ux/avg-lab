import { useState, useCallback } from 'react';
import { WorkspaceShell } from './components/WorkspaceShell';
import type { WorkspaceSurface } from './index';

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
    return (
      <div className="app-empty-state">
        <h1>Welcome to AVG Codex Lab</h1>
        <p>Create a project to start structured thinking with grounded evidence.</p>
        <button onClick={handleCreateProject}>Create Project</button>
      </div>
    );
  }

  return (
    <WorkspaceShell
      projectId={projectId}
      sessionId={sessionId}
      projectTitle={projectTitle}
      selectedSurface={selectedSurface}
      onSurfaceChange={handleSurfaceChange}
    />
  );
}
