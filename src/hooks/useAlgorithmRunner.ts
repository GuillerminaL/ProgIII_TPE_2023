import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import type { Graph } from '../data-structures/Graph';
import type { AlgorithmType, AlgorithmResult, AlgorithmRunResult } from '../algorithms/types';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { dijkstra } from '../algorithms/dijkstra';
import { ALGORITHM_COLORS } from '../constants';

function runAlgorithm(
  type: AlgorithmType,
  graph: Graph,
  startId: string,
  endId: string,
): AlgorithmResult {
  switch (type) {
    case 'BFS':
      return bfs(graph, startId, endId);
    case 'DFS':
      return dfs(graph, startId, endId);
    case 'DIJKSTRA':
      return dijkstra(graph, startId, endId);
    default:
      return bfs(graph, startId, endId);
  }
}

export function useAlgorithmRunner() {
  const { state, dispatch } = useApp();

  const runSingle = useCallback((): AlgorithmRunResult | null => {
    if (!state.startId || !state.endId) return null;
    const result = runAlgorithm(state.selectedAlgorithm, state.graph, state.startId, state.endId);
    const runResult: AlgorithmRunResult = {
      type: state.selectedAlgorithm,
      result,
      color: ALGORITHM_COLORS[state.selectedAlgorithm],
    };
    dispatch({ type: 'SET_RESULTS', payload: [runResult] });
    return runResult;
  }, [state.selectedAlgorithm, state.graph, state.startId, state.endId, dispatch]);

  const runAll = useCallback((): AlgorithmRunResult[] => {
    if (!state.startId || !state.endId) return [];
    const types: AlgorithmType[] = ['BFS', 'DFS', 'DIJKSTRA'];
    const results: AlgorithmRunResult[] = types.map((type) => ({
      type,
      result: runAlgorithm(type, state.graph, state.startId!, state.endId!),
      color: ALGORITHM_COLORS[type],
    }));
    dispatch({ type: 'SET_RESULTS', payload: results });
    return results;
  }, [state.startId, state.endId, state.graph, dispatch]);

  return { runSingle, runAll };
}
