"use client";

import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Group } from "three";
import { GraphResponse } from "@/lib/types";
import { Graph3DEdge } from "./Graph3DEdge";
import { Graph3DNode } from "./Graph3DNode";

type Graph3DProps = {
  graphData: GraphResponse;
  selectedUserId?: string;
  onSelectUser: (id: string) => void;
};

type TooltipState = {
  id: string;
  riskScore: number;
  x: number;
  y: number;
};

function RotatingGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.09;
      groupRef.current.rotation.x += delta * 0.01;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

const calculateSpherePosition = (index: number, total: number, radius = 4.3): [number, number, number] => {
  const phi = Math.acos(1 - (2 * (index + 0.5)) / total);
  const theta = Math.PI * (1 + Math.sqrt(5)) * index;

  return [
    radius * Math.cos(theta) * Math.sin(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(phi)
  ];
};

export function Graph3D({ graphData, selectedUserId, onSelectUser }: Graph3DProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const positions = useMemo(
    () =>
      new Map(graphData.nodes.map((node, idx) => [node.id, calculateSpherePosition(idx, Math.max(graphData.nodes.length, 1))])),
    [graphData.nodes]
  );

  const connectedUsers = useMemo(() => {
    if (!selectedUserId) return new Set<string>();

    const set = new Set<string>([selectedUserId]);
    graphData.edges.forEach((edge) => {
      if (edge.source === selectedUserId) set.add(edge.target);
      if (edge.target === selectedUserId) set.add(edge.source);
    });
    return set;
  }, [graphData.edges, selectedUserId]);

  return (
    <div className="relative h-[540px] w-full overflow-hidden rounded-2xl border border-neonBlue/30 bg-gradient-to-br from-[#02040c] via-[#030b1c] to-[#060917] shadow-glowBlue">
      {tooltip ? (
        <div
          className="pointer-events-none absolute z-20 rounded-lg border border-neonBlue/50 bg-slate-950/90 px-3 py-2 text-xs text-slate-100 shadow-glowBlue"
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
        >
          <p className="font-semibold text-neonBlue">{tooltip.id}</p>
          <p className="text-slate-300">Risk: {tooltip.riskScore.toFixed(1)}%</p>
        </div>
      ) : null}

      <Canvas camera={{ position: [0, 0, 11], fov: 52 }}>
        <color attach="background" args={["#010409"]} />
        <ambientLight intensity={0.45} />
        <pointLight position={[7, 7, 7]} intensity={1.2} color="#3aa6ff" />
        <pointLight position={[-6, -4, -2]} intensity={0.8} color="#ff4d6d" />
        <Stars radius={45} depth={45} count={1200} factor={3.5} saturation={0.25} fade speed={0.45} />

        <RotatingGroup>
          {graphData.edges.map((edge) => {
            const source = positions.get(edge.source);
            const target = positions.get(edge.target);
            if (!source || !target) return null;

            const active =
              !!selectedUserId &&
              (edge.source === selectedUserId || edge.target === selectedUserId || connectedUsers.has(edge.source));

            return <Graph3DEdge key={edge.id} points={[source, target]} amount={edge.amount} active={active} />;
          })}

          {graphData.nodes.map((node) => {
            const position = positions.get(node.id);
            if (!position) return null;

            return (
              <Graph3DNode
                key={node.id}
                id={node.id}
                position={position}
                riskScore={node.riskScore}
                selected={selectedUserId === node.id}
                connected={connectedUsers.has(node.id)}
                onHover={setTooltip}
                onSelect={onSelectUser}
              />
            );
          })}
        </RotatingGroup>

        <OrbitControls enablePan={false} minDistance={6} maxDistance={18} enableDamping dampingFactor={0.08} />
      </Canvas>
    </div>
  );
}
