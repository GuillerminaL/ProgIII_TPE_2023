import type { AlgorithmResult } from './types';
import type { Graph } from '../data-structures/Graph';

/**
 * Breadth-First Search (BFS)
 *
 * Explores the graph level by level — all neighbors at the current depth
 * are visited before moving deeper. Uses a FIFO queue. In an unweighted
 * graph, BFS guarantees the shortest path (fewest edges).
 *
 * @param graph - The graph to search
 * @param startId - Starting station id
 * @param endId - Target station id
 * @returns AlgorithmResult with visited order and path
 */
export function bfs(graph: Graph, startId: string, endId: string): AlgorithmResult {
  const t0 = performance.now();
  const visitedOrder: string[] = [];
  const visited = new Set<string>();
  const parent = new Map<string, string | null>();
  const queue: string[] = [startId];

  visited.add(startId);
  parent.set(startId, null);

  while (queue.length > 0) {
    const current = queue.shift()!;
    visitedOrder.push(current);

    if (current === endId) break;

    const neighbors = graph.getNeighbors(current);
    for (const { id } of neighbors) {
      if (!visited.has(id)) {
        visited.add(id);
        parent.set(id, current);
        queue.push(id);
      }
    }
  }

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
