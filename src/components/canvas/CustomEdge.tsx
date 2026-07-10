import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react';
import type { EdgeState } from '../../algorithms/types';

interface SubwayEdgeData {
  weight: number;
  line: string;
  lineColor: string;
  edgeState: EdgeState;
}

const edgeColors: Record<EdgeState, string> = {
  default: '#4a4a5e',
  visited: '#60a5fa',
  'optimal-path': '#4ade80',
};

const edgeWidths: Record<EdgeState, number> = {
  default: 2,
  visited: 3,
  'optimal-path': 5,
};

function SubwayEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const edgeData = data as unknown as SubwayEdgeData;
  const edgeState = edgeData?.edgeState ?? 'default';
  const weight = edgeData?.weight ?? 0;

  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const color = edgeState === 'optimal-path' ? '#4ade80' : edgeState === 'visited' ? '#60a5fa' : edgeColors[edgeState];
  const width = edgeWidths[edgeState];
  const isAnimated = edgeState === 'visited';
  const isOptimal = edgeState === 'optimal-path';

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke: color,
          strokeWidth: width,
          strokeDasharray: isAnimated ? '6 4' : isOptimal ? undefined : undefined,
          animation: isAnimated ? 'dash-flow 1s linear infinite' : undefined,
          filter: isOptimal ? 'drop-shadow(0 0 6px rgba(74,222,128,0.8))' : undefined,
          transition: 'stroke 0.3s, stroke-width 0.3s',
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="absolute pointer-events-auto nodrag nopan"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            opacity: selected || edgeState !== 'default' ? 1 : 0,
            transition: 'opacity 0.2s',
          }}
        >
          <div
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold ${
              isOptimal
                ? 'bg-success/20 text-success border border-success/40'
                : edgeState === 'visited'
                  ? 'bg-info/20 text-info border border-info/40'
                  : 'bg-surface border border-border text-text-secondary'
            }`}
          >
            {weight}m
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export const CustomEdge = memo(SubwayEdgeComponent);
