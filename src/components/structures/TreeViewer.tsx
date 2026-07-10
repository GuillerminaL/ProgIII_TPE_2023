import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BinarySearchTree, type TreeNode } from '../../data-structures/BinaryTree';
import { getLineColor, STRUCTURE_COMPLEXITY } from '../../constants';

interface TreeViewerProps {
  highlightedPath?: string[];
}

interface PositionedNode {
  data: { id: string; name: string; line: string };
  x: number;
  y: number;
  depth: number;
}

function layoutTree(root: TreeNode<{ id: string; name: string; line: string }> | null, width: number): PositionedNode[] {
  if (!root) return [];
  const nodes: PositionedNode[] = [];
  let x = 0;
  const maxDepth = getDepth(root);

  function inorder(node: TreeNode<{ id: string; name: string; line: string }> | null, depth: number) {
    if (!node) return;
    inorder(node.left, depth + 1);
    nodes.push({
      data: node.data,
      x: (x / Math.max(1, countNodes(root) - 1)) * (width - 80) + 40,
      y: depth * 60 + 30,
      depth,
    });
    x++;
    inorder(node.right, depth + 1);
  }
  inorder(root, 0);
  void maxDepth;
  return nodes;
}

function getDepth(node: TreeNode<{ id: string; name: string; line: string }> | null): number {
  if (!node) return 0;
  return 1 + Math.max(getDepth(node.left), getDepth(node.right));
}

function countNodes(node: TreeNode<{ id: string; name: string; line: string }> | null): number {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

function getEdges(root: TreeNode<{ id: string; name: string; line: string }> | null, nodes: PositionedNode[]): Array<{ from: PositionedNode; to: PositionedNode }> {
  const edges: Array<{ from: PositionedNode; to: PositionedNode }> = [];
  const nodeMap = new Map(nodes.map((n) => [n.data.id, n]));

  function traverse(node: TreeNode<{ id: string; name: string; line: string }> | null) {
    if (!node) return;
    if (node.left) {
      const from = nodeMap.get(node.data.id);
      const to = nodeMap.get(node.left.data.id);
      if (from && to) edges.push({ from, to });
      traverse(node.left);
    }
    if (node.right) {
      const from = nodeMap.get(node.data.id);
      const to = nodeMap.get(node.right.data.id);
      if (from && to) edges.push({ from, to });
      traverse(node.right);
    }
  }
  traverse(root);
  return edges;
}

export function TreeViewer({ highlightedPath = [] }: TreeViewerProps) {
  const { state } = useApp();

  const { nodes, edges, treeDepth } = useMemo(() => {
    const bst = new BinarySearchTree<{ id: string; name: string; line: string }>((a, b) =>
      a.name.localeCompare(b.name),
    );
    state.stations.forEach((s) => bst.insert({ id: s.id, name: s.name, line: s.line }));
    const root = bst.getRoot();
    const positioned = layoutTree(root, 600);
    const treeEdges = getEdges(root, positioned);
    return { nodes: positioned, edges: treeEdges, treeDepth: getDepth(root) };
  }, [state.stations]);

  const highlightSet = new Set(highlightedPath);
  const svgHeight = (treeDepth + 1) * 60 + 20;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-secondary">
          Stations inserted into a BST sorted alphabetically by name. Each comparison halves the search space.
        </p>
        <span className="badge bg-info/20 text-info">Complexity: {STRUCTURE_COMPLEXITY.TREE}</span>
      </div>
      <div className="overflow-x-auto rounded-lg bg-surface-2 p-2">
        <svg width="600" height={svgHeight} className="min-w-full">
          {edges.map((edge, i) => (
            <line
              key={i}
              x1={edge.from.x}
              y1={edge.from.y}
              x2={edge.to.x}
              y2={edge.to.y}
              stroke="#2a2a3e"
              strokeWidth={1.5}
            />
          ))}
          {nodes.map((node) => {
            const isHighlighted = highlightSet.has(node.data.id);
            return (
              <g key={node.data.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={16}
                  fill={isHighlighted ? '#4ade80' : getLineColor(node.data.line)}
                  stroke={isHighlighted ? '#4ade80' : '#2a2a3e'}
                  strokeWidth={isHighlighted ? 3 : 1.5}
                  className="transition-all duration-300"
                  style={isHighlighted ? { filter: 'drop-shadow(0 0 6px rgba(74,222,128,0.8))' } : undefined}
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  className="fill-white text-[8px] font-bold"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                >
                  {node.data.line}
                </text>
                <text
                  x={node.x}
                  y={node.y + 30}
                  textAnchor="middle"
                  className="fill-text-primary text-[8px]"
                >
                  {node.data.name.length > 10 ? node.data.name.slice(0, 8) + '…' : node.data.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-[10px] font-mono text-text-secondary">
        Tree depth: {treeDepth} · To find a station, worst case: {treeDepth} comparisons
      </p>
    </div>
  );
}
