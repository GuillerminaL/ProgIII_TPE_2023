import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Graph as GraphDS } from '../../data-structures/Graph';
import { getLineColor, STRUCTURE_COMPLEXITY } from '../../constants';

interface GraphViewerProps {
  highlightedIds?: Set<string>;
}

export function GraphViewer({ highlightedIds }: GraphViewerProps) {
  const { state } = useApp();

  const adjacencyData = useMemo(() => {
    const g = new GraphDS();
    g.build(state.stations, state.connections);
    return g.getAllNodes().map((station) => ({
      station,
      neighbors: g.getNeighbors(station.id),
    }));
  }, [state.stations, state.connections]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-secondary">
          Adjacency list representation. Each station maps directly to its neighbors — instant lookup.
        </p>
        <span className="badge bg-success/20 text-success">Complexity: {STRUCTURE_COMPLEXITY.GRAPH}</span>
      </div>
      <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg bg-surface-2 p-2">
        {adjacencyData.map(({ station, neighbors }) => {
          const isHighlighted = highlightedIds?.has(station.id);
          return (
            <div
              key={station.id}
              className={`flex items-start gap-2 rounded-md px-2 py-1.5 transition-all duration-300 ${
                isHighlighted ? 'bg-success/15' : ''
              }`}
            >
              <div className="flex min-w-[100px] items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: getLineColor(station.line) }}
                />
                <span className="text-xs font-medium text-text-primary">{station.name}</span>
              </div>
              <span className="text-xs text-text-secondary">→</span>
              <div className="flex flex-wrap gap-1">
                {neighbors.length === 0 ? (
                  <span className="text-[10px] text-text-secondary italic">no connections</span>
                ) : (
                  neighbors.map((n) => {
                    const ns = state.stations.find((s) => s.id === n.id);
                    return (
                      <span
                        key={n.id}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                          highlightedIds?.has(n.id) ? 'bg-success/20 text-success' : 'bg-surface text-text-secondary'
                        }`}
                      >
                        {ns?.name ?? n.id} ({n.weight}m)
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] font-mono text-text-secondary">
        {state.stations.length} nodes · {state.connections.length} edges · Neighbor lookup: O(1)
      </p>
    </div>
  );
}
