import type { AlgorithmRunResult } from '../../algorithms/types';
import { ALGORITHM_COMPLEXITY } from '../../constants';
import { formatTime } from '../../utils/graphHelpers';

interface AlgorithmCardProps {
  runResult: AlgorithmRunResult;
  isWinner?: boolean;
}

export function AlgorithmCard({ runResult, isWinner }: AlgorithmCardProps) {
  const { type, result, color } = runResult;

  return (
    <div
      className={`card relative overflow-hidden p-4 transition-all duration-300 ${
        isWinner ? 'border-success shadow-[0_0_12px_rgba(74,222,128,0.3)]' : ''
      }`}
    >
      {isWinner && (
        <div className="absolute right-0 top-0 rounded-bl-lg bg-success px-2 py-0.5 text-[10px] font-bold text-bg">
          WINNER
        </div>
      )}
      <div className="mb-3 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-sm font-semibold text-text-primary">{type}</h3>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-text-secondary">Nodes Visited</span>
          <span className="font-mono font-medium text-text-primary">{result.nodesVisited}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-text-secondary">Optimal Path</span>
          <span className="font-mono font-medium text-text-primary">
            {result.optimalPath.length > 0 ? `${result.optimalPath.length} stops` : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-text-secondary">Total Cost</span>
          <span className="font-mono font-medium text-text-primary">
            {result.totalCost > 0 ? `${result.totalCost} min` : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-text-secondary">Exec. Time</span>
          <span className="font-mono font-medium text-text-primary">{formatTime(result.executionTimeMs)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-text-secondary">Complexity</span>
          <span className="font-mono font-medium text-text-primary">{ALGORITHM_COMPLEXITY[type]}</span>
        </div>
      </div>
      {result.optimalPath.length > 1 && (
        <div className="mt-3 rounded-lg bg-surface-2 p-2">
          <p className="mb-1 text-[10px] uppercase text-text-secondary">Path</p>
          <p className="text-[10px] font-mono leading-relaxed text-text-primary">
            {result.optimalPath.join(' → ')}
          </p>
        </div>
      )}
    </div>
  );
}
