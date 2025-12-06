// src/app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Play, RotateCcw, Loader2 } from "lucide-react";
import CodeEditor from "@/components/editor/code-editor";
import FlowCanvas from "@/components/flows/flow-canvas";
import ConsoleOutput from "@/components/console/console-output";
import { useExecutionStore } from "@/store/useExecutionStore";
import { loadPyodideOnce } from "@/lib/pyoodide/loader";
import { useRef, useEffect } from "react";

export default function Home() {
  const editorRef = useRef<any>(null);
  const {
    isRunning,
    isLoadingPyodide,
    setRunning,
    setLoadingPyodide,
    clearConsole,
    addConsoleLine,
    setError,
  } = useExecutionStore();

  async function runCode() {
    if (!editorRef.current) return;

    const code = editorRef.current.getValue();
    clearConsole();
    setRunning(true);
    setError(null);

    try {
      const pyodide = await loadPyodideOnce();

      // Simple timeout guard against infinite loops (5 sec max)
      const result = await Promise.race([
        pyodide.runPythonAsync(code),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Execution timed out after 5 seconds")),
            5000
          )
        ),
      ]);

      addConsoleLine(result ?? ""); // in case the script returns something
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setRunning(false);
    }
  }

  // Listen to Python stdout/stderr
  useEffect(() => {
    const handleStdout = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      addConsoleLine(text);
    };

    const handleStderr = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      addConsoleLine(text, true);
    };

    window.addEventListener("python-stdout", handleStdout);
    window.addEventListener("python-stderr", handleStderr);

    return () => {
      window.removeEventListener("python-stdout", handleStdout);
      window.removeEventListener("python-stderr", handleStderr);
    };
  }, [addConsoleLine]);

  // Show loading spinner the very first time Pyodide loads
  useEffect(() => {
    loadPyodideOnce()
      .then(() => setLoadingPyodide(false))
      .catch(() => setLoadingPyodide(false));
  }, [setLoadingPyodide]);

  return (
    <>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b px-6 py-3 flex items-center justify-between bg-card">
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Python Visualizer
          </h1>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => editorRef.current?.setValue("")}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>

            <Button
              size="sm"
              onClick={runCode}
              disabled={isRunning || isLoadingPyodide}
            >
              {isLoadingPyodide ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading Python…
                </>
              ) : isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running…
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Main */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={50} minSize={30}>
              <Card className="h-full rounded-none border-0 border-r">
                <CodeEditor ref={editorRef} />
              </Card>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50}>
              <Tabs defaultValue="execution" className="h-full flex flex-col">
                <TabsList className="rounded-none border-b px-6">
                  <TabsTrigger value="execution">Execution Flow</TabsTrigger>
                  <TabsTrigger value="heap">Heap Objects</TabsTrigger>
                  <TabsTrigger value="ast">AST</TabsTrigger>
                  <TabsTrigger value="console">Console</TabsTrigger>
                </TabsList>

                <TabsContent value="execution" className="flex-1 mt-0">
                  <FlowCanvas />
                </TabsContent>
                <TabsContent value="heap" className="flex-1 mt-0 p-8">
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Heap visualization coming soon
                  </div>
                </TabsContent>
                <TabsContent value="ast" className="flex-1 mt-0 p-8">
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    AST coming soon
                  </div>
                </TabsContent>
                <TabsContent value="console" className="flex-1 mt-0">
                  <ConsoleOutput />
                </TabsContent>
              </Tabs>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </>
  );
}
