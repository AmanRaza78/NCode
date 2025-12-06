// src/components/console/ConsoleOutput.tsx
"use client";

import { useEffect } from "react";
import { useExecutionStore } from "@/store/useExecutionStore";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ConsoleOutput() {
  const { consoleLines } = useExecutionStore();

  // Auto-scroll to bottom
  return (
    <ScrollArea className="h-full font-mono text-sm bg-black rounded-none">
      <pre className="p-4 text-green-400">
        {consoleLines.map((line, i) => (
          <div key={i} className={line.startsWith("ERROR:") ? "text-red-400" : ""}>
            {line}
          </div>
        ))}
      </pre>
    </ScrollArea>
  );
}