import { useState, useMemo } from 'react';
import type { AlgorithmRunResult } from '../../algorithms/types';
import { ALGORITHM_COLORS, STRUCTURE_COMPLEXITY } from '../../constants';

interface ComparisonChartProps {
  results: AlgorithmRunResult[];
}

interface BarData {
  label: string;
  value: number;
  color: string;
  displayValue: string;
}

export function ComparisonChart({ results }: ComparisonChartProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const nodesVisitedData: BarData[] = useMemo(
    () =>
      results.map((r) => ({
        label: r.type,
        value: r.result.nodesVisited,
        color: ALGORITHM_COLORS[r.type],
        displayValue: `${r.result.nodesVisited} nodes`,
      })),
    [results],
  );

  const maxNodesVisited = Math.max(...nodesVisitedData.map((d) => d.value), 1);

  const structureComparisonData: BarData[] = useMemo(() => {
    const n = results[0]?.result.nodesVisited ?? 10;
    return [
      { label: 'List O(n)', value: n, color: '#fb923c', displayValue: `${n} comparisons` },
      { label: 'Tree O(log n)', value: Math.ceil(Math.log2(Math.max(n, 2))), color: '#60a5fa', displayValue: `${Math.ceil(Math.log2(Math.max(n, 2)))} comparisons` },
      { label: 'Graph O(1)', value: 1, color: '#4ade80', displayValue: '1 lookup' },
    ];
  }, [results]);

  const maxStructureValue = Math.max(...structureComparisonData.map((d) => d.value), 1);

  return (
    <div className="card space-y-5 p-4">
      <h3 className="text-sm font-semibold text-text-primary">Comparison Chart</h3>

      <div>
        <p className="mb-2 text-xs font-medium text-text-secondary">Nodes Visited by Algorithm</p>
        <div className="flex h-32 items-end justify-around gap-3 border-b border-border pb-1">
          {nodesVisitedData.map((bar) => (
            <div
              key={bar.label}
              className="flex h-full flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setHovered(bar.label)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === bar.label && (
                <div className="mb-1 rounded-md bg-surface-2 px-2 py-1 text-[10px] font-mono text-text-primary shadow-lg">
                  {bar.displayValue}
                </div>
              )}
              <div
                className="w-full max-w-[50px] origin-bottom rounded-t-md transition-all duration-700 ease-out"
                style={{
                  height: `${(bar.value / maxNodesVisited) * 100}%`,
                  backgroundColor: bar.color,
                  minHeight: '4px',
                }}
              />
              <span className="mt-1 text-[10px] font-medium text-text-secondary">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-text-secondary">
          Simulated Search Cost by Data Structure
        </p>
        <div className="flex h-32 items-end justify-around gap-3 border-b border-border pb-1">
          {structureComparisonData.map((bar) => (
            <div
              key={bar.label}
              className="flex h-full flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setHovered(bar.label)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === bar.label && (
                <div className="mb-1 rounded-md bg-surface-2 px-2 py-1 text-[10px] font-mono text-text-primary shadow-lg">
                  {bar.displayValue}
                </div>
              )}
              <div
                className="w-full max-w-[60px] origin-bottom rounded-t-md transition-all duration-700 ease-out"
                style={{
                  height: `${(bar.value / maxStructureValue) * 100}%`,
                  backgroundColor: bar.color,
                  minHeight: '4px',
                }}
              />
              <span className="mt-1 text-[10px] font-medium text-text-secondary">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface-2 p-3">
        <p className="mb-1 text-xs font-semibold text-accent">Why does structure matter?</p>
        <p className="text-[11px] leading-relaxed text-text-secondary">
          Searching in a List requires visiting up to N stations sequentially. A Binary Tree halves the
          search space each step. The Graph's adjacency list gives instant neighbor lookup — that's why
          pathfinding algorithms use graphs!
        </p>
        <div className="mt-2 flex gap-2">
          <span className="badge bg-warning/20 text-warning">List: {STRUCTURE_COMPLEXITY.LIST}</span>
          <span className="badge bg-info/20 text-info">Tree: {STRUCTURE_COMPLEXITY.TREE}</span>
          <span className="badge bg-success/20 text-success">Graph: {STRUCTURE_COMPLEXITY.GRAPH}</span>
        </div>
      </div>
    </div>
  );
}
