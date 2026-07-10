import type { AlgorithmResult } from './types';
import type { Graph } from '../data-structures/Graph';

/**
 * Dijkstra's Algorithm
 *
 * Finds the shortest path from start to end weighted by edge costs
 * (travel time in minutes). Uses a priority queue (min-heap) to always
 * expand the node with the lowest known distance. Guarantees the
 * optimal weighted path for graphs with non-negative weights.
 *
 * @param graph - The graph to search
 * @param startId - Starting station id
 * @param endId - Target station id
 * @returns AlgorithmResult with visited order and optimal weighted path
 */
export function dijkstra(graph: Graph, startId: string, endId: string): AlgorithmResult {
  const t0 = performance.now();
  const visitedOrder: string[] = [];
  const distances = new Map<string, number>();
  const parent = new Map<string, string | null>();
  const visited = new Set<string>();

  // Min-heap: array sorted by distance (simple binary heap)
  const heap = new MinHeap();

  // Initialize all distances to Infinity, start to 0
  graph.getAllNodes().forEach((station) => {
    distances.set(station.id, Infinity);
    parent.set(station.id, null);
  });
  distances.set(startId, 0);
  heap.push({ id: startId, dist: 0 });

  while (heap.size > 0) {
    const { id: current, dist: currentDist } = heap.pop();

    if (visited.has(current)) continue;
    visited.add(current);
    visitedOrder.push(current);

    if (current === endId) break;

    const neighbors = graph.getNeighbors(current);
    for (const { id: neighborId, weight } of neighbors) {
      if (visited.has(neighborId)) continue;
      const newDist = currentDist + weight;
      if (newDist < (distances.get(neighborId) ?? Infinity)) {
        distances.set(neighborId, newDist);
        parent.set(neighborId, current);
        heap.push({ id: neighborId, dist: newDist });
      }
    }
  }

  const optimalPath = reconstructPath(parent, endId);
  const totalCost = distances.get(endId) ?? 0;

  return {
    visitedOrder,
    optimalPath,
    totalCost: totalCost === Infinity ? 0 : totalCost,
    nodesVisited: visitedOrder.length,
    executionTimeMs: performance.now() - t0,
  };
}

interface HeapItem {
  id: string;
  dist: number;
}

class MinHeap {
  private items: HeapItem[] = [];

  get size(): number {
    return this.items.length;
  }

  push(item: HeapItem): void {
    this.items.push(item);
    this.bubbleUp(this.items.length - 1);
  }

  pop(): HeapItem {
    if (this.items.length === 0) throw new Error('Heap empty');
    const min = this.items[0];
    const last = this.items.pop()!;
    if (this.items.length > 0) {
      this.items[0] = last;
      this.bubbleDown(0);
    }
    return min;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.items[index].dist >= this.items[parent].dist) break;
      [this.items[index], this.items[parent]] = [this.items[parent], this.items[index]];
      index = parent;
    }
  }

  private bubbleDown(index: number): void {
    const n = this.items.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      if (left < n && this.items[left].dist < this.items[smallest].dist) smallest = left;
      if (right < n && this.items[right].dist < this.items[smallest].dist) smallest = right;
      if (smallest === index) break;
      [this.items[index], this.items[smallest]] = [this.items[smallest], this.items[index]];
      index = smallest;
    }
  }
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
