import { useApp } from '../../context/AppContext';
import { SPEED_MIN_MS, SPEED_MAX_MS } from '../../constants';

export function SpeedSlider() {
  const { state, dispatch } = useApp();

  const percentage = ((SPEED_MAX_MS - state.speedMs) / (SPEED_MAX_MS - SPEED_MIN_MS)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-text-secondary">Animation Speed</label>
        <span className="font-mono text-xs text-text-primary">{state.speedMs}ms</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={SPEED_MIN_MS}
          max={SPEED_MAX_MS}
          step={50}
          value={SPEED_MAX_MS - state.speedMs + SPEED_MIN_MS}
          onChange={(e) => {
            const val = Number(e.target.value);
            dispatch({ type: 'SET_SPEED', payload: SPEED_MAX_MS - val + SPEED_MIN_MS });
          }}
          className="w-full cursor-pointer appearance-none rounded-lg bg-surface-2 accent-primary"
          aria-label="Animation speed"
        />
        <div className="mt-1 flex justify-between text-[10px] text-text-secondary">
          <span>Fast</span>
          <span style={{ marginLeft: `${percentage - 15}%` }} className="text-primary">
            ●
          </span>
          <span>Slow</span>
        </div>
      </div>
    </div>
  );
}
