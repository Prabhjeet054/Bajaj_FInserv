export default function InvalidList({ entries }) {
  return (
    <section className="section">
      <h2 className="section-title">
        Invalid Entries
        <span className="badge badge-warning">{entries.length}</span>
      </h2>
      <div className="tag-list">
        {entries.map((e, i) => (
          <span key={i} className="tag tag-invalid">
            {e === "" ? <em>(empty string)</em> : e}
          </span>
        ))}
      </div>
      <p className="section-hint">
        Valid format: <code>A-&gt;B</code> (single uppercase letters, no self-loops)
      </p>
    </section>
  );
}
