// src/components/editor/CodeEditor.tsx
"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";

const sampleCode = `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(8))
`;

const CodeEditor = forwardRef(function CodeEditor(_props, ref) {
  const innerRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    getValue: () => innerRef.current?.getValue() || "",
    setValue: (value: string) => innerRef.current?.setValue(value),
  }));

  return (
    <MonacoEditor
      height="100%"
      defaultLanguage="python"
      defaultValue={sampleCode}
      theme="vs-dark"
      onMount={(editor) => (innerRef.current = editor)}
      options={{
        minimap: { enabled: false },
        fontSize: 15,
        wordWrap: "on",
        automaticLayout: true,
        scrollBeyondLastLine: false,
      }}
    />
  );
});

export default CodeEditor;