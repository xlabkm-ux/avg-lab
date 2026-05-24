import { useState, type FormEvent } from 'react';

interface ProjectCreationFormProps {
  onCreateProject: (title: string) => void;
}

export function ProjectCreationForm({ onCreateProject }: ProjectCreationFormProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);

  const MAX_LENGTH = 100;

  const validate = (value: string): string | null => {
    if (!value.trim()) {
      return 'Project name is required';
    }
    if (value.length > MAX_LENGTH) {
      return `Project name must be ${MAX_LENGTH} characters or less`;
    }
    // Check for potentially dangerous characters
    const dangerousChars = /[<>"'\\/]/g;
    if (dangerousChars.test(value)) {
      return 'Project name cannot contain special characters: < > " \' / \\';
    }
    return null;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const validationError = validate(title);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    onCreateProject(title.trim());
  };

  const handleChange = (value: string) => {
    setTitle(value);
    if (touched) {
      const validationError = validate(value);
      setError(validationError ?? '');
    }
  };

  const handleBlur = () => {
    setTouched(true);
    const validationError = validate(title);
    setError(validationError ?? '');
  };

  return (
    <div className="project-creation-form">
      <h2>Create New Project</h2>
      <p className="project-creation-subtitle">
        Give your project a meaningful name to start structuring your thoughts.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="project-title">Project Name</label>
          <input
            id="project-title"
            type="text"
            value={title}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="e.g., AI in Education Strategy"
            autoFocus
            maxLength={MAX_LENGTH + 50}
            aria-invalid={!!error}
            aria-describedby={error ? 'title-error' : undefined}
          />
          <div className="char-count">
            {title.length} / {MAX_LENGTH}
          </div>
          {error && (
            <div id="title-error" className="error-message" role="alert">
              {error}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="landing-btn"
            disabled={!title.trim() || !!error}
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}
