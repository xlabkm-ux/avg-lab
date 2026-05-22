interface LandingPageProps {
  onCreateProject: () => void;
}

const features = [
  { title: "Structured Thought", description: "Turn raw ideas into clear, usable concepts with guided dialogue." },
  { title: "Creative Directions", description: "Generate multiple approaches and explore new possibilities." },
  { title: "Concept Mapping", description: "Build visual maps of terms, claims, and their relationships." },
  { title: "Claim Validation", description: "Detect overclaiming, separate metaphor from model, flag risks." },
  { title: "Grounded Evidence", description: "Anchor answers in your documents with citation tracking." },
  { title: "Exportable Artifacts", description: "Produce session summaries, citation reports, and concept maps." },
];

const personas = [
  {
    title: "Founders & Creators",
    description: "Test ideas, build pitch-ready concepts, and map product strategy.",
  },
  {
    title: "Writers & Thinkers",
    description: "Structure arguments, avoid fog, and produce clean drafts.",
  },
  {
    title: "Researchers",
    description: "Track hypotheses, compare concepts, and avoid category mistakes.",
  },
  {
    title: "Team Facilitators",
    description: "Run creative sessions, avoid groupthink, and capture decisions.",
  },
];

export function LandingPage({ onCreateProject }: LandingPageProps) {
  return (
    <div className="landing-page">
      {/* Hero */}
      <section className="landing-hero">
        <h1>Think Better. Think Structured.</h1>
        <p className="landing-hero-sub">
          AVG is a creative dialogue system for disciplined idea generation.
          It helps you think more accurately, boldly, and structurally.
        </p>
        <button type="button" className="landing-btn" onClick={onCreateProject}>
          Start Thinking
        </button>
      </section>

      {/* Core Promise */}
      <section className="landing-section landing-promise">
        <h2>The Map Is Not the Territory</h2>
        <p>
          AVG does not think instead of you. It creates conditions in which you think
          more clearly — with grounded evidence, validated claims, and visible uncertainty.
        </p>
      </section>

      {/* What AVG Does */}
      <section className="landing-section">
        <h2>What AVG Does</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiator */}
      <section className="landing-section differentiator">
        <h2>How AVG Differs</h2>
        <p className="differentiator-statement">
          Most AI products optimize for answer fluency. AVG optimizes for
          creative power plus claim discipline.
        </p>
        <table className="comparison-table">
          <thead>
            <tr>
              <th></th>
              <th>AVG</th>
              <th>Chatbot</th>
              <th>Search</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Claim validation</td>
              <td className="yes">Yes</td>
              <td className="no">No</td>
              <td className="no">No</td>
            </tr>
            <tr>
              <td>Concept mapping</td>
              <td className="yes">Yes</td>
              <td className="no">No</td>
              <td className="no">No</td>
            </tr>
            <tr>
              <td>Risk detection</td>
              <td className="yes">Yes</td>
              <td className="no">No</td>
              <td className="no">No</td>
            </tr>
            <tr>
              <td>Grounded citations</td>
              <td className="yes">Yes</td>
              <td className="no">No</td>
              <td className="partial">Partial</td>
            </tr>
            <tr>
              <td>Exportable artifacts</td>
              <td className="yes">Yes</td>
              <td className="partial">Partial</td>
              <td className="no">No</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Who It's For */}
      <section className="landing-section">
        <h2>Who It's For</h2>
        <div className="persona-grid">
          {personas.map((persona) => (
            <div key={persona.title} className="persona-card">
              <h3>{persona.title}</h3>
              <p>{persona.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="landing-cta">
        <h2>Ready to Think With Discipline?</h2>
        <p>Create a project and start building structured ideas with grounded evidence.</p>
        <button type="button" className="landing-btn" onClick={onCreateProject}>
          Create Project
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>AVG Codex Lab — Adequate Vision Generator</p>
      </footer>
    </div>
  );
}
