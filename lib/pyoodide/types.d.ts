// src/lib/pyodide/types.d.ts
import type { PyodideInterface } from "pyodide/ffi";

declare global {
  interface Window {
    loadPyodide: typeof import("pyodide").loadPyodide;
  }
}

// Make TypeScript happy everywhere
export type { PyodideInterface };