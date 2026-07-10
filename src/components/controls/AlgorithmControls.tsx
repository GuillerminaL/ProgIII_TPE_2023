import { useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { useAlgorithmRunner } from '../../hooks/useAlgorithmRunner';
import type { AlgorithmType } from '../../algorithms/types';
import { ALGORITHM_COLORS, ALGORITHM_DESCRIPTIONS } from '../../constants';
import { SpeedSlider } from './SpeedSlider';

const ALGORITHMS: AlgorithmType[] = ['BFS', 'DFS', 'DIJKSTRA'];

export function AlgorithmControls() {
  const { state, dispatch } = useApp();
  const { runSingle, runAll } = useAlgorithmRunner();

  const handleRun = useCallback(() => {
    if (state.mode === 'compare') {
      runAll();
    } else {
      runSingle();
    }
  }, [state.mode, runSingle, runAll]);

  const handleModeChange = useCallback(
    (mode: 'single' | 'compare') => {
      dispatch({ type: 'SET_MODE', payload: mode });
    },
    [dispatch],
  );

  const handleAlgorithmChange = useCallback(
    (algo: AlgorithmType) => {
      dispatch({ type: 'SET_ALGORITHM', payload: algo });
    },
    [dispatch],
  );

  return (
    <div className="card space-y-4 p-4">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-text-primary">Execution Mode</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleModeChange('single')}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              state.mode === 'single'
                ? 'bg-primary text-white'
                : 'bg-surface-2 text-text-secondary hover:text-text-primary'
            }`}
          >
            Single Algorithm
          </button>
          <button
            onClick={() => handleModeChange('compare')}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              state.mode === 'compare'
                ? 'bg-primary text-white'
                : 'bg-surface-2 text-text-secondary hover:text-text-primary'
            }`}
          >
            Compare All Three
          </button>
        </div>
      </div>

      {state.mode === 'single' && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-text-primary">Algorithm</h3>
          <div className="flex flex-wrap gap-2">
            {ALGORITHMS.map((algo) => (
              <button
                key={algo}
                onClick={() => handleAlgorithmChange(algo)}
                className={`pill border transition-all ${
                  state.selectedAlgorithm === algo
                    ? 'text-white'
                    : 'border-border bg-surface-2 text-text-secondary hover:text-text-primary'
                }`}
                style={
                  state.selectedAlgorithm === algo
                    ? { backgroundColor: ALGORITHM_COLORS[algo], borderColor: ALGORITHM_COLORS[algo] }
                    : undefined
                }
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: ALGORITHM_COLORS[algo] }}
                />
                {algo}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-text-secondary">
            {ALGORITHM_DESCRIPTIONS[state.selectedAlgorithm]}
          </p>
        </div>
      )}

      <SpeedSlider />

      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-primary">Start / End Stations</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-[10px] uppercase text-success">Start</label>
            <select
              value={state.startId ?? ''}
              onChange={(e) => dispatch({ type: 'SET_START', payload: e.target.value || null })}
              className="input-dark text-xs"
              aria-label="Start station"
            >
              <option value="">Select start</option>
              {state.stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.line})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase text-red-400">End</label>
            <select
              value={state.endId ?? ''}
              onChange={(e) => dispatch({ type: 'SET_END', payload: e.target.value || null })}
              className="input-dark text-xs"
              aria-label="End station"
            >
              <option value="">Select end</option>
              {state.stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.line})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleRun}
        disabled={!state.startId || !state.endId || state.isRunning}
        className="btn-primary w-full py-3 text-sm font-bold tracking-wide"
        aria-label="Execute algorithm"
      >
        {state.mode === 'compare' ? '▶ Compare All Algorithms' : '▶ Execute Algorithm'}
      </button>
    </div>
  );
}
