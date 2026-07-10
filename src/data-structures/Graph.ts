import type { Station, Connection } from '../algorithms/types';

export interface GraphNode {
  station: Station;
  neighbors: Map<string, number>;
}

export class Graph {
  private nodes: Map<string, GraphNode> = new Map();
  private edgeLines: Map<string, string> = new Map();

  get size(): number {
    return this.nodes.size;
  }

  addNode(station: Station): void {
    if (!this.nodes.has(station.id)) {
      this.nodes.set(station.id, { station, neighbors: new Map() });
    }
  }

  addEdge(connection: Connection): void {
    this.edgeLines.set(`${connection.from}-${connection.to}`, connection.line);
    this.edgeLines.set(`${connection.to}-${connection.from}`, connection.line);
    const from = this.nodes.get(connection.from);
    const to = this.nodes.get(connection.to);
    if (from) from.neighbors.set(connection.to, connection.weight);
    if (to) to.neighbors.set(connection.from, connection.weight);
  }

  getNeighbors(id: string): Array<{ id: string; weight: number }> {
    const node = this.nodes.get(id);
    if (!node) return [];
    return Array.from(node.neighbors.entries()).map(([nid, weight]) => ({ id: nid, weight }));
  }

  getStation(id: string): Station | undefined {
    return this.nodes.get(id)?.station;
  }

  getAllNodes(): Station[] {
    return Array.from(this.nodes.values()).map((n) => n.station);
  }

  getAllEdges(): Connection[] {
    const edges: Connection[] = [];
    const seen = new Set<string>();
    this.nodes.forEach((node, fromId) => {
      node.neighbors.forEach((weight, toId) => {
        const key = [fromId, toId].sort().join('-');
        if (!seen.has(key)) {
          seen.add(key);
          edges.push({
            from: fromId,
            to: toId,
            weight,
            line: this.edgeLines.get(`${fromId}-${toId}`) ?? 'A',
          });
        }
      });
    });
    return edges;
  }

  hasNode(id: string): boolean {
    return this.nodes.has(id);
  }

  build(stations: Station[], connections: Connection[]): void {
    this.nodes.clear();
    this.edgeLines.clear();
    stations.forEach((s) => this.addNode(s));
    connections.forEach((c) => this.addEdge(c));
  }
}
