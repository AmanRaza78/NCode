// src/store/useExecutionStore.ts
import { create } from "zustand";

type ExecutionState = {
  isRunning: boolean;
  isLoadingPyodide: boolean;
  consoleLines: string[];
  error: string | null;

  setRunning: (v: boolean) => void;
  setLoadingPyodide: (v: boolean) => void;
  addConsoleLine: (line: string, isError?: boolean) => void;
  clearConsole: () => void;
  setError: (msg: string | null) => void;
};

export const useExecutionStore = create<ExecutionState>((set) => ({
  isRunning: false,
  isLoadingPyodide: true,
  consoleLines: [">>> Ready – click Run to execute"],
  error: null,

  setRunning: (v) => set({ isRunning: v }),
  setLoadingPyodide: (v) => set({ isLoadingPyodide: v }),
  addConsoleLine: (line, isError = false) =>
    set((state) => ({
      consoleLines: [...state.consoleLines, isError ? `ERROR: ${line}` : line],
    })),
  clearConsole: () =>
    set({ consoleLines: [">>> Console cleared"], error: null }),
  setError: (msg) => set({ error: msg, consoleLines: msg ? [`ERROR: ${msg}`] : [] }),
}));