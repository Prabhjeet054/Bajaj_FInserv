import TreeView from "./TreeView";

function ResponseCard({ hierarchy }) {
  const isCycle = hierarchy?.has_cycle === true;

  return (
    <article className="hierarchy-card">
      <header className="hierarchy-header">
        <h3>Root: {hierarchy.root}</h3>
        <div className="badge-row">
          {isCycle ? (
            <span className="badge badge-cycle">CYCLE DETECTED</span>
          ) : (
            <>
              <span className="badge badge-tree">TREE</span>
              <span className="badge badge-depth">Depth: {hierarchy.depth}</span>
            </>
          )}
        </div>
      </header>

      {isCycle ? (
        <p className="cycle-note">This component has a cycle. Tree rendering is skipped.</p>
      ) : (
        <TreeView tree={hierarchy.tree} />
      )}
    </article>
  );
}

export default ResponseCard;
