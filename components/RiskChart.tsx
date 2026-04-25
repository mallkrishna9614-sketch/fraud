"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FraudUser } from "@/lib/types";

type RiskChartProps = {
  fraudUsers: FraudUser[];
};

export function RiskChart({ fraudUsers }: RiskChartProps) {
  const data = fraudUsers.slice(0, 10).map((user) => ({
    user: user.id,
    riskScore: user.riskScore
  }));

  return (
    <div className="h-[260px] rounded-2xl border border-slate-700 bg-panel p-4">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">Top Risk Users</p>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
          <XAxis dataKey="user" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            cursor={{ fill: "rgba(58, 166, 255, 0.09)" }}
            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }}
          />
          <Bar dataKey="riskScore" fill="#3aa6ff" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
