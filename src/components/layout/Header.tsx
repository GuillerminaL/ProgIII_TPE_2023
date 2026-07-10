import { useApp } from '../../context/AppContext';
import { ExportButton } from '../export/ExportButton';

export function Header() {
  const { state, dispatch, networks } = useApp();

  return (
    <header className="relative overflow-hidden border-b border-border bg-surface">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(90deg, #6366f1 0%, #22d3ee 50%, #a78bfa 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 8s ease infinite',
        }}
      />
      <div className="absolute inset-0 bg-bg/80" />

      <div className="relative flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/40">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="3" width="16" height="14" rx="4" />
              <path d="M4 11h16" />
              <circle cx="8.5" cy="14.5" r="1" fill="#6366f1" />
              <circle cx="15.5" cy="14.5" r="1" fill="#6366f1" />
              <path d="M8 17v3M16 17v3" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-text-primary lg:text-lg">
              Subway Algorithm Lab
            </h1>
            <p className="hidden text-xs text-text-secondary sm:block">
              Interactive Data Structures & Pathfinding Visualizer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            <label className="text-xs text-text-secondary">Network:</label>
            <select
              value={state.network.id}
              onChange={(e) => dispatch({ type: 'SET_NETWORK', payload: e.target.value })}
              className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Select network"
            >
              {networks.map((net) => (
                <option key={net.id} value={net.id}>
                  {net.city}
                </option>
              ))}
              <option value="custom" disabled>
                Custom (use editor)
              </option>
            </select>
          </div>
          <ExportButton />
        </div>
      </div>
    </header>
  );
}
