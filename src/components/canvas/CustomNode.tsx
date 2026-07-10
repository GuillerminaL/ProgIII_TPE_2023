import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { NODE_RADIUS } from '../../constants';
import type { NodeState } from '../../algorithms/types';

interface SubwayNodeData {
  label: string;
  line: string;
  lineColor: string;
  nodeState: NodeState;
}

const stateStyles: Record<NodeState, string> = {
  default: 'border-2',
  start: 'border-4 border-success animate-pulse-ring',
  end: 'border-4 border-red-500 animate-pulse-ring-end',
  visited: 'border-2 border-info',
  'optimal-path': 'border-4 border-success animate-glow-pulse',
};

const stateGlow: Record<NodeState, string> = {
  default: '',
  start: 'shadow-[0_0_12px_rgba(74,222,128,0.6)]',
  end: 'shadow-[0_0_12px_rgba(239,68,68,0.6)]',
  visited: 'shadow-[0_0_8px_rgba(96,165,250,0.5)]',
  'optimal-path': 'shadow-[0_0_14px_rgba(74,222,128,0.8)]',
};

function SubwayNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as SubwayNodeData;
  const { label, line, lineColor, nodeState } = nodeData;
  const size = NODE_RADIUS * 2;

  return (
    <div className="relative flex flex-col items-center select-none">
      <Handle
        type="source"
        position={Position.Top}
        style={{ opacity: 0, top: 0 }}
        isConnectable={false}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, top: 0 }}
        isConnectable={false}
      />
      <div
        className={`rounded-full flex items-center justify-center transition-all duration-300 ${stateStyles[nodeState]} ${stateGlow[nodeState]}`}
        style={{
          width: size,
          height: size,
          backgroundColor: nodeState === 'visited' ? '#1a1a2e' : lineColor,
          borderColor: nodeState === 'visited' ? '#60a5fa' : nodeState === 'optimal-path' ? '#4ade80' : lineColor,
        }}
      >
        <span className="text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {line}
        </span>
      </div>
      <div
        className="mt-1.5 max-w-[120px] text-center text-xs font-medium text-text-primary whitespace-nowrap"
        style={{
          textShadow: '0 1px 4px rgba(0,0,0,0.9)',
        }}
      >
        {label}
      </div>
      {nodeState === 'start' && (
        <div className="absolute -top-5 text-[10px] font-bold text-success uppercase tracking-wide">
          Start
        </div>
      )}
      {nodeState === 'end' && (
        <div className="absolute -top-5 text-[10px] font-bold text-red-400 uppercase tracking-wide">
          End
        </div>
      )}
    </div>
  );
}

export const CustomNode = memo(SubwayNodeComponent);
