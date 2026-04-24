import { useState } from "react";

const EXAMPLE_INPUT = `A->B, A->C, B->D, C->E, E->F
X->Y, Y->Z, Z->X
P->Q, Q->R
G->H, G->H, G->I
hello, 1->2, A->`;

export default function InputPanel({ onSubmit, loading }) {
  const [input, setInput] = useState("");

  function handleLoadExample() {
    setInput(EXAMPLE_INPUT);
  }

  function handleSubmit() {
    if (!input.trim()) return;
    onSubmit(input);
  }

  function handleKeyDown(e) {
    if (e.ctrlKey && e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className="input-panel">
      <div className="input-header">
        <h2>Input Node Relationships</h2>
        <button className="btn btn-secondary btn-sm" onClick={handleLoadExample} disabled={loading}>
          Load Example
        </button>
      </div>

      <textarea
        className="node-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Enter node pairs separated by commas or newlines:\nA->B, A->C, B->D\nX->Y, Y->Z\n\nPress Ctrl+Enter to submit`}
        rows={8}
        disabled={loading}
      />

      <div className="input-footer">
        <span className="input-hint">
          Format: <code>A-&gt;B</code> - single uppercase letters only. Separate entries with commas or newlines.
        </span>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !input.trim()}>
          {loading ? "Processing..." : "▶ Analyze Trees"}
        </button>
      </div>
    </div>
  );
}
