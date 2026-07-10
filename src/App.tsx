import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MetricsPanel } from './components/metrics/MetricsPanel';
import { StructureTabs } from './components/structures/StructureTabs';
import { SubwayCanvas } from './components/canvas/SubwayCanvas';
import { ComparisonView } from './components/canvas/ComparisonView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAnimationEngine } from './hooks/useAnimationEngine';

const CAPTURE_AREA_ID = 'export-capture-area';

function MainContent() {
  const { state } = useApp();

  const singleResult = state.results.length > 0 && state.mode === 'single' ? state.results[0] : null;
  const resultData = singleResult
    ? { visitedOrder: singleResult.result.visitedOrder, optimalPath: singleResult.result.optimalPath }
    : null;

  const {
    isComplete,
    animatedNodes,
    animatedPath,
  } = useAnimationEngine({
    visitedOrder: resultData?.visitedOrder ?? [],
    optimalPath: resultData?.optimalPath ?? [],
    speedMs: state.speedMs,
  });

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="border-b border-border lg:border-b-0 lg:border-r">
          <Sidebar />
        </div>

        <main className="flex flex-1 flex-col overflow-hidden">
          <ErrorBoundary>
            <div
              id={CAPTURE_AREA_ID}
              className="flex flex-1 flex-col overflow-hidden"
            >
              {state.mode === 'compare' ? (
                <ComparisonView />
              ) : (
                <div className="flex flex-1 flex-col overflow-hidden p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-text-primary">
                      {state.network.name} — {state.selectedAlgorithm}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <span className="h-2 w-2 rounded-full bg-success" /> Start
                      <span className="ml-2 h-2 w-2 rounded-full bg-red-500" /> End
                      <span className="ml-2 h-2 w-2 rounded-full bg-info" /> Visited
                      <span className="ml-2 h-2 w-2 rounded-full bg-success" /> Optimal
                    </div>
                  </div>
                  <div className="card flex-1 overflow-hidden">
                    <SubwayCanvas result={resultData} />
                  </div>
                </div>
              )}
            </div>
          </ErrorBoundary>

          <div className="border-t border-border p-4">
            <StructureTabs
              highlightedIds={animatedNodes}
              highlightedPath={isComplete ? animatedPath : []}
            />
          </div>
        </main>

        <div className="border-t border-border lg:w-[320px] lg:border-t-0 lg:border-l">
          <MetricsPanel />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <MainContent />
      </ErrorBoundary>
    </AppProvider>
  );
}
