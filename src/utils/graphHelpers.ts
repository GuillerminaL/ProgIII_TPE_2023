import type { Station, Connection } from '../algorithms/types';
import type { Edge, Node } from '@xyflow/react';
import { getLineColor } from '../constants';
import type { NodeState, EdgeState } from '../algorithms/types';

interface BuildNodesOptions {
  stations: Station[];
  startId: string | null;
  endId: string | null;
  animatedNodes: Set<string>;
  animatedPath: string[];
  isComplete: boolean;
}

export function buildFlowNodes({
  stations,
  startId,
  endId,
  animatedNodes,
  animatedPath,
  isComplete,
}: BuildNodesOptions): Node[] {
  const pathSet = new Set(isComplete ? animatedPath : []);
  return stations.map((station) => {
    let nodeState: NodeState = 'default';
    if (station.id === startId) nodeState = 'start';
    else if (station.id === endId) nodeState = 'end';
    else if (pathSet.has(station.id)) nodeState = 'optimal-path';
    else if (animatedNodes.has(station.id)) nodeState = 'visited';

    return {
      id: station.id,
      type: 'subway',
      position: { x: station.x, y: station.y },
      data: {
        label: station.name,
        line: station.line,
        lineColor: getLineColor(station.line),
        nodeState,
      },
    };
  });
}

interface BuildEdgesOptions {
  connections: Connection[];
  animatedNodes: Set<string>;
  animatedPath: string[];
  isComplete: boolean;
}

export function buildFlowEdges({
  connections,
  animatedNodes,
  animatedPath,
  isComplete,
}: BuildEdgesOptions): Edge[] {
  const pathSet = new Set(isComplete ? animatedPath : []);
  return connections.map((conn, idx) => {
    const edgeKey = `${conn.from}-${conn.to}`;
    const reverseKey = `${conn.to}-${conn.from}`;
    const inPath =
      pathSet.has(conn.from) &&
      pathSet.has(conn.to) &&
      isPathEdge(conn.from, conn.to, animatedPath);
    const bothVisited = animatedNodes.has(conn.from) && animatedNodes.has(conn.to);

    let edgeState: EdgeState = 'default';
    if (inPath) edgeState = 'optimal-path';
    else if (bothVisited) edgeState = 'visited';

    return {
      id: `e-${idx}-${edgeKey}`,
      source: conn.from,
      target: conn.to,
      type: 'subway',
      animated: edgeState === 'visited',
      data: {
        weight: conn.weight,
        line: conn.line,
        lineColor: getLineColor(conn.line),
        edgeState,
        reverseKey,
      },
    };
  });
}

function isPathEdge(from: string, to: string, path: string[]): boolean {
  for (let i = 0; i < path.length - 1; i++) {
    if ((path[i] === from && path[i + 1] === to) || (path[i] === to && path[i + 1] === from)) {
      return true;
    }
  }
  return false;
}

export function formatTime(ms: number): string {
  if (ms < 1) return '<1ms';
  if (ms < 10) return `~${ms.toFixed(1)}ms`;
  return `~${Math.round(ms)}ms`;
}
