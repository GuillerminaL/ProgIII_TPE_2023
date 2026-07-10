import { createContext, useContext, useReducer, useCallback, useMemo, type ReactNode, type Dispatch } from 'react';
import type { Station, Connection, AlgorithmType, AlgorithmResult, AlgorithmRunResult, MetroNetwork } from '../algorithms/types';
import { NETWORKS, getNetworkById, DEFAULT_NETWORK_ID } from '../data/networks';
import { Graph } from '../data-structures/Graph';
import { SPEED_DEFAULT_MS } from '../constants';

export type AppMode = 'single' | 'compare';

export type { AlgorithmRunResult } from '../algorithms/types';

interface AppState {
  network: MetroNetwork;
  stations: Station[];
  connections: Connection[];
  graph: Graph;
  startId: string | null;
  endId: string | null;
  mode: AppMode;
  selectedAlgorithm: AlgorithmType;
  speedMs: number;
  results: AlgorithmRunResult[];
  isRunning: boolean;
  activeStructure: 'LIST' | 'TREE' | 'GRAPH';
}

type Action =
  | { type: 'SET_NETWORK'; payload: string }
  | { type: 'SET_START'; payload: string | null }
  | { type: 'SET_END'; payload: string | null }
  | { type: 'SET_MODE'; payload: AppMode }
  | { type: 'SET_ALGORITHM'; payload: AlgorithmType }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'SET_RESULTS'; payload: AlgorithmRunResult[] }
  | { type: 'SET_RUNNING'; payload: boolean }
  | { type: 'SET_STRUCTURE'; payload: 'LIST' | 'TREE' | 'GRAPH' }
  | { type: 'ADD_STATION'; payload: Station }
  | { type: 'ADD_CONNECTION'; payload: Connection }
  | { type: 'DELETE_STATION'; payload: string }
  | { type: 'DELETE_CONNECTION'; payload: { from: string; to: string } }
  | { type: 'UPDATE_STATION_POSITION'; payload: { id: string; x: number; y: number } }
  | { type: 'RESET_NETWORK'; payload: string };

function buildGraph(stations: Station[], connections: Connection[]): Graph {
  const g = new Graph();
  g.build(stations, connections);
  return g;
}

function initialState(): AppState {
  const network = getNetworkById(DEFAULT_NETWORK_ID);
  return {
    network,
    stations: [...network.stations],
    connections: [...network.connections],
    graph: buildGraph(network.stations, network.connections),
    startId: network.stations[0]?.id ?? null,
    endId: network.stations[network.stations.length - 1]?.id ?? null,
    mode: 'single',
    selectedAlgorithm: 'DIJKSTRA',
    speedMs: SPEED_DEFAULT_MS,
    results: [],
    isRunning: false,
    activeStructure: 'GRAPH',
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_NETWORK': {
      const network = getNetworkById(action.payload);
      return {
        ...state,
        network,
        stations: [...network.stations],
        connections: [...network.connections],
        graph: buildGraph(network.stations, network.connections),
        startId: network.stations[0]?.id ?? null,
        endId: network.stations[network.stations.length - 1]?.id ?? null,
        results: [],
        isRunning: false,
      };
    }
    case 'SET_START':
      return { ...state, startId: action.payload };
    case 'SET_END':
      return { ...state, endId: action.payload };
    case 'SET_MODE':
      return { ...state, mode: action.payload, results: [], isRunning: false };
    case 'SET_ALGORITHM':
      return { ...state, selectedAlgorithm: action.payload, results: [] };
    case 'SET_SPEED':
      return { ...state, speedMs: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    case 'SET_RUNNING':
      return { ...state, isRunning: action.payload };
    case 'SET_STRUCTURE':
      return { ...state, activeStructure: action.payload };
    case 'ADD_STATION': {
      const stations = [...state.stations, action.payload];
      return { ...state, stations, graph: buildGraph(stations, state.connections) };
    }
    case 'ADD_CONNECTION': {
      const connections = [...state.connections, action.payload];
      return { ...state, connections, graph: buildGraph(state.stations, connections) };
    }
    case 'DELETE_STATION': {
      const stations = state.stations.filter((s) => s.id !== action.payload);
      const connections = state.connections.filter(
        (c) => c.from !== action.payload && c.to !== action.payload,
      );
      const startId = state.startId === action.payload ? (stations[0]?.id ?? null) : state.startId;
      const endId = state.endId === action.payload ? (stations[stations.length - 1]?.id ?? null) : state.endId;
      return { ...state, stations, connections, graph: buildGraph(stations, connections), startId, endId };
    }
    case 'DELETE_CONNECTION': {
      const connections = state.connections.filter(
        (c) =>
          !(
            (c.from === action.payload.from && c.to === action.payload.to) ||
            (c.from === action.payload.to && c.to === action.payload.from)
          ),
      );
      return { ...state, connections, graph: buildGraph(state.stations, connections) };
    }
    case 'UPDATE_STATION_POSITION': {
      const stations = state.stations.map((s) =>
        s.id === action.payload.id ? { ...s, x: action.payload.x, y: action.payload.y } : s,
      );
      return { ...state, stations };
    }
    case 'RESET_NETWORK': {
      const network = getNetworkById(action.payload);
      return {
        ...state,
        network,
        stations: [...network.stations],
        connections: [...network.connections],
        graph: buildGraph(network.stations, network.connections),
        startId: network.stations[0]?.id ?? null,
        endId: network.stations[network.stations.length - 1]?.id ?? null,
        results: [],
        isRunning: false,
      };
    }
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<Action>;
  networks: MetroNetwork[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const value = useMemo<AppContextValue>(
    () => ({ state, dispatch, networks: NETWORKS }),
    [state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
