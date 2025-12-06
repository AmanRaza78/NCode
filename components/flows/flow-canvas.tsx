// src/components/flow/FlowCanvas.tsx
"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";  // Core styles (grid, handles, etc.)

// Sample initial node (like a "start" execution point)
const initialNodes: Node[] = [
  {
    id: "1",
    data: { label: "Execution Start\n(Drag me!)" },
    position: { x: 250, y: 25 },
    className: "bg-blue-500 text-white px-4 py-2 rounded shadow-lg",
  },
];

const initialEdges: Edge[] = [];

export default function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle connecting nodes (for future execution paths)
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={{}}  // We'll add custom node types later
        edgeTypes={{}}  // Custom edges for control flow later
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}