import { useState } from "react";
import InputPanel from "./components/InputPanel";
import ResponsePanel from "./components/ResponsePanel";
import ErrorBanner from "./components/ErrorBanner";
import LoadingSpinner from "./components/LoadingSpinner";
import { callBFHL } from "./api/bfhl";
import "./styles/app.css";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(rawInput) {
    const dataArray = rawInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setLoading(true);
    setError(null);
    setResponse(null);

    const result = await callBFHL(dataArray);
    setLoading(false);

    if (result.success) {
      setResponse(result.data);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🌳 BFHL Tree Visualizer</h1>
        <p>Enter node relationships to build and visualize hierarchical trees</p>
      </header>

      <main className="app-main">
        <InputPanel onSubmit={handleSubmit} loading={loading} />

        {loading && <LoadingSpinner />}
        {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
        {response && <ResponsePanel data={response} />}
      </main>
    </div>
  );
}
