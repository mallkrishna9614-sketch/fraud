"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  Position,
  useEdgesState,
  useNodesState
} from "reactflow";
import "reactflow/dist/style.css";
import { GraphResponse } from "@/lib/types";

type FraudGraphProps = {
  graphData: GraphResponse;
  selectedUserId?: string;
  onSelectUser: (userId: string) => void;
};

export function FraudGraph({ graphData, selectedUserId, onSelectUser }: FraudGraphProps) {
  const transformedNodes = useMemo<Node[]>(() => {
    return graphData.nodes.map((node, index) => {
      const angle = (index / Math.max(graphData.nodes.length, 1)) * Math.PI * 2;
      const radius = 250 + (index % 4) * 40;
      const isFraud = node.riskScore >= 65;
      const isSelected = selectedUserId === node.id;

      return {
        id: node.id,
        data: {
          label: `${node.label} | Risk ${node.riskScore}`
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        position: {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius
        },
        style: {
          borderRadius: 14,
          border: `1px solid ${isFraud ? "#ff4d6d" : "#3aa6ff"}`,
          background: isSelected ? "rgba(255,255,255,0.15)" : "rgba(18,24,40,0.8)",
          color: isFraud ? "#ffd6de" : "#cfe9ff",
          boxShadow: isFraud ? "0 0 18px rgba(255, 77, 109, 0.4)" : "0 0 18px rgba(58, 166, 255, 0.35)",
          minWidth: 150,
          textAlign: "center"
        }
      };
    });
  }, [graphData.nodes, selectedUserId]);

  const transformedEdges = useMemo<Edge[]>(
    () =>
      graphData.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: `${edge.amount.toFixed(0)}`,
        animated: edge.status === "Fraud",
        style: {
          stroke: edge.status === "Fraud" ? "#ff4d6d" : "#3aa6ff",
          strokeWidth: edge.status === "Fraud" ? 2.2 : 1.3,
          opacity: selectedUserId && edge.source !== selectedUserId && edge.target !== selectedUserId ? 0.2 : 0.8
        },
        labelStyle: { fill: "#cbd5e1", fontSize: 10 }
      })),
    [graphData.edges, selectedUserId]
  );

  const [nodes, , onNodesChange] = useNodesState(transformedNodes);
  const [edges, , onEdgesChange] = useEdgesState(transformedEdges);

  return (
    <div className="h-[440px] w-full overflow-hidden rounded-2xl border border-neonBlue/25 bg-panel shadow-glowBlue">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onSelectUser(node.id)}
        fitView
      >
        <Background color="#1e293b" gap={24} />
        <MiniMap zoomable pannable style={{ background: "#111827" }} />
        <Controls position="top-right" />
      </ReactFlow>
    </div>
  );
}
