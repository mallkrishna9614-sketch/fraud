"use client";

import { Line } from "@react-three/drei";

type Graph3DEdgeProps = {
  points: [[number, number, number], [number, number, number]];
  amount: number;
  active: boolean;
};

export function Graph3DEdge({ points, amount, active }: Graph3DEdgeProps) {
  const brightness = Math.min(1, amount / 10000);

  return (
    <Line
      points={points}
      color={active ? "#e2e8f0" : `rgba(58, 166, 255, ${0.35 + brightness * 0.5})`}
      lineWidth={active ? 1.6 : 0.8 + brightness}
      transparent
      opacity={active ? 0.95 : 0.3 + brightness * 0.4}
    />
  );
}
