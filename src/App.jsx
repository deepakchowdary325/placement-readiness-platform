import React from "react";
import "./index.css";

const TopBar = () => (
  <header style={{ 
    height: "64px", 
    borderBottom: "1px solid var(--color-border)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "space-between",
    padding: "0 var(--space-24)",
    backgroundColor: "#FFF"
  }}>
    <div style={{ fontWeight: 600, fontSize: "14px", letterSpacing: "0.05em", textTransform: "uppercase" }}>KodNest Premium Build System</div>
    <div style={{ fontSize: "14px", color: "var(--color-text)", opacity: 0.6 }}>Step 01 / 04</div>
    <div style={{ 
      padding: "4px 12px", 
      backgroundColor: "rgba(17, 17, 17, 0.05)", 
      borderRadius: "20px", 
      fontSize: "12px", 
      fontWeight: 500 
    }}>
      Not Started
    </div>
  </header>
);

const ContextHeader = () => (
  <section style={{ padding: "var(--space-64) var(--space-24) var(--space-40)" }}>
    <div className="container">
      <h1 style={{ marginBottom: "var(--space-16)" }}>Project Foundation</h1>
      <p style={{ fontSize: "20px", opacity: 0.7, margin: 0 }}>Establish core architectural patterns and design systems.</p>
    </div>
  </section>
);

const Workspace = () => (
  <main className="container" style={{ display: "flex", gap: "var(--space-40)", paddingBottom: "var(--space-64)" }}>
    <div style={{ flex: "0 0 70%" }}>
      <div className="card">
        <h3 style={{ marginBottom: "var(--space-24)" }}>Primary Workspace</h3>
        <p>This is where the main product interaction happens. Components are predictable and spacing is generous.</p>
        <div style={{ marginTop: "var(--space-40)", display: "flex", gap: "var(--space-16)" }}>
          <button className="btn-primary">Solid Primary Action</button>
          <button className="btn-secondary">Outlined Secondary</button>
        </div>
      </div>
    </div>
    
    <aside style={{ flex: "1" }}>
      <div className="card" style={{ backgroundColor: "rgba(17, 17, 17, 0.02)" }}>
        <h4 style={{ marginBottom: "var(--space-16)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", textTransform: "uppercase", opacity: 0.5 }}>Step Explanation</h4>
        <p style={{ fontSize: "16px", marginBottom: "var(--space-24)" }}>Define your prompt and build parameters to begin the generation process.</p>
        
        <div style={{ marginBottom: "var(--space-24)" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "8px", opacity: 0.6 }}>PROMPT</label>
          <textarea placeholder="Paste your prompt here..." rows={4} style={{ resize: "none" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }}>
          <button className="btn-secondary" style={{ fontSize: "14px" }}>Copy</button>
          <button className="btn-primary" style={{ fontSize: "14px" }}>Build in Lovable</button>
        </div>
      </div>
    </aside>
  </main>
);

const ProofFooter = () => (
  <footer style={{ 
    position: "fixed", 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: "#FFF", 
    borderTop: "1px solid var(--color-border)",
    padding: "var(--space-16) 0",
    zIndex: 100
  }}>
    <div className="container" style={{ display: "flex", justifyContent: "center", gap: "var(--space-40)" }}>
      {["UI Built", "Logic Working", "Test Passed", "Deployed"].map((item) => (
        <label key={item} style={{ display: "flex", alignItems: "center", gap: "var(--space-8)", fontSize: "14px", cursor: "pointer" }}>
          <input type="checkbox" style={{ width: "16px", height: "16px", cursor: "pointer" }} />
          {item}
        </label>
      ))}
    </div>
  </footer>
);

function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", paddingBottom: "80px" }}>
      <TopBar />
      <ContextHeader />
      <Workspace />
      <ProofFooter />
    </div>
  )
}

export default App;
