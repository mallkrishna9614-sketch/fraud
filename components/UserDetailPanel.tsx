"use client";

import { FraudUser } from "@/lib/types";

type UserDetailPanelProps = {
  user?: FraudUser;
};

export function UserDetailPanel({ user }: UserDetailPanelProps) {
  if (!user) {
    return (
      <aside className="rounded-2xl border border-slate-700 bg-panel p-4 text-slate-400">
        Select a user in the graph to inspect risk and explainable AI reasons.
      </aside>
    );
  }

  return (
    <aside className="rounded-2xl border border-neonBlue/25 bg-panel p-4 shadow-glowBlue">
      <h3 className="text-lg font-semibold text-slate-100">User: {user.id}</h3>
      <p className="mt-2 text-sm text-slate-400">Risk Score</p>
      <div className="mt-1 h-2 rounded-full bg-slate-800">
        <div
          className={`h-2 rounded-full ${user.riskScore > 65 ? "bg-neonRed" : "bg-neonBlue"}`}
          style={{ width: `${user.riskScore}%` }}
        />
      </div>
      <p className="mt-1 text-sm text-slate-200">{user.riskScore}%</p>

      <ul className="mt-4 space-y-2 text-sm text-slate-200">
        <li>Total transactions: {user.totalTransactions}</li>
        <li>Total amount: ₹{user.totalAmount.toLocaleString()}</li>
        <li>Connected users: {user.connectedUsers.length}</li>
      </ul>

      <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/60 p-3">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Explainable AI</p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-200">
          {user.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
