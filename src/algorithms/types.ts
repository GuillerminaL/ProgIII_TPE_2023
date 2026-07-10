export interface Station {
  id: string;
  name: string;
  line: string;
  x: number;
  y: number;
}

export interface Connection {
  from: string;
  to: string;
  weight: number;
  line: string;
}

export interface AlgorithmResult {
  visitedOrder: string[];
  optimalPath: string[];
  totalCost: number;
  nodesVisited: number;
  executionTimeMs: number;
}

export type AlgorithmType = 'BFS' | 'DFS' | 'DIJKSTRA';
export type StructureType = 'LIST' | 'TREE' | 'GRAPH';

export interface MetroNetwork {
  id: string;
  name: string;
  city: string;
  stations: Station[];
  connections: Connection[];
}

export interface AlgorithmMetrics {
  type: AlgorithmType;
  result: AlgorithmResult | null;
  color: string;
}

export interface AlgorithmRunResult {
  type: AlgorithmType;
  result: AlgorithmResult;
  color: string;
}

export type NodeState = 'default' | 'start' | 'end' | 'visited' | 'optimal-path';
export type EdgeState = 'default' | 'visited' | 'optimal-path';
