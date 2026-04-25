"use client";

import { Line } from "@react-three/drei";

type Graph3DEdgeProps = {
  points: [[number, number, number], [number, number, number]];
  amount: number;
  active: boolean;
};

export function Graph3DEdge({ points, amount, active }: Graph3DEdgeProps) {
  const brightness = Math.min(1, amount / 10000);
  const edgeColor = active ? "#e2e8f0" : brightness > 0.7 ? "#7cc4ff" : "#3aa6ff";

  return (
    <Line
      points={points}
      color={edgeColor}
      lineWidth={active ? 1.6 : 0.8 + brightness}
      transparent
      opacity={active ? 0.95 : 0.3 + brightness * 0.4}
    />
  );
}
