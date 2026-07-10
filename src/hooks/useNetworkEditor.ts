import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import type { Station, Connection } from '../algorithms/types';

let customIdCounter = 1000;

function generateId(prefix: string): string {
  customIdCounter++;
  return `custom-${prefix}-${customIdCounter}`;
}

export function useNetworkEditor() {
  const { state, dispatch } = useApp();

  const addStation = useCallback(
    (name: string, line: string, x: number, y: number): string => {
      const id = generateId('st');
      const station: Station = { id, name, line, x, y };
      dispatch({ type: 'ADD_STATION', payload: station });
      return id;
    },
    [dispatch],
  );

  const addConnection = useCallback(
    (from: string, to: string, weight: number, line: string): void => {
      const connection: Connection = { from, to, weight, line };
      dispatch({ type: 'ADD_CONNECTION', payload: connection });
    },
    [dispatch],
  );

  const deleteStation = useCallback(
    (id: string): void => {
      dispatch({ type: 'DELETE_STATION', payload: id });
    },
    [dispatch],
  );

  const deleteConnection = useCallback(
    (from: string, to: string): void => {
      dispatch({ type: 'DELETE_CONNECTION', payload: { from, to } });
    },
    [dispatch],
  );

  const updatePosition = useCallback(
    (id: string, x: number, y: number): void => {
      dispatch({ type: 'UPDATE_STATION_POSITION', payload: { id, x, y } });
    },
    [dispatch],
  );

  const resetToPreset = useCallback(
    (networkId: string): void => {
      dispatch({ type: 'RESET_NETWORK', payload: networkId });
    },
    [dispatch],
  );

  return {
    addStation,
    addConnection,
    deleteStation,
    deleteConnection,
    updatePosition,
    resetToPreset,
    stations: state.stations,
    connections: state.connections,
  };
}
