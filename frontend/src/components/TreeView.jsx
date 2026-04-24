function TreeNode({ node, childrenTree }) {
  const childEntries = Object.entries(childrenTree || {});
  const hasChildren = childEntries.length > 0;

  if (!hasChildren) {
    return <li className="tree-leaf">{node}</li>;
  }

  return (
    <li>
      <details open>
        <summary>{node}</summary>
        <ul className="tree-list">
          {childEntries.map(([child, childTree]) => (
            <TreeNode key={child} node={child} childrenTree={childTree} />
          ))}
        </ul>
      </details>
    </li>
  );
}

function TreeView({ tree }) {
  const entries = Object.entries(tree || {});
  if (entries.length === 0) return null;

  return (
    <ul className="tree-list root-tree">
      {entries.map(([root, rootTree]) => (
        <TreeNode key={root} node={root} childrenTree={rootTree} />
      ))}
    </ul>
  );
}

export default TreeView;
