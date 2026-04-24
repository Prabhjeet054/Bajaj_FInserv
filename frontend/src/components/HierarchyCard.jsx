import TreeNode from "./TreeNode";

export default function HierarchyCard({ hierarchy }) {
  const { root, tree, depth, has_cycle } = hierarchy;
  const rootChildren = tree[root] || {};

  return (
    <div className={`hierarchy-card ${has_cycle ? "cycle-card" : "tree-card"}`}>
      <div className="card-header">
        <div className="root-badge">
          <span className="root-label">ROOT</span>
          <span className="root-name">{root}</span>
        </div>

        <div className="card-badges">
          {has_cycle ? (
            <span className="badge badge-danger">⚠ CYCLE DETECTED</span>
          ) : (
            <span className="badge badge-success">✓ Valid Tree</span>
          )}
          {depth !== undefined && <span className="badge badge-info">Depth: {depth}</span>}
        </div>
      </div>

      <div className="card-body">
        {has_cycle ? (
          <div className="cycle-message">
            <span className="cycle-icon">🔄</span>
            <div>
              <strong>Cyclic group detected</strong>
              <p>This group of nodes contains a circular reference. No tree structure can be built.</p>
            </div>
          </div>
        ) : Object.keys(rootChildren).length === 0 ? (
          <div className="leaf-message">
            <span>🌿 Leaf node - no children</span>
          </div>
        ) : (
          <div className="tree-container">
            <TreeNode node={root} children={rootChildren} depth={0} />
          </div>
        )}
      </div>
    </div>
  );
}
