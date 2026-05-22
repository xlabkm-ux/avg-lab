import type { Meta, StoryObj } from '@storybook/react';

/**
 * Project Shell Story
 *
 * This story demonstrates the basic structure of the AVG workspace.
 */

const meta: Meta = {
  title: 'AVG/Workspace/ProjectShell',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ fontFamily: 'system-ui, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>AVG Codex Lab</h1>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{ width: '280px', borderRight: '1px solid #e5e7eb', padding: '1rem', background: '#f9fafb' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>
            Projects
          </h2>
          <div style={{ padding: '0.5rem', background: '#fff', borderRadius: '0.375rem', marginBottom: '0.5rem' }}>
            Current Project
          </div>
        </aside>

        {/* Dialogue Panel */}
        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Dialogue</h2>
          <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', background: '#fff' }}>
            <p style={{ color: '#6b7280' }}>Start a conversation with AVG...</p>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Type your message..."
              style={{ flex: 1, padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
            />
            <button
              style={{
                padding: '0.5rem 1.5rem',
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
        </section>

        {/* Right Panel */}
        <aside style={{ width: '320px', borderLeft: '1px solid #e5e7eb', padding: '1rem', background: '#f9fafb' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>
            Evidence & Claims
          </h2>
          <div style={{ padding: '0.5rem', background: '#fff', borderRadius: '0.375rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>No claims yet...</p>
          </div>
        </aside>
      </main>
    </div>
  ),
};

export const DarkMode: Story = {
  ...Default,
  parameters: {
    ...Default.parameters,
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#111827',
        color: '#f9fafb',
      }}
    >
      <header style={{ padding: '1rem 2rem', borderBottom: '1px solid #374151', background: '#1f2937' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>AVG Codex Lab</h1>
      </header>
      <main style={{ flex: 1, display: 'flex' }}>
        <aside style={{ width: '280px', borderRight: '1px solid #374151', padding: '1rem', background: '#1f2937' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.5rem' }}>
            Projects
          </h2>
        </aside>
        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Dialogue</h2>
          <div style={{ flex: 1, border: '1px solid #374151', borderRadius: '0.5rem', padding: '1rem', background: '#1f2937' }}>
            <p style={{ color: '#9ca3af' }}>Start a conversation with AVG...</p>
          </div>
        </section>
        <aside style={{ width: '320px', borderLeft: '1px solid #374151', padding: '1rem', background: '#1f2937' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.5rem' }}>
            Evidence & Claims
          </h2>
        </aside>
      </main>
    </div>
  ),
};

export const MobileView: Story = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
