import { useState, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { exportAsImage, exportAsPDF } from '../../utils/exportHelpers';

export function ExportButton() {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const captureElement = useCallback((): HTMLElement | null => {
    const el = document.getElementById('export-capture-area');
    if (!el) {
      alert('Could not find the capture area. Make sure results are visible.');
      return null;
    }
    return el;
  }, []);

  const handleExportImage = useCallback(async () => {
    const el = captureElement();
    if (!el) return;
    setIsExporting(true);
    setIsOpen(false);
    try {
      await exportAsImage(el, 'subway-algorithm-result');
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [captureElement]);

  const handleExportPDF = useCallback(async () => {
    const el = captureElement();
    if (!el) return;
    setIsExporting(true);
    setIsOpen(false);
    try {
      await exportAsPDF(
        el,
        'subway-algorithm-report',
        state.network,
        state.results,
        state.startId,
        state.endId,
      );
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [captureElement, state.network, state.results, state.startId, state.endId]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        disabled={isExporting || state.results.length === 0}
        className="btn-ghost text-xs"
        aria-label="Export results"
      >
        {isExporting ? 'Exporting...' : '⬇ Export'}
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full z-30 mt-1 w-44 animate-fade-in rounded-lg border border-border bg-surface p-1 shadow-xl">
            <button
              onClick={handleExportImage}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-text-secondary transition-all hover:bg-surface-2 hover:text-text-primary"
            >
              <span>🖼</span> Export as PNG
            </button>
            <button
              onClick={handleExportPDF}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-text-secondary transition-all hover:bg-surface-2 hover:text-text-primary"
            >
              <span>📄</span> Export as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
