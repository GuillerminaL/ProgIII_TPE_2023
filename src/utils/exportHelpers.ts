import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { EXPORT_FOOTER } from '../constants';
import type { AlgorithmRunResult } from '../algorithms/types';
import type { MetroNetwork } from '../algorithms/types';

export async function exportAsImage(element: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#0a0a0f',
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText(EXPORT_FOOTER, canvas.width / 2, canvas.height - 20);
  }

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export async function exportAsPDF(
  element: HTMLElement,
  filename: string,
  network: MetroNetwork,
  results: AlgorithmRunResult[],
  startId: string | null,
  endId: string | null,
): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#0a0a0f',
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const imgData = canvas.toDataURL('image/png');

  pdf.setFontSize(18);
  pdf.setTextColor(99, 102, 241);
  pdf.text('Subway Algorithm Lab', pageWidth / 2, 15, { align: 'center' });

  pdf.setFontSize(10);
  pdf.setTextColor(148, 163, 184);
  pdf.text(`Network: ${network.name} | Start: ${startId ?? '-'} | End: ${endId ?? '-'}`, pageWidth / 2, 22, {
    align: 'center',
  });

  pdf.addImage(imgData, 'PNG', 10, 30, imgWidth, Math.min(imgHeight, pageHeight - 50));

  pdf.addPage();
  pdf.setFontSize(16);
  pdf.setTextColor(99, 102, 241);
  pdf.text('Metrics Comparison', pageWidth / 2, 20, { align: 'center' });

  pdf.setFontSize(10);
  pdf.setTextColor(241, 245, 249);
  let y = 35;
  pdf.text('Algorithm', 15, y);
  pdf.text('Nodes Visited', 80, y);
  pdf.text('Path Length', 120, y);
  pdf.text('Total Cost', 155, y);
  pdf.text('Exec Time', 185, y);
  y += 5;
  pdf.setDrawColor(42, 42, 62);
  pdf.line(10, y, pageWidth - 10, y);
  y += 8;

  for (const r of results) {
    pdf.setTextColor(241, 245, 249);
    pdf.text(r.type, 15, y);
    pdf.text(String(r.result.nodesVisited), 80, y);
    pdf.text(`${r.result.optimalPath.length} stops`, 120, y);
    pdf.text(r.result.totalCost > 0 ? `${r.result.totalCost} min` : 'N/A', 155, y);
    pdf.text(`${r.result.executionTimeMs.toFixed(2)}ms`, 185, y);
    y += 8;
  }

  pdf.addPage();
  pdf.setFontSize(16);
  pdf.setTextColor(99, 102, 241);
  pdf.text('Structure Comparison', pageWidth / 2, 20, { align: 'center' });

  pdf.setFontSize(11);
  pdf.setTextColor(241, 245, 249);
  const lines = [
    'Why does structure matter?',
    '',
    'Searching in a List requires visiting up to N stations sequentially - O(n).',
    'A Binary Tree halves the search space each step - O(log n).',
    "The Graph's adjacency list gives instant neighbor lookup - O(1).",
    "That's why pathfinding algorithms use graphs!",
    '',
    'BFS explores level by level - good for fewest stops.',
    'DFS dives deep first - uses less memory but no shortest guarantee.',
    "Dijkstra guarantees optimal weighted path by travel time.",
  ];
  y = 40;
  for (const line of lines) {
    pdf.text(line, 15, y);
    y += 8;
  }

  pdf.setFontSize(8);
  pdf.setTextColor(148, 163, 184);
  pdf.text(EXPORT_FOOTER, pageWidth / 2, pageHeight - 10, { align: 'center' });

  pdf.save(`${filename}.pdf`);
}
