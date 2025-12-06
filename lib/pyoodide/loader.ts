import { PyodideInterface } from "pyodide";

// src/lib/pyodide/loader.ts
let pyodidePromise: Promise<PyodideInterface> | null = null;

export async function loadPyodideOnce(): Promise<PyodideInterface> {
  if (pyodidePromise) return pyodidePromise;

  // Dynamic import so it only loads when needed (tree-shaken on first run)
  const { loadPyodide } = await import("pyodide");

  pyodidePromise = loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.1/full/",
    // You can increase these if you plan to allow big libraries later
    stdin: () => {
      // We don't support interactive input yet
      return null;
    },
  });

  const pyodide = await pyodidePromise;

  // Redirect Python stdout/stderr to JS
  pyodide.setStdout({
    batched: (text: string) => {
      const event = new CustomEvent("python-stdout", { detail: text });
      window.dispatchEvent(event);
    },
  });
  pyodide.setStderr({
    batched: (text: string) => {
      const event = new CustomEvent("python-stderr", { detail: text });
      window.dispatchEvent(event);
    },
  });

  return pyodide;
}