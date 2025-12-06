// src/lib/pyodide/loader.ts
let pyodidePromise: Promise<any> | null = null;

export async function loadPyodideOnce(): Promise<any> {
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = (async () => {
    // Load pyodide from CDN to avoid bundling issues
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.0/full/pyodide.js";
    script.async = true;

    return new Promise((resolve, reject) => {
      script.onload = async () => {
        try {
          // @ts-ignore
          const pyodide = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.0/full/",
          });

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

          resolve(pyodide);
        } catch (err) {
          reject(err);
        }
      };
      script.onerror = () => {
        reject(new Error("Failed to load Pyodide from CDN"));
      };
      document.head.appendChild(script);
    });
  })();

  return pyodidePromise;
}