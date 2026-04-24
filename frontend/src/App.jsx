import { useState } from "react";
import InputPanel from "./components/InputPanel";
import ResponsePanel from "./components/ResponsePanel";
import ErrorBanner from "./components/ErrorBanner";
import LoadingSpinner from "./components/LoadingSpinner";
import { callBFHL } from "./api/bfhl";
import "./styles/app.css";

export default function App() {
  const [theme, setTheme] = useState("light");
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
    <div className="app-container" data-theme={theme}>
      <header className="app-header">
        <div>
          <h1>BFHL Tree Visualizer</h1>
          <p>Enter node relationships and view hierarchy results.</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
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
