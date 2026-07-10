import { ReactFlowProvider, Background } from '@xyflow/react';
import { useApp } from '../../context/AppContext';
import { useAlgorithmRunner } from '../../hooks/useAlgorithmRunner';
import { useAnimationEngine } from '../../hooks/useAnimationEngine';
import { buildFlowNodes, buildFlowEdges } from '../../utils/graphHelpers';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';
import { ALGORITHM_COLORS } from '../../constants';
import type { AlgorithmType, AlgorithmRunResult } from '../../algorithms/types';
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { ReactFlow, MiniMap, type NodeTypes, type EdgeTypes } from '@xyflow/react';

interface MiniCanvasProps {
  result: AlgorithmRunResult;
  speedMs: number;
}

function MiniCanvas({ result, speedMs }: MiniCanvasProps) {
  const { state } = useApp();
  const { currentStep, isComplete, animatedNodes, animatedPath, isAnimating, play, pause, reset, stepForward, stepBackward } =
    useAnimationEngine({
      visitedOrder: result.result.visitedOrder,
      optimalPath: result.result.optimalPath,
      speedMs,
    });

  const nodes = useMemo(
    () =>
      buildFlowNodes({
        stations: state.stations,
        startId: state.startId,
        endId: state.endId,
        animatedNodes,
        animatedPath,
        isComplete,
      }),
    [state.stations, state.startId, state.endId, animatedNodes, animatedPath, isComplete],
  );

  const edges = useMemo(
    () =>
      buildFlowEdges({
        connections: state.connections,
        animatedNodes,
        animatedPath,
        isComplete,
      }),
    [state.connections, animatedNodes, animatedPath, isComplete],
  );

  const nodeTypes: NodeTypes = { subway: CustomNode };
  const edgeTypes: EdgeTypes = { subway: CustomEdge };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: result.color }} />
          <span className="text-xs font-semibold text-text-primary">{result.type}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => (isAnimating ? pause() : play())} className="btn-icon !h-7 !w-7 text-xs" aria-label="Play/Pause">
            {isAnimating ? '⏸' : '▶'}
          </button>
          <button onClick={stepBackward} className="btn-icon !h-7 !w-7 text-xs" aria-label="Step back">⏮</button>
          <button onClick={stepForward} className="btn-icon !h-7 !w-7 text-xs" aria-label="Step forward">⏭</button>
          <button onClick={reset} className="btn-icon !h-7 !w-7 text-xs" aria-label="Reset">↺</button>
        </div>
      </div>

      <div className="relative h-56">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          panOnDrag={false}
          className="bg-bg"
        >
          <Background color="#2a2a3e" gap={16} size={1} />
        </ReactFlow>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-border px-3 py-2 text-center">
        <div>
          <p className="text-[9px] uppercase text-text-secondary">Nodes</p>
          <p className="font-mono text-xs font-medium text-text-primary">{result.result.nodesVisited}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase text-text-secondary">Stops</p>
          <p className="font-mono text-xs font-medium text-text-primary">{result.result.optimalPath.length}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase text-text-secondary">Cost</p>
          <p className="font-mono text-xs font-medium" style={{ color: result.color }}>
            {result.result.totalCost > 0 ? `${result.result.totalCost}m` : 'N/A'}
          </p>
        </div>
      </div>

      <div className="border-t border-border px-3 py-1.5 text-center">
        <span className="font-mono text-[10px] text-text-secondary">
          Step {currentStep}/{result.result.visitedOrder.length}
        </span>
      </div>
    </div>
  );
}

export function ComparisonView() {
  const { state, dispatch } = useApp();
  const { runAll } = useAlgorithmRunner();
  const [results, setResults] = useState<AlgorithmRunResult[]>([]);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current && state.startId && state.endId) {
      hasRun.current = true;
      const res = runAll();
      if (res.length > 0) setResults(res);
    }
  }, [state.startId, state.endId, runAll]);

  useEffect(() => {
    hasRun.current = false;
    setResults([]);
  }, [state.network.id, state.mode]);

  const minCost = results.length > 0
    ? Math.min(...results.map((r) => r.result.totalCost).filter((c) => c > 0))
    : 0;

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">Simultaneous Comparison Mode</h2>
        <button
          onClick={() => {
            const res = runAll();
            if (res.length > 0) setResults(res);
          }}
          disabled={!state.startId || !state.endId}
          className="btn-primary text-xs"
        >
          ▶ Run All Algorithms
        </button>
      </div>

      {results.length === 0 ? (
        <div className="card flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="text-3xl opacity-30">⚡</div>
          <p className="text-xs text-text-secondary">
            Select start and end stations, then click "Run All Algorithms" to see BFS, DFS, and Dijkstra
            execute simultaneously side by side.
          </p>
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
          {results.map((r) => (
            <div key={r.type} className="relative">
              {r.result.totalCost > 0 && r.result.totalCost === minCost && (
                <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-success px-3 py-0.5 text-[10px] font-bold text-bg shadow-lg">
                  OPTIMAL PATH
                </div>
              )}
              <MiniCanvas result={r} speedMs={state.speedMs} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
