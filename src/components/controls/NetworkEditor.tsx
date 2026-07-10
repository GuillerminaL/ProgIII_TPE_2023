import { useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { useNetworkEditor } from '../../hooks/useNetworkEditor';
import { NETWORKS } from '../../data/networks';

type EditorMode = 'presets' | 'custom';

export function NetworkEditor() {
  const { state, dispatch } = useApp();
  const { addStation, addConnection, deleteStation, deleteConnection, resetToPreset } = useNetworkEditor();
  const [editorMode, setEditorMode] = useState<EditorMode>('presets');
  const [newStationName, setNewStationName] = useState('');
  const [newStationLine, setNewStationLine] = useState('A');
  const [connectFrom, setConnectFrom] = useState('');
  const [connectTo, setConnectTo] = useState('');
  const [connectWeight, setConnectWeight] = useState(2);

  const handleAddStation = useCallback(() => {
    if (!newStationName.trim()) return;
    const x = 100 + Math.random() * 400;
    const y = 100 + Math.random() * 300;
    addStation(newStationName.trim(), newStationLine, x, y);
    setNewStationName('');
  }, [newStationName, newStationLine, addStation]);

  const handleAddConnection = useCallback(() => {
    if (!connectFrom || !connectTo || connectFrom === connectTo) return;
    addConnection(connectFrom, connectTo, connectWeight, 'A');
    setConnectFrom('');
    setConnectTo('');
  }, [connectFrom, connectTo, connectWeight, addConnection]);

  const handleReset = useCallback(
    (networkId: string) => {
      resetToPreset(networkId);
      setEditorMode('presets');
    },
    [resetToPreset],
  );

  return (
    <div className="card space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Network Editor</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setEditorMode('presets')}
            className={`rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
              editorMode === 'presets' ? 'bg-primary text-white' : 'bg-surface-2 text-text-secondary'
            }`}
          >
            Presets
          </button>
          <button
            onClick={() => setEditorMode('custom')}
            className={`rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
              editorMode === 'custom' ? 'bg-primary text-white' : 'bg-surface-2 text-text-secondary'
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {editorMode === 'presets' ? (
        <div className="space-y-2">
          <p className="text-xs text-text-secondary">Load a preconfigured metro network:</p>
          {NETWORKS.map((net) => (
            <button
              key={net.id}
              onClick={() => handleReset(net.id)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs transition-all ${
                state.network.id === net.id
                  ? 'border-primary bg-primary/10 text-text-primary'
                  : 'border-border bg-surface-2 text-text-secondary hover:border-primary/50 hover:text-text-primary'
              }`}
            >
              <span className="font-medium">{net.city}</span>
              <span className="font-mono text-[10px]">
                {net.stations.length} st · {net.connections.length} cn
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-text-primary">Add Station</p>
            <input
              type="text"
              value={newStationName}
              onChange={(e) => setNewStationName(e.target.value)}
              placeholder="Station name"
              className="input-dark text-xs"
              onKeyDown={(e) => e.key === 'Enter' && handleAddStation()}
            />
            <div className="flex gap-2">
              <select
                value={newStationLine}
                onChange={(e) => setNewStationLine(e.target.value)}
                className="input-dark flex-1 text-xs"
              >
                {['A', 'B', 'C', 'D', 'E', 'H'].map((l) => (
                  <option key={l} value={l}>
                    Line {l}
                  </option>
                ))}
              </select>
              <button onClick={handleAddStation} className="btn-ghost px-3 text-xs">
                Add
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-text-primary">Add Connection</p>
            <select
              value={connectFrom}
              onChange={(e) => setConnectFrom(e.target.value)}
              className="input-dark text-xs"
            >
              <option value="">From...</option>
              {state.stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={connectTo}
              onChange={(e) => setConnectTo(e.target.value)}
              className="input-dark text-xs"
            >
              <option value="">To...</option>
              {state.stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={20}
                value={connectWeight}
                onChange={(e) => setConnectWeight(Number(e.target.value))}
                className="input-dark flex-1 text-xs"
                aria-label="Connection weight"
              />
              <button
                onClick={handleAddConnection}
                disabled={!connectFrom || !connectTo}
                className="btn-ghost px-3 text-xs"
              >
                Connect
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-text-primary">Delete Connection</p>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {state.connections.map((c, i) => {
                const fromName = state.stations.find((s) => s.id === c.from)?.name ?? c.from;
                const toName = state.stations.find((s) => s.id === c.to)?.name ?? c.to;
                return (
                  <button
                    key={i}
                    onClick={() => deleteConnection(c.from, c.to)}
                    className="flex w-full items-center justify-between rounded-md bg-surface-2 px-2 py-1 text-[10px] text-text-secondary transition-all hover:text-red-400"
                  >
                    <span>
                      {fromName} ↔ {toName} ({c.weight}m)
                    </span>
                    <span>✕</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-text-primary">Delete Station</p>
            <div className="flex flex-wrap gap-1">
              {state.stations.map((s) => (
                <button
                  key={s.id}
                  onClick={() => deleteStation(s.id)}
                  className="rounded-md bg-surface-2 px-2 py-1 text-[10px] text-text-secondary transition-all hover:bg-red-500/20 hover:text-red-400"
                >
                  {s.name} ✕
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
