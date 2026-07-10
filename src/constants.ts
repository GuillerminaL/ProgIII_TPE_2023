import type { AlgorithmType } from './algorithms/types';

export const COLORS = {
  bg: '#0a0a0f',
  surface: '#12121a',
  surface2: '#1a1a2e',
  border: '#2a2a3e',
  primary: '#6366f1',
  accent: '#22d3ee',
  success: '#4ade80',
  warning: '#fb923c',
  info: '#60a5fa',
  purple: '#a78bfa',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
} as const;

export const ALGORITHM_COLORS: Record<AlgorithmType, string> = {
  BFS: '#60a5fa',
  DFS: '#fb923c',
  DIJKSTRA: '#a78bfa',
};

export const ALGORITHM_COMPLEXITY: Record<AlgorithmType, string> = {
  BFS: 'O(V + E)',
  DFS: 'O(V + E)',
  DIJKSTRA: 'O((V + E) log V)',
};

export const METRO_LINE_COLORS: Record<string, string> = {
  A: '#ef4444',
  B: '#3b82f6',
  C: '#22c55e',
  D: '#f59e0b',
  E: '#8b5cf6',
  H: '#ec4899',
  '1': '#e11d48',
  '2': '#0891b2',
  '3': '#16a34a',
  '6': '#d97706',
  '10': '#7c3aed',
  Central: '#dc2626',
  Jubilee: '#6b7280',
  Northern: '#1f2937',
  Victoria: '#0ea5e9',
};

export function getLineColor(line: string): string {
  return METRO_LINE_COLORS[line] ?? '#6366f1';
}

export const SPEED_MIN_MS = 50;
export const SPEED_MAX_MS = 1000;
export const SPEED_DEFAULT_MS = 400;
export const NODE_RADIUS = 22;

export const ALGORITHM_DESCRIPTIONS: Record<AlgorithmType, string> = {
  BFS: 'Breadth-First Search explores all neighbors at the current depth before moving deeper. Finds the shortest path in terms of number of stops (unweighted).',
  DFS: 'Depth-First Search dives as deep as possible along each branch before backtracking. Does not guarantee shortest path but uses less memory.',
  DIJKSTRA: "Dijkstra's algorithm finds the shortest path by total weight (travel time). Guarantees the optimal weighted path from start to end.",
};

export const STRUCTURE_COMPLEXITY = {
  LIST: 'O(n)',
  TREE: 'O(log n)',
  GRAPH: 'O(1)',
} as const;

export const EXPORT_FOOTER = 'Generated with Subway Algorithm Lab | Portfolio Project';
