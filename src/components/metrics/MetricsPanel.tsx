import { useApp } from '../../context/AppContext';
import { AlgorithmCard } from './AlgorithmCard';
import { ComparisonChart } from './ComparisonChart';

export function MetricsPanel() {
  const { state } = useApp();

  const minCost = state.results.length > 0
    ? Math.min(...state.results.map((r) => r.result.totalCost).filter((c) => c > 0))
    : 0;

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div>
        <h2 className="text-sm font-semibold text-text-primary">Metrics & Comparison</h2>
        <p className="mt-1 text-xs text-text-secondary">
          {state.results.length > 0
            ? `${state.results.length} algorithm${state.results.length > 1 ? 's' : ''} executed`
            : 'Run an algorithm to see metrics'}
        </p>
      </div>

      {state.results.length === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="text-3xl opacity-30">📊</div>
          <p className="text-xs text-text-secondary">
            No results yet. Select start/end stations and execute an algorithm to see detailed metrics here.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {state.results.map((r) => (
              <AlgorithmCard
                key={r.type}
                runResult={r}
                isWinner={state.results.length > 1 && r.result.totalCost > 0 && r.result.totalCost === minCost}
              />
            ))}
          </div>

          {state.results.length > 1 && <ComparisonChart results={state.results} />}
        </>
      )}
    </div>
  );
}
