const f={title:"AVG/Workspace/ProjectShell",tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:`Project Shell Story\r

This story demonstrates the basic structure of the AVG workspace.`}}}},e={render:()=>React.createElement("div",{style:{fontFamily:"system-ui, sans-serif",height:"100vh",display:"flex",flexDirection:"column"}},React.createElement("header",{style:{padding:"1rem 2rem",borderBottom:"1px solid #e5e7eb",background:"#fff"}},React.createElement("h1",{style:{margin:0,fontSize:"1.25rem",fontWeight:600}},"AVG Codex Lab")),React.createElement("main",{style:{flex:1,display:"flex"}},React.createElement("aside",{style:{width:"280px",borderRight:"1px solid #e5e7eb",padding:"1rem",background:"#f9fafb"}},React.createElement("h2",{style:{fontSize:"0.875rem",fontWeight:600,color:"#6b7280",marginBottom:"0.5rem"}},"Projects"),React.createElement("div",{style:{padding:"0.5rem",background:"#fff",borderRadius:"0.375rem",marginBottom:"0.5rem"}},"Current Project")),React.createElement("section",{style:{flex:1,display:"flex",flexDirection:"column",padding:"1rem"}},React.createElement("h2",{style:{fontSize:"1rem",fontWeight:600,marginBottom:"1rem"}},"Dialogue"),React.createElement("div",{style:{flex:1,border:"1px solid #e5e7eb",borderRadius:"0.5rem",padding:"1rem",background:"#fff"}},React.createElement("p",{style:{color:"#6b7280"}},"Start a conversation with AVG...")),React.createElement("div",{style:{marginTop:"1rem",display:"flex",gap:"0.5rem"}},React.createElement("input",{type:"text",placeholder:"Type your message...",style:{flex:1,padding:"0.5rem 1rem",border:"1px solid #d1d5db",borderRadius:"0.375rem"}}),React.createElement("button",{style:{padding:"0.5rem 1.5rem",background:"#3b82f6",color:"#fff",border:"none",borderRadius:"0.375rem",cursor:"pointer"}},"Send"))),React.createElement("aside",{style:{width:"320px",borderLeft:"1px solid #e5e7eb",padding:"1rem",background:"#f9fafb"}},React.createElement("h2",{style:{fontSize:"0.875rem",fontWeight:600,color:"#6b7280",marginBottom:"0.5rem"}},"Evidence & Claims"),React.createElement("div",{style:{padding:"0.5rem",background:"#fff",borderRadius:"0.375rem"}},React.createElement("p",{style:{fontSize:"0.875rem",color:"#6b7280"}},"No claims yet...")))))},r={...e,parameters:{...e.parameters,backgrounds:{default:"dark"}},render:()=>React.createElement("div",{style:{fontFamily:"system-ui, sans-serif",height:"100vh",display:"flex",flexDirection:"column",background:"#111827",color:"#f9fafb"}},React.createElement("header",{style:{padding:"1rem 2rem",borderBottom:"1px solid #374151",background:"#1f2937"}},React.createElement("h1",{style:{margin:0,fontSize:"1.25rem",fontWeight:600}},"AVG Codex Lab")),React.createElement("main",{style:{flex:1,display:"flex"}},React.createElement("aside",{style:{width:"280px",borderRight:"1px solid #374151",padding:"1rem",background:"#1f2937"}},React.createElement("h2",{style:{fontSize:"0.875rem",fontWeight:600,color:"#9ca3af",marginBottom:"0.5rem"}},"Projects")),React.createElement("section",{style:{flex:1,display:"flex",flexDirection:"column",padding:"1rem"}},React.createElement("h2",{style:{fontSize:"1rem",fontWeight:600,marginBottom:"1rem"}},"Dialogue"),React.createElement("div",{style:{flex:1,border:"1px solid #374151",borderRadius:"0.5rem",padding:"1rem",background:"#1f2937"}},React.createElement("p",{style:{color:"#9ca3af"}},"Start a conversation with AVG..."))),React.createElement("aside",{style:{width:"320px",borderLeft:"1px solid #374151",padding:"1rem",background:"#1f2937"}},React.createElement("h2",{style:{fontSize:"0.875rem",fontWeight:600,color:"#9ca3af",marginBottom:"0.5rem"}},"Evidence & Claims"))))},t={...e,parameters:{viewport:{defaultViewport:"mobile1"}}};var n,a,o;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => <div style={{
    fontFamily: 'system-ui, sans-serif',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>\r
      {/* Header */}\r
      <header style={{
      padding: '1rem 2rem',
      borderBottom: '1px solid #e5e7eb',
      background: '#fff'
    }}>\r
        <h1 style={{
        margin: 0,
        fontSize: '1.25rem',
        fontWeight: 600
      }}>AVG Codex Lab</h1>\r
      </header>\r
\r
      {/* Main Content */}\r
      <main style={{
      flex: 1,
      display: 'flex'
    }}>\r
        {/* Sidebar */}\r
        <aside style={{
        width: '280px',
        borderRight: '1px solid #e5e7eb',
        padding: '1rem',
        background: '#f9fafb'
      }}>\r
          <h2 style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#6b7280',
          marginBottom: '0.5rem'
        }}>\r
            Projects\r
          </h2>\r
          <div style={{
          padding: '0.5rem',
          background: '#fff',
          borderRadius: '0.375rem',
          marginBottom: '0.5rem'
        }}>\r
            Current Project\r
          </div>\r
        </aside>\r
