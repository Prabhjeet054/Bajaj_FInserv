import { useMemo, useState } from "react";
import ErrorBanner from "./components/ErrorBanner";
import ResponseCard from "./components/ResponseCard";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [rawInput, setRawInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);

  const parsedItems = useMemo(() => {
    return rawInput
      .split(/[\n,]/g)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }, [rawInput]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/bfhl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: parsedItems })
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const message = payload?.error || "Request failed";
        throw new Error(`${res.status}: ${message}`);
      }

      const payload = await res.json();
      setResponse(payload);
    } catch (err) {
      if (err instanceof TypeError) {
        setError("Could not reach the server. Check your connection.");
      } else {
        setError(err.message || "Something went wrong.");
      }
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="panel input-panel">
        <h1>Hierarchy Processor</h1>
        <p className="hint">Enter edges separated by commas or new lines.</p>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="e.g. A->B, A->C, B->D, X->Y"
          rows={8}
        />
        <button type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Process"}
        </button>
      </section>

      <ErrorBanner message={error} />

      {response && (
        <>
          <section className="panel identity-panel">
            <h2>Identity</h2>
            <div className="identity-grid">
              <p>
                <strong>User ID:</strong> {response.user_id}
              </p>
              <p>
                <strong>Email:</strong> {response.email_id}
              </p>
              <p>
                <strong>Roll Number:</strong> {response.college_roll_number}
              </p>
            </div>
          </section>

          <section className="panel summary-panel">
            <div className="stat-card">
              <span>Total Trees</span>
              <strong>{response.summary.total_trees}</strong>
            </div>
            <div className="stat-card">
              <span>Total Cycles</span>
              <strong>{response.summary.total_cycles}</strong>
            </div>
            <div className="stat-card">
              <span>Largest Tree Root</span>
              <strong>{response.summary.largest_tree_root || "-"}</strong>
            </div>
          </section>

          <section className="hierarchy-grid">
            {response.hierarchies.map((hierarchy) => (
              <ResponseCard key={`${hierarchy.root}-${hierarchy.has_cycle ? "c" : "t"}`} hierarchy={hierarchy} />
            ))}
          </section>

          {response.invalid_entries.length > 0 && (
            <section className="panel panel-warning">
              <h3>Invalid Entries</h3>
              <div className="chips">
                {response.invalid_entries.map((item, idx) => (
                  <span key={`${item}-${idx}`} className="chip chip-warning">
                    {String(item)}
                  </span>
                ))}
              </div>
            </section>
          )}

          {response.duplicate_edges.length > 0 && (
            <section className="panel panel-info">
              <h3>Duplicate Edges</h3>
              <div className="chips">
                {response.duplicate_edges.map((item) => (
                  <span key={item} className="chip chip-info">
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default App;
