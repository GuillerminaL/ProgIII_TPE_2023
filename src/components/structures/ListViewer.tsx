import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DoublyLinkedList } from '../../data-structures/LinkedList';
import { getLineColor, STRUCTURE_COMPLEXITY } from '../../constants';

interface ListViewerProps {
  highlightedIds?: Set<string>;
}

export function ListViewer({ highlightedIds }: ListViewerProps) {
  const { state } = useApp();

  const list = useMemo(() => {
    const dl = new DoublyLinkedList<{ id: string; name: string; line: string }>();
    state.stations.forEach((s) => dl.append({ id: s.id, name: s.name, line: s.line }));
    return dl.toArray();
  }, [state.stations]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-secondary">
          Stations stored sequentially in a doubly linked list. Searching requires visiting nodes one by one.
        </p>
        <span className="badge bg-warning/20 text-warning">Complexity: {STRUCTURE_COMPLEXITY.LIST}</span>
      </div>
      <div className="flex flex-wrap items-center gap-1 overflow-x-auto pb-2">
        {list.map((item, idx) => {
          const isHighlighted = highlightedIds?.has(item.id);
          return (
            <div key={item.id} className="flex items-center">
              <div
                className={`flex flex-col items-center rounded-lg border px-2 py-1.5 transition-all duration-300 ${
                  isHighlighted
                    ? 'border-success bg-success/20 shadow-[0_0_8px_rgba(74,222,128,0.4)]'
                    : 'border-border bg-surface-2'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: getLineColor(item.line) }}
                  />
                  <span className="text-xs font-medium text-text-primary">{item.name}</span>
                </div>
                <span className="text-[9px] font-mono text-text-secondary">Line {item.line}</span>
              </div>
              {idx < list.length - 1 && (
                <span className="px-1 text-xs text-text-secondary">→</span>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[10px] font-mono text-text-secondary">
        List size: {list.length} · To find a station, worst case: {list.length} comparisons
      </p>
    </div>
  );
}
