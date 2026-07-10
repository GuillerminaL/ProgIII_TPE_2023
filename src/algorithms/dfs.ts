import type { AlgorithmResult } from './types';
import type { Graph } from '../data-structures/Graph';

/**
 * Depth-First Search (DFS)
 *
 * Dives as deep as possible along each branch before backtracking.
 * Uses a stack (LIFO). DFS does NOT guarantee the shortest path,
 * but it uses less memory than BFS and is useful for topological
 * sorting, cycle detection, and connectivity analysis.
 *
 * @param graph - The graph to search
 * @param startId - Starting station id
 * @param endId - Target station id
 * @returns AlgorithmResult with visited order and path
 */
export function dfs(graph: Graph, startId: string, endId: string): AlgorithmResult {
  const t0 = performance.now();
  const visitedOrder: string[] = [];
  const visited = new Set<string>();
  const parent = new Map<string, string | null>();

  parent.set(startId, null);
  dfsVisit(graph, startId, endId, visited, visitedOrder, parent);

  const optimalPath = reconstructPath(parent, endId);
  const totalCost = computePathCost(graph, optimalPath);

  return {
    visitedOrder,
    optimalPath,
    totalCost,
    nodesVisited: visitedOrder.length,
    executionTimeMs: performance.now() - t0,
  };
}

function dfsVisit(
  graph: Graph,
  current: string,
  endId: string,
  visited: Set<string>,
  visitedOrder: string[],
  parent: Map<string, string | null>,
): boolean {
  visited.add(current);
  visitedOrder.push(current);

  if (current === endId) return true;

  const neighbors = graph.getNeighbors(current);
  for (const { id } of neighbors) {
    if (!visited.has(id)) {
      parent.set(id, current);
      if (dfsVisit(graph, id, endId, visited, visitedOrder, parent)) return true;
    }
  }
  return false;
}

function reconstructPath(parent: Map<string, string | null>, endId: string): string[] {
  const path: string[] = [];
  let current: string | null = endId;
  if (!parent.has(endId)) return path;
  while (current !== null) {
    path.unshift(current);
    current = parent.get(current) ?? null;
  }
  return path;
}

function computePathCost(graph: Graph, path: string[]): number {
  if (path.length < 2) return 0;
  let cost = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const neighbors = graph.getNeighbors(path[i]);
    const next = neighbors.find((n) => n.id === path[i + 1]);
    if (next) cost += next.weight;
  }
  return cost;
}
