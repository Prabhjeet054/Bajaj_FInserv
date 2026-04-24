export default function DuplicateList({ edges }) {
  return (
    <section className="section">
      <h2 className="section-title">
        Duplicate Edges
        <span className="badge badge-blue">{edges.length}</span>
      </h2>
      <div className="tag-list">
        {edges.map((e, i) => (
          <span key={i} className="tag tag-duplicate">
            {e}
          </span>
        ))}
      </div>
      <p className="section-hint">These edges appeared more than once. Only the first occurrence was used.</p>
    </section>
  );
}
