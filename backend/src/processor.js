import { validateEntry } from "./validator.js";

const IDENTITY = {
  user_id: "fullname_ddmmyyyy",
  email_id: "your@college.edu",
  college_roll_number: "RA2211XXXXXXX"
};

export function processData(data) {
  const { validEdges, invalidEntries, duplicateEdges } = classifyEntries(data);
  const { childrenMap, parentMap, allNodes, edgeOrder } = buildGraph(validEdges);
  const components = findConnectedComponents(allNodes, childrenMap, edgeOrder);

  const hierarchies = [];
  for (const component of components) {
    hierarchies.push(processComponent(component, childrenMap, parentMap));
  }

  const summary = buildSummary(hierarchies);

  return {
    ...IDENTITY,
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary
  };
}

function classifyEntries(data) {
  const validEdges = [];
  const invalidEntries = [];
  const duplicateEdges = [];
  const seenEdges = new Set();
  const dupTracked = new Set();

  for (const entry of data) {
    const { valid, trimmed, parent, child } = validateEntry(entry);

    if (!valid) {
      invalidEntries.push(trimmed ?? String(entry));
      continue;
    }

    const edgeKey = `${parent}->${child}`;
    if (seenEdges.has(edgeKey)) {
      if (!dupTracked.has(edgeKey)) {
        duplicateEdges.push(edgeKey);
        dupTracked.add(edgeKey);
      }
      continue;
    }

    seenEdges.add(edgeKey);
    validEdges.push({ parent, child, raw: edgeKey });
  }

  return { validEdges, invalidEntries, duplicateEdges };
}

function buildGraph(validEdges) {
  const childrenMap = {};
  const parentMap = {};
  const allNodes = new Set();
  const edgeOrder = new Map();
  let idx = 0;

  for (const { parent, child } of validEdges) {
    if (parentMap[child] !== undefined) {
      continue;
    }

    allNodes.add(parent);
    allNodes.add(child);

    parentMap[child] = parent;
    if (!childrenMap[parent]) {
      childrenMap[parent] = [];
    }
    childrenMap[parent].push(child);

    if (!edgeOrder.has(parent)) edgeOrder.set(parent, idx);
    if (!edgeOrder.has(child)) edgeOrder.set(child, idx);
    idx += 1;
  }

  return { childrenMap, parentMap, allNodes, edgeOrder };
}

function findConnectedComponents(allNodes, childrenMap, edgeOrder) {
  const dsuParent = {};
  for (const node of allNodes) {
    dsuParent[node] = node;
  }

  function find(x) {
    if (dsuParent[x] !== x) dsuParent[x] = find(dsuParent[x]);
    return dsuParent[x];
  }

  function union(a, b) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) dsuParent[ra] = rb;
  }

  for (const node of allNodes) {
    for (const child of childrenMap[node] || []) {
      union(node, child);
    }
  }

  const groups = {};
  for (const node of allNodes) {
    const root = find(node);
    if (!groups[root]) groups[root] = [];
    groups[root].push(node);
  }

  return Object.values(groups)
    .sort((a, b) => {
      const orderA = Math.min(...a.map((n) => edgeOrder.get(n) ?? Number.POSITIVE_INFINITY));
      const orderB = Math.min(...b.map((n) => edgeOrder.get(n) ?? Number.POSITIVE_INFINITY));
      if (orderA !== orderB) return orderA - orderB;
      return [...a].sort()[0].localeCompare([...b].sort()[0]);
    })
    .map((arr) => new Set(arr));
}

function processComponent(componentSet, childrenMap, parentMap) {
  const nodes = Array.from(componentSet);
  const rootCandidates = nodes.filter((n) => parentMap[n] === undefined);

  let root;
  if (rootCandidates.length === 1) {
    root = rootCandidates[0];
  } else if (rootCandidates.length > 1) {
    root = rootCandidates.sort()[0];
  } else {
    root = nodes.sort()[0];
  }

  const hasCycle = detectCycle(root, componentSet, childrenMap);
  if (hasCycle) {
    return { root, tree: {}, has_cycle: true };
  }

  const tree = buildTree(root, childrenMap);
  const depth = calcDepth(root, childrenMap);
  return { root, tree, depth };
}

function detectCycle(startNode, componentSet, childrenMap) {
  const visited = new Set();
  const recStack = new Set();

  function dfs(node) {
    visited.add(node);
    recStack.add(node);

    for (const child of childrenMap[node] || []) {
      if (!componentSet.has(child)) continue;
      if (!visited.has(child)) {
        if (dfs(child)) return true;
      } else if (recStack.has(child)) {
        return true;
      }
    }

    recStack.delete(node);
    return false;
  }

  if (startNode && !visited.has(startNode) && dfs(startNode)) {
    return true;
  }
  for (const node of componentSet) {
    if (!visited.has(node) && dfs(node)) return true;
  }
  return false;
}

function buildTree(root, childrenMap) {
  const result = {};
  const children = childrenMap[root] || [];
  for (const child of children) {
    result[child] = buildTree(child, childrenMap)[child];
  }
  return { [root]: result };
}

function calcDepth(node, childrenMap) {
  const children = childrenMap[node] || [];
  if (children.length === 0) return 1;
  return 1 + Math.max(...children.map((c) => calcDepth(c, childrenMap)));
}

function buildSummary(hierarchies) {
  const trees = hierarchies.filter((h) => !h.has_cycle);
  const cycles = hierarchies.filter((h) => h.has_cycle === true);

  let largestTreeRoot = "";
  if (trees.length > 0) {
    const sorted = [...trees].sort((a, b) => {
      if (b.depth !== a.depth) return b.depth - a.depth;
      return a.root.localeCompare(b.root);
    });
    largestTreeRoot = sorted[0].root;
  }

  return {
    total_trees: trees.length,
    total_cycles: cycles.length,
    largest_tree_root: largestTreeRoot
  };
}