\r
        {/* Dialogue Panel */}\r
        <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem'
      }}>\r
          <h2 style={{
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: '1rem'
        }}>Dialogue</h2>\r
          <div style={{
          flex: 1,
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1rem',
          background: '#fff'
        }}>\r
            <p style={{
            color: '#6b7280'
          }}>Start a conversation with AVG...</p>\r
          </div>\r
          <div style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '0.5rem'
        }}>\r
            <input type="text" placeholder="Type your message..." style={{
            flex: 1,
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem'
          }} />\r
            <button style={{
            padding: '0.5rem 1.5rem',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}>\r
              Send\r
            </button>\r
          </div>\r
        </section>\r
\r
        {/* Right Panel */}\r
        <aside style={{
        width: '320px',
        borderLeft: '1px solid #e5e7eb',
        padding: '1rem',
        background: '#f9fafb'
      }}>\r
          <h2 style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#6b7280',
          marginBottom: '0.5rem'
        }}>\r
            Evidence & Claims\r
          </h2>\r
          <div style={{
          padding: '0.5rem',
          background: '#fff',
          borderRadius: '0.375rem'
        }}>\r
            <p style={{
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>No claims yet...</p>\r
          </div>\r
        </aside>\r
      </main>\r
    </div>
}`,...(o=(a=e.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};var i,d,l;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  ...Default,
  parameters: {
    ...Default.parameters,
    backgrounds: {
      default: 'dark'
    }
  },
  render: () => <div style={{
    fontFamily: 'system-ui, sans-serif',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#111827',
    color: '#f9fafb'
  }}>\r
      <header style={{
      padding: '1rem 2rem',
      borderBottom: '1px solid #374151',
      background: '#1f2937'
    }}>\r
        <h1 style={{
        margin: 0,
        fontSize: '1.25rem',
        fontWeight: 600
      }}>AVG Codex Lab</h1>\r
      </header>\r
      <main style={{
      flex: 1,
      display: 'flex'
    }}>\r
        <aside style={{
        width: '280px',
        borderRight: '1px solid #374151',
        padding: '1rem',
        background: '#1f2937'
      }}>\r
          <h2 style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#9ca3af',
          marginBottom: '0.5rem'
        }}>\r
            Projects\r
          </h2>\r
        </aside>\r
        <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem'
      }}>\r
          <h2 style={{
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: '1rem'
        }}>Dialogue</h2>\r
          <div style={{
          flex: 1,
          border: '1px solid #374151',
          borderRadius: '0.5rem',
          padding: '1rem',
          background: '#1f2937'
        }}>\r
            <p style={{
            color: '#9ca3af'
          }}>Start a conversation with AVG...</p>\r
          </div>\r
        </section>\r
        <aside style={{
        width: '320px',
        borderLeft: '1px solid #374151',
        padding: '1rem',
        background: '#1f2937'
      }}>\r
          <h2 style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#9ca3af',
          marginBottom: '0.5rem'
        }}>\r
            Evidence & Claims\r
          </h2>\r
        </aside>\r
      </main>\r
    </div>
}`,...(l=(d=r.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};var s,m,c;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}`,...(c=(m=t.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};const p=["Default","DarkMode","MobileView"];export{r as DarkMode,e as Default,t as MobileView,p as __namedExportsOrder,f as default};
