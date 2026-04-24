export default function SummaryBar({ summary }) {
  const { total_trees, total_cycles, largest_tree_root } = summary;

  return (
    <div className="summary-bar">
      <div className="summary-stat">
        <span className="stat-number stat-green">{total_trees}</span>
        <span className="stat-label">Valid Trees</span>
      </div>
      <div className="summary-divider" />
      <div className="summary-stat">
        <span className="stat-number stat-red">{total_cycles}</span>
        <span className="stat-label">Cyclic Groups</span>
      </div>
      <div className="summary-divider" />
      <div className="summary-stat">
        <span className="stat-number stat-blue">{largest_tree_root || "—"}</span>
        <span className="stat-label">Deepest Tree Root</span>
      </div>
    </div>
  );
}
