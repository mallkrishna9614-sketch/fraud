"use client";

import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { Mesh } from "three";

type Graph3DNodeProps = {
  id: string;
  position: [number, number, number];
  riskScore: number;
  selected: boolean;
  connected: boolean;
  onHover: (payload: { id: string; riskScore: number; x: number; y: number } | null) => void;
  onSelect: (id: string) => void;
};

export function Graph3DNode({
  id,
  position,
  riskScore,
  selected,
  connected,
  onHover,
  onSelect
}: Graph3DNodeProps) {
  const meshRef = useRef<Mesh>(null);
  const fraud = riskScore >= 65;
  const amplitude = useMemo(() => Math.random() * 0.12 + 0.04, []);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock, pointer, size }) => {
    if (!meshRef.current) return;

    const t = clock.getElapsedTime();
    const floatY = Math.sin(t * 1.4 + offset) * amplitude;
    const pulse = fraud ? 1 + Math.sin(t * 3 + offset) * 0.14 : 1;

    meshRef.current.position.set(position[0], position[1] + floatY, position[2]);
    meshRef.current.scale.setScalar((selected ? 1.45 : connected ? 1.2 : 1) * pulse);

    const distance = Math.hypot(pointer.x - meshRef.current.position.x / 8, pointer.y - meshRef.current.position.y / 8);
    if (distance < 0.08) {
      onHover({
        id,
        riskScore,
        x: ((pointer.x + 1) / 2) * size.width,
        y: ((-pointer.y + 1) / 2) * size.height
      });
    }
  });

  return (
    <Sphere
      ref={meshRef}
      args={[0.14, 24, 24]}
      position={position}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover({ id, riskScore, x: event.pointer.x, y: event.pointer.y });
      }}
      onPointerMove={(event) => {
        event.stopPropagation();
        onHover({
          id,
          riskScore,
          x: event.clientX,
          y: event.clientY
        });
      }}
      onPointerOut={() => onHover(null)}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(id);
      }}
    >
      <meshStandardMaterial
        color={fraud ? "#ff4d6d" : "#3aa6ff"}
        emissive={fraud ? "#ff4d6d" : "#2b7bff"}
        emissiveIntensity={selected ? 2 : fraud ? 1.4 : 0.9}
        roughness={0.25}
        metalness={0.45}
      />
    </Sphere>
  );
}
