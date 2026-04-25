"use client";

import { Transaction } from "@/lib/types";

type LiveFeedProps = {
  transactions: Transaction[];
};

export function LiveFeed({ transactions }: LiveFeedProps) {
  return (
    <div className="max-h-[260px] overflow-auto rounded-2xl border border-slate-700 bg-panel p-4">
      <h3 className="text-sm uppercase tracking-[0.2em] text-slate-400">Live Activity</h3>
      <div className="mt-3 space-y-2">
        {transactions.slice(0, 18).map((tx) => (
          <p key={tx.id} className="rounded-lg bg-slate-900/70 px-3 py-2 text-sm text-slate-200">
            {tx.sender} → ₹{tx.amount.toLocaleString()} →
            <span className={tx.status === "Fraud" ? "text-neonRed" : "text-neonBlue"}> {tx.status}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
