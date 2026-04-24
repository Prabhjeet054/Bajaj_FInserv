export default function TreeNode({ node, children, depth = 0 }) {
  const hasChildren = children && Object.keys(children).length > 0;

  return (
    <div className={`tree-node depth-${Math.min(depth, 5)}`}>
      <div className="tree-node-label">
        <span className="node-icon">{hasChildren ? "📁" : "📄"}</span>
        <span className="node-name">{node}</span>
        {hasChildren && (
          <span className="child-count">
            ({Object.keys(children).length} {Object.keys(children).length === 1 ? "child" : "children"})
          </span>
        )}
      </div>
      {hasChildren && (
        <div className="tree-children">
          {Object.entries(children).map(([childName, grandchildren]) => (
            <TreeNode key={childName} node={childName} children={grandchildren} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
