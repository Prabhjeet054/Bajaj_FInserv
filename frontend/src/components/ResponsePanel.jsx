import HierarchyCard from "./HierarchyCard";
import SummaryBar from "./SummaryBar";
import InvalidList from "./InvalidList";
import DuplicateList from "./DuplicateList";

export default function ResponsePanel({ data }) {
  const { user_id, email_id, college_roll_number, hierarchies, invalid_entries, duplicate_edges, summary } = data;

  return (
    <div className="response-panel">
      <div className="identity-card">
        <div className="identity-field">
          <span className="label">User ID</span>
          <span className="value">{user_id}</span>
        </div>
        <div className="identity-field">
          <span className="label">Email</span>
          <span className="value">{email_id}</span>
        </div>
        <div className="identity-field">
          <span className="label">Roll No.</span>
          <span className="value">{college_roll_number}</span>
        </div>
      </div>

      <SummaryBar summary={summary} />

      <section className="section">
        <h2 className="section-title">
          Hierarchies
          <span className="badge badge-neutral">{hierarchies.length}</span>
        </h2>
        {hierarchies.length === 0 ? (
          <div className="empty-state">No hierarchies found</div>
        ) : (
          <div className="hierarchies-grid">
            {hierarchies.map((h, i) => (
              <HierarchyCard key={`${h.root}-${i}`} hierarchy={h} />
            ))}
          </div>
        )}
      </section>

      {invalid_entries.length > 0 && <InvalidList entries={invalid_entries} />}
      {duplicate_edges.length > 0 && <DuplicateList edges={duplicate_edges} />}

      <details className="raw-json-section">
        <summary>View Raw JSON Response</summary>
        <pre className="raw-json">{JSON.stringify(data, null, 2)}</pre>
      </details>
    </div>
  );
}
