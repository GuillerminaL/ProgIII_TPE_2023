import { useApp } from '../../context/AppContext';
import { ListViewer } from './ListViewer';
import { TreeViewer } from './TreeViewer';
import { GraphViewer } from './GraphViewer';
import type { StructureType } from '../../algorithms/types';

interface StructureTabsProps {
  highlightedIds?: Set<string>;
  highlightedPath?: string[];
}

const TABS: { id: StructureType; label: string; icon: string }[] = [
  { id: 'LIST', label: 'Linked List', icon: '≡' },
  { id: 'TREE', label: 'Binary Tree', icon: '⬥' },
  { id: 'GRAPH', label: 'Adjacency List', icon: '⬡' },
];

export function StructureTabs({ highlightedIds, highlightedPath }: StructureTabsProps) {
  const { state, dispatch } = useApp();

  return (
    <div className="card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">Structure Laboratory</h2>
        <p className="text-xs text-text-secondary">Same data, three representations</p>
      </div>

      <div className="mb-4 flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch({ type: 'SET_STRUCTURE', payload: tab.id })}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium transition-all ${
              state.activeStructure === tab.id
                ? 'border-primary text-text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {state.activeStructure === 'LIST' && <ListViewer highlightedIds={highlightedIds} />}
        {state.activeStructure === 'TREE' && <TreeViewer highlightedPath={highlightedPath} />}
        {state.activeStructure === 'GRAPH' && <GraphViewer highlightedIds={highlightedIds} />}
      </div>
    </div>
  );
}
