const EDGE_REGEX = /^[A-Z]->[A-Z]$/;

function buildTree(node, childrenMap) {
  const result = {};
  for (const child of childrenMap.get(node) || []) {
    result[child] = buildTree(child, childrenMap);
  }
  return result;
}

function calcDepth(node, childrenMap) {
  const kids = childrenMap.get(node) || [];
  if (kids.length === 0) return 1;
  return 1 + Math.max(...kids.map((k) => calcDepth(k, childrenMap)));
}

function hasCycleFromRoot(root, childrenMap, componentNodes) {
  const visited = new Set();
  const stack = new Set();

  const dfs = (node) => {
    if (stack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    stack.add(node);

    for (const child of childrenMap.get(node) || []) {
      if (!componentNodes.has(child)) continue;
      if (dfs(child)) return true;
    }

    stack.delete(node);
    return false;
  };

  if (dfs(root)) return true;
  for (const node of componentNodes) {
    if (!visited.has(node) && dfs(node)) return true;
  }
  return false;
}

function discoverComponents(nodes, undirectedAdj) {
  const visited = new Set();
  const components = [];

  for (const start of nodes) {
    if (visited.has(start)) continue;
    const queue = [start];
    visited.add(start);
    const component = [];

    while (queue.length > 0) {
      const current = queue.shift();
      component.push(current);
      for (const next of undirectedAdj.get(current) || []) {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }

    components.push(component);
  }

  return components;
}

export function processHierarchyData(entries) {
  const invalid_entries = [];
  const duplicate_edges = [];

  const duplicateTracker = new Set();
  const seenEdges = new Set();
  const uniqueValidEdges = [];

  for (const rawEntry of entries) {
    const trimmed = String(rawEntry).trim();
    if (!EDGE_REGEX.test(trimmed)) {
      invalid_entries.push(rawEntry);
      continue;
    }

    const [left, right] = trimmed.split("->");
    if (left === right) {
      invalid_entries.push(rawEntry);
      continue;
    }

    if (seenEdges.has(trimmed)) {
      if (!duplicateTracker.has(trimmed)) {
        duplicateTracker.add(trimmed);
        duplicate_edges.push(trimmed);
      }
      continue;
    }

    seenEdges.add(trimmed);
    uniqueValidEdges.push(trimmed);
  }

  const childrenMap = new Map();
  const undirectedAdj = new Map();
  const parentSet = new Set();
  const childSet = new Set();
  const allNodes = new Set();
  const assignedParent = new Map();
  const rootEncounterOrder = new Map();
  let edgeOrder = 0;

  const ensureMaps = (node) => {
    if (!childrenMap.has(node)) childrenMap.set(node, []);
    if (!undirectedAdj.has(node)) undirectedAdj.set(node, new Set());
  };

  for (const edge of uniqueValidEdges) {
    const [parent, child] = edge.split("->");
    ensureMaps(parent);
    ensureMaps(child);

    allNodes.add(parent);
    allNodes.add(child);

    if (assignedParent.has(child)) {
      continue;
    }

    assignedParent.set(child, parent);
    parentSet.add(parent);
    childSet.add(child);
    childrenMap.get(parent).push(child);
    undirectedAdj.get(parent).add(child);
    undirectedAdj.get(child).add(parent);

    if (!rootEncounterOrder.has(parent)) {
      rootEncounterOrder.set(parent, edgeOrder);
    }
    edgeOrder += 1;
  }

  if (allNodes.size === 0) {
    return {
      hierarchies: [],
      invalid_entries,
      duplicate_edges,
      summary: {
        total_trees: 0,
        total_cycles: 0,
        largest_tree_root: ""
      }
    };
  }

  const components = discoverComponents(allNodes, undirectedAdj);
  const hierarchiesWithOrder = [];
  let total_trees = 0;
  let total_cycles = 0;
  let largest_tree_root = "";
  let largest_tree_depth = 0;

  for (const nodes of components) {
    const componentSet = new Set(nodes);
    const roots = nodes.filter((node) => !childSet.has(node)).sort();
    const root = roots.length > 0 ? roots[0] : [...nodes].sort()[0];
    const has_cycle = hasCycleFromRoot(root, childrenMap, componentSet);

    const componentOrder = (() => {
      let best = Number.POSITIVE_INFINITY;
      for (const node of nodes) {
        if (rootEncounterOrder.has(node)) {
          best = Math.min(best, rootEncounterOrder.get(node));
        }
      }
      return best;
    })();

    if (has_cycle) {
      total_cycles += 1;
      hierarchiesWithOrder.push({
        order: componentOrder,
        payload: {
          root,
          tree: {},
          has_cycle: true
        }
      });
      continue;
    }

    total_trees += 1;
    const tree = { [root]: buildTree(root, childrenMap) };
    const depth = calcDepth(root, childrenMap);

    if (
      depth > largest_tree_depth ||
      (depth === largest_tree_depth && (largest_tree_root === "" || root < largest_tree_root))
    ) {
      largest_tree_depth = depth;
      largest_tree_root = root;
    }

    hierarchiesWithOrder.push({
      order: componentOrder,
      payload: {
        root,
        tree,
        depth
      }
    });
  }

  const hierarchies = hierarchiesWithOrder
    .sort((a, b) => {
      if (a.order === b.order) return a.payload.root.localeCompare(b.payload.root);
      return a.order - b.order;
    })
    .map((item) => item.payload);

  return {
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root: total_trees === 0 ? "" : largest_tree_root
    }
  };
}
