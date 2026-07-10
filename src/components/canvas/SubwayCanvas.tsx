import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type OnConnect,
  type NodeTypes,
  type EdgeTypes,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useApp } from '../../context/AppContext';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';
import { useAnimationEngine } from '../../hooks/useAnimationEngine';
import { useNetworkEditor } from '../../hooks/useNetworkEditor';
import { buildFlowNodes, buildFlowEdges } from '../../utils/graphHelpers';

interface SubwayCanvasProps {
  result?: { visitedOrder: string[]; optimalPath: string[] } | null;
  algorithmColor?: string;
  showControls?: boolean;
  height?: string;
  compact?: boolean;
}

const nodeTypes: NodeTypes = { subway: CustomNode };
const edgeTypes: EdgeTypes = { subway: CustomEdge };

function SubwayCanvasInner({
  result = null,
  showControls = true,
  height = '100%',
  compact = false,
}: SubwayCanvasProps) {
  const { state, dispatch } = useApp();
  const { updatePosition } = useNetworkEditor();
  const clickCountRef = useRef(0);

  const visitedOrder = result?.visitedOrder ?? [];
  const optimalPath = result?.optimalPath ?? [];

  const { currentStep, isComplete, animatedNodes, animatedPath, isAnimating, play, pause, reset, stepForward, stepBackward } =
    useAnimationEngine({
      visitedOrder,
      optimalPath,
      speedMs: state.speedMs,
    });

  const flowNodes = useMemo(
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

  const flowEdges = useMemo(
    () =>
      buildFlowEdges({
        connections: state.connections,
        animatedNodes,
        animatedPath,
        isComplete,
      }),
    [state.connections, animatedNodes, animatedPath, isComplete],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  useEffect(() => {
    setNodes(flowNodes);
  }, [flowNodes, setNodes]);

  useEffect(() => {
    setEdges(flowEdges);
  }, [flowEdges, setEdges]);

  const onNodeClick = useCallback(
    (_evt: React.MouseEvent, node: Node) => {
      clickCountRef.current++;
      const count = clickCountRef.current;
      if (count === 1) {
        dispatch({ type: 'SET_START', payload: node.id });
      } else if (count === 2) {
        dispatch({ type: 'SET_END', payload: node.id });
      } else {
        clickCountRef.current = 0;
        dispatch({ type: 'SET_START', payload: null });
        dispatch({ type: 'SET_END', payload: null });
      }
    },
    [dispatch],
  );

  const onNodeDragStop = useCallback(
    (_evt: unknown, node: Node) => {
      updatePosition(node.id, node.position.x, node.position.y);
    },
    [updatePosition],
  );

  const onConnect: OnConnect = useCallback(() => {}, []);

  return (
    <div className="relative w-full" style={{ height }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={!isAnimating}
        className="bg-bg"
      >
        <Background color="#2a2a3e" gap={20} size={1} />
        {showControls && !compact && <Controls showInteractive={false} />}
        {showControls && !compact && (
          <MiniMap
            nodeColor={(n) => (n.data as { lineColor?: string }).lineColor ?? '#6366f1'}
            maskColor="rgba(10,10,15,0.7)"
            className="!bg-surface"
          />
        )}
      </ReactFlow>

      {result && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          <button
            onClick={() => (isAnimating ? pause() : play())}
            className="btn-icon"
            aria-label={isAnimating ? 'Pause' : 'Play'}
          >
            {isAnimating ? '⏸' : '▶'}
          </button>
          <button onClick={stepBackward} className="btn-icon" aria-label="Step backward">
            ⏮
          </button>
          <button onClick={stepForward} className="btn-icon" aria-label="Step forward">
            ⏭
          </button>
          <button onClick={reset} className="btn-icon" aria-label="Reset">
            ↺
          </button>
          <div className="ml-2 flex items-center rounded-lg bg-surface-2 px-3 text-xs font-mono text-text-secondary">
            {currentStep}/{visitedOrder.length}
          </div>
        </div>
      )}
    </div>
  );
}

export function SubwayCanvas(props: SubwayCanvasProps) {
  return (
    <ReactFlowProvider>
      <SubwayCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
